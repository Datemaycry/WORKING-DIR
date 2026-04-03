import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-95',
  secondary:
    'bg-[var(--color-surface-raised)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]',
  ghost:
    'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]',
  danger:
    'bg-[var(--color-error)] text-white hover:opacity-90 active:scale-95',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-7 px-3 text-[var(--font-size-xs)] gap-1.5',
  md: 'h-9 px-4 text-[var(--font-size-sm)] gap-2',
  lg: 'h-11 px-6 text-[var(--font-size-base)] gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={`inline-flex items-center justify-center rounded-[var(--radius-md)]
                  font-[var(--font-weight-medium)] transition-all
                  duration-[var(--duration-fast)] select-none
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
