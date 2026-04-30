import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { WorkshopDefinition } from '../../data/workshops/types'
import { LEVEL_LABELS, LEVEL_BADGE_VARIANT, INTERACTION_TYPE_LABELS } from '../../data/workshops/types'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'

interface Props {
  workshop: WorkshopDefinition
  isCompleted?: boolean
}

export function WorkshopCard({ workshop, isCompleted }: Props) {
  const category = WORKSHOP_CATEGORIES.find(c => c.slug === workshop.categorySlug)

  if (workshop.comingSoon) {
    return (
      <article className="workshop-card workshop-card--coming-soon" data-category={workshop.categorySlug}>
        <div className="workshop-card__header">
          <span className="workshop-card__cat">{category?.name ?? workshop.categorySlug}</span>
          <span className="workshop-card__badge-soon">Bientôt</span>
        </div>
        <div className="workshop-card__body">
          <h2 className="workshop-card__title">{workshop.title}</h2>
          <p className="workshop-card__summary">{workshop.summary}</p>
        </div>
      </article>
    )
  }

  return (
    <article className="workshop-card" data-category={workshop.categorySlug}>
      <div className="workshop-card__header">
        <span className="workshop-card__cat">{category?.name ?? workshop.categorySlug}</span>
        <span className="workshop-card__duration">
          <Clock size={11} strokeWidth={2.2} />
          {workshop.durationMinutes} min
        </span>
        {isCompleted && <span className="workshop-card__completed">✓ Complété</span>}
      </div>
      <div className="workshop-card__body">
        <h2 className="workshop-card__title">{workshop.title}</h2>
        <p className="workshop-card__summary">{workshop.summary}</p>
      </div>
      <div className="workshop-card__footer">
        <span className={`badge badge--${LEVEL_BADGE_VARIANT[workshop.level]} workshop-card__level`}>
          {LEVEL_LABELS[workshop.level]}
        </span>
        <span className="workshop-card__type">{INTERACTION_TYPE_LABELS[workshop.interactionType]}</span>
        <Link to={workshop.route} className="workshop-card__cta">{isCompleted ? 'Revoir →' : 'Lancer →'}</Link>
      </div>
    </article>
  )
}
