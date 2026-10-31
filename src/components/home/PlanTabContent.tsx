'use client'

import { EventPlan, EventIdea, TaskStatus, VendorStatus } from '@/lib/domain/types'
import { OverviewDashboard } from '@/components/overview/OverviewDashboard'
import { BudgetEditor } from '@/components/budget/BudgetEditor'
import { TimelineManager } from '@/components/timeline/TimelineManager'
import { VendorTracker } from '@/components/vendors/VendorTracker'
import { IdeasPanel } from '@/components/ideas/IdeasPanel'
import { AssistantPanel } from '@/components/assistant/AssistantPanel'

interface PlanTabContentProps {
  currentTab: string
  plan: EventPlan
  onNavigateTab: (tab: string) => void
  onCompleteTask: (taskId: string) => void
  onAdjustBudgetCategory: (categoryKey: string, allocatedAmount: number) => void
  onUpdateActualCategorySpend: (categoryKey: string, actualSpend: number) => void
  onChangeTotalBudget: (newBudget: number) => void
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void
  onUpdateTaskNotes: (taskId: string, notes: string) => void
  onAddTask: (
    task: Parameters<React.ComponentProps<typeof TimelineManager>['onAddTask']>[0],
  ) => void
  onDeleteTask: (taskId: string) => void
  onSetVendorStatus: (vendorId: string, status: VendorStatus) => void
  onSetVendorQuote: (vendorId: string, quote: number | null) => void
  onUpdateVendorNotes: (vendorId: string, notes: string) => void
  onToggleSaveIdea: (idea: EventIdea) => void
}

export function PlanTabContent({
  currentTab,
  plan,
  onNavigateTab,
  onCompleteTask,
  onAdjustBudgetCategory,
  onUpdateActualCategorySpend,
  onChangeTotalBudget,
  onUpdateTaskStatus,
  onUpdateTaskNotes,
  onAddTask,
  onDeleteTask,
  onSetVendorStatus,
  onSetVendorQuote,
  onUpdateVendorNotes,
  onToggleSaveIdea,
}: PlanTabContentProps) {
  return (
    <div>
      {currentTab === 'overview' && (
        <OverviewDashboard
          plan={plan}
          onNavigateTab={onNavigateTab}
          onCompleteTask={onCompleteTask}
        />
      )}

      {currentTab === 'budget' && (
        <BudgetEditor
          brief={plan.brief}
          budget={plan.budget}
          onAdjustCategory={onAdjustBudgetCategory}
          onUpdateActualSpend={onUpdateActualCategorySpend}
          onChangeTotalBudget={onChangeTotalBudget}
        />
      )}

      {currentTab === 'timeline' && (
        <TimelineManager
          tasks={plan.tasks}
          onCompleteTask={onCompleteTask}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onUpdateTaskNotes={onUpdateTaskNotes}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
        />
      )}

      {currentTab === 'vendors' && (
        <VendorTracker
          vendors={plan.vendors}
          currencyCode={plan.brief.currencyCode}
          currencyPrecision={plan.brief.currencyMinorUnits}
          onUpdateVendorStatus={onSetVendorStatus}
          onUpdateVendorQuote={onSetVendorQuote}
          onUpdateVendorNotes={onUpdateVendorNotes}
        />
      )}

      {currentTab === 'ideas' && (
        <IdeasPanel
          brief={plan.brief}
          budget={plan.budget}
          savedIdeas={plan.ideas}
          onToggleSaveIdea={onToggleSaveIdea}
        />
      )}

      {currentTab === 'assistant' && <AssistantPanel plan={plan} />}
    </div>
  )
}
