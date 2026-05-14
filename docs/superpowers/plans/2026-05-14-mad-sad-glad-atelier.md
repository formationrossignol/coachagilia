# Mad / Sad / Glad Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier that teaches learners to classify emotional reactions (Mad / Sad / Glad) — first with labelled emotion cards, then with unlabelled Sprint situations.

**Architecture:** Single-file React component (`MadSadGladAtelier/index.tsx`) mirroring the StarfishRetrospectiveAtelier pattern exactly: native HTML5 drag-and-drop, three emotion columns, `useWorkshopCompletion` for gamification, `useExitGuard` for dirty-state protection. Phase 1 has 12 emotion cards (4 per column); Phase 2 has 15 Sprint-situation cards (5 per column). CSS uses `msg-*` prefix classes added to `src/index.css`.

**Tech Stack:** React 18, TypeScript, native drag-and-drop, Vitest + React Testing Library, existing hooks (`useWorkshopCompletion`, `useExitGuard`), existing UI components (`WorkshopPedagogyPanel`, `ConfirmLeaveModal`).

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/MadSadGladAtelier/index.tsx` | Main two-phase atelier component |
| Create | `src/components/MadSadGladAtelier/MadSadGladAtelier.test.tsx` | 11 Vitest tests |
| Create | `src/data/workshops/datasets/mad-sad-glad.ts` | ClassificationDataset for Phase 2 |
| Modify | `src/data/workshops/definitions.ts` | Add import + EXISTING entry, remove COMING_SOON stub |
| Modify | `src/App.tsx` | Add import + `/ateliers/mad-sad-glad` route |
| Modify | `src/index.css` | Add `msg-*` CSS classes |

---

## Task 1: Tests (TDD — write tests first)

**Files:**
- Create: `src/components/MadSadGladAtelier/MadSadGladAtelier.test.tsx`

- [ ] **Step 1: Write the failing test file**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { MadSadGladAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'mad-sad-glad',
      slug: 'mad-sad-glad',
      title: 'Mad / Sad / Glad',
      route: '/ateliers/mad-sad-glad',
      categorySlug: 'retrospectives',
      toolName: 'Mad/Sad/Glad',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Explorer les émotions de l'équipe autour du Sprint.",
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
    [{ path: '/ateliers/mad-sad-glad', element: <MadSadGladAtelier /> }],
    { initialEntries: ['/ateliers/mad-sad-glad'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, columnId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const col = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(col)
  fireEvent.drop(col)
}

function dragSituation(situationId: string, columnId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const col = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(col)
  fireEvent.drop(col)
}

const CORRECT_P1: [string, string][] = [
  ['mad-1', 'mad'], ['mad-2', 'mad'], ['mad-3', 'mad'], ['mad-4', 'mad'],
  ['sad-1', 'sad'], ['sad-2', 'sad'], ['sad-3', 'sad'], ['sad-4', 'sad'],
  ['glad-1', 'glad'], ['glad-2', 'glad'], ['glad-3', 'glad'], ['glad-4', 'glad'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'mad'], ['s2', 'mad'], ['s3', 'mad'], ['s4', 'mad'], ['s5', 'mad'],
  ['s6', 'sad'], ['s7', 'sad'], ['s8', 'sad'], ['s9', 'sad'], ['s10', 'sad'],
  ['s11', 'glad'], ['s12', 'glad'], ['s13', 'glad'], ['s14', 'glad'], ['s15', 'glad'],
]

describe('MadSadGladAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 12 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a card in a column via drag-and-drop', () => {
    renderAtelier()
    dragCard('mad-1', 'mad')
    const col = document.querySelector('[data-column="mad"]')!
    expect(col.querySelector('[data-card="mad-1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('mad-1', 'mad')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="mad"] [data-card="mad-1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="mad-1"]')).toBeInTheDocument()
  })

  it('shows 12/12 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['mad-1', 'mad-2', 'mad-3', 'mad-4'].forEach(id => dragCard(id, 'sad'))
    ;['sad-1', 'sad-2', 'sad-3', 'sad-4'].forEach(id => dragCard(id, 'glad'))
    ;['glad-1', 'glad-2', 'glad-3', 'glad-4'].forEach(id => dragCard(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'mad')
    const col = document.querySelector('[data-column="mad"]')!
    expect(col.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'glad'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, col]) => dragCard(card, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'glad'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'mad'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail with "Cannot find module"**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/MadSadGladAtelier 2>&1 | tail -20
```

Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 3: Commit the failing tests**

