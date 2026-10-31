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
      blocked() {
        console.warn('[GatherWise] IndexedDB upgrade blocked by another tab')
      },
      blocking() {
        console.warn('[GatherWise] This tab is blocking an IndexedDB upgrade')
      },
    })
  }
  return dbPromise
}

export async function savePlan(plan: EventPlan): Promise<boolean> {
  try {
    const db = await getDB()
    await db.put('plans', { ...plan, updatedAt: new Date().toISOString() })
    return true
  } catch (err) {
    console.error('[GatherWise] Failed to save plan:', err)
    return false
  }
}

export async function loadAllPlans(): Promise<EventPlan[]> {
  try {
    const db = await getDB()
    const all = await db.getAll('plans')
    const valid: EventPlan[] = []
    for (const raw of all) {
      const result = EventPlanSchema.safeParse(raw)
      if (result.success) {
        valid.push(result.data)
      } else {
        console.warn('[GatherWise] Skipping invalid plan record:', result.error.issues)
      }
    }
    return valid.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch (err) {
    console.error('[GatherWise] Failed to load plans:', err)
    return []
  }
}

export async function loadPlan(id: string): Promise<EventPlan | null> {
  try {
    const db = await getDB()
    const raw = await db.get('plans', id)
    if (!raw) return null
    const result = EventPlanSchema.safeParse(raw)
    if (!result.success) {
      console.warn('[GatherWise] Plan schema validation failed:', result.error.issues)
      return null
    }
    return result.data
  } catch (err) {
    console.error('[GatherWise] Failed to load plan:', err)
    return null
  }
}

export async function deletePlan(id: string): Promise<boolean> {
  try {
    const db = await getDB()
    await db.delete('plans', id)
    return true
  } catch (err) {
    console.error('[GatherWise] Failed to delete plan:', err)
    return false
  }
}
