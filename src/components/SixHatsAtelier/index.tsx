import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type SixHat = 'white' | 'red' | 'black' | 'yellow' | 'green' | 'blue'
type SixHatIntent = 'objectify' | 'feel' | 'secure' | 'value' | 'imagine' | 'structure'
type HatZones = Record<SixHat, string[]>
type SituationZones = Record<string, SixHatIntent>

const HATS: { id: SixHat; label: string; shortLabel: string; description: string }[] = [
  { id: 'white',  label: 'Chapeau blanc',  shortLabel: 'Faits',      description: 'Données, faits, informations disponibles, informations manquantes.' },
  { id: 'red',    label: 'Chapeau rouge',  shortLabel: 'Ressentis',  description: 'Émotions, intuitions, ressentis, signaux faibles.' },
  { id: 'black',  label: 'Chapeau noir',   shortLabel: 'Risques',    description: 'Risques, limites, objections, points de vigilance.' },
  { id: 'yellow', label: 'Chapeau jaune',  shortLabel: 'Bénéfices',  description: "Bénéfices, valeur, opportunités, raisons d'y croire." },
  { id: 'green',  label: 'Chapeau vert',   shortLabel: 'Idées',      description: 'Créativité, alternatives, options nouvelles, hypothèses.' },
  { id: 'blue',   label: 'Chapeau bleu',   shortLabel: 'Cadre',      description: 'Animation, méthode, séquence, synthèse, décision et prochaines étapes.' },
]

const INTENTS: { id: SixHatIntent; label: string; description: string }[] = [
  { id: 'objectify', label: 'Objectiver',  description: 'Revenir aux faits, données et informations vérifiables.' },
  { id: 'feel',      label: 'Ressentir',   description: 'Exprimer les émotions, intuitions et signaux faibles.' },
  { id: 'secure',    label: 'Sécuriser',   description: 'Identifier les risques, limites et conséquences négatives possibles.' },
  { id: 'value',     label: 'Valoriser',   description: 'Explorer les bénéfices, opportunités et impacts positifs.' },
  { id: 'imagine',   label: 'Imaginer',    description: 'Produire des alternatives, idées nouvelles ou options créatives.' },
  { id: 'structure', label: 'Structurer',  description: 'Piloter la réflexion, choisir la séquence, synthétiser et conclure.' },
]

type HatCard = { id: string; text: string; correctHat: SixHat }

const HAT_CARDS: HatCard[] = [
  { id: 'c1',  text: 'Nous avons 12 anomalies ouvertes sur cette release.',                                correctHat: 'white' },
  { id: 'c2',  text: "Il nous manque les chiffres d'usage de la dernière version.",                         correctHat: 'white' },
  { id: 'c3',  text: "J'ai un mauvais pressentiment sur cette livraison.",                                  correctHat: 'red' },
  { id: 'c4',  text: "Je sens que l'équipe est fatiguée et moins confiante.",                               correctHat: 'red' },
  { id: 'c5',  text: "Cette solution risque d'augmenter la dette technique.",                               correctHat: 'black' },
  { id: 'c6',  text: "Si cette dépendance n'est pas levée, le Sprint Goal sera compromis.",                 correctHat: 'black' },
  { id: 'c7',  text: 'Cette option pourrait réduire fortement le délai de traitement utilisateur.',         correctHat: 'yellow' },
  { id: 'c8',  text: 'Ce choix peut améliorer la lisibilité du parcours client.',                          correctHat: 'yellow' },
  { id: 'c9',  text: 'Et si on testait une version simplifiée en feature flag ?',                          correctHat: 'green' },
  { id: 'c10', text: "On pourrait imaginer trois alternatives au lieu d'opposer seulement deux options.",   correctHat: 'green' },
  { id: 'c11', text: "Commençons par les faits, puis passons aux risques et aux options.",                  correctHat: 'blue' },
  { id: 'c12', text: "Je reformule la décision et les prochaines étapes avant de clôturer.",               correctHat: 'blue' },
]

