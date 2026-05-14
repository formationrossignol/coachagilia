# Six Chapeaux de Bono Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop Six Thinking Hats atelier — Phase 1 classifies 12 items into 6 hats, Phase 2 assigns 15 team situations to 6 coaching intents.

**Architecture:** JohariWindowAtelier pattern. Phase 2 uses `SituationZones = Record<string, SixHatIntent>` (situationId → intent), NOT `Record<Intent, string[]>`. Phase 1 uses `HatZones = Record<SixHat, string[]>`. Attribute convention: Phase 1 columns `data-hat`, Phase 1 cards `data-card`; Phase 2 columns `data-intent`, Phase 2 situations `data-situation`.

**Note on existing definition:** `definitions.ts` has a COMING_SOON entry with `id: 'six-thinking-hats'` (different). Remove that entry; add a new EXISTING entry with `id: 'six-hats'`.

**Tech Stack:** React 18, TypeScript, Vitest + React Testing Library, native HTML5 drag-and-drop, React Router v6.

---

## File Structure

- Create: `src/data/workshops/datasets/six-hats.ts` — ClassificationDataset (6 zones, 12 cards)
- Create: `src/components/SixHatsAtelier/index.tsx` — two-phase component
- Create: `src/components/SixHatsAtelier/SixHatsAtelier.test.tsx` — 11 tests
- Modify: `src/data/workshops/definitions.ts` — import, add EXISTING `six-hats`, remove COMING_SOON `six-thinking-hats`
- Modify: `src/App.tsx` — import SixHatsAtelier, add route `/ateliers/six-hats`

---

### Task 1: Create six-hats dataset file

**Files:**
- Create: `src/data/workshops/datasets/six-hats.ts`

- [ ] **Step 1: Write the file**

```typescript
import type { ClassificationDataset } from '../types'

export const sixHatsDataset: ClassificationDataset = {
  zones: [
    { id: 'white',  label: 'Chapeau blanc',  description: 'Données, faits, informations disponibles, informations manquantes.' },
    { id: 'red',    label: 'Chapeau rouge',  description: 'Émotions, intuitions, ressentis, signaux faibles.' },
    { id: 'black',  label: 'Chapeau noir',   description: 'Risques, limites, objections, points de vigilance.' },
    { id: 'yellow', label: 'Chapeau jaune',  description: "Bénéfices, valeur, opportunités, raisons d'y croire." },
    { id: 'green',  label: 'Chapeau vert',   description: 'Créativité, alternatives, options nouvelles, hypothèses.' },
    { id: 'blue',   label: 'Chapeau bleu',   description: 'Animation, méthode, séquence, synthèse, décision et prochaines étapes.' },
  ],
  cards: [
    { id: 'c1',  text: 'Nous avons 12 anomalies ouvertes sur cette release.',                                   expectedZone: 'white' },
    { id: 'c2',  text: "Il nous manque les chiffres d'usage de la dernière version.",                            expectedZone: 'white' },
    { id: 'c3',  text: "J'ai un mauvais pressentiment sur cette livraison.",                                     expectedZone: 'red' },
    { id: 'c4',  text: "Je sens que l'équipe est fatiguée et moins confiante.",                                  expectedZone: 'red' },
    { id: 'c5',  text: "Cette solution risque d'augmenter la dette technique.",                                  expectedZone: 'black' },
    { id: 'c6',  text: "Si cette dépendance n'est pas levée, le Sprint Goal sera compromis.",                    expectedZone: 'black' },
    { id: 'c7',  text: 'Cette option pourrait réduire fortement le délai de traitement utilisateur.',            expectedZone: 'yellow' },
    { id: 'c8',  text: 'Ce choix peut améliorer la lisibilité du parcours client.',                             expectedZone: 'yellow' },
    { id: 'c9',  text: 'Et si on testait une version simplifiée en feature flag ?',                             expectedZone: 'green' },
    { id: 'c10', text: "On pourrait imaginer trois alternatives au lieu d'opposer seulement deux options.",      expectedZone: 'green' },
    { id: 'c11', text: "Commençons par les faits, puis passons aux risques et aux options.",                     expectedZone: 'blue' },
    { id: 'c12', text: "Je reformule la décision et les prochaines étapes avant de clôturer.",                  expectedZone: 'blue' },
  ],
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/workshops/datasets/six-hats.ts
git commit -m "feat(data): add six-hats dataset"
```

---

### Task 2: Create SixHatsAtelier component

**Files:**
- Create: `src/components/SixHatsAtelier/index.tsx`

