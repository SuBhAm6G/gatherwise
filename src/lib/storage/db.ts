import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { EventPlan } from '@/lib/domain/types'
import { EventPlanSchema } from '@/lib/domain/schemas'

interface GatherWiseDB extends DBSchema {
  plans: {
    key: string
    value: EventPlan
    indexes: { 'by-updated': string }
  }
}

const DB_NAME = 'gatherwise'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<GatherWiseDB>> | null = null

/**
 * Returns a singleton Promise resolving to the IndexedDB database instance.
 * Rejects cleanly if invoked in a non-browser environment.
 */
export function getDB(): Promise<IDBPDatabase<GatherWiseDB>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is only available in the browser'))
  }
  if (!dbPromise) {
    dbPromise = openDB<GatherWiseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('plans')) {
          const store = db.createObjectStore('plans', { keyPath: 'id' })
          store.createIndex('by-updated', 'updatedAt')
        }
      },
    })
  }
  return dbPromise
}

/**
 * Persists an event plan to IndexedDB with an updated timestamp.
 *
 * @param plan The event plan to store
 * @returns True if successfully persisted, false otherwise
 */
export async function savePlan(plan: EventPlan): Promise<boolean> {
  try {
    const db = await getDB()
    await db.put('plans', { ...plan, updatedAt: new Date().toISOString() })
    return true
  } catch {
    return false
  }
}

/**
 * Loads all saved event plans from IndexedDB, validated against EventPlanSchema.
 *
 * @returns Array of valid event plans sorted by most recently updated
 */
export async function loadAllPlans(): Promise<EventPlan[]> {
  try {
    const db = await getDB()
    const all = await db.getAll('plans')
    const valid: EventPlan[] = []
    for (const raw of all) {
      const result = EventPlanSchema.safeParse(raw)
      if (result.success) {
        valid.push(result.data)
      }
    }
    return valid.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

/**
 * Loads a single event plan by ID from IndexedDB.
 *
 * @param id The unique plan UUID
 * @returns The validated event plan, or null if not found or invalid
 */
export async function loadPlan(id: string): Promise<EventPlan | null> {
  try {
    const db = await getDB()
    const raw = await db.get('plans', id)
    if (!raw) return null
    const result = EventPlanSchema.safeParse(raw)
    if (!result.success) {
      return null
    }
    return result.data
  } catch {
    return null
  }
}

/**
 * Deletes an event plan by ID from IndexedDB.
 *
 * @param id The unique plan UUID to delete
 * @returns True if deleted successfully, false otherwise
 */
export async function deletePlan(id: string): Promise<boolean> {
  try {
    const db = await getDB()
    await db.delete('plans', id)
    return true
  } catch {
    return false
  }
}
