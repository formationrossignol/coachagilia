# Premium UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the entire visual layer of Scrum Master Sim with a premium, Linear/Vercel/Raycast-inspired dark UI — Geist fonts, zinc neutrals, corner bracket decorators, indigo only for CTAs — without changing any app logic.

**Architecture:** All CSS lives in `src/index.css` (~3000 lines) plus `src/components/gamification/gamification.css`. No Tailwind. No shadcn. JSX changes are limited to removing inline styles from `CertificationHub/index.tsx`. Font imports via `@fontsource/*` packages imported in `src/main.tsx`.

**Tech Stack:** React 19 + TypeScript + Vite, custom CSS (BEM-like), Geist Sans + Geist Mono fonts, Vitest (467 tests — must stay green throughout)

**Working directory:** `.worktrees/redesign-premium` (branch `redesign/premium-ui`)

---

## File Map

| File | Change |
|------|--------|
| `package.json` | Add `@fontsource/geist-sans` + `@fontsource/geist-mono` |
| `src/main.tsx` | Import both Geist font CSS files |
| `src/index.css` | Full CSS rewrite — tokens, all component styles |
| `src/components/gamification/gamification.css` | Update tokens + component styles |
| `src/components/CertificationHub/index.tsx` | Remove inline styles, use CSS classes |

---

## Task 1: Install Geist fonts

**Files:**
- Modify: `package.json`
- Modify: `src/main.tsx`

- [ ] **Step 1: Install font packages**

```bash
cd .worktrees/redesign-premium
npm install @fontsource/geist-sans @fontsource/geist-mono
```

Expected: packages added to `node_modules/`, `package.json` updated.

- [ ] **Step 2: Import fonts in main.tsx**

Replace `src/main.tsx` with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './components/gamification/gamification.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-mono/400.css'

// Init theme before React renders — prevents flash of wrong theme
const stored = localStorage.getItem('scrum-sim-theme')
document.documentElement.setAttribute('data-theme', stored ?? 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Verify build**

```bash
cd .worktrees/redesign-premium
npm run build
```

Expected: build succeeds, no errors.

- [ ] **Step 4: Run tests**

```bash
npm test -- --run
```

Expected: 467 tests pass, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/main.tsx
git commit -m "feat(redesign): install Geist Sans + Geist Mono fonts"
```

---

## Task 2: Replace CSS design tokens

**Files:**
- Modify: `src/index.css` (lines 1–88, the `:root` and `[data-theme="light"]` blocks)

Replace the entire `:root` and `[data-theme="light"]` blocks at the top of `src/index.css` with:

- [ ] **Step 1: Replace tokens**

Find and replace the content from line 1 through the closing `}` of `[data-theme="light"]` (approximately lines 1–88) with:

```css
/* src/index.css */

/* ── Dark theme (default) ── */
:root {
  --color-bg:           #09090d;
  --color-surface:      #111116;
  --color-surface-2:    #18181f;
  --color-surface-3:    #1e1e28;
  --color-border:       rgba(255,255,255,0.06);
  --color-border-2:     rgba(255,255,255,0.10);
  --color-border-solid: #222228;
  --color-text:         #f4f4f6;
  --color-text-muted:   #a1a1b5;
  --color-text-subtle:  #62627a;
  --color-primary:      #6366f1;
  --color-primary-hover:#7577f5;
  --color-primary-subtle: rgba(99,102,241,0.12);
  --color-primary-border: rgba(99,102,241,0.25);
  --color-ok:           #22c55e;
  --color-danger:       #ef4444;
  --color-warning:      #f59e0b;

  --font:      'Geist Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', 'Courier New', monospace;

  --radius-sm: 4px;
  --radius:    6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Navbar */
  --navbar-bg:              rgba(9,9,13,0.92);
  --navbar-border:          rgba(255,255,255,0.06);
  --navbar-link-active-bg:  rgba(99,102,241,0.10);

  /* Cards */
  --card-bg:          #111116;
  --card-border:      rgba(255,255,255,0.06);
  --card-shadow:      0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
  --card-hover-shadow:0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4);

  /* Modal */
  --modal-overlay-bg: rgba(0,0,0,0.72);
  --modal-bg:         #111116;
  --modal-border:     rgba(255,255,255,0.08);
}

/* ── Light theme ── */
[data-theme="light"] {
  --color-bg:           #fafafa;
  --color-surface:      #ffffff;
  --color-surface-2:    #f4f4f5;
  --color-surface-3:    #e4e4e7;
  --color-border:       rgba(0,0,0,0.08);
  --color-border-2:     rgba(0,0,0,0.14);
  --color-border-solid: #e4e4e7;
  --color-text:         #09090b;
  --color-text-muted:   #71717a;
  --color-text-subtle:  #a1a1aa;
  --color-primary:      #6366f1;
  --color-primary-hover:#4f46e5;
  --color-primary-subtle: rgba(99,102,241,0.08);
  --color-primary-border: rgba(99,102,241,0.20);
  --color-ok:           #16a34a;
  --color-danger:       #dc2626;
  --color-warning:      #d97706;

  --navbar-bg:              rgba(250,250,250,0.92);
  --navbar-border:          rgba(0,0,0,0.08);
  --navbar-link-active-bg:  rgba(99,102,241,0.06);

  --card-bg:          #ffffff;
  --card-border:      rgba(0,0,0,0.08);
  --card-shadow:      0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  --card-hover-shadow:0 8px 32px rgba(0,0,0,0.10);

  --modal-overlay-bg: rgba(9,9,11,0.5);
  --modal-bg:         #ffffff;
  --modal-border:     rgba(0,0,0,0.10);
}
```

- [ ] **Step 2: Update `--font` usages in body rule**

Find the `body` rule (around line 90) and update:

```css
body {
  font-family: var(--font);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): update CSS design tokens to premium zinc/indigo palette"
