'use client'

import React from 'react'
import { Plus, AlertTriangle, Filter } from 'lucide-react'

interface TimelineToolbarProps {
  filter: 'all' | 'overdue' | 'upcoming' | 'completed'
  setFilter: (f: 'all' | 'overdue' | 'upcoming' | 'completed') => void
  categoryFilter: string
  setCategoryFilter: (c: string) => void
  totalCount: number
  overdueCount: number
  completedCount: number
  categories: string[]
  onOpenAddModal: () => void
}

export function TimelineToolbar({
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  totalCount,
  overdueCount,
  completedCount,
  categories,
  onOpenAddModal,
}: TimelineToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Event Timeline & Action Milestones</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic deadline schedules based on vendor lead times and your event date.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          aria-label="Add custom milestone task"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Add Custom Task
        </button>
      </div>

      <nav aria-label="Task filters" className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter tasks by status">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'overdue'}
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filter === 'overdue' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            Overdue ({overdueCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'upcoming'}
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'upcoming' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Upcoming Active
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'completed'}
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <label htmlFor="categoryFilter" className="sr-only">Filter by category</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>
      </nav>
    </div>
  )
}
