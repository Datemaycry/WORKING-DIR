import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from './useSettingsStore'

beforeEach(() => {
  useSettingsStore.setState({
    appTheme: 'dark',
    isNightMode: false,
    showSpine: true,
    shelfTheme: 'default',
    pageAnimationsEnabled: true,
    soundVolume: 0.8,
    ledIntensity: 0.6,
    animationSpeed: 1,
    displayMode: 'auto',
  })
})

describe('useSettingsStore', () => {
  it('has correct defaults', () => {
    expect(useSettingsStore.getState().appTheme).toBe('dark')
    expect(useSettingsStore.getState().ledIntensity).toBe(0.6)
  })

  it('setAppTheme updates theme', () => {
    useSettingsStore.getState().setAppTheme('light')
    expect(useSettingsStore.getState().appTheme).toBe('light')
  })

  it('setLedIntensity updates intensity', () => {
    useSettingsStore.getState().setLedIntensity(1.0)
    expect(useSettingsStore.getState().ledIntensity).toBe(1.0)
  })

  it('setDisplayMode updates mode', () => {
    useSettingsStore.getState().setDisplayMode('double')
    expect(useSettingsStore.getState().displayMode).toBe('double')
  })

  it('setIsNightMode toggles night mode', () => {
    useSettingsStore.getState().setIsNightMode(true)
    expect(useSettingsStore.getState().isNightMode).toBe(true)
  })
})
