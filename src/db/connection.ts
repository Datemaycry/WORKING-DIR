/**
 * connection.ts — Opens and upgrades the MangaHub IndexedDB database.
 * Pure module: no React, no stores.
 *
 * Schema v1:
 *   - mangas    keyPath: id
 *   - pages     keyPath: id, index: mangaId
 *   - settings  keyPath: key
 *
 * Fallbacks:
 *   - QuotaExceededError  → throws DBQuotaError (caught by stores → toast)
 *   - Private mode / IDB unavailable → throws DBUnavailableError
 */

const DB_NAME = 'mangahub-pro'
const DB_VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null
let idbFactory: IDBFactory | null = null

function getFactory(): IDBFactory {
  if (idbFactory) return idbFactory
  return indexedDB
}

export function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDB()
  }
  return dbPromise
}

export function resetDBConnection(factory?: IDBFactory): void {
  dbPromise = null
  idbFactory = factory ?? null
}

// ── Custom error types ────────────────────────────────────────────────────

export class DBUnavailableError extends Error {
  constructor() {
    super('IndexedDB is not available (private mode or unsupported browser).')
    this.name = 'DBUnavailableError'
  }
}

export class DBQuotaError extends Error {
  constructor() {
    super('Storage quota exceeded. Free up space or clear old data.')
    this.name = 'DBQuotaError'
  }
}

// ── Quota-aware wrapper ───────────────────────────────────────────────────

/**
 * Wraps any DB call and translates IDB error names to typed errors.
 * Usage: await withDBErrorHandling(() => insertManga(manga))
 */
export async function withDBErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof DOMException) {
      if (err.name === 'QuotaExceededError') throw new DBQuotaError()
      if (err.name === 'UnknownError' || err.name === 'InvalidStateError') {
        throw new DBUnavailableError()
      }
    }
    throw err
  }
}

// ── Open DB ───────────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    let factory: IDBFactory
    try {
      factory = getFactory()
    } catch {
      reject(new DBUnavailableError())
      return
    }

    let request: IDBOpenDBRequest
    try {
      request = factory.open(DB_NAME, DB_VERSION)
    } catch {
      reject(new DBUnavailableError())
      return
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains('mangas')) {
        db.createObjectStore('mangas', { keyPath: 'id' })
      }

      if (!db.objectStoreNames.contains('pages')) {
        const pagesStore = db.createObjectStore('pages', { keyPath: 'id' })
        pagesStore.createIndex('by_mangaId', 'mangaId', { unique: false })
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      const err = request.error
      if (err?.name === 'QuotaExceededError') reject(new DBQuotaError())
      else reject(new DBUnavailableError())
    }
  })
}
