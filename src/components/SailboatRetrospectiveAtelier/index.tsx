import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type SailboatZone = 'wind' | 'anchor' | 'rocks' | 'island' | 'sun'
type SailboatZones = Record<SailboatZone, string[]>
type SituationZones = Record<string, SailboatZone>
type DraggingItem =
  | { type: 'sailboat-card'; cardId: string; fromZone?: SailboatZone }
  | { type: 'situation'; situationId: string; fromZone?: SailboatZone }
  | null

const ZONE_IDS: SailboatZone[] = ['wind', 'anchor', 'rocks', 'island', 'sun']

const ZONES_DEF: { id: SailboatZone; label: string; description: string }[] = [
  { id: 'wind',   label: 'Vent',            description: "Ce qui pousse l'équipe vers l'avant : forces, pratiques utiles, facteurs d'accélération." },
  { id: 'anchor', label: 'Ancre',           description: "Ce qui ralentit l'équipe aujourd'hui : blocages, irritants, dépendances ou lourdeurs." },
  { id: 'rocks',  label: 'Récif / rochers', description: "Ce qui pourrait mettre l'équipe en difficulté : risques, menaces ou obstacles à venir." },
  { id: 'island', label: 'Île',             description: "La destination : objectif, résultat attendu ou amélioration visée." },
  { id: 'sun',    label: 'Soleil',          description: "Ce qui donne de l'énergie : motivation, satisfaction, fierté ou signaux positifs." },
]

const SCENE_ZONES: { id: SailboatZone; icon: string; label: string; desc: string }[] = [
  { id: 'wind',   icon: '💨', label: 'Vent',            desc: "Ce qui pousse l'équipe vers l'avant" },
  { id: 'sun',    icon: '☀️', label: 'Soleil',          desc: "Ce qui donne de l'énergie" },
  { id: 'island', icon: '🏝️', label: 'Île',             desc: "La destination, l'objectif visé" },
  { id: 'anchor', icon: '⚓', label: 'Ancre',           desc: "Ce qui ralentit l'équipe" },
  { id: 'rocks',  icon: '🪨', label: 'Récif / rochers', desc: "Risques et obstacles à venir" },
]

type SailboatCard = { id: string; text: string; correctZone: SailboatZone }
type Situation = { id: string; situation: string; correctZone: SailboatZone }

const PHASE1_CARDS: SailboatCard[] = [
  { id: 'p1c1',  text: "La collaboration entre développeurs et Product Owner s'est améliorée.",             correctZone: 'wind' },
  { id: 'p1c2',  text: "Les revues de code sont plus régulières et plus utiles.",                           correctZone: 'wind' },
  { id: 'p1c3',  text: "L'équipe utilise mieux le refinement pour clarifier les User Stories.",             correctZone: 'wind' },
  { id: 'p1c4',  text: "Les dépendances externes ralentissent régulièrement le Sprint.",                    correctZone: 'anchor' },
  { id: 'p1c5',  text: "Les interruptions quotidiennes empêchent l'équipe de se concentrer.",               correctZone: 'anchor' },
  { id: 'p1c6',  text: "Certaines décisions restent bloquées trop longtemps.",                              correctZone: 'anchor' },
  { id: 'p1c7',  text: "Une dépendance critique avec une autre équipe pourrait bloquer la release.",        correctZone: 'rocks' },
  { id: 'p1c8',  text: "La dette technique augmente sur un composant sensible.",                            correctZone: 'rocks' },
  { id: 'p1c9',  text: "Livrer un incrément stable et démontrable à la prochaine Sprint Review.",           correctZone: 'island' },
  { id: 'p1c10', text: "Réduire le délai de traitement des demandes utilisateurs.",                         correctZone: 'island' },
  { id: 'p1c11', text: "L'équipe est fière d'avoir résolu un incident complexe ensemble.",                  correctZone: 'sun' },
  { id: 'p1c12', text: "Les utilisateurs ont donné un retour positif sur la dernière livraison.",           correctZone: 'sun' },
]

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "Depuis deux Sprints, l'équipe découpe mieux les User Stories et termine plus régulièrement ce qu'elle démarre.",     correctZone: 'wind' },
  { id: 's2',  situation: "Le Product Owner est plus disponible pendant le Sprint, ce qui réduit les temps d'attente.",                        correctZone: 'wind' },
  { id: 's3',  situation: "Les développeurs commencent à s'entraider spontanément sur les sujets complexes.",                                  correctZone: 'wind' },
  { id: 's4',  situation: "L'équipe perd beaucoup de temps à attendre des validations externes.",                                               correctZone: 'anchor' },
  { id: 's5',  situation: "Les changements de priorité en cours de Sprint créent de la confusion.",                                             correctZone: 'anchor' },
  { id: 's6',  situation: "Les environnements de test sont instables et ralentissent les validations.",                                         correctZone: 'anchor' },
  { id: 's7',  situation: "Une mise en production importante approche, mais la stratégie de rollback n'est pas claire.",                        correctZone: 'rocks' },
  { id: 's8',  situation: "Un expert clé part en congés pendant une période critique.",                                                         correctZone: 'rocks' },
  { id: 's9',  situation: "Une dette technique connue pourrait rendre la prochaine évolution très coûteuse.",                                   correctZone: 'rocks' },
  { id: 's10', situation: "L'équipe veut que le prochain Sprint permette de livrer une version utilisable par un groupe pilote.",                correctZone: 'island' },
  { id: 's11', situation: "Le Product Owner souhaite réduire le temps de traitement d'une demande client de 5 jours à 2 jours.",                correctZone: 'island' },
  { id: 's12', situation: "L'équipe se donne comme objectif de stabiliser le parcours d'inscription avant la prochaine démonstration.",         correctZone: 'island' },
  { id: 's13', situation: "L'équipe se sent plus confiante depuis que les démonstrations se passent mieux.",                                    correctZone: 'sun' },
  { id: 's14', situation: "Un retour utilisateur positif a renforcé la motivation de l'équipe.",                                                correctZone: 'sun' },
  { id: 's15', situation: "La résolution collective d'un incident a créé un vrai sentiment de fierté.",                                         correctZone: 'sun' },
]

