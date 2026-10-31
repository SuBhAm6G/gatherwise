import { describe, it, expect } from 'vitest'
import {
  EventBriefSchema,
  BudgetPlanSchema,
  BudgetCategorySchema,
  PlanTaskSchema,
  VendorCategorySchema,
  EventIdeaSchema,
  ChangeImpactReportSchema,
  EventPlanSchema,
} from '@/lib/domain/schemas'

describe('Domain Schema Validation', () => {
  describe('EventBriefSchema', () => {
    const validBrief = {
      eventType: 'wedding' as const,
      eventName: 'Grand Summer Celebration',
      eventDate: '2027-06-15',
      startTime: '16:00',
      endTime: '23:00',
      budgetAmount: 3500000, // $35,000.00
      currencyCode: 'USD',
      currencyMinorUnits: 2,
      guestCount: 120,
      location: 'Napa Valley, CA',
      atmosphere: 'Rustic Elegance with local wine pairing',
      primaryGoals: ['World-class dining', 'Lively live band'],
      importantConstraints: ['Outdoor sound curfew at 10 PM'],
      venuePreference: 'outdoor' as const,
      dietaryRequirements: ['Vegan', 'Gluten-Free', 'Nut Allergy'],
      accessibilityRequirements: ['Step-free wheelchair access'],
      diyPreference: 'mixed' as const,
      audienceAgeGroup: 'adults' as const,
      culturalPreferences: ['Local traditions'],
      mustHaveItems: ['String quartet during ceremony'],
      mustAvoidItems: ['Single-use plastics'],
      planningUrgency: 'normal' as const,
      existingBookings: ['Vineyard estate reserved'],
    }

    it('validates a complete, valid event brief', () => {
      const result = EventBriefSchema.safeParse(validBrief)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.eventName).toBe('Grand Summer Celebration')
        expect(result.data.guestCount).toBe(120)
      }
    })

    it('allows null eventDate for unconfirmed scheduling', () => {
      const briefNoDate = { ...validBrief, eventDate: null }
      const result = EventBriefSchema.safeParse(briefNoDate)
      expect(result.success).toBe(true)
    })

    it('rejects empty event name', () => {
      const invalid = { ...validBrief, eventName: '' }
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects negative budget amounts', () => {
      const invalid = { ...validBrief, budgetAmount: -500 }
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('accepts zero budget for non-monetary community gatherings', () => {
      const zeroBudget = { ...validBrief, budgetAmount: 0 }
      const result = EventBriefSchema.safeParse(zeroBudget)
      expect(result.success).toBe(true)
    })

    it('rejects guest count less than 1', () => {
      const invalid = { ...validBrief, guestCount: 0 }
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects negative guest count', () => {
      const invalid = { ...validBrief, guestCount: -15 }
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects invalid eventType enum', () => {
      const invalid = { ...validBrief, eventType: 'space-launch' }
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects invalid currency code length', () => {
      const invalid = { ...validBrief, currencyCode: 'US' } // must be 3 chars
      const result = EventBriefSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('validates all core supported EventTypes', () => {
      const types = ['wedding', 'birthday', 'community'] as const
      for (const t of types) {
        const res = EventBriefSchema.safeParse({ ...validBrief, eventType: t })
        expect(res.success).toBe(true)
      }
    })

    it('validates all supported DiyPreferences', () => {
      const prefs = ['full-diy', 'mostly-diy', 'mixed', 'mostly-managed', 'fully-managed'] as const
      for (const p of prefs) {
        const res = EventBriefSchema.safeParse({ ...validBrief, diyPreference: p })
        expect(res.success).toBe(true)
      }
    })
  })

  describe('BudgetPlanSchema & Categories', () => {
    it('validates a correct budget category item', () => {
      const item = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Venue & Facilities',
        description: 'Rental fee and cleaning charges',
        allocationPercent: 30,
        allocatedAmount: 300000,
        estimatedSpend: 300000,
        actualSpend: 250000,
        isPerGuest: false,
        isFixed: true,
        isUserAdjusted: false,
        isContingency: false,
        notes: 'Deposit paid',
      }
      const result = BudgetCategorySchema.safeParse(item)
      expect(result.success).toBe(true)
    })

    it('rejects negative allocatedAmount', () => {
      const item = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Catering',
        description: 'Food and drink',
        allocationPercent: 20,
        allocatedAmount: -100,
        estimatedSpend: 0,
        actualSpend: 0,
        isPerGuest: true,
        isFixed: false,
        isUserAdjusted: false,
        isContingency: false,
        notes: '',
      }
      const result = BudgetCategorySchema.safeParse(item)
      expect(result.success).toBe(false)
    })

    it('validates a complete BudgetPlan', () => {
      const plan = {
        totalBudget: 1000000,
        contingencyPercent: 10,
        categories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Venue',
            description: 'Main hall',
            allocationPercent: 50,
            allocatedAmount: 500000,
            estimatedSpend: 500000,
            actualSpend: 450000,
            isPerGuest: false,
            isFixed: true,
            isUserAdjusted: false,
            isContingency: false,
            notes: '',
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Food',
            description: 'Catering package',
            allocationPercent: 50,
            allocatedAmount: 500000,
            estimatedSpend: 500000,
            actualSpend: 500000,
            isPerGuest: true,
            isFixed: false,
            isUserAdjusted: false,
            isContingency: false,
            notes: '',
          },
        ],
        totalAllocated: 1000000,
        totalEstimated: 1000000,
        totalActual: 950000,
        remaining: 50000,
        isOverBudget: false,
        overBudgetAmount: 0,
        lastCalculatedAt: new Date().toISOString(),
      }
      const result = BudgetPlanSchema.safeParse(plan)
      expect(result.success).toBe(true)
    })

    it('rejects invalid budget negative totalAllocated', () => {
      const plan = {
        totalBudget: 100000,
        contingencyPercent: 10,
        categories: [],
        totalAllocated: -50,
        totalEstimated: 0,
        totalActual: 0,
        remaining: 100000,
        isOverBudget: false,
        overBudgetAmount: 0,
        lastCalculatedAt: new Date().toISOString(),
      }
      const result = BudgetPlanSchema.safeParse(plan)
      expect(result.success).toBe(false)
    })
  })

  describe('PlanTaskSchema', () => {
    it('validates a task with dependencies and notes', () => {
      const task = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        title: 'Book Photographer',
        description: 'Review portfolios and sign contract',
        category: 'photography',
        priority: 'high',
        status: 'in-progress',
        dueDate: '2027-01-15',
        dueDaysBeforeEvent: 150,
        completedAt: null,
        dependsOn: ['123e4567-e89b-12d3-a456-426614174000'],
        relatedVendorCategory: 'photography',
        deadlineReason: 'Peak season fills up fast',
        origin: 'template',
        isOverdue: false,
        isDependencyBlocked: false,
        notes: 'Shortlisted 3 candidates',
      }
      const result = PlanTaskSchema.safeParse(task)
      expect(result.success).toBe(true)
    })

    it('rejects task with missing title', () => {
      const task = {
        id: '123e4567-e89b-12d3-a456-426614174004',
        title: '',
        description: '',
        category: 'venue',
        priority: 'medium',
        status: 'pending',
        dueDate: null,
        dueDaysBeforeEvent: null,
        completedAt: null,
        dependsOn: [],
        relatedVendorCategory: null,
        deadlineReason: '',
        origin: 'user',
        isOverdue: false,
        isDependencyBlocked: false,
        notes: '',
      }
      const result = PlanTaskSchema.safeParse(task)
      expect(result.success).toBe(false)
    })

    it('accepts negative dueDaysBeforeEvent for post-event tasks', () => {
      const postEventTask = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        title: 'Return rental linens and sound gear',
        description: 'Take back equipment to supplier',
        category: 'cleanup',
        priority: 'medium',
        status: 'pending',
        dueDate: '2027-06-16',
        dueDaysBeforeEvent: -1, // 1 day after event
        completedAt: null,
        dependsOn: [],
        relatedVendorCategory: null,
        deadlineReason: 'Venue requires next day restoration',
        origin: 'template',
        isOverdue: false,
        isDependencyBlocked: false,
        notes: '',
      }
      const result = PlanTaskSchema.safeParse(postEventTask)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dueDaysBeforeEvent).toBe(-1)
      }
    })
  })

  describe('VendorSchema, EventIdeaSchema & ChangeImpactReportSchema', () => {
    it('validates vendor category checklist', () => {
      const category = {
        id: '123e4567-e89b-12d3-a456-426614174006',
        name: 'Wedding Venue',
        description: 'Ceremony and reception venue',
        essentiality: 'essential',
        bookingPriority: 1,
        suggestedBookingDaysBeforeEvent: 300,
        status: 'not-started',
        allocatedBudget: 500000,
        userQuote: null,
        questionsToAsk: ['What is the seated capacity?'],
        contractItemsToConfirm: ['Deposit and payment schedule'],
        notes: 'Checking downtown lofts',
        nextAction: 'Call 3 venues for availability',
        relatedDeadlineTaskId: null,
        relatedBudgetCategoryId: null,
      }
      const result = VendorCategorySchema.safeParse(category)
      expect(result.success).toBe(true)
    })

    it('validates EventIdeaSchema', () => {
      const idea = {
        id: '123e4567-e89b-12d3-a456-426614174007',
        title: 'Sunset Acoustic Duo',
        explanation: 'Local acoustic guitarists playing background music during cocktail hour',
        whyItFits: 'Provides memorable atmosphere without loud sound equipment',
        effort: 'low',
        costCategory: 'budget-friendly',
        planningStage: '2 months before',
        potentialConstraints: ['Access to electrical outlet'],
        alternatives: ['Curated playlist with bluetooth speakers'],
        source: 'ai',
        generatedAt: new Date().toISOString(),
        isSaved: true,
      }
      const result = EventIdeaSchema.safeParse(idea)
      expect(result.success).toBe(true)
    })

    it('validates ChangeImpactReportSchema with severity', () => {
      const report = {
        changeType: 'budget-change',
        changedAt: new Date().toISOString(),
        summary: 'Total budget decreased from $10,000 to $8,000',
        whatChanged: 'Total budget decreased',
        whatWasRecalculated: ['Category allocations', 'Remaining balance'],
        affectedItems: [
          {
            area: 'budget',
            description: 'Venue: allocation reduced',
            severity: 'warning',
            affectedIds: ['123e4567-e89b-12d3-a456-426614174001'],
            previousValue: '500000',
            newValue: '400000',
          },
        ],
        suggestedNextActions: ['Review vendor contracts'],
        hasAIRecommendation: true,
      }
      const result = ChangeImpactReportSchema.safeParse(report)
      expect(result.success).toBe(true)
    })

    it('validates a complete composite EventPlan entity', () => {
      const plan = {
        id: '123e4567-e89b-12d3-a456-426614174008',
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        brief: {
          eventType: 'community',
          eventName: 'Neighborhood Block Party',
          eventDate: '2027-08-15',
          startTime: '11:00',
          endTime: '17:00',
          budgetAmount: 200000,
          currencyCode: 'USD',
          currencyMinorUnits: 2,
          guestCount: 150,
          location: 'Oak Street Park',
          atmosphere: 'Lively, family-friendly',
          primaryGoals: ['Build community ties'],
          importantConstraints: ['Street permit ends at 6 PM'],
          venuePreference: 'outdoor',
          dietaryRequirements: ['Nut-free table'],
          accessibilityRequirements: ['Accessible sidewalk ramps'],
          diyPreference: 'full-diy',
          audienceAgeGroup: 'mixed',
          culturalPreferences: [],
          mustHaveItems: [],
          mustAvoidItems: [],
          planningUrgency: 'relaxed',
          existingBookings: [],
        },
        budget: {
          totalBudget: 200000,
          contingencyPercent: 10,
          categories: [],
          totalAllocated: 0,
          totalEstimated: 0,
          totalActual: 0,
          remaining: 200000,
          isOverBudget: false,
          overBudgetAmount: 0,
          lastCalculatedAt: new Date().toISOString(),
        },
        tasks: [],
        vendors: [],
        ideas: [],
        changeHistory: [],
        isDemoData: false,
      }
      const result = EventPlanSchema.safeParse(plan)
      expect(result.success).toBe(true)
    })
  })
})
