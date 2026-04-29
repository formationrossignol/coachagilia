import { CheckCircle, Circle } from 'lucide-react'
import type { LearningPath } from '../../features/gamification'

interface Props {
  path: LearningPath
  completedSlugs: string[]
}

export function LearningPathTimeline({ path, completedSlugs }: Props) {
  const completed = new Set(completedSlugs)
  const sorted = [...path.steps].sort((a, b) => a.order - b.order)

  return (
    <ol className="learning-path-timeline">
      {sorted.map(step => {
        const isDone = completed.has(step.contentSlug)

        return (
          <li
            key={step.contentSlug}
            className={`learning-path-timeline__step${isDone ? ' learning-path-timeline__step--completed' : ''}`}
          >
            <span className="learning-path-timeline__icon">
              {isDone
                ? <CheckCircle size={18} strokeWidth={2} aria-hidden />
                : <Circle size={18} strokeWidth={2} aria-hidden />}
            </span>
            <div>
              <span className="learning-path-timeline__slug">{step.contentSlug}</span>
              {!step.required && (
                <span className="learning-path-timeline__optional">(optionnel)</span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
