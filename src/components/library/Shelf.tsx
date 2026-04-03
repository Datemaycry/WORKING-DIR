import { useMemo } from 'react'
import * as ReactWindow from 'react-window'
import type { ListChildComponentProps } from 'react-window'

const FixedSizeList = ReactWindow.FixedSizeList
import type { Manga } from '../../types/manga'
import ShelfRow from './ShelfRow'
import EmptyState from '../ui/EmptyState'
import { SHELF_ROW_HEIGHT } from '../../utils/constants'

interface RowData {
  rows: Manga[][]
  coverUrls: Record<string, string | null>
  onCardClick: (id: string) => void
}

function Row({ index, style, data }: ListChildComponentProps<RowData>) {
  return (
    <ShelfRow
      style={style}
      mangas={data.rows[index]}
      coverUrls={data.coverUrls}
      onCardClick={data.onCardClick}
    />
  )
}

interface Props {
  mangas: Manga[]
  coverUrls: Record<string, string | null>
  onCardClick: (id: string) => void
  colCount: number
  height: number
  width: number
  emptyAction?: React.ReactNode
}

export default function Shelf({ mangas, coverUrls, onCardClick, colCount, height, width, emptyAction }: Props) {
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

  const rows = useMemo(() => {
    const result: Manga[][] = []
    for (let i = 0; i < mangas.length; i += colCount) {
      result.push(mangas.slice(i, i + colCount))
    }
    return result
  }, [mangas, colCount])

  const itemData = useMemo(
    () => ({ rows, coverUrls, onCardClick }),
    [rows, coverUrls, onCardClick]
  )

  return (
    <FixedSizeList
      height={height}
      width={width}
      itemCount={rows.length}
      itemSize={SHELF_ROW_HEIGHT}
      itemData={itemData}
      overscanCount={2}
    >
      {Row}
    </FixedSizeList>
  )
}