```bash
git add src/components/MadSadGladAtelier/MadSadGladAtelier.test.tsx
git commit -m "test(mad-sad-glad): add 11 tests for both phases"
```

---

## Task 2: Dataset file

**Files:**
- Create: `src/data/workshops/datasets/mad-sad-glad.ts`

- [ ] **Step 1: Create the dataset**

```ts
import type { ClassificationDataset } from '../types'

export const madSadGladDataset: ClassificationDataset = {
  zones: [
    { id: 'mad',  label: 'Mad',  description: 'Colère, irritation, injustice, tension ou frustration forte.' },
    { id: 'sad',  label: 'Sad',  description: 'Déception, regret, perte d\'énergie, tristesse ou démotivation.' },
    { id: 'glad', label: 'Glad', description: 'Satisfaction, fierté, gratitude, confiance ou motivation.' },
  ],
  cards: [
    { id: 's1',  text: 'Une User Story est ajoutée en urgence au milieu du Sprint sans discussion avec l\'équipe.',                                        expectedZone: 'mad' },
    { id: 's2',  text: 'L\'équipe reçoit un reproche sur une livraison bloquée par une dépendance qu\'elle avait signalée depuis deux semaines.',          expectedZone: 'mad' },
    { id: 's3',  text: 'Une décision technique est imposée en dehors de l\'équipe, sans explication claire.',                                              expectedZone: 'mad' },
    { id: 's4',  text: 'Plusieurs interruptions externes empêchent l\'équipe de terminer les items engagés.',                                              expectedZone: 'mad' },
    { id: 's5',  text: 'Un membre de l\'équipe coupe régulièrement la parole pendant les échanges.',                                                       expectedZone: 'mad' },
    { id: 's6',  text: 'L\'équipe n\'a pas réussi à atteindre le Sprint Goal malgré un effort important.',                                                expectedZone: 'sad' },
    { id: 's7',  text: 'Un nouveau membre est resté isolé pendant le Sprint, faute d\'accompagnement suffisant.',                                          expectedZone: 'sad' },
    { id: 's8',  text: 'La Sprint Review attire peu de participants et génère peu de retours.',                                                             expectedZone: 'sad' },
    { id: 's9',  text: 'Une amélioration décidée en rétrospective précédente n\'a pas été suivie.',                                                        expectedZone: 'sad' },
    { id: 's10', text: 'L\'équipe constate que la dette technique augmente encore, sans temps dédié pour la traiter.',                                     expectedZone: 'sad' },
    { id: 's11', text: 'Le Product Owner a clarifié rapidement plusieurs ambiguïtés pendant le Sprint.',                                                   expectedZone: 'glad' },
    { id: 's12', text: 'Deux développeurs ont spontanément travaillé ensemble pour débloquer une anomalie complexe.',                                      expectedZone: 'glad' },
    { id: 's13', text: 'La démonstration a reçu un retour utilisateur très positif.',                                                                      expectedZone: 'glad' },
    { id: 's14', text: 'L\'équipe a osé réduire le périmètre pour préserver la qualité.',                                                                 expectedZone: 'glad' },
    { id: 's15', text: 'Un incident a été traité collectivement, sans recherche de coupable.',                                                             expectedZone: 'glad' },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/workshops/datasets/mad-sad-glad.ts
git commit -m "feat(mad-sad-glad): add classification dataset"
```

---

## Task 3: Main component

**Files:**
- Create: `src/components/MadSadGladAtelier/index.tsx`

- [ ] **Step 1: Create the component**

