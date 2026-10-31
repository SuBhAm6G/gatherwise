'use client'

import React from 'react'
import { EventPlan } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'
import { FolderOpen, ArrowRight, Trash2 } from 'lucide-react'

interface SavedPlansDrawerProps {
  plans: EventPlan[]
  onSelectPlan: (plan: EventPlan) => void
  onDeletePlan: (e: React.MouseEvent, id: string) => void
}

export function SavedPlansDrawer({
  plans,
  onSelectPlan,
  onDeletePlan,
}: SavedPlansDrawerProps) {
  if (plans.length === 0) return null

  return (
    <section aria-label="Saved Event Plans" className="pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-indigo-400" aria-hidden="true" /> Saved Events ({plans.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <article
            key={p.id}
            onClick={() => onSelectPlan(p)}
            aria-label={`Open event plan: ${p.brief.eventName}`}
            className="p-5 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white truncate">{p.brief.eventName}</span>
                {p.isDemoData && (
                  <span className="text-2xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    Sample
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span className="capitalize">{p.brief.eventType}</span>
                <span aria-hidden="true">•</span>
                <span>{p.brief.eventDate || 'Date unscheduled'}</span>
                <span aria-hidden="true">•</span>
                <span>{p.brief.guestCount} guests</span>
              </div>

              <div className="mt-2 text-xs font-semibold text-emerald-400">
                Budget:{' '}
                {formatCurrency(
                  p.budget.totalBudget,
                  p.brief.currencyCode,
                  p.brief.currencyMinorUnits,
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => onDeletePlan(e, p.id)}
                aria-label={`Delete event ${p.brief.eventName}`}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <div className="p-2 rounded-xl text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" aria-hidden="true">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
