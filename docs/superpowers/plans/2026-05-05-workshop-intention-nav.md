# Workshop Intention Nav — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une vue par défaut "Par intention" sur `/ateliers` avec 8 tuiles cliquables filtrant la grille de workshops, et un toggle pill pour basculer vers la vue liste actuelle.

**Architecture:** Nouveau fichier `intentions.ts` centralisant les 8 intentions et leur mapping slug→workshops. Nouveau composant `IntentionNav` (tuiles style C, 2 colonnes). `AteliersHome` gagne un état `view` (`'intention'|'list'`) persisté en `localStorage`, switche entre `IntentionNav` et `WorkshopCategoryNav` existant.

**Tech Stack:** React 19, TypeScript, Vitest + @testing-library/react, CSS custom properties

---

## File Map

| Action | Fichier |
|--------|---------|
| Créer | `src/data/workshops/intentions.ts` |
| Modifier | `src/data/workshops/index.ts` |
| Créer | `src/components/IntentionNav/index.tsx` |
| Créer | `src/components/IntentionNav/IntentionNav.test.tsx` |
| Modifier | `src/components/AteliersHome/index.tsx` |
| Modifier | `src/components/AteliersHome/AteliersHome.test.tsx` |
| Modifier | `src/index.css` |

---

## Task 1 — Couche de données : intentions.ts

**Files:**
- Create: `src/data/workshops/intentions.ts`
- Modify: `src/data/workshops/index.ts`

- [ ] **Step 1 : Créer `src/data/workshops/intentions.ts`**

