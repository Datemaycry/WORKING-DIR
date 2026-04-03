import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useUIStore } from '../../stores/useUIStore'
import type { Toast as ToastType } from '../../stores/useUIStore'

const ICONS: Record<ToastType['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const COLORS: Record<ToastType['type'], string> = {
  success: 'border-[var(--color-success)] text-[var(--color-success)]',
  error: 'border-[var(--color-error)] text-[var(--color-error)]',
  info: 'border-[var(--color-info)] text-[var(--color-info)]',
}

const AUTO_DISMISS_MS = 4000

function ToastItem({ toast }: { toast: ToastType }) {
  const dismissToast = useUIStore((s) => s.dismissToast)

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [toast.id, dismissToast])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)]
                  bg-[var(--color-surface-raised)] border-l-4
                  shadow-lg animate-toast-in text-[var(--font-size-sm)]
                  ${COLORS[toast.type]}`}
    >
      <span className="shrink-0 font-[var(--font-weight-bold)]">{ICONS[toast.type]}</span>
      <span className="flex-1 text-[var(--color-text)]">{toast.message}</span>
      <button
        onClick={() => dismissToast(toast.id)}
        aria-label="Fermer"
        className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      >
        ✕
      </button>
    </div>
  )
}

/**
 * ToastContainer — mount once in App/Shell, renders all active toasts.
 * Connects to useUIStore directly (it's a feature component).
 */
export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return createPortal(
    <div
      className="fixed bottom-[calc(var(--navbar-height)+16px)] right-4 z-50
                 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>,
    document.body,
  )
}
