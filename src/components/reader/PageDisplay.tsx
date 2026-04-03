import type { DisplayMode } from '../../types/settings'
import SinglePage from './SinglePage'
import DoublePage from './DoublePage'

interface Props {
  blob: Blob | null
  blobNext: Blob | null
  isLoading: boolean
  pageNumber: number
  viewMode: DisplayMode
  isLandscape: boolean
}

/**
 * Routes to SinglePage or DoublePage depending on viewMode + orientation.
 * - 'single'   → always single
 * - 'double'   → always double
 * - 'auto'     → double when landscape, single otherwise
 */
export default function PageDisplay({ blob, blobNext, isLoading, pageNumber, viewMode, isLandscape }: Props) {
  const useDouble =
    viewMode === 'double' || (viewMode === 'auto' && isLandscape)

  if (useDouble) {
    return (
      <DoublePage
        blobLeft={blob}
        blobRight={blobNext}
        isLoading={isLoading}
        pageNumberLeft={pageNumber}
      />
    )
  }

  return (
    <SinglePage blob={blob} isLoading={isLoading} alt={`Page ${pageNumber + 1}`} />
  )
}
