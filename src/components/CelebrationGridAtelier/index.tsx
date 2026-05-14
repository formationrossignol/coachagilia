import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type CelebrationGridZone =
  | 'mistake-success'
  | 'mistake-failure'
  | 'experiment-success'
  | 'experiment-failure'
  | 'practice-success'
  | 'practice-failure'

type GridZones = Record<CelebrationGridZone, string[]>
type SituationZones = Record<string, CelebrationGridZone>

type DraggingItem =
  | { type: 'grid-card'; cardId: string; fromZone?: CelebrationGridZone }
  | { type: 'situation'; situationId: string; fromZone?: CelebrationGridZone }
  | null

const ZONE_IDS: CelebrationGridZone[] = [
  'mistake-success', 'mistake-failure',
  'experiment-success', 'experiment-failure',
  'practice-success', 'practice-failure',
]

const ZONE_DEFS: {
  id: CelebrationGridZone
  label: string
  color: string
  bg: string
}[] = [
  { id: 'mistake-success',    label: 'Erreur + succès',          color: '#64748b', bg: '#f1f5f9' },
  { id: 'mistake-failure',    label: 'Erreur + échec',           color: '#dc2626', bg: '#fee2e2' },
  { id: 'experiment-success', label: 'Expérimentation + succès', color: '#0d9488', bg: '#ccfbf1' },
  { id: 'experiment-failure', label: 'Expérimentation + échec',  color: '#0d9488', bg: '#d1fae5' },
  { id: 'practice-success',   label: 'Pratique + succès',        color: '#16a34a', bg: '#dcfce7' },
  { id: 'practice-failure',   label: 'Pratique + échec',         color: '#64748b', bg: '#f1f5f9' },
]

const ZONE_DEF_MAP = Object.fromEntries(ZONE_DEFS.map(z => [z.id, z])) as Record<CelebrationGridZone, typeof ZONE_DEFS[0]>

type GridCard = { id: string; text: string; correctZone: CelebrationGridZone }
type Situation = { id: string; situation: string; correctZone: CelebrationGridZone }

const PHASE1_CARDS: GridCard[] = [
  { id: 'mistake-success-1',    text: "L'équipe a livré sans tests de régression complets, mais aucun incident n'a été détecté.",                                                correctZone: 'mistake-success' },
  { id: 'mistake-success-2',    text: "Une dépendance critique n'a pas été suivie, mais l'équipe externe a livré juste à temps.",                                              correctZone: 'mistake-success' },
  { id: 'mistake-failure-1',    text: "Une User Story est passée en Done sans vérifier les critères d'acceptation, puis a été rejetée en Sprint Review.",                      correctZone: 'mistake-failure' },
  { id: 'mistake-failure-2',    text: "Une anomalie connue a été ignorée pour tenir la date, puis a bloqué la mise en production.",                                            correctZone: 'mistake-failure' },
  { id: 'experiment-success-1', text: "L'équipe a testé un refinement plus court avec exemples concrets, ce qui a amélioré la clarté des User Stories.",                      correctZone: 'experiment-success' },
  { id: 'experiment-success-2', text: "Un binômage temporaire sur les sujets complexes a réduit le temps de résolution.",                                                     correctZone: 'experiment-success' },
  { id: 'experiment-failure-1', text: "L'équipe a essayé de supprimer une réunion de synchronisation, mais plusieurs dépendances ont été découvertes trop tard.",             correctZone: 'experiment-failure' },
  { id: 'experiment-failure-2', text: "Une nouvelle organisation du Daily a été testée, mais elle n'a pas aidé l'équipe à mieux se coordonner.",                              correctZone: 'experiment-failure' },
  { id: 'practice-success-1',   text: "La Definition of Done a été respectée et la livraison s'est faite sans défaut majeur.",                                                correctZone: 'practice-success' },
  { id: 'practice-success-2',   text: "Les revues de code systématiques ont permis d'éviter plusieurs anomalies avant intégration.",                                          correctZone: 'practice-success' },
  { id: 'practice-failure-1',   text: "L'équipe a appliqué son processus de release habituel, mais un incident externe a empêché le déploiement.",                            correctZone: 'practice-failure' },
  { id: 'practice-failure-2',   text: "Le Sprint Planning a été bien préparé, mais une contrainte réglementaire nouvelle a rendu l'objectif impossible.",                     correctZone: 'practice-failure' },
]

