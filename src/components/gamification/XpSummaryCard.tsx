interface Props {
  totalXp: number
}

export function XpSummaryCard({ totalXp }: Props) {
  return (
    <div className="xp-summary-card">
      <div className="xp-summary-card__value">{totalXp.toLocaleString('fr-FR')}</div>
      <div className="xp-summary-card__label">XP total</div>
    </div>
  )
}
