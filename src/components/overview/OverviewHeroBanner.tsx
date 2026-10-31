'use client'

import React from 'react'
import { EventBrief } from '@/lib/domain/types'
import { Calendar, Users, Sparkles } from 'lucide-react'

interface OverviewHeroBannerProps {
  brief: EventBrief
  daysLeft: number | null
  onNavigateTab: (tab: string) => void
}

export function OverviewHeroBanner({ brief, daysLeft, onNavigateTab }: OverviewHeroBannerProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-purple-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {brief.eventType}
            </span>
            {daysLeft !== null && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${
                  daysLeft < 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : daysLeft <= 14
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {daysLeft < 0
                  ? `Event was ${Math.abs(daysLeft)} days ago`
                  : daysLeft === 0
                  ? 'Event is TODAY!'
                  : `${daysLeft} days to go`}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{brief.eventName}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              {brief.eventDate ? brief.eventDate : 'Date to be confirmed'}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-pink-400" aria-hidden="true" />
              {brief.guestCount} guests
            </span>
            {brief.location && (
              <span className="flex items-center gap-1.5 text-slate-400">
                📍 {brief.location}
              </span>
            )}
          </div>

          {brief.atmosphere && (
            <p className="mt-3 text-xs sm:text-sm text-slate-400 italic max-w-2xl">
              &ldquo;{brief.atmosphere}&rdquo;
            </p>
          )}
        </div>

        {/* Quick CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('assistant')}
            aria-label="Ask Planning Assistant"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Ask Planning Assistant
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('budget')}
            aria-label="Adjust Event Budget"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
          >
            Adjust Budget
          </button>
        </div>
      </div>
    </header>
  )
}
