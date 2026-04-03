import { useEffect } from 'react'
import { useSettingsStore } from '../stores/useSettingsStore'

/**
 * Syncs useSettingsStore values to CSS custom properties on <html>.
 * Mount once inside Shell — never in leaf components.
 */
export function useSettingsSync(): void {
  const appTheme = useSettingsStore((s) => s.appTheme)
  const ledIntensity = useSettingsStore((s) => s.ledIntensity)
  const isNightMode = useSettingsStore((s) => s.isNightMode)
  const animationSpeed = useSettingsStore((s) => s.animationSpeed)

  // Theme attribute → CSS variable overrides in index.css
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme)
  }, [appTheme])

  // LED intensity
  useEffect(() => {
    document.documentElement.style.setProperty('--led-intensity', String(ledIntensity))
  }, [ledIntensity])

  // Night mode filters
  useEffect(() => {
    const sepia = isNightMode ? '0.3' : '0'
    const brightness = isNightMode ? '0.85' : '1'
    document.documentElement.style.setProperty('--night-sepia', sepia)
    document.documentElement.style.setProperty('--night-brightness', brightness)
  }, [isNightMode])

  // Animation speed multiplier → scale transition durations
  useEffect(() => {
    const fast = Math.round(120 / animationSpeed)
    const normal = Math.round(220 / animationSpeed)
    const slow = Math.round(400 / animationSpeed)
    document.documentElement.style.setProperty('--duration-fast', `${fast}ms`)
    document.documentElement.style.setProperty('--duration-normal', `${normal}ms`)
    document.documentElement.style.setProperty('--duration-slow', `${slow}ms`)
  }, [animationSpeed])
}
