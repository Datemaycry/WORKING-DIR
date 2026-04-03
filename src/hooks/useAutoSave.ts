import { useEffect, useRef } from 'react'
import { useMangaStore } from '../stores/useMangaStore'
import type { ReadingProgress } from '../types/progress'

/**
 * Debounced auto-save of reading progress to IndexedDB.
 * Saves `debounceMs` after the last page change.
 * Also flushes immediately on unmount to avoid losing progress.
 */
export function useAutoSave(
  mangaId: string | null,
  currentPage: number,
  totalPages: number,
  debounceMs = 1500
) {
  const updateProgress = useMangaStore((s) => s.updateProgress)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep latest values accessible in the flush callback without re-creating the effect
  const latestRef = useRef({ mangaId, currentPage, totalPages })
  latestRef.current = { mangaId, currentPage, totalPages }

  useEffect(() => {
    if (!mangaId) return

    function save() {
      const { mangaId: id, currentPage: page, totalPages: total } = latestRef.current
      if (!id) return
      const progress: ReadingProgress = {
        currentPage: page,
        lastReadAt: Date.now(),
        completed: total > 0 && page >= total - 1,
      }
      updateProgress(id, progress).catch(() => {
        // Silent — progress save failure is non-critical
      })
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [mangaId, currentPage, totalPages, debounceMs, updateProgress])

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (!latestRef.current.mangaId) return
      const { mangaId: id, currentPage: page, totalPages: total } = latestRef.current
      updateProgress(id!, {
        currentPage: page,
        lastReadAt: Date.now(),
        completed: total > 0 && page >= total - 1,
      }).catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
