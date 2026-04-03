import { useCallback, useState } from 'react'
import { useSwipeGesture } from './useSwipeGesture'
import type { SwipeDirection } from './useSwipeGesture'

export interface PageCurlState {
  /** 0 → 1 progress of the curl (0 = flat, 1 = fully turned) */
  progress: number
  /** Which direction the curl is going */
  direction: SwipeDirection
}

/**
 * Wraps useSwipeGesture to expose a transient curl progress value.
 * On release (progress=1), calls onNext/onPrev to commit the page turn.
 *
 * Used by PageCurlCanvas to drive the visual effect.
 * Gated behind FLAGS.PAGE_CURL in the consumer.
 */
export function usePageCurl(
  ref: React.RefObject<HTMLElement | null>,
  { onNext, onPrev }: { onNext: () => void; onPrev: () => void }
): PageCurlState {
  const [curl, setCurl] = useState<PageCurlState>({ progress: 0, direction: null })

  const onSwipe = useCallback(
    ({ direction, progress }: { direction: SwipeDirection; progress: number }) => {
      // Animate curl briefly then commit
      setCurl({ direction, progress: Math.min(progress * 2, 1) })
      setTimeout(() => {
        setCurl({ progress: 0, direction: null })
        if (direction === 'left')  onNext()
        if (direction === 'right') onPrev()
      }, 180)
    },
    [onNext, onPrev]
  )

  useSwipeGesture(ref as React.RefObject<HTMLElement>, { onSwipe })

  return curl
}
