import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

const LEVELS = [
  { key: 'tell',     label: 'Tell',     description: "Je décide et j'informe" },
  { key: 'sell',     label: 'Sell',     description: "Je décide et je convaincs" },
  { key: 'consult',  label: 'Consult',  description: "Je consulte puis je décide" },
  { key: 'agree',    label: 'Agree',    description: "Nous décidons ensemble" },
  { key: 'advise',   label: 'Advise',   description: "Je conseille, l'équipe décide" },
  { key: 'inquire',  label: 'Inquire',  description: "L'équipe décide, je demande à être informé" },
  { key: 'delegate', label: 'Delegate', description: "L'équipe décide en autonomie" },
]

const SLOT_IDS = ['slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5', 'slot-6', 'slot-7']

const SLOT_ANSWERS: Record<string, string> = {
  'slot-1': 'tell',
  'slot-2': 'sell',
  'slot-3': 'consult',
  'slot-4': 'agree',
  'slot-5': 'advise',
  'slot-6': 'inquire',
  'slot-7': 'delegate',
}

const LEVEL_KEYS = LEVELS.map(l => l.key)

type Situation = { id: string; text: string; level: string }

const SITUATIONS: Situation[] = [
  { id: 's1',  text: "Une faille de sécurité critique impose l'arrêt immédiat d'une pratique risquée.", level: 'tell' },
  { id: 's2',  text: "Une règle légale ou contractuelle non négociable doit être appliquée sans débat.", level: 'tell' },
  { id: 's3',  text: "Le Scrum Master veut faire adopter une nouvelle pratique de facilitation nécessaire, mais l'équipe est sceptique.", level: 'sell' },
  { id: 's4',  text: "Le manager impose un changement d'outil : le Scrum Master doit expliquer le sens et obtenir l'adhésion.", level: 'sell' },
  { id: 's5',  text: "Le Scrum Master veut ajuster le format d'une rétrospective et recueille l'avis de l'équipe avant de décider.", level: 'consult' },
  { id: 's6',  text: "Une tension apparaît sur l'organisation des binômes : le Scrum Master écoute les options puis tranche.", level: 'consult' },
  { id: 's7',  text: "L'équipe doit définir ensemble ses règles de fonctionnement pour améliorer la collaboration.", level: 'agree' },
  { id: 's8',  text: "Le Product Owner et les Developers doivent se mettre d'accord sur une règle de clarification des User Stories.", level: 'agree' },
  { id: 's9',  text: "L'équipe souhaite expérimenter une nouvelle façon d'organiser le refinement : le Scrum Master donne des conseils puis laisse décider.", level: 'advise' },
  { id: 's10', text: "Un développeur propose une amélioration de la Definition of Done : le Scrum Master partage les risques puis laisse l'équipe choisir.", level: 'advise' },
  { id: 's11', text: "L'équipe choisit seule son organisation interne pour traiter les sujets techniques, puis partage le résultat au Scrum Master.", level: 'inquire' },
  { id: 's12', text: "Les Developers décident de modifier leur méthode de synchronisation quotidienne et informent ensuite le Scrum Master.", level: 'inquire' },
  { id: 's13', text: "L'équipe mature gère seule la répartition du travail pendant le Sprint.", level: 'delegate' },
  { id: 's14', text: "L'équipe définit elle-même sa stratégie d'amélioration continue sans validation préalable.", level: 'delegate' },
]

function ScaleSlot({ slotId, levelKey, result, onDrop, onDragStart, slotNumber }: {
  slotId: string
  levelKey: string
  result: Record<string, boolean> | null
  onDrop: (slotId: string) => void
  onDragStart: (levelKey: string, fromSlot?: string) => void
  slotNumber: number
}) {
  const level = LEVELS.find(l => l.key === levelKey)
  const verified = result !== null
  const correct = result?.[slotId]
  return (
    <div className="dp-scale-item">
      <span className="dp-scale-item__number">{slotNumber}</span>
      <div
        data-slot={slotId}
        className={
          'dp-zone' +
          (levelKey ? ' dp-zone--filled' : ' dp-zone--empty') +
          (verified ? (correct ? ' dp-zone--correct' : ' dp-zone--wrong') : '')
        }
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dp-zone--hover') }}
        onDragLeave={e => e.currentTarget.classList.remove('dp-zone--hover')}
        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('dp-zone--hover'); onDrop(slotId) }}
      >
        {levelKey ? (
          <span
            className="dp-level-card dp-level-card--placed"
            draggable
            onDragStart={() => onDragStart(levelKey, slotId)}
          >
            <span className="dp-level-card__label">{level?.label}</span>
            <span className="dp-level-card__desc">{level?.description}</span>
          </span>
        ) : (
          <span className="dp-zone__placeholder">?</span>
        )}
      </div>
    </div>
  )
}

