import { create } from 'zustand'
import type { DisplayMode } from '../types/settings'

interface ReaderStore {
  mangaId: string | null
  currentPage: number
  totalPages: number
  viewMode: DisplayMode

  // Actions
  openManga: (mangaId: string, totalPages: number, startPage?: number) => void
  closeManga: () => void
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  setViewMode: (mode: DisplayMode) => void
}

export const useReaderStore = create<ReaderStore>()((set, get) => ({
  mangaId: null,
  currentPage: 0,
  totalPages: 0,
  viewMode: 'auto',

  openManga: (mangaId, totalPages, startPage = 0) =>
    set({ mangaId, totalPages, currentPage: startPage }),

  closeManga: () => set({ mangaId: null, currentPage: 0, totalPages: 0 }),

  goToPage: (page) => {
    const { totalPages } = get()
    const clamped = Math.max(0, Math.min(page, totalPages - 1))
    set({ currentPage: clamped })
  },

  nextPage: () => {
    const { currentPage, totalPages } = get()
    if (currentPage < totalPages - 1) set({ currentPage: currentPage + 1 })
  },

  prevPage: () => {
    const { currentPage } = get()
    if (currentPage > 0) set({ currentPage: currentPage - 1 })
  },

  setViewMode: (viewMode) => set({ viewMode }),
}))
