import { v4 as uuidv4 } from 'uuid'
import { VendorCategory, EventBrief, EventType } from '@/lib/domain/types'
import { VENDOR_TEMPLATES } from '@/lib/domain/templates/vendors'

/**
 * Generates the event-specific vendor diligence checklist.
 * Initializes categories with 0 spend and unstarted status.
 * NEVER fabricates vendor quotes, prices, phone numbers, or directories.
 *
 * @param brief The active event brief
 * @returns Array of initialized VendorCategories
 */
export function generateVendors(brief: EventBrief): VendorCategory[] {
  const templates = VENDOR_TEMPLATES[brief.eventType as EventType] ?? VENDOR_TEMPLATES.birthday

  return templates.map((template) => ({
    ...template,
    id: uuidv4(),
    allocatedBudget: 0,
    userQuote: null,
    notes: '',
    relatedDeadlineTaskId: null,
    relatedBudgetCategoryId: null,
  }))
}

/**
 * Updates a vendor category's pipeline status (not-started -> researching -> contacted -> quote-received -> booked).
 *
 * @param vendors List of vendor categories
 * @param vendorId ID of vendor category to update
 * @param status New pipeline status
 * @returns Updated array of VendorCategories
 */
export function updateVendorStatus(
  vendors: VendorCategory[],
  vendorId: string,
  status: VendorCategory['status'],
): VendorCategory[] {
  return vendors.map((v) => (v.id === vendorId ? { ...v, status } : v))
}

/**
 * Records or clears a user-provided vendor quotation.
 *
 * @param vendors List of vendor categories
 * @param vendorId ID of vendor category
 * @param quote Numeric quote in minor units, or null
 * @returns Updated array of VendorCategories
 */
export function updateVendorQuote(
  vendors: VendorCategory[],
  vendorId: string,
  quote: number | null,
): VendorCategory[] {
  return vendors.map((v) => (v.id === vendorId ? { ...v, userQuote: quote } : v))
}
