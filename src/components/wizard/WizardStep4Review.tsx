'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

interface WizardStep4ReviewProps {
  eventName: string
  eventType: string
  eventDate: string
  hasNoDateYet: boolean
  guestCount: string
  currencyCode: string
  budgetAmountMajor: string
  planningUrgency: string
  atmosphere: string
  accessibilityRequirements: string[]
  dietaryRequirements: string[]
}

export function WizardStep4Review({
  eventName,
  eventType,
  eventDate,
  hasNoDateYet,
  guestCount,
  currencyCode,
  budgetAmountMajor,
  planningUrgency,
  atmosphere,
  accessibilityRequirements,
  dietaryRequirements,
}: WizardStep4ReviewProps) {
  return (
    <section aria-labelledby="step4-heading" className="space-y-6">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-sm">
        <h2 id="step4-heading" className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" aria-hidden="true" /> Plan Summary Preview
        </h2>

        <div className="grid grid-cols-2 gap-3 text-slate-300">
          <div>
            <span className="text-xs text-slate-500 block">Event Name</span>
            <span className="font-semibold text-white">{eventName}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Event Type</span>
            <span className="font-semibold text-white capitalize">{eventType}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Date</span>
            <span className="font-semibold text-white">{hasNoDateYet || !eventDate ? 'Date unconfirmed' : eventDate}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Guests</span>
            <span className="font-semibold text-white">{guestCount} people</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Budget</span>
            <span className="font-semibold text-emerald-400">
              {currencyCode} {parseFloat(budgetAmountMajor || '0').toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Urgency</span>
            <span className="font-semibold text-white capitalize">{planningUrgency}</span>
          </div>
        </div>

        {atmosphere && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-xs text-slate-500 block">Atmosphere</span>
            <p className="text-xs text-slate-300 italic">{atmosphere}</p>
          </div>
        )}

        {(accessibilityRequirements.length > 0 || dietaryRequirements.length > 0) && (
          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
            {accessibilityRequirements.map((r, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ♿ {r}
              </span>
            ))}
            {dietaryRequirements.map((d, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🌱 {d}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
        Upon creation, GatherWise will calculate deterministic budget allocations across key categories, build a timeline with due dates relative to your event date, and generate essential vendor checklists.
      </div>
    </section>
  )
}
