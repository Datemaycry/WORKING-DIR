import { formatDate } from '../../utils/format'

interface Props {
  series: string[]
  tags: string[]
  totalPages: number
  createdAt: number
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{label}</span>
      <span className="text-[var(--font-size-sm)]">{value}</span>
    </div>
  )
}

export default function InspectorMeta({ series, tags, totalPages, createdAt }: Props) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-[var(--color-border)]">
      {series.length > 0 && <MetaRow label="Série" value={series.join(', ')} />}
      <MetaRow label="Pages" value={String(totalPages)} />
      <MetaRow label="Ajouté le" value={formatDate(createdAt)} />
      {tags.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-[var(--radius-full)] text-[10px]
                           bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
