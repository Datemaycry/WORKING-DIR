import { useEffect, useRef, useState } from 'react'
import { useMangaStore } from '../../stores/useMangaStore'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useUIStore } from '../../stores/useUIStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import { coverURLCache } from '../../hooks/useLRUCache'
import { getCoverBlob } from '../../db/pages'
import Shelf from './Shelf'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import FLAGS from '../../flags'
import { CARD_COVER_WIDTH, SHELF_CARDS_GAP, SHELF_H_PADDING } from '../../utils/constants'

interface Dims {
  width: number
  height: number
}

function computeColCount(width: number): number {
  if (width <= 0) return 3
  return Math.max(2, Math.floor((width - SHELF_H_PADDING * 2) / (CARD_COVER_WIDTH + SHELF_CARDS_GAP)))
}

export default function LibraryView() {
  const mangas = useMangaStore((s) => s.mangas)
  const isLoading = useMangaStore((s) => s.isLoading)
  const loadCollection = useMangaStore((s) => s.loadCollection)
  const selectManga = useMangaStore((s) => s.selectManga)
  const shelfTheme = useSettingsStore((s) => s.shelfTheme)
  const setInspectorOpen = useUIStore((s) => s.setInspectorOpen)
  const handleDBError = useDBErrorHandler()

  function handleCardClick(mangaId: string) {
    selectManga(mangaId)
    setInspectorOpen(true)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState<Dims>({ width: 0, height: 600 })
  const [coverUrls, setCoverUrls] = useState<Record<string, string | null>>({})

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
        // Already in LRU — just expose to render state
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
        .catch(() => {
          // Cover load failure is silent — card shows title fallback
        })
    }
  }, [mangas])

  if (!FLAGS.LIBRARY) {
    return <EmptyState icon="🚧" title="Bibliothèque" description="Disponible bientôt." />
  }

  const colCount = computeColCount(dims.width)

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-hidden"
      data-shelf-theme={shelfTheme !== 'wood' ? shelfTheme : undefined}
    >
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Shelf
          mangas={mangas}
          coverUrls={coverUrls}
          onCardClick={handleCardClick}
          colCount={colCount}
          height={dims.height}
          width={dims.width}
        />
      )}
    </div>
  )
}
