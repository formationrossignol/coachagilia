import { useSimulationStore } from '../../store/simulationStore'
import { ProgressBar } from '../ui/ProgressBar'
import type { StateVariables } from '../../engine/types'

const VAR_CONFIG: Array<{ key: keyof StateVariables; label: string; inverted?: boolean }> = [
  { key: 'teamTrust', label: 'Confiance équipe' },
  { key: 'goalClarity', label: 'Clarté objectifs' },
  { key: 'sprintFocus', label: 'Focus sprint' },
  { key: 'productQuality', label: 'Qualité produit' },
  { key: 'techDebt', label: 'Dette technique', inverted: true },
  { key: 'poEngagement', label: 'Engagement PO' },
  { key: 'psychologicalSafety', label: 'Sécurité psycho.' },
  { key: 'scrumMaturity', label: 'Maturité agile' },
]

export function StateIndicators() {
  const stateVars = useSimulationStore(s => s.stateVars)
  const scenario = useSimulationStore(s => s.scenario)
  const currentScene = useSimulationStore(s => s.currentScene)

  if (!stateVars || !scenario) return null

  return (
    <aside className="state-indicators" aria-label="Indicateurs d'état">
      <h3 className="state-indicators__title">État de l'équipe</h3>
      {VAR_CONFIG.map(({ key, label, inverted }) => (
        <div key={key} role="progressbar" aria-label={label} aria-valuenow={stateVars[key]}>
          <ProgressBar
            label={label}
            value={stateVars[key]}
            inverted={inverted}
          />
        </div>
      ))}
      {scenario && (
        <div className="sprint-progress">
          <h4>Progression</h4>
          <p className="sprint-scene">{currentScene?.title ?? '—'}</p>
        </div>
      )}
    </aside>
  )
}
