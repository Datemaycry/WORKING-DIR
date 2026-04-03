import { useCallback, useEffect, useRef } from 'react'
import { useSettingsStore } from '../stores/useSettingsStore'
import FLAGS from '../flags'

type SoundName = 'page-turn' | 'ui-click'

const SOUND_PATHS: Record<SoundName, string> = {
  'page-turn': '/assets/sounds/page-turn.mp3',
  'ui-click':  '/assets/sounds/ui-click.mp3',
}

/**
 * Returns a `play(name)` function that plays a sound at the current volume.
 * Silently no-ops when FLAGS.SOUND is false or volume is 0.
 * Audio elements are created lazily and reused.
 */
export function useSounds() {
  const volume    = useSettingsStore((s) => s.soundVolume)
  const audioRefs = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({})

  // Pre-load audio elements when sound is enabled
  useEffect(() => {
    if (!FLAGS.SOUND) return
    const refs = audioRefs.current
    ;(Object.keys(SOUND_PATHS) as SoundName[]).forEach((name) => {
      if (!refs[name]) {
        const el = new Audio(SOUND_PATHS[name])
        el.preload = 'auto'
        refs[name] = el
      }
    })
    return () => {
      ;(Object.values(refs) as HTMLAudioElement[]).forEach((el) => {
        el.pause()
        el.src = ''
      })
      audioRefs.current = {}
    }
  }, [])

  const play = useCallback(
    (name: SoundName) => {
      if (!FLAGS.SOUND || volume === 0) return
      const el = audioRefs.current[name]
      if (!el) return
      el.volume = Math.max(0, Math.min(1, volume))
      el.currentTime = 0
      el.play().catch(() => {
        // Autoplay policy — ignore silently
      })
    },
    [volume]
  )

  return { play }
}
