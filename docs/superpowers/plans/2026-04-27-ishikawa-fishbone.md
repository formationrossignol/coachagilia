# Ishikawa — Refonte visuelle en arête de poisson

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat grid layout in IshikawaAtelier (phases 1 & 2) with a real fishbone diagram: SVG layer for decoration (tail, spine, head, 6 diagonal bones) + HTML overlay for interactive drop zones.

**Architecture:** A `position: relative` container holds a fluid SVG (pointer-events: none) and an absolute overlay div. The 6 drop zones and the effect label are `position: absolute` inside the overlay, each centered on their bone-tip coordinate via `transform: translate(-50%, -50%)`. All existing `data-*` attributes are preserved — no test changes required for phases 1 & 2. Phase 3 is untouched.

**Tech Stack:** React 18, TypeScript, CSS custom properties (no new dependencies)

---

## SVG coordinate reference

ViewBox: `0 0 820 280`

| Element | SVG coords |
|---|---|
| Tail | `polyline points="70,140 20,100 20,180 70,140"` |
| Spine | `line x1=70 y1=140 x2=680 y2=140` |
| Head | `path M680,100 Q760,100 780,140 Q760,180 680,180 Z` |
| Top bones | x1=200→x2=130 y2=30 · x1=370→x2=300 y2=30 · x1=540→x2=475 y2=30 (all y1=140) |
| Bottom bones | x1=200→x2=130 y2=250 · x1=370→x2=300 y2=250 · x1=540→x2=475 y2=250 (all y1=140) |
| Effect label | left=88.4%, top=50% (centered in head) |

Zone positions (% of 820×280):

| Branch | Category | left | top |
|---|---|---|---|
| b0 | people | 15.85% | 10.71% |
| b1 | process | 36.59% | 10.71% |
| b2 | tools | 57.93% | 10.71% |
| b3 | product | 15.85% | 89.29% |
| b4 | environment | 36.59% | 89.29% |
| b5 | management | 57.93% | 89.29% |

---

## File map

| File | Change |
|---|---|
| `src/index.css` | Remove `.ishi-diagram`, `.ishi-branches-row`, `.ishi-spine`, `.ishi-branch`, `.ishi-col` rules; add `.ishi-fishbone`, `.ishi-fishbone__svg`, `.ishi-fishbone__overlay`, `.ishi-zone`, `.ishi-effect-label` |
| `src/components/IshikawaAtelier/index.tsx` | Add `BRANCH_POSITIONS`, `CATEGORY_POSITIONS`; update `BranchZone`; replace phase 1 & 2 `.ishi-diagram` blocks; remove `topBranches`/`bottomBranches` |
| `src/components/IshikawaAtelier/IshikawaAtelier.test.tsx` | Add 1 structural smoke-test for SVG (no changes to existing tests) |

---

### Task 1: CSS — Replace grid classes with fishbone layout classes

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove old layout rules and add new fishbone classes**

In `src/index.css`, find the block starting at `.ishi-diagram` and ending just before `.ishi-pool` (the rules: `.ishi-diagram`, `.ishi-branches-row`, `.ishi-branches-row--top`, `.ishi-branches-row--bottom`, `.ishi-spine`, `.ishi-spine__line`, `.ishi-spine__effect`, `.ishi-branch`, `.ishi-branch--filled`, `.ishi-branch--hover`, `.ishi-branch--correct`, `.ishi-branch--wrong`, `.ishi-branch__placeholder`, `.ishi-category-label`, `.ishi-category-label:hover`, `.ishi-category-label--placed`, `.ishi-col`, `.ishi-col:hover`, `.ishi-col__header`).

Replace that entire block with:

