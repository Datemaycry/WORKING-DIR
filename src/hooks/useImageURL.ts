import { useState, useEffect } from 'react'

/**
 * Creates an ObjectURL from a Blob and revokes it on cleanup.
 * Returns null when blob is null or before the effect runs.
 *
 * Every URL.createObjectURL must have a matching URL.revokeObjectURL — this
 * hook is the single place that enforces that lifecycle.
 */
export function useImageURL(blob: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  return url
}
