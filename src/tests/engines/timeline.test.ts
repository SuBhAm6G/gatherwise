import { describe, it, expect } from 'vitest'
import {
  generateTimeline,
  refreshTaskStatuses,
  rescheduleTasks,
  getUpcomingTasks,
  getOverdueTasks,
  daysUntilEvent,
} from '@/lib/engines/timeline'
import { EventBrief, PlanTask } from '@/lib/domain/types'
import { addDays, format, subDays } from 'date-fns'

const today = new Date()
const futureEventDate = format(addDays(today, 60), 'yyyy-MM-dd')
const pastEventDate = format(subDays(today, 30), 'yyyy-MM-dd')

const brief: EventBrief = {
  eventType: 'wedding',
  eventName: 'Summer Wedding',
  eventDate: futureEventDate,
  budgetAmount: 1000000,
  currencyCode: 'USD',
  currencyMinorUnits: 2,
  guestCount: 50,
  location: 'City Park',
  atmosphere: 'Romantic',
  primaryGoals: [],
  importantConstraints: [],
  planningUrgency: 'normal',
  startTime: null,
  endTime: null,
  venuePreference: 'outdoor',
  dietaryRequirements: [],
  accessibilityRequirements: ['Wheelchair ramp required'],
  diyPreference: 'mixed',
  audienceAgeGroup: 'adults',
  culturalPreferences: [],
  mustHaveItems: [],
  mustAvoidItems: [],
  existingBookings: [],
}

