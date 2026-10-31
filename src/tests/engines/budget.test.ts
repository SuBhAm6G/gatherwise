import { describe, it, expect } from 'vitest'
import {
  generateBudget,
  recalculateBudget,
  adjustCategoryAllocation,
  updateActualSpend,
  formatCurrency,
} from '@/lib/engines/budget'
import { EventBrief, EventType } from '@/lib/domain/types'

const sampleBrief: EventBrief = {
  eventType: 'wedding',
  eventName: 'Test Wedding',
  eventDate: '2026-12-31',
  budgetAmount: 2000000, // $20,000.00
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 100,
  location: 'New York',
  atmosphere: 'Formal',
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

describe('Budget Engine - Robust Comprehensive Suite', () => {
  describe('Category Generation Across All Event Types', () => {
    it('creates event-type-specific categories for wedding', () => {
      const budget = generateBudget(sampleBrief)
      expect(budget.categories.length).toBeGreaterThan(0)
      expect(budget.totalBudget).toBe(2000000)
      expect(budget.isOverBudget).toBe(false)
      expect(budget.categories.some((c) => c.name === 'Venue')).toBe(true)
      expect(budget.categories.some((c) => c.name === 'Catering & Bar')).toBe(true)
    })

    it('generates different categories for wedding vs birthday vs community', () => {
      const weddingBudget = generateBudget(sampleBrief)
      const birthdayBudget = generateBudget({ ...sampleBrief, eventType: 'birthday' })
      const communityBudget = generateBudget({ ...sampleBrief, eventType: 'community' })

      expect(birthdayBudget.categories.some((c) => c.name === 'Cake & Desserts')).toBe(true)
      expect(communityBudget.categories.some((c) => c.name === 'Safety & First Aid')).toBe(true)
      expect(weddingBudget.categories.some((c) => c.name === 'Attire & Beauty')).toBe(true)
    })

    it('generates categories for all valid event types and custom types', () => {
      const validTypes: EventType[] = ['wedding', 'birthday', 'community']
      for (const t of validTypes) {
        const b = generateBudget({ ...sampleBrief, eventType: t })
        expect(b.categories.length).toBeGreaterThan(0)
        expect(b.totalBudget).toBe(sampleBrief.budgetAmount)
      }
      const otherTypes = ['corporate', 'dinner', 'charity', 'festival'] as unknown as EventType[]
      for (const t of otherTypes) {
        const b = generateBudget({ ...sampleBrief, eventType: t })
        expect(b.categories.length).toBeGreaterThan(0)
      }
    })

    it('falls back to default categories for unknown event type', () => {
      const b = generateBudget({ ...sampleBrief, eventType: 'unregistered-type' as EventType })
      expect(b.categories.length).toBeGreaterThan(0)
      expect(b.categories.some((c) => c.name === 'Cake & Desserts')).toBe(true)
    })
  })

  describe('Budget Boundary & Extreme Amounts', () => {
    it('handles zero budget without throwing errors', () => {
      const budget = generateBudget({ ...sampleBrief, budgetAmount: 0 })
      expect(budget.totalBudget).toBe(0)
      expect(budget.remaining).toBe(0)
      expect(budget.isOverBudget).toBe(false)
      expect(budget.categories.every((c) => c.allocatedAmount === 0)).toBe(true)
    })

    it('handles micro budget ($1.00 = 100 minor units)', () => {
      const budget = generateBudget({ ...sampleBrief, budgetAmount: 100 })
      expect(budget.totalBudget).toBe(100)
      expect(budget.totalAllocated).toBeLessThanOrEqual(100)
      expect(budget.isOverBudget).toBe(false)
    })

    it('handles massive budget ($50,000,000.00 = 5,000,000,000 minor units)', () => {
      const massiveAmount = 5000000000
      const budget = generateBudget({ ...sampleBrief, budgetAmount: massiveAmount })
      expect(budget.totalBudget).toBe(massiveAmount)
      expect(budget.totalAllocated).toBeLessThanOrEqual(massiveAmount)
      expect(budget.isOverBudget).toBe(false)
    })

    it('guarantees allocated amount sum never exceeds total budget due to floor division', () => {
      // Test odd numbers that don't divide evenly
      const oddBudgets = [333333, 777777, 999999, 1234567, 1000001]
      for (const amount of oddBudgets) {
        const budget = generateBudget({ ...sampleBrief, budgetAmount: amount })
        const sumAllocated = budget.categories.reduce((acc, c) => acc + c.allocatedAmount, 0)
        expect(sumAllocated).toBeLessThanOrEqual(amount)
      }
    })
  })

  describe('Spend Tracking & Overrun Detection', () => {
    it('detects overrun when actual spend exceeds budget', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id

      // Spend $25,000 (2,500,000 cents) on a $20,000 budget
      const updated = updateActualSpend(budget, sampleBrief, categoryId, 2500000)
      expect(updated.isOverBudget).toBe(true)
      expect(updated.overBudgetAmount).toBe(500000)
      expect(updated.remaining).toBe(-500000)
    })

    it('recalculates remaining correctly when spend is within budget', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id

      // Spend $5,000 (500,000 cents) on a $20,000 budget
      const updated = updateActualSpend(budget, sampleBrief, categoryId, 500000)
      expect(updated.isOverBudget).toBe(false)
      expect(updated.remaining).toBe(1500000)
      expect(updated.totalActual).toBe(500000)
    })

    it('throws RangeError for negative actual spend', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id

      expect(() => updateActualSpend(budget, sampleBrief, categoryId, -100)).toThrow(RangeError)
    })
  })

  describe('Allocation Adjustments & Recalculation', () => {
    it('adjustCategoryAllocation updates percentage and derived amount correctly', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id

      const updated = adjustCategoryAllocation(budget, sampleBrief, categoryId, 40)
      const targetCat = updated.categories.find((c) => c.id === categoryId)
      expect(targetCat?.allocationPercent).toBe(40)
      expect(targetCat?.allocatedAmount).toBe(800000) // 40% of 2,000,000
      expect(targetCat?.isUserAdjusted).toBe(true)
    })

    it('throws RangeError for negative allocation percentages', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id
      expect(() => adjustCategoryAllocation(budget, sampleBrief, categoryId, -5)).toThrow(RangeError)
    })

    it('throws RangeError for allocation percentages exceeding 100', () => {
      const budget = generateBudget(sampleBrief)
      const categoryId = budget.categories[0]!.id
      expect(() => adjustCategoryAllocation(budget, sampleBrief, categoryId, 105)).toThrow(RangeError)
    })

    it('throws Error for non-existent category ID', () => {
      const budget = generateBudget(sampleBrief)
      expect(() => adjustCategoryAllocation(budget, sampleBrief, 'non-existent-id', 20)).toThrow('not found')
    })

    it('recalculateBudget updates all categories with new total budget', () => {
      const budget = generateBudget(sampleBrief)
      const newBrief: EventBrief = { ...sampleBrief, budgetAmount: 4000000 } // Doubled to $40,000
      const recalculated = recalculateBudget(newBrief, budget.categories, budget.contingencyPercent)

      expect(recalculated.totalBudget).toBe(4000000)
      expect(recalculated.totalAllocated).toBe(budget.totalAllocated * 2)
      expect(recalculated.isOverBudget).toBe(false)
    })
  })

  describe('Currency Formatting', () => {
    it('formatCurrency formats standard 2-decimal USD and GBP amounts', () => {
      const formattedUSD = formatCurrency(150050, 'USD', 2)
      expect(formattedUSD).toContain('1,500.50')

      const formattedGBP = formatCurrency(200000, 'GBP', 2)
      expect(formattedGBP).toContain('2,000.00')
    })

    it('formatCurrency handles 0-decimal currencies (JPY)', () => {
      const formattedJPY = formatCurrency(50000, 'JPY', 0)
      expect(formattedJPY).toContain('50,000')
      expect(formattedJPY).not.toContain('.00')
    })

    it('formatCurrency formats zero amount cleanly', () => {
      const formattedZero = formatCurrency(0, 'USD', 2)
      expect(formattedZero).toContain('0.00')
    })

    it('formatCurrency handles negative amounts properly', () => {
      const formattedNeg = formatCurrency(-50000, 'USD', 2)
      expect(formattedNeg).toContain('500.00')
    })
  })
})
