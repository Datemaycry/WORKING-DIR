import type { ReadingProgress } from '../../types/progress'

interface Props {
  progress: ReadingProgress
  totalPages: number
}

/**
 * Small badge overlay for MangaCard.
 * - Not started (currentPage === 0): no badge
 * - In progress: shows percentage pill
 * - Completed: shows check mark pill
 * Pure component — no store imports.
 */
export default function ProgressBadge({ progress, totalPages }: Props) {
  if (progress.completed) {
    return (
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full
                   bg-[var(--color-success)] text-white text-[9px] font-bold shadow"
        aria-label="Terminé"
      >
        ✓
      </span>
    )
  }

  if (progress.currentPage === 0 || totalPages === 0) return null

  const pct = Math.round((progress.currentPage / totalPages) * 100)

  return (
    <span
      className="flex items-center justify-center h-4 px-1 rounded-[var(--radius-sm)]
                 bg-black/70 text-white text-[9px] font-[var(--font-weight-medium)] shadow"
      aria-label={`${pct} % lu`}
    >
      {pct}%
    </span>
  )
}
