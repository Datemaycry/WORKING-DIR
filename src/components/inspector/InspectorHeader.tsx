import MangaCover from '../library/MangaCover'

interface Props {
  title: string
  authors: string[]
  coverUrl: string | null
}

export default function InspectorHeader({ title, authors, coverUrl }: Props) {
  return (
    <div className="flex gap-4 p-4 border-b border-[var(--color-border)]">
      <div
        className="shrink-0 rounded-[var(--radius-sm)] overflow-hidden shadow-lg"
        style={{ width: 80, height: 114 }}
      >
        <MangaCover src={coverUrl} title={title} />
      </div>
      <div className="flex flex-col justify-center gap-1 min-w-0">
        <p className="font-[var(--font-weight-bold)] text-[var(--font-size-base)] leading-snug line-clamp-3">
          {title}
        </p>
        {authors.length > 0 && (
          <p className="text-[var(--font-size-sm)] text-[var(--color-text-muted)] line-clamp-2">
            {authors.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
