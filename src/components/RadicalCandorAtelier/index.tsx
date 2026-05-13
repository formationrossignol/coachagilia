import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type RadicalCandorQuadrant =
  | 'radical-candor'
  | 'ruinous-empathy'
  | 'obnoxious-aggression'
  | 'manipulative-insincerity'

type RadicalCandorExtendedZone = RadicalCandorQuadrant | 'towards-radical-candor'

type DiagramPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type DiagramZones = Record<DiagramPosition, RadicalCandorQuadrant | null>
type SituationZones = Record<string, RadicalCandorExtendedZone>

const DIAGRAM_POSITIONS: DiagramPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

const DIAGRAM_ANSWERS: Record<DiagramPosition, RadicalCandorQuadrant> = {
  'top-left':     'ruinous-empathy',
  'top-right':    'radical-candor',
  'bottom-left':  'manipulative-insincerity',
  'bottom-right': 'obnoxious-aggression',
}

const QUADRANTS: { id: RadicalCandorQuadrant; label: string; description: string }[] = [
  { id: 'radical-candor',           label: 'Radical Candor',           description: 'Défier directement tout en montrant une attention personnelle réelle.' },
  { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Se soucier de la personne, mais éviter le feedback nécessaire.' },
  { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Défier directement sans montrer assez de considération personnelle.' },
  { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: "Ne pas challenger directement et ne pas montrer d'attention sincère." },
]

const EXTENDED_ZONES: { id: RadicalCandorExtendedZone; label: string; description: string }[] = [
  { id: 'radical-candor',           label: 'Radical Candor',           description: 'Feedback clair, spécifique, utile et humain.' },
  { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Évitement du feedback difficile par peur de blesser.' },
  { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Feedback direct mais dur, humiliant ou peu respectueux.' },
  { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: 'Feedback évité, indirect, politique ou non sincère.' },
  { id: 'towards-radical-candor',   label: 'Vers Radical Candor',      description: "Reformulation d'un feedback faible, brutal ou ambigu en feedback clair et aidant." },
]

type Situation = { id: string; situation: string; context: string; correctZone: RadicalCandorExtendedZone }

const SITUATIONS: Situation[] = [
  {
    id: 's1',
    situation: "Un développeur livre régulièrement du code non conforme à la Definition of Done.",
    context: "\"Je veux te parler d'un point important. Plusieurs items livrés ne respectent pas la DoD, notamment sur les tests. Je sais que tu veux bien faire, et je veux qu'on voie ensemble ce qui bloque pour sécuriser les prochaines livraisons.\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's2',
    situation: "Le Scrum Master monopolise souvent la parole en rétrospective.",
    context: "\"Je remarque que tu interviens beaucoup pendant les rétrospectives. Ton intention est d'aider, mais cela laisse moins d'espace à l'équipe. Comment pourrait-on faciliter autrement la prochaine fois ?\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's3',
    situation: "Le Product Owner arrive souvent en Sprint Planning avec des User Stories insuffisamment préparées.",
    context: "\"Les trois dernières sessions de planning ont été ralenties parce que certaines stories n'étaient pas assez claires. L'équipe a besoin d'éléments plus solides pour s'engager correctement.\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's4',
    situation: "Un membre perturbe régulièrement les Daily Scrums, mais le Scrum Master ne dit rien pour ne pas le vexer.",
    context: "Posture : il se soucie de la personne, mais n'ose pas challenger directement.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's5',
    situation: "Le PO sait qu'une User Story est mal rédigée, mais la laisse passer pour ne pas mettre le Business Analyst en difficulté.",
    context: "Posture : il préserve le confort immédiat, mais crée un problème pour l'équipe.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's6',
    situation: "Un manager donne un feedback très vague : \"C'est bien, continue\", alors que la prestation n'est pas au niveau attendu.",
    context: "Posture : le feedback paraît bienveillant, mais il n'aide pas la personne à progresser.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's7',
    situation: "Un lead technique dit en réunion : \"Cette solution est mauvaise, tu n'as clairement pas réfléchi.\"",
    context: "Posture : le feedback est direct, mais il attaque la personne au lieu d'aider.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's8',
    situation: "Un Scrum Master humilie un membre devant l'équipe parce qu'il n'a pas terminé sa tâche.",
    context: "Posture : il challenge, mais sans respect ni attention personnelle.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's9',
    situation: "Un manager corrige publiquement une erreur avec un ton sarcastique.",
    context: "Posture : la franchise devient une démonstration de pouvoir.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's10',
    situation: "Un collègue dit en face que tout va bien, puis critique fortement la personne en dehors de la réunion.",
    context: "Posture : ni franchise utile, ni intention d'aide.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's11',
    situation: "Un manager évite un feedback difficile pour préserver son image de \"manager sympa\".",
    context: "Posture : il protège surtout son confort personnel.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's12',
    situation: "Un membre valide une décision en réunion, puis cherche discrètement à la saboter.",
    context: "Posture : absence de transparence et absence d'engagement sincère.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's13',
    situation: "Au lieu de dire \"Tu n'es pas assez rigoureux\", le Scrum Master reformule en observation précise.",
    context: "\"Sur les deux dernières stories, les critères d'acceptation n'étaient pas vérifiés avant passage en Done. Qu'est-ce qui t'aiderait à fiabiliser ce point ?\"",
    correctZone: 'towards-radical-candor',
  },
  {
    id: 's14',
    situation: "Au lieu d'éviter un feedback sur une facilitation confuse, un pair propose une aide concrète.",
    context: "\"J'ai eu du mal à suivre la séquence de l'atelier. Tu as une bonne intention de participation, et je peux t'aider à clarifier le déroulé si tu veux.\"",
    correctZone: 'towards-radical-candor',
  },
  {
    id: 's15',
    situation: "Au lieu de critiquer un développeur en public, le lead technique choisit un feedback direct en privé.",
    context: "\"Je veux revenir sur la revue de code. Certaines remarques étaient justes sur le fond, mais le ton a fermé la discussion. Comment peux-tu garder l'exigence technique sans braquer l'équipe ?\"",
    correctZone: 'towards-radical-candor',
  },
]

type DraggingItem =
  | { type: 'quadrant-label'; label: RadicalCandorQuadrant; fromPosition?: DiagramPosition }
  | { type: 'situation'; situationId: string; fromZone?: RadicalCandorExtendedZone }
  | null

const EMPTY_DIAGRAM: DiagramZones = { 'top-left': null, 'top-right': null, 'bottom-left': null, 'bottom-right': null }

export function RadicalCandorAtelier() {
  const { markComplete } = useWorkshopCompletion('radical-candor')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [diagramZones, setDiagramZones] = useState<DiagramZones>({ ...EMPTY_DIAGRAM })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<DraggingItem>(null)

  const isDirty = phase > 1 || Object.values(diagramZones).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedQuadrants = new Set(Object.values(diagramZones).filter((v): v is RadicalCandorQuadrant => v !== null))
  const paletteLabels = QUADRANTS.filter(q => !placedQuadrants.has(q.id))
  const phase1AllFilled = paletteLabels.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 4

  function handleLabelDragStart(label: RadicalCandorQuadrant, fromPosition?: DiagramPosition) {
    setDragging({ type: 'quadrant-label', label, fromPosition })
    setPhase1Result(null)
  }

  function handleDropOnDiagramZone(position: DiagramPosition) {
    if (!dragging || dragging.type !== 'quadrant-label') return
    const label = dragging.label
    const fromPosition = dragging.fromPosition
    setDiagramZones(prev => {
      const next = { ...prev }
      if (fromPosition) next[fromPosition] = null
      next[position] = label
      return next
    })
    setDragging(null)
  }

  function handleDropOnDiagramPalette() {
    if (!dragging || dragging.type !== 'quadrant-label' || !dragging.fromPosition) { setDragging(null); return }
    const fromPosition = dragging.fromPosition
    setDiagramZones(prev => ({ ...prev, [fromPosition]: null }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const pos of DIAGRAM_POSITIONS) {
      result[pos] = diagramZones[pos] === DIAGRAM_ANSWERS[pos]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setDiagramZones({ ...EMPTY_DIAGRAM })
    setPhase1Result(null)
  }

  // Phase 2 helpers
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleSituationDragStart(situationId: string, fromZone?: RadicalCandorExtendedZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnColumn(zone: RadicalCandorExtendedZone) {
    if (!dragging || dragging.type !== 'situation') return
    const id = dragging.situationId
    setSituationZones(prev => ({ ...prev, [id]: zone }))
    setDragging(null)
  }

  function handleDropOnPool() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromZone) { setDragging(null); return }
    const id = dragging.situationId
    setSituationZones(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      result[s.id] = situationZones[s.id] === s.correctZone
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setSituationZones({})
    setPhase2Result(null)
  }

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'radical-candor')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Radical Candor</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Placez les 4 postures Radical Candor sur le diagramme Care Personally / Challenge Directly.'
              : 'Phase 2 / 2 — Associez chaque situation à la posture de feedback appropriée.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="rc-diagram">
              <div className="rc-diagram__top-label">Care Personally ↑</div>
              <div className="rc-diagram__container">
                <svg
                  className="rc-diagram__axes"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <marker id="rc-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="var(--color-border)" />
                    </marker>
                    <marker id="rc-arr-u" markerWidth="6" markerHeight="6" refX="3" refY="1" orient="auto">
                      <path d="M0,6 L6,6 L3,0 z" fill="var(--color-border)" />
                    </marker>
                  </defs>
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#rc-arr-r)" />
                  <line x1="50%" y1="100%" x2="50%" y2="0" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#rc-arr-u)" />
                </svg>
                <div className="rc-diagram__zones">
                  {DIAGRAM_POSITIONS.map(pos => {
                    const placed = diagramZones[pos]
                    const quadrant = placed ? QUADRANTS.find(q => q.id === placed) : null
                    const verified = phase1Result !== null
                    const correct = phase1Result?.[pos]
                    return (
                      <div
                        key={pos}
                        data-zone={pos}
                        className={
                          'tki-zone' +
                          (placed ? ' tki-zone--filled' : '') +
                          (verified ? (correct ? ' tki-zone--correct' : ' tki-zone--wrong') : '')
                        }
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('tki-zone--hover') }}
                        onDragLeave={e => e.currentTarget.classList.remove('tki-zone--hover')}
                        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('tki-zone--hover'); handleDropOnDiagramZone(pos) }}
                      >
                        {quadrant ? (
                          <span
                            data-label={quadrant.id}
                            className="scrum-label scrum-label--placed"
                            draggable
                            onDragStart={() => handleLabelDragStart(quadrant.id, pos)}
                          >
                            {quadrant.label}
                          </span>
                        ) : (
                          <span className="scrum-zone__placeholder">?</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="rc-diagram__right-label">Challenge Directly →</div>
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / 4 correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
              </div>
            )}

            <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnDiagramPalette}>
              <p className="scrum-palette__title">Postures à placer</p>
              <div className="scrum-palette__labels">
                {paletteLabels.map(q => (
                  <span
                    key={q.id}
                    data-label={q.id}
                    className="scrum-label"
                    draggable
                    onDragStart={() => handleLabelDragStart(q.id)}
                  >
                    {q.label}
                  </span>
                ))}
                {paletteLabels.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les postures ont été placées</span>
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
              {EXTENDED_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnColumn(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {SITUATIONS.filter(s => situationZones[s.id] === zone.id).map(s => {
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, zone.id)}
                        >
                          <strong>{s.situation}</strong>
                          <br />
                          <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>{s.context}</em>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase2Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / 15 correct{phase2Score === 15 ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Score === 15
                    ? "Tu sais reconnaître et distinguer franchise utile, fausse gentillesse, agressivité et insincérité."
                    : "À consolider : certaines postures se ressemblent, mais l'équilibre entre attention personnelle et défi direct doit être mieux distingué."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnPool}
            >
              <p className="scrum-palette__title">Situations à classer</p>
              <div className="tki-pool__cards">
                {poolSituations.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleSituationDragStart(s.id)}
                  >
                    <strong>{s.situation}</strong>
                    <br />
                    <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>{s.context}</em>
                  </div>
                ))}
                {poolSituations.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllPlaced}>
                Vérifier
              </button>
              {phase2Result && phase2Score !== 15 && (
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
