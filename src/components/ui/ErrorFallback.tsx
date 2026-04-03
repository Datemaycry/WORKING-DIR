interface ErrorFallbackProps {
  error: Error
  resetError?: () => void
}

export default function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 min-h-dvh px-6 text-center
                 bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      <h1 className="text-[var(--font-size-xl)] font-[var(--font-weight-bold)]">
        Une erreur est survenue
      </h1>
      <p className="text-[var(--font-size-sm)] text-[var(--color-text-muted)] max-w-sm">
        {error.message}
      </p>
      {resetError && (
        <button
          onClick={resetError}
          className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white
                     text-[var(--font-size-sm)] font-[var(--font-weight-medium)]
                     hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
