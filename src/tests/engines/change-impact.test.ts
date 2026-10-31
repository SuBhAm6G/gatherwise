import { describe, it, expect } from 'vitest'
import {
  analyzeBudgetChange,
  analyzeGuestCountChange,
  analyzeEventDateChange,
} from '@/lib/engines/change-impact'
import { createPlanFromBrief } from '@/lib/storage/plan-store'
import { updateActualSpend } from '@/lib/engines/budget'
import { EventBrief } from '@/lib/domain/types'
import { addDays, format, subDays } from 'date-fns'

const today = new Date()
const brief: EventBrief = {
  eventType: 'birthday',
  eventName: 'Emma Birthday',
  eventDate: format(addDays(today, 30), 'yyyy-MM-dd'),
  budgetAmount: 100000, // $1,000.00
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 20,
  location: 'Austin',
  atmosphere: 'Casual',
  primaryGoals: [],
  importantConstraints: [],
  planningUrgency: 'normal',
  startTime: null,
  endTime: null,
  venuePreference: 'indoor',
  dietaryRequirements: [],
  accessibilityRequirements: [],
  diyPreference: 'mixed',
  audienceAgeGroup: 'young-adults',
  culturalPreferences: [],
  mustHaveItems: [],
  mustAvoidItems: [],
  existingBookings: [],
}

describe('Change Impact Engine - Comprehensive Test Suite', () => {
  describe('Budget Changes', () => {
    it('detects budget increase and recalculates category allocations', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeBudgetChange(plan, 200000)

      expect(report.changeType).toBe('budget-change')
      expect(report.summary).toContain('increased')
      expect(updatedPlan.budget?.totalBudget).toBe(200000)
      expect(report.whatWasRecalculated.length).toBeGreaterThan(0)
      expect(report.suggestedNextActions.length).toBeGreaterThan(0)
    })

    it('detects budget decrease without overrun', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeBudgetChange(plan, 80000)

      expect(report.changeType).toBe('budget-change')
      expect(report.summary).toContain('decreased')
      expect(updatedPlan.budget?.totalBudget).toBe(80000)
      expect(report.hasAIRecommendation).toBe(false)
    })

    it('detects critical overrun when budget is cut below actual recorded spend', () => {
      const plan = createPlanFromBrief(brief)
      const catId = plan.budget.categories[0]!.id
      const planWithSpend = {
        ...plan,
        budget: updateActualSpend(plan.budget, brief, catId, 50000), // Spent $500
      }

      // Cut total budget to $300 (30,000 minor units), which is less than $500 spend
      const { report, updatedPlan } = analyzeBudgetChange(planWithSpend, 30000)
      expect(updatedPlan.budget?.isOverBudget).toBe(true)
      expect(report.hasAIRecommendation).toBe(true)
      expect(report.affectedItems.some((i) => i.severity === 'critical')).toBe(true)
      expect(report.suggestedNextActions.some((a) => a.includes('reduce allocations'))).toBe(true)
    })

    it('handles budget cut to zero cleanly', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeBudgetChange(plan, 0)
      expect(updatedPlan.budget?.totalBudget).toBe(0)
      expect(report.changeType).toBe('budget-change')
    })
  })

  describe('Guest Count Changes', () => {
    it('analyzes guest count increase on per-guest categories', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeGuestCountChange(plan, 50)

      expect(report.changeType).toBe('guest-count-change')
      expect(updatedPlan.brief?.guestCount).toBe(50)
      expect(report.whatChanged).toContain('increased')
      expect(report.suggestedNextActions.some((a) => a.includes('caterer'))).toBe(true)
    })

    it('analyzes guest count decrease', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeGuestCountChange(plan, 10)

      expect(report.changeType).toBe('guest-count-change')
      expect(updatedPlan.brief?.guestCount).toBe(10)
      expect(report.whatChanged).toContain('decreased')
    })

    it('handles extreme guest count increase (e.g. 10x from 20 to 200)', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeGuestCountChange(plan, 200)
      expect(updatedPlan.brief?.guestCount).toBe(200)
      expect(report.summary).toContain('from 20 to 200')
    })
  })

  describe('Event Date Changes', () => {
    it('analyzes date pushed into the future and reschedules tasks', () => {
      const plan = createPlanFromBrief(brief)
      const futureDate = format(addDays(today, 120), 'yyyy-MM-dd')
      const { report, updatedPlan } = analyzeEventDateChange(plan, futureDate)

      expect(report.changeType).toBe('event-date-change')
      expect(updatedPlan.brief?.eventDate).toBe(futureDate)
      expect(report.whatWasRecalculated).toContain('All task due dates')
    })

    it('detects newly overdue tasks when date is pulled close to today', () => {
      const distantBrief = { ...brief, eventDate: format(addDays(today, 365), 'yyyy-MM-dd') }
      const plan = createPlanFromBrief(distantBrief)

      // Move event date to yesterday
      const pastDate = format(subDays(today, 1), 'yyyy-MM-dd')
      const { report, updatedPlan } = analyzeEventDateChange(plan, pastDate)

      expect(report.changeType).toBe('event-date-change')
      expect(updatedPlan.brief?.eventDate).toBe(pastDate)
      expect(report.affectedItems.some((i) => i.area === 'timeline')).toBe(true)
    })

    it('triggers AI recommendation when date compression causes more than 3 tasks to become overdue', () => {
      const weddingBrief: EventBrief = {
        ...brief,
        eventType: 'wedding',
        eventDate: format(addDays(today, 365), 'yyyy-MM-dd'),
      }
      const plan = createPlanFromBrief(weddingBrief)

      // Pull date to 5 days from now, triggering multiple 30/60/90-day tasks to become overdue
      const nearDate = format(addDays(today, 5), 'yyyy-MM-dd')
      const { report } = analyzeEventDateChange(plan, nearDate)

      expect(report.hasAIRecommendation).toBe(true)
      expect(report.suggestedNextActions.some((a) => a.includes('act immediately'))).toBe(true)
    })

    it('handles date removal (changed to null)', () => {
      const plan = createPlanFromBrief(brief)
      const { report, updatedPlan } = analyzeEventDateChange(plan, null)

      expect(report.changeType).toBe('event-date-change')
      expect(updatedPlan.brief?.eventDate).toBeNull()
      expect(report.whatChanged).toContain('removed')
    })

    it('handles assigning date from previously null date', () => {
      const unconfirmedPlan = createPlanFromBrief({ ...brief, eventDate: null })
      const newDate = format(addDays(today, 90), 'yyyy-MM-dd')
      const { report, updatedPlan } = analyzeEventDateChange(unconfirmedPlan, newDate)

      expect(report.changeType).toBe('event-date-change')
      expect(updatedPlan.brief?.eventDate).toBe(newDate)
      expect(report.summary).toContain('unscheduled')
    })
  })
})
