'use client'

import React, { useState } from 'react'
import { PlanTask, TaskCategory, TaskPriority, TaskStatus } from '@/lib/domain/types'
import { TimelineToolbar } from './TimelineToolbar'
import { TimelineTaskCard } from './TimelineTaskCard'
import { TaskModal } from './TaskModal'

interface TimelineManagerProps {
  tasks: PlanTask[]
  onCompleteTask: (taskId: string) => void
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void
  onUpdateTaskNotes: (taskId: string, notes: string) => void
  onAddTask: (task: {
    title: string
    description: string
    category: TaskCategory
    dueDate: string | null
    priority: TaskPriority
    deadlineReason: string
  }) => void
  onDeleteTask: (taskId: string) => void
}

export function TimelineManager({
  tasks,
  onCompleteTask,
  onUpdateTaskStatus,
  onUpdateTaskNotes,
  onAddTask,
  onDeleteTask,
}: TimelineManagerProps) {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'overdue' && !t.isOverdue) return false
    if (filter === 'completed' && t.status !== 'completed') return false
    if (filter === 'upcoming' && (t.status === 'completed' || t.isOverdue || !t.dueDate)) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    return true
  })

  const categories = Array.from(new Set(tasks.map((t) => t.category)))
  const overdueCount = tasks.filter((t) => t.isOverdue).length
  const completedCount = tasks.filter((t) => t.status === 'completed').length

  return (
    <section aria-labelledby="timeline-heading" className="space-y-6 max-w-7xl mx-auto pb-12">
      <TimelineToolbar
        filter={filter}
        setFilter={setFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        totalCount={tasks.length}
        overdueCount={overdueCount}
        completedCount={completedCount}
        categories={categories}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* Task List */}
      <div className="space-y-3" role="feed" aria-label="Milestone tasks list">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm rounded-2xl border border-white/5 bg-slate-900/40">
            No milestones match the selected filter criteria.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TimelineTaskCard
              key={task.id}
              task={task}
              isExpanded={expandedTaskId === task.id}
              onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
              onCompleteTask={onCompleteTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
              onUpdateTaskNotes={onUpdateTaskNotes}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={onAddTask}
      />
    </section>
  )
}
