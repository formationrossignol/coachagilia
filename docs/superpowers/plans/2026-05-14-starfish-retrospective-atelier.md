# Starfish Retrospective Atelier — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier teaching the Starfish Retrospective framework (More of / Less of / Start / Stop / Keep).

**Architecture:** Single `index.tsx` component with embedded types and data, HTML5 drag-and-drop, two phases gated by 15/15 Phase 1 score — mirrors the SailboatRetrospectiveAtelier pattern exactly. Phase 1 uses a star spatial layout; Phase 2 uses a 5-column layout.

**Tech Stack:** React 18, TypeScript, HTML5 Drag-and-Drop API, Vitest, React Testing Library, existing CSS classes (`tki-pool`, `tki-situation-card`, `tki-columns`, `scrum-actions`, `badge`, new `sf-scene`/`sf-zone` classes modelled on `sb-scene`/`sb-zone`).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/StarfishRetrospectiveAtelier/index.tsx` | Main component — types, data, state, drag logic, render |
| Create | `src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx` | All tests |
| Create | `src/data/workshops/datasets/starfish-retrospective.ts` | Zone/card metadata for WorkshopPedagogyPanel |
| Modify | `src/data/workshops/definitions.ts` | Add starfish entry to EXISTING array |
| Modify | `src/App.tsx` | Import component + add `/ateliers/starfish` route |

---

## Reference Data (used in tasks below)

### Zone IDs
```
'more-of' | 'less-of' | 'start' | 'stop' | 'keep'
```

### Phase 1 card → correct zone mapping
```
p1c1→more-of, p1c2→more-of, p1c3→more-of
p1c4→less-of, p1c5→less-of, p1c6→less-of
p1c7→start,   p1c8→start,   p1c9→start
p1c10→stop,   p1c11→stop,   p1c12→stop
p1c13→keep,   p1c14→keep,   p1c15→keep
```

### Phase 2 situation → correct zone mapping
```
s1→more-of, s2→more-of, s3→more-of
s4→less-of, s5→less-of, s6→less-of
s7→start,   s8→start,   s9→start
s10→stop,   s11→stop,   s12→stop
s13→keep,   s14→keep,   s15→keep
```

---

## Task 1: Write failing tests

**Files:**
- Create: `src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx`

- [ ] **Step 1.1: Create the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { StarfishRetrospectiveAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'starfish',
      slug: 'starfish',
      title: 'Rétrospective Starfish',
      route: '/ateliers/starfish',
      categorySlug: 'retrospectives',
      toolName: 'Starfish Retrospective',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Nuancer l'amélioration continue : amplifier, réduire, commencer, arrêter et conserver.",
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
    [{ path: '/ateliers/starfish', element: <StarfishRetrospectiveAtelier /> }],
    { initialEntries: ['/ateliers/starfish'] }
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
  ['p1c1', 'more-of'], ['p1c2', 'more-of'], ['p1c3', 'more-of'],
  ['p1c4', 'less-of'], ['p1c5', 'less-of'], ['p1c6', 'less-of'],
  ['p1c7', 'start'], ['p1c8', 'start'], ['p1c9', 'start'],
  ['p1c10', 'stop'], ['p1c11', 'stop'], ['p1c12', 'stop'],
  ['p1c13', 'keep'], ['p1c14', 'keep'], ['p1c15', 'keep'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'more-of'], ['s2', 'more-of'], ['s3', 'more-of'],
  ['s4', 'less-of'], ['s5', 'less-of'], ['s6', 'less-of'],
  ['s7', 'start'], ['s8', 'start'], ['s9', 'start'],
  ['s10', 'stop'], ['s11', 'stop'], ['s12', 'stop'],
  ['s13', 'keep'], ['s14', 'keep'], ['s15', 'keep'],
]

describe('StarfishRetrospectiveAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 15 cards in pool', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(15)
  })

  it('Vérifier button is disabled until all 15 cards are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a card in a zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('p1c1', 'more-of')
    const zone = document.querySelector('[data-column="more-of"]')!
    expect(zone.querySelector('[data-card="p1c1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('p1c1', 'more-of')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-column="more-of"] [data-card="p1c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="p1c1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['p1c1','p1c2','p1c3'].forEach(id => dragCard(id, 'stop'))
    ;['p1c4','p1c5','p1c6'].forEach(id => dragCard(id, 'more-of'))
    ;['p1c7','p1c8','p1c9'].forEach(id => dragCard(id, 'keep'))
    ;['p1c10','p1c11','p1c12'].forEach(id => dragCard(id, 'start'))
    ;['p1c13','p1c14','p1c15'].forEach(id => dragCard(id, 'less-of'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'more-of')
    const column = document.querySelector('[data-column="more-of"]')!
    expect(column.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'stop'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'more-of'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'stop'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'more-of'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 1.2: Run tests and confirm they fail with module-not-found**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx 2>&1 | head -30
```

Expected: `Error: Cannot find module './index'` or similar — test file cannot import non-existent component.

---

## Task 2: Scaffold stub component

