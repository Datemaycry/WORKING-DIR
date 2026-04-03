import { useEffect, useRef, useState } from 'react'
import { useMangaStore } from '../../stores/useMangaStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import Shelf from './Shelf'
import Spinner from '../ui/Spinner'
import EmptyState from '../ui/EmptyState'
import FLAGS from '../../flags'
import { CARD_COVER_WIDTH, SHELF_CARDS_GAP, SHELF_H_PADDING } from '../../utils/constants'

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
  const [colCount, setColCount] = useState(3)

  useEffect(() => {
    loadCollection().catch(handleDBError)
  }, [loadCollection, handleDBError])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setColCount(computeColCount(entry.contentRect.width))
    })
    obs.observe(el)
    setColCount(computeColCount(el.clientWidth))
    return () => obs.disconnect()
  }, [])

  if (!FLAGS.LIBRARY) {
    return <EmptyState icon="🚧" title="Bibliothèque" description="Disponible bientôt." />
  }

  // coverUrls: populated by coverObjectURL if already set (filled in 4d)
  const coverUrls: Record<string, string | null> = Object.fromEntries(
    mangas.map((m) => [m.id, m.coverObjectURL ?? null])
  )

  return (
    <div ref={containerRef} className="flex flex-col h-full">
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
        />
      )}
    </div>
  )
}
