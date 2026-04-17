import { useNavigate } from 'react-router-dom'
import { useSimulationStore } from '../../store/simulationStore'
import { ProgressBar } from '../ui/ProgressBar'

const COMPETENCY_LABELS: Record<string, string> = {
  facilitation: 'Facilitation',
  protection: 'Protection',
  conflict: 'Gestion des conflits',
  flow: 'Amélioration du flux',
  po_coaching: 'Coaching PO',
  org_improvement: 'Amélioration organisationnelle',
  scrum_knowledge: 'Maîtrise Scrum',
}

const LEVEL_LABELS = {
  debutant: 'Débutant',
  en_progression: 'En progression',
  maitrise: 'Maîtrisé',
}

const GLOBAL_APPRECIATIONS = [
  { min: 0,  max: 39,  text: 'Des bases à consolider. Reviens sur les principes fondamentaux.' },
  { min: 40, max: 59,  text: "Tu progresses. Certaines postures sont bonnes, d'autres méritent plus de travail." },
  { min: 60, max: 79,  text: 'Bonne maîtrise globale. Quelques décisions risquées à analyser.' },
  { min: 80, max: 100, text: 'Excellente performance. Tu incarnes la posture Scrum Master.' },
]

export function Debrief() {
  const navigate = useNavigate()
  const debriefResult = useSimulationStore(s => s.debriefResult)
  const scenario = useSimulationStore(s => s.scenario)
  const resetSimulation = useSimulationStore(s => s.resetSimulation)

  if (!debriefResult || !scenario) {
    return (
      <div className="debrief-empty">
        <p>Aucune simulation terminée.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>
          Choisir un scénario
        </button>
      </div>
    )
  }

  const { globalScore, competencyResults, bestDecisions, riskyDecisions, scrumPrinciples } = debriefResult
  const appreciation = GLOBAL_APPRECIATIONS.find(a => globalScore >= a.min && globalScore <= a.max)

  return (
    <div className="debrief">
      <section className="debrief-global">
        <h2>Score global</h2>
        <div className="global-score">
          {globalScore}<span>/100</span>
        </div>
        <p className="global-appreciation">{appreciation?.text}</p>
      </section>

      <section className="debrief-competencies">
        <h3>Compétences évaluées</h3>
        {scenario.targetCompetencies.map(id => {
          const result = competencyResults[id]
          if (!result) return null
          return (
            <div key={id} className="competency-result">
              <ProgressBar
                label={`${COMPETENCY_LABELS[id] ?? id} — ${LEVEL_LABELS[result.level]}`}
                value={result.score}
              />
            </div>
          )
        })}
      </section>

      {bestDecisions.length > 0 && (
        <section className="debrief-best">
          <h3>Points forts</h3>
          {bestDecisions.map(d => (
            <div key={d.choiceId} className="decision-card decision-card--best">
              <p className="decision-scene">{d.sceneTitle}</p>
              <p className="decision-choice">"{d.choiceText}"</p>
              <p className="decision-feedback">{d.feedback}</p>
            </div>
          ))}
        </section>
      )}

      {riskyDecisions.length > 0 && riskyDecisions[0].choiceId !== bestDecisions[0]?.choiceId && (
        <section className="debrief-risky">
          <h3>Points de vigilance</h3>
          {riskyDecisions.map(d => (
            <div key={d.choiceId} className="decision-card decision-card--risky">
              <p className="decision-scene">{d.sceneTitle}</p>
              <p className="decision-choice">"{d.choiceText}"</p>
              <p className="decision-feedback">{d.feedback}</p>
            </div>
          ))}
        </section>
      )}

      {scrumPrinciples.length > 0 && (
        <section className="debrief-principles">
          <h3>Ce que dit le Guide Scrum</h3>
          {scrumPrinciples.map((principle, i) => (
            <blockquote key={i} className="scrum-principle-card">
              {principle}
            </blockquote>
          ))}
        </section>
      )}

      <div className="debrief-actions">
        <button
          className="btn btn--primary"
          onClick={() => {
            resetSimulation()
            navigate(`/simulation/${scenario.id}`)
          }}
        >
          Rejouer ce scénario
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => {
            resetSimulation()
            navigate('/')
          }}
        >
          Choisir un autre scénario
        </button>
      </div>
    </div>
  )
}
