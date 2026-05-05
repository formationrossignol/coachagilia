# Intention Nav Modal & Tile Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the intention-filtered grid with a tile-only view that opens a WorkshopCard modal on click, and redesign the tiles to match the WorkshopCard visual language.

**Architecture:** `IntentionNav` loses its active-state toggle and becomes a pure launcher. A new `IntentionModal` component owns modal display logic. `AteliersHome` holds `modalIntention: string | null` state, renders the modal conditionally, and no longer renders a workshop grid in intention view.

**Tech Stack:** React 19, TypeScript, Zustand 5, Vitest + Testing Library, CSS custom properties.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/data/workshops/intentions.ts` | Add `label` short field to `WorkshopIntention` |
| Modify | `src/components/IntentionNav/index.tsx` | Remove `activeIntention` prop, always call `onSelect(slug)` |
| Modify | `src/components/IntentionNav/IntentionNav.test.tsx` | Update tests for new prop shape |
| Create | `src/components/IntentionModal/index.tsx` | Modal: header + 2-col WorkshopCard grid + footer + Escape/backdrop close |
| Create | `src/components/IntentionModal/IntentionModal.test.tsx` | Tests for modal render, close, Escape |
| Modify | `src/components/AteliersHome/index.tsx` | Wire `modalIntention` state, remove grid in intention view |
| Modify | `src/components/AteliersHome/AteliersHome.test.tsx` | Update/replace obsolete tests, add modal tests |
| Modify | `src/index.css` | New tile card design, new modal classes, light-theme overrides |

---

## Task 1 — Add `label` to `WorkshopIntention`

**Files:**
- Modify: `src/data/workshops/intentions.ts`

- [ ] **Step 1: Update the interface and data**

Replace the entire file content:

```ts
// src/data/workshops/intentions.ts
export interface WorkshopIntention {
  slug: string
  name: string
  label: string
  emoji: string
  subtitle: string
}

export const WORKSHOP_INTENTIONS: WorkshopIntention[] = [
  { slug: 'gerer-conflit',             label: 'Conflits',        name: 'Gérer un conflit',              emoji: '⚡', subtitle: 'Tensions, feedback, négociation' },
  { slug: 'faciliter-decision',        label: 'Décision',        name: 'Faciliter une décision',        emoji: '⚖️', subtitle: 'Consensus, vote, arbitrage' },
  { slug: 'debloquer-equipe',          label: 'Équipe',          name: 'Débloquer une équipe',          emoji: '🧩', subtitle: 'Co-dev, facilitation, résilience' },
  { slug: 'preparer-retro',            label: 'Rétrospective',   name: 'Préparer une rétrospective',    emoji: '🔄', subtitle: 'Formats, techniques, animation' },
  { slug: 'cause-racine',              label: 'Diagnostic',      name: 'Trouver une cause racine',      emoji: '🔍', subtitle: 'Analyse, Ishikawa, TRIZ' },
  { slug: 'aligner-parties-prenantes', label: 'Alignement',      name: 'Aligner les parties prenantes', emoji: '🤝', subtitle: 'Cartographie, engagement' },
  { slug: 'ameliorer-flow',            label: 'Flow',            name: 'Améliorer le flow',             emoji: '📈', subtitle: 'Systèmes, flux, livraison' },
  { slug: 'preparer-coaching',         label: 'Coaching',        name: 'Préparer un coaching',          emoji: '🎯', subtitle: 'Questions, posture, GROW' },
]

