import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSimulationStore } from '../../store/simulationStore'
import { StateIndicators } from '../StateIndicators'
import type { Choice } from '../../engine/types'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

const SCENE_TYPE_LABELS: Record<string, string> = {
  briefing: 'Situation',
  event: 'Événement',
  ceremony: 'Cérémonie',
  conflict: 'Conflit',
}

const impactPreview = [
  ['Confiance équipe', '+8'],
  ['Clarté produit', '+5'],
  ['Satisfaction client', '-2'],
  ['Respect Scrum', '+10'],
]

export function SimulationScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const status = useSimulationStore(s => s.status)
  const scenario = useSimulationStore(s => s.scenario)
  const currentScene = useSimulationStore(s => s.currentScene)
  const pendingFeedback = useSimulationStore(s => s.pendingFeedback)
  const startSimulation = useSimulationStore(s => s.startSimulation)
  const makeChoice = useSimulationStore(s => s.makeChoice)
  const dismissFeedback = useSimulationStore(s => s.dismissFeedback)

  const { showModal, confirm, cancel } = useExitGuard(status === 'playing')

  useEffect(() => {
    if (id && (!scenario || scenario.id !== id)) {
      startSimulation(id)
    }
  }, [id, scenario, startSimulation])

  useEffect(() => {
    if (status === 'finished') {
      navigate('/debrief')
    }
  }, [status, navigate])

  if (!currentScene || !scenario) {
    return <div className="loading">Chargement du scénario…</div>
  }

  return (
    <>
      <div className="simulation-layout simulation-layout--immersive">
        <main className="simulation-main simulation-main--immersive">
          <div className="scene-header scene-header--immersive">
            <span className="scene-type-badge">
              {SCENE_TYPE_LABELS[currentScene.type] ?? currentScene.type}
            </span>
            <h1 className="scene-title">{currentScene.title}</h1>
            <p className="scene-objective">Votre objectif : préserver le cadre Scrum sans rompre la relation avec les parties prenantes.</p>
          </div>

          <section className="simulation-brief" aria-label="Contexte de la situation">
            <div>
              <span>Contexte</span>
              <ul>
                <li>Sprint 3 / 5</li>
                <li>Équipe fatiguée</li>
                <li>Stakeholder important présent</li>
                <li>Dette technique en hausse</li>
              </ul>
            </div>
            <div>
              <span>Personnes impliquées</span>
              <div className="scene-characters">
                {currentScene.characters.map(cid => {
                  const char = scenario.characters[cid]
                  return char ? (
                    <span key={cid} className="character-chip" title={char.description}>
                      {char.name} · {char.role}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          </section>

          <p className="scene-narrative">{currentScene.narrative}</p>

          {pendingFeedback ? (
            <div className="feedback-panel feedback-panel--consequences" role="region" aria-label="Conséquences et feedback">
              <h2>Conséquences</h2>
              <div className="impact-grid">
                {impactPreview.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
              </div>
              <h2>Feedback</h2>
              <p className="feedback-text">{pendingFeedback.text}</p>
              {pendingFeedback.scrumPrinciple && (
                <blockquote className="scrum-principle">
                  <strong>Principe Scrum :</strong> {pendingFeedback.scrumPrinciple}
                </blockquote>
              )}
              <button className="btn btn--primary" onClick={dismissFeedback}>
                Continuer →
              </button>
            </div>
          ) : (
            <section className="choices choices--immersive" aria-labelledby="decision-title">
              <h2 id="decision-title">Décision · Que faites-vous ?</h2>
              {currentScene.choices.map((choice: Choice) => (
                <button
                  key={choice.id}
                  className="choice-btn"
                  onClick={() => makeChoice(choice)}
                >
                  {choice.text}
                </button>
              ))}
            </section>
          )}
        </main>

        <StateIndicators />
      </div>

      {showModal && (
        <ConfirmLeaveModal
          title="Quitter le scénario ?"
          body="Votre progression sera perdue."
          cancelLabel="Continuer"
          confirmLabel="Quitter quand même"
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </>
  )
}
