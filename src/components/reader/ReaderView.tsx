import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMangaStore } from '../../stores/useMangaStore'
import { useReaderStore } from '../../stores/useReaderStore'
import { useDBErrorHandler } from '../../hooks/useDBErrorHandler'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { useSwipeGesture } from '../../hooks/useSwipeGesture'
import { getPageByNumber } from '../../db/pages'
import PageDisplay from './PageDisplay'
import ReaderHUD from './ReaderHUD'
import ReaderToolbar from './ReaderToolbar'
import FLAGS from '../../flags'
import EmptyState from '../ui/EmptyState'

export default function ReaderView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const mangaId     = useReaderStore((s) => s.mangaId)
  const currentPage = useReaderStore((s) => s.currentPage)
  const totalPages  = useReaderStore((s) => s.totalPages)
  const openManga   = useReaderStore((s) => s.openManga)
  const closeManga  = useReaderStore((s) => s.closeManga)
  const nextPage    = useReaderStore((s) => s.nextPage)
  const prevPage    = useReaderStore((s) => s.prevPage)
  const goToPage    = useReaderStore((s) => s.goToPage)

  const mangas      = useMangaStore((s) => s.mangas)
  const handleDBError = useDBErrorHandler()

  const containerRef = useRef<HTMLDivElement>(null)
  const pageCacheRef = useRef<Map<number, Blob | null>>(new Map())
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null)
  const [isLoading, setIsLoading]     = useState(true)
  const [toolbarVisible, setToolbarVisible] = useState(true)

  // Auto-hide toolbar after 3 s of inactivity
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function showToolbar() {
    setToolbarVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setToolbarVisible(false), 3000)
  }
  useEffect(() => {
    showToolbar()
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleBack  = useCallback(() => navigate('/'), [navigate])
  const handleNext  = useCallback(() => { nextPage(); showToolbar() }, [nextPage])
  const handlePrev  = useCallback(() => { prevPage(); showToolbar() }, [prevPage])
  const handleGoto  = useCallback((p: number) => { goToPage(p); showToolbar() }, [goToPage])

  useKeyboardNav({ onNext: handleNext, onPrev: handlePrev, onClose: handleBack })

  useSwipeGesture(containerRef, {
    onSwipe: ({ direction }) => {
      if (direction === 'left')  handleNext()
      if (direction === 'right') handlePrev()
    },
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
      onClick={showToolbar}
    >
      {/* Page */}
      <PageDisplay
        blob={currentBlob}
        isLoading={isLoading}
        pageNumber={currentPage}
      />

      {/* Toolbar (back + prev/next + slider) */}
      <ReaderToolbar
        currentPage={currentPage}
        totalPages={effective}
        title={manga?.title}
        onPrev={handlePrev}
        onNext={handleNext}
        onBack={handleBack}
        onGoToPage={handleGoto}
        visible={toolbarVisible}
      />

      {/* HUD */}
      {effective > 0 && !toolbarVisible && (
        <ReaderHUD
          currentPage={currentPage}
          totalPages={effective}
        />
      )}
    </div>
  )
}
