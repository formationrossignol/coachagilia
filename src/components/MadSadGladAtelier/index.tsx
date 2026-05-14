import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type MadSadGladZone = 'mad' | 'sad' | 'glad'
type EmotionZones = Record<MadSadGladZone, string[]>
type SituationZones = Record<string, MadSadGladZone>
type DraggingItem =
  | { type: 'emotion-card'; cardId: string; fromZone?: MadSadGladZone }
  | { type: 'situation'; situationId: string; fromZone?: MadSadGladZone }
  | null

const ZONE_IDS: MadSadGladZone[] = ['mad', 'sad', 'glad']

const ZONES_DEF: { id: MadSadGladZone; label: string; description: string }[] = [
  { id: 'mad',  label: 'Mad',  description: 'Colère, irritation, injustice, tension ou frustration forte.' },
  { id: 'sad',  label: 'Sad',  description: "Déception, regret, perte d'énergie, tristesse ou démotivation." },
  { id: 'glad', label: 'Glad', description: 'Satisfaction, fierté, gratitude, confiance ou motivation.' },
]

const COLUMN_DEF: { id: MadSadGladZone; icon: string; label: string; color: string; desc: string }[] = [
  { id: 'mad',  icon: '😠', label: 'Mad',  color: '#ef4444', desc: 'Colère, irritation, injustice, tension ou frustration forte.' },
  { id: 'sad',  icon: '😢', label: 'Sad',  color: '#3b82f6', desc: "Déception, regret, perte d'énergie, tristesse ou démotivation." },
  { id: 'glad', icon: '😊', label: 'Glad', color: '#22c55e', desc: 'Satisfaction, fierté, gratitude, confiance ou motivation.' },
]

type EmotionCard = { id: string; text: string; correctZone: MadSadGladZone }
type Situation = { id: string; situation: string; correctZone: MadSadGladZone }

const PHASE1_CARDS: EmotionCard[] = [
  { id: 'mad-1', text: "J'ai été agacé par les changements de priorité en plein Sprint.",                                                correctZone: 'mad' },
  { id: 'mad-2', text: "J'ai trouvé injuste qu'on nous reproche un retard causé par une dépendance externe.",                           correctZone: 'mad' },
  { id: 'mad-3', text: "Je me suis senti frustré par les décisions prises sans consulter l'équipe.",                                    correctZone: 'mad' },
  { id: 'mad-4', text: "J'ai été énervé par les interruptions répétées pendant les phases de concentration.",                           correctZone: 'mad' },
  { id: 'sad-1', text: "J'ai été déçu de ne pas réussir à terminer la User Story principale.",                                          correctZone: 'sad' },
  { id: 'sad-2', text: "J'ai ressenti une perte d'énergie après plusieurs réunions sans décision.",                                     correctZone: 'sad' },
  { id: 'sad-3', text: "Je regrette qu'on n'ait pas mieux aidé le nouveau membre de l'équipe.",                                        correctZone: 'sad' },
  { id: 'sad-4', text: "J'ai été démotivé par le manque de retour utilisateur sur notre travail.",                                      correctZone: 'sad' },
  { id: 'glad-1', text: "J'ai été fier de voir l'équipe résoudre ensemble l'incident de production.",                                  correctZone: 'glad' },
  { id: 'glad-2', text: "J'ai apprécié la disponibilité du Product Owner pendant le Sprint.",                                           correctZone: 'glad' },
  { id: 'glad-3', text: "J'ai été content que la démonstration se passe mieux que prévu.",                                             correctZone: 'glad' },
  { id: 'glad-4', text: "J'ai ressenti de la satisfaction quand l'équipe a terminé moins de choses, mais mieux.",                      correctZone: 'glad' },
]

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "Une User Story est ajoutée en urgence au milieu du Sprint sans discussion avec l'équipe.",                                       correctZone: 'mad' },
  { id: 's2',  situation: "L'équipe reçoit un reproche sur une livraison bloquée par une dépendance qu'elle avait signalée depuis deux semaines.",          correctZone: 'mad' },
  { id: 's3',  situation: "Une décision technique est imposée en dehors de l'équipe, sans explication claire.",                                             correctZone: 'mad' },
  { id: 's4',  situation: "Plusieurs interruptions externes empêchent l'équipe de terminer les items engagés.",                                             correctZone: 'mad' },
  { id: 's5',  situation: "Un membre de l'équipe coupe régulièrement la parole pendant les échanges.",                                                      correctZone: 'mad' },
  { id: 's6',  situation: "L'équipe n'a pas réussi à atteindre le Sprint Goal malgré un effort important.",                                                correctZone: 'sad' },
  { id: 's7',  situation: "Un nouveau membre est resté isolé pendant le Sprint, faute d'accompagnement suffisant.",                                         correctZone: 'sad' },
  { id: 's8',  situation: "La Sprint Review attire peu de participants et génère peu de retours.",                                                           correctZone: 'sad' },
  { id: 's9',  situation: "Une amélioration décidée en rétrospective précédente n'a pas été suivie.",                                                      correctZone: 'sad' },
  { id: 's10', situation: "L'équipe constate que la dette technique augmente encore, sans temps dédié pour la traiter.",                                    correctZone: 'sad' },
  { id: 's11', situation: "Le Product Owner a clarifié rapidement plusieurs ambiguïtés pendant le Sprint.",                                                  correctZone: 'glad' },
  { id: 's12', situation: "Deux développeurs ont spontanément travaillé ensemble pour débloquer une anomalie complexe.",                                     correctZone: 'glad' },
  { id: 's13', situation: "La démonstration a reçu un retour utilisateur très positif.",                                                                     correctZone: 'glad' },
  { id: 's14', situation: "L'équipe a osé réduire le périmètre pour préserver la qualité.",                                                                 correctZone: 'glad' },
  { id: 's15', situation: "Un incident a été traité collectivement, sans recherche de coupable.",                                                            correctZone: 'glad' },
]

