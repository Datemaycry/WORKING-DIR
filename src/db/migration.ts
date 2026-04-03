/**
 * migration.ts — Import data from the old MangaHub schema into the new schema.
 *
 * Old DB name: 'mangaDB' (from c:\Users\yfiliatre\mangahub-pro)
 * Old stores:
 *   - mangas  { id, title, author, tags, coverBlob, pages: Blob[], ... }
 *   - (settings stored in localStorage under key 'mangahub-settings')
 *
 * This runs once and returns a migration report.
 * Gated behind FLAGS.MIGRATION — call only from Brique 7b.
 */

import type { Manga } from '../types/manga'
import type { Page } from '../types/page'
import { insertManga, getMangaById } from './mangas'
import { insertBatchPages } from './pages'

const OLD_DB_NAME = 'mangaDB'
const OLD_DB_VERSION = 1

export interface MigrationReport {
  migrated: number
  skipped: number
  errors: string[]
}

interface OldManga {
  id: string
  title: string
  author?: string
  authors?: string[]
  tags?: string[]
  series?: string
  coverBlob?: Blob
  pages?: Blob[]
  currentPage?: number
  totalPages?: number
  addedAt?: number
}

function openOldDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(OLD_DB_NAME, OLD_DB_VERSION)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null) // old DB doesn't exist — skip
    request.onupgradeneeded = (e) => {
      // If we trigger upgrade, the old DB didn't exist
      ;(e.target as IDBOpenDBRequest).transaction?.abort()
      resolve(null)
    }
  })
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function runMigration(): Promise<MigrationReport> {
  const report: MigrationReport = { migrated: 0, skipped: 0, errors: [] }

  const oldDB = await openOldDB()
  if (!oldDB) {
    report.errors.push('Old database not found — nothing to migrate.')
    return report
  }

  let oldMangas: OldManga[] = []
  try {
    const tx = oldDB.transaction('mangas', 'readonly')
    oldMangas = await promisify<OldManga[]>(tx.objectStore('mangas').getAll())
  } catch (err) {
    report.errors.push(`Failed to read old mangas: ${String(err)}`)
    oldDB.close()
    return report
  }

  for (const old of oldMangas) {
    try {
      // Skip if already migrated
      const existing = await getMangaById(old.id)
      if (existing) {
        report.skipped++
        continue
      }

      const now = Date.now()
      const manga: Manga = {
        id: old.id,
        title: old.title ?? 'Untitled',
        authors: old.authors ?? (old.author ? [old.author] : []),
        series: old.series ? [old.series] : [],
        tags: old.tags ?? [],
        totalPages: old.totalPages ?? old.pages?.length ?? 0,
        readingProgress: {
          currentPage: old.currentPage ?? 0,
          lastReadAt: old.addedAt ?? now,
          completed: false,
        },
        createdAt: old.addedAt ?? now,
        updatedAt: now,
      }

      await insertManga(manga)

      // Migrate pages if present as Blob array
      if (old.pages && old.pages.length > 0) {
        const pages: Page[] = old.pages.map((blob, i) => ({
          id: `${old.id}-p${i}`,
          mangaId: old.id,
          pageNumber: i,
          blob,
        }))
        await insertBatchPages(pages)
      }

      report.migrated++
    } catch (err) {
      report.errors.push(`manga ${old.id}: ${String(err)}`)
    }
  }

  oldDB.close()
  return report
}
