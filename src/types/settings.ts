export type DisplayMode = 'auto' | 'single' | 'double'

export interface Settings {
  appTheme: string
  isNightMode: boolean
  showSpine: boolean
  shelfTheme: string
  pageAnimationsEnabled: boolean
  soundVolume: number
  ledIntensity: number
  animationSpeed: number
  displayMode: DisplayMode
}
