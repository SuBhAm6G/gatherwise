import { subDays, parseISO, isAfter, isBefore, format, differenceInDays, addDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { PlanTask, EventBrief, EventType, TaskPriority } from '@/lib/domain/types'

// Task template type
type TaskTemplate = Omit<
  PlanTask,
  'id' | 'dueDate' | 'isOverdue' | 'isDependencyBlocked' | 'completedAt'
>

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function computeDueDate(eventDate: string, dueDaysBeforeEvent: number): string {
  return format(subDays(parseISO(eventDate), dueDaysBeforeEvent), 'yyyy-MM-dd')
}

function getTaskTemplates(eventType: EventType, brief: EventBrief): TaskTemplate[] {
  const needsAccessibility = brief.accessibilityRequirements && brief.accessibilityRequirements.length > 0

  const commonTasks: TaskTemplate[] = [
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

  const weddingTasks: TaskTemplate[] = [
    {
      title: 'Research and shortlist venues',
      description: 'Identify 3–5 venues that match your guest count, style, and budget.',
      category: 'venue',
      dueDaysBeforeEvent: 365,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'venue',
      deadlineReason: 'Popular wedding venues book 12–18 months in advance',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book venue',
      description: 'Sign venue contract and pay deposit.',
      category: 'venue',
      dueDaysBeforeEvent: 300,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'venue',
      deadlineReason: 'Securing the venue unlocks all other booking dates',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book caterer',
      description: 'Confirm menu, dietary options, service style, and pricing.',
      category: 'catering',
      dueDaysBeforeEvent: 270,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'catering',
      deadlineReason: 'Quality caterers fill up quickly for weekend dates',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book photographer',
      description: 'Review portfolios, schedule consultations, confirm package.',
      category: 'photography',
      dueDaysBeforeEvent: 270,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'photography',
      deadlineReason: 'Photographers book up 12+ months ahead for peak season',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Send save-the-dates',
      description: 'Send digital or printed save-the-dates to all guests.',
      category: 'invitations',
      dueDaysBeforeEvent: 240,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Guests need 6–8 months notice for destination events',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book music and entertainment',
      description: 'Hire DJ or band, confirm playlist preferences.',
      category: 'entertainment',
      dueDaysBeforeEvent: 240,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'entertainment',
      deadlineReason: 'Live bands and popular DJs book many months ahead',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Order wedding attire',
      description: 'Purchase or commission dress, suits, accessories. Allow time for fittings.',
      category: 'attire',
      dueDaysBeforeEvent: 180,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'attire',
      deadlineReason: 'Custom attire needs 4–6 months for fittings and alterations',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Send formal invitations',
      description: 'Mail or send digital invitations with RSVP deadline.',
      category: 'invitations',
      dueDaysBeforeEvent: 90,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: '6–8 weeks RSVP window allows final count for catering',
      origin: 'template',
      notes: '',
    },
    {
      title: 'RSVP deadline — collect final guest count',
      description: 'Chase late RSVPs and finalize the headcount.',
      category: 'invitations',
      dueDaysBeforeEvent: 45,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Final count needed for catering and seating',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Confirm final details with all vendors',
      description: 'Final call with venue, caterer, photographer, and others.',
      category: 'logistics',
      dueDaysBeforeEvent: 14,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Last chance to correct timing and dietary needs',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Wedding rehearsal',
      description: 'Run through the ceremony with the wedding party.',
      category: 'logistics',
      dueDaysBeforeEvent: 1,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Day-before rehearsal catches timing and cue problems',
      origin: 'template',
      notes: '',
    },
    ...(needsAccessibility
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
      : []),
  ]

  const birthdayTasks: TaskTemplate[] = [
    {
      title: 'Choose venue or location',
      description: 'Decide between home, hired venue, park, or activity centre.',
      category: 'venue',
      dueDaysBeforeEvent: 45,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'venue',
      deadlineReason: 'Venue determines capacity, activities, and catering options',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book entertainment and activities',
      description: 'Hire entertainer, book activity, or plan games.',
      category: 'entertainment',
      dueDaysBeforeEvent: 30,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'entertainment',
      deadlineReason: 'Popular entertainers book up weeks ahead on weekends',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Send invitations',
      description: 'Send invites with date, location, theme, and RSVP deadline.',
      category: 'invitations',
      dueDaysBeforeEvent: 21,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: '3 weeks gives guests time to plan and respond',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Order birthday cake',
      description: 'Choose flavour, size, and design. Order from bakery or plan DIY.',
      category: 'catering',
      dueDaysBeforeEvent: 14,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'catering',
      deadlineReason: 'Custom cakes need 1–2 weeks notice from most bakeries',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Confirm final guest count',
      description: 'Chase outstanding RSVPs and finalize numbers.',
      category: 'invitations',
      dueDaysBeforeEvent: 7,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Final count needed for catering, seating, and party bags',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Buy decorations and party supplies',
      description: 'Purchase or prepare all decorations, tableware, and party bags.',
      category: 'decorations',
      dueDaysBeforeEvent: 7,
      priority: 'medium',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Need time to assemble and verify everything is complete',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Prepare food and drinks',
      description: 'Shop for food, prep dishes, or confirm caterer delivery details.',
      category: 'catering',
      dueDaysBeforeEvent: 2,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Allows time to shop, prep, and refrigerate perishables',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Set up venue',
      description: 'Decorate, arrange seating, set up activities and audio.',
      category: 'venue',
      dueDaysBeforeEvent: 0,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Day-of setup ensures everything is ready before guests arrive',
      origin: 'template',
      notes: '',
    },
  ]

  const communityTasks: TaskTemplate[] = [
    {
      title: 'Obtain venue and permit approvals',
      description: 'Apply for park/public-space permits, public-gathering licenses.',
      category: 'permits',
      dueDaysBeforeEvent: 60,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'venue',
      deadlineReason: 'Permit applications can take 4–8 weeks for approval',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Secure venue',
      description: 'Reserve community hall, park, or outdoor space.',
      category: 'venue',
      dueDaysBeforeEvent: 60,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'venue',
      deadlineReason: 'Community venues are often booked months in advance',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Recruit volunteers',
      description: 'Identify and confirm volunteers for setup, registration, and cleanup.',
      category: 'logistics',
      dueDaysBeforeEvent: 45,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Enough lead time to brief volunteers and assign roles',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Launch event communications',
      description: 'Publish event flyers, social posts, and community announcements.',
      category: 'communications',
      dueDaysBeforeEvent: 30,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: '4 weeks allows the community to plan attendance',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Book catering or food vendors',
      description: 'Arrange food trucks, catering, or coordinate community potluck.',
      category: 'catering',
      dueDaysBeforeEvent: 30,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'catering',
      deadlineReason: 'Food vendors need advance booking for large groups',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Arrange equipment and AV',
      description: 'Source sound system, tents, tables, chairs, and AV equipment.',
      category: 'logistics',
      dueDaysBeforeEvent: 21,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: 'equipment',
      deadlineReason: 'Equipment hire companies need 3+ weeks notice for large orders',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Confirm accessibility arrangements',
      description: 'Verify accessible pathways, signage, seating, and support services.',
      category: 'accessibility',
      dueDaysBeforeEvent: 14,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Public events must be accessible to all community members',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Brief volunteers on roles and safety',
      description: 'Run volunteer orientation covering roles, emergencies, and schedule.',
      category: 'logistics',
      dueDaysBeforeEvent: 3,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Final briefing ensures everyone knows their responsibilities',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Site setup and safety check',
      description: 'Set up all equipment, check safety measures, do a final walkthrough.',
      category: 'logistics',
      dueDaysBeforeEvent: 0,
      priority: 'critical',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Day-of safety check is non-negotiable for public events',
      origin: 'template',
      notes: '',
    },
    {
      title: 'Post-event cleanup and site restoration',
      description: 'Coordinate volunteer cleanup and restore site to original condition.',
      category: 'cleanup',
      dueDaysBeforeEvent: -1,
      priority: 'high',
      status: 'pending',
      dependsOn: [],
      relatedVendorCategory: null,
      deadlineReason: 'Most venues require same-day or next-day site restoration',
      origin: 'template',
      notes: '',
    },
  ]

  const tasksByType: Record<EventType, TaskTemplate[]> = {
    wedding: [...commonTasks, ...weddingTasks],
    birthday: [...commonTasks, ...birthdayTasks],
    community: [...commonTasks, ...communityTasks],
  }

  return tasksByType[eventType] ?? tasksByType.birthday
}

/**
 * Generates the full task list for an event.
 * Tasks get stable UUIDs and computed due dates from the event date.
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
 */
export function refreshTaskStatuses(tasks: PlanTask[]): PlanTask[] {
  const today = todayString()
  const completedIds = new Set(
    tasks
      .filter((t) => t.status === 'completed' || t.status === 'skipped')
      .map((t) => t.id),
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
 * ALWAYS preserves: IDs, completion state, user-created tasks, notes.
 */
export function rescheduleTasks(existingTasks: PlanTask[], newEventDate: string | null): PlanTask[] {
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

/** Returns tasks due in the next N days, sorted by due date */
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

/** Returns all overdue tasks, sorted by priority then due date */
export function getOverdueTasks(tasks: PlanTask[]): PlanTask[] {
  const priorityOrder: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 }
  return tasks
    .filter((t) => t.isOverdue)
    .sort((a, b) => {
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      return pDiff !== 0 ? pDiff : (a.dueDate ?? '').localeCompare(b.dueDate ?? '')
    })
}

/** Days until the event from today. Negative if past. Returns null if date is not set or invalid. */
export function daysUntilEvent(eventDate: string | null | undefined): number | null {
  if (!eventDate) return null
  try {
    return differenceInDays(parseISO(eventDate), parseISO(todayString()))
  } catch {
    return null
  }
}
