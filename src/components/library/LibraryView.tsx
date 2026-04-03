import { useEffect, useRef, useState } from 'react'
import { useMangaStore } from '../../stores/useMangaStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
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
  const handleDBError = useDBErrorHandler()

  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState<Dims>({ width: 0, height: 600 })

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

  if (!FLAGS.LIBRARY) {
    return <EmptyState icon="🚧" title="Bibliothèque" description="Disponible bientôt." />
  }

  const colCount = computeColCount(dims.width)

  // coverUrls: populated by coverObjectURL when set (filled in 4d via useImageURL)
  const coverUrls: Record<string, string | null> = Object.fromEntries(
    mangas.map((m) => [m.id, m.coverObjectURL ?? null])
  )

  return (
    <div ref={containerRef} className="flex flex-col flex-1 overflow-hidden">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <Shelf
          mangas={mangas}
          coverUrls={coverUrls}
          onCardClick={selectManga}
          colCount={colCount}
          height={dims.height}
          width={dims.width}
        />
      )}
    </div>
  )
}
