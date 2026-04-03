interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="text-[var(--font-size-sm)] text-[var(--color-text)]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors
                    duration-[var(--duration-fast)] shrink-0
                    disabled:opacity-40 disabled:cursor-not-allowed
                    ${checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow
                      transition-transform duration-[var(--duration-fast)]
                      ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}