```

---

## Task 3: Redesign NavBar

**Files:**
- Modify: `src/index.css` — the `NAVBAR` section (around lines 293–372)

- [ ] **Step 1: Replace NavBar CSS block**

Find `/* ══ NAVBAR` section and replace the entire block (`.navbar` through `.navbar__theme-toggle:hover`) with:

```css
/* ══════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════ */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 52px;
  background: var(--navbar-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--navbar-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}
.navbar__brand-icon { color: var(--color-primary); flex-shrink: 0; }
.navbar__brand:hover { color: var(--color-text-muted); }

.navbar__links {
  display: flex;
  list-style: none;
  gap: 0;
}

.navbar__link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  position: relative;
}
.navbar__link:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
}
.navbar__link--active {
  color: var(--color-text);
}
.navbar__link--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0.75rem;
  right: 0.75rem;
  height: 1px;
  background: var(--color-primary);
  border-radius: 1px;
}

[data-theme="light"] .navbar__link:hover { background: rgba(0,0,0,0.04); }
[data-theme="light"] .navbar__link--active { color: var(--color-text); }

.navbar__theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-subtle);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.navbar__theme-toggle:hover {
  background: rgba(255,255,255,0.06);
  color: var(--color-text);
  border-color: var(--color-border-2);
}
[data-theme="light"] .navbar__theme-toggle:hover { background: rgba(0,0,0,0.05); }
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): navbar — 52px height, underline active, refined toggle"
```

---

## Task 4: Redesign Home page cards

**Files:**
- Modify: `src/index.css` — the `HOME PAGE` section (around lines 374–522)

The key change: replace the current shimmer `::before`/`::after` effects with corner bracket decorators + dot grid background on hover.

- [ ] **Step 1: Replace Home page CSS block**

Find `/* ══ HOME PAGE` and replace the entire section through `.home-card__cta:hover` with:

```css
/* ══════════════════════════════════════════════════════════
   HOME PAGE — corner bracket cards + dot grid
   ══════════════════════════════════════════════════════════ */
.home { max-width: 1080px; margin: 0 auto; padding: 4.5rem 2rem 4rem; }

.home__header { text-align: center; margin-bottom: 3.5rem; }

.home__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-subtle);
  margin-bottom: 1.25rem;
  font-family: var(--font-mono);
}
.home__eyebrow::before { content: '['; color: var(--color-primary); }
.home__eyebrow::after  { content: ']'; color: var(--color-primary); }

.home__title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  color: var(--color-text);
}

[data-theme="light"] .home__title { color: var(--color-text); }

.home__subtitle {
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.7;
}

.home__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

/* ── Corner bracket card pattern ── */
.home-card {
  --home-card-accent: #6366f1;
  --home-card-accent-rgb: 99,102,241;
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

/* Top-left corner bracket */
.home-card::before {
  content: '';
  position: absolute;
  top: 10px; left: 10px;
  width: 16px; height: 16px;
  border-top: 1.5px solid rgba(255,255,255,0.10);
  border-left: 1.5px solid rgba(255,255,255,0.10);
  border-radius: 2px 0 0 0;
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  pointer-events: none;
}

/* Bottom-right corner bracket */
.home-card::after {
  content: '';
  position: absolute;
  bottom: 10px; right: 10px;
  width: 16px; height: 16px;
  border-bottom: 1.5px solid rgba(255,255,255,0.10);
  border-right: 1.5px solid rgba(255,255,255,0.10);
  border-radius: 0 0 2px 0;
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  pointer-events: none;
}

.home-card:hover {
  border-color: var(--color-border-2);
  transform: translateY(-3px);
  box-shadow: var(--card-hover-shadow);
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0);
  background-size: 32px 32px;
}

.home-card:hover::before,
.home-card:hover::after {
  width: 22px; height: 22px;
  border-color: rgba(var(--home-card-accent-rgb), 0.6);
}

[data-theme="light"] .home-card:hover { background-image: none; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
[data-theme="light"] .home-card::before,
[data-theme="light"] .home-card::after { border-color: rgba(0,0,0,0.10); }
[data-theme="light"] .home-card:hover::before,
[data-theme="light"] .home-card:hover::after { border-color: rgba(var(--home-card-accent-rgb), 0.4); }

.home-card > * { position: relative; z-index: 1; }

.home-card__icon-wrap {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-md);
  background: rgba(var(--home-card-accent-rgb), 0.10);
  border: 1px solid rgba(var(--home-card-accent-rgb), 0.20);
  color: var(--home-card-accent);
  flex-shrink: 0;
  margin-bottom: 0.25rem;
}

.home-card__meta { display: flex; }

.home-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin: 0;
}

.home-card__description {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  flex: 1;
}

