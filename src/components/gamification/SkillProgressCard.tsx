import type { SkillArea, MasteryLevel } from '../../features/gamification'
import { MASTERY_THRESHOLDS } from '../../features/gamification'
import { MasteryLevelBadge } from './MasteryLevelBadge'
import { SKILL_LABELS } from './constants'

const LEVEL_ORDER: MasteryLevel[] = [
  'discovery', 'practice', 'proficiency', 'field_application', 'transmission',
]

function progressPct(xp: number, level: MasteryLevel): number {
  const idx = LEVEL_ORDER.indexOf(level)
  if (idx === LEVEL_ORDER.length - 1) return 100
  const current = MASTERY_THRESHOLDS[level]
  const next = MASTERY_THRESHOLDS[LEVEL_ORDER[idx + 1]]
  return Math.min(100, Math.round(((xp - current) / (next - current)) * 100))
}

interface Props {
  skill: SkillArea
  xp: number
  level: MasteryLevel
  recommendations: string[]
}

export function SkillProgressCard({ skill, xp, level, recommendations }: Props) {
  const pct = progressPct(xp, level)

  return (
    <article className="skill-progress-card">
      <div className="skill-progress-card__header">
        <span className="skill-progress-card__name">{SKILL_LABELS[skill]}</span>
        <MasteryLevelBadge level={level} />
      </div>
      <div className="skill-progress-card__xp">{xp} XP</div>
      <div className="progress-bar__track" style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          className="progress-bar__fill"
          style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 3, transition: 'width 0.4s ease' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {recommendations.length > 0 && (
        <div className="skill-progress-card__recs">
          <span className="skill-progress-card__recs-label">À explorer :</span>
          <ul>
            {recommendations.map(slug => <li key={slug}>{slug}</li>)}
          </ul>
        </div>
      )}
    </article>
  )
}
