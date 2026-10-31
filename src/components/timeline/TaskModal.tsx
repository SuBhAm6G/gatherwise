'use client'

import { useState } from 'react'
import { TaskCategory, TaskPriority } from '@/lib/domain/types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: {
    title: string
    description: string
    category: TaskCategory
    dueDate: string | null
    priority: TaskPriority
    deadlineReason: string
  }) => void
}

export function TaskModal({ isOpen, onClose, onAddTask }: TaskModalProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<TaskCategory>('logistics')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium')
  const [newReason, setNewReason] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      dueDate: newDueDate || null,
      priority: newPriority,
      deadlineReason: newReason.trim() || 'Custom organizer milestone',
    })

    setNewTitle('')
    setNewDesc('')
    setNewDueDate('')
    setNewReason('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
        <h2 id="add-task-title" className="text-lg font-bold text-white">
          Add Custom Milestone Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="taskTitle" className="font-semibold text-slate-300 block mb-1">
              Task Title{' '}
              <span className="text-rose-400" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="taskTitle"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Confirm party favors delivery"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="taskDesc" className="font-semibold text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              id="taskDesc"
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Details or deliverables required..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="taskCategory" className="font-semibold text-slate-300 block mb-1">
                Category
              </label>
              <select
                id="taskCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
                <option value="entertainment">Entertainment</option>
                <option value="photography">Photography</option>
                <option value="logistics">Logistics</option>
                <option value="accessibility">Accessibility</option>
                <option value="invitations">Invitations</option>
                <option value="cleanup">Cleanup</option>
              </select>
            </div>

            <div>
              <label htmlFor="taskPriority" className="font-semibold text-slate-300 block mb-1">
                Priority
              </label>
              <select
                id="taskPriority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="taskDueDate" className="font-semibold text-slate-300 block mb-1">
                Target Due Date
              </label>
              <input
                id="taskDueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="taskReason" className="font-semibold text-slate-300 block mb-1">
                Timeline Reason
              </label>
              <input
                id="taskReason"
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. 2 weeks before for RSVP cutoff"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
