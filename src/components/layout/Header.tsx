interface HeaderProps {
  title?: string
  left?: React.ReactNode
  right?: React.ReactNode
}

export default function Header({ title = 'MangaHub Pro', left, right }: HeaderProps) {
  return (
    <header
      style={{ height: 'var(--header-height)' }}
      className="flex items-center justify-between px-4 shrink-0
                 bg-[var(--color-surface)] border-b border-[var(--color-border)]"
    >
      <div className="flex items-center gap-2 min-w-0">
        {left}
        <h1 className="text-[var(--font-size-lg)] font-[var(--font-weight-bold)] truncate">
          {title}
        </h1>
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </header>
  )
}
