import { useEffect, useRef } from 'react'

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null

export interface SwipeResult {
  direction: SwipeDirection
  /** 0 → 1 progress along the primary axis */
  progress: number
  /** px/ms at release */
  velocity: number
}

interface Options {
  /** Minimum px displacement to count as a swipe (default 40) */
  threshold?: number
  /** Minimum velocity px/ms to trigger even below threshold (default 0.3) */
  velocityThreshold?: number
  onSwipe: (result: SwipeResult) => void
}

/**
 * Attaches Pointer Events to `ref.current` and fires `onSwipe` on release.
 * Cleans up all listeners on unmount.
 */
export function useSwipeGesture<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { threshold = 40, velocityThreshold = 0.3, onSwipe }: Options
) {
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onPointerDown(e: PointerEvent) {
      startRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp }
      el!.setPointerCapture(e.pointerId)
    }

    function onPointerUp(e: PointerEvent) {
      if (!startRef.current) return
      const { x: sx, y: sy, t: st } = startRef.current
      startRef.current = null

      const dx = e.clientX - sx
      const dy = e.clientY - sy
      const dt = Math.max(e.timeStamp - st, 1)
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      const primary = absDx > absDy ? absDx : absDy
      const velocity = primary / dt

      if (primary < threshold && velocity < velocityThreshold) return

      let direction: SwipeDirection
      if (absDx > absDy) {
        direction = dx < 0 ? 'left' : 'right'
      } else {
        direction = dy < 0 ? 'up' : 'down'
      }

      onSwipe({ direction, progress: Math.min(primary / (el!.clientWidth || 300), 1), velocity })
    }

    function onPointerCancel() {
      startRef.current = null
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [ref, threshold, velocityThreshold, onSwipe])
}
