# Sailboat Retrospective Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier teaching the Sailboat Retrospective model (Vent / Ancre / Récif / Île / Soleil) with 12 classification cards in Phase 1 and 15 Scrum situations in Phase 2.

**Architecture:** Follows the RadicalCandorAtelier pattern exactly — all data inline in the component, two-phase state machine, column-based drag-and-drop for both phases. Phase 1 requires 12/12 to unlock Phase 2. Phase 2 marks completion on 15/15.

**Tech Stack:** React 18 + TypeScript, Vitest + React Testing Library, HTML5 drag-and-drop, existing `.tki-columns` / `.tki-column` / `.tki-situation-card` CSS classes.

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/data/workshops/datasets/sailboat-retrospective.ts` | `ClassificationDataset` for definitions.ts metadata (15 Phase 2 situations) |
| Create | `src/components/SailboatRetrospectiveAtelier/index.tsx` | Full two-phase component with all data inline |
| Create | `src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx` | 11 tests |
| Modify | `src/data/workshops/definitions.ts` | Promote sailboat from COMING_SOON to EXISTING with pedagogy + dataset |
| Modify | `src/App.tsx` | Add `/ateliers/sailboat` route |

**Do NOT modify** `src/components/AteliersHome/index.tsx` — the atelier list is driven by `definitions.ts` automatically.

---

## Reference: Key patterns from existing codebase

**Existing CSS classes to reuse (no new CSS needed):**
- `.atelier-page` — outer page wrapper
- `.atelier-header`, `.atelier-title`, `.atelier-subtitle` — page header
- `.tki-columns` — flex container for 5 zone columns
- `.tki-column` — one zone column with `data-column={zone.id}`
- `.tki-column__title` — column header
- `.tki-column__cards` — vertical card list inside column
- `.tki-situation-card` — draggable card (pool or placed)
- `.tki-situation-card--correct`, `.tki-situation-card--wrong` — feedback states
- `.tki-pool` — pool drop zone wrapper
- `.tki-pool__cards` — pool card container
- `.scrum-palette__title`, `.scrum-palette__empty` — pool labels
- `.scrum-actions` — action button row
- `.scrum-score-banner` — score display after verify
- `.badge`, `.badge--green`, `.badge--orange` — score badges

**useExitGuard signature:** `const { showModal, confirm, cancel } = useExitGuard(isDirty)`

**ConfirmLeaveModal props:** `title`, `body`, `cancelLabel`, `confirmLabel`, `onConfirm`, `onCancel`

---

## Task 1: Dataset file

**Files:**
- Create: `src/data/workshops/datasets/sailboat-retrospective.ts`

- [ ] **Step 1: Write the failing test**

```tsx
// In SailboatRetrospectiveAtelier.test.tsx — add this at the top of the describe block
// (The test file doesn't exist yet, but we write it first per TDD)
// For now, confirm the dataset file compiles by importing it in the test mock
// We'll write the actual test file in Task 3; here we just create the dataset.
```

Since the dataset file has no logic to test independently, skip to implementation.

- [ ] **Step 2: Create the dataset file**

```typescript
// src/data/workshops/datasets/sailboat-retrospective.ts
import type { ClassificationDataset } from '../types'

