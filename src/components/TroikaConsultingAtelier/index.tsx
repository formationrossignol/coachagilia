import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type TroikaStep = 'problem' | 'clarification' | 'consultants' | 'reaction' | 'action'
type Phase = 1 | 2 | 3

const STEP_IDS: TroikaStep[] = ['problem', 'clarification', 'consultants', 'reaction', 'action']

const STEP_META: Record<TroikaStep, { label: string; description: string }> = {
  problem:       { label: 'Présentation du problème',  description: 'Le porteur expose son défi' },
  clarification: { label: 'Questions de clarification', description: 'Les consultants posent des questions' },
  consultants:   { label: 'Échange consultants',         description: 'Les consultants discutent entre eux (le porteur écoute)' },
  reaction:      { label: 'Réaction du porteur',         description: "Le porteur partage ce qu'il retient" },
  action:        { label: "Plan d'action",               description: 'Définition des prochaines actions' },
}

const CORRECT_ORDER: TroikaStep[] = ['problem', 'clarification', 'consultants', 'reaction', 'action']

type Intervention = { id: string; text: string; step: TroikaStep }

const INTERVENTIONS: Intervention[] = [
  { id: 'i1',  text: "Voici mon problème : je n'arrive pas à faire participer l'équipe en rétrospective.", step: 'problem' },
  { id: 'i2',  text: "Mon équipe ne respecte pas la Definition of Done.",                                   step: 'problem' },
  { id: 'i3',  text: "Je n'arrive pas à faire adhérer le Product Owner.",                                   step: 'problem' },
  { id: 'i4',  text: "Qu'as-tu déjà essayé ?",                                                              step: 'clarification' },
  { id: 'i5',  text: 'Depuis combien de temps cette situation dure ?',                                       step: 'clarification' },
  { id: 'i6',  text: "Qu'est-ce qui fonctionne déjà un peu ?",                                              step: 'clarification' },
  { id: 'i7',  text: "On dirait qu'il y a un problème de sécurité psychologique.",                          step: 'consultants' },
  { id: 'i8',  text: "Peut-être qu'un format différent de rétrospective aiderait.",                         step: 'consultants' },
  { id: 'i9',  text: "Le problème semble venir d'un manque de clarté sur les attentes.",                   step: 'consultants' },
  { id: 'i10', text: "Ce qui me parle le plus, c'est l'idée de changer le format.",                        step: 'reaction' },
  { id: 'i11', text: "Je réalise que je n'ai pas assez exploré les causes.",                                step: 'reaction' },
  { id: 'i12', text: "Je pense que je dois mieux comprendre l'équipe.",                                    step: 'reaction' },
  { id: 'i13', text: 'Je vais tester un nouveau format de rétrospective au prochain Sprint.',               step: 'action' },
  { id: 'i14', text: 'Je vais organiser un échange individuel avec le Product Owner.',                      step: 'action' },
  { id: 'i15', text: "Je vais recueillir du feedback auprès de l'équipe.",                                  step: 'action' },
]

type EvalResult = { isOpenQuestion: boolean; isNonDirective: boolean; respectsTroika: boolean }

function analyzeQuestion(text: string): EvalResult {
  const t = text.trim().toLowerCase()
  const openWords = ["qu'", "quoi", "comment", "pourquoi", "quel", "quelle", "quels", "quelles", "que ", "qu'est", "quand", "combien", "lequel", "laquelle"]
  const directivePatterns = ["tu dois", "il faut", "vous devez", "tu devrais", "il faudrait"]
  const isOpenQuestion = t.includes('?') && openWords.some(w => t.startsWith(w))
  const isNonDirective = t.length > 0 && !directivePatterns.some(p => t.includes(p))
  return { isOpenQuestion, isNonDirective, respectsTroika: isOpenQuestion && isNonDirective }
}

