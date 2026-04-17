import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSimulationStore } from '../../store/simulationStore'
import { StateIndicators } from '../StateIndicators'
import type { Choice } from '../../engine/types'

const SCENE_TYPE_LABELS: Record<string, string> = {
  briefing: 'Briefing',
  event: 'Événement',
  ceremony: 'Cérémonie',
  conflict: 'Conflit',
}

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

  useEffect(() => {
    if (id && (!scenario || scenario.id !== id)) {
      startSimulation(id)
    }
  }, [id])

  useEffect(() => {
    if (status === 'finished') {
      navigate('/debrief')
    }
  }, [status, navigate])

  if (!currentScene || !scenario) {
    return <div className="loading">Chargement du scénario…</div>
  }

  return (
    <div className="simulation-layout">
      <main className="simulation-main">
        <div className="scene-header">
          <span className="scene-type-badge">
            {SCENE_TYPE_LABELS[currentScene.type] ?? currentScene.type}
          </span>
          <h2 className="scene-title">{currentScene.title}</h2>
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

        <p className="scene-narrative">{currentScene.narrative}</p>

        {pendingFeedback ? (
          <div className="feedback-panel" role="region" aria-label="Feedback">
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
          <div className="choices">
            {currentScene.choices.map((choice: Choice) => (
              <button
                key={choice.id}
                className="choice-btn"
                onClick={() => makeChoice(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </main>

      <StateIndicators />
    </div>
  )
}
