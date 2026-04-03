/**
 * connection.ts — Opens and upgrades the MangaHub IndexedDB database.
 * Pure module: no React, no stores.
 *
 * Schema v1:
 *   - mangas    keyPath: id
 *   - pages     keyPath: id, index: mangaId
 *   - settings  keyPath: key
 */

const DB_NAME = 'mangahub-pro'
const DB_VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null
let idbFactory: IDBFactory | null = null

function getFactory(): IDBFactory {
  if (idbFactory) return idbFactory
  // Lazy-init: safe in browser, overridable in tests via resetDBConnection(factory)
  return indexedDB
}

export function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDB()
  }
  return dbPromise
}

/**
 * Reset the cached connection.
 * In tests, pass a fresh IDBFactory instance to get a fully isolated DB.
 */
export function resetDBConnection(factory?: IDBFactory): void {
  dbPromise = null
  idbFactory = factory ?? null
}

function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = getFactory().open(DB_NAME, DB_VERSION)

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
    request.onerror = () => reject(request.error)
  })
}
