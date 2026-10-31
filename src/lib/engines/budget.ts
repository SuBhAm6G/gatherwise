import { v4 as uuidv4 } from 'uuid'
import { BudgetPlan, BudgetCategory, EventBrief, EventType } from '@/lib/domain/types'
import { BUDGET_DEFAULTS } from '@/lib/domain/constants'

/**
 * Converts a percentage of total budget to integer minor units.
 * Uses Math.floor to prevent sum exceeding total.
 */
function percentToMinorUnits(totalMinorUnits: number, percent: number): number {
  if (totalMinorUnits < 0 || percent < 0 || percent > 100) return 0
  return Math.floor((totalMinorUnits * percent) / 100)
}

/**
 * Generates default per-event-type budget allocations.
 * NOTE: Illustrative planning ranges only — actual costs vary by region/vendor/season.
 */
export function generateBudget(brief: EventBrief): BudgetPlan {
  const defaults = BUDGET_DEFAULTS[brief.eventType as EventType] ?? BUDGET_DEFAULTS.birthday
  const contingencyPercent = 10

  const categories: BudgetCategory[] = defaults.map((def) => ({
    id: uuidv4(),
    name: def.name,
    description: getDefaultDescription(def.name),
    allocationPercent: def.percent,
    allocatedAmount: percentToMinorUnits(brief.budgetAmount, def.percent),
    estimatedSpend: percentToMinorUnits(brief.budgetAmount, def.percent),
    actualSpend: 0,
    isPerGuest: def.isPerGuest,
    isFixed: def.isFixed,
    isUserAdjusted: false,
    isContingency: def.isContingency === true,
    notes: '',
  }))

  return recalculateBudget(brief, categories, contingencyPercent)
}

/**
 * Recalculates all derived budget fields.
 * This is the SINGLE AUTHORITATIVE recalculation function.
 * AI output must NEVER override these values.
 */
export function recalculateBudget(
  brief: EventBrief,
  categories: BudgetCategory[],
  contingencyPercent: number,
): BudgetPlan {
  const recalculated = categories.map((cat) => {
    const allocated = percentToMinorUnits(brief.budgetAmount, cat.allocationPercent)
    return {
      ...cat,
      allocatedAmount: allocated,
      estimatedSpend: cat.isUserAdjusted ? cat.estimatedSpend : allocated,
    }
  })

  const totalAllocated = recalculated.reduce((sum, c) => sum + c.allocatedAmount, 0)
  const totalEstimated = recalculated.reduce((sum, c) => sum + c.estimatedSpend, 0)
  const totalActual = recalculated.reduce((sum, c) => sum + c.actualSpend, 0)

  // Use actualSpend if any has been entered, otherwise use estimated
  const compareAmount = totalActual > 0 ? totalActual : totalEstimated
  const remaining = brief.budgetAmount - compareAmount
  const isOverBudget = remaining < 0

  return {
    totalBudget: brief.budgetAmount,
    contingencyPercent,
    categories: recalculated,
    totalAllocated,
    totalEstimated,
    totalActual,
    remaining,
    isOverBudget,
    overBudgetAmount: isOverBudget ? Math.abs(remaining) : 0,
    lastCalculatedAt: new Date().toISOString(),
  }
}

/**
 * Adjusts a single category's allocation and marks it as user-adjusted.
 * Throws RangeError for invalid percent values.
 */
export function adjustCategoryAllocation(
  plan: BudgetPlan,
  brief: EventBrief,
  categoryId: string,
  newPercent: number,
): BudgetPlan {
  if (newPercent < 0 || newPercent > 100) {
    throw new RangeError(`Allocation percent must be 0–100, got ${newPercent}`)
  }
  const idx = plan.categories.findIndex((c) => c.id === categoryId)
  if (idx === -1) throw new Error(`Category ${categoryId} not found`)

  const updated = plan.categories.map((cat, i) =>
    i === idx ? { ...cat, allocationPercent: newPercent, isUserAdjusted: true } : cat,
  )
  return recalculateBudget(brief, updated, plan.contingencyPercent)
}

/**
 * Updates actual spend for a category.
 * Throws RangeError for negative spend.
 */
export function updateActualSpend(
  plan: BudgetPlan,
  brief: EventBrief,
  categoryId: string,
  actualSpend: number,
): BudgetPlan {
  if (actualSpend < 0) throw new RangeError('Actual spend cannot be negative')
  const updated = plan.categories.map((cat) =>
    cat.id === categoryId ? { ...cat, actualSpend } : cat,
  )
  return recalculateBudget(brief, updated, plan.contingencyPercent)
}

/**
 * Formats a minor-unit amount as a locale-aware currency string.
 * e.g. formatCurrency(100000, 'USD', 2) → "$1,000.00"
 */
export function formatCurrency(
  minorUnits: number,
  currencyCode: string,
  minorUnitPrecision = 2,
): string {
  const major = minorUnits / Math.pow(10, minorUnitPrecision)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: minorUnitPrecision,
      maximumFractionDigits: minorUnitPrecision,
    }).format(major)
  } catch {
    return `${currencyCode} ${major.toFixed(minorUnitPrecision)}`
  }
}

function getDefaultDescription(name: string): string {
  const map: Record<string, string> = {
    Venue: 'Rental cost of the event space including setup access',
    'Catering & Bar': 'Food, beverages, and service staff costs (per guest)',
    'Photography & Video': 'Professional photography and/or videography coverage',
    'Music & Entertainment': 'DJ, band, or other entertainment',
    'Flowers & Décor': 'Floral arrangements and decorative elements',
    'Attire & Beauty': 'Dress, suits, styling, and hair/makeup services',
    'Food & Drinks': 'All food and beverages for guests (per guest)',
    'Entertainment & Activities': 'Entertainment, games, and activities',
    'Cake & Desserts': 'Celebration cake and dessert options (per guest)',
    Decorations: 'Venue decorations and themed props',
    'Invitations & Favors': 'Invitations, party favors (per guest)',
    'Contingency Reserve': 'Buffer for unexpected costs — do not pre-allocate',
    'Equipment & AV': 'Sound systems, lighting, staging, and AV equipment',
    'Marketing & Communications': 'Event promotion, flyers, social media, signage',
    'Accessibility Services': 'Interpreters, mobility aids, accessible materials',
    'Setup & Cleanup': 'Labor and disposal costs for event setup and teardown',
    'Safety & First Aid': 'Security, first aid station, and safety equipment',
    'Invitations & Stationery': 'Save-the-dates, invitations, programs (per guest)',
    'Transport & Logistics': 'Transportation for the event party and key supplies',
    'Venue & Permits': 'Space rental, permits, and insurance for public gatherings',
    'Food & Refreshments': 'Food and non-alcoholic refreshments for attendees',
  }
  return map[name] ?? 'Event allocation category'
}
