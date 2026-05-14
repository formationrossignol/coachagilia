# Empathy Map Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop Empathy Map atelier where learners first classify 12 items into 4 core zones (says/thinks/does/feels), then assign 15 observations to 5 extended zones (adds needs).

**Architecture:** Same two-phase pattern as SolutionFocusedAtelier and PowerfulQuestionsAtelier — Phase 1 unlocks only on 12/12, Phase 2 calls `markComplete()` on verify. Dataset file for WorkshopPedagogyPanel, component, tests, definitions registration, route.

**Tech Stack:** React 18, TypeScript, Vitest + React Testing Library, native HTML5 drag-and-drop, Zustand (via `useWorkshopCompletion` hook), React Router v6.

---

## File Structure

- Create: `src/data/workshops/datasets/empathy-map.ts` — ClassificationDataset for Phase 1 (4 zones, 12 cards)
- Create: `src/components/EmpathyMapAtelier/index.tsx` — full two-phase component
- Create: `src/components/EmpathyMapAtelier/EmpathyMapAtelier.test.tsx` — 10 tests
- Modify: `src/data/workshops/definitions.ts` — import dataset, add EXISTING entry, remove COMING_SOON entry
- Modify: `src/App.tsx` — import component, add route

---

### Task 1: Create empathy-map dataset file

**Files:**
- Create: `src/data/workshops/datasets/empathy-map.ts`

The dataset uses `ClassificationDataset` type from `src/data/workshops/types.ts`. It represents Phase 1 only (4 core zones, 12 cards) and is used by `WorkshopPedagogyPanel` for display.

- [ ] **Step 1: Write the file**

```typescript
import type { ClassificationDataset } from '../types'

export const empathyMapDataset: ClassificationDataset = {
  zones: [
    { id: 'says',   label: 'Dit',     description: "Ce que la personne exprime explicitement, à l'oral ou à l'écrit." },
    { id: 'thinks', label: 'Pense',   description: 'Ce que la personne peut croire, anticiper, craindre ou questionner intérieurement.' },
    { id: 'does',   label: 'Fait',    description: 'Les comportements observables, actions, réactions ou routines.' },
    { id: 'feels',  label: 'Ressent', description: 'Les émotions, tensions, frustrations ou motivations ressenties.' },
  ],
  cards: [
    { id: 'c1',  text: "\"Je ne comprends pas pourquoi cette fonctionnalité est prioritaire.\"",   expectedZone: 'says' },
    { id: 'c2',  text: "\"Je perds trop de temps à chercher l'information.\"",                      expectedZone: 'says' },
    { id: 'c3',  text: "\"Le Daily ne m'aide pas vraiment à avancer.\"",                            expectedZone: 'says' },
    { id: 'c4',  text: "Il se demande si son avis est vraiment pris en compte.",                    expectedZone: 'thinks' },
    { id: 'c5',  text: "Elle pense que le produit devient trop complexe pour les utilisateurs.",    expectedZone: 'thinks' },
    { id: 'c6',  text: "Il craint que l'équipe ne soit pas prête pour la démonstration client.",    expectedZone: 'thinks' },
    { id: 'c7',  text: "Il consulte plusieurs outils avant de trouver la bonne information.",       expectedZone: 'does' },
    { id: 'c8',  text: "Elle évite de prendre la parole pendant les rétrospectives.",               expectedZone: 'does' },
    { id: 'c9',  text: "Il contacte directement un développeur au lieu de passer par le backlog.", expectedZone: 'does' },
    { id: 'c10', text: "Il se sent frustré par le manque de visibilité.",                           expectedZone: 'feels' },
    { id: 'c11', text: "Elle est rassurée quand les priorités sont clairement expliquées.",         expectedZone: 'feels' },
    { id: 'c12', text: "Il ressent de la pression à l'approche de la Sprint Review.",              expectedZone: 'feels' },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/workshops/datasets/empathy-map.ts
git commit -m "feat(data): add empathy-map dataset"
```

---

### Task 2: Create EmpathyMapAtelier component

**Files:**
- Create: `src/components/EmpathyMapAtelier/index.tsx`

Reference implementation: `src/components/SolutionFocusedAtelier/index.tsx` (same two-phase structure).

