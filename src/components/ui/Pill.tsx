interface PillProps {
  label: string
  active?: boolean
  onToggle?: () => void
  onRemove?: () => void
  disabled?: boolean
}

export default function Pill({ label, active = false, onToggle, onRemove, disabled = false }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-full)]
                  text-[var(--font-size-xs)] font-[var(--font-weight-medium)]
                  border transition-colors duration-[var(--duration-fast)]
                  ${active
                    ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }
                  ${onToggle && !disabled ? 'cursor-pointer hover:border-[var(--color-accent)]' : ''}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {onToggle ? (
        <button
          onClick={onToggle}
          disabled={disabled}
          className="outline-none"
          aria-pressed={active}
          aria-label={label}
        >
          {label}
        </button>
      ) : (
        <span>{label}</span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Supprimer ${label}`}
          className="ml-0.5 text-current opacity-60 hover:opacity-100 outline-none"
        >
          ✕
        </button>
      )}
    </span>
  )
}