const PHASE2_SITUATIONS: Situation[] = [
  { id: 'situation-1',  situation: "L'équipe a oublié de prévenir le support d'une mise en production, mais aucun ticket utilisateur n'est arrivé.",                          correctZone: 'mistake-success' },
  { id: 'situation-2',  situation: "Une story a été livrée sans clarification complète, mais l'utilisateur final a tout de même validé le résultat.",                         correctZone: 'mistake-success' },
  { id: 'situation-3',  situation: "L'équipe a démarré trois sujets en parallèle, puis aucun n'a été terminé à temps.",                                                       correctZone: 'mistake-failure' },
  { id: 'situation-4',  situation: "Une dépendance externe identifiée au planning n'a pas été suivie, puis a bloqué le Sprint Goal.",                                         correctZone: 'mistake-failure' },
  { id: 'situation-5',  situation: "Une anomalie critique a été reportée sans analyse d'impact, puis a provoqué un incident en production.",                                   correctZone: 'mistake-failure' },
  { id: 'situation-6',  situation: "L'équipe a testé une limite de WIP plus stricte et a terminé moins de sujets en parallèle mais plus d'items complètement.",              correctZone: 'experiment-success' },
  { id: 'situation-7',  situation: "Le Product Owner a expérimenté des User Stories plus petites, ce qui a amélioré la prévisibilité du Sprint.",                             correctZone: 'experiment-success' },
  { id: 'situation-8',  situation: "L'équipe a testé une démo intermédiaire avec un utilisateur clé, ce qui a permis d'ajuster le produit avant la Review.",                 correctZone: 'experiment-success' },
  { id: 'situation-9',  situation: "L'équipe a tenté un Daily asynchrone, mais les blocages sont devenus moins visibles.",                                                     correctZone: 'experiment-failure' },
  { id: 'situation-10', situation: "Une nouvelle règle de priorisation a été essayée, mais elle a créé plus de confusion qu'avant.",                                          correctZone: 'experiment-failure' },
  { id: 'situation-11', situation: "L'équipe a testé une estimation plus légère, mais certains sujets complexes ont été sous-évalués.",                                       correctZone: 'experiment-failure' },
  { id: 'situation-12', situation: "L'équipe a respecté sa Definition of Done, réalisé les tests attendus et livré un incrément stable.",                                     correctZone: 'practice-success' },
  { id: 'situation-13', situation: "Le refinement régulier a permis d'arriver au Sprint Planning avec des stories comprises et découpées.",                                   correctZone: 'practice-success' },
  { id: 'situation-14', situation: "L'équipe a bien préparé la release, mais une panne d'infrastructure externe a empêché la mise en production.",                            correctZone: 'practice-failure' },
  { id: 'situation-15', situation: "La stratégie de rollback était prête, mais une contrainte fournisseur imprévue a prolongé l'incident.",                                   correctZone: 'practice-failure' },
]

const EMPTY_GRID_ZONES: GridZones = {
  'mistake-success': [], 'mistake-failure': [],
  'experiment-success': [], 'experiment-failure': [],
  'practice-success': [], 'practice-failure': [],
}

const GRID_ROWS: { id: string; label: string; labelClass: string; zones: CelebrationGridZone[] }[] = [
  {
    id: 'success',
    label: 'Succès',
    labelClass: 'cg-row-label--success',
    zones: ['mistake-success', 'experiment-success', 'practice-success'],
  },
  {
    id: 'failure',
    label: 'Échec',
    labelClass: 'cg-row-label--failure',
    zones: ['mistake-failure', 'experiment-failure', 'practice-failure'],
  },
]