**Files:**
- Create: `src/components/StarfishRetrospectiveAtelier/index.tsx`

- [ ] **Step 2.1: Create a minimal stub so tests can import and run (but fail)**

```typescript
export function StarfishRetrospectiveAtelier() {
  return <div>stub</div>
}
```

- [ ] **Step 2.2: Run tests and confirm they fail with meaningful assertion errors (not import errors)**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx 2>&1 | tail -30
```

Expected: Tests fail with assertion errors like `Unable to find text: Phase 1`.

---

## Task 3: Implement the full component

**Files:**
- Modify: `src/components/StarfishRetrospectiveAtelier/index.tsx`

- [ ] **Step 3.1: Replace stub with full implementation**

```typescript
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
                    ? 'Tu sais utiliser Starfish pour transformer une rétrospective en décisions d\'amélioration plus précises.'
                    : 'À consolider : certaines dimensions sont proches, mais il faut mieux distinguer réduire, arrêter, amplifier et conserver.'}
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

- [ ] **Step 3.2: Run tests and verify all pass**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx
```

Expected: `✓ StarfishRetrospectiveAtelier (11 tests)` — all pass.

- [ ] **Step 3.3: Commit the component and tests**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
git add src/components/StarfishRetrospectiveAtelier/index.tsx src/components/StarfishRetrospectiveAtelier/StarfishRetrospectiveAtelier.test.tsx
git commit -m "feat(starfish): add StarfishRetrospectiveAtelier component with tests"
```

---

## Task 4: Create dataset file

**Files:**
- Create: `src/data/workshops/datasets/starfish-retrospective.ts`

- [ ] **Step 4.1: Create the dataset**

```typescript
import type { ClassificationDataset } from '../types'

export const starfishRetrospectiveDataset: ClassificationDataset = {
  zones: [
    { id: 'more-of', label: 'More of', description: 'Ce qui fonctionne déjà et devrait être fait davantage.' },
    { id: 'less-of', label: 'Less of', description: 'Ce qui peut rester utile, mais doit être réduit ou allégé.' },
    { id: 'start',   label: 'Start',   description: "Ce que l'équipe devrait commencer à tester ou mettre en place." },
    { id: 'stop',    label: 'Stop',    description: "Ce qui nuit clairement à l'équipe et devrait être arrêté." },
    { id: 'keep',    label: 'Keep',    description: 'Ce qui fonctionne bien et doit être conservé.' },
  ],
  cards: [
    { id: 's1',  text: "Les ateliers de refinement avec exemples concrets ont fortement amélioré la compréhension des User Stories.", expectedZone: 'more-of' },
    { id: 's2',  text: "Les binômes ponctuels ont permis de résoudre plus vite les sujets techniques difficiles.",                  expectedZone: 'more-of' },
    { id: 's3',  text: "Les échanges informels avec les utilisateurs ont apporté des retours très utiles.",                          expectedZone: 'more-of' },
    { id: 's4',  text: "Les réunions d'alignement sont parfois utiles, mais elles deviennent trop nombreuses.",                     expectedZone: 'less-of' },
    { id: 's5',  text: "Les discussions techniques sont nécessaires, mais elles prennent souvent toute la rétrospective.",           expectedZone: 'less-of' },
    { id: 's6',  text: "Les ajustements de priorité sont parfois justifiés, mais leur fréquence perturbe le Sprint.",               expectedZone: 'less-of' },
    { id: 's7',  text: "L'équipe découvre trop tard certaines dépendances avec d'autres équipes.",                                  expectedZone: 'start' },
    { id: 's8',  text: "Les critères d'acceptation sont souvent clarifiés seulement après le démarrage du développement.",          expectedZone: 'start' },
    { id: 's9',  text: "Les actions de rétrospective sont oubliées après quelques jours.",                                          expectedZone: 'start' },
    { id: 's10', text: "L'équipe commence régulièrement de nouvelles tâches alors que plusieurs items sont presque terminés.",       expectedZone: 'stop' },
    { id: 's11', text: "Des anomalies connues sont ignorées pour afficher artificiellement une story comme terminée.",               expectedZone: 'stop' },
    { id: 's12', text: "Les décisions prises en réunion sont remises en cause hors réunion sans transparence.",                     expectedZone: 'stop' },
    { id: 's13', text: "La Sprint Review est courte, concrète et centrée sur les retours utilisateurs.",                            expectedZone: 'keep' },
    { id: 's14', text: "Le Daily Scrum reste focalisé sur l'objectif de Sprint plutôt que sur un reporting individuel.",             expectedZone: 'keep' },
    { id: 's15', text: "L'équipe prend le temps de célébrer les apprentissages importants, même quand tout n'a pas fonctionné.",     expectedZone: 'keep' },
  ],
}
```

---

## Task 5: Register the workshop definition

**Files:**
- Modify: `src/data/workshops/definitions.ts`

- [ ] **Step 5.1: Add the dataset import at the top of definitions.ts**

After line 20 (`import { sailboatRetrospectiveDataset } ...`), add:

