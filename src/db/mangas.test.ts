import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDBConnection } from './connection'
import { deleteManga, getAllMangas, getMangaById, insertManga, updateManga } from './mangas'
import type { Manga } from '../types/manga'

function makeManga(overrides: Partial<Manga> = {}): Manga {
  return {
    id: 'manga-1',
    title: 'Test Manga',
    authors: ['Author A'],
    series: [],
    tags: ['action'],
    totalPages: 10,
    readingProgress: { currentPage: 0, lastReadAt: 0, completed: false },
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  }
}

beforeEach(() => {
  resetDBConnection(new IDBFactory())
})

describe('mangas CRUD', () => {
  it('inserts and retrieves a manga', async () => {
    const manga = makeManga()
    await insertManga(manga)
    const result = await getMangaById('manga-1')
    expect(result).toEqual(manga)
  })

  it('getAll returns all inserted mangas', async () => {
    await insertManga(makeManga({ id: 'a' }))
    await insertManga(makeManga({ id: 'b' }))
    const all = await getAllMangas()
    expect(all).toHaveLength(2)
  })

  it('updates a manga', async () => {
    await insertManga(makeManga())
    await updateManga(makeManga({ title: 'Updated' }))
    const result = await getMangaById('manga-1')
    expect(result?.title).toBe('Updated')
  })

  it('deletes a manga', async () => {
    await insertManga(makeManga())
    await deleteManga('manga-1')
    const result = await getMangaById('manga-1')
    expect(result).toBeUndefined()
  })

  it('getMangaById returns undefined for unknown id', async () => {
    const result = await getMangaById('nonexistent')
    expect(result).toBeUndefined()
  })
})