Key differences from SolutionFocusedAtelier:
- Phase 1: 4 core zones (`says`/`thinks`/`does`/`feels`), 12 plain-text cards
- Phase 2: 5 extended zones (adds `needs`), 15 plain-text cards (NOT situation+question pairs — just single observations)
- DraggingItem spec uses `cardId` + `fromZone` (not `id`/`fromFamily`/`fromIntent`)
- No hyphenated zone keys (no bracket notation needed)
- `useWorkshopCompletion('empathy-map')`
- `WORKSHOP_DEFINITIONS.find(w => w.id === 'empathy-map')`

- [ ] **Step 1: Write the component**

```typescript
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
              {phase2Result && (
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

- [ ] **Step 2: Commit**

```bash
git add src/components/EmpathyMapAtelier/index.tsx
git commit -m "feat(atelier): EmpathyMapAtelier component — two-phase drag-and-drop"
```

---

### Task 3: Create EmpathyMapAtelier tests

**Files:**
- Create: `src/components/EmpathyMapAtelier/EmpathyMapAtelier.test.tsx`

Reference: `src/components/SolutionFocusedAtelier/SolutionFocusedAtelier.test.tsx` for test structure.

Phase 1 correct mapping:
- `c1`, `c2`, `c3` → `says`
- `c4`, `c5`, `c6` → `thinks`
- `c7`, `c8`, `c9` → `does`
- `c10`, `c11`, `c12` → `feels`

Phase 2 correct mapping:
- `e1`, `e2`, `e3` → `says`
- `e4`, `e5`, `e6` → `thinks`
- `e7`, `e8`, `e9` → `does`
- `e10`, `e11`, `e12` → `feels`
- `e13`, `e14`, `e15` → `needs`

Important: Phase 1 columns use `data-zone` attribute (not `data-category` like PowerfulQuestions or `data-category` like others). Phase 2 columns also use `data-zone`. Cards use `data-card`.

- [ ] **Step 1: Write the tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { EmpathyMapAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'empathy-map',
      slug: 'empathy-map',
      title: 'Empathy Map',
      route: '/ateliers/empathy-map',
      categorySlug: 'team-intelligence',
      toolName: 'Empathy Map',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.",
    },
  ],
}))

vi.mock('../../features/gamification', () => ({
  useGamificationStore: vi.fn((selector) =>
    selector({
      events: [],
      recordEvent: vi.fn(),
      getCompletedContentSlugs: () => [],
    })
  ),
}))

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/empathy-map', element: <EmpathyMapAtelier /> }],
    { initialEntries: ['/ateliers/empathy-map'] }
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

describe('EmpathyMapAtelier', () => {
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

  it('places a card in a core zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('c1', 'says')
    const zone = document.querySelector('[data-zone="says"]')!
    expect(zone.querySelector('[data-card="c1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('c1', 'says')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="says"] [data-card="c1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="c1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    // Place all in wrong zones then verify
    ;['c1','c2','c3','c4','c5','c6'].forEach(id => dragCard(id, 'says'))
    ;['c7','c8','c9','c10','c11','c12'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 extended cards after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(15)
  })

  it('places an extended card in a zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragCard('e1', 'says')
    const zone = document.querySelector('[data-zone="says"]')!
    expect(zone.querySelector('[data-card="e1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['e1','says'],['e2','says'],['e3','says'],
      ['e4','thinks'],['e5','thinks'],['e6','thinks'],
      ['e7','does'],['e8','does'],['e9','does'],
      ['e10','feels'],['e11','feels'],['e12','feels'],
      ['e13','needs'],['e14','needs'],['e15','needs'],
    ]
    p2.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    // Place all in wrong zones
    ;['e1','e2','e3','e4','e5','e6','e7','e8'].forEach(id => dragCard(id, 'says'))
    ;['e9','e10','e11','e12','e13','e14','e15'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 cards on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['c1','says'],['c2','says'],['c3','says'],
      ['c4','thinks'],['c5','thinks'],['c6','thinks'],
      ['c7','does'],['c8','does'],['c9','does'],
      ['c10','feels'],['c11','feels'],['c12','feels'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['e1','e2','e3','e4','e5','e6','e7','e8'].forEach(id => dragCard(id, 'says'))
    ;['e9','e10','e11','e12','e13','e14','e15'].forEach(id => dragCard(id, 'thinks'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-card]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/components/EmpathyMapAtelier/EmpathyMapAtelier.test.tsx
```

Expected: 10 tests passing.

- [ ] **Step 3: Commit**

```bash
git add src/components/EmpathyMapAtelier/EmpathyMapAtelier.test.tsx
git commit -m "test(atelier): EmpathyMapAtelier — phase 1 and phase 2 tests"
```

