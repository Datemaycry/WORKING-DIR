interface Props {
  src: string | null
  title: string
}

/**
 * Renders a manga cover image, or a title-based fallback placeholder.
 * Pure component — no store imports.
 */
export default function MangaCover({ src, title }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover"
        draggable={false}
      />
    )
  }
  return (
    <div
      className="w-full h-full flex items-end justify-center bg-[var(--color-surface-raised)]"
      aria-hidden="true"
    >
      <span className="text-[9px] leading-tight text-center text-[var(--color-text-muted)] px-1.5 pb-2 line-clamp-4">
        {title}
      </span>
    </div>
  )
}
