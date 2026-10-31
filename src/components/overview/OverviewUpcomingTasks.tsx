'use client'

import React from 'react'
import { PlanTask } from '@/lib/domain/types'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface OverviewUpcomingTasksProps {
  upcomingTasks: PlanTask[]
  onNavigateTab: (tab: string) => void
  onCompleteTask: (taskId: string) => void
}

export function OverviewUpcomingTasks({
  upcomingTasks,
  onNavigateTab,
  onCompleteTask,
}: OverviewUpcomingTasksProps) {
  return (
    <article className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Upcoming Deadlines (Next 14 Days)</h2>
          <p className="text-xs text-slate-400">Mark completed or click to manage in Timeline</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab('timeline')}
          aria-label="View Full Timeline"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          View Full Timeline <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No tasks due in the next 14 days. You are on schedule!
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcomingTasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all text-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onCompleteTask(task.id)}
                  aria-label={`Mark task completed: ${task.title}`}
                  className="w-5 h-5 rounded border border-white/20 hover:border-emerald-400 flex items-center justify-center shrink-0 transition-colors"
                >
                  {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
                </button>
                <div className="min-w-0">
                  <span className="font-medium text-white block truncate">{task.title}</span>
                  <span className="text-xs text-slate-400">Due {task.dueDate}</span>
                </div>
              </div>
              <span
                className={`text-2xs uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                  task.priority === 'critical'
                    ? 'bg-rose-500/20 text-rose-300'
                    : task.priority === 'high'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
