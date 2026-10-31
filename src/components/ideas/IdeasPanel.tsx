'use client'

import { useState } from 'react'
import { EventBrief, BudgetPlan, EventIdea, IdeaCostCategory, IdeaEffort } from '@/lib/domain/types'
import { getOfflineFallbackIdeas } from '@/lib/ai/fallback'
import { Sparkles, RefreshCw, Lightbulb } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { IdeaCard } from './IdeaCard'
import { IdeasToolbar } from './IdeasToolbar'

interface RawIdeaItem {
  title: string
  explanation: string
  whyItFits: string
  effort: IdeaEffort
  costCategory: IdeaCostCategory
  planningStage: string
  potentialConstraints?: string[]
  alternatives?: string[]
}

interface IdeasPanelProps {
  brief: EventBrief
  budget: BudgetPlan
  savedIdeas: EventIdea[]
  onToggleSaveIdea: (idea: EventIdea) => void
}

export function IdeasPanel({ brief, budget, savedIdeas, onToggleSaveIdea }: IdeasPanelProps) {
  const [ideas, setIdeas] = useState<EventIdea[]>(savedIdeas.length > 0 ? savedIdeas : [])
  const [isLoading, setIsLoading] = useState(false)
  const [isOfflineSource, setIsOfflineSource] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved'>('all')

  const generateIdeas = async () => {
    setIsLoading(true)
    setIsOfflineSource(false)

    try {
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, budget }),
      })

      if (!res.ok) {
        throw new Error(`AI ideas endpoint returned status ${res.status}`)
      }

      const data = await res.json()
      if (data.ideas && Array.isArray(data.ideas)) {
        const formatted: EventIdea[] = (data.ideas as RawIdeaItem[]).map((raw) => ({
          id: uuidv4(),
          title: raw.title,
          explanation: raw.explanation,
          whyItFits: raw.whyItFits,
          effort: raw.effort,
          costCategory: raw.costCategory,
          planningStage: raw.planningStage,
          potentialConstraints: raw.potentialConstraints ?? [],
          alternatives: raw.alternatives ?? [],
          source: 'ai' as const,
          generatedAt: new Date().toISOString(),
          isSaved: false,
        }))

        const combined = [
          ...savedIdeas,
          ...formatted.filter((f) => !savedIdeas.some((s) => s.title === f.title)),
        ]
        setIdeas(combined)
        return
      }

      throw new Error('Invalid format returned from ideas endpoint')
    } catch {
      const fallbackList = getOfflineFallbackIdeas(brief.eventType)
      const fallbackIdeas: EventIdea[] = fallbackList.map((f) => ({
        id: uuidv4(),
        title: f.title,
        explanation: f.explanation,
        whyItFits: f.whyItFits,
        effort: f.effort,
        costCategory: f.costCategory,
        planningStage: 'Early planning',
        potentialConstraints: [],
        alternatives: [],
        source: 'deterministic-fallback' as const,
        generatedAt: new Date().toISOString(),
        isSaved: false,
      }))

      setIsOfflineSource(true)
      const combined = [
        ...savedIdeas,
        ...fallbackIdeas.filter((f) => !savedIdeas.some((s) => s.title === f.title)),
      ]
      setIdeas(combined)
    } finally {
      setIsLoading(false)
    }
  }

  const displayedIdeas = activeFilter === 'saved' ? ideas.filter((i) => i.isSaved) : ideas

  return (
    <section
      aria-label="Event Inspiration and Brainstorming"
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Event Inspiration & Ideas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounded suggestions tailored to your budget constraints, guest headcount, and chosen
            aesthetic.
          </p>
        </div>

        <button
          type="button"
          onClick={generateIdeas}
          disabled={isLoading}
          aria-label={isLoading ? 'Generating ideas...' : 'Generate new event ideas'}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> Generating Ideas…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden="true" /> Generate Ideas
            </>
          )}
        </button>
      </header>

      {/* Toolbar & Filter Tabs */}
      <IdeasToolbar
        totalCount={ideas.length}
        savedCount={ideas.filter((i) => i.isSaved).length}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        isOfflineSource={isOfflineSource}
        eventType={brief.eventType}
      />

      {/* Ideas Grid */}
      {isLoading ? (
        <div
          aria-live="polite"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 animate-pulse"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-800/50 border border-white/5" />
          ))}
        </div>
      ) : displayedIdeas.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-white/5 bg-slate-900/40 p-8 space-y-3">
          <Lightbulb className="w-8 h-8 text-indigo-400 mx-auto" aria-hidden="true" />
          <h2 className="text-base font-bold text-white">No ideas generated yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &ldquo;Generate Ideas&rdquo; to prompt the system with your event atmosphere,
            budget, and guest count.
          </p>
          <button
            type="button"
            onClick={generateIdeas}
            aria-label="Generate initial batch of ideas"
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Generate First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onToggleSaveIdea={onToggleSaveIdea} />
          ))}
        </div>
      )}
    </section>
  )
}
