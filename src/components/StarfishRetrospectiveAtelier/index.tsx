import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type StarfishZone = 'more-of' | 'less-of' | 'start' | 'stop' | 'keep'
type StarfishZones = Record<StarfishZone, string[]>
type SituationZones = Record<string, StarfishZone>
type DraggingItem =
  | { type: 'starfish-card'; cardId: string; fromZone?: StarfishZone }
  | { type: 'situation'; situationId: string; fromZone?: StarfishZone }
  | null

const ZONE_IDS: StarfishZone[] = ['more-of', 'less-of', 'start', 'stop', 'keep']

const ZONES_DEF: { id: StarfishZone; label: string; description: string }[] = [
  { id: 'more-of', label: 'More of', description: 'Ce qui fonctionne déjà et devrait être fait davantage.' },
  { id: 'less-of', label: 'Less of', description: 'Ce qui peut rester utile, mais doit être réduit ou allégé.' },
  { id: 'start',   label: 'Start',   description: "Ce que l'équipe devrait commencer à tester ou mettre en place." },
  { id: 'stop',    label: 'Stop',    description: "Ce qui nuit clairement à l'équipe et devrait être arrêté." },
  { id: 'keep',    label: 'Keep',    description: 'Ce qui fonctionne bien et doit être conservé.' },
]

const SCENE_ZONES: { id: StarfishZone; icon: string; label: string; desc: string }[] = [
  { id: 'more-of', icon: '📈', label: 'More of', desc: 'Ce qui fonctionne et devrait être amplifié' },
  { id: 'less-of', icon: '📉', label: 'Less of', desc: 'Utile, mais trop présent — à réduire' },
  { id: 'start',   icon: '🚀', label: 'Start',   desc: "Ce que l'équipe devrait commencer à faire" },
  { id: 'stop',    icon: '🛑', label: 'Stop',    desc: "Ce qui nuit à l'équipe — à arrêter" },
  { id: 'keep',    icon: '✅', label: 'Keep',    desc: 'Ce qui fonctionne bien — à conserver' },
]

type StarfishCard = { id: string; text: string; correctZone: StarfishZone }
type Situation = { id: string; situation: string; correctZone: StarfishZone }

const PHASE1_CARDS: StarfishCard[] = [
  { id: 'p1c1',  text: 'Faire davantage de pair programming sur les sujets complexes.',                       correctZone: 'more-of' },
  { id: 'p1c2',  text: 'Multiplier les échanges courts entre PO et développeurs pendant le Sprint.',          correctZone: 'more-of' },
  { id: 'p1c3',  text: "Partager plus souvent les apprentissages issus des incidents.",                       correctZone: 'more-of' },
  { id: 'p1c4',  text: 'Réduire le nombre de réunions sans objectif clair.',                                  correctZone: 'less-of' },
  { id: 'p1c5',  text: 'Limiter les changements de priorité en cours de Sprint.',                             correctZone: 'less-of' },
  { id: 'p1c6',  text: 'Faire moins de discussions longues sans décision explicite.',                          correctZone: 'less-of' },
  { id: 'p1c7',  text: "Commencer à préparer les critères d'acceptation avant le Sprint Planning.",           correctZone: 'start' },
  { id: 'p1c8',  text: 'Mettre en place une revue rapide des dépendances avant chaque Sprint.',               correctZone: 'start' },
  { id: 'p1c9',  text: 'Tester un point hebdomadaire sur les risques de release.',                            correctZone: 'start' },
  { id: 'p1c10', text: "Arrêter de démarrer de nouvelles User Stories alors que trop de sujets sont déjà en cours.", correctZone: 'stop' },
  { id: 'p1c11', text: "Arrêter de valider des stories sans vérifier la Definition of Done.",                 correctZone: 'stop' },
  { id: 'p1c12', text: 'Arrêter de repousser les sujets de dette technique à chaque Sprint.',                 correctZone: 'stop' },
  { id: 'p1c13', text: "Conserver les démonstrations courtes et centrées sur la valeur utilisateur.",         correctZone: 'keep' },
  { id: 'p1c14', text: 'Garder les rétrospectives orientées actions concrètes.',                              correctZone: 'keep' },
  { id: 'p1c15', text: 'Maintenir les revues de code systématiques avant intégration.',                       correctZone: 'keep' },
]

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "Les ateliers de refinement avec exemples concrets ont fortement amélioré la compréhension des User Stories.",  correctZone: 'more-of' },
  { id: 's2',  situation: "Les binômes ponctuels ont permis de résoudre plus vite les sujets techniques difficiles.",                     correctZone: 'more-of' },
  { id: 's3',  situation: "Les échanges informels avec les utilisateurs ont apporté des retours très utiles.",                             correctZone: 'more-of' },
  { id: 's4',  situation: "Les réunions d'alignement sont parfois utiles, mais elles deviennent trop nombreuses.",                        correctZone: 'less-of' },
  { id: 's5',  situation: "Les discussions techniques sont nécessaires, mais elles prennent souvent toute la rétrospective.",              correctZone: 'less-of' },
  { id: 's6',  situation: "Les ajustements de priorité sont parfois justifiés, mais leur fréquence perturbe le Sprint.",                  correctZone: 'less-of' },
  { id: 's7',  situation: "L'équipe découvre trop tard certaines dépendances avec d'autres équipes.",                                     correctZone: 'start' },
  { id: 's8',  situation: "Les critères d'acceptation sont souvent clarifiés seulement après le démarrage du développement.",             correctZone: 'start' },
  { id: 's9',  situation: "Les actions de rétrospective sont oubliées après quelques jours.",                                             correctZone: 'start' },
  { id: 's10', situation: "L'équipe commence régulièrement de nouvelles tâches alors que plusieurs items sont presque terminés.",          correctZone: 'stop' },
  { id: 's11', situation: "Des anomalies connues sont ignorées pour afficher artificiellement une story comme terminée.",                  correctZone: 'stop' },
  { id: 's12', situation: "Les décisions prises en réunion sont remises en cause hors réunion sans transparence.",                        correctZone: 'stop' },
  { id: 's13', situation: "La Sprint Review est courte, concrète et centrée sur les retours utilisateurs.",                               correctZone: 'keep' },
  { id: 's14', situation: "Le Daily Scrum reste focalisé sur l'objectif de Sprint plutôt que sur un reporting individuel.",                correctZone: 'keep' },
  { id: 's15', situation: "L'équipe prend le temps de célébrer les apprentissages importants, même quand tout n'a pas fonctionné.",        correctZone: 'keep' },
]

