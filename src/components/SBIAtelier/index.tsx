import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type Phase = 1 | 2 | 3
type SBIType = 'situation' | 'behavior' | 'impact'

const CORRECT_ORDER: SBIType[] = ['situation', 'behavior', 'impact']

const BLOCK_META: Record<SBIType, { label: string; description: string }> = {
  situation: { label: 'Situation', description: 'Contexte précis (quand, où)' },
  behavior:  { label: 'Behavior',  description: 'Comportement observable' },
  impact:    { label: 'Impact',    description: 'Effet produit' },
}

type Item = { id: string; text: string; type: SBIType }

const ITEMS: Item[] = [
  { id: 's1', text: 'Lors du Daily Scrum de ce matin…',                               type: 'situation' },
  { id: 's2', text: 'Pendant la Sprint Review de vendredi…',                          type: 'situation' },
  { id: 's3', text: 'Lors de la dernière rétrospective…',                             type: 'situation' },
  { id: 's4', text: 'Hier lors du refinement…',                                       type: 'situation' },
  { id: 'b1', text: 'Tu as interrompu plusieurs fois les autres membres…',             type: 'behavior' },
  { id: 'b2', text: "Tu n'as pas partagé l'avancement de tes tâches…",                type: 'behavior' },
  { id: 'b3', text: 'Tu as proposé une solution sans écouter les autres…',             type: 'behavior' },
  { id: 'b4', text: 'Tu as quitté la réunion sans prévenir…',                         type: 'behavior' },
  { id: 'i1', text: "Cela a créé de la confusion dans l'équipe…",                     type: 'impact' },
  { id: 'i2', text: 'Cela a ralenti la prise de décision…',                           type: 'impact' },
  { id: 'i3', text: 'Cela a frustré plusieurs membres…',                              type: 'impact' },
  { id: 'i4', text: "Cela a empêché une bonne collaboration…",                        type: 'impact' },
]

type EvalResult = {
  situationValid: boolean
  behaviorObservable: boolean
  behaviorNonJudgmental: boolean
  impactClear: boolean
}

function analyzeFeedback(situation: string, behavior: string, impact: string): EvalResult {
  const s = situation.trim().toLowerCase()
  const b = behavior.trim().toLowerCase()
  const i = impact.trim().toLowerCase()

  const temporalWords = ['lors', 'pendant', 'hier', 'matin', 'vendredi', 'lundi', 'mardi', 'mercredi', 'jeudi', 'semaine', 'sprint', 'daily', 'review', 'rétro', "aujourd'hui", 'dernièr', 'dernier']
  const situationValid = s.length > 5 && temporalWords.some(w => s.includes(w))

  const stateVerbs = ['tu es ', "tu n'es", 'tu sembles', 'tu parais', "tu as l'air"]
  const behaviorObservable = b.length > 5 && !stateVerbs.some(w => b.includes(w))

  const judgmentWords = ['paresseux', 'irrespectueux', 'agressif', 'incompétent', 'mauvais', 'nul', 'irresponsable', 'toujours', 'jamais', 'systématiquement']
  const behaviorNonJudgmental = b.length > 5 && !judgmentWords.some(w => b.includes(w))

  const impactWords = ['créé', 'ralenti', 'empêché', 'frustré', 'permis', 'généré', 'impacté', 'affecté', 'bloqué', 'retardé', 'contribué', 'confusion', 'incompréhension', 'difficile', 'impact']
  const impactClear = i.length > 5 && impactWords.some(w => i.includes(w))

  return { situationValid, behaviorObservable, behaviorNonJudgmental, impactClear }
}

type DraggingState =
  | { type: 'block'; block: SBIType; fromIndex?: number }
  | { type: 'item'; itemId: string }
  | null

