import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  showValue?: boolean
  formatValue?: (v: number) => string
}

export default function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  showValue = true,
  formatValue = (v) => v.toFixed(2),
  className = '',
  ...props
}: SliderProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-[var(--font-size-sm)] text-[var(--color-text-muted)]">{label}</label>
        {showValue && (
          <span className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] tabular-nums">
            {formatValue(value)}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
                   bg-[var(--color-border)]
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[var(--color-accent)]
                   [&::-webkit-slider-thumb]:cursor-pointer"
        {...props}
      />
    </div>
  )
}