```tsx
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

const ZONES_DEF: { id: MadSadGladZone; label: string; icon: string; description: string; color: string }[] = [
  { id: 'mad',  label: 'Mad',  icon: '😠', description: 'Colère, irritation, injustice, tension ou frustration forte.', color: '#ef4444' },
  { id: 'sad',  label: 'Sad',  icon: '😢', description: 'Déception, regret, perte d\'énergie, tristesse ou démotivation.', color: '#3b82f6' },
  { id: 'glad', label: 'Glad', icon: '😊', description: 'Satisfaction, fierté, gratitude, confiance ou motivation.', color: '#22c55e' },
]

type EmotionCard = { id: string; text: string; correctZone: MadSadGladZone }
type Situation   = { id: string; text: string; correctZone: MadSadGladZone }

const PHASE1_CARDS: EmotionCard[] = [
  { id: 'mad-1',  text: 'J\'ai été agacé par les changements de priorité en plein Sprint.',                                        correctZone: 'mad' },
  { id: 'mad-2',  text: 'J\'ai trouvé injuste qu\'on nous reproche un retard causé par une dépendance externe.',                  correctZone: 'mad' },
  { id: 'mad-3',  text: 'Je me suis senti frustré par les décisions prises sans consulter l\'équipe.',                            correctZone: 'mad' },
  { id: 'mad-4',  text: 'J\'ai été énervé par les interruptions répétées pendant les phases de concentration.',                   correctZone: 'mad' },
  { id: 'sad-1',  text: 'J\'ai été déçu de ne pas réussir à terminer la User Story principale.',                                  correctZone: 'sad' },
  { id: 'sad-2',  text: 'J\'ai ressenti une perte d\'énergie après plusieurs réunions sans décision.',                            correctZone: 'sad' },
  { id: 'sad-3',  text: 'Je regrette qu\'on n\'ait pas mieux aidé le nouveau membre de l\'équipe.',                               correctZone: 'sad' },
  { id: 'sad-4',  text: 'J\'ai été démotivé par le manque de retour utilisateur sur notre travail.',                              correctZone: 'sad' },
  { id: 'glad-1', text: 'J\'ai été fier de voir l\'équipe résoudre ensemble l\'incident de production.',                          correctZone: 'glad' },
  { id: 'glad-2', text: 'J\'ai apprécié la disponibilité du Product Owner pendant le Sprint.',                                    correctZone: 'glad' },
  { id: 'glad-3', text: 'J\'ai été content que la démonstration se passe mieux que prévu.',                                       correctZone: 'glad' },
  { id: 'glad-4', text: 'J\'ai ressenti de la satisfaction quand l\'équipe a terminé moins de choses, mais mieux.',               correctZone: 'glad' },
]

const SITUATIONS: Situation[] = [
  { id: 's1',  text: 'Une User Story est ajoutée en urgence au milieu du Sprint sans discussion avec l\'équipe.',                                        correctZone: 'mad' },
  { id: 's2',  text: 'L\'équipe reçoit un reproche sur une livraison bloquée par une dépendance qu\'elle avait signalée depuis deux semaines.',          correctZone: 'mad' },
  { id: 's3',  text: 'Une décision technique est imposée en dehors de l\'équipe, sans explication claire.',                                              correctZone: 'mad' },
  { id: 's4',  text: 'Plusieurs interruptions externes empêchent l\'équipe de terminer les items engagés.',                                              correctZone: 'mad' },
  { id: 's5',  text: 'Un membre de l\'équipe coupe régulièrement la parole pendant les échanges.',                                                       correctZone: 'mad' },
  { id: 's6',  text: 'L\'équipe n\'a pas réussi à atteindre le Sprint Goal malgré un effort important.',                                                correctZone: 'sad' },
  { id: 's7',  text: 'Un nouveau membre est resté isolé pendant le Sprint, faute d\'accompagnement suffisant.',                                          correctZone: 'sad' },
  { id: 's8',  text: 'La Sprint Review attire peu de participants et génère peu de retours.',                                                             correctZone: 'sad' },
  { id: 's9',  text: 'Une amélioration décidée en rétrospective précédente n\'a pas été suivie.',                                                        correctZone: 'sad' },
  { id: 's10', text: 'L\'équipe constate que la dette technique augmente encore, sans temps dédié pour la traiter.',                                     correctZone: 'sad' },
  { id: 's11', text: 'Le Product Owner a clarifié rapidement plusieurs ambiguïtés pendant le Sprint.',                                                   correctZone: 'glad' },
  { id: 's12', text: 'Deux développeurs ont spontanément travaillé ensemble pour débloquer une anomalie complexe.',                                      correctZone: 'glad' },
  { id: 's13', text: 'La démonstration a reçu un retour utilisateur très positif.',                                                                      correctZone: 'glad' },
  { id: 's14', text: 'L\'équipe a osé réduire le périmètre pour préserver la qualité.',                                                                 correctZone: 'glad' },
  { id: 's15', text: 'Un incident a été traité collectivement, sans recherche de coupable.',                                                             correctZone: 'glad' },
]

const EMPTY_ZONES: EmotionZones = { mad: [], sad: [], glad: [] }

export function MadSadGladAtelier() {
  const { markComplete } = useWorkshopCompletion('mad-sad-glad')
  const definition = WORKSHOP_DEFINITIONS.find(w => w.id === 'mad-sad-glad')

  const [phase, setPhase] = useState<1 | 2>(1)
  const [emotionZones, setEmotionZones] = useState<EmotionZones>({ ...EMPTY_ZONES })
  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [dragging, setDragging] = useState<DraggingItem>(null)
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  // Phase 1 derived state
  const placedCardIds = new Set(ZONE_IDS.flatMap(z => emotionZones[z]))
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

  // ── Phase 1 handlers ──────────────────────────────────────────────────────
  function handleDragStartCard(cardId: string, fromZone?: MadSadGladZone) {
    setDragging({ type: 'emotion-card', cardId, fromZone })
  }

  function handleDropOnZone(zoneId: MadSadGladZone) {
    if (!dragging || dragging.type !== 'emotion-card') return
    const { cardId, fromZone } = dragging
    setEmotionZones(prev => {
      const next = { ...prev }
      if (fromZone) next[fromZone] = next[fromZone].filter(id => id !== cardId)
      next[zoneId] = [...next[zoneId].filter(id => id !== cardId), cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnPool1() {
    if (!dragging || dragging.type !== 'emotion-card') return
    const { cardId, fromZone } = dragging
    if (fromZone) {
      setEmotionZones(prev => ({ ...prev, [fromZone]: prev[fromZone].filter(id => id !== cardId) }))
    }
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    PHASE1_CARDS.forEach(card => {
      const placed = ZONE_IDS.find(z => emotionZones[z].includes(card.id))
      result[card.id] = placed === card.correctZone
    })
    setPhase1Result(result)
    if (Object.values(result).every(Boolean)) markComplete()
  }

  function handleRetryPhase1() {
    setPhase1Result(null)
    setEmotionZones({ ...EMPTY_ZONES })
  }

  function handleGoToPhase2() {
    setPhase(2)
    setPhase2Result(null)
    setSituationZones({})
  }

  // ── Phase 2 handlers ──────────────────────────────────────────────────────
  function handleDragStartSituation(situationId: string, fromZone?: MadSadGladZone) {
    setDragging({ type: 'situation', situationId, fromZone })
  }

  function handleDropSituationOnColumn(zoneId: MadSadGladZone) {
    if (!dragging || dragging.type !== 'situation') return
    const { situationId } = dragging
    setSituationZones(prev => ({ ...prev, [situationId]: zoneId }))
    setDragging(null)
  }

  function handleDropOnPool2() {
    if (!dragging || dragging.type !== 'situation') return
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
    SITUATIONS.forEach(s => {
      result[s.id] = situationZones[s.id] === s.correctZone
    })
    setPhase2Result(result)
    if (Object.values(result).every(Boolean)) markComplete()
  }

  function handleRetryPhase2() {
    setPhase2Result(null)
    setSituationZones({})
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="scrum-container">
      {showModal && <ConfirmLeaveModal onConfirm={confirm} onCancel={cancel} />}

      <div className="scrum-header">
        <h1 className="scrum-title">Mad / Sad / Glad</h1>
        <p className="scrum-subtitle">
          Mad / Sad / Glad aide l'équipe à mettre des mots sur ce qu'elle a ressenti pendant le Sprint.
          L'objectif n'est pas de se plaindre, mais de comprendre ce qui crée de la tension, de la déception ou de l'énergie positive.
        </p>
      </div>

      {definition && <WorkshopPedagogyPanel definition={definition} />}

      {/* ── PHASE 1 ── */}
      {phase === 1 && (
        <section className="scrum-section">
          <h2 className="scrum-section-title">Phase 1 — Identifier les 3 catégories émotionnelles</h2>
          <p className="scrum-section-desc">
            Glisse chaque carte dans la colonne correspondant à l'émotion qu'elle exprime.
          </p>

          <div className="tki-columns">
            {ZONES_DEF.map(zone => {
              const zoneCards = emotionZones[zone.id]
                .map(id => PHASE1_CARDS.find(c => c.id === id)!)
                .filter(Boolean)
              const isHover = dragging?.type === 'emotion-card'
              return (
                <div
                  key={zone.id}
                  className={`msg-column${isHover ? ' msg-column--hover' : ''}`}
                  data-column={zone.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnZone(zone.id)}
                >
                  <div className="msg-column-header" style={{ '--msg-color': zone.color } as React.CSSProperties}>
                    <span className="msg-column-icon">{zone.icon}</span>
                    <span className="msg-column-label">{zone.label}</span>
                    <span className="msg-column-desc">{zone.description}</span>
                  </div>
                  <div className="msg-column-cards">
                    {zoneCards.map(card => {
                      const state = phase1Result
                        ? phase1Result[card.id] ? 'correct' : 'wrong'
                        : 'default'
                      return (
                        <div
                          key={card.id}
                          className={`tki-situation-card tki-situation-card--${state}`}
                          data-card={card.id}
                          draggable={!phase1Result}
                          onDragStart={() => handleDragStartCard(card.id, zone.id)}
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
                  className="tki-situation-card tki-situation-card--default"
                  data-card={card.id}
                  draggable
                  onDragStart={() => handleDragStartCard(card.id)}
                >
                  {card.text}
                </div>
              ))}
            </div>
          </div>

          <div className="scrum-actions">
            {!phase1Result && (
              <button
                className="btn btn--primary"
                disabled={!phase1AllPlaced}
                onClick={handleVerifyPhase1}
              >
                Vérifier
              </button>
            )}
            {phase1Result && !phase1Perfect && (
              <button className="btn btn--secondary" onClick={handleRetryPhase1}>
                Réessayer
              </button>
            )}
            {phase1Result && phase1Perfect && (
              <button className="btn btn--primary" onClick={handleGoToPhase2}>
                Phase suivante →
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── PHASE 2 ── */}
      {phase === 2 && (
        <section className="scrum-section">
          <h2 className="scrum-section-title">Phase 2 — Lire les émotions derrière les situations de Sprint</h2>
          <p className="scrum-section-desc">
            Associe chaque situation vécue en Sprint à la catégorie émotionnelle correspondante.
          </p>

          <div className="tki-columns">
            {ZONES_DEF.map(zone => {
              const zoneSituations = SITUATIONS.filter(s => situationZones[s.id] === zone.id)
              const isHover = dragging?.type === 'situation'
              return (
                <div
                  key={zone.id}
                  className={`msg-column${isHover ? ' msg-column--hover' : ''}`}
                  data-column={zone.id}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropSituationOnColumn(zone.id)}
                >
                  <div className="msg-column-header" style={{ '--msg-color': zone.color } as React.CSSProperties}>
                    <span className="msg-column-icon">{zone.icon}</span>
                    <span className="msg-column-label">{zone.label}</span>
                    <span className="msg-column-desc">{zone.description}</span>
                  </div>
                  <div className="msg-column-cards">
                    {zoneSituations.map(sit => {
                      const state = phase2Result
                        ? phase2Result[sit.id] ? 'correct' : 'wrong'
                        : 'default'
                      return (
                        <div
                          key={sit.id}
                          className={`tki-situation-card tki-situation-card--${state}`}
                          data-situation={sit.id}
                          draggable={!phase2Result}
                          onDragStart={() => handleDragStartSituation(sit.id, zone.id)}
                        >
                          {sit.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {phase2Result !== null && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === SITUATIONS.length ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / {SITUATIONS.length} correct
                {phase2Score === SITUATIONS.length ? ' — Maîtrisé !' : ''}
              </span>
              {phase2Score === SITUATIONS.length ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Tu sais relier des situations concrètes de Sprint aux émotions qu'elles peuvent générer dans l'équipe.
                </p>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  À consolider : certaines émotions sont proches, mais il faut mieux distinguer irritation, déception et satisfaction.
                </p>
              )}
            </div>
          )}

          <div
            className="tki-pool"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropOnPool2}
          >
            <p className="scrum-palette__title">Situations à classer</p>
            <div className="tki-pool__cards">
              {poolSituations.map(sit => (
                <div
                  key={sit.id}
                  className="tki-situation-card tki-situation-card--default"
                  data-situation={sit.id}
                  draggable={!phase2Result}
                  onDragStart={() => handleDragStartSituation(sit.id)}
                >
                  {sit.text}
                </div>
              ))}
            </div>
          </div>

          <div className="scrum-actions">
            {!phase2Result && (
              <button
                className="btn btn--primary"
                disabled={!phase2AllPlaced}
                onClick={handleVerifyPhase2}
              >
                Vérifier
              </button>
            )}
            {phase2Result && phase2Score < SITUATIONS.length && (
              <button className="btn btn--secondary" onClick={handleRetryPhase2}>
                Réessayer phase 2
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run tests — confirm they still fail (no CSS classes yet, but component exists)**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/MadSadGladAtelier 2>&1 | tail -20
```

