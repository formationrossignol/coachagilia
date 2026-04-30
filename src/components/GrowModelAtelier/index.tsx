import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

const STEPS = [
  { key: 'goal',    label: 'Goal',    description: "Clarifier l'objectif" },
  { key: 'reality', label: 'Reality', description: 'Explorer la situation actuelle' },
  { key: 'options', label: 'Options', description: 'Générer des possibilités' },
  { key: 'will',    label: 'Will',    description: "Définir les actions et l'engagement" },
]

const SLOT_IDS = ['slot-1', 'slot-2', 'slot-3', 'slot-4']

const SLOT_ANSWERS: Record<string, string> = {
  'slot-1': 'goal',
  'slot-2': 'reality',
  'slot-3': 'options',
  'slot-4': 'will',
}

const STEP_KEYS = STEPS.map(s => s.key)

type Question = { id: string; text: string; step: string }

const QUESTIONS: Question[] = [
  { id: 'q1',  text: "Quel est l'objectif que tu veux atteindre ?", step: 'goal' },
  { id: 'q2',  text: 'À quoi ressemblerait un résultat réussi pour toi ?', step: 'goal' },
  { id: 'q3',  text: "Qu'est-ce qui est vraiment important dans cette situation ?", step: 'goal' },
  { id: 'q4',  text: 'Quel serait un bon résultat à la fin de ce Sprint ?', step: 'goal' },
  { id: 'q5',  text: "Où en es-tu aujourd'hui ?", step: 'reality' },
  { id: 'q6',  text: "Qu'est-ce qui se passe concrètement en ce moment ?", step: 'reality' },
  { id: 'q7',  text: "Qu'as-tu déjà essayé ?", step: 'reality' },
  { id: 'q8',  text: 'Quels obstacles rencontres-tu actuellement ?', step: 'reality' },
  { id: 'q9',  text: 'Quelles sont les différentes options possibles ?', step: 'options' },
  { id: 'q10', text: "Que pourrais-tu essayer d'autre ?", step: 'options' },
  { id: 'q11', text: "Si tu n'avais aucune contrainte, que ferais-tu ?", step: 'options' },
  { id: 'q12', text: 'Quelles alternatives vois-tu à cette approche ?', step: 'options' },
  { id: 'q13', text: 'Quelle est la prochaine action que tu vas entreprendre ?', step: 'will' },
  { id: 'q14', text: 'Quand vas-tu le faire ?', step: 'will' },
  { id: 'q15', text: "Qu'est-ce qui pourrait t'empêcher d'agir ?", step: 'will' },
  { id: 'q16', text: 'Comment vas-tu t\'assurer que cela sera fait ?', step: 'will' },
]

function ScaleSlot({ slotId, stepKey, result, onDrop, onDragStart, slotNumber }: {
  slotId: string
  stepKey: string
  result: Record<string, boolean> | null
  onDrop: (slotId: string) => void
  onDragStart: (stepKey: string, fromSlot?: string) => void
  slotNumber: number
}) {
  const step = STEPS.find(s => s.key === stepKey)
  const verified = result !== null
  const correct = result?.[slotId]
  return (
    <div className="dp-scale-item">
      <span className="dp-scale-item__number">{slotNumber}</span>
      <div
        data-slot={slotId}
        className={
          'dp-zone' +
          (stepKey ? ' dp-zone--filled' : ' dp-zone--empty') +
          (verified ? (correct ? ' dp-zone--correct' : ' dp-zone--wrong') : '')
        }
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dp-zone--hover') }}
        onDragLeave={e => e.currentTarget.classList.remove('dp-zone--hover')}
        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dp-zone--hover'); onDrop(slotId) }}
      >
        {stepKey ? (
          <span
            className="dp-level-card dp-level-card--placed"
            draggable
            onDragStart={() => onDragStart(stepKey, slotId)}
          >
            <span className="dp-level-card__label">{step?.label}</span>
            <span className="dp-level-card__desc">{step?.description}</span>
          </span>
        ) : (
          <span className="dp-zone__placeholder">?</span>
        )}
      </div>
    </div>
  )
}

