import { z } from 'zod'

export const CURRENT_SCHEMA_VERSION = 1

export const EventTypeSchema = z.enum(['wedding', 'birthday', 'community'])

export const PlanningUrgencySchema = z.enum(['relaxed', 'normal', 'urgent', 'last-minute'])

export const VenuePreferenceSchema = z.enum(['indoor', 'outdoor', 'undecided'])

export const DiyPreferenceSchema = z.enum([
  'full-diy',
  'mostly-diy',
  'mixed',
  'mostly-managed',
  'fully-managed',
])

export const AudienceAgeGroupSchema = z.enum([
  'children',
  'teens',
  'young-adults',
  'adults',
  'seniors',
  'mixed',
])

export const EventBriefSchema = z.object({
  eventType: EventTypeSchema,
  eventName: z.string().min(1).max(100),
  eventDate: z.string().nullable(),
  budgetAmount: z.number().int().nonnegative(),
  currencyCode: z.string().min(3).max(3),
  currencyMinorUnits: z.number().int().min(0).max(4),
  guestCount: z.number().int().min(1).max(10000),
  location: z.string().max(200),
  atmosphere: z.string().max(200),
  primaryGoals: z.array(z.string().max(100)),
  importantConstraints: z.array(z.string().max(200)),
  planningUrgency: PlanningUrgencySchema,
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  venuePreference: VenuePreferenceSchema,
  dietaryRequirements: z.array(z.string().max(100)),
  accessibilityRequirements: z.array(z.string().max(100)),
  diyPreference: DiyPreferenceSchema,
  audienceAgeGroup: AudienceAgeGroupSchema,
  culturalPreferences: z.array(z.string().max(100)),
  mustHaveItems: z.array(z.string().max(100)),
  mustAvoidItems: z.array(z.string().max(100)),
  existingBookings: z.array(z.string().max(100)),
})

export const BudgetCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(300),
  allocationPercent: z.number().min(0).max(100),
  allocatedAmount: z.number().int().nonnegative(),
  estimatedSpend: z.number().int().nonnegative(),
  actualSpend: z.number().int().nonnegative(),
  isPerGuest: z.boolean(),
  isFixed: z.boolean(),
  isUserAdjusted: z.boolean(),
  isContingency: z.boolean(),
  notes: z.string().max(1000),
})

export const BudgetPlanSchema = z.object({
  totalBudget: z.number().int().nonnegative(),
  contingencyPercent: z.number().min(0).max(100),
  categories: z.array(BudgetCategorySchema),
  totalAllocated: z.number().int().nonnegative(),
  totalEstimated: z.number().int().nonnegative(),
  totalActual: z.number().int().nonnegative(),
  remaining: z.number().int(),
  isOverBudget: z.boolean(),
  overBudgetAmount: z.number().int().nonnegative(),
  lastCalculatedAt: z.string(),
})

export const TaskCategorySchema = z.enum([
  'venue',
  'catering',
  'photography',
  'entertainment',
  'decorations',
  'attire',
  'invitations',
  'logistics',
  'permits',
  'cleanup',
  'communications',
  'finance',
  'legal',
  'accessibility',
  'other',
])

export const TaskPrioritySchema = z.enum(['critical', 'high', 'medium', 'low'])
export const TaskOriginSchema = z.enum(['template', 'ai', 'user'])
export const TaskStatusSchema = z.enum([
  'pending',
  'in-progress',
  'completed',
  'blocked',
  'skipped',
])

export const PlanTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
  category: TaskCategorySchema,
  dueDate: z.string().nullable(),
  dueDaysBeforeEvent: z.number().nullable(),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  completedAt: z.string().nullable(),
  dependsOn: z.array(z.string()),
  relatedVendorCategory: z.string().nullable(),
  deadlineReason: z.string().max(500),
  origin: TaskOriginSchema,
  isOverdue: z.boolean(),
  isDependencyBlocked: z.boolean(),
  notes: z.string().max(2000),
})

export const VendorStatusSchema = z.enum([
  'not-started',
  'researching',
  'contacted',
  'quote-received',
  'booked',
  'not-needed',
])

export const VendorEssentialitySchema = z.enum(['essential', 'optional', 'conditional'])

export const VendorCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  essentiality: VendorEssentialitySchema,
  bookingPriority: z.number().int(),
  suggestedBookingDaysBeforeEvent: z.number().int(),
  status: VendorStatusSchema,
  allocatedBudget: z.number().int().nonnegative(),
  userQuote: z.number().int().nullable(),
  questionsToAsk: z.array(z.string().max(300)),
  contractItemsToConfirm: z.array(z.string().max(300)),
  notes: z.string().max(2000),
  nextAction: z.string().max(300),
  relatedDeadlineTaskId: z.string().nullable(),
  relatedBudgetCategoryId: z.string().nullable(),
})

export const IdeaSourceSchema = z.enum(['ai', 'deterministic-fallback', 'demo'])
export const IdeaCostCategorySchema = z.enum(['free', 'budget-friendly', 'moderate', 'premium'])
export const IdeaEffortSchema = z.enum(['minimal', 'low', 'medium', 'high'])

export const EventIdeaSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  explanation: z.string().max(1000),
  whyItFits: z.string().max(500),
  effort: IdeaEffortSchema,
  costCategory: IdeaCostCategorySchema,
  planningStage: z.string().max(200),
  potentialConstraints: z.array(z.string().max(300)),
  alternatives: z.array(z.string().max(300)),
  source: IdeaSourceSchema,
  generatedAt: z.string(),
  isSaved: z.boolean(),
})

export const ChangeTypeSchema = z.enum([
  'budget-change',
  'guest-count-change',
  'event-date-change',
  'event-type-change',
  'priority-change',
  'constraint-change',
])

export const ChangeImpactItemSchema = z.object({
  area: z.enum(['budget', 'timeline', 'vendors', 'ideas', 'constraints']),
  description: z.string().max(300),
  severity: z.enum(['info', 'warning', 'critical']),
  affectedIds: z.array(z.string()),
  previousValue: z.string(),
  newValue: z.string(),
})

export const ChangeImpactReportSchema = z.object({
  changeType: ChangeTypeSchema,
  changedAt: z.string(),
  summary: z.string().max(500),
  whatChanged: z.string().max(300),
  whatWasRecalculated: z.array(z.string()),
  affectedItems: z.array(ChangeImpactItemSchema),
  suggestedNextActions: z.array(z.string()),
  hasAIRecommendation: z.boolean(),
})

export const EventPlanSchema = z.object({
  id: z.string().uuid(),
  schemaVersion: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
  brief: EventBriefSchema,
  budget: BudgetPlanSchema,
  tasks: z.array(PlanTaskSchema),
  vendors: z.array(VendorCategorySchema),
  ideas: z.array(EventIdeaSchema),
  changeHistory: z.array(ChangeImpactReportSchema),
  isDemoData: z.boolean(),
})
