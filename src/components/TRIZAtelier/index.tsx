import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'

type Phase = 1 | 2 | 3 | 4
type TrizCategory = 'communication' | 'organization' | 'quality' | 'collaboration' | 'leadership'
type Frequency = 'low' | 'medium' | 'high'

const CATEGORIES: TrizCategory[] = ['communication', 'organization', 'quality', 'collaboration', 'leadership']

const CATEGORY_META: Record<TrizCategory, { label: string }> = {
  communication: { label: 'Communication' },
  organization:  { label: 'Organisation' },
  quality:       { label: 'Qualité' },
  collaboration: { label: 'Collaboration' },
  leadership:    { label: 'Leadership / posture' },
}

type Behavior = { id: string; text: string; category: TrizCategory }

const BEHAVIORS: Behavior[] = [
  { id: 'b1',  text: 'Ne jamais écouter les autres',                        category: 'communication' },
  { id: 'b2',  text: 'Couper la parole en permanence',                      category: 'communication' },
  { id: 'b3',  text: 'Ignorer les feedbacks',                               category: 'communication' },
  { id: 'b4',  text: 'Ne jamais préparer les réunions',                     category: 'organization' },
  { id: 'b5',  text: 'Changer les priorités constamment',                   category: 'organization' },
  { id: 'b6',  text: 'Ne pas clarifier les rôles',                          category: 'organization' },
  { id: 'b7',  text: 'Ignorer la Definition of Done',                       category: 'quality' },
  { id: 'b8',  text: 'Livrer du code non testé',                            category: 'quality' },
  { id: 'b9',  text: 'Accumuler volontairement de la dette technique',      category: 'quality' },
  { id: 'b10', text: 'Travailler en silo',                                  category: 'collaboration' },
  { id: 'b11', text: 'Refuser toute aide',                                  category: 'collaboration' },
  { id: 'b12', text: 'Critiquer sans proposer de solution',                 category: 'collaboration' },
  { id: 'b13', text: 'Imposer toutes les décisions',                        category: 'leadership' },
  { id: 'b14', text: 'Éviter les conflits importants',                      category: 'leadership' },
  { id: 'b15', text: 'Ne jamais remettre en question les pratiques',        category: 'leadership' },
]

type AntiGoalEval = { isInverted: boolean; isCoherent: boolean }
type ActionEval = { stopConcrete: boolean; stopControllable: boolean; altConcrete: boolean; altControllable: boolean }

function analyzeAntiGoal(text: string): AntiGoalEval {
  const t = text.trim().toLowerCase()
  const invertedWords = ['catastrophique', 'mauvais', 'mauvaise', 'pire', 'détruire', 'terrible', 'désastreux', 'désastreuse', 'nul', 'nulle', 'nuire', 'bloquer', 'empêcher', 'horrible']
  const coherentWords = ['collaboration', 'équipe', 'travail', 'scrum', 'communication', 'team', 'sprint']
  return {
    isInverted: invertedWords.some(w => t.includes(w)),
    isCoherent: coherentWords.some(w => t.includes(w)),
  }
}

function analyzeAction(stopAction: string, alternative: string): ActionEval {
  const s = stopAction.trim().toLowerCase()
  const a = alternative.trim().toLowerCase()
  const concreteWords = ['je vais', 'arrêter', 'stopper', 'cesser', 'éviter de', 'vais ', 'je ']
  const uncontrollable = ["ils doivent", "l'équipe doit", "vous devez", "il faut qu", "ils vont"]
  return {
    stopConcrete:     s.length > 5 && concreteWords.some(w => s.includes(w)),
    stopControllable: s.length > 5 && !uncontrollable.some(p => s.includes(p)),
    altConcrete:      a.length > 5 && concreteWords.some(w => a.includes(w)),
    altControllable:  a.length > 5 && !uncontrollable.some(p => a.includes(p)),
  }
}

type DraggingState = { type: 'behavior'; behaviorId: string } | null
type BehaviorSelection = Record<string, { selected: boolean; frequency: Frequency }>
type ActionPlan = Record<string, { stopAction: string; alternative: string }>