const EMPTY_ZONES: EmotionZones = { mad: [], sad: [], glad: [] }

export function MadSadGladAtelier() {
  const { markComplete } = useWorkshopCompletion('mad-sad-glad')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [emotionZones, setEmotionZones] = useState<EmotionZones>({ ...EMPTY_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Derived state — Phase 1
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => emotionZones[z]))
  const poolCards = PHASE1_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = poolCards.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : 0
  const phase1Perfect = phase1Score === PHASE1_CARDS.length

  // Derived state — Phase 2
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : 0
  const phase2Perfect = phase2Score === SITUATIONS.length

  const isDirty = phase === 1 ? placedCardIds.size > 0 : Object.keys(situationZones).length > 0
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 handlers
  function handleCardDragStart(cardId: string, fromZone?: MadSadGladZone) {
    setDragging({ type: 'emotion-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnZone(targetZone: MadSadGladZone) {
    if (!dragging || dragging.type !== 'emotion-card') return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setEmotionZones(prev => {
      const next = { ...prev }
      if (fromZone) next[fromZone] = next[fromZone].filter(id => id !== cardId)
      if (!next[targetZone].includes(cardId)) next[targetZone] = [...next[targetZone], cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'emotion-card' || !dragging.fromZone) return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setEmotionZones(prev => ({ ...prev, [fromZone]: prev[fromZone].filter(id => id !== cardId) }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const card of PHASE1_CARDS) {
      result[card.id] = emotionZones[card.correctZone].includes(card.id)
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setEmotionZones({ ...EMPTY_ZONES })
    setPhase1Result(null)
  }

  // Phase 2 handlers
  function handleSituationDragStart(situationId: string, fromZone?: MadSadGladZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnColumn(targetZone: MadSadGladZone) {
    if (!dragging || dragging.type !== 'situation') return
    const situationId = dragging.situationId
    setSituationZones(prev => ({ ...prev, [situationId]: targetZone }))
    setDragging(null)
  }

  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromZone) return
    const situationId = dragging.situationId
    setSituationZones(prev => {
      const next = { ...prev }
      delete next[situationId]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      result[s.id] = situationZones[s.id] === s.correctZone
    }
    setPhase2Result(result)
    if (SITUATIONS.every(s => situationZones[s.id] === s.correctZone)) markComplete()
  }

  function handleResetPhase2() {
    setSituationZones({})
    setPhase2Result(null)
  }

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'mad-sad-glad')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Mad / Sad / Glad</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez chaque émotion dans le bon registre : Mad, Sad ou Glad.'
              : 'Phase 2 / 2 — Associez chaque situation de Sprint à l\'émotion qu\'elle génère dans l\'équipe.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="msg-columns">
              {COLUMN_DEF.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="msg-column"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('msg-column--hover') }}
                  onDragLeave={e => e.currentTarget.classList.remove('msg-column--hover')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('msg-column--hover'); handleDropOnZone(zone.id) }}
                >
                  <div className="msg-column-header" style={{ borderColor: zone.color }}>
                    <span className="msg-column-icon">{zone.icon}</span>
                    <span className="msg-column-label" style={{ color: zone.color }}>{zone.label}</span>
                  </div>
                  <p className="msg-column-desc">{zone.desc}</p>
                  <div className="msg-column-cards">
                    {emotionZones[zone.id].map(cardId => {
                      const card = PHASE1_CARDS.find(c => c.id === cardId)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[cardId] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ' tki-situation-card--default'
                      return (
                        <div
                          key={cardId}
                          data-card={cardId}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleCardDragStart(cardId, zone.id)}
                        >
                          {card.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase1Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / {PHASE1_CARDS.length} correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais distinguer les trois registres émotionnels : Mad, Sad et Glad.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnPool1}
            >
              <p className="scrum-palette__title">Cartes à classer</p>
              <div className="tki-pool__cards">
                {poolCards.map(card => (
                  <div
                    key={card.id}
                    data-card={card.id}
                    className="tki-situation-card tki-situation-card--default"
                    draggable
                    onDragStart={() => handleCardDragStart(card.id)}
                  >
                    {card.text}
                  </div>
                ))}
                {poolCards.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les cartes ont été placées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllPlaced}>
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
            <div className="msg-columns">
              {ZONES_DEF.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="msg-column"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('msg-column--hover') }}
                  onDragLeave={e => e.currentTarget.classList.remove('msg-column--hover')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('msg-column--hover'); handleDropOnColumn(zone.id) }}
                >
                  {COLUMN_DEF.filter(c => c.id === zone.id).map(col => (
                    <div key={col.id} className="msg-column-header" style={{ borderColor: col.color }}>
                      <span className="msg-column-icon">{col.icon}</span>
                      <span className="msg-column-label" style={{ color: col.color }}>{col.label}</span>
                    </div>
                  ))}
                  <p className="msg-column-desc">{zone.description}</p>
                  <div className="msg-column-cards">
                    {SITUATIONS.filter(s => situationZones[s.id] === zone.id).map(s => {
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ' tki-situation-card--default'
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, zone.id)}
                        >
                          {s.situation}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase2Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase2Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / {SITUATIONS.length} correct{phase2Perfect ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Perfect
                    ? 'Tu sais relier des situations concrètes de Sprint aux émotions qu\'elles peuvent générer dans l\'équipe.'
                    : "À consolider : certaines émotions sont proches, mais il faut mieux distinguer irritation, déception et satisfaction."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnPool2}
            >
              <p className="scrum-palette__title">Situations à classer</p>
              <div className="tki-pool__cards">
                {poolSituations.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className="tki-situation-card tki-situation-card--default"
                    draggable
                    onDragStart={() => handleSituationDragStart(s.id)}
                  >
                    {s.situation}
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
              {phase2Result && !phase2Perfect && (
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
