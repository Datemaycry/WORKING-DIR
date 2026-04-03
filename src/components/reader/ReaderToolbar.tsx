import PageSlider from './PageSlider'

interface Props {
  currentPage: number
  totalPages: number
  title?: string
  onPrev: () => void
  onNext: () => void
  onBack: () => void
  onGoToPage: (page: number) => void
  visible: boolean
}

/**
 * Overlay toolbar: back button (top-left) + prev/next arrows + slider.
 * Fades in/out based on `visible`. Pure component — no store imports.
 */
export default function ReaderToolbar({
  currentPage,
  totalPages,
  title,
  onPrev,
  onNext,
  onBack,
  onGoToPage,
  visible,
}: Props) {
  const base =
    'transition-opacity duration-[var(--duration-normal)] pointer-events-none'
  const vis = visible ? 'opacity-100 pointer-events-auto' : 'opacity-0'

  return (
    <>
      {/* Top bar: back + title */}
      <div className={`absolute top-0 inset-x-0 z-20 flex items-center gap-3 px-4 py-3
                       bg-gradient-to-b from-black/60 to-transparent ${base} ${vis}`}>
        <button
          onClick={onBack}
          aria-label="Retour à la bibliothèque"
          className="flex items-center justify-center w-9 h-9 rounded-full
                     bg-black/40 text-white hover:bg-black/60"
        >
          ←
        </button>
        {title && (
          <span className="text-sm text-white/80 truncate flex-1">{title}</span>
        )}
      </div>

      {/* Left tap zone / prev button */}
      <button
        onClick={onPrev}
        aria-label="Page précédente"
        disabled={currentPage === 0}
        className={`absolute left-0 top-[10%] h-[80%] w-[20%] z-10
                    flex items-center justify-start pl-2 ${base} ${vis}
                    disabled:opacity-30`}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full
                         bg-black/40 text-white text-lg">‹</span>
      </button>

      {/* Right tap zone / next button */}
      <button
        onClick={onNext}
        aria-label="Page suivante"
        disabled={currentPage >= totalPages - 1}
        className={`absolute right-0 top-[10%] h-[80%] w-[20%] z-10
                    flex items-center justify-end pr-2 ${base} ${vis}
                    disabled:opacity-30`}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full
                         bg-black/40 text-white text-lg">›</span>
      </button>

      {/* Bottom bar: slider */}
      <div className={`absolute bottom-0 inset-x-0 z-20 px-4 pb-4 pt-6
                       bg-gradient-to-t from-black/60 to-transparent ${base} ${vis}`}>
        <PageSlider
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={onGoToPage}
        />
      </div>
    </>
  )
}