**Architecture notes:**
- Phase 1: `HatZones = Record<SixHat, string[]>`, 6 zones, 12 cards (2 per zone), columns use `data-hat`, cards use `data-card`
- Phase 2: `SituationZones = Record<string, SixHatIntent>`, 6 intents, 15 situations (3-3-3-3-2-1), columns use `data-intent`, situations use `data-situation`
- Phase 2 state initial: `{}`, drop: `{ ...prev, [id]: intent }`, pool-drop: `delete next[id]`, reset: `setSituationZones({})`
- Phase 2 cards show: situation text + question prompt on separate line
- `useWorkshopCompletion('six-hats')`, `WORKSHOP_DEFINITIONS.find(w => w.id === 'six-hats')`
- `isDirty = phase > 1 || Object.values(hatZones).some(arr => arr.length > 0)`
- "Réessayer phase 2" only when `phase2Result && phase2Score !== 15`

- [ ] **Step 1: Write the component**

```typescript
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
    setHatZones(prev => {
      const next = { ...prev }
      if (dragging.fromHat) {
        next[dragging.fromHat] = next[dragging.fromHat].filter(id => id !== dragging.cardId)
      }
      if (!next[hat].includes(dragging.cardId)) next[hat] = [...next[hat], dragging.cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnCardPalette() {
    if (!dragging || dragging.type !== 'hat-card' || !dragging.fromHat) { setDragging(null); return }
    setHatZones(prev => ({
      ...prev,
      [dragging.fromHat!]: prev[dragging.fromHat!].filter(id => id !== dragging.cardId),
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SixHatsAtelier/index.tsx
git commit -m "feat(atelier): SixHatsAtelier component — two-phase drag-and-drop"
```

---

### Task 3: Create SixHatsAtelier tests

**Files:**
- Create: `src/components/SixHatsAtelier/SixHatsAtelier.test.tsx`

**Attribute convention:**
- Phase 1 columns: `data-hat` | Phase 1 cards: `data-card`
- Phase 2 columns: `data-intent` | Phase 2 situations: `data-situation`

Phase 1 correct mapping: c1–c2→white, c3–c4→red, c5–c6→black, c7–c8→yellow, c9–c10→green, c11–c12→blue
Phase 2 correct mapping: s1–s3→objectify, s4–s6→feel, s7–s9→secure, s10–s12→value, s13–s14→imagine, s15→structure

Two helpers: `dragCard(cardId, hatId)` uses `data-card`/`data-hat`; `dragSituation(situationId, intentId)` uses `data-situation`/`data-intent`.

- [ ] **Step 1: Write the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SixHatsAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'six-hats',
      slug: 'six-hats',
      title: 'Six Chapeaux de Bono',
      route: '/ateliers/six-hats',
      categorySlug: 'facilitation',
      toolName: 'Six Thinking Hats',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: 'Structurer la réflexion collective en explorant 6 perspectives distinctes.',
    },
  ],
}))

