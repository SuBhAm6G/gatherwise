'use client'

import { PlanTask, TaskStatus } from '@/lib/domain/types'
import { Calendar, CheckCircle2, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

interface TimelineTaskCardProps {
  task: PlanTask
  isExpanded: boolean
  onToggleExpand: () => void
  onCompleteTask: (taskId: string) => void
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void
  onUpdateTaskNotes: (taskId: string, notes: string) => void
  onDeleteTask: (taskId: string) => void
}

export function TimelineTaskCard({
  task,
  isExpanded,
  onToggleExpand,
  onCompleteTask,
  onUpdateTaskStatus,
  onUpdateTaskNotes,
  onDeleteTask,
}: TimelineTaskCardProps) {
  const isCompleted = task.status === 'completed'

  return (
    <article
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        task.isOverdue
          ? 'border-rose-500/30 bg-rose-950/20'
          : isCompleted
            ? 'border-white/5 bg-slate-900/40 opacity-75'
            : 'border-white/10 bg-slate-900/60 hover:border-white/20'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
        {/* Left: Checkbox + Title + Metadata */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => onCompleteTask(task.id)}
            aria-label={`Toggle task completion: ${task.title}`}
            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'border-white/20 hover:border-indigo-400 hover:bg-indigo-500/10'
            }`}
          >
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-bold text-sm sm:text-base ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}
              >
                {task.title}
              </span>

              {task.isOverdue && (
                <span className="px-2 py-0.5 rounded-full text-2xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" /> Overdue
                </span>
              )}

              <span className="px-2 py-0.5 rounded-full text-2xs font-semibold capitalize bg-white/5 text-slate-300 border border-white/5">
                {task.category}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-2xs font-semibold uppercase ${
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

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                {task.dueDate ? `Due: ${task.dueDate}` : 'Date unscheduled'}
              </span>
              {task.dueDaysBeforeEvent !== null && (
                <span>({task.dueDaysBeforeEvent} days before event)</span>
              )}
              {task.origin === 'user' && (
                <span className="text-2xs px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                  Custom
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions: Expand Chevron & Delete */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={
              isExpanded ? `Collapse milestone: ${task.title}` : `Expand milestone: ${task.title}`
            }
            aria-expanded={isExpanded}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          {task.origin === 'user' && (
            <button
              type="button"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`Delete milestone: ${task.title}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-1 sm:px-6 border-t border-white/5 space-y-4 text-xs text-slate-300 bg-white/[0.01]">
          {task.description && (
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Description:</span>
              <p className="text-slate-200">{task.description}</p>
            </div>
          )}

          {task.deadlineReason && (
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Timeline Rationale:</span>
              <p className="text-indigo-300 italic">{task.deadlineReason}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label
                htmlFor={`status-${task.id}`}
                className="font-semibold text-slate-400 block mb-1"
              >
                Status State:
              </label>
              <select
                id={`status-${task.id}`}
                value={task.status}
                onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="skipped">Skipped / Not Needed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`notes-${task.id}`}
                className="font-semibold text-slate-400 block mb-1"
              >
                Organizer Notes:
              </label>
              <input
                id={`notes-${task.id}`}
                type="text"
                defaultValue={task.notes}
                onBlur={(e) => onUpdateTaskNotes(task.id, e.target.value)}
                placeholder="Add contractor notes or confirmations..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
