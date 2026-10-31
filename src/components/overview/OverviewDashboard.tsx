'use client'

import React from 'react'
import { EventPlan } from '@/lib/domain/types'
import { daysUntilEvent, getOverdueTasks, getUpcomingTasks } from '@/lib/engines/timeline'
import { AlertTriangle } from 'lucide-react'
import { OverviewHeroBanner } from './OverviewHeroBanner'
import { OverviewKpiCards } from './OverviewKpiCards'
import { OverviewUpcomingTasks } from './OverviewUpcomingTasks'
import { OverviewRecentChanges } from './OverviewRecentChanges'

interface OverviewDashboardProps {
  plan: EventPlan
  onNavigateTab: (tab: string) => void
  onCompleteTask: (taskId: string) => void
}

export function OverviewDashboard({ plan, onNavigateTab, onCompleteTask }: OverviewDashboardProps) {
  const { brief, budget, tasks, vendors, changeHistory } = plan

  const daysLeft = brief.eventDate ? daysUntilEvent(brief.eventDate) : null
  const overdueTasks = getOverdueTasks(tasks)
  const upcomingTasks = getUpcomingTasks(tasks, 14)

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalTasks = tasks.length
  const taskPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const essentialVendors = vendors.filter((v) => v.essentiality === 'essential')
  const bookedVendors = vendors.filter((v) => v.status === 'booked')

  const currencyCode = brief.currencyCode
  const precision = brief.currencyMinorUnits

  const latestChange = changeHistory.length > 0 ? changeHistory[changeHistory.length - 1] : null

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Hero Event Banner */}
      <OverviewHeroBanner brief={brief} daysLeft={daysLeft} onNavigateTab={onNavigateTab} />

      {/* 2. Critical Overdue Warning Banner */}
      {overdueTasks.length > 0 && (
        <section
          role="alert"
          aria-labelledby="overdue-alert-heading"
          className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 sm:p-5 text-rose-200 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="overdue-alert-heading" className="font-bold text-sm sm:text-base text-white">
                {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} require immediate attention!
              </h2>
              <p className="text-xs text-rose-300 mt-0.5">
                Milestones past their recommended timeline may jeopardize bookings or supply delivery.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('timeline')}
            aria-label="Review Overdue Tasks"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Review Overdue Tasks
          </button>
        </section>
      )}

      {/* 3. Core Metrics Grid */}
      <OverviewKpiCards
        budget={budget}
        currencyCode={currencyCode}
        precision={precision}
        taskPercent={taskPercent}
        completedCount={completedCount}
        totalTasks={totalTasks}
        bookedVendors={bookedVendors}
        essentialVendors={essentialVendors}
        ideas={plan.ideas}
      />

      {/* 4. Two Column Content: Upcoming Deadlines & Recent Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewUpcomingTasks
          upcomingTasks={upcomingTasks}
          onNavigateTab={onNavigateTab}
          onCompleteTask={onCompleteTask}
        />
        <OverviewRecentChanges
          latestChange={latestChange ?? null}
          onNavigateTab={onNavigateTab}
        />
      </div>
    </div>
  )
}