```ts
export interface WorkshopIntention {
  slug: string
  name: string
  emoji: string
  subtitle: string
}

export const WORKSHOP_INTENTIONS: WorkshopIntention[] = [
  { slug: 'gerer-conflit',             name: 'Gérer un conflit',              emoji: '⚡', subtitle: 'Tensions, feedback, négociation' },
  { slug: 'faciliter-decision',        name: 'Faciliter une décision',        emoji: '⚖️', subtitle: 'Consensus, vote, arbitrage' },
  { slug: 'debloquer-equipe',          name: 'Débloquer une équipe',          emoji: '🧩', subtitle: 'Co-dev, facilitation, résilience' },
  { slug: 'preparer-retro',            name: 'Préparer une rétrospective',    emoji: '🔄', subtitle: 'Formats, techniques, animation' },
  { slug: 'cause-racine',              name: 'Trouver une cause racine',      emoji: '🔍', subtitle: 'Analyse, Ishikawa, TRIZ' },
  { slug: 'aligner-parties-prenantes', name: 'Aligner les parties prenantes', emoji: '🤝', subtitle: 'Cartographie, engagement' },
  { slug: 'ameliorer-flow',            name: 'Améliorer le flow',             emoji: '📈', subtitle: 'Systèmes, flux, livraison' },
  { slug: 'preparer-coaching',         name: 'Préparer un coaching',          emoji: '🎯', subtitle: 'Questions, posture, GROW' },
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

- [ ] **Step 2 : Ajouter les exports dans `src/data/workshops/index.ts`**

Ajouter après la ligne `export { WORKSHOP_DEFINITIONS } from './definitions'` :

```ts
export { WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from './intentions'
export type { WorkshopIntention } from './intentions'
```

Le fichier complet devient :

```ts
export { WORKSHOP_CATEGORIES } from './categories'
export { WORKSHOP_DEFINITIONS } from './definitions'
export { WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from './intentions'
export type { WorkshopIntention } from './intentions'
export type {
  WorkshopDefinition,
  WorkshopCategory,
  WorkshopCategorySlug,
  WorkshopLevel,
  WorkshopInteractionType,
  WorkshopPedagogy,
  WorkshopDataset,
  ClassificationDataset,
  RankingDataset,
  CanvasDataset,
  VotingDataset,
} from './types'
export {
  LEVEL_LABELS,
  LEVEL_BADGE_VARIANT,
  INTERACTION_TYPE_LABELS,
} from './types'
```

- [ ] **Step 3 : Vérifier que TypeScript compile**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 4 : Commit**

```bash
git add src/data/workshops/intentions.ts src/data/workshops/index.ts
git commit -m "feat(workshops): add intention metadata and workshop mapping"
```

---

## Task 2 — Composant IntentionNav

**Files:**
- Create: `src/components/IntentionNav/IntentionNav.test.tsx`
- Create: `src/components/IntentionNav/index.tsx`

- [ ] **Step 1 : Écrire les tests (fichier manquant → RED attendu)**

Créer `src/components/IntentionNav/IntentionNav.test.tsx` :

```tsx
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
        activeIntention={null}
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
        activeIntention={null}
        onSelect={onSelect}
      />
    )
    const tile = screen.getByRole('button', { name: /Gérer un conflit/ })
    expect(tile.textContent).toMatch(/\d+ ateliers?/)
  })

  it('calls onSelect with intention slug on click', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention={null}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledWith('gerer-conflit')
  })

  it('calls onSelect with null when active tile is re-clicked', () => {
    render(
      <IntentionNav
        intentions={WORKSHOP_INTENTIONS}
        workshopMap={INTENTION_WORKSHOP_MAP}
        workshops={WORKSHOP_DEFINITIONS}
        activeIntention="gerer-conflit"
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Gérer un conflit/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
```

- [ ] **Step 2 : Lancer les tests pour confirmer RED**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx vitest run src/components/IntentionNav/IntentionNav.test.tsx
```

Expected: FAIL — `Cannot find module '.'`

- [ ] **Step 3 : Créer `src/components/IntentionNav/index.tsx`**

```tsx
import type { WorkshopIntention } from '../../data/workshops/intentions'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  activeIntention: string | null
  onSelect: (slug: string | null) => void
}

export function IntentionNav({ intentions, workshopMap, workshops, activeIntention, onSelect }: Props) {
  const existingSlugs = new Set(workshops.map(w => w.slug))

  return (
    <div className="intention-nav">
      {intentions.map(intention => {
        const count = (workshopMap[intention.slug] ?? []).filter(s => existingSlugs.has(s)).length
        const isActive = activeIntention === intention.slug
        return (
          <button
            key={intention.slug}
            className={`intention-nav__tile${isActive ? ' intention-nav__tile--active' : ''}`}
            onClick={() => onSelect(isActive ? null : intention.slug)}
          >
            <span className="intention-nav__emoji">{intention.emoji}</span>
            <div>
              <div className="intention-nav__name">{intention.name}</div>
              <div className="intention-nav__subtitle">{intention.subtitle}</div>
              <div className="intention-nav__count">{count} atelier{count !== 1 ? 's' : ''}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4 : Lancer les tests pour confirmer GREEN**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx vitest run src/components/IntentionNav/IntentionNav.test.tsx
```

Expected: 4 tests PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/components/IntentionNav/
git commit -m "feat(workshops): add IntentionNav component"
```

---

## Task 3 — Intégration AteliersHome + CSS

**Files:**
- Modify: `src/components/AteliersHome/AteliersHome.test.tsx`
- Modify: `src/components/AteliersHome/index.tsx`
- Modify: `src/index.css`

- [ ] **Step 1 : Remplacer `src/components/AteliersHome/AteliersHome.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { AteliersHome } from '.'

beforeEach(() => {
  localStorage.clear()
})

describe('AteliersHome', () => {
  it('renders all available workshops by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('TRIZ — Anti-Goal')).toBeInTheDocument()
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
  })

  it('shows intention nav by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Facilitation/ })).not.toBeInTheDocument()
  })

  it('switches to list view on toggle click', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Gérer un conflit/ })).not.toBeInTheDocument()
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

  it('filters workshops by selected intention', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    expect(screen.getByText('Ishikawa (Fishbone)')).toBeInTheDocument()
    expect(screen.queryByText('Modèle GROW')).not.toBeInTheDocument()
  })

  it('shows all workshops when active intention is re-clicked', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    expect(screen.getByText('Modèle GROW')).toBeInTheDocument()
  })

  it('filters to facilitation category in list view', () => {
    localStorage.setItem('ateliers-view', 'list')
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('resets filter when switching views', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Trouver une cause racine/ }))
    fireEvent.click(screen.getByRole('button', { name: /Liste complète/ }))
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('Modèle GROW')).toBeInTheDocument()
  })

  it('shows coming soon cards', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByText('Bientôt').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2 : Lancer les tests pour confirmer RED**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: plusieurs tests FAIL (les nouveaux sur intention/toggle).

- [ ] **Step 3 : Remplacer `src/components/AteliersHome/index.tsx`**

```tsx
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { WORKSHOP_CATEGORIES, WORKSHOP_DEFINITIONS, WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops'
import { WorkshopCategoryNav } from '../WorkshopCategoryNav'
import { IntentionNav } from '../IntentionNav'
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
  const [activeIntention, setActiveIntention] = useState<string | null>(null)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  function handleViewChange(next: AteliersView) {
    setView(next)
    setActiveCategory(null)
    setActiveIntention(null)
    localStorage.setItem(VIEW_KEY, next)
  }

  const visible = view === 'list'
    ? (activeCategory
        ? WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === activeCategory)
        : WORKSHOP_DEFINITIONS)
    : (activeIntention
        ? WORKSHOP_DEFINITIONS.filter(w => (INTENTION_WORKSHOP_MAP[activeIntention] ?? []).includes(w.slug))
        : WORKSHOP_DEFINITIONS)

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
          activeIntention={activeIntention}
          onSelect={setActiveIntention}
        />
      ) : (
        <WorkshopCategoryNav
          categories={WORKSHOP_CATEGORIES}
          workshops={WORKSHOP_DEFINITIONS}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}
      <div className="ateliers-grid">
        {visible.map(w => (
          <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4 : Lancer les tests pour confirmer GREEN**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: 11 tests PASS.

- [ ] **Step 5 : Ajouter les classes CSS dans `src/index.css`**

Ajouter après le bloc `/* ── Ateliers Home ── */` (ligne ~794) :

```css
.ateliers-home__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.25rem;
}

/* ── View Toggle Pill ── */
.view-toggle {
  display: inline-flex;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 3px;
  gap: 2px;
}
.view-toggle__btn {
  background: none;
  border: none;
  border-radius: 16px;
  padding: 5px 14px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.view-toggle__btn--active {
  background: var(--color-primary);
  color: #fff;
}
.view-toggle__btn:hover:not(.view-toggle__btn--active) {
  background: var(--color-border);
}

/* ── Intention Nav ── */
.intention-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.intention-nav__tile {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.875rem 1rem;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: border-color 0.15s, background 0.15s;
}
.intention-nav__tile:hover {
  border-color: var(--color-primary);
}
.intention-nav__tile--active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.intention-nav__emoji {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.intention-nav__name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}
.intention-nav__tile--active .intention-nav__name {
  color: var(--color-primary);
}
.intention-nav__subtitle {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 2px;
  line-height: 1.3;
}
.intention-nav__count {
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-top: 4px;
}
```

- [ ] **Step 6 : Lancer toute la suite de tests**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npx vitest run
```

Expected: tous les tests PASS (aucune régression).

- [ ] **Step 7 : Commit**

```bash
git add src/components/AteliersHome/index.tsx src/components/AteliersHome/AteliersHome.test.tsx src/index.css
git commit -m "feat(workshops): integrate IntentionNav into AteliersHome with view toggle"
```