export function DelegationPokerAtelier() {
  const { markComplete } = useWorkshopCompletion('delegation-poker')
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

  const placedLevels = new Set(Object.values(slots).filter(Boolean))
  const paletteLevels = LEVEL_KEYS.filter(k => !placedLevels.has(k))
  const phase1AllFilled = paletteLevels.length === 0

  function handleLevelDragStart(levelKey: string, fromSlot?: string) {
    setDragging({ label: levelKey, fromSlot })
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
  const phase1Perfect = phase1Score === 7

  const unassigned = SITUATIONS.filter(s => !(s.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleSituationDragStart(situationId: string) {
    setDragging({ label: situationId })
    setPhase2Result(null)
  }

  function handleDropOnLevelColumn(levelKey: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: levelKey }))
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
    for (const s of SITUATIONS) {
      result[s.id] = assignments[s.id] === s.level
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
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'delegation-poker')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Delegation Poker</h1>
        <p className="atelier-subtitle">
          {phase === 1
            ? 'Phase 1 / 2 — Ordonnez les 7 niveaux de délégation du plus directif au plus autonome.'
            : 'Phase 2 / 2 — Associez chaque situation au niveau de délégation approprié.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="dp-scale">
            <div className="dp-scale__legend">
              <span>← Plus directif</span>
              <span>Plus autonome →</span>
            </div>
            {SLOT_IDS.map((slotId, i) => (
              <ScaleSlot
                key={slotId}
                slotId={slotId}
                levelKey={slots[slotId]}
                result={phase1Result}
                onDrop={handleDropOnSlot}
                onDragStart={handleLevelDragStart}
                slotNumber={i + 1}
              />
            ))}
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 7 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette}>
            <p className="scrum-palette__title">Niveaux à ordonner</p>
            <div className="scrum-palette__labels">
              {paletteLevels.map(key => {
                const level = LEVELS.find(l => l.key === key)!
                return (
                  <span
                    key={key}
                    data-level={key}
                    className="dp-level-card"
                    draggable
                    onDragStart={() => handleLevelDragStart(key)}
                  >
                    <span className="dp-level-card__label">{level.label}</span>
                    <span className="dp-level-card__desc">{level.description}</span>
                  </span>
                )
              })}
              {paletteLevels.length === 0 && (
                <span className="scrum-palette__empty">Tous les niveaux ont été placés</span>
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
            {LEVELS.map(level => {
              const levelSituations = SITUATIONS.filter(s => assignments[s.id] === level.key)
              return (
                <div
                  key={level.key}
                  data-mode={level.key}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnLevelColumn(level.key)}
                >
                  <h3 className="tki-column__title">{level.label}</h3>
                  <div className="tki-column__cards">
                    {levelSituations.map(s => (
                      <div
                        key={s.id}
                        data-situation={s.id}
                        className={
                          'tki-situation-card' +
                          (phase2Result !== null
                            ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                            : '')
                        }
                        draggable
                        onDragStart={() => handleSituationDragStart(s.id)}
                      >
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tki-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
            <p className="scrum-palette__title">Situations à classer</p>
            <div className="tki-pool__cards">
              {unassigned.map(s => (
                <div
                  key={s.id}
                  data-situation={s.id}
                  className="tki-situation-card"
                  draggable
                  onDragStart={() => handleSituationDragStart(s.id)}
                >
                  {s.text}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 14 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 14 correct{phase2Score === 14 ? ' — Parfait !' : ''}
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
