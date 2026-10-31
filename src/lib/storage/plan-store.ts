import { EventPlan, EventBrief } from '@/lib/domain/types'
import { generateBudget } from '@/lib/engines/budget'
import { generateTimeline, refreshTaskStatuses } from '@/lib/engines/timeline'
import { generateVendors } from '@/lib/engines/vendors'
import { savePlan, loadPlan, deletePlan, loadAllPlans } from './db'
import { v4 as uuidv4 } from 'uuid'
import { CURRENT_SCHEMA_VERSION } from '@/lib/domain/schemas'
import { addDays, format } from 'date-fns'

/**
 * Creates a brand-new EventPlan from an EventBrief.
 * Generates budget, timeline, and vendors using deterministic engines.
 */
export function createPlanFromBrief(brief: EventBrief, isDemoData = false): EventPlan {
  const now = new Date().toISOString()
  const budget = generateBudget(brief)
  const tasks = generateTimeline(brief)
  const vendors = generateVendors(brief)

  return {
    id: uuidv4(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    brief,
    budget,
    tasks: refreshTaskStatuses(tasks),
    vendors,
    ideas: [],
    changeHistory: [],
    isDemoData,
  }
}

/**
 * Persists a plan to IndexedDB and returns save success status.
 */
export async function persistPlan(plan: EventPlan): Promise<{ success: boolean; plan: EventPlan }> {
  const success = await savePlan(plan)
  return { success, plan }
}

/**
 * Loads a plan by ID. Returns null if not found or invalid.
 */
export async function retrievePlan(id: string): Promise<EventPlan | null> {
  return loadPlan(id)
}

/**
 * Loads all plans from IndexedDB.
 */
export async function retrieveAllPlans(): Promise<EventPlan[]> {
  return loadAllPlans()
}

/**
 * Removes a plan by ID. Returns success status.
 */
export async function removePlan(id: string): Promise<boolean> {
  return deletePlan(id)
}

/**
 * Creates a fully-populated realistic demo plan (Maya's 40th Garden Party)
 * for evaluators and demonstration.
 */
export function createDemoPlan(): EventPlan {
  const futureDate = format(addDays(new Date(), 28), 'yyyy-MM-dd')
  const brief: EventBrief = {
    eventType: 'birthday',
    eventName: "Maya's 40th Garden Celebration",
    eventDate: futureDate,
    budgetAmount: 350000, // £3,500.00
    currencyCode: 'GBP',
    currencyMinorUnits: 2,
    guestCount: 45,
    location: 'Richmond Gardens, London',
    atmosphere: 'relaxed, warm botanical garden party with acoustic live music and craft food',
    primaryGoals: ['Unforgettable milestone memory', 'Stress-free hosting for family', 'Cozy outdoor ambiance'],
    importantConstraints: ['Outdoor weather backup needed', 'Lawn-friendly footwear advice for guests'],
    planningUrgency: 'normal',
    startTime: '14:00',
    endTime: '20:00',
    venuePreference: 'outdoor',
    dietaryRequirements: ['Vegetarian options', 'Nut allergy precautions', 'Gluten-free dessert option'],
    accessibilityRequirements: ['Step-free pathway to seating and restrooms'],
    diyPreference: 'mixed',
    audienceAgeGroup: 'mixed',
    culturalPreferences: [],
    mustHaveItems: ['Signature mocktail & botanical cocktail station', 'Custom lemon-elderflower cake', 'Fairy light canopy'],
    mustAvoidItems: ['Overly formal seating charts', 'Single-use plastic cutlery'],
    existingBookings: ['Private garden lawn deposit paid'],
  }

  const plan = createPlanFromBrief(brief, true)
  // Give Maya's plan some initial progress to show rich dashboard
  if (plan.tasks[0]) {
    plan.tasks[0].status = 'completed'
    plan.tasks[0].completedAt = new Date().toISOString()
  }
  if (plan.tasks[1]) {
    plan.tasks[1].status = 'completed'
    plan.tasks[1].completedAt = new Date().toISOString()
  }
  if (plan.vendors[0]) {
    plan.vendors[0].status = 'booked'
    plan.vendors[0].userQuote = 85000
    plan.vendors[0].notes = 'Deposit confirmed. Includes marquee canopy for weather shelter.'
  }

  return plan
}