.home-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-top: 0.25rem;
  transition: color 0.15s;
}
.home-card__cta:hover { color: var(--color-text); }
.home-card:hover .home-card__cta { color: var(--home-card-accent); }
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): home page — corner bracket cards, dot grid hover, zinc header"
```

---

## Task 5: Shared components — buttons, badges, modal, progress-bar

**Files:**
- Modify: `src/index.css` — `.btn`, `.badge`, `.modal-*`, `.progress-bar` sections

- [ ] **Step 1: Replace button styles**

Find `.btn {` block and replace through `.btn--danger:hover` with:

```css
/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: var(--font);
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  text-decoration: none;
  white-space: nowrap;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn--primary {
  background: var(--color-primary);
  color: #fff;
  border-color: transparent;
}
.btn--primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border-2);
}
.btn--secondary:hover:not(:disabled) {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.15);
}
[data-theme="light"] .btn--secondary:hover:not(:disabled) { background: rgba(0,0,0,0.04); }
.btn--danger {
  background: rgba(239,68,68,0.10);
  border-color: rgba(239,68,68,0.30);
  color: #fca5a5;
}
.btn--danger:hover:not(:disabled) {
  background: rgba(239,68,68,0.18);
  color: #fff;
}
```

- [ ] **Step 2: Replace badge styles**

Find `.badge {` block (the utility badge, not the gamification BadgeCard) and replace through `.badge--blue` with:

```css
/* ── Status badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.badge--green  { background: rgba(34,197,94,0.12);  color: #4ade80; }
.badge--orange { background: rgba(245,158,11,0.12); color: #fbbf24; }
.badge--red    { background: rgba(239,68,68,0.12);  color: #fca5a5; }
.badge--blue   { background: rgba(96,165,250,0.12); color: #60a5fa; }
[data-theme="light"] .badge--green  { background: rgba(22,163,74,0.10);  color: #16a34a; }
[data-theme="light"] .badge--orange { background: rgba(217,119,6,0.10);  color: #b45309; }
[data-theme="light"] .badge--red    { background: rgba(220,38,38,0.10);  color: #dc2626; }
[data-theme="light"] .badge--blue   { background: rgba(37,99,235,0.10);  color: #2563eb; }
```

- [ ] **Step 3: Update modal styles**

Find the `/* ══ MODAL` block and update the `.modal` rule — change `border-radius: 18px` to `border-radius: var(--radius-lg)` and the box-shadow:

```css
.modal {
  position: relative;
  background: var(--modal-bg);
  border: 1px solid var(--modal-border);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem 1.75rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  animation: slideUp 0.2s ease;
  text-align: center;
}
[data-theme="light"] .modal { box-shadow: 0 16px 40px rgba(0,0,0,0.14); }
```

- [ ] **Step 4: Update progress-bar styles**

Find `.progress-bar {` block and update `.progress-bar__fill`:

```css
.progress-bar__track {
  height: 4px;
  background: var(--color-surface-3);
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar__fill {
  height: 100%;
  border-radius: 2px;
  background: var(--color-primary);
  transition: width 0.4s ease;
}
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): shared components — buttons, badges, modal, progress-bar"
```

---

## Task 6: Simulation screen styles

**Files:**
- Modify: `src/index.css` — simulation section (`.simulation-layout` through `.debrief-actions`)

- [ ] **Step 1: Update simulation layout and scene styles**

Find `.simulation-layout {` and replace through `.debrief-actions {`:

```css
/* ══════════════════════════════════════════════════════════
   SIMULATION
   ══════════════════════════════════════════════════════════ */
.simulation-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  height: calc(100vh - 52px);
  overflow: hidden;
}

.simulation-main { padding: 2rem 2.5rem; overflow-y: auto; }

.scene-header { margin-bottom: 1.5rem; }

.scene-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  font-family: var(--font-mono);
  margin-bottom: 0.75rem;
}

.scene-title {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.scene-characters { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.character-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.scene-narrative {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--color-text);
  white-space: pre-line;
  margin: 1.25rem 0 1.75rem;
  padding: 1.25rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  border-left: 2px solid var(--color-border-2);
}

.choices-section { display: flex; flex-direction: column; gap: 0.5rem; }

.choice-btn {
  width: 100%;
  text-align: left;
  padding: 0.875rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  font-family: var(--font);
  line-height: 1.55;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.choice-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.feedback-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: var(--modal-overlay-bg);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}

.feedback-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.feedback-card__consequence {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 1.25rem;
}

.simulation-sidebar {
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  padding: 1.25rem;
  overflow-y: auto;
}

.simulation-sidebar__title {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-bottom: 0.75rem;
  font-family: var(--font-mono);
}

/* Debrief */
.debrief { max-width: 760px; margin: 0 auto; padding: 3rem 2rem; }
.debrief section { margin-bottom: 2.5rem; }
.debrief h3 {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-subtle);
  margin-bottom: 1rem;
  font-family: var(--font-mono);
}
.debrief-global { text-align: center; }
.debrief-score {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  font-family: var(--font-mono);
  color: var(--color-primary);
  line-height: 1;
  display: block;
}
.debrief-label { font-size: 0.875rem; color: var(--color-text-muted); margin-top: 0.25rem; }
.debrief-choices { display: flex; flex-direction: column; gap: 0.75rem; }
.debrief-choice {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
  padding: 0.875rem 1rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  border-left: 2px solid transparent;
  font-size: 0.875rem;
}
.debrief-choice--positive { border-left-color: var(--color-ok); }
.debrief-choice--negative { border-left-color: var(--color-danger); }
.debrief-choice--neutral  { border-left-color: var(--color-border-2); }
.debrief-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; gap: 1rem;
  color: var(--color-text-muted); text-align: center;
}
.debrief-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): simulation and debrief screens"
```

---

## Task 7: Quiz and Quiz Results styles

**Files:**
- Modify: `src/index.css` — quiz section (`.quiz-selector` through `.quiz-legend-dot--flagged`)

- [ ] **Step 1: Update quiz selector**

Find `.quiz-selector {` and update:

```css
/* ── Quiz Selector ── */
.quiz-selector { max-width: 860px; margin: 0 auto; padding: 3rem 2rem; }
.selector-header { margin-bottom: 2.5rem; }
.selector-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0.4rem;
}
.selector-header p { color: var(--color-text-muted); font-size: 0.9375rem; }

