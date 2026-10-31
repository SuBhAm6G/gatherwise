import { describe, it, expect } from 'vitest'
import {
  createPlanFromBrief,
  persistPlan,
  retrievePlan,
  retrieveAllPlans,
  removePlan,
  createDemoPlan,
} from '@/lib/storage/plan-store'
import { EventBrief, EventType } from '@/lib/domain/types'

const brief: EventBrief = {
  eventType: 'birthday',
  eventName: 'Sophia 30th Birthday',
  eventDate: '2026-11-20',
  budgetAmount: 150000,
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 25,
  location: 'San Francisco',
  atmosphere: 'Cocktail style',
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

describe('Plan Store & Persistence Layer - Comprehensive Test Suite', () => {
  describe('Plan Creation & Defaults', () => {
    it('creates plan with UUID, valid timestamps, and initial plan engines populated', () => {
      const plan = createPlanFromBrief(brief)
      expect(typeof plan.id).toBe('string')
      expect(plan.id.length).toBeGreaterThan(10)
      expect(plan.createdAt).toBeDefined()
      expect(plan.updatedAt).toBeDefined()
      expect(plan.budget.totalBudget).toBe(150000)
      expect(plan.tasks.length).toBeGreaterThan(0)
      expect(plan.vendors.length).toBeGreaterThan(0)
      expect(plan.changeHistory).toEqual([])
    })

    it('creates specialized plans for wedding, birthday, and community', () => {
      const types: EventType[] = ['wedding', 'birthday', 'community']
      for (const t of types) {
        const plan = createPlanFromBrief({ ...brief, eventType: t })
        expect(plan.brief.eventType).toBe(t)
        expect(plan.budget.categories.length).toBeGreaterThan(0)
        expect(plan.tasks.length).toBeGreaterThan(0)
        expect(plan.vendors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Storage CRUD Operations', () => {
    it('creates, saves, and retrieves a plan correctly', async () => {
      const plan = createPlanFromBrief(brief)
      const { success } = await persistPlan(plan)
      expect(success).toBe(true)

      const loaded = await retrievePlan(plan.id)
      expect(loaded).not.toBeNull()
      expect(loaded?.id).toBe(plan.id)
      expect(loaded?.brief.eventName).toBe('Sophia 30th Birthday')
      expect(loaded?.budget.totalBudget).toBe(150000)
    })

    it('updates existing plan when persisted again with changed data', async () => {
      const plan = createPlanFromBrief(brief)
      await persistPlan(plan)

      const updated = {
        ...plan,
        brief: { ...plan.brief, eventName: 'Sophia 30th Birthday (Updated)' },
        updatedAt: new Date().toISOString(),
      }
      await persistPlan(updated)

      const loaded = await retrievePlan(plan.id)
      expect(loaded?.brief.eventName).toBe('Sophia 30th Birthday (Updated)')
    })

    it('retrieveAllPlans returns all persisted plans without duplication', async () => {
      const planA = createPlanFromBrief({ ...brief, eventName: 'Festival A' })
      const planB = createPlanFromBrief({ ...brief, eventName: 'Gala B' })

      await persistPlan(planA)
      await persistPlan(planB)

      const all = await retrieveAllPlans()
      expect(all.length).toBeGreaterThanOrEqual(2)
      expect(all.some((p) => p.id === planA.id)).toBe(true)
      expect(all.some((p) => p.id === planB.id)).toBe(true)
    })

    it('removePlan deletes the plan correctly and subsequent retrieve returns null', async () => {
      const plan = createPlanFromBrief({ ...brief, eventName: 'To Be Deleted' })
      await persistPlan(plan)

      const deleteSuccess = await removePlan(plan.id)
      expect(deleteSuccess).toBe(true)

      const afterDelete = await retrievePlan(plan.id)
      expect(afterDelete).toBeNull()
    })

    it('retrievePlan returns null for non-existent plan ID', async () => {
      const nonExistent = await retrievePlan('non-existent-uuid-12345')
      expect(nonExistent).toBeNull()
    })

    it('removePlan handles non-existent ID gracefully', async () => {
      const deleteSuccess = await removePlan('non-existent-uuid-99999')
      expect(typeof deleteSuccess).toBe('boolean')
    })
  })

  describe('Demo Plan Seeding', () => {
    it('createDemoPlan seeds realistic sample data with isDemoData flag', () => {
      const demo = createDemoPlan()
      expect(demo.isDemoData).toBe(true)
      expect(demo.brief.eventName).toContain("Maya's 40th")
      expect(demo.tasks.length).toBeGreaterThan(0)
      expect(demo.vendors.length).toBeGreaterThan(0)
      expect(demo.budget.categories.length).toBeGreaterThan(0)
    })

    it('allows demo plan to be persisted and retrieved like a real plan', async () => {
      const demo = createDemoPlan()
      const { success } = await persistPlan(demo)
      expect(success).toBe(true)

      const loaded = await retrievePlan(demo.id)
      expect(loaded).not.toBeNull()
      expect(loaded?.id).toBe(demo.id)
      expect(loaded?.isDemoData).toBe(true)
    })
  })
})
