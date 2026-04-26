import { Link, useParams } from 'react-router-dom'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'
import { WorkshopCard } from '../WorkshopCard'

export function WorkshopCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = WORKSHOP_CATEGORIES.find(c => c.slug === slug)

  if (!category) {
    return <div className="loading">Catégorie introuvable.</div>
  }

  const workshops = WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === slug)
  const available = workshops.filter(w => !w.comingSoon)
  const suggestion = available[0]

  return (
    <div className="category-page">
      <Link to="/ateliers" className="btn btn--secondary category-page__back">← Ateliers</Link>

      <header className="category-page__header">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <p className="category-page__meta">
          {available.length} atelier{available.length > 1 ? 's' : ''} disponible{available.length > 1 ? 's' : ''} · {workshops.length} au total
        </p>
      </header>

      {suggestion && (
        <div className="category-page__suggestion">
          <p>Par où commencer : <strong>{suggestion.title}</strong></p>
          <Link to={suggestion.route} className="btn btn--primary">Démarrer</Link>
        </div>
      )}

      <div className="ateliers-grid">
        {workshops.map(w => <WorkshopCard key={w.id} workshop={w} />)}
      </div>
    </div>
  )
}
