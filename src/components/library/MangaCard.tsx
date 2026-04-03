import type { Manga } from '../../types/manga'
import MangaCover from './MangaCover'
import { CARD_COVER_WIDTH, CARD_COVER_HEIGHT } from '../../utils/constants'

interface Props {
  manga: Manga
  coverUrl: string | null
  onClick: (id: string) => void
  /** Optional badge overlay (ProgressBadge slot, added in 4h) */
  badge?: React.ReactNode
}

/**
 * Card showing cover + title. Pure component — no store imports.
 */
export default function MangaCard({ manga, coverUrl, onClick, badge }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(manga.id)}
      aria-label={`Ouvrir ${manga.title}`}
      className="flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-[var(--radius-sm)] group"
    >
      <div
        className="relative overflow-hidden rounded-[var(--radius-sm)] shadow-md transition-transform duration-[var(--duration-fast)] group-hover:scale-[1.04] group-active:scale-[0.97]"
        style={{ width: CARD_COVER_WIDTH, height: CARD_COVER_HEIGHT }}
      >
        <MangaCover src={coverUrl} title={manga.title} />
        {badge && <div className="absolute bottom-1 right-1">{badge}</div>}
      </div>
      <p
        className="text-[10px] leading-tight text-center text-[var(--color-text-muted)] line-clamp-2"
        style={{ width: CARD_COVER_WIDTH }}
      >
        {manga.title}
      </p>
    </button>
  )
}