export const INTENTION_WORKSHOP_MAP: Record<string, string[]> = {
  'gerer-conflit': [
    'thomas-kilmann', 'sbi', 'nonviolent-communication', 'radical-candor',
    'crucial-conversations', 'desc', 'feedforward', 'difficult-conversations', 'johari-window',
  ],
  'faciliter-decision': [
    'cynefin-framework', 'delegation-poker', 'troika-consulting', 'raci', 'daci', 'rapid',
    'decision-matrix', 'decision-tree', 'premortem', 'dot-voting', 'fist-of-five',
    'roman-voting', 'six-thinking-hats',
  ],
  'debloquer-equipe': [
    'troika-consulting', 'triz', 'moving-motivators', 'cynefin-framework',
    'liberating-structures', '1-2-4-all', 'fishbowl-discussion', 'appreciative-inquiry', 'scrum-guide',
  ],
  'preparer-retro': [
    'troika-consulting', 'triz', 'ishikawa', 'start-stop-continue', 'starfish', 'sailboat',
    'mad-sad-glad', '4-ls', 'timeline-retro', 'futurespective', 'retrospective-radar', 'happiness-door',
  ],
  'cause-racine': [
    'ishikawa', 'triz', '5-whys', 'root-cause-analysis', 'a3', 'dmaic', 'cynefin-framework',
  ],
  'aligner-parties-prenantes': [
    'stakeholder-mapping', 'customer-journey-mapping', 'service-blueprint',
    'impact-mapping', 'elevator-pitch',
  ],
  'ameliorer-flow': [
    'cynefin-framework', 'value-stream-mapping', 'kanban', 'littles-law',
    'pdca', 'kaizen', 'dora-metrics', 'dod-review', 'dor-review',
  ],
  'preparer-coaching': [
    'grow-model', 'ask-vs-tell', 'powerful-questions', 'solution-focused-coaching',
    'clean-language', 'systemic-coaching', 'immunity-to-change',
  ],
}
```

- [ ] **Step 2: Run the full suite to verify no breakage**

```bash
npx vitest run
```

Expected: all tests PASS (the new `label` field is additive — no consumer reads it yet).

- [ ] **Step 3: Commit**

```bash
git add src/data/workshops/intentions.ts
git commit -m "feat(intentions): add label field to WorkshopIntention"
```

---

## Task 2 — Update IntentionNav (remove active state, update tests)

**Files:**
- Modify: `src/components/IntentionNav/index.tsx`
- Modify: `src/components/IntentionNav/IntentionNav.test.tsx`

- [ ] **Step 1: Replace the test file**

```tsx
// src/components/IntentionNav/IntentionNav.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IntentionNav } from '.'
import { WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops/intentions'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'

describe('IntentionNav', () => {
  const onSelect = vi.fn()

  beforeEach(() => {
    onSelect.mockClear()
  })

  it('renders all 8 intention tiles', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        onSelect={onSelect}
      />
    )
    expect(screen.getAllByRole('button')).toHaveLength(8)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Trouver une cause racine/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Préparer un coaching/ })).toBeInTheDocument()
  })

  it('displays workshop count for each intention', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        onSelect={onSelect}
      />
    )
    const tile = screen.getByRole('button', { name: /Gérer un conflit/ })
    expect(tile.textContent).toMatch(/\d+ ateliers?/)
  })

  it('calls onSelect with intention slug on every click', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledWith('gerer-conflit')

    // second click still fires with slug, not null
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledTimes(2)
    expect(onSelect).toHaveBeenNthCalledWith(2, 'gerer-conflit')
  })

  it('renders the short label for each tile', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        onSelect={onSelect}
      />
    )
    expect(screen.getByText('Conflits')).toBeInTheDocument()
    expect(screen.getByText('Coaching')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/IntentionNav/IntentionNav.test.tsx
```

Expected: FAIL — `onSelect` called with null on second click; `label` text not found.

- [ ] **Step 3: Replace the component**

```tsx
// src/components/IntentionNav/index.tsx
import type { WorkshopIntention } from '../../data/workshops/intentions'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  onSelect: (slug: string) => void
}

