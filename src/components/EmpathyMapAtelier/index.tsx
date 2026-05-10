import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type EmpathyMapCoreZone = 'says' | 'thinks' | 'does' | 'feels'
type EmpathyMapExtendedZone = 'says' | 'thinks' | 'does' | 'feels' | 'needs'
type CoreZones = Record<EmpathyMapCoreZone, string[]>
type ExtendedZones = Record<EmpathyMapExtendedZone, string[]>

const CORE_ZONES: { id: EmpathyMapCoreZone; label: string; description: string }[] = [
  { id: 'says',   label: 'Dit',     description: "Ce que la personne exprime explicitement, à l'oral ou à l'écrit." },
  { id: 'thinks', label: 'Pense',   description: 'Ce que la personne peut croire, anticiper, craindre ou questionner intérieurement.' },
  { id: 'does',   label: 'Fait',    description: 'Les comportements observables, actions, réactions ou routines.' },
  { id: 'feels',  label: 'Ressent', description: 'Les émotions, tensions, frustrations ou motivations ressenties.' },
]

const EXTENDED_ZONES: { id: EmpathyMapExtendedZone; label: string; description: string }[] = [
  { id: 'says',   label: 'Dit',     description: 'Verbatims ou phrases explicitement formulées.' },
  { id: 'thinks', label: 'Pense',   description: 'Pensées, croyances, préoccupations ou hypothèses internes.' },
  { id: 'does',   label: 'Fait',    description: 'Actions et comportements réellement observables.' },
  { id: 'feels',  label: 'Ressent', description: 'Émotions, frustrations, tensions ou signaux affectifs.' },
  { id: 'needs',  label: 'Besoin',  description: 'Besoin profond à déduire des observations, verbatims et émotions.' },
]

type CoreCard = { id: string; text: string; correctZone: EmpathyMapCoreZone }

const CORE_CARDS: CoreCard[] = [
  { id: 'c1',  text: "\"Je ne comprends pas pourquoi cette fonctionnalité est prioritaire.\"",   correctZone: 'says' },
  { id: 'c2',  text: "\"Je perds trop de temps à chercher l'information.\"",                      correctZone: 'says' },
  { id: 'c3',  text: "\"Le Daily ne m'aide pas vraiment à avancer.\"",                            correctZone: 'says' },
  { id: 'c4',  text: "Il se demande si son avis est vraiment pris en compte.",                    correctZone: 'thinks' },
  { id: 'c5',  text: "Elle pense que le produit devient trop complexe pour les utilisateurs.",    correctZone: 'thinks' },
  { id: 'c6',  text: "Il craint que l'équipe ne soit pas prête pour la démonstration client.",    correctZone: 'thinks' },
  { id: 'c7',  text: "Il consulte plusieurs outils avant de trouver la bonne information.",       correctZone: 'does' },
  { id: 'c8',  text: "Elle évite de prendre la parole pendant les rétrospectives.",               correctZone: 'does' },
  { id: 'c9',  text: "Il contacte directement un développeur au lieu de passer par le backlog.", correctZone: 'does' },
  { id: 'c10', text: "Il se sent frustré par le manque de visibilité.",                           correctZone: 'feels' },
  { id: 'c11', text: "Elle est rassurée quand les priorités sont clairement expliquées.",         correctZone: 'feels' },
  { id: 'c12', text: "Il ressent de la pression à l'approche de la Sprint Review.",              correctZone: 'feels' },
]

type ExtendedCard = { id: string; text: string; correctZone: EmpathyMapExtendedZone }

const EXTENDED_CARDS: ExtendedCard[] = [
  { id: 'e1',  text: "\"Je ne sais jamais ce qui est vraiment prioritaire.\"",                                        correctZone: 'says' },
  { id: 'e2',  text: "\"On nous demande d'aller vite, mais on découvre les contraintes trop tard.\"",                 correctZone: 'says' },
  { id: 'e3',  text: "\"Je préférerais avoir moins de réunions, mais plus utiles.\"",                                 correctZone: 'says' },
  { id: 'e4',  text: "Il se demande si l'équipe comprend vraiment son problème métier.",                              correctZone: 'thinks' },
  { id: 'e5',  text: "Elle pense que les décisions sont déjà prises avant les ateliers.",                             correctZone: 'thinks' },
  { id: 'e6',  text: "Il craint que signaler un problème soit perçu comme un manque d'engagement.",                   correctZone: 'thinks' },
  { id: 'e7',  text: "Il contourne le processus officiel pour obtenir une réponse plus vite.",                        correctZone: 'does' },
  { id: 'e8',  text: "Elle participe peu aux cérémonies, mais envoie beaucoup de messages privés après coup.",        correctZone: 'does' },
  { id: 'e9',  text: "Il reporte plusieurs fois la validation d'une User Story.",                                     correctZone: 'does' },
  { id: 'e10', text: "Il se sent perdu face au nombre d'outils et de canaux de communication.",                       correctZone: 'feels' },
  { id: 'e11', text: "Elle est agacée par les changements de priorité en cours de Sprint.",                            correctZone: 'feels' },
  { id: 'e12', text: "Il se sent rassuré quand une décision est reformulée clairement en fin de réunion.",             correctZone: 'feels' },
  { id: 'e13', text: "Besoin de visibilité sur les priorités et les arbitrages.",                                      correctZone: 'needs' },
  { id: 'e14', text: "Besoin de sécurité psychologique pour exprimer les blocages.",                                   correctZone: 'needs' },
  { id: 'e15', text: "Besoin d'un cadre plus simple pour collaborer avec l'équipe.",                                   correctZone: 'needs' },
]

