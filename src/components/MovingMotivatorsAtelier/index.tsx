import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type Motivator = 'curiosity' | 'honor' | 'acceptance' | 'mastery' | 'power' | 'freedom' | 'relatedness' | 'order' | 'goal' | 'status'
type SatisfactionLevel = 'low' | 'medium' | 'high'
type Phase = 1 | 2 | 3

const MOTIVATOR_IDS: Motivator[] = [
  'curiosity', 'honor', 'acceptance', 'mastery', 'power',
  'freedom', 'relatedness', 'order', 'goal', 'status',
]

const MOTIVATORS: Record<Motivator, { name: string; description: string }> = {
  curiosity:   { name: 'Curiosity',   description: 'Apprendre et explorer' },
  honor:       { name: 'Honor',       description: 'Agir selon ses valeurs' },
  acceptance:  { name: 'Acceptance',  description: 'Être reconnu et accepté' },
  mastery:     { name: 'Mastery',     description: 'Progresser et devenir expert' },
  power:       { name: 'Power',       description: "Influencer et avoir de l'impact" },
  freedom:     { name: 'Freedom',     description: 'Être autonome' },
  relatedness: { name: 'Relatedness', description: 'Créer du lien' },
  order:       { name: 'Order',       description: 'Avoir de la structure' },
  goal:        { name: 'Goal',        description: 'Avoir un objectif clair' },
  status:      { name: 'Status',      description: 'Être reconnu socialement' },
}

const SAT_OPTIONS: { value: SatisfactionLevel; label: string }[] = [
  { value: 'low',    label: '🔴 Faible' },
  { value: 'medium', label: '🟠 Moyen' },
  { value: 'high',   label: '🟢 Élevé' },
]

type DraggingState = { motivator: Motivator; fromIndex?: number } | null

function isActionConcrete(text: string): boolean {
  return text.trim().split(/\s+/).length >= 3
}

function isFirstStepClear(text: string): boolean {
  return text.trim().length >= 8
}

