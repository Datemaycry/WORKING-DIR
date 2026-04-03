import { useEffect, useMemo, useRef, useState } from 'react'
import { useMangaStore } from '../../stores/useMangaStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useUIStore } from '../../stores/useUIStore'
import { useFilterStore } from '../../stores/useFilterStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import { coverURLCache } from '../../hooks/useLRUCache'
import { useFuseSearch } from '../../hooks/useFuseSearch'
import { getCoverBlob } from '../../db/pages'
import type { Manga } from '../../types/manga'
import Shelf from './Shelf'
import FilterBar from './FilterBar'
import FilterModal from './FilterModal'
import SearchBar from './SearchBar'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import FLAGS from '../../flags'
import { CARD_COVER_WIDTH, SHELF_CARDS_GAP, SHELF_H_PADDING } from '../../utils/constants'

interface Dims { width: number; height: number }

const TOOLBAR_HEIGHT = 44 + 36 // FilterBar h-11 + SearchBar h-8 + padding

function computeColCount(width: number): number {
  if (width <= 0) return 3
  return Math.max(2, Math.floor((width - SHELF_H_PADDING * 2) / (CARD_COVER_WIDTH + SHELF_CARDS_GAP)))
}

function applyFilters(mangas: Manga[], activeAuthors: string[], activeSeries: string[], activeTags: string[]): Manga[] {
  return mangas.filter((m) => {
    if (activeAuthors.length > 0 && !activeAuthors.some((a) => m.authors.includes(a))) return false
    if (activeSeries.length > 0 && !activeSeries.some((s) => m.series.includes(s))) return false
    if (activeTags.length > 0 && !activeTags.some((t) => m.tags.includes(t))) return false
    return true
  })
}

export default function LibraryView() {
  const mangas = useMangaStore((s) => s.mangas)
  const isLoading = useMangaStore((s) => s.isLoading)
  const loadCollection = useMangaStore((s) => s.loadCollection)
  const selectManga = useMangaStore((s) => s.selectManga)
  const shelfTheme = useSettingsStore((s) => s.shelfTheme)
  const setInspectorOpen = useUIStore((s) => s.setInspectorOpen)
  const activeAuthors = useFilterStore((s) => s.activeAuthors)
  const activeSeries = useFilterStore((s) => s.activeSeries)
  const activeTags = useFilterStore((s) => s.activeTags)
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const handleDBError = useDBErrorHandler()

  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState<Dims>({ width: 0, height: 600 })
  const [coverUrls, setCoverUrls] = useState<Record<string, string | null>>({})
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  useEffect(() => {
    loadCollection().catch(handleDBError)
  }, [loadCollection, handleDBError])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ width, height })
    })
    obs.observe(el)
    setDims({ width: el.clientWidth, height: el.clientHeight })
    return () => obs.disconnect()
  }, [])

  // Load cover images lazily — check LRU first, then fetch from IndexedDB
  useEffect(() => {
    if (!FLAGS.COVER_IMAGES || mangas.length === 0) return

    for (const manga of mangas) {
      const cached = coverURLCache.get(manga.id)
      if (cached) {
        setCoverUrls((prev) => (prev[manga.id] === cached ? prev : { ...prev, [manga.id]: cached }))
        continue
      }
      getCoverBlob(manga.id)
        .then((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          coverURLCache.set(manga.id, url)
          setCoverUrls((prev) => ({ ...prev, [manga.id]: url }))
        })
        .catch(() => { /* silent — card shows title fallback */ })
    }
  }, [mangas])

  function handleCardClick(mangaId: string) {
    selectManga(mangaId)
    setInspectorOpen(true)
  }

  if (!FLAGS.LIBRARY) {
    return <EmptyState icon="🚧" title="Bibliothèque" description="Disponible bientôt." />
  }

  const colCount = computeColCount(dims.width)
  const shelfHeight = Math.max(0, dims.height - TOOLBAR_HEIGHT)

  const filterPassedMangas = useMemo(
    () => applyFilters(mangas, activeAuthors, activeSeries, activeTags),
    [mangas, activeAuthors, activeSeries, activeTags]
  )
  const filteredMangas = useFuseSearch(filterPassedMangas, searchQuery)

  // Derive available filter options from full collection
  const allAuthors = useMemo(() => [...new Set(mangas.flatMap((m) => m.authors))].sort(), [mangas])
  const allSeries  = useMemo(() => [...new Set(mangas.flatMap((m) => m.series))].sort(),  [mangas])
  const allTags    = useMemo(() => [...new Set(mangas.flatMap((m) => m.tags))].sort(),    [mangas])

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-hidden"
      data-shelf-theme={shelfTheme !== 'wood' ? shelfTheme : undefined}
    >
      <SearchBar />
      <FilterBar onOpenModal={() => setFilterModalOpen(true)} />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Shelf
          mangas={filteredMangas}
          coverUrls={coverUrls}
          onCardClick={handleCardClick}
          colCount={colCount}
          height={shelfHeight}
          width={dims.width}
        />
      )}

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        allAuthors={allAuthors}
        allSeries={allSeries}
        allTags={allTags}
      />
    </div>
  )
}
