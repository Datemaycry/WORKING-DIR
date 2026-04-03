import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMangaStore } from '../../stores/useMangaStore'
import { useReaderStore } from '../../stores/useReaderStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import { getPageByNumber } from '../../db/pages'
import PageDisplay from './PageDisplay'
import ReaderHUD from './ReaderHUD'
import FLAGS from '../../flags'
import EmptyState from '../ui/EmptyState'

export default function ReaderView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const mangaId    = useReaderStore((s) => s.mangaId)
  const currentPage = useReaderStore((s) => s.currentPage)
  const totalPages  = useReaderStore((s) => s.totalPages)
  const openManga   = useReaderStore((s) => s.openManga)
  const closeManga  = useReaderStore((s) => s.closeManga)

  const mangas      = useMangaStore((s) => s.mangas)
  const handleDBError = useDBErrorHandler()

  const pageCacheRef = useRef<Map<number, Blob | null>>(new Map())
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null)
  const [isLoading, setIsLoading]     = useState(true)

  // If reader opened via direct URL (no store state), find manga in collection
  useEffect(() => {
    if (!id || mangaId === id) return
    const manga = mangas.find((m) => m.id === id)
    if (manga) {
      openManga(id, manga.totalPages, manga.readingProgress.currentPage)
    } else {
      navigate('/')
    }
  }, [id, mangaId, mangas, openManga, navigate])

  // Lazy-load current page blob + pre-load next
  useEffect(() => {
    if (!id) return

    const cache = pageCacheRef.current

    async function loadPage(num: number): Promise<Blob | null> {
      if (cache.has(num)) return cache.get(num) ?? null
      const page = await getPageByNumber(id!, num)
      const blob = page?.blob ?? null
      cache.set(num, blob)
      return blob
    }

    setIsLoading(true)

    loadPage(currentPage)
      .then((blob) => {
        setCurrentBlob(blob)
        setIsLoading(false)
      })
      .catch((err) => {
        handleDBError(err)
        setIsLoading(false)
      })

    // Pre-load next page silently
    const effective = totalPages || mangas.find((m) => m.id === id)?.totalPages || 0
    if (currentPage + 1 < effective) {
      loadPage(currentPage + 1).catch(() => {})
    }
  }, [id, currentPage, totalPages, mangas, handleDBError])

  // Clear page cache and close store on unmount
  useEffect(() => {
    return () => {
      pageCacheRef.current.clear()
      closeManga()
    }
  }, [closeManga])

  if (!FLAGS.READER) {
    return <EmptyState icon="🚧" title="Reader" description="Disponible bientôt." />
  }

  const manga = mangas.find((m) => m.id === id)
  const effective = totalPages || manga?.totalPages || 0

  function handleBack() {
    navigate('/')
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Back button */}
      <button
        onClick={handleBack}
        aria-label="Retour à la bibliothèque"
        className="absolute top-4 left-4 z-20 flex items-center justify-center
                   w-9 h-9 rounded-full bg-black/50 text-white/80
                   hover:bg-black/70 hover:text-white transition-colors"
      >
        ←
      </button>

      {/* Page */}
      <PageDisplay
        blob={currentBlob}
        isLoading={isLoading}
        pageNumber={currentPage}
      />

      {/* HUD */}
      {effective > 0 && (
        <ReaderHUD
          currentPage={currentPage}
          totalPages={effective}
          title={manga?.title}
        />
      )}
    </div>
  )
}
