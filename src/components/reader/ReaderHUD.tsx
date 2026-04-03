interface Props {
  currentPage: number
  totalPages: number
  title?: string
}

/**
 * Minimal overlay: page counter centré en bas.
 * Pure component — no store imports.
 */
export default function ReaderHUD({ currentPage, totalPages, title }: Props) {
  return (
    <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-0.5 pb-3 pointer-events-none">
      {title && (
        <p className="text-[10px] text-white/50 leading-none max-w-[60%] truncate">{title}</p>
      )}
      <p className="text-xs text-white/70 leading-none tabular-nums">
        {currentPage + 1} / {totalPages}
      </p>
    </div>
  )
}
