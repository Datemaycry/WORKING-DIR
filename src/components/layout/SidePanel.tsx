import { useEffect, useRef } from 'react'

interface SidePanelProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function SidePanel({ open, onClose, children, title }: SidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus trap — move focus into panel when it opens
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width: 'var(--sidebar-width)' }}
        className={`fixed top-0 right-0 h-full z-50 flex flex-col
                    bg-[var(--color-surface)] border-l border-[var(--color-border)]
                    transition-transform duration-[var(--duration-normal)] ease-in-out
                    outline-none
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0">
            <span className="font-[var(--font-weight-bold)] text-[var(--font-size-lg)]">{title}</span>
            <button
              onClick={onClose}
              className="p-1 rounded-[var(--radius-sm)] text-[var(--color-text-muted)]
                         hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
