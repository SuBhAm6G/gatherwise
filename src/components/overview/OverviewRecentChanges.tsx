'use client'

import { ChangeImpactReport } from '@/lib/domain/types'
import { Clock } from 'lucide-react'

interface OverviewRecentChangesProps {
  latestChange: ChangeImpactReport | null
  onNavigateTab: (tab: string) => void
}

export function OverviewRecentChanges({ latestChange, onNavigateTab }: OverviewRecentChangesProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-purple-400" aria-hidden="true" />
        <h2 className="text-lg font-bold text-white">Recent Recalculation</h2>
      </div>

      {latestChange ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-purple-300 capitalize">
                {latestChange.changeType.replace(/-/g, ' ')}
              </span>
              <span className="text-slate-500">
                {new Date(latestChange.changedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-xs text-white leading-relaxed">{latestChange.summary}</p>
          </div>

          <div className="pt-2">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Next Action:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {latestChange.suggestedNextActions.slice(0, 2).map((action, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-sm">
          No modifications recorded yet. Any budget, date, or guest count adjustments will
          automatically recalculate dependencies here.
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
        <button
          type="button"
          onClick={() => onNavigateTab('ideas')}
          aria-label="Explore Personalized Ideas"
          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors text-center"
        >
          Explore Ideas
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab('vendors')}
          aria-label="Track Vendors"
          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors text-center"
        >
          Track Vendors
        </button>
      </div>
    </article>
  )
}