type Situation = { id: string; situation: string; question: string; correctIntent: SixHatIntent }

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: "L'équipe débat vivement sur la qualité de la release, mais personne ne regarde les indicateurs disponibles.",  question: "Quels faits ou données avons-nous réellement sur la qualité actuelle ?",                             correctIntent: 'objectify' },
  { id: 's2',  situation: "Le Product Owner affirme que les utilisateurs sont insatisfaits, sans préciser la source.",                     question: "Quelles informations vérifiables avons-nous sur les retours utilisateurs ?",                         correctIntent: 'objectify' },
  { id: 's3',  situation: "Une discussion sur la vélocité devient émotionnelle.",                                                          question: "Quels éléments factuels permettent de comprendre l'évolution de la vélocité ?",                      correctIntent: 'objectify' },
  { id: 's4',  situation: "L'équipe accepte une décision, mais plusieurs personnes semblent tendues.",                                     question: "Quel est votre ressenti immédiat sur cette décision ?",                                             correctIntent: 'feel' },
  { id: 's5',  situation: "Un changement de priorité crée un malaise difficile à formuler.",                                               question: "Qu'est-ce que cette décision vous fait ressentir ?",                                                correctIntent: 'feel' },
  { id: 's6',  situation: "Le Scrum Master sent une perte de confiance dans l'équipe.",                                                    question: "Quelle intuition ou émotion faut-il rendre visible avant de continuer ?",                           correctIntent: 'feel' },
  { id: 's7',  situation: "Une solution technique paraît séduisante, mais elle n'a pas été évaluée côté maintenabilité.",                  question: "Quels risques cette solution pourrait-elle créer dans le temps ?",                                   correctIntent: 'secure' },
  { id: 's8',  situation: "Le Product Owner veut ajouter une User Story en cours de Sprint.",                                              question: "Quels impacts négatifs possibles devons-nous examiner avant de décider ?",                          correctIntent: 'secure' },
  { id: 's9',  situation: "L'équipe envisage de réduire les tests pour tenir la date.",                                                    question: "Qu'est-ce qui pourrait mal se passer si nous faisons ce choix ?",                                   correctIntent: 'secure' },
  { id: 's10', situation: "Une proposition est rapidement critiquée alors qu'elle pourrait avoir de la valeur.",                           question: "Quels bénéfices cette option pourrait-elle apporter ?",                                             correctIntent: 'value' },
  { id: 's11', situation: "L'équipe hésite à investir du temps dans l'amélioration de la Definition of Done.",                            question: "Quels gains pouvons-nous attendre si nous renforçons notre Definition of Done ?",                    correctIntent: 'value' },
  { id: 's12', situation: "Une expérimentation semble ambitieuse, mais potentiellement utile.",                                            question: "Quelles opportunités cette expérimentation pourrait-elle ouvrir ?",                                 correctIntent: 'value' },
  { id: 's13', situation: "Le débat se bloque entre deux options opposées : livrer vite ou livrer propre.",                               question: "Quelles alternatives permettraient de préserver à la fois la valeur et la qualité ?",               correctIntent: 'imagine' },
  { id: 's14', situation: "La rétrospective produit toujours les mêmes actions.",                                                         question: "Quelles idées nouvelles pourrions-nous tester au prochain Sprint ?",                                 correctIntent: 'imagine' },
  { id: 's15', situation: "La réunion part dans tous les sens et mélange faits, opinions, risques et solutions.",                         question: "Dans quel ordre allons-nous explorer le sujet pour décider clairement ?",                            correctIntent: 'structure' },
]

type DraggingItem =
  | { type: 'hat-card';  cardId: string;      fromHat?: SixHat }
  | { type: 'situation'; situationId: string; fromIntent?: SixHatIntent }
  | null

