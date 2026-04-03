import { create } from 'zustand'

interface FilterStore {
  searchQuery: string
  activeAuthors: string[]
  activeSeries: string[]
  activeTags: string[]

  // Actions
  setSearchQuery: (query: string) => void
  toggleAuthor: (author: string) => void
  toggleSeries: (series: string) => void
  toggleTag: (tag: string) => void
  clearFilters: () => void
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export const useFilterStore = create<FilterStore>()((set) => ({
  searchQuery: '',
  activeAuthors: [],
  activeSeries: [],
  activeTags: [],

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleAuthor: (author) => set((s) => ({ activeAuthors: toggle(s.activeAuthors, author) })),
  toggleSeries: (series) => set((s) => ({ activeSeries: toggle(s.activeSeries, series) })),
  toggleTag: (tag) => set((s) => ({ activeTags: toggle(s.activeTags, tag) })),
  clearFilters: () =>
    set({ searchQuery: '', activeAuthors: [], activeSeries: [], activeTags: [] }),
}))
