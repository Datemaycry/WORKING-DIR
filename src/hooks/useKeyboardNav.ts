import { useEffect } from 'react'

interface Handlers {
  onNext: () => void
  onPrev: () => void
  onClose?: () => void
}

/**
 * Arrow keys / Space → next page, Backspace / Shift+Space → prev page, Escape → close.
 * Cleans up its own event listener on unmount.
 */
export function useKeyboardNav({ onNext, onPrev, onClose }: Handlers) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignore if focus is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          onNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          onPrev()
          break
        case ' ':
          e.preventDefault()
          e.shiftKey ? onPrev() : onNext()
          break
        case 'Escape':
          onClose?.()
          break
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onNext, onPrev, onClose])
}
