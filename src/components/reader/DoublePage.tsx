import { useImageURL } from '../../hooks/useImageURL'
import Spinner from '../ui/Spinner'

interface Props {
  blobLeft: Blob | null
  blobRight: Blob | null
  isLoading: boolean
  pageNumberLeft: number
}

/**
 * Side-by-side two-page spread for landscape mode.
 * Right page may be null (last odd page). Pure component — no store imports.
 */
export default function DoublePage({ blobLeft, blobRight, isLoading, pageNumberLeft }: Props) {
  const urlLeft  = useImageURL(blobLeft)
  const urlRight = useImageURL(blobRight)

  if (isLoading || (!urlLeft && !blobLeft)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-row items-center">
      <div className="flex-1 h-full flex items-center justify-end">
        {urlLeft && (
          <img
            src={urlLeft}
            alt={`Page ${pageNumberLeft + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        )}
      </div>
      <div className="flex-1 h-full flex items-center justify-start">
        {urlRight && (
          <img
            src={urlRight}
            alt={`Page ${pageNumberLeft + 2}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        )}
      </div>
    </div>
  )
}