export function MovingMotivatorsAtelier() {
  const [phase, setPhase] = useState<Phase>(1)
  const [ranking, setRanking] = useState<(Motivator | null)[]>(Array(10).fill(null))
  const isDirty = phase > 1 || ranking.some(m => m !== null)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Verified, setPhase1Verified] = useState(false)
  const [satisfaction, setSatisfaction] = useState<Partial<Record<Motivator, SatisfactionLevel>>>({})
  const [actionPlan, setActionPlan] = useState<Partial<Record<Motivator, { action: string; firstStep: string }>>>({})
  const [phase3Verified, setPhase3Verified] = useState(false)
  const [dragging, setDragging] = useState<DraggingState>(null)

  // Phase 1 derived
  const pool = MOTIVATOR_IDS.filter(m => !ranking.includes(m))
  const phase1AllFilled = ranking.every(m => m !== null)

  function handleDragStartFromPool(motivator: Motivator) {
    setDragging({ motivator })
    setPhase1Verified(false)
  }
  function handleDragStartFromSlot(motivator: Motivator, fromIndex: number) {
    setDragging({ motivator, fromIndex })
    setPhase1Verified(false)
  }
  function handleDropOnSlot(slotIndex: number) {
    if (!dragging) return
    const { motivator, fromIndex } = dragging
    setRanking(prev => {
      const next = [...prev]
      const existing = next[slotIndex]
      if (fromIndex !== undefined) next[fromIndex] = existing
      next[slotIndex] = motivator
      return next
    })
    setDragging(null)
  }
  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    if (dragging.fromIndex !== undefined) {
      setRanking(prev => {
        const next = [...prev]
        next[dragging.fromIndex!] = null
        return next
      })
    }
    setDragging(null)
  }

  // Phase 2 derived
  const topRanking = ranking.filter((m): m is Motivator => m !== null)
  const phase2AllRated = MOTIVATOR_IDS.every(m => satisfaction[m] !== undefined)
  const criticalMotivators = topRanking.slice(0, 5).filter(m => satisfaction[m] === 'low')

  // Phase 3 derived
  const phase3AllFilled = criticalMotivators.length === 0 || criticalMotivators.every(m => {
    const plan = actionPlan[m]
    return plan && plan.action.trim().length > 0 && plan.firstStep.trim().length > 0
  })
  const top3 = topRanking.slice(0, 3)

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'moving-motivators')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Moving Motivators</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Classez vos motivateurs du plus au moins important.'}
          {phase === 2 && 'Phase 2 / 3 — Évaluez votre niveau de satisfaction pour chaque motivateur.'}
          {phase === 3 && "Phase 3 / 3 — Définissez un plan d'action pour vos motivateurs critiques."}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="mm-phase1-layout">
            <div className="mm-ranking-zone">
              <p className="mm-section-label">Votre classement</p>
              {Array.from({ length: 10 }, (_, i) => {
                const m = ranking[i]
                return (
                  <div
                    key={i}
                    data-slot={i}
                    className={'mm-slot' + (m ? ' mm-slot--filled' : ' mm-slot--empty')}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('mm-slot--hover') }}
                    onDragLeave={e => e.currentTarget.classList.remove('mm-slot--hover')}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('mm-slot--hover'); handleDropOnSlot(i) }}
                  >
                    <span className="mm-slot__rank">{i + 1}</span>
                    {m ? (
                      <div
                        data-motivator={m}
                        className="mm-motivator-card mm-motivator-card--placed"
                        draggable
                        onDragStart={() => handleDragStartFromSlot(m, i)}
                      >
                        <strong className="mm-motivator-card__name">{MOTIVATORS[m].name}</strong>
                        <span className="mm-motivator-card__desc">{MOTIVATORS[m].description}</span>
                      </div>
                    ) : (
                      <span className="mm-slot__placeholder">Déposer ici</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mm-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
              <p className="mm-section-label">Motivateurs à classer</p>
              <div className="mm-pool__cards">
                {pool.map(m => (
                  <div
                    key={m}
                    data-motivator={m}
                    className="mm-motivator-card"
                    draggable
                    onDragStart={() => handleDragStartFromPool(m)}
                  >
                    <strong className="mm-motivator-card__name">{MOTIVATORS[m].name}</strong>
                    <span className="mm-motivator-card__desc">{MOTIVATORS[m].description}</span>
                  </div>
                ))}
                {pool.length === 0 && (
                  <span className="scrum-palette__empty">Tous les motivateurs sont classés</span>
                )}
              </div>
            </div>
          </div>

          {phase1Verified && (
            <div className="scrum-score-banner">
              <span className="badge badge--green">Classement enregistré !</span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase1Verified(true)} disabled={!phase1AllFilled}>
              Vérifier
            </button>
            {phase1Verified && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="mm-satisfaction-grid">
            {topRanking.map((m, i) => (
              <div
                key={m}
                className={'mm-satisfaction-row' + (satisfaction[m] === 'low' && i < 5 ? ' mm-satisfaction-row--critical' : '')}
              >
                <span className="mm-rank-badge">#{i + 1}</span>
                <div className="mm-motivator-info">
                  <strong>{MOTIVATORS[m].name}</strong>
                  <span className="mm-motivator-card__desc">{MOTIVATORS[m].description}</span>
                </div>
                <div className="mm-satisfaction-btns">
                  {SAT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      data-satisfaction={`${m}-${opt.value}`}
                      className={'mm-sat-btn' + (satisfaction[m] === opt.value ? ' mm-sat-btn--active' : '')}
                      onClick={() => setSatisfaction(prev => ({ ...prev, [m]: opt.value }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {satisfaction[m] === 'low' && i < 5 && (
                  <span className="badge badge--red mm-critical-badge">Critique</span>
                )}
              </div>
            ))}
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase(3)} disabled={!phase2AllRated}>
              Phase suivante →
            </button>
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          {criticalMotivators.length > 0 && !phase3Verified && (
            <div className="mm-action-plan">
              {criticalMotivators.map(m => {
                const plan = actionPlan[m] ?? { action: '', firstStep: '' }
                return (
                  <div key={m} className="mm-action-item" data-action-motivator={m}>
                    <h3 className="mm-action-item__title">
                      {MOTIVATORS[m].name}
                      <span className="mm-motivator-card__desc"> — {MOTIVATORS[m].description}</span>
                    </h3>
                    <div className="mm-action-fields">
                      <label className="mm-action-label">Action concrète</label>
                      <input
                        type="text"
                        data-field="action"
                        className="at-phrase-input"
                        placeholder="Quelle action allez-vous mettre en place ?"
                        value={plan.action}
                        onChange={e => setActionPlan(prev => ({
                          ...prev,
                          [m]: { ...(prev[m] ?? { action: '', firstStep: '' }), action: e.target.value },
                        }))}
                      />
                      <label className="mm-action-label">Premier pas</label>
                      <input
                        type="text"
                        data-field="first-step"
                        className="at-phrase-input"
                        placeholder="Quel est le premier pas dès cette semaine ?"
                        value={plan.firstStep}
                        onChange={e => setActionPlan(prev => ({
                          ...prev,
                          [m]: { ...(prev[m] ?? { action: '', firstStep: '' }), firstStep: e.target.value },
                        }))}
                      />
                      {phase3Verified && (
                        <div className="at-indicators">
                          <span className={`at-indicator ${isActionConcrete(plan.action) ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                            {isActionConcrete(plan.action) ? '✓ Action concrète' : "✗ Précisez davantage l'action"}
                          </span>
                          <span className={`at-indicator ${isFirstStepClear(plan.firstStep) ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                            {isFirstStepClear(plan.firstStep) ? '✓ Premier pas identifié' : '✗ Précisez le premier pas'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {criticalMotivators.length === 0 && (
            <div className="mm-no-critical">
              <p>Aucun motivateur critique identifié — tous vos motivateurs importants ont un niveau de satisfaction satisfaisant.</p>
            </div>
          )}

          {(phase3Verified || criticalMotivators.length === 0) && (
            <div className="mm-result">
              <h2 className="mm-result__title">Votre profil motivationnel</h2>
              {top3.length > 0 && (
                <div className="mm-result__section">
                  <p className="mm-result__label">Top 3 motivateurs</p>
                  <div className="mm-result__list">
                    {top3.map((m, i) => (
                      <span key={m} className="mm-result__item">
                        <span className="mm-rank-badge">#{i + 1}</span> {MOTIVATORS[m].name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {criticalMotivators.length > 0 && (
                <div className="mm-result__section">
                  <p className="mm-result__label">Motivateurs à risque</p>
                  <div className="mm-result__list">
                    {criticalMotivators.map(m => (
                      <span key={m} className="mm-result__item mm-result__item--risk">
                        {MOTIVATORS[m].name} — {MOTIVATORS[m].description}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mm-result__section">
                <span className="badge badge--green">Profil complété</span>
              </div>
            </div>
          )}

          <div className="scrum-actions">
            {criticalMotivators.length > 0 && !phase3Verified && (
              <button className="btn btn--primary" onClick={() => setPhase3Verified(true)} disabled={!phase3AllFilled}>
                Valider mon plan d'action
              </button>
            )}
            {phase3Verified && (
              <button className="btn btn--secondary" onClick={() => { setPhase3Verified(false); setActionPlan({}) }}>
                Réessayer phase 3
              </button>
            )}
          </div>
        </>
      )}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
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
