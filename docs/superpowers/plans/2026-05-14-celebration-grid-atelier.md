# Celebration Grid Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier teaching the Celebration Grid (Management 3.0), where learners classify cards into a 2×3 matrix (Behavior × Outcome) then associate Scrum situations to the correct zones.

**Architecture:** Single component file with all data inline (same pattern as MadSadGladAtelier). Phase 1: 12 cards → 6 grid zones. Phase 2: 15 situations → 6 grid zones. The visual grid uses nested flexbox/CSS-grid to approximate the reference Celebration Grid image (COMPORTEMENT header, RÉSULTAT axis, 3 behavior columns × 2 outcome rows, APPRENTISSAGE footer).

**Tech Stack:** React 18 + TypeScript, HTML5 native drag-and-drop, Vitest + React Testing Library, CSS custom properties for zone colors.

---

## File Map

| Action | Path |
|--------|------|
| Create | `src/components/CelebrationGridAtelier/index.tsx` |
| Create | `src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx` |
| Modify | `src/index.css` — append `cg-*` CSS block |
| Modify | `src/data/workshops/definitions.ts` — promote from `COMING_SOON` to `EXISTING` |
| Modify | `src/App.tsx` — add import + route |

---

### Task 1: Write failing tests (TDD)

**Files:**
- Create: `src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx`

- [ ] **Step 1: Create the test file**

```typescript
// src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { CelebrationGridAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'celebration-grid',
      slug: 'celebration-grid',
      title: 'Celebration Grid',
      route: '/ateliers/celebration-grid',
      categorySlug: 'management-3-0',
      toolName: 'Celebration Grid',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'matrix',
      summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.',
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
    [{ path: '/ateliers/celebration-grid', element: <CelebrationGridAtelier /> }],
    { initialEntries: ['/ateliers/celebration-grid'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, zoneId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, zoneId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

const CORRECT_P1: [string, string][] = [
  ['mistake-success-1', 'mistake-success'],
  ['mistake-success-2', 'mistake-success'],
  ['mistake-failure-1', 'mistake-failure'],
  ['mistake-failure-2', 'mistake-failure'],
  ['experiment-success-1', 'experiment-success'],
  ['experiment-success-2', 'experiment-success'],
  ['experiment-failure-1', 'experiment-failure'],
  ['experiment-failure-2', 'experiment-failure'],
  ['practice-success-1', 'practice-success'],
  ['practice-success-2', 'practice-success'],
  ['practice-failure-1', 'practice-failure'],
  ['practice-failure-2', 'practice-failure'],
]

const CORRECT_P2: [string, string][] = [
  ['situation-1', 'mistake-success'],
  ['situation-2', 'mistake-success'],
  ['situation-3', 'mistake-failure'],
  ['situation-4', 'mistake-failure'],
  ['situation-5', 'mistake-failure'],
  ['situation-6', 'experiment-success'],
  ['situation-7', 'experiment-success'],
  ['situation-8', 'experiment-success'],
  ['situation-9', 'experiment-failure'],
  ['situation-10', 'experiment-failure'],
  ['situation-11', 'experiment-failure'],
  ['situation-12', 'practice-success'],
  ['situation-13', 'practice-success'],
  ['situation-14', 'practice-failure'],
  ['situation-15', 'practice-failure'],
]

describe('CelebrationGridAtelier', () => {
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

  it('places a card in a zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('mistake-success-1', 'mistake-success')
    const zone = document.querySelector('[data-zone="mistake-success"]')!
    expect(zone.querySelector('[data-card="mistake-success-1"]')).toBeInTheDocument()
  })

  it('returns a card to pool on drop on pool', () => {
    renderAtelier()
    dragCard('mistake-success-1', 'mistake-success')
    const pool = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="mistake-success"] [data-card="mistake-success-1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(pool)
    fireEvent.drop(pool)
    expect(document.querySelector('.tki-pool [data-card="mistake-success-1"]')).toBeInTheDocument()
  })

  it('shows 12/12 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    // place all in wrong zones
    ;['mistake-success-1', 'mistake-success-2'].forEach(id => dragCard(id, 'practice-failure'))
    ;['mistake-failure-1', 'mistake-failure-2'].forEach(id => dragCard(id, 'practice-success'))
    ;['experiment-success-1', 'experiment-success-2'].forEach(id => dragCard(id, 'mistake-failure'))
    ;['experiment-failure-1', 'experiment-failure-2'].forEach(id => dragCard(id, 'mistake-success'))
    ;['practice-success-1', 'practice-success-2'].forEach(id => dragCard(id, 'experiment-failure'))
    ;['practice-failure-1', 'practice-failure-2'].forEach(id => dragCard(id, 'experiment-success'))
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

  it('places a situation in a zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('situation-1', 'mistake-success')
    const zone = document.querySelector('[data-zone="mistake-success"]')!
    expect(zone.querySelector('[data-situation="situation-1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, zone]) => dragSituation(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['situation-1','situation-2','situation-3','situation-4','situation-5'].forEach(id => dragSituation(id, 'practice-success'))
    ;['situation-6','situation-7','situation-8','situation-9','situation-10'].forEach(id => dragSituation(id, 'mistake-failure'))
    ;['situation-11','situation-12','situation-13','situation-14','situation-15'].forEach(id => dragSituation(id, 'experiment-failure'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([card, zone]) => dragCard(card, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['situation-1','situation-2','situation-3','situation-4','situation-5'].forEach(id => dragSituation(id, 'practice-success'))
    ;['situation-6','situation-7','situation-8','situation-9','situation-10'].forEach(id => dragSituation(id, 'mistake-failure'))
    ;['situation-11','situation-12','situation-13','situation-14','situation-15'].forEach(id => dragSituation(id, 'experiment-failure'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail (component does not exist yet)**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx 2>&1 | tail -20
```