const EMPTY_ZONES: StarfishZones = { 'more-of': [], 'less-of': [], start: [], stop: [], keep: [] }

export function StarfishRetrospectiveAtelier() {
  const { markComplete } = useWorkshopCompletion('starfish')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [starfishZones, setStarfishZones] = useState<StarfishZones>({ ...EMPTY_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Derived state — Phase 1
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => starfishZones[z]))
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
  function handleCardDragStart(cardId: string, fromZone?: StarfishZone) {
    setDragging({ type: 'starfish-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnZone(targetZone: StarfishZone) {
    if (!dragging || dragging.type !== 'starfish-card') return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setStarfishZones(prev => {
      const next = { ...prev }
      if (fromZone) next[fromZone] = next[fromZone].filter(id => id !== cardId)
      if (!next[targetZone].includes(cardId)) next[targetZone] = [...next[targetZone], cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'starfish-card' || !dragging.fromZone) return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setStarfishZones(prev => ({ ...prev, [fromZone]: prev[fromZone].filter(id => id !== cardId) }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const card of PHASE1_CARDS) {
      result[card.id] = starfishZones[card.correctZone].includes(card.id)
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setStarfishZones({ ...EMPTY_ZONES })
    setPhase1Result(null)
  }

  // Phase 2 handlers
  function handleSituationDragStart(situationId: string, fromZone?: StarfishZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnColumn(targetZone: StarfishZone) {
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

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'starfish')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Rétrospective Starfish</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez chaque carte dans la bonne zone : More of, Less of, Start, Stop ou Keep.'
              : 'Phase 2 / 2 — Associez chaque situation à la bonne dimension Starfish.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="sf-scene">
              {SCENE_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className={`sf-zone sf-zone--${zone.id}`}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('sf-zone--hover') }}
                  onDragLeave={e => e.currentTarget.classList.remove('sf-zone--hover')}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('sf-zone--hover'); handleDropOnZone(zone.id) }}
                >
                  <div className="sf-zone__header">
                    <span>{zone.icon}</span>{zone.label}
                  </div>
                  <p className="sf-zone__desc">{zone.desc}</p>
                  <div className="sf-zone__cards">
                    {starfishZones[zone.id].map(cardId => {
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
              <div className="sf-starfish-center" aria-hidden="true">
                <img src="/etoile_mer.svg" alt="" className="sf-starfish-img" />
              </div>
            </div>

            {phase1Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / {PHASE1_CARDS.length} correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais distinguer les 5 dimensions Starfish : More of, Less of, Start, Stop et Keep.
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
                    ? "Tu sais utiliser Starfish pour transformer une rétrospective en décisions d'amélioration plus précises."
                    : "À consolider : certaines dimensions sont proches, mais il faut mieux distinguer réduire, arrêter, amplifier et conserver."}
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
