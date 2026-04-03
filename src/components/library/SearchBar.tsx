import { useRef } from 'react'
import { useFilterStore } from '../../stores/useFilterStore'

export default function SearchBar() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative flex items-center px-4 py-2 shrink-0">
      <span
        className="absolute left-7 text-[var(--color-text-muted)] pointer-events-none"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        ref={inputRef}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher…"
        aria-label="Rechercher un manga"
        className="w-full h-8 pl-7 pr-3 rounded-[var(--radius-md)]
                   bg-[var(--color-surface-raised)] border border-[var(--color-border)]
                   text-[var(--font-size-sm)] text-[var(--color-text)]
                   placeholder:text-[var(--color-text-disabled)]
                   focus:outline-none focus:border-[var(--color-accent)]
                   transition-colors duration-[var(--duration-fast)]"
      />
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery(''); inputRef.current?.focus() }}
          aria-label="Effacer la recherche"
          className="absolute right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          ✕
        </button>
      )}
    </div>
  )
}