function analyzeAdvice(text: string): EvalResult {
  const t = text.trim().toLowerCase()
  const directivePatterns = ["tu dois", "il faut", "vous devez", "tu devrais", "il faudrait"]
  const directAddress = [" tu ", "vous ", "tu as", "tu es", "tu peux"]
  const isNonDirective = t.length > 0 && !directivePatterns.some(p => t.includes(p))
  const noDirectAddress = !directAddress.some(p => t.includes(p)) && !t.startsWith('tu ')
  return { isOpenQuestion: false, isNonDirective, respectsTroika: isNonDirective && noDirectAddress }
}

type DraggingState =
  | { type: 'step'; step: TroikaStep; fromIndex?: number }
  | { type: 'intervention'; interventionId: string }
  | null

export function TroikaConsultingAtelier() {
  const [phase, setPhase] = useState<Phase>(1)

  // Phase 1
  const [ranking, setRanking] = useState<(TroikaStep | null)[]>(Array(5).fill(null))
  const isDirty = phase > 1 || ranking.some(s => s !== null)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Result, setPhase1Result] = useState<Record<number, boolean> | null>(null)

  // Phase 2
  const [interventionAssignments, setInterventionAssignments] = useState<Record<string, TroikaStep>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 3
  const [questions, setQuestions] = useState(['', ''])
  const [advice, setAdvice] = useState('')
  const [phase3Eval, setPhase3Eval] = useState<{ q1: EvalResult; q2: EvalResult; advice: EvalResult } | null>(null)

  const [dragging, setDragging] = useState<DraggingState>(null)

  // Phase 1 derived
  const pool1 = STEP_IDS.filter(s => !ranking.includes(s))
  const phase1AllFilled = ranking.every(s => s !== null)
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 5

  function handleDragStartStep(step: TroikaStep, fromIndex?: number) {
    setDragging({ type: 'step', step, fromIndex })
    setPhase1Result(null)
  }
  function handleDropOnSlot(slotIndex: number) {
    if (!dragging || dragging.type !== 'step') return
    const { step, fromIndex } = dragging
    setRanking(prev => {
      const next = [...prev]
      const existing = next[slotIndex]
      if (fromIndex !== undefined) next[fromIndex] = existing
      next[slotIndex] = step
      return next
    })
    setDragging(null)
  }
  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'step') { setDragging(null); return }
    if (dragging.fromIndex !== undefined) {
      setRanking(prev => { const next = [...prev]; next[dragging.fromIndex!] = null; return next })
    }
    setDragging(null)
  }
  function verifyPhase1() {
    const result: Record<number, boolean> = {}
    ranking.forEach((step, i) => { if (step !== null) result[i] = step === CORRECT_ORDER[i] })
    setPhase1Result(result)
  }
  function resetPhase1() { setRanking(Array(5).fill(null)); setPhase1Result(null) }

  // Phase 2 derived
  const pool2 = INTERVENTIONS.filter(i => !(i.id in interventionAssignments))
  const phase2AllAssigned = pool2.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleDragStartIntervention(interventionId: string) {
    setDragging({ type: 'intervention', interventionId })
    setPhase2Result(null)
  }
  function handleDropOnStepZone(step: TroikaStep) {
    if (!dragging || dragging.type !== 'intervention') return
    setInterventionAssignments(prev => ({ ...prev, [dragging.interventionId]: step }))
    setDragging(null)
  }
  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'intervention') { setDragging(null); return }
    setInterventionAssignments(prev => { const next = { ...prev }; delete next[dragging.interventionId]; return next })
    setDragging(null)
  }
  function verifyPhase2() {
    const result: Record<string, boolean> = {}
    INTERVENTIONS.forEach(i => { result[i.id] = interventionAssignments[i.id] === i.step })
    setPhase2Result(result)
  }
  function resetPhase2() { setInterventionAssignments({}); setPhase2Result(null) }

  // Phase 3 derived
  const phase3AllFilled = questions[0].trim().length > 0 && questions[1].trim().length > 0 && advice.trim().length > 0

  function verifyPhase3() {
    setPhase3Eval({ q1: analyzeQuestion(questions[0]), q2: analyzeQuestion(questions[1]), advice: analyzeAdvice(advice) })
  }
  function resetPhase3() { setQuestions(['', '']); setAdvice(''); setPhase3Eval(null) }

  const phase3Score = phase3Eval
    ? [phase3Eval.q1.respectsTroika, phase3Eval.q2.respectsTroika, phase3Eval.advice.respectsTroika].filter(Boolean).length
    : null
  const finalBadgeGreen = phase2Score !== null && phase2Score >= 13 && phase3Score !== null && phase3Score >= 2

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'troika-consulting')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Troika Consulting</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Ordonnez les 5 étapes du Troika Consulting.'}
          {phase === 2 && 'Phase 2 / 3 — Classez les 15 interventions dans la bonne étape.'}
          {phase === 3 && 'Phase 3 / 3 — Simulez votre rôle de consultant Troika.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="mm-phase1-layout">
            <div className="mm-ranking-zone">
              <p className="mm-section-label">Votre ordre</p>
              {Array.from({ length: 5 }, (_, i) => {
                const step = ranking[i]
                const correct = phase1Result?.[i]
                const verified = phase1Result !== null
                return (
                  <div
                    key={i}
                    data-slot={i}
                    className={
                      'mm-slot' +
                      (step ? ' mm-slot--filled' : ' mm-slot--empty') +
                      (verified && step !== null ? (correct ? ' mm-slot--correct' : ' mm-slot--wrong') : '')
                    }
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('mm-slot--hover') }}
                    onDragLeave={e => e.currentTarget.classList.remove('mm-slot--hover')}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('mm-slot--hover'); handleDropOnSlot(i) }}
                  >
                    <span className="mm-slot__rank">{i + 1}</span>
                    {step ? (
                      <div data-step={step} className="mm-motivator-card mm-motivator-card--placed" draggable onDragStart={() => handleDragStartStep(step, i)}>
                        <strong className="mm-motivator-card__name">{STEP_META[step].label}</strong>
                        <span className="mm-motivator-card__desc">{STEP_META[step].description}</span>
                      </div>
                    ) : (
                      <span className="mm-slot__placeholder">Déposer ici</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mm-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool1}>
              <p className="mm-section-label">Étapes à ordonner</p>
              <div className="mm-pool__cards">
                {pool1.map(step => (
                  <div key={step} data-step={step} className="mm-motivator-card" draggable onDragStart={() => handleDragStartStep(step)}>
                    <strong className="mm-motivator-card__name">{STEP_META[step].label}</strong>
                    <span className="mm-motivator-card__desc">{STEP_META[step].description}</span>
                  </div>
                ))}
                {pool1.length === 0 && <span className="scrum-palette__empty">Toutes les étapes sont placées</span>}
              </div>
            </div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 5 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase1} disabled={!phase1AllFilled}>Vérifier</button>
            {phase1Result && !phase1Perfect && (
              <button className="btn btn--secondary" onClick={resetPhase1}>Réessayer</button>
            )}
            {phase1Perfect && (
              <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
            )}
          </div>
        </>
      )}

      {phase === 2 && (
        <>
          <div className="tk-grid">
            {STEP_IDS.map(step => {
              const col = INTERVENTIONS.filter(i => interventionAssignments[i.id] === step)
              return (
                <div key={step} data-step-zone={step} className="tk-col" onDragOver={e => e.preventDefault()} onDrop={() => handleDropOnStepZone(step)}>
                  <p className="tk-col__header">{STEP_META[step].label}</p>
                  <div className="tk-col__cards">
                    {col.map(i => (
                      <div key={i.id} data-intervention={i.id}
                        className={'tk-intervention-card' + (phase2Result !== null ? (phase2Result[i.id] ? ' tk-intervention-card--correct' : ' tk-intervention-card--wrong') : '')}
                        draggable onDragStart={() => handleDragStartIntervention(i.id)}>{i.text}</div>
                    ))}
                    {col.length === 0 && <span className="tk-col__placeholder">Déposer ici</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tk-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
            <p className="scrum-palette__title">Interventions à classer</p>
            <div className="ishi-pool__cards">
              {pool2.map(i => (
                <div key={i.id} data-intervention={i.id} className="tk-intervention-card" draggable onDragStart={() => handleDragStartIntervention(i.id)}>{i.text}</div>
              ))}
              {pool2.length === 0 && <span className="scrum-palette__empty">Toutes les interventions ont été classées</span>}
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
          <div className="tk-simulation">
            <div className="tk-scenario">
              <strong>Contexte :</strong> Un Scrum Master vous soumet son problème : <em>« Mon équipe ne participe pas en rétrospective et je ne sais pas comment la motiver. »</em>
            </div>

            <div className="tk-phase-block">
              <h3>Vos questions de clarification</h3>
              <p>Posez 2 questions ouvertes pour mieux comprendre le problème (sans donner de solution).</p>
              <div className="tk-input-group">
                {[0, 1].map(i => {
                  const ev = i === 0 ? phase3Eval?.q1 : phase3Eval?.q2
                  return (
                    <div key={i}>
                      <input
                        data-question-input={i + 1}
                        type="text"
                        className="at-phrase-input"
                        placeholder={`Question ${i + 1}…`}
                        value={questions[i]}
                        onChange={e => setQuestions(prev => { const next = [...prev]; next[i] = e.target.value; return next })}
                      />
                      {ev && (
                        <div className="at-indicators" style={{ marginTop: '0.35rem' }}>
                          <span className={`at-indicator ${ev.isOpenQuestion ? 'at-indicator--ok' : 'at-indicator--nok'}`}>{ev.isOpenQuestion ? '✓' : '✗'} Question ouverte</span>
                          <span className={`at-indicator ${ev.isNonDirective ? 'at-indicator--ok' : 'at-indicator--nok'}`}>{ev.isNonDirective ? '✓' : '✗'} Non directive</span>
                          <span className={`at-indicator ${ev.respectsTroika ? 'at-indicator--ok' : 'at-indicator--nok'}`}>{ev.respectsTroika ? '✓' : '✗'} Respecte Troika</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="tk-phase-block">
              <h3>Votre conseil (échange consultants)</h3>
              <p>Proposez une piste de réflexion <strong>sans vous adresser directement</strong> au porteur du problème.</p>
              <input
                data-advice-input="advice"
                type="text"
                className="at-phrase-input"
                placeholder="Il semble que… / On pourrait envisager… / Une piste serait de…"
                value={advice}
                onChange={e => setAdvice(e.target.value)}
              />
              {phase3Eval && (
                <div className="at-indicators">
                  <span className={`at-indicator ${phase3Eval.advice.isNonDirective ? 'at-indicator--ok' : 'at-indicator--nok'}`}>{phase3Eval.advice.isNonDirective ? '✓' : '✗'} Non directif</span>
                  <span className={`at-indicator ${phase3Eval.advice.respectsTroika ? 'at-indicator--ok' : 'at-indicator--nok'}`}>{phase3Eval.advice.respectsTroika ? '✓' : '✗'} Respecte Troika</span>
                </div>
              )}
            </div>
          </div>

          {phase3Eval && (
            <div className="scrum-score-banner">
              <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                {phase3Score} / 3 items Troika{finalBadgeGreen ? ' — Excellent !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase3} disabled={!phase3AllFilled}>
              Vérifier ma simulation
            </button>
            {phase3Eval && (
              <button className="btn btn--secondary" onClick={resetPhase3}>Réessayer phase 3</button>
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
