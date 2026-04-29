import { Award } from 'lucide-react'
import type { BadgeDefinition } from '../../features/gamification'

interface Props {
  badge: BadgeDefinition
  unlockedAt?: string  // ISO date string; undefined = locked
}

export function BadgeCard({ badge, unlockedAt }: Props) {
  const isUnlocked = unlockedAt !== undefined

  return (
    <article className={`badge-card${isUnlocked ? '' : ' badge-card--locked'}`}>
      <div className="badge-card__icon">
        <Award size={24} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="badge-card__body">
        <h3 className="badge-card__title">{badge.name}</h3>
        <p className="badge-card__description">{badge.description}</p>
        {isUnlocked ? (
          <span className="badge-card__unlocked-at">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </span>
        ) : (
          <ul className="badge-card__criteria">
            {badge.criteria.completedContent && (
              <li>Compléter : {badge.criteria.completedContent.join(', ')}</li>
            )}
            {badge.criteria.minAverageScore !== undefined && (
              <li>Score moyen ≥ {badge.criteria.minAverageScore}%</li>
            )}
            {badge.criteria.minArtifactsCreated !== undefined && (
              <li>≥ {badge.criteria.minArtifactsCreated} artefacts créés</li>
            )}
          </ul>
        )}
      </div>
    </article>
  )
}
