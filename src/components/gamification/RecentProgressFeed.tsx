import type { GamificationEvent } from '../../features/gamification'

const SLUG_LABELS: Record<string, string> = {
  conflict: 'Gestion des conflits',
  'thomas-kilmann': 'Gestion des conflits',
  'sprint-planning-tension': 'Sprint Planning sous tension',
  'grow-model': 'Modèle GROW',
  'delegation-poker': 'Delegation Poker',
  'psm-full-1': 'PSM I blanc',
}

function prettySlug(slug?: string): string {
  if (!slug) return ''
  return SLUG_LABELS[slug] ?? slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}


function eventLabel(event: GamificationEvent): string {
  switch (event.type) {
    case 'WORKSHOP_STARTED':
      return `Atelier démarré${event.contentSlug ? ` — ${prettySlug(event.contentSlug)}` : ''}`
    case 'WORKSHOP_COMPLETED':
      return `Atelier terminé${event.contentSlug ? ` — ${prettySlug(event.contentSlug)}` : ''}`
    case 'QUIZ_COMPLETED':
      return `Quiz terminé${event.contentSlug ? ` — ${prettySlug(event.contentSlug)}` : ''}`
    case 'ARTIFACT_CREATED':
      return 'Artefact créé'
    case 'BADGE_UNLOCKED':
      return 'Badge débloqué'
    case 'SKILL_LEVEL_UP':
      return 'Niveau de maîtrise atteint'
    case 'CHALLENGE_COMPLETED':
      return 'Défi hebdomadaire complété'
    case 'PATH_COMPLETED':
      return 'Parcours terminé'
    default:
      return event.type.replace(/_/g, ' ').toLowerCase()
  }
}

interface Props {
  events: GamificationEvent[]
}

export function RecentProgressFeed({ events }: Props) {
  const recent = [...events].reverse().slice(0, 10)

  if (recent.length === 0) {
    return (
      <div className="progress-feed progress-feed--empty">
        <p>Aucune activité récente.</p>
      </div>
    )
  }

  return (
    <ul className="progress-feed" aria-label="Journal d’entraînement">
      {recent.map(event => (
        <li key={event.id} className="progress-feed__item">
          <span className="progress-feed__label">{eventLabel(event)}</span>
          <span className="progress-feed__xp">+{event.xpAwarded} XP</span>
        </li>
      ))}
    </ul>
  )
}
