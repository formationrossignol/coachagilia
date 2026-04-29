import type { WeeklyChallenge } from '../../features/gamification'

function daysUntilNextMonday(): number {
  const day = new Date().getDay()  // 0=Sun, 1=Mon, ..., 6=Sat
  const d = (1 + 7 - day) % 7
  return d === 0 ? 7 : d
}

interface Props {
  challenge: WeeklyChallenge
  completed: boolean
}

export function ChallengeCard({ challenge, completed }: Props) {
  const days = daysUntilNextMonday()

  return (
    <article className={`challenge-card${completed ? ' challenge-card--completed' : ''}`}>
      <div className="challenge-card__header">
        <h3 className="challenge-card__title">{challenge.title}</h3>
        <span className="challenge-card__reward">+{challenge.xpReward} XP</span>
      </div>
      <p className="challenge-card__description">{challenge.description}</p>
      <div className="challenge-card__footer">
        <span className="challenge-card__countdown">
          {completed
            ? null
            : `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`}
        </span>
        {completed && (
          <span className="challenge-card__completed-badge">Complété ✓</span>
        )}
      </div>
    </article>
  )
}
