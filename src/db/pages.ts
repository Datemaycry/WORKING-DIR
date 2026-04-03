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
