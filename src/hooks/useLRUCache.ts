import QuickLRU from 'quick-lru'
import { LRU_CAPACITY } from '../utils/constants'

/**
 * Module-level singleton LRU cache for manga cover ObjectURLs.
 * Maps mangaId → ObjectURL.
 * On eviction, the URL is automatically revoked to free memory.
 *
 * Persists across LibraryView mounts since it lives at module scope.
 * Max size is LRU_CAPACITY — sized to comfortably hold all covers for
 * a typical session without pressure-evicting visible entries.
 */
export const coverURLCache = new QuickLRU<string, string>({
  maxSize: LRU_CAPACITY,
  onEviction: (_mangaId, url) => {
    URL.revokeObjectURL(url)
  },
})
