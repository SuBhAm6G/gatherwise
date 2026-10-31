import { describe, it, expect } from 'vitest'
import { generateVendors, updateVendorStatus, updateVendorQuote } from '@/lib/engines/vendors'
import { EventBrief, EventType, VendorCategory } from '@/lib/domain/types'

const brief: EventBrief = {
  eventType: 'wedding',
  eventName: 'Grand Wedding',
  eventDate: '2027-01-01',
  budgetAmount: 5000000,
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 150,
  location: 'Chicago',
  atmosphere: 'Elegant',
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

describe('Vendor Engine - Comprehensive Test Suite', () => {
  describe('Vendor Category Generation', () => {
    it('generates event-type-specific vendors with checklists and questions', () => {
      const vendors = generateVendors(brief)
      expect(vendors.length).toBeGreaterThan(0)
      expect(vendors.every((v) => typeof v.id === 'string' && v.id.length > 0)).toBe(true)

      const venue = vendors.find((v) => v.name.includes('Venue'))
      expect(venue).toBeDefined()
      expect(venue?.questionsToAsk.length).toBeGreaterThan(0)
      expect(venue?.contractItemsToConfirm.length).toBeGreaterThan(0)
      expect(venue?.status).toBe('not-started')
      expect(venue?.userQuote).toBeNull()
    })

    it('generates community-specific vendors with First Aid & Safety', () => {
      const communityVendors = generateVendors({ ...brief, eventType: 'community' })
      const safety = communityVendors.find((v) => v.name.includes('First Aid'))
      expect(safety).toBeDefined()
      expect(safety?.essentiality).toBe('essential')
      expect(safety?.bookingPriority).toBeDefined()
    })

    it('generates birthday-specific vendors with cake and entertainment', () => {
      const bdayVendors = generateVendors({ ...brief, eventType: 'birthday' })
      expect(bdayVendors.length).toBeGreaterThan(0)
      const entertainment = bdayVendors.find(
        (v) =>
          v.name.toLowerCase().includes('entertainment') || v.name.toLowerCase().includes('music'),
      )
      expect(entertainment).toBeDefined()
    })

    it('falls back to birthday vendors for unmapped event types', () => {
      const fallbackVendors = generateVendors({ ...brief, eventType: 'anniversary' as EventType })
      expect(fallbackVendors.length).toBeGreaterThan(0)
      expect(fallbackVendors.every((v) => v.status === 'not-started')).toBe(true)
    })

    it('guarantees all vendor categories have informative questionsToAsk and contractItemsToConfirm', () => {
      const allTypes: EventType[] = ['wedding', 'birthday', 'community']
      for (const t of allTypes) {
        const vendors = generateVendors({ ...brief, eventType: t })
        for (const v of vendors) {
          expect(v.questionsToAsk.length).toBeGreaterThanOrEqual(1)
          expect(v.contractItemsToConfirm.length).toBeGreaterThanOrEqual(1)
          expect(v.nextAction.length).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('Vendor Status Transitions', () => {
    it('updates vendor status to all permitted statuses', () => {
      const vendors = generateVendors(brief)
      const targetId = vendors[0]!.id

      const statuses: VendorCategory['status'][] = [
        'researching',
        'contacted',
        'quote-received',
        'booked',
        'not-needed',
        'not-started',
      ]

      let current = vendors
      for (const st of statuses) {
        current = updateVendorStatus(current, targetId, st)
        const updated = current.find((v) => v.id === targetId)
        expect(updated?.status).toBe(st)
      }
    })

    it('does not mutate non-targeted vendors when updating status', () => {
      const vendors = generateVendors(brief)
      const targetId = vendors[0]!.id
      const otherId = vendors[1]!.id

      const updated = updateVendorStatus(vendors, targetId, 'booked')
      const other = updated.find((v) => v.id === otherId)
      expect(other?.status).toBe('not-started')
    })

    it('gracefully handles non-existent vendor ID in status update', () => {
      const vendors = generateVendors(brief)
      const updated = updateVendorStatus(vendors, 'unknown-id-123', 'booked')
      expect(updated).toEqual(vendors)
    })
  })

  describe('Vendor Quote Management', () => {
    it('updates vendor quote correctly with numeric amount', () => {
      const vendors = generateVendors(brief)
      const targetId = vendors[0]!.id

      const updated = updateVendorQuote(vendors, targetId, 450000)
      const target = updated.find((v) => v.id === targetId)
      expect(target?.userQuote).toBe(450000)
    })

    it('clears vendor quote when set to null', () => {
      const vendors = generateVendors(brief)
      const targetId = vendors[0]!.id

      const withQuote = updateVendorQuote(vendors, targetId, 450000)
      const cleared = updateVendorQuote(withQuote, targetId, null)
      const target = cleared.find((v) => v.id === targetId)
      expect(target?.userQuote).toBeNull()
    })

    it('handles zero quote without error', () => {
      const vendors = generateVendors(brief)
      const targetId = vendors[0]!.id

      const updated = updateVendorQuote(vendors, targetId, 0)
      const target = updated.find((v) => v.id === targetId)
      expect(target?.userQuote).toBe(0)
    })

    it('gracefully handles non-existent vendor ID in quote update', () => {
      const vendors = generateVendors(brief)
      const updated = updateVendorQuote(vendors, 'phantom-id', 12345)
      expect(updated).toEqual(vendors)
    })
  })
})
