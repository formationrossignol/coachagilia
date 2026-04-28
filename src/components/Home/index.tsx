import { Link } from 'react-router-dom'
import { Zap, FileCheck, BookOpen } from 'lucide-react'

const SECTIONS = [
  {
    to: '/simulation',
    Icon: Zap,
    title: 'Simulation',
    description: 'Incarnez un Scrum Master. Prenez des décisions en temps réel et observez les conséquences sur votre équipe.',
    badge: 'Décisionnel',
    badgeClass: 'badge--blue',
    cta: 'Choisir un scénario',
    accent: '#60a5fa',
    accentRgb: '96, 165, 250',
  },
  {
    to: '/quiz',
    Icon: FileCheck,
    title: 'Quiz PSM-1',
    description: 'Préparez la certification Professional Scrum Master avec des examens blancs chronométrés.',
    badge: 'Certification',
    badgeClass: 'badge--orange',
    cta: 'Commencer un examen',
    accent: '#fb923c',
    accentRgb: '251, 146, 60',
  },
  {
    to: '/ateliers',
    Icon: BookOpen,
    title: 'Ateliers',
    description: 'Ancrez les concepts Scrum par la pratique : drag & drop, cartes interactives, puzzles, outils de coaching.',
    badge: 'Pratique',
    badgeClass: 'badge--green',
    cta: 'Accéder aux ateliers',
    accent: '#34d399',
    accentRgb: '52, 211, 153',
  },
] as const

export function Home() {
  return (
    <div className="home">
      <header className="home__header">
        <p className="home__eyebrow">Plateforme d'apprentissage Scrum</p>
        <h1 className="home__title">Apprenez Scrum<br />par la pratique</h1>
        <p className="home__subtitle">
          Préparez la certification PSM-1 et renforcez vos pratiques agiles grâce à des outils pédagogiques interactifs.
        </p>
      </header>

      <div className="home__grid">
        {SECTIONS.map(({ to, Icon, title, description, badge, badgeClass, cta, accent, accentRgb }) => (
          <article
            key={to}
            className="home-card"
            style={{ '--home-card-accent': accent, '--home-card-accent-rgb': accentRgb } as React.CSSProperties}
          >
            <div className="home-card__icon-wrap">
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div className="home-card__meta">
              <span className={`badge ${badgeClass}`}>{badge}</span>
            </div>
            <h2 className="home-card__title">{title}</h2>
            <p className="home-card__description">{description}</p>
            <Link to={to} className="home-card__cta">
              {cta} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
