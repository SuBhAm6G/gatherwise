'use client'

import React, { useState } from 'react'
import { VendorCategory, VendorStatus } from '@/lib/domain/types'
import { VendorHeader } from './VendorHeader'
import { VendorCategoryCard } from './VendorCategoryCard'

interface VendorTrackerProps {
  vendors: VendorCategory[]
  currencyCode: string
  currencyPrecision: number
  onUpdateVendorStatus: (vendorId: string, status: VendorStatus) => void
  onUpdateVendorQuote: (vendorId: string, quote: number | null) => void
  onUpdateVendorNotes: (vendorId: string, notes: string) => void
}

export function VendorTracker({
  vendors,
  currencyCode,
  currencyPrecision,
  onUpdateVendorStatus,
  onUpdateVendorQuote,
  onUpdateVendorNotes,
}: VendorTrackerProps) {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null)

  const essentialCount = vendors.filter((v) => v.essentiality === 'essential').length
  const bookedCount = vendors.filter((v) => v.status === 'booked').length

  return (
    <section aria-label="Vendor Pipeline Tracker" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Stats */}
      <VendorHeader bookedCount={bookedCount} essentialCount={essentialCount} />

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {vendors.map((vendor) => (
          <VendorCategoryCard
            key={vendor.id}
            vendor={vendor}
            currencyCode={currencyCode}
            currencyPrecision={currencyPrecision}
            isExpanded={expandedVendorId === vendor.id}
            onToggleExpand={() =>
              setExpandedVendorId(expandedVendorId === vendor.id ? null : vendor.id)
            }
            onUpdateVendorStatus={onUpdateVendorStatus}
            onUpdateVendorQuote={onUpdateVendorQuote}
            onUpdateVendorNotes={onUpdateVendorNotes}
          />
        ))}
      </div>
    </section>
  )
}
