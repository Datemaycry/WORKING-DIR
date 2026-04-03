import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Manga } from '../types/manga'

const FUSE_OPTIONS: Fuse.IFuseOptions<Manga> = {
  keys: ['title', 'authors', 'series', 'tags'],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
}

/**
 * Returns the filtered manga list:
 * - If query is empty, returns `mangas` as-is (no copy).
 * - If query is non-empty, runs Fuse.js and returns matches in score order.
 *
 * Fuse instance is re-created only when `mangas` changes.
 */
export function useFuseSearch(mangas: Manga[], query: string): Manga[] {
  const fuse = useMemo(() => new Fuse(mangas, FUSE_OPTIONS), [mangas])

  return useMemo(() => {
    const q = query.trim()
    if (!q) return mangas
    return fuse.search(q).map((r) => r.item)
  }, [fuse, query, mangas])
}
