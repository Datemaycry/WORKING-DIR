import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDBConnection } from './connection'
import { deletePagesByMangaId, getPagesByMangaId, insertBatchPages } from './pages'
import type { Page } from '../types/page'

function makePages(mangaId: string, count: number): Page[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${mangaId}-p${i}`,
    mangaId,
    pageNumber: i,
    blob: new Blob([`page-${i}`], { type: 'image/jpeg' }),
  }))
}

beforeEach(() => {
  resetDBConnection(new IDBFactory())
})

describe('pages CRUD', () => {
  it('inserts batch and retrieves by mangaId', async () => {
    const pages = makePages('manga-1', 3)
    await insertBatchPages(pages)
    const result = await getPagesByMangaId('manga-1')
    expect(result).toHaveLength(3)
  })

  it('returns empty array for unknown mangaId', async () => {
    const result = await getPagesByMangaId('unknown')
    expect(result).toEqual([])
  })

  it('deletes pages by mangaId', async () => {
    await insertBatchPages(makePages('manga-1', 3))
    await insertBatchPages(makePages('manga-2', 2))
    await deletePagesByMangaId('manga-1')
    expect(await getPagesByMangaId('manga-1')).toHaveLength(0)
    expect(await getPagesByMangaId('manga-2')).toHaveLength(2)
  })

  it('insertBatch does nothing for empty array', async () => {
    await insertBatchPages([])
    const result = await getPagesByMangaId('manga-1')
    expect(result).toHaveLength(0)
  })
})
