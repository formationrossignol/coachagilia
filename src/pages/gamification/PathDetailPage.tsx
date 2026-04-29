import { useParams } from 'react-router-dom'
import { useGamificationStore, LEARNING_PATHS, BADGES, computePathProgress } from '../../features/gamification'
import { LearningPathTimeline } from '../../components/gamification/LearningPathTimeline'
import { BadgeCard } from '../../components/gamification/BadgeCard'

export function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const completedSlugs = useGamificationStore(s => s.getCompletedContentSlugs())
  const events = useGamificationStore(s => s.events)

  const path = LEARNING_PATHS.find(p => p.slug === slug)

  if (!path) {
    return (
      <div className="gamification-page">
        <p>Parcours introuvable.</p>
      </div>
    )
  }

  const progress = computePathProgress(path, completedSlugs)
  const completionBadge = path.completionBadgeId
    ? BADGES.find(b => b.id === path.completionBadgeId)
    : undefined

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">{path.title}</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{path.description}</p>
      <p style={{ fontSize: '0.85rem' }}>
        {progress.requiredCompleted} / {progress.requiredTotal} étapes obligatoires
        {progress.isComplete && ' — Complété ✓'}
      </p>

      <div className="gamification-page__section">
        <span className="gamification-page__section-title">Étapes</span>
        <LearningPathTimeline path={path} completedSlugs={completedSlugs} />
      </div>

      {completionBadge && (
        <div className="gamification-page__section">
          <span className="gamification-page__section-title">Badge associé</span>
          <BadgeCard
            badge={completionBadge}
            unlockedAt={
              events.find(e => e.type === 'BADGE_UNLOCKED' && e.metadata?.badgeId === completionBadge.id)?.createdAt
            }
          />
        </div>
      )}
    </div>
  )
}
