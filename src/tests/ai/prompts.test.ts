import { describe, it, expect } from 'vitest'
import {
  buildIdeasContext,
  buildAssistantContext,
  IDEAS_SYSTEM_PROMPT,
  ASSISTANT_SYSTEM_PROMPT,
} from '@/lib/ai/prompts'
import { generateBudget } from '@/lib/engines/budget'
import { generateTimeline } from '@/lib/engines/timeline'
import { generateVendors } from '@/lib/engines/vendors'
import { EventBrief } from '@/lib/domain/types'
import { addDays, format, subDays } from 'date-fns'

const today = new Date()
const sampleBrief: EventBrief = {
  eventType: 'wedding',
  eventName: 'Elena & Lucas Wedding',
  eventDate: format(addDays(today, 90), 'yyyy-MM-dd'),
  budgetAmount: 2500000, // $25,000.00
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 85,
  location: 'San Diego, CA',
  atmosphere: 'Sunset beach bohemian with acoustic music',
  primaryGoals: ['Ocean view sunset ceremony', 'Craft cocktail tasting'],
  importantConstraints: ['Outdoor music stops at 10 PM sharp'],
  planningUrgency: 'normal',
  startTime: '17:00',
  endTime: '22:00',
  venuePreference: 'outdoor',
  dietaryRequirements: ['Vegan options', 'Gluten-Free guest count: 4'],
  accessibilityRequirements: ['Beach boardwalk for wheelchair access'],
  diyPreference: 'mixed',
  audienceAgeGroup: 'adults',
  culturalPreferences: ['Bilingual vows (English/Spanish)'],
  mustHaveItems: ['Polaroid guestbook table'],
  mustAvoidItems: ['Plastic confetti'],
  existingBookings: ['Beach park permit secured'],
}

describe('AI Prompt Builders & Guardrails', () => {
  describe('buildIdeasContext', () => {
    it('builds comprehensive context string containing all event brief dimensions', () => {
      const budget = generateBudget(sampleBrief)
      const context = buildIdeasContext(sampleBrief, budget)

      expect(context).toContain('Event type: wedding')
      expect(context).toContain('Elena & Lucas Wedding')
      expect(context).toContain('Guest count: 85')
      expect(context).toContain('Total budget: $25,000.00')
      expect(context).toContain('Atmosphere: Sunset beach bohemian')
      expect(context).toContain('Goals: Ocean view sunset ceremony')
      expect(context).toContain('Constraints: Outdoor music stops at 10 PM sharp')
      expect(context).toContain('Dietary: Vegan options')
      expect(context).toContain('Accessibility: Beach boardwalk for wheelchair access')
      expect(context).toContain('Must-have: Polaroid guestbook table')
      expect(context).toContain('Must-avoid: Plastic confetti')
    })

    it('handles sparse event brief with default fallbacks gracefully', () => {
      const sparseBrief: EventBrief = {
        ...sampleBrief,
        atmosphere: '',
        primaryGoals: [],
        importantConstraints: [],
        dietaryRequirements: [],
        accessibilityRequirements: [],
        mustHaveItems: [],
        mustAvoidItems: [],
      }
      const budget = generateBudget(sparseBrief)
      const context = buildIdeasContext(sparseBrief, budget)

      expect(context).toContain('Atmosphere: not specified')
      expect(context).not.toContain('Dietary:')
      expect(context).not.toContain('Must-have:')
    })

    it('caps output length to maxPlanContextChars safely', () => {
      const giantBrief: EventBrief = {
        ...sampleBrief,
        atmosphere: 'A'.repeat(5000),
      }
      const budget = generateBudget(giantBrief)
      const context = buildIdeasContext(giantBrief, budget)
      expect(context.length).toBeLessThanOrEqual(3000)
    })
  })

  describe('buildAssistantContext', () => {
    it('builds context including overdue tasks, upcoming tasks, and vendor status', () => {
      const budget = generateBudget(sampleBrief)
      const tasks = generateTimeline(sampleBrief)
      const vendors = generateVendors(sampleBrief)

      const context = buildAssistantContext(sampleBrief, budget, tasks, vendors)

      expect(context).toContain('Event: Elena & Lucas Wedding (wedding)')
      expect(context).toContain('Guests: 85')
      expect(context).toContain('$25,000.00')
      expect(context).toContain('days away')
    })

    it('explicitly flags [OVER BUDGET] when budget remaining is negative', () => {
      const budget = generateBudget(sampleBrief)
      const overBudgetPlan = {
        ...budget,
        remaining: -150000,
        isOverBudget: true,
      }
      const tasks = generateTimeline(sampleBrief)
      const vendors = generateVendors(sampleBrief)

      const context = buildAssistantContext(sampleBrief, overBudgetPlan, tasks, vendors)
      expect(context).toContain('[OVER BUDGET]')
    })

    it('handles unscheduled event date cleanly without NaN or broken formatting', () => {
      const noDateBrief: EventBrief = { ...sampleBrief, eventDate: null }
      const budget = generateBudget(noDateBrief)
      const tasks = generateTimeline(noDateBrief)
      const vendors = generateVendors(noDateBrief)

      const context = buildAssistantContext(noDateBrief, budget, tasks, vendors)
      expect(context).toContain('Event date: not set')
      expect(context).not.toContain('NaN')
    })

    it('reports overdue tasks accurately when tasks are past due', () => {
      const pastBrief: EventBrief = {
        ...sampleBrief,
        eventDate: format(subDays(today, 10), 'yyyy-MM-dd'),
      }
      const budget = generateBudget(pastBrief)
      const tasks = generateTimeline(pastBrief)
      const vendors = generateVendors(pastBrief)

      const context = buildAssistantContext(pastBrief, budget, tasks, vendors)
      expect(context).toContain('Overdue tasks')
    })

    it('lists booked vendors and essential pending vendors separately', () => {
      const budget = generateBudget(sampleBrief)
      const tasks = generateTimeline(sampleBrief)
      const vendors = generateVendors(sampleBrief)
      if (vendors[0]) {
        vendors[0].status = 'booked'
      }

      const context = buildAssistantContext(sampleBrief, budget, tasks, vendors)
      expect(context).toContain('Booked vendors:')
      expect(context).toContain(vendors[0]!.name)
    })
  })

  describe('Prompt Anti-Hallucination & Security Guardrails', () => {
    it('IDEAS_SYSTEM_PROMPT contains explicit prohibitions against fabricating quotes and vendors', () => {
      expect(IDEAS_SYSTEM_PROMPT).toContain('Never fabricate vendor names, prices, quotes, or market data')
      expect(IDEAS_SYSTEM_PROMPT).toContain('Label cost estimates as "illustrative ranges"')
      expect(IDEAS_SYSTEM_PROMPT).toContain('Return valid JSON matching the specified schema exactly')
    })

    it('ASSISTANT_SYSTEM_PROMPT strictly prohibits contradicting deterministic engine numbers', () => {
      expect(ASSISTANT_SYSTEM_PROMPT).toContain('Budget amounts, deadlines, and task counts come from the plan')
      expect(ASSISTANT_SYSTEM_PROMPT).toContain('Do not fabricate vendor names, prices, availability, or market data')
      expect(ASSISTANT_SYSTEM_PROMPT).toContain('Base answers strictly on the provided event plan data')
      expect(ASSISTANT_SYSTEM_PROMPT).toContain('suggestedActions')
    })
  })
})
