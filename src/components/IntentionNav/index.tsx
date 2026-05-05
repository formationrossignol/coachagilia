import type { WorkshopIntention } from '../../data/workshops/intentions'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  activeIntention: string | null
  onSelect: (slug: string | null) => void
}

export function IntentionNav({ intentions, workshopMap, workshops, activeIntention, onSelect }: Props) {
  const existingSlugs = new Set(workshops.map(w => w.slug))

  return (
    <div className="intention-nav">
      {intentions.map(intention => {
        const count = (workshopMap[intention.slug] ?? []).filter(s => existingSlugs.has(s)).length
        const isActive = activeIntention === intention.slug
        return (
          <button
            key={intention.slug}
            className={`intention-nav__tile${isActive ? ' intention-nav__tile--active' : ''}`}
            onClick={() => onSelect(isActive ? null : intention.slug)}
          >
            <span className="intention-nav__emoji">{intention.emoji}</span>
            <div>
              <div className="intention-nav__name">{intention.name}</div>
              <div className="intention-nav__subtitle">{intention.subtitle}</div>
              <div className="intention-nav__count">{count} atelier{count !== 1 ? 's' : ''}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
