# Premium UI Redesign — Scrum Master Sim

**Date:** 2026-05-09  
**Branch:** `redesign/premium-ui`  
**Worktree:** `.worktrees/redesign-premium`

## Goal

Complete UI/UX redesign of the app to a premium, modern, coherent dark interface. Inspiration: Linear (clarity/density), Vercel (sober premium), Raycast (dark elegance). No functionality changes — visual layer only.

## Design Language

**Aesthetic:** 21st.dev / Linear — corner bracket decorators, dot-grid backgrounds, `[ LABEL ]` section headers, zinc neutrals. Minimal indigo — reserved for CTAs and active states only.

**Anti-patterns to eliminate:** Glassmorphism, excessive glow, "AI SaaS generic" look, purple everywhere, rounded blobs.

## Tokens

```css
--bg:            #09090d   /* quasi-noir froid */
--surface-1:     #111116   /* primary surface */
--surface-2:     #18181f   /* secondary */
--surface-3:     #1e1e28   /* tertiary */
--border-1:      rgba(255,255,255,0.06)
--border-2:      rgba(255,255,255,0.10)
--text-1:        #f4f4f6
--text-2:        #a1a1b5
--text-3:        #62627a
--primary:       #6366f1   /* indigo — CTAs, active only */
--primary-subtle: rgba(99,102,241,0.12)
--primary-border: rgba(99,102,241,0.25)
--ok:            #22c55e
--warning:       #f59e0b
--danger:        #ef4444
--radius-sm:     4px
--radius:        6px
--radius-md:     8px
--radius-lg:     12px
--radius-xl:     16px
```

## Typography

- **UI font:** Geist Sans (via `@fontsource/geist-sans`) — weights 400/500/600/700
- **Mono font:** Geist Mono (via `@fontsource/geist-mono`) — for scores, codes, numeric values only
- **Scale:** 28px/700 page titles, 20px/600 section heads, 15px/500 card body, 13px/400 muted, 11px/600 CAPS labels, 12px mono

## Key Patterns

### Corner Bracket Decorators (cards)
```css
.card { position: relative; }
.card::before, .card::after {
  content: ''; position: absolute;
  width: 16px; height: 16px;
  border: 1.5px solid rgba(255,255,255,0.12);
  transition: border-color 0.2s, width 0.2s, height 0.2s;
}
.card::before { top: 10px; left: 10px; border-right: none; border-bottom: none; }
.card::after  { bottom: 10px; right: 10px; border-left: none; border-top: none; }
.card:hover::before, .card:hover::after {
  border-color: rgba(255,255,255,0.5); width: 20px; height: 20px;
}
```

### Dot Grid Background
```css
background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
background-size: 40px 40px;
```

### NavBar
- Height: 52px (down from 60px)
- Border-bottom: 1px solid `--border-1`
- Logo: `[ SM ]` monospace chip
- Active link: `--primary` color + subtle underline accent, no background fill
- Theme toggle: minimal icon button

### Home Cards
- 3 cards (Simulation, Certifications, Ateliers) with corner brackets
- Dot grid on hover
- Icon at top, title 20px/600, description 13px muted, CTA arrow link

### Gamification Pages
- XP card: large number (Geist Mono), level badge pill, progress bar in `--primary`
- Badge grid: locked badges have `opacity: 0.35` grayscale filter, unlocked glow subtle
- Skills: horizontal bar chart, `--primary` fill
- Learning paths: timeline-style vertical progression

### Simulation & Ateliers
- Question cards: clean surface-2 background, statement 15px/500, option rows with hover `--surface-3`
- Selected option: left border 2px `--primary`, `--primary-subtle` background

## Scope

Only `src/index.css` and minimal JSX changes (remove inline styles, add/rename classes). No logic, routing, state, or data changes. No Tailwind. No shadcn.

## Responsive

Three breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop+). Full-width cards on mobile.

## Implementation Order

1. Install Geist fonts (`@fontsource/geist-sans`, `@fontsource/geist-mono`)
2. CSS tokens layer (`:root` variables)
3. CSS reset + base (body, headings, links)
4. NavBar component
5. Home page cards
6. Shared components (buttons, badges, progress bars, inputs)
7. Simulation screens
8. Atelier screens
9. Certification screens
10. Gamification screens (XP, badges, skills, paths, challenges, portfolio)
11. Admin screen
12. Light theme override (`[data-theme="light"]`)
13. Responsive passes
