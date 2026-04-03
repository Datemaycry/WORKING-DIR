import { IDBFactory } from 'fake-indexeddb'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetDBConnection } from './connection'
import { getSettings, saveSettings } from './settings'
import type { Settings } from '../types/settings'

const defaultSettings: Settings = {
  appTheme: 'dark',
  isNightMode: false,
  showSpine: true,
  shelfTheme: 'default',
  pageAnimationsEnabled: true,
  soundVolume: 0.8,
  ledIntensity: 0.6,
  animationSpeed: 1,
  displayMode: 'auto',
}

beforeEach(() => {
  resetDBConnection(new IDBFactory())
})

describe('settings CRUD', () => {
  it('returns undefined when no settings saved', async () => {
    const result = await getSettings()
    expect(result).toBeUndefined()
  })

  it('saves and retrieves settings', async () => {
    await saveSettings(defaultSettings)
    const result = await getSettings()
    expect(result).toEqual(defaultSettings)
  })

  it('upserts (overwrites) existing settings', async () => {
    await saveSettings(defaultSettings)
    await saveSettings({ ...defaultSettings, appTheme: 'light' })
    const result = await getSettings()
    expect(result?.appTheme).toBe('light')
  })
})
