import { PlanTask } from '@/lib/domain/types'

export type TaskTemplate = Omit<
  PlanTask,
  'id' | 'dueDate' | 'isOverdue' | 'isDependencyBlocked' | 'completedAt'
>

export const COMMON_TASKS: TaskTemplate[] = [
  {
    title: 'Confirm event date and time',
    description: 'Lock in your date. All planning deadlines depend on this.',
    category: 'logistics',
    dueDaysBeforeEvent: null,
    priority: 'critical',
    status: 'pending',
    dependsOn: [],
    relatedVendorCategory: null,
    deadlineReason: 'All timelines depend on a confirmed date',
    origin: 'template',
    notes: '',
  },
  {
    title: 'Set your overall budget',
    description: 'Decide your maximum total spend and contingency reserve.',
    category: 'finance',
    dueDaysBeforeEvent: null,
    priority: 'critical',
    status: 'pending',
    dependsOn: [],
    relatedVendorCategory: null,
    deadlineReason: 'Budget guides every planning decision',
    origin: 'template',
    notes: '',
  },
]

