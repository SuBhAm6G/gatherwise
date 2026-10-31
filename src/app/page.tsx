'use client'

import React, { useState, useEffect } from 'react'
import { EventPlan, EventBrief, ChangeImpactReport } from '@/lib/domain/types'
import { usePlan } from '@/lib/hooks/use-plan'
import { Header } from '@/components/ui/Header'
import { EventWizard } from '@/components/wizard/EventWizard'
import { ChangeImpactModal } from '@/components/impact/ChangeImpactModal'
import { LandingHero } from '@/components/home/LandingHero'
import { SavedPlansDrawer } from '@/components/home/SavedPlansDrawer'
import { PlanTabContent } from '@/components/home/PlanTabContent'
import { createPlanFromBrief, createDemoPlan, retrieveAllPlans, removePlan } from '@/lib/storage/plan-store'

export default function HomePage() {
  const [plansList, setPlansList] = useState<EventPlan[]>([])
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('overview')
  const [activeImpactReport, setActiveImpactReport] = useState<ChangeImpactReport | null>(null)

  const {
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
  } = usePlan(null)

  useEffect(() => {
    async function load() {
      const saved = await retrieveAllPlans()
      setPlansList(saved)
    }
    load()
  }, [plan])

  const lastReportCount = React.useRef(0)
  useEffect(() => {
    if (plan && plan.changeHistory.length > lastReportCount.current) {
      const latest = plan.changeHistory[plan.changeHistory.length - 1]
      lastReportCount.current = plan.changeHistory.length
      if (latest) {
        const timer = setTimeout(() => {
          setActiveImpactReport(latest)
        }, 0)
        return () => clearTimeout(timer)
      }
    }
  }, [plan])

  const handlePlanCreated = (brief: EventBrief) => {
    const newPlan = createPlanFromBrief(brief)
    setPlan(newPlan)
    setIsCreatingNew(false)
    setCurrentTab('overview')
  }

  const handleLoadDemo = () => {
    const demo = createDemoPlan()
    setPlan(demo)
    setIsCreatingNew(false)
    setCurrentTab('overview')
  }

  const handleSelectPlan = (selected: EventPlan) => {
    setPlan(selected)
    setCurrentTab('overview')
  }

  const handleDeletePlan = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this event plan?')) {
      await removePlan(id)
      setPlansList((prev) => prev.filter((p) => p.id !== id))
      if (plan?.id === id) {
        setPlan(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        eventName={plan ? plan.brief.eventName : undefined}
        isDemoData={plan?.isDemoData}
        saveStatus={saveStatus}
        onBackToPlans={plan ? () => setPlan(null) : undefined}
        onNewPlan={() => {
          setIsCreatingNew(true)
          setPlan(null)
        }}
      />

      <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: CREATING NEW PLAN VIA WIZARD */}
        {isCreatingNew && (
          <EventWizard
            onPlanCreated={handlePlanCreated}
            onCancel={() => setIsCreatingNew(false)}
          />
        )}

        {/* VIEW 2: ACTIVE PLAN TABS */}
        {!isCreatingNew && plan && (
          <PlanTabContent
            currentTab={currentTab}
            plan={plan}
            onNavigateTab={setCurrentTab}
            onCompleteTask={completeTask}
            onAdjustBudgetCategory={adjustBudgetCategory}
            onUpdateActualCategorySpend={updateActualCategorySpend}
            onChangeTotalBudget={changeBudget}
            onUpdateTaskStatus={updateTaskStatus}
            onUpdateTaskNotes={updateTaskNotes}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onSetVendorStatus={setVendorStatus}
            onSetVendorQuote={setVendorQuote}
            onUpdateVendorNotes={updateVendorNotes}
            onToggleSaveIdea={toggleSaveIdea}
          />
        )}

        {/* VIEW 3: LANDING / PLAN SELECTOR (When no active plan) */}
        {!isCreatingNew && !plan && (
          <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
            <LandingHero
              onStartNewPlan={() => setIsCreatingNew(true)}
              onLoadDemoPlan={handleLoadDemo}
            />

            <SavedPlansDrawer
              plans={plansList}
              onSelectPlan={handleSelectPlan}
              onDeletePlan={handleDeletePlan}
            />
          </div>
        )}
      </main>

      <ChangeImpactModal
        report={activeImpactReport}
        onClose={() => setActiveImpactReport(null)}
      />
    </div>
  )
}
