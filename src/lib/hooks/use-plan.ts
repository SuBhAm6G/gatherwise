'use client'

import { useState, useCallback, useRef } from 'react'
import {
  EventPlan,
  PlanTask,
  VendorCategory,
  EventIdea,
  ChangeImpactReport,
} from '@/lib/domain/types'
import { adjustCategoryAllocation, updateActualSpend } from '@/lib/engines/budget'
import { refreshTaskStatuses } from '@/lib/engines/timeline'
import { updateVendorStatus, updateVendorQuote } from '@/lib/engines/vendors'
import {
  analyzeBudgetChange,
  analyzeGuestCountChange,
  analyzeEventDateChange,
} from '@/lib/engines/change-impact'
import { persistPlan } from '@/lib/storage/plan-store'
import { AUTO_SAVE_DEBOUNCE_MS } from '@/lib/domain/constants'
import { v4 as uuidv4 } from 'uuid'

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

type NewTaskInput = Pick<
  PlanTask,
  'title' | 'description' | 'category' | 'dueDate' | 'priority' | 'deadlineReason'
>

function createUserTask(input: NewTaskInput): PlanTask {
  return {
    ...input,
    id: uuidv4(),
    dueDaysBeforeEvent: null,
    status: 'pending',
    completedAt: null,
    dependsOn: [],
    relatedVendorCategory: null,
    origin: 'user',
    isOverdue: false,
    isDependencyBlocked: false,
    notes: '',
  }
}

/**
 * Main reactive plan management hook.
 * Handles debounced persistence, optimistic mutations, and change-impact tracking.
 */
export function usePlan(initialPlan: EventPlan | null) {
  const [plan, setPlan] = useState<EventPlan | null>(initialPlan)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleSave = useCallback((updatedPlan: EventPlan) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaveStatus('unsaved')
    saveTimer.current = setTimeout(async () => {
      setSaveStatus('saving')
      const { success } = await persistPlan(updatedPlan)
      setSaveStatus(success ? 'saved' : 'error')
    }, AUTO_SAVE_DEBOUNCE_MS)
  }, [])

  const updatePlan = useCallback(
    (updater: (prev: EventPlan) => EventPlan) => {
      setPlan((prev) => {
        if (!prev) return prev
        const updated = updater(prev)
        scheduleSave(updated)
        return updated
      })
    },
    [scheduleSave],
  )

  const adjustBudgetCategory = useCallback(
    (id: string, pct: number) => {
      updatePlan((p) => ({ ...p, budget: adjustCategoryAllocation(p.budget, p.brief, id, pct) }))
    },
    [updatePlan],
  )

  const updateActualCategorySpend = useCallback(
    (id: string, spend: number) => {
      updatePlan((p) => ({ ...p, budget: updateActualSpend(p.budget, p.brief, id, spend) }))
    },
    [updatePlan],
  )

  const completeTask = useCallback(
    (id: string) => {
      updatePlan((p) => {
        const tasks = p.tasks.map((t) =>
          t.id === id
            ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
            : t,
        )
        return { ...p, tasks: refreshTaskStatuses(tasks) }
      })
    },
    [updatePlan],
  )

  const updateTaskStatus = useCallback(
    (id: string, status: PlanTask['status']) => {
      updatePlan((p) => {
        const tasks = p.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                completedAt: status === 'completed' ? new Date().toISOString() : null,
              }
            : t,
        )
        return { ...p, tasks: refreshTaskStatuses(tasks) }
      })
    },
    [updatePlan],
  )

  const updateTaskNotes = useCallback(
    (id: string, notes: string) => {
      updatePlan((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, notes } : t)) }))
    },
    [updatePlan],
  )

  const addTask = useCallback(
    (input: NewTaskInput) => {
      updatePlan((p) => ({
        ...p,
        tasks: refreshTaskStatuses([...p.tasks, createUserTask(input)]),
      }))
    },
    [updatePlan],
  )

  const deleteTask = useCallback(
    (id: string) => {
      updatePlan((p) => ({ ...p, tasks: refreshTaskStatuses(p.tasks.filter((t) => t.id !== id)) }))
    },
    [updatePlan],
  )

  const setVendorStatus = useCallback(
    (id: string, status: VendorCategory['status']) => {
      updatePlan((p) => ({ ...p, vendors: updateVendorStatus(p.vendors, id, status) }))
    },
    [updatePlan],
  )

  const setVendorQuote = useCallback(
    (id: string, quote: number | null) => {
      updatePlan((p) => ({ ...p, vendors: updateVendorQuote(p.vendors, id, quote) }))
    },
    [updatePlan],
  )

  const updateVendorNotes = useCallback(
    (id: string, notes: string) => {
      updatePlan((p) => ({
        ...p,
        vendors: p.vendors.map((v) => (v.id === id ? { ...v, notes } : v)),
      }))
    },
    [updatePlan],
  )

  const toggleSaveIdea = useCallback(
    (idea: EventIdea) => {
      updatePlan((p) => {
        const exists = p.ideas.some((i) => i.id === idea.id)
        const updatedIdeas = exists
          ? p.ideas.map((i) => (i.id === idea.id ? { ...i, isSaved: !i.isSaved } : i))
          : [...p.ideas, { ...idea, isSaved: true }]
        return { ...p, ideas: updatedIdeas }
      })
    },
    [updatePlan],
  )

  const applyChange = useCallback(
    (
      analyzer: (prev: EventPlan) => {
        report: ChangeImpactReport
        updatedPlan: Partial<EventPlan>
      },
    ) => {
      updatePlan((prev) => {
        const { report, updatedPlan } = analyzer(prev)
        return {
          ...prev,
          ...updatedPlan,
          changeHistory: [...prev.changeHistory.slice(-19), report],
        }
      })
    },
    [updatePlan],
  )

  const changeBudget = useCallback(
    (amt: number) => applyChange((p) => analyzeBudgetChange(p, amt)),
    [applyChange],
  )
  const changeGuestCount = useCallback(
    (cnt: number) => applyChange((p) => analyzeGuestCountChange(p, cnt)),
    [applyChange],
  )
  const changeEventDate = useCallback(
    (dt: string | null) => applyChange((p) => analyzeEventDateChange(p, dt)),
    [applyChange],
  )

  return {
    plan,
    setPlan,
    saveStatus,
    adjustBudgetCategory,
    updateActualCategorySpend,
    completeTask,
    updateTaskStatus,
    updateTaskNotes,
    addTask,
    deleteTask,
    setVendorStatus,
    setVendorQuote,
    updateVendorNotes,
    toggleSaveIdea,
    changeBudget,
    changeGuestCount,
    changeEventDate,
  }
}
