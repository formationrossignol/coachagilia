import type { WorkshopIntention } from '../../data/workshops/intentions'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  onSelect: (slug: string) => void
}

export function IntentionNav({ intentions, workshopMap, workshops, onSelect }: Props) {
  const existingSlugs = new Set(workshops.map(w => w.slug))

  return (
    <div className="intention-nav">
      {intentions.map(intention => {
        const count = (workshopMap[intention.slug] ?? []).filter(s => existingSlugs.has(s)).length
        return (
          <button
            key={intention.slug}
            className="intention-nav__tile"
            data-intention={intention.slug}
            onClick={() => onSelect(intention.slug)}
          >
            <span className="intention-nav__emoji">{intention.emoji}</span>
            <span className="intention-nav__label">{intention.label}</span>
            <div className="intention-nav__name">{intention.name}</div>
            <div className="intention-nav__subtitle">{intention.subtitle}</div>
            <div className="intention-nav__count">{count} atelier{count !== 1 ? 's' : ''}</div>
          </button>
        )
      })}
    </div>
  )
}
