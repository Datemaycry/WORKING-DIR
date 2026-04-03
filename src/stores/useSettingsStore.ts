import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, DisplayMode } from '../types/settings'

interface SettingsStore extends Settings {
  setAppTheme: (theme: string) => void
  setIsNightMode: (v: boolean) => void
  setShowSpine: (v: boolean) => void
  setShelfTheme: (theme: string) => void
  setPageAnimationsEnabled: (v: boolean) => void
  setSoundVolume: (v: number) => void
  setLedIntensity: (v: number) => void
  setAnimationSpeed: (v: number) => void
  setDisplayMode: (mode: DisplayMode) => void
}

const DEFAULTS: Settings = {
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

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setAppTheme: (appTheme) => set({ appTheme }),
      setIsNightMode: (isNightMode) => set({ isNightMode }),
      setShowSpine: (showSpine) => set({ showSpine }),
      setShelfTheme: (shelfTheme) => set({ shelfTheme }),
      setPageAnimationsEnabled: (pageAnimationsEnabled) => set({ pageAnimationsEnabled }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setLedIntensity: (ledIntensity) => set({ ledIntensity }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setDisplayMode: (displayMode) => set({ displayMode }),
    }),
    { name: 'mangahub-settings' },
  ),
)
