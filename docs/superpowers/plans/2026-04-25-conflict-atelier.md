# Atelier Gestion des Conflits (Thomas-Kilmann) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-phase drag-and-drop atelier on the Thomas-Kilmann conflict management model to the autonomous workshops section.

**Architecture:** Phase 1 places the 5 TKI modes on an Assertivité/Coopération diagram; phase 2 (unlocked only after 5/5 in phase 1) assigns 15 situation cards to 5 mode columns. State is local to `ConflictAtelier`. CSS follows the existing `.scrum-*` / `.atelier-*` conventions in `src/index.css`.

**Tech Stack:** React 18, TypeScript, Vitest, @testing-library/react, HTML5 native drag-and-drop, CSS (no external libraries)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/ConflictAtelier/index.tsx` | Full atelier: data constants, phase logic, UI |
| Create | `src/components/ConflictAtelier/ConflictAtelier.test.tsx` | Phase 1 + phase 2 tests |
| Modify | `src/components/AteliersHome/index.tsx` | Add card entry for new atelier |
| Modify | `src/App.tsx` | Add `/ateliers/conflits` route |
| Modify | `src/index.css` | TKI diagram + columns CSS |

---

### Task 1: Scaffold — card + route + empty component

**Files:**
- Modify: `src/components/AteliersHome/index.tsx`
- Create: `src/components/ConflictAtelier/index.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/AteliersHome/AteliersHome.test.tsx`

- [ ] **Step 1: Write the failing test**

Add this `it()` block inside the existing `describe` in `src/components/AteliersHome/AteliersHome.test.tsx`:

```ts
it('renders the Gestion des conflits atelier card', () => {
  render(<MemoryRouter><AteliersHome /></MemoryRouter>)
  expect(screen.getByText('Gestion des conflits')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: FAIL — "Unable to find an element with the text: Gestion des conflits"

- [ ] **Step 3: Add the ATELIERS entry**

In `src/components/AteliersHome/index.tsx`, add to the `ATELIERS` array after the existing entry:

```ts
  {
    to: '/ateliers/conflits',
    title: 'Gestion des conflits',
    description: 'Positionnez les 5 modes du modèle Thomas-Kilmann sur le diagramme, puis associez des situations réelles à chaque mode.',
    level: 'Intermédiaire',
    levelVariant: 'orange' as const,
    duration: '~15 min',
  },
```

- [ ] **Step 4: Create empty ConflictAtelier component**

Create `src/components/ConflictAtelier/index.tsx`:

```tsx
export function ConflictAtelier() {
  return <div className="atelier-page" />
}
```

- [ ] **Step 5: Add route to App.tsx**

Add the import at the top of `src/App.tsx`:

```ts
import { ConflictAtelier } from './components/ConflictAtelier'
```

Add the route inside `<Routes>` after the scrum-guide route:

```tsx
<Route path="/ateliers/conflits" element={<ConflictAtelier />} />
```

- [ ] **Step 6: Run test to verify it passes**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/AteliersHome/index.tsx src/App.tsx src/components/ConflictAtelier/index.tsx src/components/AteliersHome/AteliersHome.test.tsx
git commit -m "feat: scaffold ConflictAtelier route and AteliersHome card"
```

---

### Task 2: Phase 1 — TKI diagram with verify logic

**Files:**
- Modify: `src/components/ConflictAtelier/index.tsx`
- Create: `src/components/ConflictAtelier/ConflictAtelier.test.tsx`

- [ ] **Step 1: Write the failing phase 1 tests**

Create `src/components/ConflictAtelier/ConflictAtelier.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConflictAtelier } from '.'

describe('ConflictAtelier — Phase 1', () => {
  it('renders 5 TKI mode labels in the palette', () => {
    render(<ConflictAtelier />)
    expect(screen.getByText('Compétition')).toBeInTheDocument()
    expect(screen.getByText('Collaboration')).toBeInTheDocument()
    expect(screen.getByText('Compromis')).toBeInTheDocument()
    expect(screen.getByText('Évitement')).toBeInTheDocument()
    expect(screen.getByText('Accommodation')).toBeInTheDocument()
  })

  it('disables Vérifier button when not all zones are filled', () => {
    render(<ConflictAtelier />)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 5 modes are placed', () => {
    render(<ConflictAtelier />)
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 5/5 and Phase suivante button on perfect placement', () => {
    render(<ConflictAtelier />)
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/5 \/ 5 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer button when placement is wrong', () => {
    render(<ConflictAtelier />)
    // Place all modes but swapped
    const placements = [
      ['Accommodation','top-left'],
      ['Évitement',    'top-right'],
      ['Compromis',    'center'],
      ['Collaboration','bottom-left'],
      ['Compétition',  'bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/ConflictAtelier/ConflictAtelier.test.tsx
```

Expected: FAIL — component renders empty div

- [ ] **Step 3: Implement the full ConflictAtelier component**

Replace the contents of `src/components/ConflictAtelier/index.tsx` with:

```tsx
import { useState } from 'react'

const DIAGRAM_ANSWERS: Record<string, string> = {
  'top-left':     'Compétition',
  'top-right':    'Collaboration',
  'center':       'Compromis',
  'bottom-left':  'Évitement',
  'bottom-right': 'Accommodation',
}
const DIAGRAM_ZONE_IDS = Object.keys(DIAGRAM_ANSWERS)
const MODE_LABELS = Object.values(DIAGRAM_ANSWERS)

type Situation = { id: string; text: string; mode: string }

const SITUATIONS: Situation[] = [
  { id: 's1',  text: "Un membre de l'équipe pousse une solution technique non conforme à la DoD — le SM doit trancher pour protéger la qualité.", mode: 'Compétition' },
  { id: 's2',  text: "Une livraison est bloquée par un désaccord de dernière minute — une décision rapide s'impose.", mode: 'Compétition' },
  { id: 's3',  text: "Un développeur refuse systématiquement les revues de code — le SM pose une limite ferme.", mode: 'Compétition' },
  { id: 's4',  text: "Deux développeurs ont des visions opposées sur l'architecture d'une fonctionnalité clé — le SM facilite une session de co-conception.", mode: 'Collaboration' },
  { id: 's5',  text: "Une tension récurrente entre deux membres dégrade l'atmosphère de l'équipe — le SM organise un dialogue structuré.", mode: 'Collaboration' },
  { id: 's6',  text: "L'équipe ne s'accorde pas sur la définition du Done — le SM anime un atelier pour construire une vision commune.", mode: 'Collaboration' },
  { id: 's7',  text: "Le Product Owner et l'équipe ne s'accordent pas sur la priorité de deux User Stories de même valeur — on négocie un ordre acceptable pour les deux.", mode: 'Compromis' },
  { id: 's8',  text: "L'équipe est divisée sur la durée du prochain Sprint (1 ou 2 semaines) — on convient d'un essai de 2 semaines réévalué à la rétrospective.", mode: 'Compromis' },
  { id: 's9',  text: "Les ressources ne permettent pas de traiter tous les items prévus — on réduit le périmètre de manière équilibrée.", mode: 'Compromis' },
  { id: 's10', text: "Une légère irritation sur le choix d'un outil de communication, sans impact sur la livraison — le SM laisse passer.", mode: 'Évitement' },
  { id: 's11', text: "Une friction ponctuelle entre deux membres en fin de Sprint surchargé — le SM note le sujet pour la rétrospective plutôt que d'intervenir immédiatement.", mode: 'Évitement' },
  { id: 's12', text: "Un désaccord sur le format des standup notes, mineur et sans conséquence sur le travail — le SM ne prend pas position.", mode: 'Évitement' },
  { id: 's13', text: "Un développeur senior propose une approche différente de celle prévue, avec une expertise reconnue — le SM cède et soutient sa proposition.", mode: 'Accommodation' },
  { id: 's14', text: "Un stakeholder important demande un ajustement raisonnable sur la présentation du Sprint Review — le SM accepte pour préserver la relation.", mode: 'Accommodation' },
  { id: 's15', text: "Un membre de l'équipe demande à changer l'heure du Daily Scrum pour des raisons personnelles légitimes — le SM accommode la demande.", mode: 'Accommodation' },
]

function DiagramZone({ zoneId, label, result, onDrop, onDragStart }: {
  zoneId: string
  label: string
  result: Record<string, boolean> | null
  onDrop: (zoneId: string) => void
  onDragStart: (label: string, fromZone?: string) => void
}) {
  const verified = result !== null
  const correct = result?.[zoneId]
  return (
    <div
      data-zone={zoneId}
      className={
        'tki-zone' +
        (label ? ' tki-zone--filled' : ' tki-zone--empty') +
        (verified ? (correct ? ' tki-zone--correct' : ' tki-zone--wrong') : '')
      }
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('tki-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('tki-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('tki-zone--hover'); onDrop(zoneId) }}
    >
      {label ? (
        <span className="scrum-label scrum-label--placed" draggable onDragStart={() => onDragStart(label, zoneId)}>
          {label}
        </span>
      ) : (
        <span className="scrum-zone__placeholder">?</span>
      )}
    </div>
  )
}

export function ConflictAtelier() {
  const [phase, setPhase] = useState<1 | 2>(1)

  const [diagramZones, setDiagramZones] = useState<Record<string, string>>(() =>
    Object.fromEntries(DIAGRAM_ZONE_IDS.map(id => [id, '']))
  )
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<{ label: string; fromDiagramZone?: string } | null>(null)

  const placedModes = new Set(Object.values(diagramZones).filter(Boolean))
  const paletteModes = MODE_LABELS.filter(l => !placedModes.has(l))
  const phase1AllFilled = paletteModes.length === 0

  function handleDiagramDragStart(label: string, fromDiagramZone?: string) {
    setDragging({ label, fromDiagramZone })
    setPhase1Result(null)
  }

  function handleDropOnDiagramZone(zoneId: string) {
    if (!dragging) return
    setDiagramZones(prev => {
      const next = { ...prev }
      if (dragging.fromDiagramZone) next[dragging.fromDiagramZone] = ''
      next[zoneId] = dragging.label
      return next
    })
    setDragging(null)
  }

  function handleDropOnDiagramPalette() {
    if (!dragging?.fromDiagramZone) { setDragging(null); return }
    setDiagramZones(prev => ({ ...prev, [dragging.fromDiagramZone!]: '' }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const zoneId of DIAGRAM_ZONE_IDS) {
      result[zoneId] = diagramZones[zoneId] === DIAGRAM_ANSWERS[zoneId]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setDiagramZones(Object.fromEntries(DIAGRAM_ZONE_IDS.map(id => [id, ''])))
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 5

  const unassigned = SITUATIONS.filter(s => !(s.id in assignments))
  const phase2AllAssigned = unassigned.length === 0

  function handleSituationDragStart(situationId: string) {
    setDragging({ label: situationId })
    setPhase2Result(null)
  }

  function handleDropOnModeColumn(mode: string) {
    if (!dragging) return
    setAssignments(prev => ({ ...prev, [dragging.label]: mode }))
    setDragging(null)
  }

  function handleDropOnPool() {
    if (!dragging) { setDragging(null); return }
    setAssignments(prev => {
      const next = { ...prev }
      delete next[dragging.label]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      result[s.id] = assignments[s.id] === s.mode
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setAssignments({})
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <div className="atelier-page">
      <header className="atelier-header">
        <h1 className="atelier-title">Gestion des conflits — Thomas-Kilmann</h1>
        <p className="atelier-subtitle">
          {phase === 1
            ? 'Phase 1 / 2 — Placez les 5 modes TKI sur le diagramme Assertivité / Coopération.'
            : 'Phase 2 / 2 — Associez chaque situation au mode de gestion des conflits approprié.'}
        </p>
      </header>

      {phase === 1 && (
        <>
          <div className="tki-diagram">
            <div className="tki-axis tki-axis--y">Assertivité ↑</div>
            <div className="tki-grid">
              <DiagramZone zoneId="top-left"     label={diagramZones['top-left']}     result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="top-right"    label={diagramZones['top-right']}    result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="center"       label={diagramZones['center']}       result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="bottom-left"  label={diagramZones['bottom-left']}  result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
              <div className="tki-cell--empty" />
              <DiagramZone zoneId="bottom-right" label={diagramZones['bottom-right']} result={phase1Result} onDrop={handleDropOnDiagramZone} onDragStart={handleDiagramDragStart} />
            </div>
            <div className="tki-axis tki-axis--x">Coopération →</div>
          </div>

          {phase1Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                {phase1Score} / 5 correct{phase1Perfect ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnDiagramPalette}>
            <p className="scrum-palette__title">Modes à placer</p>
            <div className="scrum-palette__labels">
              {paletteModes.map(label => (
                <span key={label} className="scrum-label" draggable onDragStart={() => handleDiagramDragStart(label)}>
                  {label}
                </span>
              ))}
              {paletteModes.length === 0 && (
                <span className="scrum-palette__empty">Tous les modes ont été placés</span>
              )}
            </div>
          </div>

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllFilled}>
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
            {MODE_LABELS.map(mode => {
              const modeSituations = SITUATIONS.filter(s => assignments[s.id] === mode)
              return (
                <div
                  key={mode}
                  data-mode={mode}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnModeColumn(mode)}
                >
                  <h3 className="tki-column__title">{mode}</h3>
                  <div className="tki-column__cards">
                    {modeSituations.map(s => (
                      <div
                        key={s.id}
                        data-situation={s.id}
                        className={
                          'tki-situation-card' +
                          (phase2Result !== null
                            ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                            : '')
                        }
                        draggable
                        onDragStart={() => handleSituationDragStart(s.id)}
                      >
                        {s.text}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="tki-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}>
            <p className="scrum-palette__title">Situations à classer</p>
            <div className="tki-pool__cards">
              {unassigned.map(s => (
                <div
                  key={s.id}
                  data-situation={s.id}
                  className="tki-situation-card"
                  draggable
                  onDragStart={() => handleSituationDragStart(s.id)}
                >
                  {s.text}
                </div>
              ))}
              {unassigned.length === 0 && (
                <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
              )}
            </div>
          </div>

          {phase2Result && (
            <div className="scrum-score-banner">
              <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                {phase2Score} / 15 correct{phase2Score === 15 ? ' — Parfait !' : ''}
              </span>
            </div>
          )}

          <div className="scrum-actions">
            <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllAssigned}>
              Vérifier
            </button>
            {phase2Result && (
              <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run phase 1 tests to verify they pass**

```bash
npx vitest run src/components/ConflictAtelier/ConflictAtelier.test.tsx
```

Expected: All Phase 1 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ConflictAtelier/index.tsx src/components/ConflictAtelier/ConflictAtelier.test.tsx
git commit -m "feat: implement ConflictAtelier phase 1 TKI diagram"
```

---

### Task 3: Phase 2 tests — situations classification

**Files:**
- Modify: `src/components/ConflictAtelier/ConflictAtelier.test.tsx`

- [ ] **Step 1: Write the phase 2 tests**

Append this `describe` block to `src/components/ConflictAtelier/ConflictAtelier.test.tsx`:

```ts
describe('ConflictAtelier — Phase 2', () => {
  function reachPhase2() {
    render(<ConflictAtelier />)
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 15 situation cards in the pool after entering phase 2', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('disables Vérifier when not all situations are assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct assignment', () => {
    reachPhase2()
    const modeById: Record<string, string> = {
      s1: 'Compétition',  s2: 'Compétition',  s3: 'Compétition',
      s4: 'Collaboration',s5: 'Collaboration', s6: 'Collaboration',
      s7: 'Compromis',    s8: 'Compromis',     s9: 'Compromis',
      s10:'Évitement',    s11:'Évitement',     s12:'Évitement',
      s13:'Accommodation',s14:'Accommodation', s15:'Accommodation',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${modeById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="Compétition"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="Compétition"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run all ConflictAtelier tests**

```bash
npx vitest run src/components/ConflictAtelier/ConflictAtelier.test.tsx
```

Expected: All phase 1 and phase 2 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ConflictAtelier/ConflictAtelier.test.tsx
git commit -m "test: add phase 2 tests for ConflictAtelier"
```

---

### Task 4: CSS — TKI diagram and columns

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Append TKI styles to src/index.css**

Add the following at the very end of `src/index.css`:

```css
/* ── TKI Diagram (Phase 1) ── */
.tki-diagram {
  display: grid;
  grid-template-columns: 2rem 1fr;
  grid-template-rows: 1fr 2rem;
  gap: 0.5rem;
  max-width: 600px;
  margin: 2rem auto;
}
.tki-axis {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  white-space: nowrap;
}
.tki-axis--y {
  grid-column: 1;
  grid-row: 1;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
.tki-axis--x {
  grid-column: 2;
  grid-row: 2;
  text-align: center;
}
.tki-grid {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.5rem;
  min-height: 240px;
}
.tki-cell--empty { background: transparent; }
.tki-zone {
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
}
.tki-zone--filled { border-style: solid; border-color: var(--color-primary); }
.tki-zone--hover { border-color: var(--color-primary-hover); background: var(--color-surface-2); }
.tki-zone--correct { border-color: var(--color-ok); background: #14532d33; }
.tki-zone--wrong { border-color: var(--color-danger); background: #7f1d1d33; }

/* ── TKI Columns (Phase 2) ── */
.tki-columns {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  overflow-x: auto;
}
.tki-column {
  flex: 1;
  min-width: 160px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 200px;
}
.tki-column__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary-hover);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
}
.tki-column__cards { display: flex; flex-direction: column; gap: 0.5rem; }
.tki-situation-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.6rem 0.75rem;
  font-size: 0.82rem;
  color: var(--color-text);
  cursor: grab;
  line-height: 1.4;
  transition: border-color 0.15s;
}
.tki-situation-card:hover { border-color: var(--color-primary); }
.tki-situation-card--correct { border-color: var(--color-ok); background: #14532d33; }
.tki-situation-card--wrong { border-color: var(--color-danger); background: #7f1d1d33; }
.tki-pool {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin: 1rem 0;
}
.tki-pool__cards { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; }
```

- [ ] **Step 2: Run the full test suite to confirm nothing broke**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add TKI diagram and columns CSS for ConflictAtelier"
```

---

### Task 5: Final smoke test and integration commit

**Files:** none changed

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Manual smoke test**

- Navigate to `http://localhost:5173/ateliers` — verify "Gestion des conflits" card with orange "Intermédiaire" badge and "~15 min" appears alongside "Le cadre Scrum"
- Navigate to `http://localhost:5173/ateliers/conflits` — verify phase 1 renders: TKI diagram with 5 empty zones, palette with 5 mode labels, "Vérifier" button disabled
- Drag all 5 modes to correct zones → click "Vérifier" → verify "5 / 5 correct — Parfait !" and "Phase suivante →" appear
- Click "Phase suivante →" — verify phase 2 renders: 5 mode columns, 15 situation cards in the pool
- Assign all situations to their correct mode → click "Vérifier" → verify "15 / 15 correct — Parfait !"
- Click "Réessayer phase 2" — verify all cards return to pool, columns empty, "Vérifier" disabled again
- Test wrong placement: put a wrong mode in phase 1 → verify "Réessayer" appears, "Phase suivante" does not