.quiz-exam-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; }

.quiz-exam-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  box-shadow: none;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
  text-decoration: none;
  color: inherit;
}
.quiz-exam-card::before { display: none; }
.quiz-exam-card:hover { border-color: var(--color-border-2); transform: translateY(-2px); }
.quiz-exam-card > * { position: relative; z-index: 1; }
.quiz-exam-card__title { font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; }
.quiz-exam-card__meta  { color: var(--color-text-muted); font-size: 0.8125rem; }
```

- [ ] **Step 2: Update quiz screen styles**

Find `.quiz-screen {` through `.quiz-legend-dot--flagged` and update:

```css
/* ── Quiz Screen ── */
.quiz-screen { display: flex; flex-direction: column; height: calc(100vh - 52px); }
.quiz-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.625rem 1.75rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  height: 48px;
}
.quiz-header__left, .quiz-header__right { display: flex; align-items: center; gap: 1.25rem; }
.quiz-exam-title    { font-weight: 600; font-size: 0.875rem; }
.quiz-question-counter { color: var(--color-text-muted); font-size: 0.8125rem; }
.quiz-progress-count   { color: var(--color-text-muted); font-size: 0.8125rem; }
.quiz-timer {
  font-size: 1rem; font-weight: 600;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.quiz-timer--urgent { color: var(--color-danger); }

.quiz-body { display: grid; grid-template-columns: 1fr 192px; flex: 1; overflow: hidden; }
.quiz-main { padding: 1.75rem 2.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; }

.quiz-multiple-hint {
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  color: var(--color-warning);
  display: inline-flex;
}

.quiz-question-text { font-size: 1rem; line-height: 1.75; white-space: pre-line; }
.quiz-options { display: flex; flex-direction: column; gap: 0.5rem; }

.quiz-option {
  display: flex; align-items: flex-start; gap: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.quiz-option:hover { border-color: var(--color-border-2); background: var(--color-surface-2); }
.quiz-option--selected { border-color: var(--color-primary); background: var(--color-primary-subtle); }
.quiz-option__input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); }
.quiz-option__letter {
  min-width: 22px; height: 22px; border-radius: var(--radius-sm);
  background: var(--color-surface-2); border: 1px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 600; flex-shrink: 0;
  font-family: var(--font-mono);
}
.quiz-option--selected .quiz-option__letter { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.quiz-option__text { font-size: 0.9rem; line-height: 1.55; }
.quiz-nav-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }

