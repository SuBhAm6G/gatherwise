'use client'

import { Bookmark, Lightbulb } from 'lucide-react'

interface IdeasToolbarProps {
  totalCount: number
  savedCount: number
  activeFilter: 'all' | 'saved'
  onSelectFilter: (filter: 'all' | 'saved') => void
  isOfflineSource: boolean
  eventType: string
}

export function IdeasToolbar({
  totalCount,
  savedCount,
  activeFilter,
  onSelectFilter,
  isOfflineSource,
  eventType,
}: IdeasToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Mode Source Banner */}
      {isOfflineSource && (
        <div
          role="status"
          className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-200 text-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>
              <strong>Offline Mode:</strong> Showing deterministic planning suggestions curated for{' '}
              {eventType}s. Connect to internet for live AI generation.
            </span>
          </div>
          <span className="text-2xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
            Offline Library
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <nav
        aria-label="Idea filters"
        className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-semibold"
      >
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          aria-label={`Show all ideas, ${totalCount} available`}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeFilter === 'all'
              ? 'bg-white/10 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Ideas ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => onSelectFilter('saved')}
          aria-label={`Show pinned ideas, ${savedCount} saved`}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeFilter === 'saved'
              ? 'bg-indigo-600 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
          Saved & Pinned ({savedCount})
        </button>
      </nav>
    </div>
  )
}
