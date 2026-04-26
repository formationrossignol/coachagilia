import { Link } from 'react-router-dom'
import type { WorkshopDefinition } from '../../data/workshops/types'
import { LEVEL_LABELS, LEVEL_BADGE_VARIANT, INTERACTION_TYPE_LABELS } from '../../data/workshops/types'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'

interface Props {
  workshop: WorkshopDefinition
}

export function WorkshopCard({ workshop }: Props) {
  const category = WORKSHOP_CATEGORIES.find(c => c.slug === workshop.categorySlug)

  if (workshop.comingSoon) {
    return (
      <article className="workshop-card workshop-card--coming-soon">
        <div className="scenario-card__meta">
          <span className="badge badge--blue">{category?.name ?? workshop.categorySlug}</span>
          <span className="badge">Bientôt</span>
        </div>
        <h2 className="scenario-card__title">{workshop.title}</h2>
        <p className="scenario-card__theme">{workshop.summary}</p>
      </article>
    )
  }

  return (
    <article className="workshop-card">
      <div className="scenario-card__meta">
        <span className={`badge badge--${LEVEL_BADGE_VARIANT[workshop.level]}`}>
          {LEVEL_LABELS[workshop.level]}
        </span>
        <span className="scenario-card__duration">{workshop.durationMinutes} min</span>
      </div>
      <h2 className="scenario-card__title">{workshop.title}</h2>
      <p className="scenario-card__theme">{workshop.summary}</p>
      <div className="workshop-card__footer">
        <span className="competency-tag">{INTERACTION_TYPE_LABELS[workshop.interactionType]}</span>
        <Link to={workshop.route} className="btn btn--primary">Lancer l'atelier</Link>
      </div>
    </article>
  )
}
