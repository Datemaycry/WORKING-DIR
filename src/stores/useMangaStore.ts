import { create } from 'zustand'
import type { Manga } from '../types/manga'
import type { ReadingProgress } from '../types/progress'
import {
  getAllMangas,
  getMangaById,
  insertManga,
  updateManga,
  deleteManga,
} from '../db/mangas'

interface MangaStore {
  mangas: Manga[]
  selectedMangaId: string | null
  isLoading: boolean

  // Derived selector helper
  selectedManga: () => Manga | undefined

  // Actions
  loadCollection: () => Promise<void>
  selectManga: (id: string | null) => void
  addManga: (manga: Manga) => Promise<void>
  updateMangaData: (manga: Manga) => Promise<void>
  removeManga: (id: string) => Promise<void>
  updateProgress: (id: string, progress: ReadingProgress) => Promise<void>
}

export const useMangaStore = create<MangaStore>()((set, get) => ({
  mangas: [],
  selectedMangaId: null,
  isLoading: false,

  selectedManga: () => {
    const { mangas, selectedMangaId } = get()
    return mangas.find((m) => m.id === selectedMangaId)
  },

  loadCollection: async () => {
    set({ isLoading: true })
    try {
      const mangas = await getAllMangas()
      set({ mangas, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  selectManga: (id) => set({ selectedMangaId: id }),

  addManga: async (manga) => {
    await insertManga(manga)
    set((s) => ({ mangas: [...s.mangas, manga] }))
  },

  updateMangaData: async (manga) => {
    await updateManga(manga)
    set((s) => ({
      mangas: s.mangas.map((m) => (m.id === manga.id ? manga : m)),
    }))
  },

  removeManga: async (id) => {
    await deleteManga(id)
    set((s) => ({
      mangas: s.mangas.filter((m) => m.id !== id),
      selectedMangaId: s.selectedMangaId === id ? null : s.selectedMangaId,
    }))
  },

  updateProgress: async (id, progress) => {
    const manga = await getMangaById(id)
    if (!manga) return
    const updated: Manga = { ...manga, readingProgress: progress, updatedAt: Date.now() }
    await updateManga(updated)
    set((s) => ({
      mangas: s.mangas.map((m) => (m.id === id ? updated : m)),
    }))
  },
}))
