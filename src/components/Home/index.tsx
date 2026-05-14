import { Link } from 'react-router-dom'
import { ClipboardCheck, FileCheck, Gauge, GitBranch, Handshake, MessageSquareWarning, Puzzle, Radar, Route, ShieldCheck, Sparkles, Zap } from 'lucide-react'

const MODES = [
  {
    to: '/simulation',
    Icon: Zap,
    title: 'Mode Simulation',
    description: 'Prenez des décisions dans des situations Scrum réalistes.',
    detailsLabel: 'Idéal pour',
    details: 'Conflits · Sprint Planning · Review · Daily · Rétrospective',
    cta: 'Lancer une situation',
    preview: 'Décision terrain',
    subPreview: 'Sprint Review · Confiance +12',
    progress: undefined,
    accent: '#60a5fa',
    accentRgb: '96, 165, 250',
  },
  {
    to: '/certifications',
    Icon: FileCheck,
    title: 'Mode Certification',
    description: 'Préparez vos examens avec des quiz chronométrés et des feedbacks ciblés.',
    detailsLabel: 'Certifications',
    details: 'PSM · PSPO · PMI-ACP · SAFe',
    cta: 'Choisir une certification',
    preview: 'PSM I readiness',
    progress: 72,
    subPreview: undefined,
    accent: '#fb923c',
    accentRgb: '251, 146, 60',
  },
  {
    to: '/ateliers',
    Icon: Puzzle,
    title: 'Mode Atelier',
    description: 'Manipulez les concepts pour les ancrer durablement.',
    detailsLabel: 'Formats',
    details: 'Cartes · Classement · Matrice · Diagramme · Puzzle',
    cta: 'Explorer les ateliers',
    preview: 'Dernier atelier',
    subPreview: 'Delegation Poker · 15 min · Intermédiaire',
    progress: undefined,
    accent: '#34d399',
    accentRgb: '52, 211, 153',
  },
  {
    title: 'Certifier',
    focus: 'Vérifier les acquis',
    items: ['Scrum Events', 'Accountability', 'Empiricism'],
    metric: '72 % readiness',
    Icon: ClipboardCheck,
  },
] as const

const fieldSkills = [
  { label: 'Lire une tension', detail: 'Repérer le vrai signal derrière la demande.', Icon: Radar },
  { label: 'Protéger le cadre', detail: 'Tenir Scrum sans devenir rigide.', Icon: ShieldCheck },
  { label: 'Faciliter une décision', detail: 'Faire avancer le groupe quand ça bloque.', Icon: GitBranch },
  { label: 'Coacher sans imposer', detail: 'Questionner avant de prescrire.', Icon: MessageSquareWarning },
  { label: 'Aligner les parties prenantes', detail: 'Rendre les compromis explicites.', Icon: Handshake },
  { label: 'Mesurer l’impact', detail: 'Suivre confiance, clarté et tension.', Icon: Gauge },
] as const

const recommendedPaths = [
  { title: 'Préparer PSM-1 en 7 jours', meta: '10 quiz · 3 examens · 8 thèmes', progress: 52 },
  { title: 'Gérer les conflits d’équipe', meta: '6 ateliers · 3 mises en situation', progress: 34 },
  { title: 'Facilitation d’équipe', meta: '7 ateliers · 2 simulations · challenge final', progress: 18 },
] as const

const recommendations = [
  'Gestion des conflits — score communication faible',
  'PSM I — Scrum Events pour la certification',
  'Delegation Poker — renforcer leadership',
]

export function Home() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__content">
          <p className="home__eyebrow">Plateforme d’entraînement agile</p>
          <h1 id="home-title" className="home__title">Entraînez-vous à agir comme un vrai Scrum Master</h1>
          <p className="home__subtitle">
            Simulations, ateliers pratiques et examens blancs pour développer des réflexes terrain, pas seulement mémoriser Scrum.
          </p>
          <div className="home-hero__actions">
            <Link to="/simulation" className="btn btn--primary home-hero__cta">Commencer une simulation</Link>
            <Link to="/ateliers" className="btn btn--secondary home-hero__cta">Explorer les ateliers</Link>
          </div>
        </div>

        <aside className="hero-mockup" aria-label="Aperçu d'une simulation Scrum">
          <div className="hero-mockup__topline">
            <span>Situation en cours</span>
            <Sparkles size={16} aria-hidden="true" />
          </div>
          <h2>Sprint Review sous tension</h2>
          <p className="hero-mockup__label">Décision à prendre :</p>
          <p className="hero-mockup__context">Le PO veut ajouter du scope avant la fin du sprint…</p>
          <div className="hero-mockup__choices">
            <button>Protéger le sprint</button>
            <button>Négocier un arbitrage</button>
            <button>Accepter la demande</button>
          </div>
          <div className="hero-mockup__impact">Impact équipe : <strong>+12 confiance</strong></div>
        </aside>
      </section>

      <section className="resume-panel" aria-labelledby="resume-title">
        <div>
          <span className="resume-panel__label">Reprendre là où vous vous êtes arrêté</span>
          <h2 id="resume-title">Parcours PSM-1</h2>
          <p>52 % terminé · Prochaine étape : Scrum Events</p>
        </div>
        <Link to="/paths/preparation-psm" className="resume-panel__cta">Continuer →</Link>
      </section>

      <section className="home-section" aria-labelledby="modes-title">
        <div className="home-section__header">
          <p className="home-section__eyebrow">Modes d’entraînement</p>
          <h2 id="modes-title">Choisissez votre terrain de pratique</h2>
        </div>
        <div className="home__grid">
          {MODES.map(({ to, Icon, title, description, detailsLabel, details, cta, preview, subPreview, progress, accent, accentRgb }) => (
            <article
              key={to}
              className="home-card"
              style={{ '--home-card-accent': accent, '--home-card-accent-rgb': accentRgb } as React.CSSProperties}
            >
              <div className="home-card__header">
                <div className="home-card__icon-wrap">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="status-pill status-pill--recommended">Recommandé</span>
              </div>
              <h3 className="home-card__title">{title}</h3>
              <p className="home-card__description">{description}</p>
              <div className="home-card__details">
                <span>{detailsLabel}</span>
                <p>{details}</p>
              </div>
              <div className="home-card__preview">
                <span>{preview}</span>
                {typeof progress === 'number' ? (
                  <div className="mini-readiness">
                    <div className="mini-readiness__bar"><i style={{ width: `${progress}%` }} /></div>
                    <strong>{progress} %</strong>
                  </div>
                ) : (
                  <strong>{subPreview ?? 'Sprint Review · Confiance +12'}</strong>
                )}
              </div>
              <Link to={to} className="home-card__cta">
                {cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="today-panel" aria-labelledby="today-title">
        <div className="today-panel__header">
          <Route size={18} aria-hidden="true" />
          <h2 id="today-title">Aujourd’hui, entraînez-vous sur :</h2>
        </div>
        <ol>
          {recommendations.map(item => <li key={item}>{item}</li>)}
        </ol>
        <Link to="/ateliers" className="today-panel__link">Voir les recommandations →</Link>
      </section>
    </div>
  )
}
