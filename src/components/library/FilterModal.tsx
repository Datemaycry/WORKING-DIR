import { useFilterStore } from '../../stores/useFilterStore'
import Modal from '../ui/Modal'
import Pill from '../ui/Pill'
import Button from '../ui/Button'

interface Props {
  open: boolean
  onClose: () => void
  allAuthors: string[]
  allSeries: string[]
  allTags: string[]
}

function Section({ title, items, active, onToggle }: {
  title: string
  items: string[]
  active: string[]
  onToggle: (v: string) => void
}) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Pill
            key={item}
            label={item}
            active={active.includes(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  )
}

export default function FilterModal({ open, onClose, allAuthors, allSeries, allTags }: Props) {
  const activeAuthors = useFilterStore((s) => s.activeAuthors)
  const activeSeries = useFilterStore((s) => s.activeSeries)
  const activeTags = useFilterStore((s) => s.activeTags)
  const toggleAuthor = useFilterStore((s) => s.toggleAuthor)
  const toggleSeries = useFilterStore((s) => s.toggleSeries)
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const clearFilters = useFilterStore((s) => s.clearFilters)

  const hasActive = activeAuthors.length + activeSeries.length + activeTags.length > 0

  return (
    <Modal open={open} onClose={onClose} title="Filtres">
      <div className="flex flex-col gap-5 p-4">
        <Section title="Auteurs" items={allAuthors} active={activeAuthors} onToggle={toggleAuthor} />
        <Section title="Séries" items={allSeries} active={activeSeries} onToggle={toggleSeries} />
        <Section title="Tags" items={allTags} active={activeTags} onToggle={toggleTag} />

        {allAuthors.length === 0 && allSeries.length === 0 && allTags.length === 0 && (
          <p className="text-[var(--color-text-muted)] text-[var(--font-size-sm)] text-center py-4">
            Aucun filtre disponible.
          </p>
        )}

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="self-center">
            Effacer les filtres
          </Button>
        )}
      </div>
    </Modal>
  )
}
