import { Link } from 'react-router-dom'
import { CheckCircle, Clock } from 'lucide-react'
import type { LearningPath, PathProgress } from '../../features/gamification'

interface Props {
  path: LearningPath
  progress: PathProgress
}

export function LearningPathCard({ path, progress }: Props) {
  const pct = Math.round((progress.requiredCompleted / Math.max(progress.requiredTotal, 1)) * 100)

  return (
    <article className={`learning-path-card${progress.isComplete ? ' learning-path-card--complete' : ''}`}>
      <div className="learning-path-card__header">
        <div>
          <h3 className="learning-path-card__title">{path.title}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={11} strokeWidth={2} aria-hidden />
              {path.estimatedMinutes} min
            </span>
          </div>
        </div>
        {progress.isComplete && <CheckCircle size={20} color="var(--color-ok)" aria-hidden />}
      </div>

      <p className="learning-path-card__description">{path.description}</p>

      <div>
        <div className="learning-path-card__progress-text">
          {progress.requiredCompleted} / {progress.requiredTotal} étapes obligatoires
        </div>
        <div className="progress-bar__track" style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 3, overflow: 'hidden', marginTop: '0.35rem' }}>
          <div
            className="progress-bar__fill"
            style={{ width: `${pct}%`, height: '100%', background: progress.isComplete ? 'var(--color-ok)' : 'var(--color-primary)', borderRadius: 3, transition: 'width 0.4s ease' }}
          />
        </div>
      </div>

      <Link to={`/paths/${path.slug}`} className="learning-path-card__cta">
        {progress.isComplete ? 'Revoir' : 'Continuer'} →
      </Link>
    </article>
  )
}