---

### Task 4: Register empathy-map in definitions.ts

**Files:**
- Modify: `src/data/workshops/definitions.ts`

The COMING_SOON entry at line ~464 is:
```typescript
{ id: 'empathy-map', slug: 'empathy-map', title: 'Empathy Map', route: '/ateliers/empathy-map', categorySlug: 'team-intelligence', toolName: 'Empathy Map', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.", comingSoon: true },
```

Remove it from COMING_SOON and add a full entry to EXISTING (just before the closing `]` of EXISTING, after the solution-focused-coaching entry).

Also add the import at the top of the file (after the existing dataset imports).

- [ ] **Step 1: Add import**

At the top of `src/data/workshops/definitions.ts`, after line 15 (`import { solutionFocusedDataset } from './datasets/solution-focused'`), add:

```typescript
import { empathyMapDataset } from './datasets/empathy-map'
```

- [ ] **Step 2: Add EXISTING entry**

After the `solution-focused-coaching` entry (line ~444) and before the closing `]` of `EXISTING` (line ~445 ): add:

```typescript
  {
    id: 'empathy-map',
    slug: 'empathy-map',
    title: 'Empathy Map',
    route: '/ateliers/empathy-map',
    categorySlug: 'team-intelligence',
    toolName: 'Empathy Map',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les zones de l'Empathy Map, puis classez des observations utilisateur ou équipe dans la bonne zone : Dit, Pense, Fait, Ressent ou Besoin.",
    pedagogy: {
      objectives: [
        "Distinguer un verbatim, une pensée supposée, un comportement observable et une émotion",
        "Structurer une situation utilisateur ou équipe avec une Empathy Map",
        "Éviter de confondre observation et interprétation",
        "Identifier des besoins à partir de signaux concrets",
        "Utiliser l'Empathy Map pour améliorer une discussion produit, une rétrospective ou une analyse stakeholder",
      ],
      toolExplanation: "L'Empathy Map (Dave Gray / XPLANE) aide les équipes à développer une compréhension partagée d'une personne ou d'un groupe. Elle distingue ce que la personne Dit (verbatims explicites), Pense (croyances, anticipations, craintes), Fait (comportements observables) et Ressent (émotions, tensions). La version enrichie ajoute les Besoins, déduits des observations et émotions.",
      whenToUse: [
        "Pour mieux comprendre un stakeholder avant un Sprint Review ou une présentation produit",
        "En rétrospective pour cartographier l'expérience vécue par l'équipe",
        "Pour préparer une conversation difficile avec un membre de l'équipe ou un client",
      ],
      expectedOutput: [
        "Distinction maîtrisée entre Dit, Pense, Fait, Ressent et Besoin",
        "Capacité à structurer une situation avec une Empathy Map pour faire émerger les besoins",
      ],
    },
    dataset: empathyMapDataset,
  },
```

- [ ] **Step 3: Remove COMING_SOON entry**

Remove this line from the COMING_SOON array:
```typescript
  { id: 'empathy-map', slug: 'empathy-map', title: 'Empathy Map', route: '/ateliers/empathy-map', categorySlug: 'team-intelligence', toolName: 'Empathy Map', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.", comingSoon: true },
```

- [ ] **Step 4: Run the full test suite to verify no regressions**

```bash
npx vitest run
```

Expected: all existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/workshops/definitions.ts
git commit -m "feat(data): register empathy-map in EXISTING workshop definitions"
```

---

### Task 5: Add /ateliers/empathy-map route in App.tsx

**Files:**
- Modify: `src/App.tsx`

Current state: `src/App.tsx` has `import { SolutionFocusedAtelier } from './components/SolutionFocusedAtelier'` and the route `{ path: '/ateliers/solution-focused', element: <SolutionFocusedAtelier /> }`.

- [ ] **Step 1: Add import**

After `import { SolutionFocusedAtelier } from './components/SolutionFocusedAtelier'` (line 25), add:

```typescript
import { EmpathyMapAtelier } from './components/EmpathyMapAtelier'
```

- [ ] **Step 2: Add route**

After `{ path: '/ateliers/solution-focused', element: <SolutionFocusedAtelier /> }` (line 76), add:

```typescript
      { path: '/ateliers/empathy-map', element: <EmpathyMapAtelier /> },
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(router): add /ateliers/empathy-map route"
```
