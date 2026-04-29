import type { BadgeDefinition, GamificationEvent } from '../../features/gamification'
import { BadgeCard } from './BadgeCard'

interface Props {
  badges: BadgeDefinition[]
  unlockedIds: string[]
  events: GamificationEvent[]  // used to look up unlock dates
}

function getUnlockDate(badgeId: string, events: GamificationEvent[]): string | undefined {
  return events.find(
    e => e.type === 'BADGE_UNLOCKED' && e.metadata?.badgeId === badgeId
  )?.createdAt
}

export function BadgeGrid({ badges, unlockedIds, events }: Props) {
  const unlockedSet = new Set(unlockedIds)
  const sorted = [...badges].sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id) ? 0 : 1
    const bUnlocked = unlockedSet.has(b.id) ? 0 : 1
    return aUnlocked - bUnlocked
  })

  return (
    <div className="badge-grid">
      {sorted.map(badge => {
        // If badge is unlocked, get its unlock date from events; if not found, use current date as placeholder
        let unlockedAt: string | undefined = undefined
        if (unlockedSet.has(badge.id)) {
          unlockedAt = getUnlockDate(badge.id, events) ?? new Date().toISOString()
        }
        return (
          <BadgeCard
            key={badge.id}
            badge={badge}
            unlockedAt={unlockedAt}
          />
        )
      })}
    </div>
  )
}
