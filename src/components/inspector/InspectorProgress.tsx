import type { ReadingProgress } from '../../types/progress'
import { formatProgress } from '../../utils/format'
import Button from '../ui/Button'

interface Props {
  progress: ReadingProgress
  totalPages: number
  onResume: () => void
}

export default function InspectorProgress({ progress, totalPages, onResume }: Props) {
  const pct = totalPages > 0 ? Math.round((progress.currentPage / totalPages) * 100) : 0
  const hasStarted = progress.currentPage > 0

  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between text-[var(--font-size-sm)]">
        <span className="text-[var(--color-text-muted)]">Progression</span>
        <span className="font-[var(--font-weight-medium)]">
          {progress.completed ? 'Terminé' : formatProgress(progress.currentPage, totalPages)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-[var(--radius-full)] bg-[var(--color-surface-raised)] overflow-hidden">
        <div
          className="h-full rounded-[var(--radius-full)] bg-[var(--color-accent)] transition-all duration-[var(--duration-slow)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      {hasStarted && !progress.completed && (
        <Button variant="secondary" size="sm" onClick={onResume} className="self-start">
          Reprendre — p. {progress.currentPage}
        </Button>
      )}
    </div>
  )
}
