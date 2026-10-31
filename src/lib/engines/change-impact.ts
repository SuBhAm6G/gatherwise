import { EventPlan, ChangeImpactReport, ChangeImpactItem } from '@/lib/domain/types'
import { recalculateBudget } from './budget'
import { rescheduleTasks } from './timeline'

export function analyzeBudgetChange(
  plan: EventPlan,
  newBudgetAmount: number,
): { report: ChangeImpactReport; updatedPlan: Partial<EventPlan> } {
  const oldBudget = plan.budget.totalBudget
  const newBrief = { ...plan.brief, budgetAmount: newBudgetAmount }
  const newBudget = recalculateBudget(newBrief, plan.budget.categories, plan.budget.contingencyPercent)

  const affectedCategories: ChangeImpactItem[] = newBudget.categories
    .filter((cat) => {
      const old = plan.budget.categories.find((c) => c.id === cat.id)
      return old && Math.abs(old.allocatedAmount - cat.allocatedAmount) > 0
    })
    .map((cat) => ({
      area: 'budget' as const,
      description: `${cat.name}: allocation adjusted`,
      severity: newBudget.isOverBudget ? ('critical' as const) : ('info' as const),
      affectedIds: [cat.id],
      previousValue: String(plan.budget.categories.find((c) => c.id === cat.id)?.allocatedAmount ?? 0),
      newValue: String(cat.allocatedAmount),
    }))

  const items: ChangeImpactItem[] = [
    ...affectedCategories,
    ...(newBudget.isOverBudget
      ? [
          {
            area: 'budget' as const,
            description: `Budget is now over by ${newBudget.overBudgetAmount} minor units`,
            severity: 'critical' as const,
            affectedIds: [] as string[],
            previousValue: plan.budget.isOverBudget ? 'over-budget' : 'within-budget',
            newValue: 'over-budget',
          },
        ]
      : []),
  ]

  const direction = newBudgetAmount > oldBudget ? 'increased' : 'decreased'

  return {
    report: {
      changeType: 'budget-change',
      changedAt: new Date().toISOString(),
      summary: `Budget ${direction} from ${oldBudget} to ${newBudgetAmount}`,
      whatChanged: `Total budget ${direction}`,
      whatWasRecalculated: ['All budget category allocations', 'Remaining budget', 'Over-budget status'],
      affectedItems: items,
      suggestedNextActions: newBudget.isOverBudget
        ? ['Review and reduce allocations in non-essential categories', 'Consider removing optional vendor services']
        : ['Review new allocations to ensure they match your priorities'],
      hasAIRecommendation: newBudget.isOverBudget,
    },
    updatedPlan: { brief: newBrief, budget: newBudget },
  }
}

export function analyzeGuestCountChange(
  plan: EventPlan,
  newGuestCount: number,
): { report: ChangeImpactReport; updatedPlan: Partial<EventPlan> } {
  const oldCount = plan.brief.guestCount
  const newBrief = { ...plan.brief, guestCount: newGuestCount }
  const newBudget = recalculateBudget(newBrief, plan.budget.categories, plan.budget.contingencyPercent)

  const affectedItems: ChangeImpactItem[] = newBudget.categories
    .filter((c) => c.isPerGuest)
    .map((cat) => ({
      area: 'budget' as const,
      description: `${cat.name} (per-guest): re-evaluated for ${newGuestCount} guests`,
      severity: newBudget.isOverBudget ? ('warning' as const) : ('info' as const),
      affectedIds: [cat.id],
      previousValue: `${oldCount} guests`,
      newValue: `${newGuestCount} guests`,
    }))

  return {
    report: {
      changeType: 'guest-count-change',
      changedAt: new Date().toISOString(),
      summary: `Guest count changed from ${oldCount} to ${newGuestCount}`,
      whatChanged: `Guest count ${newGuestCount > oldCount ? 'increased' : 'decreased'}`,
      whatWasRecalculated: ['Per-guest category allocations', 'Total estimated spend', 'Over-budget status'],
      affectedItems,
      suggestedNextActions: [
        'Notify caterer of updated headcount',
        'Verify venue capacity accommodates the new count',
        ...(newBudget.isOverBudget ? ['Budget is now over — review spending categories'] : []),
      ],
      hasAIRecommendation: newGuestCount > oldCount && newBudget.isOverBudget,
    },
    updatedPlan: { brief: newBrief, budget: newBudget },
  }
}

export function analyzeEventDateChange(
  plan: EventPlan,
  newDate: string | null,
): { report: ChangeImpactReport; updatedPlan: Partial<EventPlan> } {
  const oldDate = plan.brief.eventDate
  const newBrief = { ...plan.brief, eventDate: newDate }
  const rescheduled = rescheduleTasks(plan.tasks, newDate)

  const nowOverdue = rescheduled.filter(
    (t) => t.isOverdue && !plan.tasks.find((ot) => ot.id === t.id && ot.isOverdue),
  )

  const affectedItems: ChangeImpactItem[] = nowOverdue.map((t) => ({
    area: 'timeline' as const,
    description: `"${t.title}" is now overdue`,
    severity: 'critical' as const,
    affectedIds: [t.id],
    previousValue: 'on-track',
    newValue: 'overdue',
  }))

  return {
    report: {
      changeType: 'event-date-change',
      changedAt: new Date().toISOString(),
      summary: `Event date changed from ${oldDate ?? 'unscheduled'} to ${newDate ?? 'unscheduled'}`,
      whatChanged: `Event date ${newDate ? `moved to ${newDate}` : 'removed'}`,
      whatWasRecalculated: ['All task due dates', 'Overdue status for each task'],
      affectedItems,
      suggestedNextActions: [
        ...(nowOverdue.length > 0 ? [`${nowOverdue.length} task(s) are now overdue — act immediately`] : []),
        'Review all vendor booking deadlines for the new date',
        'Confirm all booked vendors can accommodate the new date',
      ],
      hasAIRecommendation: nowOverdue.length > 3,
    },
    updatedPlan: { brief: newBrief, tasks: rescheduled },
  }
}
