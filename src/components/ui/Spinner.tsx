interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-3' }

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Chargement…"
      className={`inline-block rounded-full border-[var(--color-border)]
                  border-t-[var(--color-accent)] animate-spin
                  ${sizeClasses[size]} ${className}`}
    />
  )
}