export function SixHatsAtelier() {
  const { markComplete } = useWorkshopCompletion('six-hats')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [hatZones, setHatZones] = useState<HatZones>({
    white: [], red: [], black: [], yellow: [], green: [], blue: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<DraggingItem>(null)

  const isDirty = phase > 1 || Object.values(hatZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedCardIds = new Set(Object.values(hatZones).flat())
  const paletteCards = HAT_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = paletteCards.length === 0

  function handleCardDragStart(cardId: string, fromHat?: SixHat) {
    setDragging({ type: 'hat-card', cardId, fromHat })
    setPhase1Result(null)
  }

  function handleDropOnHat(hat: SixHat) {
    if (!dragging || dragging.type !== 'hat-card') return
    const fromHat = dragging.fromHat
    const cardId = dragging.cardId
    setHatZones(prev => {
      const next = { ...prev }
      if (fromHat) {
        next[fromHat] = next[fromHat].filter(id => id !== cardId)
      }
      if (!next[hat].includes(cardId)) next[hat] = [...next[hat], cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnCardPalette() {
    if (!dragging || dragging.type !== 'hat-card' || !dragging.fromHat) { setDragging(null); return }
    const fromHat = dragging.fromHat
    const cardId = dragging.cardId
    setHatZones(prev => ({
      ...prev,
      [fromHat]: prev[fromHat].filter(id => id !== cardId),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const c of HAT_CARDS) {
      const hat = (Object.entries(hatZones) as [SixHat, string[]][])
        .find(([, ids]) => ids.includes(c.id))?.[0]
      result[c.id] = hat === c.correctHat
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setHatZones({ white: [], red: [], black: [], yellow: [], green: [], blue: [] })
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 12

  // Phase 2 helpers
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0

  function handleSituationDragStart(situationId: string, fromIntent?: SixHatIntent) {
    setDragging({ type: 'situation', situationId, fromIntent })
    setPhase2Result(null)
  }

  function handleDropOnIntent(intent: SixHatIntent) {
    if (!dragging || dragging.type !== 'situation') return
    const id = dragging.situationId
    setSituationZones(prev => ({ ...prev, [id]: intent }))
    setDragging(null)
  }

  function handleDropOnSituationPool() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromIntent) { setDragging(null); return }
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
      result[s.id] = situationZones[s.id] === s.correctIntent
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setSituationZones({})
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'six-hats')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Six Chapeaux de Bono</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? "Phase 1 / 2 — Classez les 12 cartes dans le bon chapeau."
              : "Phase 2 / 2 — Associez chaque situation au chapeau le plus pertinent."}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {HATS.map(hat => (
                <div
                  key={hat.id}
                  data-hat={hat.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnHat(hat.id)}
                >
                  <h3 className="tki-column__title">{hat.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{hat.description}</p>
                  <div className="tki-column__cards">
                    {hatZones[hat.id].map(cardId => {
                      const card = HAT_CARDS.find(x => x.id === cardId)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[card.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={card.id}
                          data-card={card.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleCardDragStart(card.id, hat.id)}
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
                    Tu sais distinguer les 6 perspectives : faits, ressentis, risques, bénéfices, idées et pilotage.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnCardPalette}
            >
              <p className="scrum-palette__title">Cartes à classer</p>
              <div className="tki-pool__cards">
                {paletteCards.map(card => (
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
                {paletteCards.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les cartes ont été classées</span>
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
              {INTENTS.map(intent => (
                <div
                  key={intent.id}
                  data-intent={intent.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnIntent(intent.id)}
                >
                  <h3 className="tki-column__title">{intent.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{intent.description}</p>
                  <div className="tki-column__cards">
                    {SITUATIONS.filter(s => situationZones[s.id] === intent.id).map(s => {
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, intent.id)}
                        >
                          <strong>{s.situation}</strong>
                          <br />
                          <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
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
                    ? "Tu sais structurer une réflexion collective en mobilisant les 6 perspectives au bon moment."
                    : "À consolider : certaines perspectives sont proches, mais il faut mieux distinguer faits, ressentis, risques, bénéfices, créativité et pilotage."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnSituationPool}
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
                    <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
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