export function CelebrationGridAtelier() {
  const { markComplete } = useWorkshopCompletion('celebration-grid')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [gridZones, setGridZones] = useState<GridZones>({ ...EMPTY_GRID_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Derived — Phase 1
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => gridZones[z]))
  const poolCards = PHASE1_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = poolCards.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : 0
  const phase1Perfect = phase1Score === PHASE1_CARDS.length

  // Derived — Phase 2
  const poolSituations = PHASE2_SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : 0
  const phase2Perfect = phase2Score === PHASE2_SITUATIONS.length

  const isDirty = phase === 1 ? placedCardIds.size > 0 : Object.keys(situationZones).length > 0
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 handlers
  function handleCardDragStart(cardId: string, fromZone?: CelebrationGridZone) {
    setDragging({ type: 'grid-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnZone(targetZone: CelebrationGridZone) {
    if (!dragging || dragging.type !== 'grid-card') return
    const { cardId, fromZone } = dragging
    setGridZones(prev => {
      const next = { ...prev }
      if (fromZone) next[fromZone] = next[fromZone].filter(id => id !== cardId)
      if (!next[targetZone].includes(cardId)) next[targetZone] = [...next[targetZone], cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'grid-card' || !dragging.fromZone) return
    const cardId = dragging.cardId
    const fromZone = dragging.fromZone
    setGridZones(prev => ({ ...prev, [fromZone]: prev[fromZone].filter(id => id !== cardId) }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const card of PHASE1_CARDS) {
      result[card.id] = gridZones[card.correctZone].includes(card.id)
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setGridZones({ ...EMPTY_GRID_ZONES })
    setPhase1Result(null)
  }

  // Phase 2 handlers
  function handleSituationDragStart(situationId: string, fromZone?: CelebrationGridZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropSituationOnZone(targetZone: CelebrationGridZone) {
    if (!dragging || dragging.type !== 'situation') return
    const { situationId } = dragging
    setSituationZones(prev => ({ ...prev, [situationId]: targetZone }))
    setDragging(null)
  }

  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromZone) return
    const { situationId } = dragging
    setSituationZones(prev => {
      const next = { ...prev }
      delete next[situationId]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    const result: Record<string, boolean> = {}
    for (const s of PHASE2_SITUATIONS) {
      result[s.id] = situationZones[s.id] === s.correctZone
    }
    setPhase2Result(result)
    if (PHASE2_SITUATIONS.every(s => situationZones[s.id] === s.correctZone)) markComplete()
  }

  function handleResetPhase2() {
    setSituationZones({})
    setPhase2Result(null)
  }

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'celebration-grid')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Celebration Grid</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez chaque carte dans la bonne zone de la Celebration Grid.'
              : "Phase 2 / 2 — Associez chaque situation Scrum à la zone correspondante de la grille."}
          </p>
        </header>

        {/* ── PHASE 1 ── */}
        {phase === 1 && (
          <>
            <div className="cg-visual">
              <div className="cg-top">
                <div className="cg-axis-spacer" />
                <div className="cg-behavior-band">COMPORTEMENT</div>
              </div>

              <div className="cg-middle">
                <div className="cg-outcome-axis"><span>RÉSULTAT</span></div>
                <div className="cg-matrix">
                  <div className="cg-matrix-row cg-matrix-row--headers">
                    <div className="cg-row-spacer" />
                    <div className="cg-col-header cg-col-header--mistake">Erreurs</div>
                    <div className="cg-col-header cg-col-header--experiment">Expérimentations</div>
                    <div className="cg-col-header cg-col-header--practice">Pratiques</div>
                  </div>

                  {GRID_ROWS.map(row => (
                    <div key={row.id} className="cg-matrix-row">
                      <div className={`cg-row-label ${row.labelClass}`}>{row.label}</div>
                      {row.zones.map(zoneId => {
                        const def = ZONE_DEF_MAP[zoneId]
                        return (
                          <div
                            key={zoneId}
                            data-zone={zoneId}
                            className="cg-zone"
                            style={{ '--cg-zone-color': def.color, '--cg-zone-bg': def.bg } as React.CSSProperties}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('cg-zone--hover') }}
                            onDragLeave={e => e.currentTarget.classList.remove('cg-zone--hover')}
                            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('cg-zone--hover'); handleDropOnZone(zoneId) }}
                          >
                            <div className="cg-zone-label">{def.label}</div>
                            <div className="cg-zone-cards">
                              {gridZones[zoneId].map(cardId => {
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
                                    onDragStart={() => handleCardDragStart(cardId, zoneId)}
                                  >
                                    {card.text}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cg-bottom">
                <div className="cg-axis-spacer" />
                <div className="cg-learning-row">
                  <div className="cg-row-spacer" />
                  <div className="cg-no-learning">Pas d'apprentissage</div>
                  <div className="cg-learning-title">APPRENTISSAGE</div>
                  <div className="cg-no-learning">Pas d'apprentissage</div>
                </div>
              </div>
            </div>

            {phase1Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / {PHASE1_CARDS.length} correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais lire la grille : comportement, résultat, succès, échec et apprentissage.
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

        {/* ── PHASE 2 ── */}
        {phase === 2 && (
          <>
            <div className="cg-visual">
              <div className="cg-top">
                <div className="cg-axis-spacer" />
                <div className="cg-behavior-band">COMPORTEMENT</div>
              </div>

              <div className="cg-middle">
                <div className="cg-outcome-axis"><span>RÉSULTAT</span></div>
                <div className="cg-matrix">
                  <div className="cg-matrix-row cg-matrix-row--headers">
                    <div className="cg-row-spacer" />
                    <div className="cg-col-header cg-col-header--mistake">Erreurs</div>
                    <div className="cg-col-header cg-col-header--experiment">Expérimentations</div>
                    <div className="cg-col-header cg-col-header--practice">Pratiques</div>
                  </div>

                  {GRID_ROWS.map(row => (
                    <div key={row.id} className="cg-matrix-row">
                      <div className={`cg-row-label ${row.labelClass}`}>{row.label}</div>
                      {row.zones.map(zoneId => {
                        const def = ZONE_DEF_MAP[zoneId]
                        const zoneSituations = PHASE2_SITUATIONS.filter(s => situationZones[s.id] === zoneId)
                        return (
                          <div
                            key={zoneId}
                            data-zone={zoneId}
                            className="cg-zone"
                            style={{ '--cg-zone-color': def.color, '--cg-zone-bg': def.bg } as React.CSSProperties}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('cg-zone--hover') }}
                            onDragLeave={e => e.currentTarget.classList.remove('cg-zone--hover')}
                            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('cg-zone--hover'); handleDropSituationOnZone(zoneId) }}
                          >
                            <div className="cg-zone-label">{def.label}</div>
                            <div className="cg-zone-cards">
                              {zoneSituations.map(s => {
                                const resultClass = phase2Result !== null
                                  ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                                  : ' tki-situation-card--default'
                                return (
                                  <div
                                    key={s.id}
                                    data-situation={s.id}
                                    className={`tki-situation-card${resultClass}`}
                                    draggable
                                    onDragStart={() => handleSituationDragStart(s.id, zoneId)}
                                  >
                                    {s.situation}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cg-bottom">
                <div className="cg-axis-spacer" />
                <div className="cg-learning-row">
                  <div className="cg-row-spacer" />
                  <div className="cg-no-learning">Pas d'apprentissage</div>
                  <div className="cg-learning-title">APPRENTISSAGE</div>
                  <div className="cg-no-learning">Pas d'apprentissage</div>
                </div>
              </div>
            </div>

            {phase2Result !== null && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase2Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / {PHASE2_SITUATIONS.length} correct{phase2Perfect ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Perfect
                    ? "Tu sais distinguer un succès fiable, un succès chanceux, une erreur, une expérimentation et un échec porteur d'apprentissage."
                    : "À consolider : certaines situations sont proches, mais il faut mieux distinguer résultat obtenu et comportement réellement utilisé."}
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
