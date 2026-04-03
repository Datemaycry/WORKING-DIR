import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = { sm: 'w-7 h-7 text-sm', md: 'w-9 h-9 text-base', lg: 'w-11 h-11 text-lg' }

export default function IconButton({ label, size = 'md', children, className = '', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-[var(--radius-md)]
                  text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                  hover:bg-[var(--color-surface-raised)] transition-colors
                  duration-[var(--duration-fast)] disabled:opacity-40 disabled:cursor-not-allowed
                  ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