Expected: Tests may fail due to missing CSS or import errors — that's OK at this step.

- [ ] **Step 3: Commit the component**

```bash
git add src/components/MadSadGladAtelier/index.tsx
git commit -m "feat(mad-sad-glad): add MadSadGladAtelier component"
```

---

## Task 4: CSS classes

**Files:**
- Modify: `src/index.css` (append `msg-*` block after the `sf-*` block)

- [ ] **Step 1: Find the end of the sf-* block to know where to append**

```bash
grep -n "sf-starfish-img\|@media.*700px.*sf-scene" "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim/src/index.css" | tail -5
```

Note the line number of the closing `}` of the last `sf-*` media query block — append after it.

- [ ] **Step 2: Append the msg-* CSS block to `src/index.css`**

Add this after the last `sf-*` block (including its `@media` rule):

```css
/* ── Mad / Sad / Glad ─────────────────────────────────────────────────── */

.msg-column {
  background: rgba(255, 255, 255, 0.92);
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  min-height: 140px;
  transition: border-color 0.15s, background 0.15s;
}

.msg-column--hover {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.08);
}

.msg-column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding-bottom: 0.625rem;
  border-bottom: 2px solid var(--msg-color, #94a3b8);
  margin-bottom: 0.625rem;
}

.msg-column-icon {
  font-size: 2rem;
  line-height: 1;
}

.msg-column-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--msg-color, #1e293b);
}

.msg-column-desc {
  font-size: 0.68rem;
  color: #64748b;
  text-align: center;
  line-height: 1.35;
}

.msg-column-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
```

