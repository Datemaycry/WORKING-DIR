/**
 * LED glow strip that sits beneath the shelf plank.
 * Intensity and color are driven by CSS variables set by useSettingsSync.
 * Pure component — no store imports.
 */
export default function LEDStrip() {
  return (
    <div
      className="mx-2"
      style={{
        height: 3,
        borderRadius: 'var(--radius-full)',
        background: 'var(--led-color)',
        boxShadow:
          '0 0 6px 2px var(--led-color), 0 0 18px 4px var(--led-color)',
        animation: 'shelf-glow 3s ease-in-out infinite',
      }}
      aria-hidden="true"
    />
  )
}
