import type { ReadingProgress } from './progress'

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
