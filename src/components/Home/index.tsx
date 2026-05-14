import { Link } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Gauge,
  GitBranch,
  Handshake,
  MessageSquareWarning,
  Radar,
  ShieldCheck,
  Target,
  UsersRound,
} from 'lucide-react'

const boardColumns = [
  {
    title: 'Décider',
    focus: 'Arbitrages sous contrainte',
    items: ['Sprint Review sous tension', 'Dette technique vs démo', 'Scope urgent du manager'],
    metric: '3 décisions',
    Icon: GitBranch,
  },
  {
    title: 'Faciliter',
    focus: 'Créer un cadre utile',
    items: ['Daily qui dérive', 'Rétro silencieuse', 'Atelier d’alignement PO'],
    metric: '2 ateliers',
    Icon: UsersRound,
  },
  {
    title: 'Coach',
    focus: 'Posture et feedback',
    items: ['Question puissante', 'Feedback SBI', 'Conflit développeur / PO'],
    metric: '4 réflexes',
    Icon: MessageSquareWarning,
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

export function Home() {
  return (
    <main className="training-desk" aria-labelledby="home-title">
      <header className="training-desk__header">
        <div>
          <span className="training-desk__label">Training Desk</span>
          <strong>Scrum Master Sim</strong>
        </div>
        <div className="training-desk__header-status" aria-label="État du cockpit">
          <span>Session prête</span>
          <i />
        </div>
      </header>

      <section className="training-hero">
        <div className="training-hero__copy">
          <span className="training-hero__kicker">Cockpit d’entraînement professionnel</span>
          <h1 id="home-title">Devenez plus solide quand Scrum devient difficile.</h1>
          <p>
            Un simulateur d’entraînement pour pratiquer les décisions, postures et facilitation d’un Scrum Master en situation réelle.
          </p>
          <div className="training-hero__actions">
            <Link to="/simulation" className="training-btn training-btn--primary">Lancer la situation du jour</Link>
            <Link to="/paths" className="training-btn training-btn--ghost">Voir les parcours</Link>
          </div>
        </div>

        <article className="daily-situation" aria-label="Situation du jour">
          <div className="daily-situation__rail" aria-hidden="true">
            <span>Sprint 3</span>
            <i />
            <span>Review</span>
            <i />
            <span>Arbitrage</span>
          </div>
          <div className="daily-situation__header">
            <div>
              <span className="training-desk__label">Situation du jour</span>
              <h2>Sprint Review sous tension</h2>
            </div>
            <div className="daily-situation__score">
              <Gauge size={18} aria-hidden="true" />
              <span>Impact 86</span>
            </div>
          </div>
          <p className="daily-situation__context">
            Le client remet en cause la valeur livrée. Le Product Owner défend l’équipe, mais un manager demande d’ajouter trois fonctionnalités immédiatement.
          </p>
          <div className="daily-situation__objective">
            <Target size={17} aria-hidden="true" />
            <span>Protéger le cadre Scrum sans fermer le dialogue.</span>
          </div>
          <div className="daily-situation__choices" aria-label="Choix disponibles">
            <button>Clarifier le but de la Review</button>
            <button>Ouvrir un échange cadré après la Review</button>
            <button>Reporter l’arbitrage au Sprint Planning</button>
          </div>
          <div className="impact-ledger" aria-label="Impacts estimés">
            <div><span>Confiance équipe</span><strong className="impact-ledger__positive">+8</strong></div>
            <div><span>Clarté produit</span><strong className="impact-ledger__positive">+6</strong></div>
            <div><span>Tension stakeholder</span><strong className="impact-ledger__risk">-2</strong></div>
          </div>
        </article>
      </section>

      <section className="resume-training" aria-labelledby="resume-title">
        <div className="resume-training__note" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <span className="training-desk__label">Session en cours</span>
          <h2 id="resume-title">Reprendre votre entraînement</h2>
          <h3>Parcours PSM-1 · Scrum Events</h3>
          <p>Dernière session : 18 min · score 74 % · prochaine action : arbitrer une Review difficile.</p>
        </div>
        <Link to="/paths/preparation-psm" className="training-link">Continuer l’exercice</Link>
      </section>

      <section className="training-section training-section--board" aria-labelledby="week-title">
        <div className="training-section__header">
          <span className="training-desk__label">Votre entraînement cette semaine</span>
          <h2 id="week-title">Un board de pratique, pas un catalogue.</h2>
        </div>
        <div className="training-board">
          {boardColumns.map(({ title, focus, items, metric, Icon }) => (
            <article key={title} className="training-board__column">
              <div className="training-board__topline">
                <Icon size={18} aria-hidden="true" />
                <span>{metric}</span>
              </div>
              <h3>{title}</h3>
              <p>{focus}</p>
              <ul>
                {items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="training-section skills-field" aria-labelledby="skills-title">
        <div className="training-section__header skills-field__intro">
          <span className="training-desk__label">Ce que vous entraînez vraiment</span>
          <h2 id="skills-title">Des réflexes terrain observables.</h2>
          <p>Chaque exercice fait bouger une compétence métier, pas seulement un score de quiz.</p>
        </div>
        <div className="skills-field__grid">
          {fieldSkills.map(({ label, detail, Icon }) => (
            <article key={label} className="skill-strip">
              <Icon size={19} aria-hidden="true" />
              <div>
                <h3>{label}</h3>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="training-section paths-desk" aria-labelledby="paths-title">
        <div className="training-section__header">
          <span className="training-desk__label">Parcours recommandés</span>
          <h2 id="paths-title">Des plans courts pour progresser sans dispersion.</h2>
        </div>
        <div className="paths-desk__list">
          {recommendedPaths.map(path => (
            <article key={path.title} className="path-row">
              <div>
                <h3>{path.title}</h3>
                <p>{path.meta}</p>
              </div>
              <div className="path-row__progress" aria-label={`${path.progress} % terminé`}>
                <span>{path.progress} %</span>
                <i><b style={{ width: `${path.progress}%` }} /></i>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="progress-brief" aria-label="Résumé progression">
        <div><Clock3 size={18} aria-hidden="true" /><span>4 h 20</span><p>pratique ce mois</p></div>
        <div><CheckCircle2 size={18} aria-hidden="true" /><span>12</span><p>situations jouées</p></div>
        <div><BarChart3 size={18} aria-hidden="true" /><span>78 %</span><p>score moyen</p></div>
        <div><Activity size={18} aria-hidden="true" /><span>+14</span><p>clarté gagnée</p></div>
      </section>
    </main>
  )
}
