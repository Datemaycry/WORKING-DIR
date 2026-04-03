import type { PageCurlState } from '../../hooks/usePageCurl'

interface Props {
  curl: PageCurlState
}

/**
 * CSS-based page curl overlay. Uses a skewed div that scales in from the
 * trailing edge as `curl.progress` increases (0→1).
 *
 * Only mounted when FLAGS.PAGE_CURL is true (consumer's responsibility).
 * Pure component — no store imports.
 */
export default function PageCurlCanvas({ curl }: Props) {
  if (curl.progress === 0 || !curl.direction) return null

  const fromRight = curl.direction === 'left'
  const width     = `${Math.round(curl.progress * 60)}%`

  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 pointer-events-none z-30"
      style={{
        [fromRight ? 'right' : 'left']: 0,
        width,
        background: fromRight
          ? 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)'
          : 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
        transform: `skewY(${fromRight ? -2 : 2}deg)`,
        transformOrigin: fromRight ? 'right center' : 'left center',
        transition: 'width 120ms ease-out',
      }}
    />
  )
}