- [ ] **Step 3: Run tests — all 11 should pass**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/MadSadGladAtelier 2>&1 | tail -10
```

Expected: 11 passed (11)

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat(mad-sad-glad): add msg-* CSS classes"
```

---

## Task 5: Register in definitions + routing

**Files:**
- Modify: `src/data/workshops/definitions.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import to `src/data/workshops/definitions.ts`**

After line 21 (`import { starfishRetrospectiveDataset } from './datasets/starfish-retrospective'`), add:

```ts
import { madSadGladDataset } from './datasets/mad-sad-glad'
```

- [ ] **Step 2: Add EXISTING entry in `src/data/workshops/definitions.ts`**

After the closing `}` of the starfish entry (after `dataset: starfishRetrospectiveDataset,` closing block, before `]`), insert:

```ts
  {
    id: 'mad-sad-glad',
    slug: 'mad-sad-glad',
    title: 'Mad / Sad / Glad',
    route: '/ateliers/mad-sad-glad',
    categorySlug: 'retrospectives',
    toolName: 'Mad/Sad/Glad',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Explorer les émotions de l'équipe autour du Sprint : colère, déception et satisfaction.",
    pedagogy: {
      objectives: [
        'Distinguer colère, déception et satisfaction dans une rétrospective',
        'Nommer une émotion sans juger la personne qui l\'exprime',
        'Relier une émotion à une situation concrète de Sprint',
        'Transformer les émotions exprimées en apprentissages et pistes d\'amélioration',
      ],
      toolExplanation: "Mad / Sad / Glad aide l'équipe à mettre des mots sur ce qu'elle a ressenti pendant le Sprint. L'objectif n'est pas de se plaindre, mais de comprendre ce qui crée de la tension, de la déception ou de l'énergie positive — et de transformer ces ressentis en apprentissages utiles.",
      whenToUse: [
        'En rétrospective de Sprint pour explorer les émotions de l\'équipe',
        'Quand le climat émotionnel est tendu et qu\'il faut nommer ce qui se passe',
        'Pour sortir d\'une rétrospective purement fonctionnelle et accueillir le vécu humain',
      ],
      expectedOutput: [
        'Identification correcte des 3 registres émotionnels : Mad, Sad, Glad',
        'Classification de situations Scrum dans les 3 registres',
      ],
    },
    dataset: madSadGladDataset,
  },
