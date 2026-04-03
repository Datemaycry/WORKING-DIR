import { useImageURL } from '../../hooks/useImageURL'
import Spinner from '../ui/Spinner'

interface Props {
  blob: Blob | null
  isLoading: boolean
  alt?: string
}

/**
 * Renders one manga page. Creates an ObjectURL from the blob and revokes it
 * on cleanup via useImageURL. Pure component — no store imports.
 */
export default function SinglePage({ blob, isLoading, alt = 'Page' }: Props) {
  const url = useImageURL(blob)

  if (isLoading || (!url && !blob)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!url) return null

  return (
    <img
      src={url}
      alt={alt}
      className="w-full h-full object-contain select-none"
      draggable={false}
    />
  )
}
