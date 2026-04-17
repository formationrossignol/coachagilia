import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    to: '/simulation',
    title: 'Simulation',
    description: 'Incarnez un Scrum Master. Prenez des décisions. Observez les conséquences sur votre équipe.',
    badge: 'Décisionnel',
    badgeClass: 'badge--blue',
    cta: 'Choisir un scénario',
  },
  {
    to: '/quiz',
    title: 'Quiz PSM-1',
    description: 'Préparez la certification Professional Scrum Master avec des examens blancs chronométrés.',
    badge: 'Certification',
    badgeClass: 'badge--orange',
    cta: 'Commencer un examen',
  },
  {
    to: '/ateliers',
    title: 'Ateliers',
    description: 'Ancrez les concepts du Scrum Guide par la pratique : drag & drop, cartes, puzzles.',
    badge: 'Pratique',
    badgeClass: 'badge--green',
    cta: 'Accéder aux activités',
  },
] as const

export function Home() {
  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Scrum Master Sim</h1>
        <p className="home__subtitle">Apprenez Scrum par la pratique, pas seulement par la théorie.</p>
      </header>
      <div className="home__grid">
        {SECTIONS.map(({ to, title, description, badge, badgeClass, cta }) => (
          <article key={to} className="home-card">
            <span className={`badge ${badgeClass}`}>{badge}</span>
            <h2 className="home-card__title">{title}</h2>
            <p className="home-card__description">{description}</p>
            <Link to={to} className="btn btn--primary">
              {cta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
