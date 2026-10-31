'use client'

import { Sparkles, PlusCircle } from 'lucide-react'

interface LandingHeroProps {
  onStartNewPlan: () => void
  onLoadDemoPlan: () => void
}

export function LandingHero({ onStartNewPlan, onLoadDemoPlan }: LandingHeroProps) {
  return (
    <section aria-label="Welcome and Event Planning Introduction" className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-pink-400" aria-hidden="true" />
          Adaptive GenAI-Powered Event Planning Assistant
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Plan less chaotically.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Celebrate more confidently.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Deterministic mathematical budget allocations, lead-time timeline recalculation, and
          grounded Gemini intelligence tailored to your exact constraints.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartNewPlan}
            aria-label="Start planning a new event"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" aria-hidden="true" /> Start Planning New Event
          </button>

          <button
            type="button"
            onClick={onLoadDemoPlan}
            aria-label="Explore interactive sample event plan"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" aria-hidden="true" /> Explore Demo Plan
            (Maya&apos;s 40th)
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl space-y-2">
          <div
            className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold"
            aria-hidden="true"
          >
            $
          </div>
          <h2 className="font-bold text-white text-base">Accurate Budget Logic</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Integer minor-unit arithmetic prevents floating-point inaccuracies. Dynamic reallocation
            ensures totals always balance with overrun warnings.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl space-y-2">
          <div
            className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold"
            aria-hidden="true"
          >
            📅
          </div>
          <h2 className="font-bold text-white text-base">Date-Fns Timeline Engine</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reverse-computed milestones from your event date based on vendor booking lead times with
            automated overdue detection.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl space-y-2">
          <div
            className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold"
            aria-hidden="true"
          >
            🤖
          </div>
          <h2 className="font-bold text-white text-base">Grounded Gemini Intelligence</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vercel AI SDK with Gemini 2.0 Flash Lite validates every output with Zod schemas. Full
            offline deterministic fallbacks when disconnected.
          </p>
        </article>
      </div>
    </section>
  )
}