```css
.ishi-fishbone {
  position: relative;
  max-width: 860px;
  margin: 1.5rem auto;
}
.ishi-fishbone__svg {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  overflow: visible;
}
.ishi-fishbone__overlay {
  position: absolute;
  inset: 0;
  overflow: visible;
}
.ishi-zone {
  position: absolute;
  min-width: 110px;
  transform: translate(-50%, -50%);
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  transition: border-color 0.15s, background 0.15s;
}
.ishi-zone--filled { border-style: solid; }
.ishi-zone--hover { border-color: var(--color-primary); background: var(--color-surface-2); }
.ishi-zone--correct { border-color: var(--color-ok); background: #14532d33; }
.ishi-zone--wrong { border-color: var(--color-danger); background: #7f1d1d33; }
.ishi-zone__placeholder { color: var(--color-text-muted); font-size: 0.8rem; text-align: center; }
.ishi-zone__cards { display: flex; flex-direction: column; gap: 0.3rem; }
.ishi-zone__header {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary-hover);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
  flex-shrink: 0;
}
.ishi-category-label {
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.3rem 0.65rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: grab;
  transition: background 0.12s;
}
.ishi-category-label:hover { background: var(--color-surface); }
.ishi-category-label--placed { background: transparent; border-color: transparent; cursor: grab; }
.ishi-effect-label {
  position: absolute;
  transform: translate(-50%, -50%);
  background: var(--color-primary);
  color: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  min-width: 80px;
  pointer-events: none;
}
```

- [ ] **Step 2: Run tests**

```bash
cd "/Users/loicrossignol/Desktop/Igensia/Scrum Master/scrum-master-sim" && npm test -- --run src/components/IshikawaAtelier
```

