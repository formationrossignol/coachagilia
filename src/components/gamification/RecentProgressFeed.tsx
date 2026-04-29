import type { GamificationEvent } from '../../features/gamification'

function eventLabel(event: GamificationEvent): string {
  switch (event.type) {
    case 'WORKSHOP_COMPLETED':
      return `Atelier complété${event.contentSlug ? ` : ${event.contentSlug}` : ''}`
    case 'QUIZ_COMPLETED':
      return `Quiz complété${event.contentSlug ? ` : ${event.contentSlug}` : ''}`
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
    <ul className="progress-feed" aria-label="Activité récente">
      {recent.map(event => (
        <li key={event.id} className="progress-feed__item">
          <span className="progress-feed__label">{eventLabel(event)}</span>
          <span className="progress-feed__xp">+{event.xpAwarded} XP</span>
        </li>
      ))}
    </ul>
  )
}
