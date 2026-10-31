'use client'

import React from 'react'
import { EventType } from '@/lib/domain/types'
import { EVENT_TYPE_OPTIONS } from '@/lib/domain/constants'
import { ShieldAlert } from 'lucide-react'

interface WizardStep1GeneralProps {
  eventType: EventType
  setEventType: (t: EventType) => void
  eventName: string
  setEventName: (name: string) => void
  error?: string
}

export function WizardStep1General({
  eventType,
  setEventType,
  eventName,
  setEventName,
  error,
}: WizardStep1GeneralProps) {
  return (
    <section aria-labelledby="step1-heading" className="space-y-6">
      <h2 id="step1-heading" className="text-lg font-bold text-white mb-2">
        Step 1: Event Type & Name
      </h2>
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          What type of event are you organizing?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setEventType(opt.id)}
              aria-pressed={eventType === opt.id}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                eventType === opt.id
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/15'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <span className="font-bold text-base mb-1">{opt.label}</span>
              <span className="text-xs text-slate-400 leading-relaxed">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="eventName" className="block text-sm font-semibold text-slate-200 mb-1">
          Event Name <span className="text-rose-400" aria-hidden="true">*</span>
        </label>
        <input
          id="eventName"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g. Maya's 40th Garden Party or Alex & Sam's Wedding"
          aria-required="true"
          aria-invalid={!!error}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {error && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1" role="alert">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> {error}
          </p>
        )}
      </div>
    </section>
  )
}
