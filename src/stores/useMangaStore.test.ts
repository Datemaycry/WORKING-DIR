import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDBConnection } from '../db/connection'
import { useMangaStore } from './useMangaStore'
import type { Manga } from '../types/manga'

function makeManga(overrides: Partial<Manga> = {}): Manga {
  return {
    id: 'manga-1',
    title: 'Test Manga',
    authors: ['Author A'],
    series: [],
    tags: [],
    totalPages: 5,
    readingProgress: { currentPage: 0, lastReadAt: 0, completed: false },
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  }
}

beforeEach(() => {
  resetDBConnection(new IDBFactory())
  useMangaStore.setState({ mangas: [], selectedMangaId: null, isLoading: false })
})

describe('useMangaStore', () => {
  it('loadCollection fetches from DB', async () => {
    await useMangaStore.getState().addManga(makeManga())
    useMangaStore.setState({ mangas: [] })
    await useMangaStore.getState().loadCollection()
    expect(useMangaStore.getState().mangas).toHaveLength(1)
  })

  it('addManga inserts and updates in-memory list', async () => {
    await useMangaStore.getState().addManga(makeManga())
    expect(useMangaStore.getState().mangas).toHaveLength(1)
  })

  it('removeManga deletes from DB and in-memory', async () => {
    await useMangaStore.getState().addManga(makeManga())
    await useMangaStore.getState().removeManga('manga-1')
    expect(useMangaStore.getState().mangas).toHaveLength(0)
  })

  it('selectManga sets selectedMangaId', () => {
    useMangaStore.setState({ mangas: [makeManga()] })
    useMangaStore.getState().selectManga('manga-1')
    expect(useMangaStore.getState().selectedMangaId).toBe('manga-1')
  })

  it('selectedManga() returns the right manga', () => {
    useMangaStore.setState({ mangas: [makeManga()], selectedMangaId: 'manga-1' })
    expect(useMangaStore.getState().selectedManga()?.title).toBe('Test Manga')
  })

  it('removeManga clears selectedMangaId if it matches', async () => {
    await useMangaStore.getState().addManga(makeManga())
    useMangaStore.setState({ selectedMangaId: 'manga-1' })
    await useMangaStore.getState().removeManga('manga-1')
    expect(useMangaStore.getState().selectedMangaId).toBeNull()
  })

  it('updateProgress persists and updates in-memory', async () => {
    await useMangaStore.getState().addManga(makeManga())
    await useMangaStore.getState().updateProgress('manga-1', {
      currentPage: 3,
      lastReadAt: 9999,
      completed: false,
    })
    const m = useMangaStore.getState().mangas[0]
    expect(m?.readingProgress.currentPage).toBe(3)
  })
})
