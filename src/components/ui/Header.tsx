'use client'

import { Sparkles, CheckCircle2, RefreshCw, AlertCircle, PlusCircle, ArrowLeft } from 'lucide-react'
import { SaveStatus } from '@/lib/hooks/use-plan'

interface HeaderProps {
  currentTab: string
  onTabChange: (tab: string) => void
  eventName?: string
  isDemoData?: boolean
  saveStatus?: SaveStatus
  onBackToPlans?: () => void
  onNewPlan?: () => void
}

export function Header({
  currentTab,
  onTabChange,
  eventName,
  isDemoData,
  saveStatus = 'saved',
  onBackToPlans,
  onNewPlan,
}: HeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'assistant', label: 'AI Assistant' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0d19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Plan Name */}
          <div className="flex items-center gap-3 min-w-0">
            {onBackToPlans && (
              <button
                onClick={onBackToPlans}
                aria-label="Back to all plans"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GatherWise
              </span>
            </div>

            {eventName && (
              <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-white/10 text-sm truncate">
                <span className="font-medium text-slate-200 truncate">{eventName}</span>
                {isDemoData && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sample Data
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right actions: Save Status + New Plan button */}
          <div className="flex items-center gap-3">
            {eventName && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Saved locally</span>
                  </>
                )}
                {saveStatus === 'saving' && (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span className="hidden sm:inline">Saving…</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="hidden sm:inline">Unsaved changes</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline text-rose-300">Save failed</span>
                  </>
                )}
              </div>
            )}

            {onNewPlan && (
              <button
                onClick={onNewPlan}
                aria-label="Create new event"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all focus-visible:outline-2 focus-visible:outline-indigo-400"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (if plan is active) */}
        {eventName && (
          <nav
            aria-label="Event sections"
            className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none"
          >
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-indigo-400 ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold border border-white/15 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
