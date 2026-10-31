import { EventPlan } from '@/lib/domain/types'
import { getOverdueTasks, getUpcomingTasks, daysUntilEvent } from '@/lib/engines/timeline'
import { formatCurrency } from '@/lib/engines/budget'

export interface FallbackResponse {
  answer: string
  evidence: string[]
  suggestedActions: string[]
  isOfflineFallback: true
}

export interface FallbackIdea {
  title: string
  explanation: string
  whyItFits: string
  effort: 'minimal' | 'low' | 'medium' | 'high'
  costCategory: 'free' | 'budget-friendly' | 'moderate' | 'premium'
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
  const remainingStr = formatCurrency(budget.remaining, brief.currencyCode, brief.currencyMinorUnits)

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
      evidence: overdue.slice(0, 3).map((t) => `Overdue: ${t.title} (due ${t.dueDate ?? 'unknown'})`),
      suggestedActions:
        overdue.length > 0
          ? ['Review and action the overdue tasks above', 'Mark tasks complete as you finish them']
          : ['Continue with upcoming tasks'],
      isOfflineFallback: true,
    }
  }

  // Budget question
  if (lowerQ.includes('budget') || lowerQ.includes('cost') || lowerQ.includes('money') || lowerQ.includes('spend')) {
    const overrunNote = budget.isOverBudget
      ? ` Warning: you are currently over budget by ${formatCurrency(budget.overBudgetAmount, brief.currencyCode, brief.currencyMinorUnits)}.`
      : ''
    return {
      answer: `Your total budget is ${budgetStr}. Remaining: ${remainingStr}.${overrunNote} The largest allocations are: ${budget.categories
        .filter((c) => !c.isContingency)
        .sort((a, b) => b.allocatedAmount - a.allocatedAmount)
        .slice(0, 3)
        .map((c) => `${c.name} (${formatCurrency(c.allocatedAmount, brief.currencyCode, brief.currencyMinorUnits)})`)
        .join(', ')}.`,
      evidence: [
        `Total budget: ${budgetStr}`,
        `Remaining: ${remainingStr}`,
        budget.isOverBudget
          ? `Over budget by: ${formatCurrency(budget.overBudgetAmount, brief.currencyCode, brief.currencyMinorUnits)}`
          : 'Within budget',
      ],
      suggestedActions: budget.isOverBudget
        ? ['Review non-essential budget categories', 'Consider reducing optional vendor allocations']
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
          ? ['Start researching essential vendors', "Use the Vendors tab to track each vendor's status"]
          : ['Update vendor status as you progress'],
      isOfflineFallback: true,
    }
  }

  // Countdown / date question
  if (lowerQ.includes('date') || lowerQ.includes('when') || lowerQ.includes('day') || lowerQ.includes('time')) {
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
  const ideas: Record<string, FallbackIdea[]> = {
    wedding: [
      {
        title: 'Potluck-style dessert table',
        explanation: 'Invite close friends or family to bring a signature homemade dessert or baked specialty.',
        whyItFits: 'Substantially reduces catering dessert charges while adding a warm, intimate community feeling.',
        effort: 'low',
        costCategory: 'free',
      },
      {
        title: 'Curated digital photo slideshow',
        explanation: 'Create a looping, elegant photo montage projected during cocktail hour or in the reception lounge.',
        whyItFits: 'Personalizes the venue without requiring expensive printed signs and custom decor rentals.',
        effort: 'low',
        costCategory: 'budget-friendly',
      },
      {
        title: 'Heirloom family cocktail or mocktail',
        explanation: 'Feature one or two meaningful drinks honoring family roots or the couple’s story.',
        whyItFits: 'Adds a bespoke element to bar service with standard ingredients.',
        effort: 'medium',
        costCategory: 'budget-friendly',
      },
      {
        title: 'Lawn games during reception transition',
        explanation: 'Set up classic outdoor games (croquet, cornhole, giant Jenga) for guests during photos.',
        whyItFits: 'Keeps guests engaged and entertained without hiring additional performers.',
        effort: 'low',
        costCategory: 'budget-friendly',
      },
    ],
    birthday: [
      {
        title: 'Chronological photo memory gallery',
        explanation: 'Display candid photos of the guest of honor across each decade or milestone.',
        whyItFits: 'Creates an immediate conversation focal point with sentimental impact for negligible cost.',
        effort: 'low',
        costCategory: 'budget-friendly',
      },
      {
        title: 'DIY artisan mocktail and soda bar',
        explanation: 'Set up fresh berries, herbs, syrups, and flavored sparkling waters with reusable glassware.',
        whyItFits: 'Fun, photogenic, and inclusive for guests of all ages and dietary preferences.',
        effort: 'medium',
        costCategory: 'budget-friendly',
      },
      {
        title: 'Milestone trivia contest',
        explanation: 'Organize a 15-minute trivia round with humorous, heartfelt facts about the celebrant.',
        whyItFits: 'High-energy entertainment that brings everyone together without performer fees.',
        effort: 'minimal',
        costCategory: 'free',
      },
    ],
    community: [
      {
        title: 'Local talent and acoustic showcase',
        explanation: 'Invite neighborhood musicians, student groups, or storytellers for scheduled micro-performances.',
        whyItFits: 'Zero professional talent cost and deepens neighborhood connection.',
        effort: 'medium',
        costCategory: 'free',
      },
      {
        title: 'Community skill-sharing corner',
        explanation: 'Host brief 15-minute hands-on demos led by community volunteers (e.g. urban planting, crafting).',
        whyItFits: 'Low-cost interactive engagement that showcases resident talents.',
        effort: 'medium',
        costCategory: 'budget-friendly',
      },
      {
        title: 'DIY polaroid/phone photo zone',
        explanation: 'Create a botanical or themed photo backdrop with fun community props.',
        whyItFits: 'Encourages organic social sharing and preserves vibrant memories.',
        effort: 'low',
        costCategory: 'budget-friendly',
      },
    ],
  }

  return ideas[eventType] ?? ideas.birthday ?? []
}