Expected: all existing tests pass (CSS changes don't affect data-* attributes or DOM structure).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style(ishikawa): replace flat grid CSS with fishbone layout classes"
```

---

### Task 2: Phase 1 — Fishbone JSX + structural smoke-test

**Files:**
- Modify: `src/components/IshikawaAtelier/index.tsx`
- Modify: `src/components/IshikawaAtelier/IshikawaAtelier.test.tsx`

- [ ] **Step 1: Write the failing structural test**

At the end of `IshikawaAtelier.test.tsx`, add:

```tsx
describe('IshikawaAtelier — Structure fishbone', () => {
  it('renders SVG avec colonne vertébrale, queue, tête et 6 zones de dépôt', () => {
    render(<IshikawaAtelier />)
    const svg = document.querySelector('.ishi-fishbone__svg')
    expect(svg).toBeInTheDocument()
    expect(svg!.querySelector('line[x1="70"][y1="140"][x2="680"][y2="140"]')).toBeInTheDocument()
    expect(svg!.querySelector('polyline')).toBeInTheDocument()
    expect(svg!.querySelector('path')).toBeInTheDocument()
    expect(document.querySelector('.ishi-effect-label')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-branch]')).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --run src/components/IshikawaAtelier
```

Expected: last test FAILS with "Unable to find element with class .ishi-fishbone__svg".

- [ ] **Step 3: Add BRANCH_POSITIONS and update BranchZone**

In `src/components/IshikawaAtelier/index.tsx`, after the `CATEGORY_IDS` line, add:

```tsx
const BRANCH_POSITIONS: Record<string, { left: string; top: string }> = {
  b0: { left: '15.85%', top: '10.71%' },
  b1: { left: '36.59%', top: '10.71%' },
  b2: { left: '57.93%', top: '10.71%' },
  b3: { left: '15.85%', top: '89.29%' },
  b4: { left: '36.59%', top: '89.29%' },
  b5: { left: '57.93%', top: '89.29%' },
}
```

Replace the entire `BranchZone` function with:

```tsx
function BranchZone({ branch, placed, result, onDrop, onDragStart }: {
  branch: typeof BRANCH_LIST[0]
  placed: IshikawaCategory | undefined
  result: Partial<Record<string, boolean>> | null
  onDrop: (branchId: string) => void
  onDragStart: (category: IshikawaCategory) => void
}) {
  const verified = result !== null
  const correct = result?.[branch.id]
  const { left, top } = BRANCH_POSITIONS[branch.id]
  return (
    <div
      data-branch={branch.id}
      className={
        'ishi-zone' +
        (placed ? ' ishi-zone--filled' : '') +
        (verified ? (correct ? ' ishi-zone--correct' : ' ishi-zone--wrong') : '')
      }
      style={{ left, top }}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('ishi-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('ishi-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('ishi-zone--hover'); onDrop(branch.id) }}
    >
      {placed ? (
        <span
          data-category={placed}
          className="ishi-category-label ishi-category-label--placed"
          draggable
          onDragStart={() => onDragStart(placed)}
        >
          {CATEGORY_META[placed].label}
        </span>
      ) : (
        <span className="ishi-zone__placeholder">Déposer ici</span>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Replace phase 1 `.ishi-diagram` block**

In `IshikawaAtelier`, inside `{phase === 1 && (...)}`, find:

```tsx
<div className="ishi-diagram">
  <div className="ishi-branches-row ishi-branches-row--top">
    ...
  </div>
  <div className="ishi-spine">
    ...
  </div>
  <div className="ishi-branches-row ishi-branches-row--bottom">
    ...
  </div>
</div>
```

Replace it entirely with:

```tsx
<div className="ishi-fishbone">
  <svg className="ishi-fishbone__svg" viewBox="0 0 820 280" aria-hidden="true">
    <polyline points="70,140 20,100 20,180 70,140" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5} strokeLinejoin="round"/>
    <line x1={70} y1={140} x2={680} y2={140} style={{ stroke: 'var(--color-primary)' }} strokeWidth={3.5}/>
    <path d="M680,100 Q760,100 780,140 Q760,180 680,180 Z" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5}/>
    <circle cx={730} cy={130} r={6} fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2}/>
    <circle cx={730} cy={130} r={2} style={{ fill: 'var(--color-primary)' }}/>
    <line x1={200} y1={140} x2={130} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={370} y1={140} x2={300} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={540} y1={140} x2={475} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={200} y1={140} x2={130} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={370} y1={140} x2={300} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={540} y1={140} x2={475} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
  </svg>
  <div className="ishi-fishbone__overlay">
    <div className="ishi-effect-label" style={{ left: '88.4%', top: '50%' }}>
      Vélocité<br/>insuffisante
    </div>
    {BRANCH_LIST.map(b => (
      <BranchZone
        key={b.id}
        branch={b}
        placed={branchAssignments[b.id]}
        result={phase1Result}
        onDrop={handleDropOnBranch}
        onDragStart={handleDragStartCategory}
      />
    ))}
  </div>
</div>
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run src/components/IshikawaAtelier
```

Expected: ALL tests pass, including the new structural test.

- [ ] **Step 6: Commit**

```bash
git add src/components/IshikawaAtelier/index.tsx src/components/IshikawaAtelier/IshikawaAtelier.test.tsx
git commit -m "feat(ishikawa): fishbone SVG structure for phase 1"
```

---

### Task 3: Phase 2 — Fishbone drop zones for causes

**Files:**
- Modify: `src/components/IshikawaAtelier/index.tsx`

- [ ] **Step 1: Add CATEGORY_POSITIONS constant**

In `index.tsx`, after `BRANCH_POSITIONS`, add:

```tsx
const CATEGORY_POSITIONS: Record<IshikawaCategory, { left: string; top: string }> = {
  people:      { left: '15.85%', top: '10.71%' },
  process:     { left: '36.59%', top: '10.71%' },
  tools:       { left: '57.93%', top: '10.71%' },
  product:     { left: '15.85%', top: '89.29%' },
  environment: { left: '36.59%', top: '89.29%' },
  management:  { left: '57.93%', top: '89.29%' },
}
```

- [ ] **Step 2: Replace phase 2 `.ishi-diagram` block**

In `{phase === 2 && (...)}`, find and replace the entire `<div className="ishi-diagram">` block with:

```tsx
<div className="ishi-fishbone">
  <svg className="ishi-fishbone__svg" viewBox="0 0 820 280" aria-hidden="true">
    <polyline points="70,140 20,100 20,180 70,140" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5} strokeLinejoin="round"/>
    <line x1={70} y1={140} x2={680} y2={140} style={{ stroke: 'var(--color-primary)' }} strokeWidth={3.5}/>
    <path d="M680,100 Q760,100 780,140 Q760,180 680,180 Z" fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2.5}/>
    <circle cx={730} cy={130} r={6} fill="none" style={{ stroke: 'var(--color-primary)' }} strokeWidth={2}/>
    <circle cx={730} cy={130} r={2} style={{ fill: 'var(--color-primary)' }}/>
    <line x1={200} y1={140} x2={130} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={370} y1={140} x2={300} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={540} y1={140} x2={475} y2={30} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={200} y1={140} x2={130} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={370} y1={140} x2={300} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
    <line x1={540} y1={140} x2={475} y2={250} style={{ stroke: 'var(--color-border)' }} strokeWidth={2.5}/>
  </svg>
  <div className="ishi-fishbone__overlay">
    <div className="ishi-effect-label" style={{ left: '88.4%', top: '50%' }}>
      Vélocité<br/>insuffisante
    </div>
    {BRANCH_LIST.map(b => {
      const colCauses = CAUSES.filter(c => causeAssignments[c.id] === b.category)
      const { left, top } = CATEGORY_POSITIONS[b.category]
      return (
        <div
          key={b.id}
          data-category-zone={b.category}
          className="ishi-zone ishi-zone--filled"
          style={{ left, top }}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDropOnCategoryZone(b.category)}
        >
          <p className="ishi-zone__header">{b.label}</p>
          <div className="ishi-zone__cards">
            {colCauses.map(c => (
              <div
                key={c.id}
                data-cause={c.id}
                className={'ishi-cause-card' + (phase2Result !== null ? (phase2Result[c.id] ? ' ishi-cause-card--correct' : ' ishi-cause-card--wrong') : '')}
                draggable
                onDragStart={() => handleDragStartCause(c.id)}
              >
                {c.text}
              </div>
            ))}
            {colCauses.length === 0 && <span className="ishi-zone__placeholder">Déposer ici</span>}
          </div>
        </div>
      )
    })}
  </div>
</div>
```

- [ ] **Step 3: Remove unused variables**

Remove these two lines from the `IshikawaAtelier` function body (near the bottom, before the return):

```tsx
const topBranches = BRANCH_LIST.filter(b => b.row === 'top')
const bottomBranches = BRANCH_LIST.filter(b => b.row === 'bottom')
```

- [ ] **Step 4: Run all tests**

```bash
npm test -- --run src/components/IshikawaAtelier
```

Expected: all tests pass (12 existing + 1 new structural test = 13 total).

- [ ] **Step 5: Commit**

```bash
git add src/components/IshikawaAtelier/index.tsx
git commit -m "feat(ishikawa): fishbone SVG structure for phase 2"
```

---

### Task 4: Browser smoke-test

**Files:** (none — visual verification only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:5173 and navigate to the Ishikawa atelier.

- [ ] **Step 2: Verify phase 1**

Check visually:
- Queue (V ouvert vers la gauche) visible à gauche de la spine
- Spine horizontale violet → tête de poisson à droite (ovale + œil)
- Label "Vélocité insuffisante" dans la tête
- 3 drop zones en haut + 3 en bas aux extrémités des arêtes
- Drag d'une étiquette de catégorie vers une zone fonctionne
- Vérifier → zones passent vert/rouge selon correction
- "Phase suivante" apparaît si 6/6

- [ ] **Step 3: Verify phase 2**

Check visually:
- Même structure fishbone affichée
- Chaque zone montre le header de catégorie + espace de dépôt
- Drag des cartes-causes dans les zones fonctionne
- Les zones s'agrandissent verticalement quand des cartes sont déposées
- Vérifier → cartes passent vert/rouge

- [ ] **Step 4: Verify phase 3 unchanged**

Check: la vue liste phase 3 (checkboxes + champs) est identique à l'avant.
