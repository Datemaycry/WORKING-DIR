interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <span className="text-5xl leading-none" aria-hidden="true">{icon}</span>
      <p className="text-[var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text)]">
        {title}
      </p>
      {description && (
        <p className="text-[var(--font-size-sm)] text-[var(--color-text-muted)] max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