export const sailboatRetrospectiveDataset: ClassificationDataset = {
  zones: [
    { id: 'wind',   label: 'Vent',            description: "Ce qui pousse l'équipe vers l'avant : forces, pratiques utiles, facteurs d'accélération." },
    { id: 'anchor', label: 'Ancre',           description: "Ce qui ralentit l'équipe aujourd'hui : blocages, irritants, dépendances ou lourdeurs." },
    { id: 'rocks',  label: 'Récif / rochers', description: "Ce qui pourrait mettre l'équipe en difficulté : risques, menaces ou obstacles à venir." },
    { id: 'island', label: 'Île',             description: "La destination : objectif, résultat attendu ou amélioration visée." },
    { id: 'sun',    label: 'Soleil',          description: "Ce qui donne de l'énergie : motivation, satisfaction, fierté ou signaux positifs." },
  ],
  cards: [
    { id: 's1',  text: "Depuis deux Sprints, l'équipe découpe mieux les User Stories et termine plus régulièrement ce qu'elle démarre.",     expectedZone: 'wind' },
    { id: 's2',  text: "Le Product Owner est plus disponible pendant le Sprint, ce qui réduit les temps d'attente.",                        expectedZone: 'wind' },
    { id: 's3',  text: "Les développeurs commencent à s'entraider spontanément sur les sujets complexes.",                                  expectedZone: 'wind' },
    { id: 's4',  text: "L'équipe perd beaucoup de temps à attendre des validations externes.",                                               expectedZone: 'anchor' },
    { id: 's5',  text: "Les changements de priorité en cours de Sprint créent de la confusion.",                                             expectedZone: 'anchor' },
    { id: 's6',  text: "Les environnements de test sont instables et ralentissent les validations.",                                         expectedZone: 'anchor' },
    { id: 's7',  text: "Une mise en production importante approche, mais la stratégie de rollback n'est pas claire.",                        expectedZone: 'rocks' },
    { id: 's8',  text: "Un expert clé part en congés pendant une période critique.",                                                         expectedZone: 'rocks' },
    { id: 's9',  text: "Une dette technique connue pourrait rendre la prochaine évolution très coûteuse.",                                   expectedZone: 'rocks' },
    { id: 's10', text: "L'équipe veut que le prochain Sprint permette de livrer une version utilisable par un groupe pilote.",                expectedZone: 'island' },
    { id: 's11', text: "Le Product Owner souhaite réduire le temps de traitement d'une demande client de 5 jours à 2 jours.",                expectedZone: 'island' },
    { id: 's12', text: "L'équipe se donne comme objectif de stabiliser le parcours d'inscription avant la prochaine démonstration.",         expectedZone: 'island' },
    { id: 's13', text: "L'équipe se sent plus confiante depuis que les démonstrations se passent mieux.",                                    expectedZone: 'sun' },
    { id: 's14', text: "Un retour utilisateur positif a renforcé la motivation de l'équipe.",                                                expectedZone: 'sun' },
    { id: 's15', text: "La résolution collective d'un incident a créé un vrai sentiment de fierté.",                                         expectedZone: 'sun' },
  ],
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/data/workshops/datasets/sailboat-retrospective.ts
git commit -m "feat(sailboat): add ClassificationDataset for sailboat-retrospective"
```

---

## Task 2: Component

**Files:**
- Create: `src/components/SailboatRetrospectiveAtelier/index.tsx`

Model this EXACTLY after `src/components/RadicalCandorAtelier/index.tsx`. Both phases use the same column-based classification UI (`.tki-columns` with 5 `.tki-column` divs).

- [ ] **Step 1: Write the skeleton test to confirm the component renders**

Create `src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx` with just one test:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SailboatRetrospectiveAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'sailboat',
      slug: 'sailboat',
      title: 'Sailboat Retrospective',
      route: '/ateliers/sailboat',
      categorySlug: 'retrospectives',
      toolName: 'Sailboat / Speed Boat',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Visualiser ce qui propulse et ce qui freine l'équipe.",
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
    [{ path: '/ateliers/sailboat', element: <SailboatRetrospectiveAtelier /> }],
    { initialEntries: ['/ateliers/sailboat'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('SailboatRetrospectiveAtelier', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders phase 1 with 12 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })
})
```

- [ ] **Step 2: Run the skeleton test — confirm it FAILS**

```bash
npx vitest run src/components/SailboatRetrospectiveAtelier 2>&1
```

Expected: FAIL — "Cannot find module './index'"

- [ ] **Step 3: Create the component**

```tsx
// src/components/SailboatRetrospectiveAtelier/index.tsx
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
  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'sailboat')!
  const { markComplete } = useWorkshopCompletion('sailboat')

  const [phase, setPhase] = useState<1 | 2>(1)
  const [sailboatZones, setSailboatZones] = useState<SailboatZones>({ ...EMPTY_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 1 derived state
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => sailboatZones[z]))
  const poolCards = PHASE1_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = poolCards.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : 0
  const phase1Perfect = phase1Score === PHASE1_CARDS.length

  // Phase 2 derived state
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : 0

  const isDirty = phase === 1 ? placedCardIds.size > 0 : Object.keys(situationZones).length > 0
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // ── Phase 1 handlers ────────────────────────────────────────────────────────

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

  // ── Phase 2 handlers ────────────────────────────────────────────────────────

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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Sailboat Retrospective</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez les 12 cartes dans la bonne zone du voilier.'
              : 'Phase 2 / 2 — Associez chaque situation Scrum à la bonne zone du voilier.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {ZONES_DEF.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnZone(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {sailboatZones[zone.id].map(cardId => {
                      const card = PHASE1_CARDS.find(c => c.id === cardId)!
                      const resultClass = phase1Result
                        ? (phase1Result[cardId] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong')
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
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / {PHASE1_CARDS.length} correct{phase1Perfect ? ' — Les zones du voilier sont acquises !' : ''}
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
              {ZONES_DEF.map(zone => (
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
                        ? (phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong')
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

            {phase2Result && (
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
```

- [ ] **Step 4: Run the skeleton test — confirm it now PASSES**

```bash
npx vitest run src/components/SailboatRetrospectiveAtelier 2>&1
```

Expected: 1 passed (1)

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/SailboatRetrospectiveAtelier/index.tsx src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx
git commit -m "feat(sailboat): add SailboatRetrospectiveAtelier component (both phases)"
```

---

## Task 3: Tests

**Files:**
- Modify: `src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx`

Replace the skeleton test file with the full 11-test suite.

- [ ] **Step 1: Write all tests**

```tsx
// src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { SailboatRetrospectiveAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'sailboat',
      slug: 'sailboat',
      title: 'Sailboat Retrospective',
      route: '/ateliers/sailboat',
      categorySlug: 'retrospectives',
      toolName: 'Sailboat / Speed Boat',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Visualiser ce qui propulse et ce qui freine l'équipe.",
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
    [{ path: '/ateliers/sailboat', element: <SailboatRetrospectiveAtelier /> }],
    { initialEntries: ['/ateliers/sailboat'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, zoneId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const zone = document.querySelector(`[data-column="${zoneId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, columnId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const column = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(column)
  fireEvent.drop(column)
}

const CORRECT_P1: [string, string][] = [
  ['p1c1', 'wind'], ['p1c2', 'wind'], ['p1c3', 'wind'],
  ['p1c4', 'anchor'], ['p1c5', 'anchor'], ['p1c6', 'anchor'],
  ['p1c7', 'rocks'], ['p1c8', 'rocks'],
  ['p1c9', 'island'], ['p1c10', 'island'],
  ['p1c11', 'sun'], ['p1c12', 'sun'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'wind'], ['s2', 'wind'], ['s3', 'wind'],
  ['s4', 'anchor'], ['s5', 'anchor'], ['s6', 'anchor'],
  ['s7', 'rocks'], ['s8', 'rocks'], ['s9', 'rocks'],
  ['s10', 'island'], ['s11', 'island'], ['s12', 'island'],
  ['s13', 'sun'], ['s14', 'sun'], ['s15', 'sun'],
]

describe('SailboatRetrospectiveAtelier', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders phase 1 with 12 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a card in a zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('p1c1', 'wind')
    const zone = document.querySelector('[data-column="wind"]')!
    expect(zone.querySelector('[data-card="p1c1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('p1c1', 'wind')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="wind"] [data-card="p1c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="p1c1"]')).toBeInTheDocument()
  })

  it('shows 12/12 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    // Put all cards in wrong zones (swap wind ↔ anchor)
    CORRECT_P1.slice(0, 3).forEach(([cardId]) => dragCard(cardId, 'anchor'))
    CORRECT_P1.slice(3, 6).forEach(([cardId]) => dragCard(cardId, 'wind'))
    CORRECT_P1.slice(6, 8).forEach(([cardId]) => dragCard(cardId, 'island'))
    CORRECT_P1.slice(8, 10).forEach(([cardId]) => dragCard(cardId, 'rocks'))
    CORRECT_P1.slice(10, 12).forEach(([cardId]) => dragCard(cardId, 'wind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'wind')
    const column = document.querySelector('[data-column="wind"]')!
    expect(column.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    // All situations in wrong zone
    CORRECT_P2.forEach(([id]) => dragSituation(id, 'anchor'))
    CORRECT_P2.slice(0, 3).forEach(([id]) => dragSituation(id, 'wind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([cardId, zoneId]) => dragCard(cardId, zoneId))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id]) => dragSituation(id, 'anchor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run all tests — confirm they PASS**

```bash
npx vitest run src/components/SailboatRetrospectiveAtelier 2>&1
```

Expected: 11 passed (1)

- [ ] **Step 3: Commit**

```bash
git add src/components/SailboatRetrospectiveAtelier/SailboatRetrospectiveAtelier.test.tsx
git commit -m "test(sailboat): add 11 tests for both phases"
```

---

## Task 4: Registration

**Files:**
- Modify: `src/data/workshops/definitions.ts:629` (remove from COMING_SOON, add to EXISTING)
- Modify: `src/App.tsx` (add import + route)

- [ ] **Step 1: Update definitions.ts**

Add import at the top of `src/data/workshops/definitions.ts` (after the last existing import):

```typescript
import { sailboatRetrospectiveDataset } from './datasets/sailboat-retrospective'
```

In the `EXISTING` array, add the sailboat entry (add it in the `retrospectives` section, after the last entry in that category group — or just before the COMING_SOON section):

```typescript
  {
    id: 'sailboat',
    slug: 'sailboat',
    title: 'Sailboat Retrospective',
    route: '/ateliers/sailboat',
    categorySlug: 'retrospectives',
    toolName: 'Sailboat / Speed Boat',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Visualiser ce qui propulse et ce qui freine l'équipe comme un voilier : vent, ancre, risques, destination et énergie.",
    pedagogy: {
      objectives: [
        "Identifier les 5 zones de la Sailboat Retrospective",
        "Distinguer un frein actuel d'un risque futur",
        "Reconnaître les moteurs, la destination et les sources d'énergie positive",
      ],
      toolExplanation: "La Sailboat Retrospective aide l'équipe à visualiser sa situation comme un voilier : le vent représente ce qui pousse l'équipe, l'ancre ce qui la freine, les rochers les risques à anticiper, l'île la destination et le soleil ce qui donne de l'énergie.",
      whenToUse: [
        "En rétrospective de Sprint pour structurer le diagnostic d'équipe",
        "Pour rendre visible ce qui aide, freine et menace l'équipe",
        "Pour aligner l'équipe sur un objectif commun",
      ],
      expectedOutput: [
        "Identification correcte des 5 zones du voilier",
        "Classement de situations Scrum dans les zones appropriées",
      ],
    },
    dataset: sailboatRetrospectiveDataset,
  },
```

Remove the existing COMING_SOON stub for sailboat:

```typescript
// DELETE this line from the COMING_SOON array:
{ id: 'sailboat', slug: 'sailboat', title: 'Sailboat Retrospective', route: '/ateliers/sailboat', categorySlug: 'retrospectives', toolName: 'Sailboat / Speed Boat', level: 'beginner', durationMinutes: 30, interactionType: 'canvas', summary: "Visualiser ce qui propulse et ce qui freine l'équipe comme un voilier.", comingSoon: true },
```

- [ ] **Step 2: Update App.tsx**

Add the import after the last atelier import:

```typescript
import { SailboatRetrospectiveAtelier } from './components/SailboatRetrospectiveAtelier'
```

Add the route after the existing `/ateliers/radical-candor` route:

```typescript
{ path: '/ateliers/sailboat', element: <SailboatRetrospectiveAtelier /> },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Run all SailboatRetrospectiveAtelier tests**

```bash
npx vitest run src/components/SailboatRetrospectiveAtelier 2>&1
```

Expected: 11 passed (1)

- [ ] **Step 5: Run the full test suite**

```bash
npx vitest run 2>&1 | tail -10
```

Expected: all test files pass, no regressions

- [ ] **Step 6: Commit**

```bash
git add src/data/workshops/definitions.ts src/App.tsx
git commit -m "feat(sailboat): register SailboatRetrospectiveAtelier in definitions and routing"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| Phase 1: 5 zones (Vent, Ancre, Récif, Île, Soleil) | `ZONES_DEF` constant, Task 2 |
| Phase 1: 12 cards to classify | `PHASE1_CARDS` (3+3+2+2+2), Task 2 |
| Phase 1: Vérifier active when 12 placed | `phase1AllPlaced` derived state, Task 2 |
| Phase 1: 12/12 → Parfait + Phase suivante | Phase 1 verify handler + banner, Task 2 |
| Phase 1: <12/12 → green/red + Réessayer | `phase1Result` result classes, Task 2 |
| Phase 2: 15 situations across 5 zones | `SITUATIONS` (3×5), Task 2 |
| Phase 2: Vérifier active when 15 placed | `phase2AllPlaced`, Task 2 |
| Phase 2: 15/15 → Maîtrisé + markComplete | verify handler + banner, Task 2 |
| Phase 2: <15/15 → À consolider + Réessayer | verify handler + banner, Task 2 |
| Phase 1 must be 100% to unlock Phase 2 | `phase1Perfect` gates setPhase(2), Task 2 |
| Exit guard with ConfirmLeaveModal | `useExitGuard` + `ConfirmLeaveModal`, Task 2 |
| Workshop registered and routable | definitions.ts + App.tsx, Task 4 |

**No placeholders found.**

**Type consistency:** `SailboatZone`, `SailboatZones`, `SituationZones`, `DraggingItem`, `SailboatCard`, `Situation`, `ZONE_IDS`, `ZONES_DEF`, `PHASE1_CARDS`, `SITUATIONS`, `EMPTY_ZONES` — all used consistently across component and tests.
