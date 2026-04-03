import type { Manga } from '../../types/manga'
import MangaCard from './MangaCard'
import LEDStrip from './LEDStrip'
import ProgressBadge from './ProgressBadge'
import { SHELF_CARDS_GAP, SHELF_PLANK_HEIGHT, SHELF_ROW_GAP } from '../../utils/constants'

interface Props {
  mangas: Manga[]
  coverUrls: Record<string, string | null>
  onCardClick: (id: string) => void
  /**
   * Passed by react-window — includes absolute position + total row height.
   * paddingTop (SHELF_ROW_GAP) is baked into the row height so the gap
   * between rows is part of each row's allocated space.
   */
  style?: React.CSSProperties
}

/**
 * A single shelf row: a flex row of MangaCards + a wooden plank beneath.
 * The top padding (SHELF_ROW_GAP) is included so SHELF_ROW_HEIGHT is self-contained.
 * Pure component — no store imports.
 */
export default function ShelfRow({ mangas, coverUrls, onCardClick, style }: Props) {
  return (
    <div style={{ ...style, paddingTop: SHELF_ROW_GAP }} className="flex flex-col">
      {/* Cards */}
      <div className="flex flex-row items-end px-4" style={{ gap: SHELF_CARDS_GAP }}>
        {mangas.map((manga) => (
          <MangaCard
            key={manga.id}
            manga={manga}
            coverUrl={coverUrls[manga.id] ?? null}
            onClick={onCardClick}
            badge={
              <ProgressBadge
                progress={manga.readingProgress}
                totalPages={manga.totalPages}
              />
            }
          />
        ))}
      </div>

      {/* Shelf plank — color driven by --shelf-plank-* tokens (theme-aware) */}
      <div
        className="mx-2"
        style={{
          height: SHELF_PLANK_HEIGHT,
          background:
            'linear-gradient(180deg, var(--shelf-plank-from) 0%, var(--shelf-plank-mid) 55%, var(--shelf-plank-to) 100%)',
          borderRadius: '0 0 2px 2px',
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,200,100,0.08)',
        }}
      />

      {/* LED glow strip beneath the plank */}
      <LEDStrip />
    </div>
  )
}