const EMPTY_ZONES: SailboatZones = { wind: [], anchor: [], rocks: [], island: [], sun: [] }

export function SailboatRetrospectiveAtelier() {
  const { markComplete } = useWorkshopCompletion('sailboat')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [sailboatZones, setSailboatZones] = useState<SailboatZones>({ ...EMPTY_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Derived state — Phase 1
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => sailboatZones[z]))
  const poolCards = PHASE1_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = poolCards.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : 0
  const phase1Perfect = phase1Score === PHASE1_CARDS.length

  // Derived state — Phase 2
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : 0

  const isDirty = phase === 1 ? placedCardIds.size > 0 : Object.keys(situationZones).length > 0
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 handlers
  function handleCardDragStart(cardId: string, fromZone?: SailboatZone) {
    setDragging({ type: 'sailboat-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnZone(targetZone: SailboatZone) {
    if (!dragging || dragging.type !== 'sailboat-card') return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setSailboatZones(prev => {
      const next = { ...prev }
      if (fromZone) next[fromZone] = next[fromZone].filter(id => id !== cardId)
      if (!next[targetZone].includes(cardId)) next[targetZone] = [...next[targetZone], cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'sailboat-card' || !dragging.fromZone) return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setSailboatZones(prev => ({ ...prev, [fromZone]: prev[fromZone].filter(id => id !== cardId) }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const card of PHASE1_CARDS) {
      result[card.id] = sailboatZones[card.correctZone].includes(card.id)
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setSailboatZones({ ...EMPTY_ZONES })
    setPhase1Result(null)
  }

  // Phase 2 handlers
  function handleSituationDragStart(situationId: string, fromZone?: SailboatZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnColumn(targetZone: SailboatZone) {
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

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'sailboat')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Rétrospective Voilier</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez chaque carte dans la bonne zone du voilier : Vent, Ancre, Récif, Île ou Soleil.'
              : 'Phase 2 / 2 — Associez chaque situation à la zone du voilier qui lui correspond.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="sb-scene">
              {SCENE_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className={`sb-zone sb-zone--${zone.id}`}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('sb-zone--hover') }}
                  onDragLeave={e => e.currentTarget.classList.remove('sb-zone--hover')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('sb-zone--hover'); handleDropOnZone(zone.id) }}
                >
                  <div className="sb-zone__header">
                    <span>{zone.icon}</span>{zone.label}
                  </div>
                  <p className="sb-zone__desc">{zone.desc}</p>
                  <div className="sb-zone__cards">
                    {sailboatZones[zone.id].map(cardId => {
                      const card = PHASE1_CARDS.find(c => c.id === cardId)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[cardId] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
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
              <div className="sb-boat-area" aria-hidden="true">
                <span className="sb-boat-emoji">⛵</span>
              </div>
            </div>

            {phase1Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / {PHASE1_CARDS.length} correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais distinguer les zones principales du voilier : moteurs, freins, risques, objectif et énergie positive.
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
                    className="tki-situation-card"
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
            <div className="tki-columns">
              {ZONES_DEF.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="tki-column"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('tki-column--hover') }}
                  onDragLeave={e => e.currentTarget.classList.remove('tki-column--hover')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('tki-column--hover'); handleDropOnColumn(zone.id) }}
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
                <span className={`badge ${phase2Score === SITUATIONS.length ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / {SITUATIONS.length} correct{phase2Score === SITUATIONS.length ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Score === SITUATIONS.length
                    ? "Tu sais utiliser le modèle pour diagnostiquer une situation d'équipe et structurer une rétrospective actionnable."
                    : "À consolider : certaines cartes sont proches, mais il faut mieux distinguer freins actuels, risques futurs, objectifs et sources d'énergie."}
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
                    className="tki-situation-card"
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
              {phase2Result && phase2Score !== SITUATIONS.length && (
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