Expected: FAIL — "Cannot find module './index'"

- [ ] **Step 3: Commit the test file**

```bash
git add src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx
git commit -m "test(celebration-grid): add 11 tests for both phases"
```

---

### Task 2: Create the main component

**Files:**
- Create: `src/components/CelebrationGridAtelier/index.tsx`

- [ ] **Step 1: Create the component file**

```typescript
// src/components/CelebrationGridAtelier/index.tsx
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
    const { cardId, fromZone } = dragging
    setGridZones(prev => ({ ...prev, [fromZone!]: prev[fromZone!].filter(id => id !== cardId) }))
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
              : 'Phase 2 / 2 — Associez chaque situation Scrum à la zone correspondante de la grille.'}
          </p>
        </header>

        {/* ── PHASE 1 ── */}
        {phase === 1 && (
          <>
            <div className="cg-visual">
              {/* Top: COMPORTEMENT header */}
              <div className="cg-top">
                <div className="cg-axis-spacer" />
                <div className="cg-behavior-band">COMPORTEMENT</div>
              </div>

              {/* Middle: RÉSULTAT axis + matrix */}
              <div className="cg-middle">
                <div className="cg-outcome-axis"><span>RÉSULTAT</span></div>
                <div className="cg-matrix">
                  {/* Column headers */}
                  <div className="cg-matrix-row cg-matrix-row--headers">
                    <div className="cg-row-spacer" />
                    <div className="cg-col-header cg-col-header--mistake">Erreurs</div>
                    <div className="cg-col-header cg-col-header--experiment">Expérimentations</div>
                    <div className="cg-col-header cg-col-header--practice">Pratiques</div>
                  </div>

                  {/* Data rows */}
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

              {/* Bottom: APPRENTISSAGE band */}
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
              {/* Top: COMPORTEMENT header */}
              <div className="cg-top">
                <div className="cg-axis-spacer" />
                <div className="cg-behavior-band">COMPORTEMENT</div>
              </div>

              {/* Middle: RÉSULTAT axis + matrix */}
              <div className="cg-middle">
                <div className="cg-outcome-axis"><span>RÉSULTAT</span></div>
                <div className="cg-matrix">
                  {/* Column headers */}
                  <div className="cg-matrix-row cg-matrix-row--headers">
                    <div className="cg-row-spacer" />
                    <div className="cg-col-header cg-col-header--mistake">Erreurs</div>
                    <div className="cg-col-header cg-col-header--experiment">Expérimentations</div>
                    <div className="cg-col-header cg-col-header--practice">Pratiques</div>
                  </div>

                  {/* Data rows */}
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

              {/* Bottom: APPRENTISSAGE band */}
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
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx 2>&1 | tail -20
```

Expected: 11/11 PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/CelebrationGridAtelier/index.tsx
git commit -m "feat(celebration-grid): add two-phase drag-and-drop component"
```

---

### Task 3: Add CSS classes

**Files:**
- Modify: `src/index.css` — append at end of file

- [ ] **Step 1: Append the CSS block**

Add at the very end of `src/index.css`:

```css
/* ── Celebration Grid ─────────────────────────────────────────────────── */

.cg-visual {
  width: 100%;
  margin: 1.5rem 0;
}

/* Top: COMPORTEMENT header row */
.cg-top,
.cg-bottom {
  display: flex;
  align-items: stretch;
  margin-bottom: 0.25rem;
}
.cg-bottom {
  margin-top: 0.25rem;
  margin-bottom: 0;
}
.cg-axis-spacer {
  width: 2.5rem;
  flex-shrink: 0;
}
.cg-behavior-band {
  flex: 1;
  text-align: center;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: #1e293b;
  color: #fff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem 0.375rem 0 0;
}

