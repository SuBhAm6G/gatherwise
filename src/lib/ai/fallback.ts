import { EventPlan } from '@/lib/domain/types'
import { getOverdueTasks, getUpcomingTasks, daysUntilEvent } from '@/lib/engines/timeline'
import { formatCurrency } from '@/lib/engines/budget'
import { FALLBACK_IDEAS, FallbackIdea } from '@/lib/ai/fallback-data'

export type { FallbackIdea }

export interface FallbackResponse {
  answer: string
  evidence: string[]
  suggestedActions: string[]
  isOfflineFallback: true
}

/**
 * Provides deterministic planning assistance when AI is unavailable.
 * Does NOT simulate AI — explicitly labeled as local planning assistance.
 */
export function getOfflineFallbackResponse(plan: EventPlan, question: string): FallbackResponse {
  const { brief, budget, tasks, vendors } = plan
  const overdue = getOverdueTasks(tasks)
  const upcoming = getUpcomingTasks(tasks, 7)
  const daysLeft = brief.eventDate ? daysUntilEvent(brief.eventDate) : null
  const budgetStr = formatCurrency(budget.totalBudget, brief.currencyCode, brief.currencyMinorUnits)
  const remainingStr = formatCurrency(
    budget.remaining,
    brief.currencyCode,
    brief.currencyMinorUnits,
  )

  const lowerQ = question.toLowerCase()

  // Overdue / urgent tasks question
  if (
    lowerQ.includes('urgent') ||
    lowerQ.includes('overdue') ||
    lowerQ.includes('priority') ||
    lowerQ.includes('attention') ||
    lowerQ.includes('next') ||
    lowerQ.includes('task')
  ) {
    const answer =
      overdue.length > 0
        ? `You have ${overdue.length} overdue task(s) that need immediate attention: ${overdue
            .slice(0, 3)
            .map((t) => `"${t.title}"`)
            .join(', ')}${overdue.length > 3 ? ` and ${overdue.length - 3} more` : ''}. ${
            upcoming.length > 0
              ? `Additionally, ${upcoming.length} task(s) are due in the next 7 days.`
              : ''
          }`
        : upcoming.length > 0
          ? `No overdue tasks — great! You have ${upcoming.length} task(s) coming up in the next 7 days: ${upcoming
              .slice(0, 3)
              .map((t) => `"${t.title}" (due ${t.dueDate})`)
              .join(', ')}.`
          : 'No overdue or upcoming tasks in the next 7 days. Check your full timeline for further planning milestones.'

    return {
      answer,
      evidence: overdue
        .slice(0, 3)
        .map((t) => `Overdue: ${t.title} (due ${t.dueDate ?? 'unknown'})`),
      suggestedActions:
        overdue.length > 0
          ? ['Review and action the overdue tasks above', 'Mark tasks complete as you finish them']
          : ['Continue with upcoming tasks'],
      isOfflineFallback: true,
    }
  }

  // Budget question
  if (
    lowerQ.includes('budget') ||
    lowerQ.includes('cost') ||
    lowerQ.includes('money') ||
    lowerQ.includes('spend')
  ) {
    const overrunNote = budget.isOverBudget
      ? ` Warning: you are currently over budget by ${formatCurrency(budget.overBudgetAmount, brief.currencyCode, brief.currencyMinorUnits)}.`
      : ''
    return {
      answer: `Your total budget is ${budgetStr}. Remaining: ${remainingStr}.${overrunNote} The largest allocations are: ${budget.categories
        .filter((c) => !c.isContingency)
        .sort((a, b) => b.allocatedAmount - a.allocatedAmount)
        .slice(0, 3)
        .map(
          (c) =>
            `${c.name} (${formatCurrency(c.allocatedAmount, brief.currencyCode, brief.currencyMinorUnits)})`,
        )
        .join(', ')}.`,
      evidence: [
        `Total budget: ${budgetStr}`,
        `Remaining: ${remainingStr}`,
        budget.isOverBudget
          ? `Over budget by: ${formatCurrency(budget.overBudgetAmount, brief.currencyCode, brief.currencyMinorUnits)}`
          : 'Within budget',
      ],
      suggestedActions: budget.isOverBudget
        ? [
            'Review non-essential budget categories',
            'Consider reducing optional vendor allocations',
          ]
        : ['Continue tracking actual spend in each category'],
      isOfflineFallback: true,
    }
  }

  // Vendor question
  if (lowerQ.includes('vendor') || lowerQ.includes('book') || lowerQ.includes('supplier')) {
    const essential = vendors.filter((v) => v.essentiality === 'essential')
    const unstarted = essential.filter((v) => v.status === 'not-started')
    const booked = vendors.filter((v) => v.status === 'booked')

    return {
      answer: `You have ${booked.length} vendor(s) booked and ${unstarted.length} essential vendor(s) not yet started${
        unstarted.length > 0 ? `: ${unstarted.map((v) => v.name).join(', ')}` : ''
      }. Book essential vendors first as they tend to have the longest lead times.`,
      evidence: [
        `Booked vendors: ${booked.map((v) => v.name).join(', ') || 'none'}`,
        `Essential vendors not started: ${unstarted.map((v) => v.name).join(', ') || 'none'}`,
      ],
      suggestedActions:
        unstarted.length > 0
          ? [
              'Start researching essential vendors',
              "Use the Vendors tab to track each vendor's status",
            ]
          : ['Update vendor status as you progress'],
      isOfflineFallback: true,
    }
  }

  // Countdown / date question
  if (
    lowerQ.includes('date') ||
    lowerQ.includes('when') ||
    lowerQ.includes('day') ||
    lowerQ.includes('time')
  ) {
    const countdown =
      daysLeft !== null
        ? daysLeft > 0
          ? `Your event is ${daysLeft} day(s) away.`
          : daysLeft === 0
            ? 'Your event is today!'
            : `Your event date was ${Math.abs(daysLeft)} day(s) ago.`
        : 'Your event date has not been set yet.'

    return {
      answer: `${countdown} ${
        daysLeft !== null && daysLeft < 30 && daysLeft > 0
          ? 'With less than a month to go, focus on confirming all vendor details and completing high-priority tasks.'
          : ''
      }`,
      evidence: [brief.eventDate ? `Event date: ${brief.eventDate}` : 'No event date set'],
      suggestedActions:
        brief.eventDate === null
          ? ['Set your event date in the event details']
          : ['Review the timeline for upcoming deadlines'],
      isOfflineFallback: true,
    }
  }

  // Default response
  return {
    answer: `I can help with budget, timeline, and vendor questions from your plan data while offline. Your event "${brief.eventName}" has ${
      tasks.filter((t) => t.status === 'completed').length
    } of ${tasks.length} tasks completed${overdue.length > 0 ? `, with ${overdue.length} overdue` : ''}. Budget remaining: ${remainingStr}.`,
    evidence: [
      `Event: ${brief.eventName} (${brief.eventType})`,
      `Tasks completed: ${tasks.filter((t) => t.status === 'completed').length}/${tasks.length}`,
      `Budget remaining: ${remainingStr}`,
    ],
    suggestedActions: [
      'Ask about your budget, upcoming tasks, or vendor status',
      'Reconnect to internet for full AI assistance',
    ],
    isOfflineFallback: true,
  }
}

/**
 * Returns a deterministic set of starter ideas when AI is unavailable.
 * These are pre-written, event-type-specific suggestions.
 * MUST be clearly labeled as offline fallback — never claim AI generated them.
 */
export function getOfflineFallbackIdeas(eventType: string): FallbackIdea[] {
  return FALLBACK_IDEAS[eventType] ?? FALLBACK_IDEAS.birthday ?? []
}
