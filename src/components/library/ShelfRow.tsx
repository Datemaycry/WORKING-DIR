import type { Manga } from '../../types/manga'
import MangaCard from './MangaCard'
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
          />
        ))}
      </div>

      {/* Shelf plank */}
      <div
        className="mx-2"
        style={{
          height: SHELF_PLANK_HEIGHT,
          background:
            'linear-gradient(180deg, #6b3f1f 0%, #4a2a10 55%, #2e1a08 100%)',
          borderRadius: '0 0 2px 2px',
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,200,100,0.08)',
        }}
      />
    </div>
  )
}