vi.mock('../../features/gamification', () => {
  const storeState = {
    events: [],
    recordEvent: vi.fn(),
    getCompletedContentSlugs: () => [],
  }
  const useGamificationStore = Object.assign(
    (selector: (s: typeof storeState) => unknown) => selector(storeState),
    { getState: () => storeState }
  )
  return { useGamificationStore }
})

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/six-hats', element: <SixHatsAtelier /> }],
    { initialEntries: ['/ateliers/six-hats'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, hatId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const hat = document.querySelector(`[data-hat="${hatId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(hat)
  fireEvent.drop(hat)
}

function dragSituation(situationId: string, intentId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const intent = document.querySelector(`[data-intent="${intentId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(intent)
  fireEvent.drop(intent)
}

describe('SixHatsAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 12 cards in the palette', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).toBeDisabled()
  })

  it('places a card in a hat via drag-and-drop', () => {
    renderAtelier()
    dragCard('c1', 'white')
    const hat = document.querySelector('[data-hat="white"]')!
    expect(hat.querySelector('[data-card="c1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('c1', 'white')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-hat="white"] [data-card="c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="c1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['c1','c2','c3','c4','c5','c6'].forEach(id => dragCard(id, 'white'))
    ;['c7','c8','c9','c10','c11','c12'].forEach(id => dragCard(id, 'red'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in an intent via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    correct.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'objectify')
    const intent = document.querySelector('[data-intent="objectify"]')!
    expect(intent.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['s1','objectify'],['s2','objectify'],['s3','objectify'],
      ['s4','feel'],['s5','feel'],['s6','feel'],
      ['s7','secure'],['s8','secure'],['s9','secure'],
      ['s10','value'],['s11','value'],['s12','value'],
      ['s13','imagine'],['s14','imagine'],
      ['s15','structure'],
    ]
    p2.forEach(([id, intent]) => dragSituation(id, intent))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'objectify'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'feel'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','white'],['c2','white'],
      ['c3','red'],['c4','red'],
      ['c5','black'],['c6','black'],
      ['c7','yellow'],['c8','yellow'],
      ['c9','green'],['c10','green'],
      ['c11','blue'],['c12','blue'],
    ]
    p1.forEach(([id, hat]) => dragCard(id, hat))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'objectify'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'feel'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/components/SixHatsAtelier/SixHatsAtelier.test.tsx
```

Expected: 11 tests passing.

- [ ] **Step 3: Commit**

```bash
git add src/components/SixHatsAtelier/SixHatsAtelier.test.tsx
git commit -m "test(atelier): SixHatsAtelier — phase 1 and phase 2 tests"
```

---

### Task 4: Register six-hats in definitions.ts

**Files:**
- Modify: `src/data/workshops/definitions.ts`

Three changes:

**Import** — after `import { johariWindowDataset }...`, add:
```typescript
import { sixHatsDataset } from './datasets/six-hats'
```

**EXISTING entry** — after the `johari-window` entry and before the closing `]` of EXISTING, add:
```typescript
  {
    id: 'six-hats',
    slug: 'six-hats',
    title: 'Six Chapeaux de Bono',
    route: '/ateliers/six-hats',
    categorySlug: 'facilitation',
    toolName: 'Six Thinking Hats',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les 6 perspectives de pensée, puis associez des situations Scrum au bon chapeau : faits, ressentis, risques, bénéfices, idées ou pilotage.",
    pedagogy: {
      objectives: [
        "Distinguer les 6 chapeaux et leur rôle",
        "Éviter de mélanger faits, ressentis, risques, bénéfices, idées et pilotage",
        "Choisir la bonne perspective selon une situation d'équipe",
        "Structurer une discussion collective sans tomber dans le débat désorganisé",
        "Utiliser les chapeaux pour améliorer une rétrospective, une décision produit ou une résolution de problème",
      ],
      toolExplanation: "Les Six Chapeaux de Bono (Edward de Bono, 1985) structurent la réflexion collective en demandant au groupe d'explorer successivement 6 perspectives : les faits (blanc), les émotions (rouge), les risques (noir), les bénéfices (jaune), les idées nouvelles (vert) et le pilotage de la discussion (bleu). En séparant les registres de pensée, la méthode réduit les débats confus et améliore la qualité des décisions collectives.",
      whenToUse: [
        "En rétrospective pour explorer un sujet complexe sans mélanger les registres",
        "Pour structurer une décision produit ou une session de résolution de problème",
        "Quand une discussion devient émotionnelle ou part dans plusieurs directions à la fois",
      ],
      expectedOutput: [
        "Distinction maîtrisée des 6 perspectives de Bono",
        "Capacité à choisir le bon chapeau selon la situation et le besoin de la discussion",
      ],
    },
    dataset: sixHatsDataset,
  },
```

**Remove COMING_SOON entry** — find and delete this line from COMING_SOON:
```
  { id: 'six-thinking-hats', slug: 'six-thinking-hats', title: 'Six Chapeaux de Bono', route: '/ateliers/six-thinking-hats', categorySlug: 'facilitation', toolName: 'Six Thinking Hats', level: 'intermediate', durationMinutes: 20, interactionType: 'ranking', summary: 'Structurer la réflexion collective en explorant 6 perspectives distinctes.', comingSoon: true },
```

- [ ] **Step 1–3: Apply all changes, then run:**
```bash
npx tsc --noEmit && npx vitest run 2>&1 | tail -5
```

- [ ] **Step 4: Commit**
```bash
git add src/data/workshops/definitions.ts
git commit -m "feat(data): register six-hats in EXISTING workshop definitions"
```

---

### Task 5: Add /ateliers/six-hats route in App.tsx

**Files:**
- Modify: `src/App.tsx`

After `import { JohariWindowAtelier } from './components/JohariWindowAtelier'`, add:
```typescript
import { SixHatsAtelier } from './components/SixHatsAtelier'
```

After `{ path: '/ateliers/johari-window', element: <JohariWindowAtelier /> }`, add:
```typescript
      { path: '/ateliers/six-hats', element: <SixHatsAtelier /> },
```

- [ ] **Step 1–2: Apply changes, then run:**
```bash
npx tsc --noEmit && npx vitest run 2>&1 | tail -5
```

- [ ] **Step 3: Commit**
```bash
git add src/App.tsx
git commit -m "feat(router): add /ateliers/six-hats route"
```