export function SBIAtelier() {
  const { markComplete } = useWorkshopCompletion('sbi')
  const [phase, setPhase] = useState<Phase>(1)

  const [ranking, setRanking] = useState<(SBIType | null)[]>(Array(3).fill(null))
  const isDirty = phase > 1 || ranking.some(b => b !== null)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [phase1Result, setPhase1Result] = useState<Record<number, boolean> | null>(null)

  const [assignments, setAssignments] = useState<Record<string, SBIType>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [feedback, setFeedback] = useState({ situation: '', behavior: '', impact: '' })
  const [phase3Eval, setPhase3Eval] = useState<EvalResult | null>(null)

  const [dragging, setDragging] = useState<DraggingState>(null)

  const pool1 = CORRECT_ORDER.filter(b => !ranking.includes(b))
  const phase1AllFilled = ranking.every(b => b !== null)
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 3

  function handleDragStartBlock(block: SBIType, fromIndex?: number) {
    setDragging({ type: 'block', block, fromIndex })
    setPhase1Result(null)
  }
  function handleDropOnSlot(slotIndex: number) {
    if (!dragging || dragging.type !== 'block') return
    const { block, fromIndex } = dragging
    setRanking(prev => {
      const next = [...prev]
      const existing = next[slotIndex]
      if (fromIndex !== undefined) next[fromIndex] = existing
      next[slotIndex] = block
      return next
    })
    setDragging(null)
  }
  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'block') { setDragging(null); return }
    if (dragging.fromIndex !== undefined) {
      setRanking(prev => { const next = [...prev]; next[dragging.fromIndex!] = null; return next })
    }
    setDragging(null)
  }
  function verifyPhase1() {
    const result: Record<number, boolean> = {}
    ranking.forEach((block, i) => { if (block !== null) result[i] = block === CORRECT_ORDER[i] })
    setPhase1Result(result)
  }
  function resetPhase1() { setRanking(Array(3).fill(null)); setPhase1Result(null) }

  const pool2 = ITEMS.filter(item => !(item.id in assignments))
  const phase2AllAssigned = pool2.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleDragStartItem(itemId: string) {
    setDragging({ type: 'item', itemId })
    setPhase2Result(null)
  }
  function handleDropOnZone(zone: SBIType) {
    if (!dragging || dragging.type !== 'item') return
    setAssignments(prev => ({ ...prev, [dragging.itemId]: zone }))
    setDragging(null)
  }
  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'item') { setDragging(null); return }
    setAssignments(prev => { const next = { ...prev }; delete next[dragging.itemId]; return next })
    setDragging(null)
  }
  function verifyPhase2() {
    const result: Record<string, boolean> = {}
    ITEMS.forEach(item => { result[item.id] = assignments[item.id] === item.type })
    setPhase2Result(result)
  }
  function resetPhase2() { setAssignments({}); setPhase2Result(null) }

  const phase3AllFilled = feedback.situation.trim().length > 0 && feedback.behavior.trim().length > 0 && feedback.impact.trim().length > 0
  function verifyPhase3() {
    markComplete()
    setPhase3Eval(analyzeFeedback(feedback.situation, feedback.behavior, feedback.impact))
  }
  function resetPhase3() { setFeedback({ situation: '', behavior: '', impact: '' }); setPhase3Eval(null) }

  const phase3AllValid = phase3Eval !== null &&
    phase3Eval.situationValid && phase3Eval.behaviorObservable &&
    phase3Eval.behaviorNonJudgmental && phase3Eval.impactClear
  const finalBadgeGreen = phase2Score !== null && phase2Score >= 10 && phase3AllValid

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'sbi')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">SBI — Situation Behavior Impact</h1>
        <p className="atelier-subtitle">
          {phase === 1 && 'Phase 1 / 3 — Ordonnez les 3 composantes du modèle SBI.'}
          {phase === 2 && 'Phase 2 / 3 — Classez les 12 éléments dans la bonne catégorie SBI.'}
          {phase === 3 && 'Phase 3 / 3 — Construisez un feedback SBI complet.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="mm-phase1-layout">
            <div className="mm-ranking-zone">
              <p className="mm-section-label">Votre ordre</p>
              {Array.from({ length: 3 }, (_, i) => {
                const block = ranking[i]
                const correct = phase1Result?.[i]
                const verified = phase1Result !== null
                return (
                  <div
                    key={i}
                    data-slot={i}
                    className={
                      'mm-slot' +
                      (block ? ' mm-slot--filled' : ' mm-slot--empty') +
                      (verified && block !== null ? (correct ? ' mm-slot--correct' : ' mm-slot--wrong') : '')
                    }
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('mm-slot--hover') }}
                    onDragLeave={e => e.currentTarget.classList.remove('mm-slot--hover')}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('mm-slot--hover'); handleDropOnSlot(i) }}
                  >
                    <span className="mm-slot__rank">{i + 1}</span>
                    {block ? (
                      <div data-block={block} className="mm-motivator-card mm-motivator-card--placed" draggable onDragStart={() => handleDragStartBlock(block, i)}>
                        <strong className="mm-motivator-card__name">{BLOCK_META[block].label}</strong>
                        <span className="mm-motivator-card__desc">{BLOCK_META[block].description}</span>
                      </div>
                    ) : (
                      <span className="mm-slot__placeholder">Déposer ici</span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mm-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool1}>
              <p className="mm-section-label">Composantes à ordonner</p>
              <div className="mm-pool__cards">
                {pool1.map(block => (
                  <div key={block} data-block={block} className="mm-motivator-card" draggable onDragStart={() => handleDragStartBlock(block)}>
                    <strong className="mm-motivator-card__name">{BLOCK_META[block].label}</strong>
                    <span className="mm-motivator-card__desc">{BLOCK_META[block].description}</span>
                  </div>
                ))}
                {pool1.length === 0 && <span className="scrum-palette__empty">Toutes les composantes sont placées</span>}
              </div>
            </div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 3 correct{phase1Perfect ? ' — Parfait !' : ''}
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
          <div className="sbi-cols">
            {CORRECT_ORDER.map(zone => {
              const col = ITEMS.filter(item => assignments[item.id] === zone)
              return (
                <div key={zone} data-zone={zone} className="sbi-col" onDragOver={e => e.preventDefault()} onDrop={() => handleDropOnZone(zone)}>
                  <p className="sbi-col__header">{BLOCK_META[zone].label}</p>
                  <div className="sbi-col__cards">
                    {col.map(item => (
                      <div
                        key={item.id}
                        data-item={item.id}
                        className={'sbi-item-card' + (phase2Result !== null ? (phase2Result[item.id] ? ' sbi-item-card--correct' : ' sbi-item-card--wrong') : '')}
                        draggable
                        onDragStart={() => handleDragStartItem(item.id)}
                      >
                        {item.text}
                      </div>
                    ))}
                    {col.length === 0 && <span className="sbi-col__placeholder">Déposer ici</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="sbi-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
            <p className="scrum-palette__title">Éléments à classer</p>
            <div className="sbi-pool__cards">
              {pool2.map(item => (
                <div key={item.id} data-item={item.id} className="sbi-item-card" draggable onDragStart={() => handleDragStartItem(item.id)}>
                  {item.text}
                </div>
              ))}
              {pool2.length === 0 && <span className="scrum-palette__empty">Tous les éléments ont été classés</span>}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 12 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 12 correct
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
          <div className="sbi-feedback-form">
            <div className="sbi-case">
              <strong>Cas :</strong>{' '}
              <em>« Un développeur monopolise la parole en réunion et coupe régulièrement les autres. »</em>
            </div>

            <div className="sbi-field-group">
              <label className="sbi-field-label sbi-field-label--s">
                S — Situation : contexte précis (quand, où)
              </label>
              <input
                data-sbi-field="situation"
                type="text"
                className="at-phrase-input"
                placeholder="Lors du Daily Scrum de ce matin…"
                value={feedback.situation}
                onChange={e => setFeedback(prev => ({ ...prev, situation: e.target.value }))}
              />
              {phase3Eval && (
                <div className="at-indicators">
                  <span className={`at-indicator ${phase3Eval.situationValid ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase3Eval.situationValid ? '✓' : '✗'} Contexte précis
                  </span>
                </div>
              )}
            </div>

            <div className="sbi-field-group">
              <label className="sbi-field-label sbi-field-label--b">
                B — Behavior : comportement observable, sans jugement
              </label>
              <input
                data-sbi-field="behavior"
                type="text"
                className="at-phrase-input"
                placeholder="Tu as interrompu plusieurs fois…"
                value={feedback.behavior}
                onChange={e => setFeedback(prev => ({ ...prev, behavior: e.target.value }))}
              />
              {phase3Eval && (
                <div className="at-indicators">
                  <span className={`at-indicator ${phase3Eval.behaviorObservable ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase3Eval.behaviorObservable ? '✓' : '✗'} Observable
                  </span>
                  <span className={`at-indicator ${phase3Eval.behaviorNonJudgmental ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase3Eval.behaviorNonJudgmental ? '✓' : '✗'} Sans jugement
                  </span>
                </div>
              )}
            </div>

            <div className="sbi-field-group">
              <label className="sbi-field-label sbi-field-label--i">
                I — Impact : conséquence claire et observable
              </label>
              <input
                data-sbi-field="impact"
                type="text"
                className="at-phrase-input"
                placeholder="Cela a créé de la confusion…"
                value={feedback.impact}
                onChange={e => setFeedback(prev => ({ ...prev, impact: e.target.value }))}
              />
              {phase3Eval && (
                <div className="at-indicators">
                  <span className={`at-indicator ${phase3Eval.impactClear ? 'at-indicator--ok' : 'at-indicator--nok'}`}>
                    {phase3Eval.impactClear ? '✓' : '✗'} Conséquence claire
                  </span>
                </div>
              )}
            </div>
          </div>

          {phase3Eval && (
            <div className="scrum-score-banner">
              <span className={`badge ${finalBadgeGreen ? 'badge--green' : 'badge--orange'}`}>
                {finalBadgeGreen ? 'Feedback SBI maîtrisé !' : 'Feedback à améliorer'}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={verifyPhase3} disabled={!phase3AllFilled}>
              Vérifier mon feedback
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
