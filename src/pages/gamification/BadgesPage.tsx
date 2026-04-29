import { useGamificationStore, BADGES } from '../../features/gamification'
import { BadgeGrid } from '../../components/gamification/BadgeGrid'

export function BadgesPage() {
  const unlockedIds = useGamificationStore(s => s.getUnlockedBadgeIds())
  const events = useGamificationStore(s => s.events)

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Badges</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        {unlockedIds.length} / {BADGES.length} badge{BADGES.length > 1 ? 's' : ''} débloqué{unlockedIds.length > 1 ? 's' : ''}
      </p>
      <BadgeGrid badges={BADGES} unlockedIds={unlockedIds} events={events} />
    </div>
  )
}
