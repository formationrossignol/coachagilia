import { useNavigate } from 'react-router-dom'
import { scenarios } from '../../data/scenarios'
import { Badge } from '../ui/Badge'
import type { Scenario } from '../../engine/types'

const LEVEL_LABELS = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
} as const

const LEVEL_VARIANTS = {
  debutant: 'green',
  intermediaire: 'orange',
  avance: 'red',
} as const

const COMPETENCY_LABELS: Record<string, string> = {
  facilitation: 'Facilitation',
  protection: 'Protection',
  conflict: 'Conflit',
  flow: 'Flux',
  po_coaching: 'Coaching PO',
  org_improvement: 'Organisation',
  scrum_knowledge: 'Scrum',
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate()
  return (
    <article className="scenario-card">
      <div className="scenario-card__meta">
        <Badge variant={LEVEL_VARIANTS[scenario.level]}>{LEVEL_LABELS[scenario.level]}</Badge>
        <span className="scenario-card__duration">{scenario.estimatedDuration}</span>
      </div>
      <h2 className="scenario-card__title">{scenario.title}</h2>
      <p className="scenario-card__theme">{scenario.theme}</p>
      <div className="scenario-card__competencies">
        {scenario.targetCompetencies.map(c => (
          <span key={c} className="competency-tag">{COMPETENCY_LABELS[c] ?? c}</span>
        ))}
      </div>
      <button
        className="btn btn--primary"
        onClick={() => navigate(`/simulation/${scenario.id}`)}
      >
        Jouer
      </button>
    </article>
  )
}

export function ScenarioSelector() {
  return (
    <div className="scenario-selector">
      <header className="selector-header">
        <h1>Scrum Master Simulator</h1>
        <p>Incarnez un Scrum Master. Prenez des décisions. Observez les conséquences.</p>
      </header>
      <div className="scenario-grid">
        {scenarios.map(s => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </div>
    </div>
  )
}
