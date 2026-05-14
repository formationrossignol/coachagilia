import { Activity, Handshake, HeartPulse, MessageCircleWarning, RefreshCcw, Scale, SearchCheck, Target, Zap } from 'lucide-react'
import type { WorkshopDefinition } from '../../data/workshops/types'
import type { WorkshopIntention } from '../../data/workshops/intentions'

interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  onSelect: (slug: string) => void
}

const INTENTION_ICONS = {
  'gerer-conflit': MessageCircleWarning,
  'faciliter-decision': Scale,
  'debloquer-equipe': HeartPulse,
  'preparer-retro': RefreshCcw,
  'cause-racine': SearchCheck,
  'aligner-parties-prenantes': Handshake,
  'ameliorer-flow': Activity,
  'preparer-coaching': Target,
} as const

export function IntentionNav({ intentions, workshopMap, workshops, onSelect }: Props) {
  return (
    <div className="intention-nav" aria-label="Ateliers par intention">
      {intentions.map(intention => {
        const slugs = workshopMap[intention.slug] ?? []
        const count = workshops.filter(w => slugs.includes(w.slug) && !w.comingSoon).length
        const Icon = INTENTION_ICONS[intention.slug as keyof typeof INTENTION_ICONS] ?? Zap
        return (
          <button
            key={intention.slug}
            type="button"
            className="intention-nav__tile"
            data-intention={intention.slug}
            onClick={() => onSelect(intention.slug)}
          >
            <span className="intention-nav__icon" aria-hidden="true"><Icon size={26} strokeWidth={1.8} /></span>
            <span className="intention-nav__label">{intention.label}</span>
            <span className="intention-nav__name">{intention.name}</span>
            <span className="intention-nav__subtitle">{intention.subtitle}</span>
            <span className="intention-nav__count">{count} atelier{count !== 1 ? 's' : ''} disponibles</span>
            <span className="intention-nav__explore">Explorer →</span>
          </button>
        )
      })}
    </div>
  )
}