type DraggingItem =
  | { type: 'core-card';     cardId: string; fromZone?: EmpathyMapCoreZone }
  | { type: 'extended-card'; cardId: string; fromZone?: EmpathyMapExtendedZone }
  | null

export function EmpathyMapAtelier() {
  const { markComplete } = useWorkshopCompletion('empathy-map')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [coreZones, setCoreZones] = useState<CoreZones>({
    says: [], thinks: [], does: [], feels: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [extendedZones, setExtendedZones] = useState<ExtendedZones>({
    says: [], thinks: [], does: [], feels: [], needs: [],
  })
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<DraggingItem>(null)

  const isDirty = phase > 1 || Object.values(coreZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedCoreIds = new Set(Object.values(coreZones).flat())
  const paletteCoreCards = CORE_CARDS.filter(c => !placedCoreIds.has(c.id))
  const phase1AllPlaced = paletteCoreCards.length === 0

  function handleCoreDragStart(cardId: string, fromZone?: EmpathyMapCoreZone) {
    setDragging({ type: 'core-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnCoreZone(zone: EmpathyMapCoreZone) {
    if (!dragging || dragging.type !== 'core-card') return
    setCoreZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) {
        next[dragging.fromZone] = next[dragging.fromZone].filter(id => id !== dragging.cardId)
      }
      if (!next[zone].includes(dragging.cardId)) next[zone] = [...next[zone], dragging.cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnCorePalette() {
    if (!dragging || dragging.type !== 'core-card' || !dragging.fromZone) { setDragging(null); return }
    setCoreZones(prev => ({
      ...prev,
      [dragging.fromZone!]: prev[dragging.fromZone!].filter(id => id !== dragging.cardId),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const c of CORE_CARDS) {
      const zone = (Object.entries(coreZones) as [EmpathyMapCoreZone, string[]][])
        .find(([, ids]) => ids.includes(c.id))?.[0]
      result[c.id] = zone === c.correctZone
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setCoreZones({ says: [], thinks: [], does: [], feels: [] })
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 12

  // Phase 2 helpers
  const placedExtendedIds = new Set(Object.values(extendedZones).flat())
  const paletteExtendedCards = EXTENDED_CARDS.filter(c => !placedExtendedIds.has(c.id))
  const phase2AllPlaced = paletteExtendedCards.length === 0

  function handleExtendedDragStart(cardId: string, fromZone?: EmpathyMapExtendedZone) {
    setDragging({ type: 'extended-card', cardId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnExtendedZone(zone: EmpathyMapExtendedZone) {
    if (!dragging || dragging.type !== 'extended-card') return
    setExtendedZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) {
        next[dragging.fromZone] = next[dragging.fromZone].filter(id => id !== dragging.cardId)
      }
      if (!next[zone].includes(dragging.cardId)) next[zone] = [...next[zone], dragging.cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnExtendedPalette() {
    if (!dragging || dragging.type !== 'extended-card' || !dragging.fromZone) { setDragging(null); return }
    setExtendedZones(prev => ({
      ...prev,
      [dragging.fromZone!]: prev[dragging.fromZone!].filter(id => id !== dragging.cardId),
    }))
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const c of EXTENDED_CARDS) {
      const zone = (Object.entries(extendedZones) as [EmpathyMapExtendedZone, string[]][])
        .find(([, ids]) => ids.includes(c.id))?.[0]
      result[c.id] = zone === c.correctZone
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setExtendedZones({ says: [], thinks: [], does: [], feels: [], needs: [] })
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'empathy-map')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Empathy Map</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? "Phase 1 / 2 — Classez les 12 éléments dans la bonne zone de l'Empathy Map."
              : "Phase 2 / 2 — Associez chaque observation à la bonne zone de l'Empathy Map enrichie."}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {CORE_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-zone={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnCoreZone(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {coreZones[zone.id].map(cardId => {
                      const card = CORE_CARDS.find(x => x.id === cardId)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[card.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={card.id}
                          data-card={card.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleCoreDragStart(card.id, zone.id)}
                        >
                          {card.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / 12 correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais différencier les principales zones de l'Empathy Map : expression, pensée, comportement et émotion.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnCorePalette}
            >
              <p className="scrum-palette__title">Éléments à classer</p>
              <div className="tki-pool__cards">
                {paletteCoreCards.map(card => (
                  <div
                    key={card.id}
                    data-card={card.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleCoreDragStart(card.id)}
                  >
                    {card.text}
                  </div>
                ))}
                {paletteCoreCards.length === 0 && (
                  <span className="scrum-palette__empty">Tous les éléments ont été classés</span>
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
              {EXTENDED_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-zone={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnExtendedZone(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {extendedZones[zone.id].map(cardId => {
                      const card = EXTENDED_CARDS.find(x => x.id === cardId)!
                      const resultClass = phase2Result !== null
                        ? phase2Result[card.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={card.id}
                          data-card={card.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleExtendedDragStart(card.id, zone.id)}
                        >
                          {card.text}
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
                    ? "Tu sais structurer une situation utilisateur ou équipe et faire émerger les besoins derrière les signaux observés."
                    : "À consolider : certaines cartes sont proches, mais la différence entre fait observable, pensée supposée, émotion et besoin doit être mieux distinguée."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnExtendedPalette}
            >
              <p className="scrum-palette__title">Observations à classer</p>
              <div className="tki-pool__cards">
                {paletteExtendedCards.map(card => (
                  <div
                    key={card.id}
                    data-card={card.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleExtendedDragStart(card.id)}
                  >
                    {card.text}
                  </div>
                ))}
                {paletteExtendedCards.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les observations ont été classées</span>
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
