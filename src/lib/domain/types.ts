// ─── Event Types ───────────────────────────────────────────────────────────

export type EventType = 'wedding' | 'birthday' | 'community'

export type PlanningUrgency = 'relaxed' | 'normal' | 'urgent' | 'last-minute'

export type VenuePreference = 'indoor' | 'outdoor' | 'undecided'

export type DiyPreference = 'full-diy' | 'mostly-diy' | 'mixed' | 'mostly-managed' | 'fully-managed'

export type AudienceAgeGroup =
  'children' | 'teens' | 'young-adults' | 'adults' | 'seniors' | 'mixed'

// ─── Event Brief (user input) ───────────────────────────────────────────────

export interface EventBrief {
  eventType: EventType
  eventName: string
  eventDate: string | null // ISO date YYYY-MM-DD or null
  budgetAmount: number // in minor units (e.g. cents)
  currencyCode: string // ISO 4217 e.g. "USD", "INR", "GBP"
  currencyMinorUnits: number // 2 for most currencies
  guestCount: number
  location: string
  atmosphere: string
  primaryGoals: string[]
  importantConstraints: string[]
  planningUrgency: PlanningUrgency
  startTime: string | null // "HH:MM" 24h
  endTime: string | null
  venuePreference: VenuePreference
  dietaryRequirements: string[]
  accessibilityRequirements: string[]
  diyPreference: DiyPreference
  audienceAgeGroup: AudienceAgeGroup
  culturalPreferences: string[]
  mustHaveItems: string[]
  mustAvoidItems: string[]
  existingBookings: string[]
}

// ─── Budget ────────────────────────────────────────────────────────────────

export interface BudgetCategory {
  id: string
  name: string
  description: string
  allocationPercent: number // 0–100
  allocatedAmount: number // minor units, derived
  estimatedSpend: number // minor units, engine default
  actualSpend: number // minor units, user entered
  isPerGuest: boolean
  isFixed: boolean
  isUserAdjusted: boolean
  isContingency: boolean
  notes: string
}

export interface BudgetPlan {
  totalBudget: number
  contingencyPercent: number
  categories: BudgetCategory[]
  totalAllocated: number
  totalEstimated: number
  totalActual: number
  remaining: number
  isOverBudget: boolean
  overBudgetAmount: number
  lastCalculatedAt: string // ISO datetime
}

// ─── Timeline / Tasks ──────────────────────────────────────────────────────

export type TaskCategory =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'entertainment'
  | 'decorations'
  | 'attire'
  | 'invitations'
  | 'logistics'
  | 'permits'
  | 'cleanup'
  | 'communications'
  | 'finance'
  | 'legal'
  | 'accessibility'
  | 'other'

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

export type TaskOrigin = 'template' | 'ai' | 'user'

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'skipped'

export interface PlanTask {
  id: string // stable UUID
  title: string
  description: string
  category: TaskCategory
  dueDate: string | null // ISO date YYYY-MM-DD
  dueDaysBeforeEvent: number | null // positive = before event, negative = after
  priority: TaskPriority
  status: TaskStatus
  completedAt: string | null
  dependsOn: string[] // task IDs
  relatedVendorCategory: string | null
  deadlineReason: string
  origin: TaskOrigin
  isOverdue: boolean
  isDependencyBlocked: boolean
  notes: string
}

// ─── Vendors ───────────────────────────────────────────────────────────────

export type VendorStatus =
  'not-started' | 'researching' | 'contacted' | 'quote-received' | 'booked' | 'not-needed'

export type VendorEssentiality = 'essential' | 'optional' | 'conditional'

export interface VendorCategory {
  id: string
  name: string
  description: string
  essentiality: VendorEssentiality
  bookingPriority: number
  suggestedBookingDaysBeforeEvent: number
  status: VendorStatus
  allocatedBudget: number // minor units
  userQuote: number | null // minor units
  questionsToAsk: string[]
  contractItemsToConfirm: string[]
  notes: string
  nextAction: string
  relatedDeadlineTaskId: string | null
  relatedBudgetCategoryId: string | null
}

// ─── Ideas ─────────────────────────────────────────────────────────────────

export type IdeaSource = 'ai' | 'deterministic-fallback' | 'demo'

export type IdeaCostCategory = 'free' | 'budget-friendly' | 'moderate' | 'premium'

export type IdeaEffort = 'minimal' | 'low' | 'medium' | 'high'

export interface EventIdea {
  id: string
  title: string
  explanation: string
  whyItFits: string
  effort: IdeaEffort
  costCategory: IdeaCostCategory
  planningStage: string
  potentialConstraints: string[]
  alternatives: string[]
  source: IdeaSource
  generatedAt: string
  isSaved: boolean
}

// ─── Change Impact ─────────────────────────────────────────────────────────

export type ChangeType =
  | 'budget-change'
  | 'guest-count-change'
  | 'event-date-change'
  | 'event-type-change'
  | 'priority-change'
  | 'constraint-change'

export interface ChangeImpactItem {
  area: 'budget' | 'timeline' | 'vendors' | 'ideas' | 'constraints'
  description: string
  severity: 'info' | 'warning' | 'critical'
  affectedIds: string[]
  previousValue: string
  newValue: string
}

export interface ChangeImpactReport {
  changeType: ChangeType
  changedAt: string
  summary: string
  whatChanged: string
  whatWasRecalculated: string[]
  affectedItems: ChangeImpactItem[]
  suggestedNextActions: string[]
  hasAIRecommendation: boolean
}

// ─── Connectivity ──────────────────────────────────────────────────────────

export type ConnectivityState =
  'online' | 'offline' | 'reconnecting' | 'ai-unavailable' | 'storage-degraded'

// ─── Full Plan ─────────────────────────────────────────────────────────────

export interface EventPlan {
  id: string
  schemaVersion: number
  createdAt: string
  updatedAt: string
  brief: EventBrief
  budget: BudgetPlan
  tasks: PlanTask[]
  vendors: VendorCategory[]
  ideas: EventIdea[]
  changeHistory: ChangeImpactReport[]
  isDemoData: boolean
}

// ─── Assistant ─────────────────────────────────────────────────────────────

export type AssistantMessageRole = 'user' | 'assistant' | 'system'

export interface AssistantMessage {
  id: string
  role: AssistantMessageRole
  content: string
  source: 'ai' | 'deterministic' | 'error'
  createdAt: string
  requestId: string | null
  isStreaming: boolean
  evidence?: string[]
  suggestedActions?: string[]
}
