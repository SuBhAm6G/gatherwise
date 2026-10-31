'use client'

import { EventIdea } from '@/lib/domain/types'
import { Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'

interface IdeaCardProps {
  idea: EventIdea
  onToggleSaveIdea: (idea: EventIdea) => void
}

export function IdeaCard({ idea, onToggleSaveIdea }: IdeaCardProps) {
  const isSaved = idea.isSaved

  return (
    <article
      aria-label={`Idea: ${idea.title}`}
      className={`rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between ${
        isSaved
          ? 'border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
          : 'border-white/10 bg-slate-900/60 hover:border-white/20'
      }`}
    >
      <div>
        {/* Top Bar: Title & Save Button */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-extrabold text-base text-white">{idea.title}</h3>
          <button
            type="button"
            onClick={() => onToggleSaveIdea(idea)}
            aria-label={
              isSaved ? `Unpin idea ${idea.title} from plan` : `Pin idea ${idea.title} to plan`
            }
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">{idea.explanation}</p>

        {/* Why it fits callout */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-2xs text-indigo-300 mb-4">
          <strong className="text-slate-300 font-semibold block mb-0.5">
            Why it fits your plan:
          </strong>
          {idea.whyItFits}
        </div>
      </div>

      {/* Bottom Badges */}
      <footer className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-2xs font-semibold">
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
          Effort: {idea.effort}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
          Cost: {idea.costCategory}
        </span>
        {idea.source === 'ai' ? (
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" aria-hidden="true" /> AI-Generated
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
            Offline Library
          </span>
        )}
      </footer>
    </article>
  )
}
