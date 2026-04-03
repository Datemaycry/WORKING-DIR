// ── Reading progress ───────────────────────────────────────────────────────
export interface ReadingProgress {
  currentPage: number
  lastReadAt: number
  completed: boolean
}

// ── Manga ──────────────────────────────────────────────────────────────────
export interface Manga {
  id: string
  title: string
  authors: string[]
  series: string[]
  tags: string[]
  /** Non-persisted — generated at runtime from IndexedDB blob */
  coverObjectURL?: string
  totalPages: number
  readingProgress: ReadingProgress
  createdAt: number
  updatedAt: number
}

// ── Page ───────────────────────────────────────────────────────────────────
export interface Page {
  id: string
  mangaId: string
  pageNumber: number
  blob: Blob
}

// ── Settings ───────────────────────────────────────────────────────────────
export type DisplayMode = 'auto' | 'single' | 'double'

export interface Settings {
  appTheme: string
  isNightMode: boolean
  showSpine: boolean
  shelfTheme: string
  pageAnimationsEnabled: boolean
  soundVolume: number
  ledIntensity: number
  animationSpeed: number
  displayMode: DisplayMode
}

// ── Filters ────────────────────────────────────────────────────────────────
export interface FilterState {
  searchQuery: string
  activeAuthors: string[]
  activeSeries: string[]
  activeTags: string[]
}