/* Middle: outcome axis + matrix */
.cg-middle {
  display: flex;
  gap: 0.25rem;
}
.cg-outcome-axis {
  width: 2.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #475569;
}
.cg-matrix {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Rows: column headers + zone rows share same grid template */
.cg-matrix-row {
  display: grid;
  grid-template-columns: 4.5rem 1fr 1fr 1fr;
  gap: 0.25rem;
}
.cg-row-spacer {
  /* placeholder to align headers with zone rows */
}

/* Column headers */
.cg-col-header {
  text-align: center;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.375rem 0.25rem;
  border-radius: 0.25rem;
}
.cg-col-header--mistake    { background: #f1f5f9; color: #475569; }
.cg-col-header--experiment { background: #ccfbf1; color: #0f766e; }
.cg-col-header--practice   { background: #dcfce7; color: #15803d; }

/* Row labels (Succès / Échec) */
.cg-row-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 0.25rem;
  padding: 0.25rem;
  text-align: center;
}
.cg-row-label--success { background: #dcfce7; color: #15803d; }
.cg-row-label--failure { background: #fee2e2; color: #dc2626; }

/* Drop zones */
.cg-zone {
  min-height: 110px;
  border: 2px dashed var(--cg-zone-color, #94a3b8);
  background: var(--cg-zone-bg, #f8fafc);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  transition: border-color 0.15s, background 0.15s;
}
.cg-zone--hover {
  border-style: solid;
  filter: brightness(0.96);
}
.cg-zone-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cg-zone-color, #64748b);
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--cg-zone-color, #94a3b8);
  margin-bottom: 0.125rem;
  opacity: 0.9;
}
.cg-zone-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* Bottom: APPRENTISSAGE row */
.cg-learning-row {
  flex: 1;
  display: grid;
  grid-template-columns: 4.5rem 1fr 2fr 1fr;
  gap: 0.25rem;
}
.cg-no-learning {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.68rem;
  color: #94a3b8;
  background: #f1f5f9;
  border-radius: 0.375rem;
  padding: 0.5rem 0.25rem;
}
.cg-learning-title {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: #fef08a;
  color: #854d0e;
  border-radius: 0.375rem;
  padding: 0.5rem;
}
```

- [ ] **Step 2: Run tests to verify nothing broke**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npx vitest run src/components/CelebrationGridAtelier/CelebrationGridAtelier.test.tsx 2>&1 | tail -10
```

Expected: 11/11 PASS

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(celebration-grid): add cg-* CSS classes for grid visual"
```

---

### Task 4: Register in definitions and routing

**Files:**
- Modify: `src/data/workshops/definitions.ts` (line ~693) — replace `comingSoon` stub with full entry
- Modify: `src/App.tsx` — add import + route

- [ ] **Step 1: Update definitions.ts**

In `src/data/workshops/definitions.ts`, locate the `COMING_SOON` array entry for `celebration-grid` (around line 693):

```typescript
{ id: 'celebration-grid', slug: 'celebration-grid', title: 'Celebration Grid', route: '/ateliers/celebration-grid', categorySlug: 'management-3-0', toolName: 'Celebration Grid', level: 'intermediate', durationMinutes: 15, interactionType: 'matrix', summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.', comingSoon: true },
```

Remove it from `COMING_SOON` and add this entry to the `EXISTING` array (after the `mad-sad-glad` entry, before the `]` closing the EXISTING array):

```typescript
    {
      id: 'celebration-grid',
      slug: 'celebration-grid',
      title: 'Celebration Grid',
      route: '/ateliers/celebration-grid',
      categorySlug: 'management-3-0',
      toolName: 'Celebration Grid',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'matrix',
      summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.',
      pedagogy: {
        objectives: [
          "Distinguer erreur, expérimentation et bonne pratique dans le contexte Scrum",
          "Différencier un succès fiable d'un succès obtenu par chance",
          "Identifier ce qui mérite vraiment d'être célébré en rétrospective",
          "Éviter la culture du blâme en distinguant résultat et comportement",
        ],
        toolExplanation: "La Celebration Grid (Jurgen Appelo, Management 3.0) aide l'équipe à réfléchir aux liens entre comportements et résultats. Elle distingue les erreurs évitables, les expérimentations utiles et les bonnes pratiques — qu'elles mènent à un succès ou à un échec. L'objectif est de célébrer les apprentissages, pas seulement les réussites visibles.",
        whenToUse: [
          "En rétrospective pour analyser les succès et échecs du Sprint sans blâmer",
          "Pour développer une culture d'apprentissage et d'expérimentation dans l'équipe",
          "Quand l'équipe confond résultats positifs et bonnes pratiques",
        ],
        expectedOutput: [
          "Classification correcte de 12 cartes dans les 6 zones de la grille",
          "Association de 15 situations Scrum aux zones Behavior × Outcome",
        ],
      },
    },
```

- [ ] **Step 2: Update App.tsx**

In `src/App.tsx`, add the import after the `MadSadGladAtelier` import (line ~32):

```typescript
import { CelebrationGridAtelier } from './components/CelebrationGridAtelier'
```

Add the route after the mad-sad-glad route (line ~90):

```typescript
{ path: '/ateliers/celebration-grid', element: <CelebrationGridAtelier /> },
```

- [ ] **Step 3: Run full test suite**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim"
npm test -- --run 2>&1 | tail -10
```

Expected: all tests pass (previously 1031, now 1042)

- [ ] **Step 4: Commit**

```bash
git add src/data/workshops/definitions.ts src/App.tsx
git commit -m "feat(celebration-grid): register atelier in definitions and routing"
```
