'use client'

import React from 'react'
import { VendorCategory, VendorStatus } from '@/lib/domain/types'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { VendorChecklistDrawer } from './VendorChecklistDrawer'

const STATUS_STAGES: { status: VendorStatus; label: string }[] = [
  { status: 'not-started', label: 'Not Started' },
  { status: 'researching', label: 'Researching' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'quote-received', label: 'Quote Received' },
  { status: 'booked', label: 'Booked' },
]

interface VendorCategoryCardProps {
  vendor: VendorCategory
  currencyCode: string
  currencyPrecision: number
  isExpanded: boolean
  onToggleExpand: () => void
  onUpdateVendorStatus: (vendorId: string, status: VendorStatus) => void
  onUpdateVendorQuote: (vendorId: string, quote: number | null) => void
  onUpdateVendorNotes: (vendorId: string, notes: string) => void
}

export function VendorCategoryCard({
  vendor,
  currencyCode,
  currencyPrecision,
  isExpanded,
  onToggleExpand,
  onUpdateVendorStatus,
  onUpdateVendorQuote,
  onUpdateVendorNotes,
}: VendorCategoryCardProps) {
  const isBooked = vendor.status === 'booked'
  const currentStageIndex = STATUS_STAGES.findIndex((s) => s.status === vendor.status)

  return (
    <article
      aria-label={`Vendor category: ${vendor.name}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isBooked
          ? 'border-emerald-500/30 bg-emerald-950/10'
          : 'border-white/10 bg-slate-900/60 hover:border-white/15'
      }`}
    >
      <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Info & Badges */}
        <div className="min-w-0 lg:w-1/3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-white">{vendor.name}</span>
            <span
              className={`text-2xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                vendor.essentiality === 'essential'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : vendor.essentiality === 'conditional'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
              }`}
            >
              {vendor.essentiality}
            </span>
            {isBooked && (
              <span className="text-2xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Booked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{vendor.description}</p>
        </div>

        {/* Middle: Status Progression Stepper */}
        <div className="lg:w-1/3">
          <div className="flex items-center justify-between text-2xs text-slate-400 mb-1.5 font-medium">
            <span>Status Pipeline</span>
            <span className="capitalize text-indigo-300 font-semibold">{vendor.status.replace('-', ' ')}</span>
          </div>
          <nav aria-label={`Status stages for ${vendor.name}`} className="flex items-center gap-1">
            {STATUS_STAGES.map((st, idx) => {
              const isPastOrCurrent = currentStageIndex >= idx
              return (
                <button
                  key={st.status}
                  type="button"
                  onClick={() => onUpdateVendorStatus(vendor.id, st.status)}
                  aria-label={`Set status of ${vendor.name} to ${st.label}`}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    isPastOrCurrent
                      ? isBooked
                        ? 'bg-emerald-400'
                        : 'bg-indigo-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              )
            })}
          </nav>
        </div>

        {/* Right: Quote & Expand Toggle */}
        <div className="flex items-center justify-between lg:justify-end gap-4 text-xs">
          <div>
            <label htmlFor={`quote-${vendor.id}`} className="text-slate-400 block text-2xs mb-0.5">
              Agreed Quote ({currencyCode}):
            </label>
            <input
              id={`quote-${vendor.id}`}
              type="number"
              min="0"
              step="1"
              value={
                vendor.userQuote !== null
                  ? (vendor.userQuote / Math.pow(10, currencyPrecision)).toString()
                  : ''
              }
              onChange={(e) => {
                const val = parseFloat(e.target.value || '')
                onUpdateVendorQuote(
                  vendor.id,
                  isNaN(val) ? null : Math.round(val * Math.pow(10, currencyPrecision)),
                )
              }}
              placeholder="Add quote"
              className="w-28 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={isExpanded ? `Collapse checklist for ${vendor.name}` : `Expand checklist for ${vendor.name}`}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <span>Checklist</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Expanded Checklist Details */}
      {isExpanded && (
        <VendorChecklistDrawer
          vendor={vendor}
          onUpdateVendorNotes={onUpdateVendorNotes}
        />
      )}
    </article>
  )
}
