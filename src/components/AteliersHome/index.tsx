import { Link } from 'react-router-dom'

const ATELIERS = [
  {
    to: '/ateliers/scrum-guide',
    title: 'Le cadre Scrum',
    description: 'Replacez les rôles, événements, artefacts et engagements du Scrum Guide au bon endroit sur le diagramme.',
    level: 'Débutant',
    levelVariant: 'green' as const,
    duration: '~10 min',
  },
  {
    to: '/ateliers/conflits',
    title: 'Gestion des conflits',
    description: 'Positionnez les 5 modes du modèle Thomas-Kilmann sur le diagramme, puis associez des situations réelles à chaque mode.',
    level: 'Intermédiaire',
    levelVariant: 'orange' as const,
    duration: '~15 min',
  },
  {
    to: '/ateliers/delegation-poker',
    title: 'Delegation Poker',
    description: 'Ordonnez les 7 niveaux de délégation, puis associez des situations Scrum au niveau approprié.',
    level: 'Intermédiaire',
    levelVariant: 'orange' as const,
    duration: '~15 min',
  },
  {
    to: '/ateliers/grow-model',
    title: 'Modèle GROW',
    description: 'Ordonnez les 4 étapes du modèle de coaching GROW, puis associez des questions de coaching à chaque étape.',
    level: 'Intermédiaire',
    levelVariant: 'orange' as const,
    duration: '~15 min',
  },
  {
    to: '/ateliers/stakeholder-mapping',
    title: 'Stakeholder Mapping',
    description: 'Associez la bonne stratégie à chaque quadrant de la matrice Influence / Intérêt, puis positionnez les parties prenantes.',
    level: 'Intermédiaire',
    levelVariant: 'orange' as const,
    duration: '~15 min',
  },
  {
    to: '/ateliers/ask-vs-tell',
    title: 'Ask vs Tell',
    description: "Identifiez la bonne posture de coaching, classez des situations selon qu'elles appellent une posture directive ou de coaching, puis reformulez des phrases directives en questions ouvertes.",
    level: 'Avancé',
    levelVariant: 'red' as const,
    duration: '~20 min',
  },
]

export function AteliersHome() {
  return (
    <div className="ateliers-home">
      <header className="selector-header">
        <h1>Ateliers</h1>
        <p>Ancrez les concepts par la pratique : glisser-déposer, puzzles, cartes.</p>
      </header>
      <div className="ateliers-grid">
        {ATELIERS.map(({ to, title, description, level, levelVariant, duration }) => (
          <article key={to} className="atelier-card">
            <div className="scenario-card__meta">
              <span className={`badge badge--${levelVariant}`}>{level}</span>
              <span className="scenario-card__duration">{duration}</span>
            </div>
            <h2 className="scenario-card__title">{title}</h2>
            <p className="scenario-card__theme">{description}</p>
            <Link to={to} className="btn btn--primary">
              Démarrer
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
