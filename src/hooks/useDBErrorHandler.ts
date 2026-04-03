import { useCallback } from 'react'
import { useUIStore } from '../stores/useUIStore'
import { DBQuotaError, DBUnavailableError } from '../db/connection'

/**
 * Returns a handler that converts known DB errors into user-facing toasts.
 * Use it in feature components to wrap store async calls.
 *
 * @example
 *   const handleDBError = useDBErrorHandler()
 *   try { await addManga(manga) } catch (e) { handleDBError(e) }
 */
export function useDBErrorHandler(): (err: unknown) => void {
  const pushToast = useUIStore((s) => s.pushToast)

  return useCallback(
    (err: unknown) => {
      if (err instanceof DBQuotaError) {
        pushToast({
          type: 'error',
          message: 'Stockage plein. Libérez de l'espace ou supprimez des mangas.',
        })
      } else if (err instanceof DBUnavailableError) {
        pushToast({
          type: 'error',
          message: 'Base de données indisponible (mode privé ou navigateur non supporté).',
        })
      } else {
        pushToast({ type: 'error', message: 'Une erreur inattendue est survenue.' })
        console.error('[DB]', err)
      }
    },
    [pushToast],
  )
}
