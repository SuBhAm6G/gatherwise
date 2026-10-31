'use client'

import { useState, useCallback, useRef } from 'react'
import { EventPlan, PlanTask, VendorCategory, EventIdea, ChangeImpactReport } from '@/lib/domain/types'
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
    (categoryId: string, newPercent: number) => {
      updatePlan((prev) => ({
        ...prev,
        budget: adjustCategoryAllocation(prev.budget, prev.brief, categoryId, newPercent),
      }))
    },
    [updatePlan],
  )

  const updateActualCategorySpend = useCallback(
    (categoryId: string, actualSpend: number) => {
      updatePlan((prev) => ({
        ...prev,
        budget: updateActualSpend(prev.budget, prev.brief, categoryId, actualSpend),
      }))
    },
    [updatePlan],
  )

  const completeTask = useCallback(
    (taskId: string) => {
      updatePlan((prev) => {
        const tasks = prev.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
            : t,
        )
        return { ...prev, tasks: refreshTaskStatuses(tasks) }
      })
    },
    [updatePlan],
  )

  const updateTaskStatus = useCallback(
    (taskId: string, status: PlanTask['status']) => {
      updatePlan((prev) => {
        const tasks = prev.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : null }
            : t,
        )
        return { ...prev, tasks: refreshTaskStatuses(tasks) }
      })
    },
    [updatePlan],
  )

  const updateTaskNotes = useCallback(
    (taskId: string, notes: string) => {
      updatePlan((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, notes } : t)),
      }))
    },
    [updatePlan],
  )

  const addTask = useCallback(
    (newTaskData: {
      title: string
      description: string
      category: PlanTask['category']
      dueDate: string | null
      priority: PlanTask['priority']
      deadlineReason: string
    }) => {
      updatePlan((prev) => {
        const newTask: PlanTask = {
          id: uuidv4(),
          title: newTaskData.title,
          description: newTaskData.description,
          category: newTaskData.category,
          dueDate: newTaskData.dueDate,
          dueDaysBeforeEvent: null,
          priority: newTaskData.priority,
          status: 'pending',
          completedAt: null,
          dependsOn: [],
          relatedVendorCategory: null,
          deadlineReason: newTaskData.deadlineReason,
          origin: 'user',
          isOverdue: false,
          isDependencyBlocked: false,
          notes: '',
        }
        return { ...prev, tasks: refreshTaskStatuses([...prev.tasks, newTask]) }
      })
    },
    [updatePlan],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      updatePlan((prev) => ({
        ...prev,
        tasks: refreshTaskStatuses(prev.tasks.filter((t) => t.id !== taskId)),
      }))
    },
    [updatePlan],
  )

  const setVendorStatus = useCallback(
    (vendorId: string, status: VendorCategory['status']) => {
      updatePlan((prev) => ({
        ...prev,
        vendors: updateVendorStatus(prev.vendors, vendorId, status),
      }))
    },
    [updatePlan],
  )

  const setVendorQuote = useCallback(
    (vendorId: string, quote: number | null) => {
      updatePlan((prev) => ({
        ...prev,
        vendors: updateVendorQuote(prev.vendors, vendorId, quote),
      }))
    },
    [updatePlan],
  )

  const updateVendorNotes = useCallback(
    (vendorId: string, notes: string) => {
      updatePlan((prev) => ({
        ...prev,
        vendors: prev.vendors.map((v) => (v.id === vendorId ? { ...v, notes } : v)),
      }))
    },
    [updatePlan],
  )

  const toggleSaveIdea = useCallback(
    (ideaToToggle: EventIdea) => {
      updatePlan((prev) => {
        const exists = prev.ideas.some((i) => i.id === ideaToToggle.id)
        const updatedIdeas = exists
          ? prev.ideas.map((i) => (i.id === ideaToToggle.id ? { ...i, isSaved: !i.isSaved } : i))
          : [...prev.ideas, { ...ideaToToggle, isSaved: true }]
        return { ...prev, ideas: updatedIdeas }
      })
    },
    [updatePlan],
  )

  const applyChange = useCallback(
    (
      analyzer: (
        prev: EventPlan,
      ) => { report: ChangeImpactReport; updatedPlan: Partial<EventPlan> },
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
    (amount: number) => applyChange((p) => analyzeBudgetChange(p, amount)),
    [applyChange],
  )

  const changeGuestCount = useCallback(
    (count: number) => applyChange((p) => analyzeGuestCountChange(p, count)),
    [applyChange],
  )

  const changeEventDate = useCallback(
    (date: string | null) => applyChange((p) => analyzeEventDateChange(p, date)),
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
