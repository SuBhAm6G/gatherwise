import { describe, it, expect } from 'vitest'
import { getOfflineFallbackResponse, getOfflineFallbackIdeas } from '@/lib/ai/fallback'
import { createPlanFromBrief } from '@/lib/storage/plan-store'
import { updateActualSpend } from '@/lib/engines/budget'
import { EventBrief } from '@/lib/domain/types'
import { addDays, format, subDays } from 'date-fns'

const today = new Date()
const brief: EventBrief = {
  eventType: 'wedding',
  eventName: 'Test Wedding',
  eventDate: format(addDays(today, 60), 'yyyy-MM-dd'),
  budgetAmount: 3000000,
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 80,
  location: 'Seattle',
  atmosphere: 'Modern',
  primaryGoals: [],
  importantConstraints: [],
  planningUrgency: 'normal',
  startTime: null,
  endTime: null,
  venuePreference: 'indoor',
  dietaryRequirements: [],
  accessibilityRequirements: [],
  diyPreference: 'mixed',
  audienceAgeGroup: 'adults',
  culturalPreferences: [],
  mustHaveItems: [],
  mustAvoidItems: [],
  existingBookings: [],
}

describe('Offline Fallback Engine - Comprehensive Test Suite', () => {
  describe('Intent Matching & Contextual Answers', () => {
    it('returns overdue tasks when question asks about urgency or tasks', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'What urgent tasks do I have?')

      expect(response.isOfflineFallback).toBe(true)
      expect(response.answer).toBeDefined()
      expect(response.suggestedActions.length).toBeGreaterThan(0)
    })

    it('handles uppercase and aggressive punctuation in task questions', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'WHAT ARE MY NEXT TASKS???')

      expect(response.isOfflineFallback).toBe(true)
      expect(response.answer).toBeDefined()
    })

    it('returns budget analysis when question asks about spend or money', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'How is my budget looking?')

      expect(response.isOfflineFallback).toBe(true)
      expect(response.answer).toContain('total budget is')
      expect(response.evidence.some((e) => e.includes('budget'))).toBe(true)
    })

    it('explicitly warns about overrun when plan is over budget', () => {
      const plan = createPlanFromBrief(brief)
      const catId = plan.budget.categories[0]!.id
      const overPlan = {
        ...plan,
        budget: updateActualSpend(plan.budget, brief, catId, 5000000), // Spent $50k on $30k budget
      }

      const response = getOfflineFallbackResponse(overPlan, 'Tell me about our costs')
      expect(response.answer).toContain('Warning: you are currently over budget')
      expect(response.suggestedActions.some((a) => a.includes('Review non-essential'))).toBe(true)
    })

    it('returns vendor status when question asks about suppliers or booking', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'Which suppliers do I need to book?')

      expect(response.isOfflineFallback).toBe(true)
      expect(response.answer).toContain('vendor')
      expect(response.evidence.some((e) => e.includes('vendors'))).toBe(true)
    })

    it('returns countdown when event date is in the future', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'When is the event date?')

      expect(response.answer).toContain('day(s) away')
      expect(response.evidence[0]).toContain(brief.eventDate)
    })

    it('returns event is today when event date matches today', () => {
      const todayBrief = { ...brief, eventDate: format(today, 'yyyy-MM-dd') }
      const plan = createPlanFromBrief(todayBrief)
      const response = getOfflineFallbackResponse(plan, 'How many days left until the event?')

      expect(response.answer).toContain('Your event is today!')
    })

    it('returns past event notice when event date has passed', () => {
      const pastBrief = { ...brief, eventDate: format(subDays(today, 5), 'yyyy-MM-dd') }
      const plan = createPlanFromBrief(pastBrief)
      const response = getOfflineFallbackResponse(plan, 'What is the date status?')

      expect(response.answer).toContain('ago')
    })

    it('handles unscheduled event date cleanly in countdown query', () => {
      const noDatePlan = createPlanFromBrief({ ...brief, eventDate: null })
      const response = getOfflineFallbackResponse(noDatePlan, 'When does the event take place?')

      expect(response.answer).toContain('date has not been set yet')
      expect(response.suggestedActions.some((a) => a.includes('Set your event date'))).toBe(true)
    })

    it('returns helpful summary for unrecognized queries', () => {
      const plan = createPlanFromBrief(brief)
      const response = getOfflineFallbackResponse(plan, 'Can you tell me a funny joke about banjos?')

      expect(response.isOfflineFallback).toBe(true)
      expect(response.answer).toContain(brief.eventName)
      expect(response.suggestedActions.some((a) => a.includes('Ask about your budget'))).toBe(true)
    })
  })

  describe('Offline Ideas Generation', () => {
    it('returns deterministic ideas for wedding, birthday, and community', () => {
      const weddingIdeas = getOfflineFallbackIdeas('wedding')
      const birthdayIdeas = getOfflineFallbackIdeas('birthday')
      const communityIdeas = getOfflineFallbackIdeas('community')

      expect(weddingIdeas.length).toBeGreaterThan(0)
      expect(birthdayIdeas.length).toBeGreaterThan(0)
      expect(communityIdeas.length).toBeGreaterThan(0)
      expect(weddingIdeas[0]?.title).not.toEqual(birthdayIdeas[0]?.title)
    })

    it('falls back to birthday ideas for unknown event types', () => {
      const unknownIdeas = getOfflineFallbackIdeas('corporate-retreat')
      expect(unknownIdeas.length).toBeGreaterThan(0)
      expect(unknownIdeas[0]?.title).toBeDefined()
    })

    it('guarantees each offline idea has all required fields', () => {
      const allTypes = ['wedding', 'birthday', 'community', 'unknown']
      for (const t of allTypes) {
        const ideas = getOfflineFallbackIdeas(t)
        for (const item of ideas) {
          expect(item.title.length).toBeGreaterThan(0)
          expect(item.explanation.length).toBeGreaterThan(0)
          expect(item.whyItFits.length).toBeGreaterThan(0)
          expect(['minimal', 'low', 'medium', 'high']).toContain(item.effort)
          expect(['free', 'budget-friendly', 'moderate', 'premium']).toContain(item.costCategory)
        }
      }
    })
  })
})
