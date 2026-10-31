import { EventBrief, BudgetPlan, PlanTask, VendorCategory } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'
import { getOverdueTasks, getUpcomingTasks, daysUntilEvent } from '@/lib/engines/timeline'
import { AI_CONFIG } from './provider'

/**
 * Builds a focused, minimal plan context for the ideas API.
 * Keeps tokens low — do NOT send the entire plan.
 */
export function buildIdeasContext(brief: EventBrief, budget: BudgetPlan): string {
  const budgetStr = formatCurrency(budget.totalBudget, brief.currencyCode, brief.currencyMinorUnits)
  const remainingStr = formatCurrency(
    budget.remaining,
    brief.currencyCode,
    brief.currencyMinorUnits,
  )

  const lines = [
    `Event type: ${brief.eventType}`,
    `Event name: ${brief.eventName}`,
    `Guest count: ${brief.guestCount}`,
    `Total budget: ${budgetStr}`,
    `Remaining budget: ${remainingStr}`,
    `Atmosphere: ${brief.atmosphere || 'not specified'}`,
    `Venue preference: ${brief.venuePreference}`,
    `DIY preference: ${brief.diyPreference}`,
    `Age group: ${brief.audienceAgeGroup}`,
    brief.primaryGoals.length > 0 ? `Goals: ${brief.primaryGoals.join(', ')}` : '',
    brief.importantConstraints.length > 0
      ? `Constraints: ${brief.importantConstraints.join(', ')}`
      : '',
    brief.dietaryRequirements.length > 0 ? `Dietary: ${brief.dietaryRequirements.join(', ')}` : '',
    brief.accessibilityRequirements.length > 0
      ? `Accessibility: ${brief.accessibilityRequirements.join(', ')}`
      : '',
    brief.mustHaveItems.length > 0 ? `Must-have: ${brief.mustHaveItems.join(', ')}` : '',
    brief.mustAvoidItems.length > 0 ? `Must-avoid: ${brief.mustAvoidItems.join(', ')}` : '',
  ]

  return lines.filter(Boolean).join('\n').slice(0, AI_CONFIG.maxPlanContextChars)
}

/**
 * Builds a focused context for the assistant API.
 * Includes only data relevant to answering planning questions.
 */
export function buildAssistantContext(
  brief: EventBrief,
  budget: BudgetPlan,
  tasks: PlanTask[],
  vendors: VendorCategory[],
): string {
  const budgetStr = formatCurrency(budget.totalBudget, brief.currencyCode, brief.currencyMinorUnits)
  const remainingStr = formatCurrency(
    budget.remaining,
    brief.currencyCode,
    brief.currencyMinorUnits,
  )
  const overdue = getOverdueTasks(tasks)
  const upcoming = getUpcomingTasks(tasks, 14)
  const bookedVendors = vendors.filter((v) => v.status === 'booked').map((v) => v.name)
  const pendingVendors = vendors
    .filter((v) => v.essentiality === 'essential' && v.status === 'not-started')
    .map((v) => v.name)

  const daysLeft = brief.eventDate ? daysUntilEvent(brief.eventDate) : null

  const lines = [
    `Event: ${brief.eventName} (${brief.eventType})`,
    brief.eventDate
      ? `Event date: ${brief.eventDate} (${daysLeft ?? '?'} days away)`
      : 'Event date: not set',
    `Guests: ${brief.guestCount}`,
    `Budget: ${budgetStr}, Remaining: ${remainingStr}${budget.isOverBudget ? ' [OVER BUDGET]' : ''}`,
    overdue.length > 0
      ? `Overdue tasks (${overdue.length}): ${overdue
          .slice(0, 5)
          .map((t) => t.title)
          .join(', ')}`
      : 'No overdue tasks',
    upcoming.length > 0
      ? `Upcoming tasks (next 14 days): ${upcoming
          .slice(0, 5)
          .map((t) => `${t.title} (due ${t.dueDate})`)
          .join(', ')}`
      : 'No upcoming tasks in 14 days',
    bookedVendors.length > 0
      ? `Booked vendors: ${bookedVendors.join(', ')}`
      : 'No vendors booked yet',
    pendingVendors.length > 0 ? `Essential vendors not started: ${pendingVendors.join(', ')}` : '',
    brief.primaryGoals.length > 0 ? `Goals: ${brief.primaryGoals.join(', ')}` : '',
    brief.importantConstraints.length > 0
      ? `Constraints: ${brief.importantConstraints.join(', ')}`
      : '',
  ]

  return lines.filter(Boolean).join('\n').slice(0, AI_CONFIG.maxPlanContextChars)
}

/** System prompt for the ideas endpoint */
export const IDEAS_SYSTEM_PROMPT = `You are a creative, pragmatic event planning advisor for GatherWise.
Your role is to generate personalized, actionable event ideas tailored to the organizer's context.

Rules:
- Generate 4–6 specific, actionable ideas based on the provided event context
- Each idea must be directly tied to the stated budget, guest count, style, and goals
- Never fabricate vendor names, prices, quotes, or market data
- Label cost estimates as "illustrative ranges" not verified quotes
- Do not make assumptions about cultural, dietary, or personal preferences not stated
- Focus on ideas the organizer can realistically pursue
- Return valid JSON matching the specified schema exactly

Return a JSON object with this structure:
{
  "ideas": [
    {
      "title": "string (concise, max 80 chars)",
      "explanation": "string (what this idea involves)",
      "whyItFits": "string (why it matches the organizer's stated context)",
      "effort": "minimal|low|medium|high",
      "costCategory": "free|budget-friendly|moderate|premium",
      "planningStage": "string (when to pursue this idea)",
      "potentialConstraints": ["string"],
      "alternatives": ["string"]
    }
  ]
}`

/** System prompt for the assistant endpoint */
export const ASSISTANT_SYSTEM_PROMPT = `You are a knowledgeable, concise planning assistant for GatherWise.
You help event organizers make informed decisions about their wedding, birthday, or community event.

Rules:
- Base answers strictly on the provided event plan data — do not invent facts
- Budget amounts, deadlines, and task counts come from the plan — confirm them, do not override
- Never claim to have contacted vendors, made reservations, or checked real-time availability
- If you lack sufficient information to answer confidently, explicitly indicate it
- Do not fabricate vendor names, prices, availability, or market data
- Keep answers practical and grounded in the organizer's real constraints
- When suggesting actions, these are suggestions only — the organizer makes all decisions

Return a JSON object with this structure:
{
  "answer": "string (your response, max 1500 chars)",
  "evidence": ["string (fact from the plan supporting your answer)"],
  "suggestedActions": ["string (optional next step for the organizer)"],
  "isInsufficientContext": false
}`
