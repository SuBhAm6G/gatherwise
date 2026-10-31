import { EventBrief, EventType, TaskPriority } from '@/lib/domain/types'
import { TaskTemplate, COMMON_TASKS } from './tasks-common'
import { WEDDING_TASKS } from './tasks-wedding'
import { BIRTHDAY_TASKS } from './tasks-birthday'
import { COMMUNITY_TASKS } from './tasks-community'

export type { TaskTemplate }

/**
 * Returns default milestone task templates assembled by event archetype.
 *
 * @param eventType Active event archetype
 * @param brief Current event brief
 * @returns Array of TaskTemplates
 */
export function getTaskTemplates(eventType: EventType, brief: EventBrief): TaskTemplate[] {
  const needsAccessibility =
    brief.accessibilityRequirements && brief.accessibilityRequirements.length > 0

  const accessibilityTask: TaskTemplate[] = needsAccessibility
    ? [
        {
          title: 'Confirm accessibility arrangements',
          description: 'Verify ramps, seating, interpreters, and accessible facilities.',
          category: 'accessibility' as const,
          dueDaysBeforeEvent: 30,
          priority: 'critical' as TaskPriority,
          status: 'pending' as const,
          dependsOn: [] as string[],
          relatedVendorCategory: null,
          deadlineReason: 'Accessibility needs must be confirmed well in advance',
          origin: 'template' as const,
          notes: '',
        },
      ]
    : []

  const tasksByType: Record<EventType, TaskTemplate[]> = {
    wedding: [...COMMON_TASKS, ...WEDDING_TASKS, ...accessibilityTask],
    birthday: [...COMMON_TASKS, ...BIRTHDAY_TASKS],
    community: [...COMMON_TASKS, ...COMMUNITY_TASKS],
  }

  return tasksByType[eventType] ?? tasksByType.birthday
}
