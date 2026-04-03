import SinglePage from './SinglePage'

interface Props {
  blob: Blob | null
  isLoading: boolean
  pageNumber: number
}

/**
 * Chooses between single and double page layout.
 * 5a: always single. 5d will add double-page mode.
 */
export default function PageDisplay({ blob, isLoading, pageNumber }: Props) {
  return (
    <div className="w-full h-full">
      <SinglePage blob={blob} isLoading={isLoading} alt={`Page ${pageNumber + 1}`} />
    </div>
  )
}
