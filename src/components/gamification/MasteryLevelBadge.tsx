import type { MasteryLevel } from '../../features/gamification'
import { MASTERY_LABELS } from '../../features/gamification'

interface Props { level: MasteryLevel }

export function MasteryLevelBadge({ level }: Props) {
  return (
    <span className={`mastery-badge mastery-badge--${level}`}>
      {MASTERY_LABELS[level]}
    </span>
  )
}
