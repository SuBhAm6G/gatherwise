import { subDays, parseISO, isAfter, isBefore, format, differenceInDays, addDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { PlanTask, EventBrief, EventType, TaskPriority } from '@/lib/domain/types'
import { getTaskTemplates } from '@/lib/domain/templates/tasks'

/**
 * Returns today's date formatted as ISO YYYY-MM-DD.
 */
function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Computes an ISO due date given an event date string and days before the event.
 */
function computeDueDate(eventDate: string, dueDaysBeforeEvent: number): string {
  return format(subDays(parseISO(eventDate), dueDaysBeforeEvent), 'yyyy-MM-dd')
}

/**
 * Generates the full task list for an event.
 * Tasks receive stable UUIDs and computed due dates from the event date.
 *
 * @param brief The active event brief
 * @returns Array of initialized PlanTasks
 */
export function generateTimeline(brief: EventBrief): PlanTask[] {
  const templates = getTaskTemplates(brief.eventType as EventType, brief)
  const today = todayString()

  return templates.map((template) => {
    const dueDate =
      brief.eventDate !== null && template.dueDaysBeforeEvent !== null
        ? computeDueDate(brief.eventDate, template.dueDaysBeforeEvent)
        : null

    const isOverdue =
      dueDate !== null &&
      template.status !== 'completed' &&
      template.status !== 'skipped' &&
      isBefore(parseISO(dueDate), parseISO(today))

    return {
      ...template,
      id: uuidv4(),
      dueDate,
      isOverdue,
      isDependencyBlocked: false,
      completedAt: null,
    }
  })
}

/**
 * Re-computes isOverdue and isDependencyBlocked for all tasks.
 * Call after any task status change, date change, or plan reload.
 *
 * @param tasks Current list of plan tasks
 * @returns Refreshed array of tasks with updated status flags
 */
export function refreshTaskStatuses(tasks: PlanTask[]): PlanTask[] {
  const today = todayString()
  const completedIds = new Set(
    tasks.filter((t) => t.status === 'completed' || t.status === 'skipped').map((t) => t.id),
  )

  return tasks.map((task) => ({
    ...task,
    isOverdue:
      task.dueDate !== null &&
      task.status !== 'completed' &&
      task.status !== 'skipped' &&
      isBefore(parseISO(task.dueDate), parseISO(today)),
    isDependencyBlocked:
      task.dependsOn.length > 0 && task.dependsOn.some((id) => !completedIds.has(id)),
  }))
}

/**
 * Reschedules template-origin tasks when the event date changes.
 * ALWAYS preserves: IDs, completion state, user-created tasks, and notes.
 *
 * @param existingTasks Current list of tasks
 * @param newEventDate New ISO event date or null
 * @returns Rescheduled tasks with updated lead times
 */
export function rescheduleTasks(
  existingTasks: PlanTask[],
  newEventDate: string | null,
): PlanTask[] {
  const today = todayString()

  const rescheduled = existingTasks.map((task) => {
    if (task.origin === 'user' || task.dueDaysBeforeEvent === null || newEventDate === null) {
      return task
    }

    const newDueDate = computeDueDate(newEventDate, task.dueDaysBeforeEvent)
    const isOverdue =
      task.status !== 'completed' &&
      task.status !== 'skipped' &&
      isBefore(parseISO(newDueDate), parseISO(today))

    return { ...task, dueDate: newDueDate, isOverdue }
  })

  return refreshTaskStatuses(rescheduled)
}

/**
 * Returns tasks due in the next N days, sorted by due date.
 *
 * @param tasks Current task list
 * @param daysAhead Rolling days window (defaults to 7)
 * @returns Filtered upcoming tasks
 */
export function getUpcomingTasks(tasks: PlanTask[], daysAhead = 7): PlanTask[] {
  const today = parseISO(todayString())
  const cutoff = addDays(today, daysAhead)

  return tasks
    .filter((t) => {
      if (t.status === 'completed' || t.status === 'skipped' || !t.dueDate) return false
      const due = parseISO(t.dueDate)
      return !isBefore(due, today) && !isAfter(due, cutoff)
    })
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
}

/**
 * Returns all overdue tasks, sorted by priority then due date.
 *
 * @param tasks Current task list
 * @returns Sorted array of overdue tasks
 */
export function getOverdueTasks(tasks: PlanTask[]): PlanTask[] {
  const priorityOrder: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return tasks
    .filter((t) => t.isOverdue)
    .sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      return pDiff !== 0 ? pDiff : (a.dueDate ?? '').localeCompare(b.dueDate ?? '')
    })
}

/**
 * Days until the event from today. Negative if past. Returns null if date is not set or invalid.
 *
 * @param eventDate Event date string
 * @returns Days difference or null
 */
export function daysUntilEvent(eventDate: string | null | undefined): number | null {
  if (!eventDate) return null
  try {
    return differenceInDays(parseISO(eventDate), parseISO(todayString()))
  } catch {
    return null
  }
}