```typescript
import { starfishRetrospectiveDataset } from './datasets/starfish-retrospective'
```

- [ ] **Step 5.2: Add the starfish entry to the EXISTING array**

After the sailboat entry (which closes at line 608 with `},`), and before the closing `]` on line 609, insert:

```typescript
  {
    id: 'starfish',
    slug: 'starfish',
    title: 'Rétrospective Starfish',
    route: '/ateliers/starfish',
    categorySlug: 'retrospectives',
    toolName: 'Starfish Retrospective',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Nuancer l'amélioration continue en 5 dimensions : amplifier, réduire, commencer, arrêter et conserver.",
    pedagogy: {
      objectives: [
        'Identifier les 5 dimensions de la Starfish Retrospective',
        'Distinguer Less of et Stop',
        'Distinguer More of et Keep',
        'Transformer des constats de rétrospective en intentions d\'amélioration claires',
      ],
      toolExplanation: "La Starfish Retrospective aide l'équipe à nuancer son amélioration continue. Tout ne doit pas être seulement gardé ou supprimé : certaines pratiques méritent d'être amplifiées (More of), réduites (Less of), commencées (Start), arrêtées (Stop) ou préservées (Keep).",
      whenToUse: [
        'En rétrospective de Sprint pour dépasser le simple bien/mal',
        "Pour différencier ce qui doit être amplifié de ce qui doit être supprimé",
        'Pour produire des actions d\'amélioration plus précises et actionnables',
      ],
      expectedOutput: [
        'Identification correcte des 5 dimensions Starfish',
        'Classification de situations Scrum dans les 5 dimensions',
      ],
    },
    dataset: starfishRetrospectiveDataset,
  },
```

- [ ] **Step 5.3: Verify TypeScript compiles cleanly**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx tsc --noEmit 2>&1 | head -20
```

Expected: No output (no errors).

---

## Task 6: Register the route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 6.1: Add the import on line 30 (after the SailboatRetrospectiveAtelier import)**

After `import { SailboatRetrospectiveAtelier } from './components/SailboatRetrospectiveAtelier'` (line 30), add:

```typescript
import { StarfishRetrospectiveAtelier } from './components/StarfishRetrospectiveAtelier'
```

- [ ] **Step 6.2: Add the route after the sailboat route (line 86)**

After `{ path: '/ateliers/sailboat', element: <SailboatRetrospectiveAtelier /> },`, add:

```typescript
      { path: '/ateliers/starfish', element: <StarfishRetrospectiveAtelier /> },
```

- [ ] **Step 6.3: Verify TypeScript compiles cleanly**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx tsc --noEmit 2>&1 | head -20
```

Expected: No output (no errors).

- [ ] **Step 6.4: Run the full test suite to confirm no regressions**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run 2>&1 | tail -20
```

Expected: All tests pass. The new StarfishRetrospectiveAtelier suite shows 11 passing tests.

---

## Task 7: Final commit

- [ ] **Step 7.1: Commit the registration files**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
git add src/data/workshops/datasets/starfish-retrospective.ts src/data/workshops/definitions.ts src/App.tsx
git commit -m "feat(starfish): register StarfishRetrospectiveAtelier in definitions and routing"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Covered by |
|---|---|
| Phase 1: 15 cards, 5 zones (more-of/less-of/start/stop/keep) | Task 3 — PHASE1_CARDS + SCENE_ZONES |
| Phase 1: must be 15/15 to proceed | Task 3 — `phase1Perfect` gate |
| Phase 2: 15 situations in 5 columns | Task 3 — SITUATIONS + ZONES_DEF |
| Phase 2: Réessayer phase 2 without re-doing phase 1 | Task 3 — `handleResetPhase2` |
| Badge vert Maîtrisé si 15/15 | Task 3 — `badge--green` + "Maîtrisé" text |
| Badge orange si < 15/15 | Task 3 — `badge--orange` |
| Exit guard protecting unsaved work | Task 3 — `useExitGuard` + `isDirty` |
| Gamification completion tracking | Task 3 — `useWorkshopCompletion` + `markComplete()` |
| WorkshopPedagogyPanel | Task 3 — panel rendered with `workshopDef` |
| Dataset for metadata | Task 4 — `starfish-retrospective.ts` |
| Workshop definition with pedagogy | Task 5 — definitions.ts entry |
| Accessible via `/ateliers/starfish` | Task 6 — App.tsx route |

### Type consistency check

- `StarfishZone` used consistently throughout component: ✓
- `ZONE_IDS` used to compute `placedCardIds` in Phase 1: ✓
- `EMPTY_ZONES` initializes all 5 zones with `[]`: ✓
- `data-column` attributes on zones match `StarfishZone` string values: ✓ (tests use same IDs)
- `data-card` attributes use card `id` field: ✓
- `data-situation` attributes use situation `id` field: ✓
- Dataset IDs use `'more-of'` and `'less-of'` (with hyphens) — TypeScript `ClassificationDataset` uses `string` for zone IDs so no type error: ✓