```

- [ ] **Step 3: Remove the COMING_SOON stub for mad-sad-glad**

Find and delete the line (around line 692):
```ts
  { id: 'mad-sad-glad', slug: 'mad-sad-glad', title: 'Mad/Sad/Glad', route: '/ateliers/mad-sad-glad', categorySlug: 'retrospectives', toolName: 'Mad/Sad/Glad', level: 'beginner', durationMinutes: 20, interactionType: 'canvas', summary: "Explorer les émotions de l'équipe autour du sprint.", comingSoon: true },
```

- [ ] **Step 4: Add import + route to `src/App.tsx`**

After `import { StarfishRetrospectiveAtelier } from './components/StarfishRetrospectiveAtelier'`, add:
```tsx
import { MadSadGladAtelier } from './components/MadSadGladAtelier'
```

After `{ path: '/ateliers/starfish', element: <StarfishRetrospectiveAtelier /> }`, add:
```tsx
{ path: '/ateliers/mad-sad-glad', element: <MadSadGladAtelier /> },
```

- [ ] **Step 5: Run the full test suite to confirm no regressions**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run 2>&1 | tail -15
```

Expected: all test files pass, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add src/data/workshops/definitions.ts src/data/workshops/datasets/mad-sad-glad.ts src/App.tsx
git commit -m "feat(mad-sad-glad): register atelier in definitions and routing"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Phase 1: 12 cards (4 Mad, 4 Sad, 4 Glad), 3 columns with emoji icon + label + description
- ✅ Phase 2: 15 situations (5 Mad, 5 Sad, 5 Glad), same column structure
- ✅ Drag-and-drop with pool return
- ✅ Vérifier disabled until all cards placed
- ✅ 12/12 → Phase suivante; <12 → Réessayer
- ✅ 15/15 → Maîtrisé; <15 → Réessayer phase 2
- ✅ Phase 1 must be 100% before Phase 2 unlocks
- ✅ `[data-card]`, `[data-column]`, `[data-situation]` attributes for tests
- ✅ `.tki-pool` class for pool drop zone (reuses existing CSS)
- ✅ `useWorkshopCompletion('mad-sad-glad')` for gamification
- ✅ `useExitGuard` for dirty-state protection
- ✅ COMING_SOON stub removed

**Placeholder scan:** None found — all code blocks are complete and executable.

**Type consistency:** `MadSadGladZone` used consistently across all types, handlers, and data arrays. `[data-card]` in Phase 1, `[data-situation]` in Phase 2 — consistent with test helpers.
