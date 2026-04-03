interface Props {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

/**
 * Horizontal range slider for quick page navigation.
 * Pure component — no store imports.
 */
export default function PageSlider({ currentPage, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <input
      type="range"
      min={0}
      max={totalPages - 1}
      value={currentPage}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Navigation rapide"
      className="w-full h-1 accent-[var(--color-accent)] cursor-pointer"
    />
  )
}
