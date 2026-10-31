'use client'

import React from 'react'
import { ShieldCheck, Building } from 'lucide-react'

interface VendorHeaderProps {
  bookedCount: number
  essentialCount: number
}

export function VendorHeader({ bookedCount, essentialCount }: VendorHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Vendor Coordination & Checklists</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track consultation inquiries, received quotes, vetting questions, and contract milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>
            <strong className="text-white font-bold">{bookedCount}</strong> of{' '}
            <strong className="text-white font-bold">{essentialCount}</strong> essential categories booked
          </span>
        </div>
      </div>

      {/* Grounded Disclaimer Alert */}
      <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 text-indigo-200 text-xs flex items-start gap-3">
        <Building className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          GatherWise never fabricates fake vendor directories, artificial quotes, or phantom availability. We provide objective vetting checklists, questions to ask, contract protection items, and quote management so you stay in full control.
        </p>
      </div>
    </header>
  )
}