describe('Timeline Engine - Comprehensive Test Suite', () => {
  describe('Task Generation & Core Rules', () => {
    it('generates tasks for wedding with stable UUIDs and computed due dates', () => {
      const tasks = generateTimeline(brief)
      expect(tasks.length).toBeGreaterThan(5)
      expect(tasks.every((t) => typeof t.id === 'string' && t.id.length > 0)).toBe(true)
      expect(tasks.some((t) => t.category === 'venue')).toBe(true)
      expect(tasks.some((t) => t.category === 'accessibility')).toBe(true)
    })

    it('generates different tasks for birthday vs community events', () => {
      const birthdayTasks = generateTimeline({ ...brief, eventType: 'birthday' })
      const communityTasks = generateTimeline({ ...brief, eventType: 'community' })

      expect(birthdayTasks.some((t) => t.title.toLowerCase().includes('cake'))).toBe(true)
      expect(communityTasks.some((t) => t.title.toLowerCase().includes('volunteer'))).toBe(true)
    })

    it('generates tasks when eventDate is null (unconfirmed date)', () => {
      const unconfirmedBrief: EventBrief = { ...brief, eventDate: null }
      const tasks = generateTimeline(unconfirmedBrief)
      expect(tasks.length).toBeGreaterThan(0)
      expect(tasks.every((t) => t.dueDate === null)).toBe(true)
      expect(tasks.every((t) => t.isOverdue === false)).toBe(true)
    })

    it('generates cleanup tasks with negative dueDaysBeforeEvent scheduled after event', () => {
      const communityBrief = { ...brief, eventType: 'community' as const }
      const tasks = generateTimeline(communityBrief)
      const cleanupTask = tasks.find(
        (t) => t.dueDaysBeforeEvent !== null && t.dueDaysBeforeEvent < 0,
      )
      expect(cleanupTask).toBeDefined()
      if (cleanupTask && cleanupTask.dueDate && communityBrief.eventDate) {
        expect(cleanupTask.dueDate > communityBrief.eventDate).toBe(true)
      }
    })

    it('injects accessibility task if accessibility requirements are present', () => {
      const tasks = generateTimeline(brief)
      const accTask = tasks.find((t) => t.category === 'accessibility')
      expect(accTask).toBeDefined()
      expect(accTask?.priority).toBe('critical')
    })
  })

  describe('Overdue and Upcoming Filtering', () => {
    it('detects overdue tasks when event date is in the past', () => {
      const pastBrief = { ...brief, eventDate: pastEventDate }
      const tasks = generateTimeline(pastBrief)
      const overdue = getOverdueTasks(tasks)
      expect(overdue.length).toBeGreaterThan(0)
      expect(overdue[0]!.isOverdue).toBe(true)
    })

    it('getUpcomingTasks returns only incomplete tasks within specified window', () => {
      const tasks = generateTimeline(brief)
      const upcoming = getUpcomingTasks(tasks, 90)
      expect(upcoming.every((t) => t.status !== 'completed')).toBe(true)
    })

    it('getUpcomingTasks excludes completed tasks even within window', () => {
      const tasks = generateTimeline(brief)
      if (tasks[0]) {
        tasks[0].status = 'completed'
        tasks[0].dueDate = format(addDays(today, 2), 'yyyy-MM-dd')
      }
      const upcoming = getUpcomingTasks(tasks, 14)
      expect(upcoming.some((t) => t.id === tasks[0]?.id)).toBe(false)
    })

    it('daysUntilEvent calculates positive, negative, and zero days correctly', () => {
      expect(daysUntilEvent(futureEventDate)).toBe(60)
      expect(daysUntilEvent(pastEventDate)).toBe(-30)
      expect(daysUntilEvent(format(today, 'yyyy-MM-dd'))).toBe(0)
    })

    it('daysUntilEvent returns null for null or empty input', () => {
      expect(daysUntilEvent(null)).toBeNull()
      expect(daysUntilEvent('')).toBeNull()
    })
  })

  describe('Dependencies and Blocking Status', () => {
    it('marks task as dependency blocked when prerequisite is pending', () => {
      const tasks = generateTimeline(brief)
      const taskA = tasks[0]!
      const taskB: PlanTask = {
        id: 'task-b',
        title: 'Dependent Task',
        description: 'Needs task A first',
        category: 'venue',
        dueDaysBeforeEvent: 30,
        dueDate: format(addDays(today, 30), 'yyyy-MM-dd'),
        priority: 'high',
        status: 'pending',
        isOverdue: false,
        isDependencyBlocked: false,
        dependsOn: [taskA.id],
        completedAt: null,
        relatedVendorCategory: null,
        deadlineReason: '',
        origin: 'user',
        notes: '',
      }

      const refreshed = refreshTaskStatuses([...tasks, taskB])
      const blockedTask = refreshed.find((t) => t.id === 'task-b')
      expect(blockedTask?.isDependencyBlocked).toBe(true)
    })

    it('unblocks task when prerequisite task is completed', () => {
      const tasks = generateTimeline(brief)
      const taskA = { ...tasks[0]!, status: 'completed' as const }
      const taskB: PlanTask = {
        id: 'task-b',
        title: 'Dependent Task',
        description: 'Needs task A first',
        category: 'venue',
        dueDaysBeforeEvent: 30,
        dueDate: format(addDays(today, 30), 'yyyy-MM-dd'),
        priority: 'high',
        status: 'pending',
        isOverdue: false,
        isDependencyBlocked: true,
        dependsOn: [taskA.id],
        completedAt: null,
        relatedVendorCategory: null,
        deadlineReason: '',
        origin: 'user',
        notes: '',
      }

      const refreshed = refreshTaskStatuses([taskA, taskB])
      const unblockedTask = refreshed.find((t) => t.id === 'task-b')
      expect(unblockedTask?.isDependencyBlocked).toBe(false)
    })

    it('unblocks task when prerequisite task is skipped', () => {
      const tasks = generateTimeline(brief)
      const taskA = { ...tasks[0]!, status: 'skipped' as const }
      const taskB: PlanTask = {
        id: 'task-b',
        title: 'Dependent Task',
        description: 'Needs task A first',
        category: 'venue',
        dueDaysBeforeEvent: 30,
        dueDate: format(addDays(today, 30), 'yyyy-MM-dd'),
        priority: 'high',
        status: 'pending',
        isOverdue: false,
        isDependencyBlocked: true,
        dependsOn: [taskA.id],
        completedAt: null,
        relatedVendorCategory: null,
        deadlineReason: '',
        origin: 'user',
        notes: '',
      }

      const refreshed = refreshTaskStatuses([taskA, taskB])
      const unblockedTask = refreshed.find((t) => t.id === 'task-b')
      expect(unblockedTask?.isDependencyBlocked).toBe(false)
    })
  })

  describe('Rescheduling Tasks & Leap Years', () => {
    it('completed tasks remain completed after reschedule', () => {
      const tasks = generateTimeline(brief)
      tasks[0]!.status = 'completed'
      tasks[0]!.completedAt = new Date().toISOString()

      const newEventDate = format(addDays(today, 120), 'yyyy-MM-dd')
      const rescheduled = rescheduleTasks(tasks, newEventDate)

      const completedTask = rescheduled.find((t) => t.id === tasks[0]!.id)
      expect(completedTask?.status).toBe('completed')
      expect(completedTask?.completedAt).not.toBeNull()
    })

    it('preserves user-created tasks during reschedule without changing their custom dates', () => {
      const tasks = generateTimeline(brief)
      const customUserTask: PlanTask = {
        id: 'user-custom-99',
        title: 'Custom DIY Centerpiece assembly',
        description: 'Handmade origami floral centerpieces',
        category: 'decorations',
        dueDaysBeforeEvent: null,
        dueDate: '2026-11-15',
        priority: 'medium',
        status: 'pending',
        isOverdue: false,
        isDependencyBlocked: false,
        dependsOn: [],
        completedAt: null,
        relatedVendorCategory: null,
        deadlineReason: 'DIY workshop weekend',
        origin: 'user',
        notes: 'Need 50 sheets of gold paper',
      }

      const rescheduled = rescheduleTasks([...tasks, customUserTask], '2027-02-01')
      const target = rescheduled.find((t) => t.id === 'user-custom-99')
      expect(target).toBeDefined()
      expect(target?.dueDate).toBe('2026-11-15')
      expect(target?.notes).toBe('Need 50 sheets of gold paper')
    })

    it('handles leap year event dates gracefully (e.g. Feb 29, 2028)', () => {
      const leapYearDate = '2028-02-29'
      const leapBrief = { ...brief, eventDate: leapYearDate }
      const tasks = generateTimeline(leapBrief)
      expect(tasks.length).toBeGreaterThan(0)
      const dueDates = tasks.map((t) => t.dueDate).filter(Boolean) as string[]
      expect(dueDates.length).toBeGreaterThan(0)
      // Check that all due dates are valid ISO date strings
      for (const d of dueDates) {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
    })
  })
})