export function TRIZAtelier() {
  const [phase, setPhase] = useState<Phase>(1)

  const [antiGoal, setAntiGoal] = useState('')
  const [phase1Eval, setPhase1Eval] = useState<AntiGoalEval | null>(null)

  const [behaviorAssignments, setBehaviorAssignments] = useState<Record<string, TrizCategory>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [behaviorSelection, setBehaviorSelection] = useState<BehaviorSelection>(
    Object.fromEntries(BEHAVIORS.map(b => [b.id, { selected: false, frequency: 'low' as Frequency }]))
  )

  const [actionPlan, setActionPlan] = useState<ActionPlan>(
    Object.fromEntries(BEHAVIORS.map(b => [b.id, { stopAction: '', alternative: '' }]))
  )
  const [phase4Eval, setPhase4Eval] = useState<Record<string, ActionEval> | null>(null)

  const [dragging, setDragging] = useState<DraggingState>(null)

  // Phase 2 derived
  const pool2 = BEHAVIORS.filter(b => !(b.id in behaviorAssignments))
  const phase2AllAssigned = pool2.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleDragStartBehavior(behaviorId: string) {
    setDragging({ type: 'behavior', behaviorId })
    setPhase2Result(null)
  }
  function handleDropOnCategory(category: TrizCategory) {
    if (!dragging || dragging.type !== 'behavior') return
    setBehaviorAssignments(prev => ({ ...prev, [dragging.behaviorId]: category }))
    setDragging(null)
  }
  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'behavior') { setDragging(null); return }
    setBehaviorAssignments(prev => { const next = { ...prev }; delete next[dragging.behaviorId]; return next })
    setDragging(null)
  }
  function verifyPhase2() {
    const result: Record<string, boolean> = {}
    BEHAVIORS.forEach(b => { result[b.id] = behaviorAssignments[b.id] === b.category })
    setPhase2Result(result)
  }
  function resetPhase2() { setBehaviorAssignments({}); setPhase2Result(null) }

  // Phase 3 derived
  const selectedBehaviors = BEHAVIORS.filter(b => behaviorSelection[b.id].selected)
  const phase3HasSelection = selectedBehaviors.length > 0

  // Phase 4 derived
  const phase4AllFilled = selectedBehaviors.every(
    b => actionPlan[b.id].stopAction.trim().length > 0 && actionPlan[b.id].alternative.trim().length > 0
  )

  function verifyPhase4() {
    const result: Record<string, ActionEval> = {}
    selectedBehaviors.forEach(b => {
      result[b.id] = analyzeAction(actionPlan[b.id].stopAction, actionPlan[b.id].alternative)
    })
    setPhase4Eval(result)
  }
  function resetPhase4() {
    setActionPlan(Object.fromEntries(BEHAVIORS.map(b => [b.id, { stopAction: '', alternative: '' }])))
    setPhase4Eval(null)
  }

  const finalBadgeGreen = phase2Score !== null && phase2Score >= 13 && phase4AllFilled

  const FREQ_LABEL: Record<Frequency, string> = { low: 'Faible', medium: 'Moyen', high: 'Élevé' }

  return (
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'triz')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">TRIZ — Anti-Goal</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 4 — Formulez l\'anti-objectif de votre défi Scrum.'}
          {phase === 2 && 'Phase 2 / 4 — Classez les 15 comportements destructeurs par catégorie.'}
          {phase === 3 && 'Phase 3 / 4 — Identifiez les comportements présents dans votre contexte.'}
          {phase === 4 && 'Phase 4 / 4 — Construisez votre plan d\'élimination.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="triz-phase1">
            <div className="triz-goal-card">
              <strong>Objectif initial :</strong>{' '}
              <em>« Améliorer la collaboration dans l'équipe Scrum »</em>
            </div>
            <div className="sbi-field-group">
              <label className="sbi-field-label sbi-field-label--s">
                Anti-objectif — Comment créer le pire résultat possible ?
              </label>
              <input
                data-antigoal-input
                type="text"
                className="at-phrase-input"
                placeholder="Créer une collaboration catastrophique dans l'équipe…"
                value={antiGoal}
                onChange={e => { setAntiGoal(e.target.value); setPhase1Eval(null) }}
              />
              {phase1Eval && (
                <div className="at-indicators">
                  <span className={`at-indicator ${phase1Eval.isInverted ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase1Eval.isInverted ? '✓' : '✗'} Logique inversée
                  </span>
                  <span className={`at-indicator ${phase1Eval.isCoherent ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase1Eval.isCoherent ? '✓' : '✗'} Cohérence avec l'objectif
                  </span>
                </div>
              )}
            </div>
          </div>

          {phase1Eval && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Eval.isInverted && phase1Eval.isCoherent ? 'badge--green' : 'badge--orange'}`}>
                {phase1Eval.isInverted && phase1Eval.isCoherent ? '✔ Anti-objectif clair' : '⚠ Anti-objectif améliorable'}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase1Eval(analyzeAntiGoal(antiGoal))} disabled={antiGoal.trim().length === 0}>
              Vérifier
            </button>
            {phase1Eval && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="tk-grid">
            {CATEGORIES.map(cat => {
              const col = BEHAVIORS.filter(b => behaviorAssignments[b.id] === cat)
              return (
                <div key={cat} data-category={cat} className="tk-col" onDragOver={e => e.preventDefault()} onDrop={() => handleDropOnCategory(cat)}>
                  <p className="tk-col__header">{CATEGORY_META[cat].label}</p>
                  <div className="tk-col__cards">
                    {col.map(b => (
                      <div
                        key={b.id}
                        data-behavior={b.id}
                        className={'tk-intervention-card' + (phase2Result !== null ? (phase2Result[b.id] ? ' tk-intervention-card--correct' : ' tk-intervention-card--wrong') : '')}
                        draggable
                        onDragStart={() => handleDragStartBehavior(b.id)}
                      >
                        {b.text}
                      </div>
                    ))}
                    {col.length === 0 && <span className="tk-col__placeholder">Déposer ici</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tk-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
            <p className="scrum-palette__title">Comportements à classer</p>
            <div className="ishi-pool__cards">
              {pool2.map(b => (
                <div key={b.id} data-behavior={b.id} className="tk-intervention-card" draggable onDragStart={() => handleDragStartBehavior(b.id)}>
                  {b.text}
                </div>
              ))}
              {pool2.length === 0 && <span className="scrum-palette__empty">Tous les comportements ont été classés</span>}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 15 correct
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase2} disabled={!phase2AllAssigned}>Vérifier</button>
            {phase2Result && (
              <>
                <button className="btn btn--secondary" onClick={resetPhase2}>Réessayer phase 2</button>
                <button className="btn btn--primary" onClick={() => setPhase(3)}>Phase suivante →</button>
              </>
            )}
          </div>
        </>
      )}

      {phase === 3 && (
        <>
          <div className="triz-selection">
            <p className="mm-section-label">Cochez les comportements présents dans votre contexte et évaluez leur fréquence.</p>
            <div className="triz-behavior-list">
              {BEHAVIORS.map(b => {
                const sel = behaviorSelection[b.id]
                const isCritical = sel.selected && sel.frequency === 'high'
                return (
                  <div key={b.id} className={'triz-behavior-row' + (isCritical ? ' triz-behavior-row--critical' : '')}>
                    <input
                      data-behavior-checkbox={b.id}
                      type="checkbox"
                      checked={sel.selected}
                      onChange={e => setBehaviorSelection(prev => ({
                        ...prev,
                        [b.id]: { ...prev[b.id], selected: e.target.checked },
                      }))}
                    />
                    <span className="triz-behavior-text">{b.text}</span>
                    {sel.selected && (
                      <select
                        data-frequency={b.id}
                        value={sel.frequency}
                        onChange={e => setBehaviorSelection(prev => ({
                          ...prev,
                          [b.id]: { ...prev[b.id], frequency: e.target.value as Frequency },
                        }))}
                      >
                        {(['low', 'medium', 'high'] as Frequency[]).map(f => (
                          <option key={f} value={f}>{FREQ_LABEL[f]}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={() => setPhase(4)} disabled={!phase3HasSelection}>
              Phase suivante →
            </button>
          </div>
        </>
      )}

      {phase === 4 && (
        <>
          <div className="triz-action-plan">
            {selectedBehaviors.map(b => {
              const plan = actionPlan[b.id]
              const eval4 = phase4Eval?.[b.id]
              return (
                <div key={b.id} className="triz-action-card">
                  <p className="triz-action-card__behavior">{b.text}</p>

                  <div className="sbi-field-group">
                    <label className="sbi-field-label sbi-field-label--s">Action pour l'arrêter</label>
                    <input
                      data-stop-action={b.id}
                      type="text"
                      className="at-phrase-input"
                      placeholder="Je vais arrêter de…"
                      value={plan.stopAction}
                      onChange={e => setActionPlan(prev => ({ ...prev, [b.id]: { ...prev[b.id], stopAction: e.target.value } }))}
                    />
                    {eval4 && (
                      <div className="at-indicators">
                        <span className={`at-indicator ${eval4.stopConcrete ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                          {eval4.stopConcrete ? '✓' : '✗'} Concrète
                        </span>
                        <span className={`at-indicator ${eval4.stopControllable ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                          {eval4.stopControllable ? '✓' : '✗'} Contrôlable
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="sbi-field-group">
                    <label className="sbi-field-label sbi-field-label--b">Alternative positive</label>
                    <input
                      data-alternative={b.id}
                      type="text"
                      className="at-phrase-input"
                      placeholder="À la place, je vais…"
                      value={plan.alternative}
                      onChange={e => setActionPlan(prev => ({ ...prev, [b.id]: { ...prev[b.id], alternative: e.target.value } }))}
                    />
                    {eval4 && (
                      <div className="at-indicators">
                        <span className={`at-indicator ${eval4.altConcrete ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                          {eval4.altConcrete ? '✓' : '✗'} Concrète
                        </span>
                        <span className={`at-indicator ${eval4.altControllable ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                          {eval4.altControllable ? '✓' : '✗'} Contrôlable
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {phase4Eval && (
            <div className="scrum-score-banner">
              <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                {finalBadgeGreen ? 'TRIZ maîtrisé !' : 'Plan à améliorer'}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase4} disabled={!phase4AllFilled}>
              Vérifier mon plan
            </button>
            {phase4Eval && (
              <button className="btn btn--secondary" onClick={resetPhase4}>Réessayer phase 4</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