export function IntentionNav({ intentions, workshopMap, workshops, onSelect }: Props) {
  const existingSlugs = new Set(workshops.map(w => w.slug))

  return (
    <div className="intention-nav">
      {intentions.map(intention => {
        const count = (workshopMap[intention.slug] ?? []).filter(s => existingSlugs.has(s)).length
        return (
          <button
            key={intention.slug}
            className="intention-nav__tile"
            data-intention={intention.slug}
            onClick={() => onSelect(intention.slug)}
          >
            <span className="intention-nav__emoji">{intention.emoji}</span>
            <span className="intention-nav__label">{intention.label}</span>
            <div className="intention-nav__name">{intention.name}</div>
            <div className="intention-nav__subtitle">{intention.subtitle}</div>
            <div className="intention-nav__count">{count} atelier{count !== 1 ? 's' : ''}</div>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/IntentionNav/IntentionNav.test.tsx
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Full suite**

```bash
npx vitest run
```

Expected: all tests PASS (AteliersHome tests still pass because they don't test the `activeIntention` prop directly — they test rendered output, which is unchanged at this point since AteliersHome still passes the prop; it's just ignored by the new component).

- [ ] **Step 6: Commit**

```bash
git add src/components/IntentionNav/index.tsx src/components/IntentionNav/IntentionNav.test.tsx
git commit -m "feat(intention-nav): remove active-state toggle, always fire onSelect(slug)"
```

---

## Task 3 — Create IntentionModal

**Files:**
- Create: `src/components/IntentionModal/index.tsx`
- Create: `src/components/IntentionModal/IntentionModal.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/IntentionModal/IntentionModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { IntentionModal } from '.'
import { WORKSHOP_INTENTIONS } from '../../data/workshops/intentions'
import { useGamificationStore } from '../../features/gamification'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

const conflitIntention = WORKSHOP_INTENTIONS.find(i => i.slug === 'gerer-conflit')!

function renderModal(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <IntentionModal intention={conflitIntention} onClose={onClose} />
    </MemoryRouter>
  )
}

describe('IntentionModal', () => {
  it('renders the intention name and emoji', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.getByText('⚡')).toBeInTheDocument()
  })

  it('renders the short label', () => {
    renderModal()
    expect(screen.getByText('Intention')).toBeInTheDocument()
  })

  it('renders workshop cards for the intention', () => {
    renderModal()
    // thomas-kilmann and sbi are real workshops mapped to gerer-conflit
    expect(screen.getByText(/Thomas-Kilmann/)).toBeInTheDocument()
    expect(screen.getByText(/SBI/)).toBeInTheDocument()
  })

  it('renders a footer with available count', () => {
    renderModal()
    expect(screen.getByText(/atelier/)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    fireEvent.click(screen.getByRole('button', { name: /Fermer/ }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    fireEvent.click(document.querySelector('.intention-modal__backdrop')!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/IntentionModal/IntentionModal.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement IntentionModal**

```tsx
// src/components/IntentionModal/index.tsx
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { WorkshopIntention } from '../../data/workshops/intentions'
import { WORKSHOP_DEFINITIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops'
import { WorkshopCard } from '../WorkshopCard'
import { useGamificationStore } from '../../features/gamification'

interface Props {
  intention: WorkshopIntention
  onClose: () => void
}

export function IntentionModal({ intention, onClose }: Props) {
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  const workshopSlugs = INTENTION_WORKSHOP_MAP[intention.slug] ?? []
  const workshops = WORKSHOP_DEFINITIONS.filter(w => workshopSlugs.includes(w.slug))
  const availableCount = workshops.filter(w => !w.comingSoon).length
  const comingSoonCount = workshops.filter(w => w.comingSoon).length

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="intention-modal" role="dialog" aria-modal="true" aria-labelledby="intention-modal-title">
      <div className="intention-modal__backdrop" onClick={onClose} />
      <div className="intention-modal__box" data-intention={intention.slug}>
        <div className="intention-modal__header">
          <span className="intention-modal__emoji">{intention.emoji}</span>
          <div>
            <div className="intention-modal__label">Intention</div>
            <h2 className="intention-modal__title" id="intention-modal-title">{intention.name}</h2>
            <p className="intention-modal__sub">{intention.subtitle}</p>
          </div>
          <button className="intention-modal__close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="intention-modal__body">
          {workshops.map(w => (
            <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />
          ))}
        </div>
        <div className="intention-modal__footer">
          {availableCount} atelier{availableCount !== 1 ? 's' : ''} disponible{availableCount !== 1 ? 's' : ''}
          {comingSoonCount > 0 && ` · ${comingSoonCount} à venir`}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/IntentionModal/IntentionModal.test.tsx
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Full suite**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/IntentionModal/index.tsx src/components/IntentionModal/IntentionModal.test.tsx
git commit -m "feat(intention-modal): add IntentionModal with WorkshopCard grid and close handlers"
```

---

## Task 4 — Update AteliersHome

**Files:**
- Modify: `src/components/AteliersHome/index.tsx`
- Modify: `src/components/AteliersHome/AteliersHome.test.tsx`

- [ ] **Step 1: Replace the test file**

```tsx
// src/components/AteliersHome/AteliersHome.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { AteliersHome } from '.'

beforeEach(() => {
  localStorage.clear()
})

describe('AteliersHome', () => {
  it('shows intention nav by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Facilitation/ })).not.toBeInTheDocument()
  })

  it('does not show workshop cards in intention view', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('switches to list view on toggle click', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Gérer un conflit/ })).not.toBeInTheDocument()
  })

  it('shows all available workshops in list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('TRIZ — Anti-Goal')).toBeInTheDocument()
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
  })

  it('shows coming soon cards in list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByText('Bientôt').length).toBeGreaterThan(0)
  })

  it('persists view preference to localStorage', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(localStorage.getItem('ateliers-view')).toBe('list')
  })

  it('reads view preference from localStorage on mount', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Gérer un conflit/ })).not.toBeInTheDocument()
  })

  it('falls back to intention view when localStorage value is invalid', () => {
    localStorage.setItem('ateliers-view', 'INVALID')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
  })

  it('opens modal when intention tile is clicked', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Gérer un conflit/ })).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    fireEvent.click(screen.getByRole('button', { name: /Fermer/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('filters to facilitation category in list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('resets category filter when switching to list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    fireEvent.click(screen.getByRole('button', { name: /Par intention/ }))
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('Modèle GROW')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: FAIL — "does not show workshop cards in intention view" fails (grid still shows), modal tests fail (dialog not opened).

- [ ] **Step 3: Replace AteliersHome**

```tsx
// src/components/AteliersHome/index.tsx
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { WORKSHOP_CATEGORIES, WORKSHOP_DEFINITIONS, WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops'
import { WorkshopCategoryNav } from '../WorkshopCategoryNav'
import { IntentionNav } from '../IntentionNav'
import { IntentionModal } from '../IntentionModal'
import { WorkshopCard } from '../WorkshopCard'
import type { WorkshopCategorySlug } from '../../data/workshops/types'
import { useGamificationStore } from '../../features/gamification'

type AteliersView = 'intention' | 'list'
const VIEW_KEY = 'ateliers-view'

function readView(): AteliersView {
  try {
    const v = localStorage.getItem(VIEW_KEY)
    if (v === 'intention' || v === 'list') return v
  } catch {
    // ignore
  }
  return 'intention'
}

export function AteliersHome() {
  const [view, setView] = useState<AteliersView>(readView)
  const [activeCategory, setActiveCategory] = useState<WorkshopCategorySlug | null>(null)
  const [modalIntention, setModalIntention] = useState<string | null>(null)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  function handleViewChange(next: AteliersView) {
    setView(next)
    setActiveCategory(null)
    localStorage.setItem(VIEW_KEY, next)
  }

  const visibleList = activeCategory
    ? WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === activeCategory)
    : WORKSHOP_DEFINITIONS

  const activeIntentionData = modalIntention
    ? WORKSHOP_INTENTIONS.find(i => i.slug === modalIntention) ?? null
    : null

  return (
    <div className="ateliers-home">
      <header className="selector-header">
        <h1>Ateliers</h1>
        <p>Ancrez les concepts par la pratique : glisser-déposer, puzzles, cartes.</p>
      </header>
      <div className="ateliers-home__toolbar">
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${view === 'intention' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => handleViewChange('intention')}
          >
            Par intention
          </button>
          <button
            className={`view-toggle__btn${view === 'list' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => handleViewChange('list')}
          >
            Liste complète
          </button>
        </div>
      </div>
      {view === 'intention' ? (
        <IntentionNav
          intentions={WORKSHOP_INTENTIONS}
          workshopMap={INTENTION_WORKSHOP_MAP}
          workshops={WORKSHOP_DEFINITIONS}
          onSelect={setModalIntention}
        />
      ) : (
        <>
          <WorkshopCategoryNav
            categories={WORKSHOP_CATEGORIES}
            workshops={WORKSHOP_DEFINITIONS}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
          <div className="ateliers-grid">
            {visibleList.map(w => (
              <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />
            ))}
          </div>
        </>
      )}
      {activeIntentionData && (
        <IntentionModal
          intention={activeIntentionData}
          onClose={() => setModalIntention(null)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run AteliersHome tests — expect PASS**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: all 13 tests PASS.

- [ ] **Step 5: Full suite**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/AteliersHome/index.tsx src/components/AteliersHome/AteliersHome.test.tsx
git commit -m "feat(ateliers-home): open intention modal on tile click, remove filtered grid in intention view"
```

---

## Task 5 — CSS redesign (tiles + modal)

**Files:**
- Modify: `src/index.css`

No new tests — visual changes only. Verify with `npx vitest run` at the end.

### Step 1: Replace intention-nav CSS block

Find the block starting at `.intention-nav {` and ending at `.intention-nav__count {` (the closing `}` before `.atelier-card`). Replace the entire block with:

```css
/* ── Intention nav — accent colours per intention ── */
.intention-nav__tile[data-intention="gerer-conflit"]             { --tile-acc: #f87171; --tile-acc-rgb: 248,113,113; }
.intention-nav__tile[data-intention="faciliter-decision"]        { --tile-acc: #60a5fa; --tile-acc-rgb: 96,165,250; }
.intention-nav__tile[data-intention="debloquer-equipe"]          { --tile-acc: #34d399; --tile-acc-rgb: 52,211,153; }
.intention-nav__tile[data-intention="preparer-retro"]            { --tile-acc: #a78bfa; --tile-acc-rgb: 167,139,250; }
.intention-nav__tile[data-intention="cause-racine"]              { --tile-acc: #fbbf24; --tile-acc-rgb: 251,191,36; }
.intention-nav__tile[data-intention="aligner-parties-prenantes"] { --tile-acc: #38bdf8; --tile-acc-rgb: 56,189,248; }
.intention-nav__tile[data-intention="ameliorer-flow"]            { --tile-acc: #fb923c; --tile-acc-rgb: 251,146,60; }
.intention-nav__tile[data-intention="preparer-coaching"]         { --tile-acc: #6366f1; --tile-acc-rgb: 99,102,241; }

.intention-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.intention-nav__tile {
  --tile-acc: #6366f1;
  --tile-acc-rgb: 99,102,241;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.45rem;
  padding: 1.35rem 0.85rem 1.1rem;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(var(--tile-acc-rgb), 0.12) 0%, transparent 65%),
    linear-gradient(160deg, #1b1f33 0%, #0f1117 65%);
  border: 1px solid rgba(255,255,255,0.065);
  border-top: 2px solid var(--tile-acc);
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.055),
    0 4px 16px rgba(0,0,0,0.32);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.intention-nav__tile::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 13px 13px 0 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 40%);
  pointer-events: none;
}

.intention-nav__tile:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 20px 48px rgba(0,0,0,0.5),
    0 0 0 1px rgba(var(--tile-acc-rgb), 0.35);
}

.intention-nav__emoji {
  font-size: 2rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(var(--tile-acc-rgb), 0.45));
}

.intention-nav__label {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tile-acc);
  text-shadow: 0 0 10px rgba(var(--tile-acc-rgb), 0.5);
  position: relative;
  z-index: 1;
}

.intention-nav__name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  position: relative;
  z-index: 1;
}

.intention-nav__subtitle {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  line-height: 1.35;
  position: relative;
  z-index: 1;
}

.intention-nav__count {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  background: rgba(var(--tile-acc-rgb), 0.15);
  color: var(--tile-acc);
  border-radius: 999px;
  margin-top: 4px;
  position: relative;
  z-index: 1;
}
```

### Step 2: Add intention-modal CSS

Append after the intention-nav block (before `.atelier-card`):

```css
/* ── Intention modal ── */
.intention-modal__box[data-intention="gerer-conflit"]             { --modal-acc: #f87171; --modal-acc-rgb: 248,113,113; }
.intention-modal__box[data-intention="faciliter-decision"]        { --modal-acc: #60a5fa; --modal-acc-rgb: 96,165,250; }
.intention-modal__box[data-intention="debloquer-equipe"]          { --modal-acc: #34d399; --modal-acc-rgb: 52,211,153; }
.intention-modal__box[data-intention="preparer-retro"]            { --modal-acc: #a78bfa; --modal-acc-rgb: 167,139,250; }
.intention-modal__box[data-intention="cause-racine"]              { --modal-acc: #fbbf24; --modal-acc-rgb: 251,191,36; }
.intention-modal__box[data-intention="aligner-parties-prenantes"] { --modal-acc: #38bdf8; --modal-acc-rgb: 56,189,248; }
.intention-modal__box[data-intention="ameliorer-flow"]            { --modal-acc: #fb923c; --modal-acc-rgb: 251,146,60; }
.intention-modal__box[data-intention="preparer-coaching"]         { --modal-acc: #6366f1; --modal-acc-rgb: 99,102,241; }

.intention-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.intention-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
}

.intention-modal__box {
  --modal-acc: #6366f1;
  --modal-acc-rgb: 99,102,241;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #1b1f33 0%, #0f1117 100%);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(var(--modal-acc-rgb),0.15);
}

.intention-modal__header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.35rem 1.5rem 1.1rem;
  border-bottom: 1px solid var(--color-border);
  background: radial-gradient(ellipse at 90% -20%, rgba(var(--modal-acc-rgb),0.12) 0%, transparent 60%);
  flex-shrink: 0;
  position: relative;
}

.intention-modal__emoji {
  font-size: 2rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(var(--modal-acc-rgb),0.45));
}

.intention-modal__label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--modal-acc);
  text-shadow: 0 0 12px rgba(var(--modal-acc-rgb),0.5);
  margin-bottom: 2px;
}

.intention-modal__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin: 0 0 2px;
}

.intention-modal__sub {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.intention-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.intention-modal__close:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.intention-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-content: start;
}

.intention-modal__footer {
  padding: 0.9rem 1.5rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
  flex-shrink: 0;
}
```

### Step 3: Add light-theme overrides

After the `[data-theme="light"] .workshop-card__footer` rule, append:

```css
/* Intention tiles — light theme */
[data-theme="light"] .intention-nav__tile {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(var(--tile-acc-rgb),0.06) 0%, transparent 65%),
    #ffffff;
  border-color: rgba(0,0,0,0.08);
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
}
[data-theme="light"] .intention-nav__tile::before { display: none; }
[data-theme="light"] .intention-nav__tile:hover {
  box-shadow: 0 12px 36px rgba(0,0,0,0.10), 0 0 0 1px rgba(var(--tile-acc-rgb),0.25);
}
[data-theme="light"] .intention-nav__name { color: #0f172a; }
[data-theme="light"] .intention-nav__subtitle { color: #64748b; }

/* Intention modal — light theme */
[data-theme="light"] .intention-modal__box {
  background: #ffffff;
  border-color: rgba(0,0,0,0.10);
}
```

- [ ] **Step 4: Run full suite**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "style(intention-nav): redesign tiles as accent cards, add modal CSS"
```

---

## Self-Review

| Spec requirement | Task |
|---|---|
| 4-column tile grid | Task 5 (CSS) |
| Tile card design — radial glow, border-top, hover lift | Task 5 |
| Per-intention accent colour | Tasks 2 + 5 |
| Short label per intention | Tasks 1 + 2 |
| No active state on tiles | Task 2 |
| Clicking tile opens modal (no grid below) | Tasks 3 + 4 |
| Modal header: emoji, label, name, subtitle, close | Task 3 |
| Modal body: 2-col WorkshopCard grid | Task 3 |
| Modal footer: available count + coming-soon count | Task 3 |
| Backdrop click closes modal | Task 3 |
| Escape closes modal | Task 3 |
| Close button closes modal | Task 3 |
| `isCompleted` passed to WorkshopCards in modal | Task 3 |
| No workshop grid in intention view | Task 4 |
| List view unchanged | Task 4 |
| Light-theme overrides | Task 5 |
| All existing tests pass | Every task |
