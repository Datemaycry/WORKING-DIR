interface Props {
  enabled: boolean
}

/**
 * Full-screen CSS filter overlay for night reading mode.
 * sepia + reduced brightness are driven by CSS vars set by useSettingsSync.
 * pointer-events: none so it doesn't block interactions.
 * Pure component — no store imports.
 */
export default function NightModeOverlay({ enabled }: Props) {
  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        filter:
          'sepia(calc(var(--night-sepia) * 100%)) brightness(var(--night-brightness))',
        mixBlendMode: 'multiply',
      }}
    />
  )
}