export function GrowModelAtelier() {
  const { markComplete } = useWorkshopCompletion('grow-model')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [slots, setSlots] = useState<Record<string, string>>(() =>
    Object.fromEntries(SLOT_IDS.map(id => [id, '']))
  )
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<{ label: string; fromSlot?: string } | null>(null)

  const isDirty = phase > 1 || Object.values(slots).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  const placedSteps = new Set(Object.values(slots).filter(Boolean))
  const paletteSteps = STEP_KEYS.filter(k => !placedSteps.has(k))
  const phase1AllFilled = paletteSteps.length === 0

  function handleStepDragStart(stepKey: string, fromSlot?: string) {
    setDragging({ label: stepKey, fromSlot })
    setPhase1Result(null)
  }

  function handleDropOnSlot(slotId: string) {
    if (!dragging) return
    setSlots(prev => {
      const next = { ...prev }
      if (dragging.fromSlot) next[dragging.fromSlot] = ''
      next[slotId] = dragging.label
      return next
    })
    setDragging(null)
  }

  function handleDropOnPalette() {
    if (!dragging?.fromSlot) { setDragging(null); return }
    setSlots(prev => ({ ...prev, [dragging.fromSlot!]: '' }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const slotId of SLOT_IDS) {
      result[slotId] = slots[slotId] === SLOT_ANSWERS[slotId]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setSlots(Object.fromEntries(SLOT_IDS.map(id => [id, ''])))
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 4

  const unassigned = QUESTIONS.filter(q => !(q.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleQuestionDragStart(questionId: string) {
    setDragging({ label: questionId })
    setPhase2Result(null)
  }

  function handleDropOnStepColumn(stepKey: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: stepKey }))
    setDragging(null)
  }

  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    setAssignments(prev => {
      const next = { ...prev }
      delete next[dragging.label]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const q of QUESTIONS) {
      result[q.id] = assignments[q.id] === q.step
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setAssignments({})
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'grow-model')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Modèle GROW</h1>
        <p className="atelier-subtitle">
          {phase === 1
            ? 'Phase 1 / 2 — Ordonnez les 4 étapes du modèle GROW dans le bon ordre.'
            : 'Phase 2 / 2 — Associez chaque question de coaching à l\'étape GROW correspondante.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="dp-scale">
            <div className="dp-scale__legend">
              <span>Début de conversation</span>
              <span>Fin de conversation</span>
            </div>
            {SLOT_IDS.map((slotId, i) => (
              <ScaleSlot
                key={slotId}
                slotId={slotId}
                stepKey={slots[slotId]}
                result={phase1Result}
                onDrop={handleDropOnSlot}
                onDragStart={handleStepDragStart}
                slotNumber={i + 1}
              />
            ))}
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 4 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette}>
            <p className="scrum-palette__title">Étapes à ordonner</p>
            <div className="scrum-palette__labels">
              {paletteSteps.map(key => {
                const step = STEPS.find(s => s.key === key)!
                return (
                  <span
                    key={key}
                    data-step={key}
                    className="dp-level-card"
                    draggable
                    onDragStart={() => handleStepDragStart(key)}
                  >
                    <span className="dp-level-card__label">{step.label}</span>
                    <span className="dp-level-card__desc">{step.description}</span>
                  </span>
                )
              })}
              {paletteSteps.length === 0 && (
                <span className="scrum-palette__empty">Toutes les étapes ont été placées</span>
              )}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllFilled}>
              Vérifier
            </button>
            {phase1Result && !phase1Perfect && (
              <button className="btn btn--secondary" onClick={handleResetPhase1}>Réessayer</button>
            )}
            {phase1Perfect && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="tki-columns">
            {STEPS.map(step => {
              const stepQuestions = QUESTIONS.filter(q => assignments[q.id] === step.key)
              return (
                <div
                  key={step.key}
                  data-mode={step.key}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnStepColumn(step.key)}
                >
                  <h3 className="tki-column__title">{step.label}</h3>
                  <div className="tki-column__cards">
                    {stepQuestions.map(q => (
                      <div
                        key={q.id}
                        data-question={q.id}
                        className={
                          'tki-situation-card' +
                          (phase2Result !== null
                            ? phase2Result[q.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                            : '')
                        }
                        draggable
                        onDragStart={() => handleQuestionDragStart(q.id)}
                      >
                        {q.text}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tki-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
            <p className="scrum-palette__title">Questions à classer</p>
            <div className="tki-pool__cards">
              {unassigned.map(q => (
                <div
                  key={q.id}
                  data-question={q.id}
                  className="tki-situation-card"
                  draggable
                  onDragStart={() => handleQuestionDragStart(q.id)}
                >
                  {q.text}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="scrum-palette__empty">Toutes les questions ont été classées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 16 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 16 correct{phase2Score === 16 ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllAssigned}>
              Vérifier
            </button>
            {phase2Result && (
              <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
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
