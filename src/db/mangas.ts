import type { Manga } from '../types/manga'
import { getDB } from './connection'

function tx(
  db: IDBDatabase,
  mode: IDBTransactionMode,
): { store: IDBObjectStore; done: Promise<void> } {
  const transaction = db.transaction('mangas', mode)
  const store = transaction.objectStore('mangas')
  const done = new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
  return { store, done }
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllMangas(): Promise<Manga[]> {
  const db = await getDB()
  const { store } = tx(db, 'readonly')
  return promisify<Manga[]>(store.getAll())
}

export async function getMangaById(id: string): Promise<Manga | undefined> {
  const db = await getDB()
  const { store } = tx(db, 'readonly')
  return promisify<Manga | undefined>(store.get(id))
}

export async function insertManga(manga: Manga): Promise<void> {
  const db = await getDB()
  const { store, done } = tx(db, 'readwrite')
  store.add(manga)
  return done
}

export async function updateManga(manga: Manga): Promise<void> {
  const db = await getDB()
  const { store, done } = tx(db, 'readwrite')
  store.put(manga)
  return done
}

export async function deleteManga(id: string): Promise<void> {
  const db = await getDB()
  const { store, done } = tx(db, 'readwrite')
  store.delete(id)
  return done
}
