import type { Page } from '../types/page'
import { getDB } from './connection'

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getPagesByMangaId(mangaId: string): Promise<Page[]> {
  const db = await getDB()
  const transaction = db.transaction('pages', 'readonly')
  const index = transaction.objectStore('pages').index('by_mangaId')
  return promisify<Page[]>(index.getAll(mangaId))
}

export async function insertBatchPages(pages: Page[]): Promise<void> {
  if (pages.length === 0) return
  const db = await getDB()
  const transaction = db.transaction('pages', 'readwrite')
  const store = transaction.objectStore('pages')

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
    for (const page of pages) {
      store.add(page)
    }
  })
}

/**
 * Returns a single page by mangaId + pageNumber.
 * Uses a cursor so only one blob is loaded (avoids loading the full manga).
 */
export async function getPageByNumber(mangaId: string, pageNumber: number): Promise<Page | null> {
  const db = await getDB()
  return new Promise<Page | null>((resolve, reject) => {
    const tx = db.transaction('pages', 'readonly')
    const index = tx.objectStore('pages').index('by_mangaId')
    const req = index.openCursor(IDBKeyRange.only(mangaId))
    req.onsuccess = () => {
      const cursor = req.result
      if (!cursor) { resolve(null); return }
      const page = cursor.value as Page
      if (page.pageNumber === pageNumber) {
        resolve(page)
      } else {
        cursor.continue()
      }
    }
    req.onerror = () => reject(req.error)
  })
}

/**
 * Returns the blob of the first page for a manga (used as its cover).
 * Uses a cursor so only one record is loaded, not the entire page set.
 */
export async function getCoverBlob(mangaId: string): Promise<Blob | null> {
  const db = await getDB()
  return new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction('pages', 'readonly')
    const index = tx.objectStore('pages').index('by_mangaId')
    const req = index.openCursor(IDBKeyRange.only(mangaId))
    req.onsuccess = () => {
      const cursor = req.result
      resolve(cursor ? (cursor.value as Page).blob : null)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function deletePagesByMangaId(mangaId: string): Promise<void> {
  const db = await getDB()
  const transaction = db.transaction('pages', 'readwrite')
  const index = transaction.objectStore('pages').index('by_mangaId')

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)

    const cursorRequest = index.openKeyCursor(IDBKeyRange.only(mangaId))
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (cursor) {
        transaction.objectStore('pages').delete(cursor.primaryKey)
        cursor.continue()
      }
    }
    cursorRequest.onerror = () => reject(cursorRequest.error)
  })
}