.quiz-sidebar {
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  padding: 1rem;
  overflow-y: auto;
}
.quiz-sidebar__title {
  font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--color-text-subtle); margin-bottom: 0.75rem;
  font-family: var(--font-mono);
}
.quiz-question-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.3rem; }
.quiz-question-dot {
  aspect-ratio: 1; border-radius: var(--radius-sm);
  font-size: 0.6875rem; font-weight: 600;
  background: var(--color-surface-2); border: 1px solid var(--color-border);
  color: var(--color-text-muted); cursor: pointer; transition: background 0.1s;
}
.quiz-question-dot--answered { background: var(--color-ok); color: #fff; border-color: var(--color-ok); }
.quiz-question-dot--current  { border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-primary-subtle); }
.quiz-question-dot--flagged  { background: rgba(251,191,36,0.12); border-color: #fbbf24; color: #fbbf24; }
.quiz-question-dot--flagged.quiz-question-dot--answered {
  background: linear-gradient(135deg, var(--color-ok) 55%, rgba(251,191,36,0.4) 55%);
  border-color: #fbbf24; color: #fff;
}

.quiz-question-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 28px; }
.quiz-flag-btn {
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem; font-weight: 500;
  color: var(--color-text-subtle);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap; flex-shrink: 0; margin-left: auto;
}
.quiz-flag-btn:hover { border-color: #fbbf24; color: #fbbf24; background: rgba(251,191,36,0.06); }
.quiz-flag-btn--active { border-color: #fbbf24; color: #fbbf24; background: rgba(251,191,36,0.10); }
.quiz-flag-count { display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; color: #fbbf24; }
.quiz-flag-count__icon { flex-shrink: 0; }
.quiz-sidebar__legend { display: flex; align-items: center; gap: 0.4rem; margin-top: 1rem; font-size: 0.6875rem; color: var(--color-text-muted); }
.quiz-legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.quiz-legend-dot--flagged { background: #fbbf24; }
```

- [ ] **Step 3: Update quiz results styles**

Find `.quiz-results {` and update:

```css
/* ── Quiz Results ── */
.quiz-results { max-width: 820px; margin: 0 auto; padding: 3rem 2rem; }
.quiz-results__global { text-align: center; margin-bottom: 2.5rem; }
.quiz-score { margin-bottom: 1rem; }
.quiz-score__value {
  font-size: 3.5rem; font-weight: 700; color: var(--color-primary);
  display: block; line-height: 1;
  font-family: var(--font-mono); letter-spacing: -0.04em;
}
.quiz-score__pct { font-size: 1.25rem; color: var(--color-text-muted); font-family: var(--font-mono); }
.quiz-results__badge { font-size: 0.875rem; padding: 0.35rem 0.875rem; margin: 0.75rem 0; display: inline-block; }
.quiz-results__time  { color: var(--color-text-muted); font-size: 0.875rem; margin-top: 0.5rem; }
.quiz-results__section-title { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; }
.quiz-review-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.quiz-review-item {
  background: var(--color-surface);
  border-radius: var(--radius-md); padding: 0.875rem 1rem;
  border-left: 2px solid transparent;
}
.quiz-review-item--correct { border-left-color: var(--color-ok); }
.quiz-review-item--wrong   { border-left-color: var(--color-danger); }
.quiz-review-item__question { font-size: 0.9rem; line-height: 1.6; white-space: pre-line; margin-bottom: 0.4rem; }
.quiz-review-item__your-answer   { font-size: 0.8125rem; color: var(--color-text-muted); }
.quiz-review-item__correct-answer { font-size: 0.8125rem; color: var(--color-ok); margin-top: 0.25rem; }
.quiz-results__actions { display: flex; gap: 0.75rem; margin-top: 2.5rem; flex-wrap: wrap; }
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): quiz selector, quiz screen, quiz results"
```

---

## Task 8: CertificationHub — remove inline styles

**Files:**
- Modify: `src/components/CertificationHub/index.tsx`
- Modify: `src/index.css` — add `.cert-card` CSS class

The current `CertificationHub/index.tsx` uses inline styles for the card color bar, icon, and progress bar. Replace with CSS classes.

- [ ] **Step 1: Add CSS classes for cert cards**

In `src/index.css`, find `.quiz-exam-grid` and after it add:

```css
/* ── Certification Hub ── */
.cert-hub { max-width: 860px; margin: 0 auto; padding: 3rem 2rem; }
.cert-hub-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 2rem; }

.cert-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--cert-card-color, var(--color-primary));
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, transform 0.2s;
}
.cert-card:hover { transform: translateY(-2px); border-color: var(--cert-card-color, var(--color-primary)); }

.cert-card__header { display: flex; align-items: center; gap: 0.75rem; }
.cert-card__icon {
  width: 36px; height: 36px;
  background: var(--cert-card-color, var(--color-primary));
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 0.6875rem;
  flex-shrink: 0; font-family: var(--font-mono);
}
.cert-card__title { font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
.cert-card__subtitle { margin: 0; font-size: 0.75rem; color: var(--color-text-muted); }
.cert-card__meta { color: var(--color-text-muted); font-size: 0.8125rem; }

.cert-card__progress-track {
  height: 3px;
  background: var(--color-surface-3);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.25rem;
}
.cert-card__progress-fill {
  height: 100%;
  background: var(--cert-card-color, var(--color-primary));
  border-radius: 2px;
  transition: width 0.4s ease;
}
```

- [ ] **Step 2: Refactor CertificationHub JSX**

Replace `src/components/CertificationHub/index.tsx` with:

```tsx
import { Link } from 'react-router-dom'
import { getAllCertifications } from '../../data/certifications'
import { useGamificationStore } from '../../features/gamification/gamification.store'

export function CertificationHub() {
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  return (
    <div className="cert-hub">
      <header className="selector-header">
        <h1>Certifications Agile</h1>
        <p>Prépare-toi à l'examen de ton choix — examens, entraînement par thème et ressources.</p>
      </header>
      <div className="cert-hub-grid">
        {getAllCertifications().map(cert => {
          const completedCount = getCompletedSlugs().filter(s =>
            cert.examDefs.some(e => e.id === s)
          ).length
          const progress = Math.round((completedCount / cert.examDefs.length) * 100)

          return (
            <Link
              key={cert.id}
              to={`/certifications/${cert.id}`}
              className="cert-card"
              style={{ '--cert-card-color': cert.color } as React.CSSProperties}
            >
              <div className="cert-card__header">
                <div className="cert-card__icon">{cert.shortName}</div>
                <div>
                  <h2 className="cert-card__title">{cert.name}</h2>
                  <p className="cert-card__subtitle">{cert.issuer} · {cert.levels.join(' / ')}</p>
                </div>
              </div>
              <p className="cert-card__meta">
                {cert.examDefs.length} examens · {cert.topics.length} thèmes
              </p>
              <div className="cert-card__progress-track">
                <div className="cert-card__progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/components/CertificationHub/index.tsx
git commit -m "feat(redesign): CertificationHub — remove inline styles, add cert-card CSS class"
```

---

## Task 9: Ateliers — WorkshopCard, IntentionNav, AteliersHome

**Files:**
- Modify: `src/index.css` — ateliers section

- [ ] **Step 1: Update AteliersHome styles**

Find `.ateliers-home {` block and update through `.ateliers-grid`:

```css
/* ── Ateliers Home ── */
.ateliers-home { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
.ateliers-home__toolbar { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
.ateliers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
```

- [ ] **Step 2: Update view toggle**

Find `.view-toggle {` block and update:

```css
/* ── View Toggle ── */
.view-toggle {
  display: inline-flex;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 2px;
}
.view-toggle__btn {
  background: none; border: none; border-radius: 999px;
  padding: 4px 12px; font-size: 0.75rem;
  color: var(--color-text-muted); cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: var(--font);
}
.view-toggle__btn--active { background: var(--color-primary); color: #fff; }
.view-toggle__btn:hover:not(.view-toggle__btn--active) { color: var(--color-text); }
```

- [ ] **Step 3: Update WorkshopCard styles**

Find `.workshop-card {` main block (around line 2253) and update through `.workshop-card__summary`:

The key changes: remove the current shimmer effects (the `::before` and `::after` on `.workshop-card`), replace with corner brackets. Keep the accent color system.

Find the entire `.workshop-card {` CSS block (after the data-category attribute selectors) and replace with:

```css
.workshop-card {
  --card-accent: #6366f1;
  --card-accent-rgb: 99,102,241;
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

/* Top-left corner bracket */
.workshop-card::before {
  content: '';
  position: absolute; top: 10px; left: 10px;
  width: 14px; height: 14px;
  border-top: 1.5px solid rgba(255,255,255,0.08);
  border-left: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 2px 0 0 0;
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  pointer-events: none;
}

/* Bottom-right corner bracket */
.workshop-card::after {
  content: '';
  position: absolute; bottom: 10px; right: 10px;
  width: 14px; height: 14px;
  border-bottom: 1.5px solid rgba(255,255,255,0.08);
  border-right: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 0 0 2px 0;
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  pointer-events: none;
}

.workshop-card > * { position: relative; z-index: 1; }

.workshop-card:not(.workshop-card--coming-soon):hover {
  border-color: rgba(var(--card-accent-rgb), 0.35);
  transform: translateY(-2px);
}
.workshop-card:not(.workshop-card--coming-soon):hover::before,
.workshop-card:not(.workshop-card--coming-soon):hover::after {
  width: 18px; height: 18px;
  border-color: rgba(var(--card-accent-rgb), 0.5);
}

.workshop-card--coming-soon { opacity: 0.5; cursor: default; }

.workshop-card__header {
  display: flex; justify-content: space-between; align-items: flex-start;
}
.workshop-card__cat {
  font-size: 0.6875rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: rgba(var(--card-accent-rgb), 0.8);
  font-family: var(--font-mono);
}
.workshop-card__duration {
  font-size: 0.6875rem; color: var(--color-text-subtle);
  font-family: var(--font-mono);
}
.workshop-card__badge-soon {
  display: inline-flex; padding: 0.15rem 0.5rem;
  background: rgba(255,255,255,0.05); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); font-size: 0.6875rem;
  color: var(--color-text-subtle);
}
.workshop-card__body { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
.workshop-card__title { font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; }
.workshop-card__summary { font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.6; }
```

- [ ] **Step 4: Update IntentionNav styles**

Find `.intention-nav {` block and update the tiles to use corner brackets instead of shimmer:

```css
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
  display: flex; flex-direction: column; align-items: center; text-align: center;
  gap: 0.4rem;
  padding: 1.25rem 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--tile-acc);
  border-radius: var(--radius-lg);
  cursor: pointer; overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}
.intention-nav__tile:hover {
  transform: translateY(-2px);
  border-color: var(--tile-acc);
}
.intention-nav__tile::before { display: none; }
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): ateliers — WorkshopCard corner brackets, IntentionNav, AteliersHome"
```

---

## Task 10: Gamification CSS (`gamification.css`)

**Files:**
- Modify: `src/components/gamification/gamification.css`

- [ ] **Step 1: Replace gamification.css**

Replace the entire file with:

```css
/* src/components/gamification/gamification.css */

/* ── MasteryLevelBadge ── */
.mastery-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.mastery-badge--discovery         { background: rgba(161,161,181,0.12); color: #a1a1b5; }
.mastery-badge--practice          { background: rgba(96,165,250,0.12);  color: #60a5fa; }
.mastery-badge--proficiency       { background: rgba(34,197,94,0.12);   color: #4ade80; }
.mastery-badge--field_application { background: rgba(245,158,11,0.12);  color: #fbbf24; }
.mastery-badge--transmission      { background: rgba(168,85,247,0.12);  color: #c084fc; }

/* ── XpSummaryCard ── */
.xp-summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
}
.xp-summary-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  font-family: var(--font-mono);
  letter-spacing: -0.04em;
}
.xp-summary-card__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-family: var(--font-mono);
}

/* ── RecentProgressFeed ── */
.progress-feed { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
.progress-feed--empty { color: var(--color-text-muted); font-size: 0.875rem; padding: 1rem 0; }
.progress-feed__item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.progress-feed__label { font-size: 0.8125rem; }
.progress-feed__xp { font-size: 0.75rem; font-weight: 600; color: var(--color-primary); font-family: var(--font-mono); }

/* ── SkillRadar ── */
.skill-radar { width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto; }
.skill-radar__grid-circle { fill: none; stroke: var(--color-border); stroke-width: 1; }
.skill-radar__axis        { stroke: var(--color-border); stroke-width: 1; }
.skill-radar__polygon     { fill: rgba(99,102,241,0.18); stroke: var(--color-primary); stroke-width: 1.5; }
.skill-radar__label       { font-size: 9px; fill: var(--color-text-muted); font-family: var(--font-mono); }

/* ── SkillProgressCard ── */
.skill-progress-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex; flex-direction: column; gap: 0.5rem;
}
.skill-progress-card__header { display: flex; justify-content: space-between; align-items: center; }
.skill-progress-card__name   { font-weight: 500; font-size: 0.875rem; }
.skill-progress-card__xp     { font-size: 0.75rem; color: var(--color-text-subtle); font-family: var(--font-mono); }
.skill-progress-card__recs   { margin-top: 0.25rem; font-size: 0.75rem; color: var(--color-text-muted); }
.skill-progress-card__recs-label { font-weight: 600; margin-right: 0.25rem; }
.skill-progress-card__recs ul { list-style: disc; padding-left: 1rem; margin-top: 0.25rem; }

/* ── BadgeCard ── */
.badge-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex; gap: 0.75rem; align-items: flex-start;
  transition: border-color 0.2s;
}
.badge-card:not(.badge-card--locked):hover { border-color: var(--color-border-2); }
.badge-card--locked { opacity: 0.35; filter: grayscale(0.6); }
.badge-card__icon { color: var(--color-primary); flex-shrink: 0; }
.badge-card--locked .badge-card__icon { color: var(--color-text-subtle); }
.badge-card__body  { display: flex; flex-direction: column; gap: 0.2rem; }
.badge-card__title { font-size: 0.875rem; font-weight: 600; }
.badge-card__description { font-size: 0.75rem; color: var(--color-text-muted); line-height: 1.5; }
.badge-card__unlocked-at { font-size: 0.6875rem; color: var(--color-ok); font-family: var(--font-mono); }
.badge-card__criteria { list-style: disc; padding-left: 1rem; font-size: 0.75rem; color: var(--color-text-muted); }

/* ── BadgeGrid ── */
.badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(272px, 1fr)); gap: 0.75rem; }

/* ── LearningPathCard ── */
.learning-path-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  transition: border-color 0.2s;
}
.learning-path-card:hover { border-color: var(--color-border-2); }
.learning-path-card__header { display: flex; justify-content: space-between; align-items: flex-start; }
.learning-path-card__title  { font-size: 0.9375rem; font-weight: 600; letter-spacing: -0.01em; }
.learning-path-card__description { font-size: 0.8125rem; color: var(--color-text-muted); line-height: 1.6; }
.learning-path-card__progress-text { font-size: 0.75rem; color: var(--color-text-subtle); font-family: var(--font-mono); }
.learning-path-card__cta {
  align-self: flex-start;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius);
  padding: 0.35rem 0.85rem;
  font-size: 0.8125rem; font-weight: 500;
  text-decoration: none; display: inline-block;
  transition: background 0.15s;
}
.learning-path-card__cta:hover { background: var(--color-primary-hover); }
.learning-path-card--complete { border-color: rgba(34,197,94,0.25); }

/* ── LearningPathTimeline ── */
.learning-path-timeline { display: flex; flex-direction: column; gap: 0.5rem; }
.learning-path-timeline__step {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.learning-path-timeline__step--completed { border-color: rgba(34,197,94,0.20); }
.learning-path-timeline__icon { flex-shrink: 0; }
.learning-path-timeline__step--completed .learning-path-timeline__icon { color: var(--color-ok); }
.learning-path-timeline__slug { font-size: 0.875rem; font-weight: 500; }
.learning-path-timeline__optional { font-size: 0.75rem; color: var(--color-text-muted); margin-left: 0.4rem; }

/* ── ChallengeCard ── */
.challenge-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem; max-width: 480px;
  transition: border-color 0.2s;
}
.challenge-card--completed { border-color: rgba(34,197,94,0.25); }
.challenge-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.challenge-card__title  { font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; }
.challenge-card__reward { font-size: 0.8125rem; font-weight: 600; color: var(--color-primary); font-family: var(--font-mono); }
.challenge-card__description { font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem; line-height: 1.6; }
.challenge-card__footer { display: flex; justify-content: space-between; align-items: center; }
.challenge-card__countdown { font-size: 0.75rem; color: var(--color-text-subtle); font-family: var(--font-mono); }
.challenge-card__completed-badge {
  padding: 0.2rem 0.65rem;
  background: rgba(34,197,94,0.12); color: var(--color-ok);
  border-radius: 999px; font-size: 0.75rem; font-weight: 600;
}

/* ── ArtifactCard ── */
.artifact-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem;
}
.artifact-card__type  { font-size: 0.6875rem; color: var(--color-text-subtle); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; }
.artifact-card__title { font-size: 0.9375rem; font-weight: 600; }
.artifact-card__date  { font-size: 0.6875rem; color: var(--color-text-subtle); font-family: var(--font-mono); }
.artifact-card__actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.artifact-card__btn {
  padding: 0.25rem 0.65rem; border-radius: var(--radius); font-size: 0.75rem;
  cursor: pointer; border: 1px solid var(--color-border);
  background: transparent; color: var(--color-text); font-family: var(--font);
  transition: background 0.15s;
}
.artifact-card__btn:hover { background: var(--color-surface-2); }
.artifact-card__btn--danger { color: var(--color-danger); border-color: rgba(239,68,68,0.25); }

/* ── ArtifactGrid ── */
.artifact-grid { display: flex; flex-direction: column; gap: 1rem; }

/* ── GamificationToast ── */
.gamification-toast {
  position: fixed;
  bottom: 1.5rem; right: 1.5rem;
  z-index: 900;
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  animation: slideUp 0.25s ease;
}
.gamification-toast__title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
.gamification-toast__body  { font-size: 0.8125rem; color: var(--color-text-muted); }
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/gamification.css
git commit -m "feat(redesign): gamification CSS — all component classes with new tokens"
```

---

## Task 11: Gamification pages CSS

**Files:**
- Modify: `src/index.css` — add gamification page-level styles

Search for where page-level gamification styles are (grep for `.progress-page`, `.badges-page`) and add/update:

- [ ] **Step 1: Add gamification page styles to index.css**

Append to `src/index.css` before the responsive section:

```css
/* ══════════════════════════════════════════════════════════
   GAMIFICATION PAGES
   ══════════════════════════════════════════════════════════ */
.gamification-page {
  max-width: 1020px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.gamification-page__header {
  margin-bottom: 2rem;
}
.gamification-page__title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
}
.gamification-page__subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.gamification-page__section { margin-bottom: 2rem; }
.gamification-page__section-title {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-subtle);
  margin-bottom: 1rem;
  font-family: var(--font-mono);
}

.gamification-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.gamification-stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex; flex-direction: column; gap: 0.25rem;
}
.gamification-stat-card__value {
  font-size: 1.75rem; font-weight: 700;
  font-family: var(--font-mono); letter-spacing: -0.04em;
  color: var(--color-text);
}
.gamification-stat-card__label {
  font-size: 0.6875rem; color: var(--color-text-subtle);
  text-transform: uppercase; letter-spacing: 0.07em;
  font-family: var(--font-mono);
}

/* Skills page grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: 0.75rem;
}

/* Paths page grid */
.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

/* Challenges page layout */
.challenges-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): gamification page layout classes"
```

---

## Task 12: Light theme overrides

**Files:**
- Modify: `src/index.css` — verify `[data-theme="light"]` overrides are complete

- [ ] **Step 1: Verify light theme coverage**

The `[data-theme="light"]` block was set in Task 2. Scan the CSS for any dark-mode-only hardcoded rgba values and add overrides. Key checks:

```css
/* Ensure light theme has correct surface contrast */
[data-theme="light"] .home-card         { background: #ffffff; }
[data-theme="light"] .workshop-card     { background: #ffffff; }
[data-theme="light"] .cert-card         { background: #ffffff; }
[data-theme="light"] .quiz-exam-card    { background: #ffffff; }
[data-theme="light"] .quiz-option:hover { background: var(--color-surface-3); border-color: var(--color-border-2); }
[data-theme="light"] .quiz-option--selected { background: var(--color-primary-subtle); }
[data-theme="light"] .scene-narrative   { background: var(--color-surface-2); border-color: var(--color-border); }
[data-theme="light"] .navbar__link:hover { background: rgba(0,0,0,0.04); }
[data-theme="light"] .navbar__brand:hover { color: var(--color-text-muted); }
[data-theme="light"] .gamification-stat-card { background: #ffffff; }
[data-theme="light"] .badge-card { background: #ffffff; }
[data-theme="light"] .learning-path-card { background: #ffffff; }
[data-theme="light"] .challenge-card { background: #ffffff; }
[data-theme="light"] .skill-progress-card { background: #ffffff; }
[data-theme="light"] .xp-summary-card { background: #ffffff; }
```

Append these after the gamification page styles.

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): light theme overrides for all redesigned components"
```

---

## Task 13: Responsive styles

**Files:**
- Modify: `src/index.css` — update responsive breakpoints

- [ ] **Step 1: Update responsive section**

Find the existing responsive section at the bottom of `src/index.css` and update/replace with:

```css
/* ══════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════ */

/* Tablet: ≤ 768px */
@media (max-width: 768px) {
  .navbar { padding: 0 1rem; }
  .navbar__links { gap: 0; }
  .navbar__link { padding: 0.3rem 0.5rem; font-size: 0.75rem; }

  .home { padding: 3rem 1.25rem 2.5rem; }
  .home__grid { grid-template-columns: 1fr; gap: 0.75rem; }

  .quiz-exam-grid  { grid-template-columns: 1fr; }
  .cert-hub-grid   { grid-template-columns: 1fr; }
  .ateliers-grid   { grid-template-columns: 1fr; }
  .badge-grid      { grid-template-columns: 1fr; }
  .skills-grid     { grid-template-columns: 1fr; }
  .paths-grid      { grid-template-columns: 1fr; }
  .gamification-stats-row { grid-template-columns: repeat(2, 1fr); }

  .simulation-layout { grid-template-columns: 1fr; height: auto; }
  .simulation-sidebar { border-left: none; border-top: 1px solid var(--color-border); }

  .quiz-body     { grid-template-columns: 1fr; }
  .quiz-sidebar  { border-left: none; border-top: 1px solid var(--color-border); }
  .quiz-main     { padding: 1.25rem 1rem; }

  .intention-nav { grid-template-columns: repeat(2, 1fr); }
  .debrief       { padding: 2rem 1.25rem; }
}

/* Mobile: ≤ 480px */
@media (max-width: 480px) {
  .navbar__brand span { display: none; }
  .home { padding: 2rem 1rem; }
  .home__title { font-size: 1.75rem; }
  .gamification-stats-row { grid-template-columns: 1fr; }
  .quiz-header { padding: 0.5rem 1rem; }
  .quiz-exam-title { display: none; }
  .atelier-page { padding: 1.5rem 1rem; }
}
```

- [ ] **Step 2: Run tests**

```bash
npm test -- --run
```

Expected: 467 passing.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(redesign): responsive — three breakpoints 480/768, mobile-first layout fixes"
```

---

## Task 14: Final build check + merge prep

**Files:** None (verification only)

- [ ] **Step 1: Full test run**

```bash
cd .worktrees/redesign-premium
npm test -- --run
```

Expected: 467 tests pass, 0 failures.

- [ ] **Step 2: Production build check**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Manual smoke-check list**

Start dev server (`npm run dev`) and verify:
- [ ] NavBar: 52px height, underline on active link, theme toggle works
- [ ] Home: 3 corner-bracket cards, hover animation, eyebrow `[ Plateforme ... ]` label
- [ ] Simulation: scene narrative, choice buttons, state indicators sidebar
- [ ] Quiz: screen layout, option selection, flag button, timer
- [ ] Quiz Results: large monospace score, review list
- [ ] Ateliers: workshop cards with corner brackets, intention nav
- [ ] CertificationHub: cert cards with colored top border, no inline styles
- [ ] Progress/Badges/Skills/Paths pages load without visual errors
- [ ] Light theme toggle: all surfaces update correctly

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(redesign): complete premium UI redesign — all tasks done"
```

- [ ] **Step 5: Merge to main worktree tracking branch**

```bash
git log --oneline redesign/premium-ui | head -20
```

Report all commits on the branch to confirm scope.
