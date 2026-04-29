import { useGamificationStore } from '../../features/gamification'
import { ChallengeCard } from '../../components/gamification/ChallengeCard'

export function ChallengesPage() {
  const getActiveChallenge = useGamificationStore(s => s.getActiveChallenge)
  const isChallengeCompleted = useGamificationStore(s => s.isChallengeCompleted)
  const challenge = getActiveChallenge()

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Défi hebdomadaire</h1>
      {challenge ? (
        <ChallengeCard
          challenge={challenge}
          completed={isChallengeCompleted(challenge.id)}
        />
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>Aucun défi actif.</p>
      )}
    </div>
  )
}
