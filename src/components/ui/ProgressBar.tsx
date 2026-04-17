interface ProgressBarProps {
  label: string
  value: number        // 0-100
  delta?: number       // shown briefly after a choice (+/-)
  inverted?: boolean   // true for techDebt (high = bad)
}

export function ProgressBar({ label, value, delta, inverted }: ProgressBarProps) {
  const displayValue = Math.max(0, Math.min(100, value))
  const barColor = inverted
    ? displayValue > 60 ? 'var(--color-danger)' : 'var(--color-ok)'
    : displayValue < 40 ? 'var(--color-danger)' : 'var(--color-ok)'

  return (
    <div className="progress-bar">
      <div className="progress-bar__header">
        <span className="progress-bar__label">{label}</span>
        {delta !== undefined && delta !== 0 && (
          <span className={`progress-bar__delta ${delta > 0 ? 'delta--positive' : 'delta--negative'}`}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${displayValue}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
