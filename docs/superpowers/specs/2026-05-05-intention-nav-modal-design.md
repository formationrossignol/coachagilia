# Intention Nav — Modal & Tile Redesign

**Date:** 2026-05-05
**Status:** Approved

## Goal

Replace the current "Par intention" behaviour (tiles + filtered grid below) with:
1. A redesigned tile grid — the only content visible in intention view.
2. A modal that opens on tile click and shows the matching WorkshopCards.

---

## Tile Redesign

### Layout
- 4-column grid (`repeat(4, 1fr)`) replacing the current 2-column layout.
- Tiles are vertically centred (`flex-direction: column; align-items: center; text-align: center`).

### Visual style — mirrors WorkshopCard
Each intention gets a dedicated accent colour (`--acc` / `--acc-rgb`):

| Intention slug              | Accent colour | RGB              |
|-----------------------------|---------------|------------------|
| `gerer-conflit`             | `#f87171`     | 248,113,113      |
| `faciliter-decision`        | `#60a5fa`     | 96,165,250       |
| `debloquer-equipe`          | `#34d399`     | 52,211,153       |
| `preparer-retro`            | `#a78bfa`     | 167,139,250      |
| `cause-racine`              | `#fbbf24`     | 251,191,36       |
| `aligner-parties-prenantes` | `#38bdf8`     | 56,189,248       |
| `ameliorer-flow`            | `#fb923c`     | 251,146,60       |
| `preparer-coaching`         | `#6366f1`     | 99,102,241       |

**Background:** `radial-gradient(ellipse at 50% 0%, rgba(acc-rgb, 0.12) 0%, transparent 65%) + linear-gradient(160deg, #1b1f33 0%, #0f1117 65%)`

**Border:** `1px solid rgba(255,255,255,0.065)` + `border-top: 2px solid var(--acc)` + `border-radius: 14px`

**Box-shadow:** `inset 0 1px 0 rgba(255,255,255,0.055), 0 4px 16px rgba(0,0,0,0.32)`

**Hover:** `translateY(-3px)` + elevated shadow + `0 0 0 1px rgba(acc-rgb, 0.35)`

**Glass sheen (`::before`):** `linear-gradient(135deg, rgba(255,255,255,0.045) 0%, transparent 40%)`

### Tile content (top → bottom, centred)
1. **Emoji** — `2rem`, `filter: drop-shadow(0 0 10px rgba(acc-rgb, 0.45))`
2. **Label** — `0.58rem`, uppercase, `letter-spacing: 0.1em`, `color: var(--acc)` with glow text-shadow
3. **Name** — `0.8rem`, `font-weight: 700`
4. **Subtitle** — `0.68rem`, muted
5. **Count badge** — `0.65rem`, pill shape, `background: rgba(acc-rgb, 0.15)`, `color: var(--acc)`

### No active state
Tiles do not toggle an active filter. Clicking always opens the modal. There is no `activeIntention` state.

---

## AteliersHome changes

- Remove `activeIntention` state.
- Remove the `visible` filtered array in intention view.
- In intention view: render only `<IntentionNav>` — no `<div className="ateliers-grid">` below.
- `IntentionNav` receives a new `onSelect` prop (`(slug: string) => void`) that opens the modal with the clicked intention.

---

## IntentionModal component

**File:** `src/components/IntentionModal/index.tsx`

### Trigger
`AteliersHome` holds `modalIntention: string | null` state. When a tile is clicked, it sets `modalIntention` to the intention slug. When the modal closes, it resets to `null`.

### Structure

```
<dialog / portal>
  backdrop (rgba overlay, click to close)
  modal-box (max-width: 680px, centered)
    modal-header
      emoji  label  title  subtitle  close-button(×)
    modal-body
      2-column grid of <WorkshopCard> (both real + coming-soon)
    modal-footer
      "X ateliers disponibles · Y à venir"
```

### Modal header
- Background: `radial-gradient(ellipse at 90% -20%, rgba(acc-rgb, 0.12) 0%, transparent 60%)`
- Bottom border: `1px solid var(--color-border)`
- Emoji: `2rem`, flex-shrink 0
- Label: `0.6rem`, uppercase, accent colour with glow
- Title: `1.15rem`, bold
- Subtitle: `0.8rem`, muted
- Close button: `28×28px`, `border-radius: 6px`, `background: var(--color-surface-2)`

### Modal body
- Padding: `1.25rem`
- Grid: `display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem`
- Renders existing `<WorkshopCard>` with `isCompleted` prop populated from gamification store

### Modal footer
- Padding: `0.9rem 1.5rem`
- Top border: `1px solid var(--color-border)`
- Text: `"X atelier(s) disponible(s) · Y à venir"` — muted, centred

### Close behaviour
- Click backdrop → close
- Click × button → close
- Press Escape → close (`useEffect` on `keydown`)

### Scroll
- Modal body scrolls (`overflow-y: auto`) when content exceeds viewport height.
- Max modal height: `90vh`.

### Accessibility
- Modal uses a `<dialog>` element (or `role="dialog"` + `aria-modal="true"` if portal).
- Focus is trapped inside while open.
- `aria-labelledby` points to the title element.

---

## CSS changes (`src/index.css`)

- Replace `.intention-nav` grid: `grid-template-columns: repeat(4, 1fr)`
- Replace `.intention-nav__tile` styles with the new card design (see above)
- Remove `.intention-nav__tile--active` (no longer needed)
- Add `.intention-modal` overlay + box + header + body + footer classes

---

## Files

| Action | File |
|--------|------|
| Modify | `src/components/IntentionNav/index.tsx` |
| Modify | `src/components/IntentionNav/IntentionNav.test.tsx` |
| Create | `src/components/IntentionModal/index.tsx` |
| Create | `src/components/IntentionModal/IntentionModal.test.tsx` |
| Modify | `src/components/AteliersHome/index.tsx` |
| Modify | `src/components/AteliersHome/AteliersHome.test.tsx` |
| Modify | `src/index.css` |

---

## Out of scope
- No changes to WorkshopCard itself.
- No changes to the "Liste complète" view.
- No animation library — CSS transitions only.
