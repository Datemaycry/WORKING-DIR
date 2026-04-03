import type { Settings } from '../types/settings'
import { getDB } from './connection'

const SETTINGS_KEY = 'app-settings'

interface SettingsRecord {
  key: string
  value: Settings
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getSettings(): Promise<Settings | undefined> {
  const db = await getDB()
  const transaction = db.transaction('settings', 'readonly')
  const record = await promisify<SettingsRecord | undefined>(
    transaction.objectStore('settings').get(SETTINGS_KEY),
  )
  return record?.value
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDB()
  const transaction = db.transaction('settings', 'readwrite')
  const store = transaction.objectStore('settings')

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
    store.put({ key: SETTINGS_KEY, value: settings })
  })
}
