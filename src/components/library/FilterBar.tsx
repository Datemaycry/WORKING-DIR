import { useFilterStore } from '../../stores/useFilterStore'
import Pill from '../ui/Pill'
import Button from '../ui/Button'

interface Props {
  onOpenModal: () => void
}

/**
 * Shows active filter pills + a "Filtres" button to open the FilterModal.
 * Only visible when there are active filters or available filters.
 */
export default function FilterBar({ onOpenModal }: Props) {
  const activeAuthors = useFilterStore((s) => s.activeAuthors)
  const activeSeries = useFilterStore((s) => s.activeSeries)
  const activeTags = useFilterStore((s) => s.activeTags)
  const toggleAuthor = useFilterStore((s) => s.toggleAuthor)
  const toggleSeries = useFilterStore((s) => s.toggleSeries)
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const clearFilters = useFilterStore((s) => s.clearFilters)

  const hasActive = activeAuthors.length + activeSeries.length + activeTags.length > 0

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto shrink-0"
      style={{ scrollbarWidth: 'none' }}
    >
      <Button variant="secondary" size="sm" onClick={onOpenModal} className="shrink-0">
        Filtres {hasActive && `(${activeAuthors.length + activeSeries.length + activeTags.length})`}
      </Button>

      {activeAuthors.map((a) => (
        <Pill key={a} label={a} active onRemove={() => toggleAuthor(a)} />
      ))}
      {activeSeries.map((s) => (
        <Pill key={s} label={s} active onRemove={() => toggleSeries(s)} />
      ))}
      {activeTags.map((t) => (
        <Pill key={t} label={t} active onRemove={() => toggleTag(t)} />
      ))}

      {hasActive && (
        <button
          onClick={clearFilters}
          className="shrink-0 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline"
        >
          Tout effacer
        </button>
      )}
    </div>
  )
}
