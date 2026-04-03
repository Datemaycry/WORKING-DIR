import type { Manga } from '../../types/manga'
import ShelfRow from './ShelfRow'
import EmptyState from '../ui/EmptyState'
import { SHELF_ROW_GAP } from '../../utils/constants'

interface Props {
  mangas: Manga[]
  coverUrls: Record<string, string | null>
  onCardClick: (id: string) => void
  colCount: number
  emptyAction?: React.ReactNode
}

/**
 * Splits mangas into rows and renders each as a ShelfRow.
 * Virtualisation (react-window) is added in 4b — this version renders all rows.
 */
export default function Shelf({ mangas, coverUrls, onCardClick, colCount, emptyAction }: Props) {
  if (mangas.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Bibliothèque vide"
        description="Ajoutez vos premiers mangas pour commencer."
        action={emptyAction}
      />
    )
  }

  const rows: Manga[][] = []
  for (let i = 0; i < mangas.length; i += colCount) {
    rows.push(mangas.slice(i, i + colCount))
  }

  return (
    <div className="flex-1 overflow-y-auto pt-4 pb-6">
      <div className="flex flex-col" style={{ gap: SHELF_ROW_GAP }}>
        {rows.map((rowMangas, rowIndex) => (
          <ShelfRow
            key={rowIndex}
            mangas={rowMangas}
            coverUrls={coverUrls}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  )
}
