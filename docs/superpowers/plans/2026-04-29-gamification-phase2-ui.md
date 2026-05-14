# Gamification Phase 2 — UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 13 gamification UI components and 7 pages that visualize the Phase 1 engine (store + types already in `src/features/gamification/`).

**Architecture:** Pure display layer. All 13 primitive components receive plain props (no store dependency). Page-level components (`src/pages/gamification/`) connect to `useGamificationStore`. CSS lives in `src/components/gamification/gamification.css`, imported once in `src/main.tsx`.

**Tech Stack:** React 19 + TypeScript, Zustand 5 (`useGamificationStore`), React Router v7, Lucide React, pure SVG radar (no charting lib), Vitest + Testing Library (`@testing-library/react`).

---

## File Map

**Create:**
```
src/features/gamification/recommendations.ts
src/features/gamification/recommendations.test.ts
src/components/gamification/gamification.css
src/components/gamification/constants.ts
src/components/gamification/MasteryLevelBadge.tsx + .test.tsx
src/components/gamification/XpSummaryCard.tsx + .test.tsx
src/components/gamification/RecentProgressFeed.tsx + .test.tsx
src/components/gamification/SkillRadar.tsx + .test.tsx
src/components/gamification/SkillProgressCard.tsx + .test.tsx
src/components/gamification/BadgeCard.tsx + .test.tsx
src/components/gamification/BadgeGrid.tsx + .test.tsx
src/components/gamification/LearningPathCard.tsx + .test.tsx
src/components/gamification/LearningPathTimeline.tsx + .test.tsx
src/components/gamification/ChallengeCard.tsx + .test.tsx
src/components/gamification/ArtifactCard.tsx + .test.tsx
src/components/gamification/ArtifactGrid.tsx + .test.tsx
src/components/gamification/GamificationToast.tsx + .test.tsx
src/pages/gamification/ProgressPage.tsx + .test.tsx
src/pages/gamification/SkillsPage.tsx + .test.tsx
src/pages/gamification/BadgesPage.tsx + .test.tsx
src/pages/gamification/PathsPage.tsx + .test.tsx
src/pages/gamification/PathDetailPage.tsx + .test.tsx
src/pages/gamification/ChallengesPage.tsx + .test.tsx
src/pages/gamification/PortfolioPage.tsx + .test.tsx
```

**Modify:**
```
src/main.tsx          — add gamification.css import
src/App.tsx           — add 7 routes + GamificationToast in Layout
src/components/NavBar/index.tsx — add "Progression" nav link
```

---

## Key facts about the store (Phase 1, read-only for Phase 2)

Store key in localStorage: `scrum-master-gamification`.

Selector API — call as `useGamificationStore(s => s.xxx)`:
- `s.events: GamificationEvent[]` — raw event log
- `s.artifacts: Artifact[]`
- `s.toastQueue: GamificationToastPayload[]`
- `s.getTotalXp(): number`
- `s.getAllSkillXp(): Partial<Record<SkillArea, number>>`
- `s.getMasteryLevelForSkill(skill): MasteryLevel` ← note: NOT `getMasteryLevel`
- `s.getUnlockedBadgeIds(): string[]`
- `s.getPathProgress(slug): PathProgress | null`
- `s.getCompletedContentSlugs(): string[]`
- `s.getActiveChallenge(): WeeklyChallenge | null`
- `s.isChallengeCompleted(id): boolean`
- `s.dismissToast(): void`
- `s.deleteArtifact(id): void`
- `s.markArtifactExported(id): void`

BADGE_UNLOCKED events carry `metadata.badgeId` and `createdAt` — use these to get unlock dates.

`computePathProgress` is exported from `src/features/gamification/index.ts` and can be called directly in pages without going through the store.

---

## Task 1: recommendations.ts helper

**Files:**
- Create: `src/features/gamification/recommendations.ts`
- Create: `src/features/gamification/recommendations.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/gamification/recommendations.test.ts
import { describe, it, expect } from 'vitest'
import { getRecommendations } from './recommendations'

describe('getRecommendations', () => {
  it('returns slugs whose skill-map includes the given skill', () => {
    const recs = getRecommendations('conflict', [])
    expect(recs).toContain('thomas-kilmann')
    expect(recs.length).toBeLessThanOrEqual(3)
  })

  it('excludes completed slugs', () => {
    const recs = getRecommendations('conflict', ['thomas-kilmann'])
    expect(recs).not.toContain('thomas-kilmann')
  })

  it('sorts by weight descending — highest-weight slug comes first', () => {
    // thomas-kilmann has conflict weight 0.7, ladder-of-inference has 0.5
    const recs = getRecommendations('conflict', [])
    const tkIdx = recs.indexOf('thomas-kilmann')
    const loiIdx = recs.indexOf('ladder-of-inference')
    if (tkIdx !== -1 && loiIdx !== -1) {
      expect(tkIdx).toBeLessThan(loiIdx)
    }
  })

  it('respects the limit parameter', () => {
    const recs = getRecommendations('facilitation', [], 2)
    expect(recs.length).toBeLessThanOrEqual(2)
  })

  it('returns empty array when skill has no content in the map', () => {
    const recs = getRecommendations('flow', [])
    expect(Array.isArray(recs)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- recommendations.test.ts
```
Expected: FAIL — `getRecommendations` not found.

- [ ] **Step 3: Implement**

```ts
// src/features/gamification/recommendations.ts
import { CONTENT_SKILL_MAP } from './skill-map'
import type { SkillArea } from './types'

export function getRecommendations(
  skill: SkillArea,
  completedSlugs: string[],
  limit = 3,
): string[] {
  const completed = new Set(completedSlugs)
  return Object.entries(CONTENT_SKILL_MAP)
    .filter(([slug, contributions]) =>
      !completed.has(slug) && contributions.some(c => c.skill === skill)
    )
    .sort(([, a], [, b]) => {
      const wA = a.find(c => c.skill === skill)?.weight ?? 0
      const wB = b.find(c => c.skill === skill)?.weight ?? 0
      return wB - wA
    })
    .slice(0, limit)
    .map(([slug]) => slug)
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- recommendations.test.ts
```
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/gamification/recommendations.ts src/features/gamification/recommendations.test.ts
git commit -m "feat(gamification): add getRecommendations helper (inverse skill-map)"
```

---

## Task 2: CSS foundations + constants.ts + MasteryLevelBadge

**Files:**
- Create: `src/components/gamification/gamification.css`
- Create: `src/components/gamification/constants.ts`
- Create: `src/components/gamification/MasteryLevelBadge.tsx`
- Create: `src/components/gamification/MasteryLevelBadge.test.tsx`
- Modify: `src/main.tsx` — add import

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/gamification/MasteryLevelBadge.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MasteryLevelBadge } from './MasteryLevelBadge'

describe('MasteryLevelBadge', () => {
  it('renders French label for discovery', () => {
    render(<MasteryLevelBadge level="discovery" />)
    expect(screen.getByText('Découverte')).toBeInTheDocument()
  })

  it('renders French label for transmission', () => {
    render(<MasteryLevelBadge level="transmission" />)
    expect(screen.getByText('Transmission')).toBeInTheDocument()
  })

  it('applies the correct BEM modifier class', () => {
    const { container } = render(<MasteryLevelBadge level="practice" />)
    expect(container.querySelector('.mastery-badge--practice')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- MasteryLevelBadge.test.tsx
```
Expected: FAIL — `MasteryLevelBadge` not found.

- [ ] **Step 3: Create gamification.css**

```css
/* src/components/gamification/gamification.css */

/* ── MasteryLevelBadge ── */
.mastery-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.mastery-badge--discovery         { background: rgba(136,146,164,0.15); color: var(--color-text-muted); }
.mastery-badge--practice          { background: rgba(59,130,246,0.15);  color: #60a5fa; }
.mastery-badge--proficiency       { background: rgba(34,197,94,0.15);   color: #4ade80; }
.mastery-badge--field_application { background: rgba(245,158,11,0.15);  color: #fbbf24; }
.mastery-badge--transmission      { background: rgba(168,85,247,0.15);  color: #c084fc; }

/* ── XpSummaryCard ── */
.xp-summary-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1.5rem; text-align: center; }
.xp-summary-card__value { font-size: 2.5rem; font-weight: 700; color: var(--color-primary); line-height: 1; }
.xp-summary-card__label { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem; }

/* ── RecentProgressFeed ── */
.progress-feed { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.progress-feed--empty { color: var(--color-text-muted); font-size: 0.9rem; padding: 1rem 0; }
.progress-feed__item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
.progress-feed__label { font-size: 0.875rem; }
.progress-feed__xp { font-size: 0.8rem; font-weight: 600; color: var(--color-primary); }

/* ── SkillRadar ── */
.skill-radar { width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto; }
.skill-radar__grid-circle { fill: none; stroke: var(--color-border); stroke-width: 1; }
.skill-radar__axis { stroke: var(--color-border); stroke-width: 1; }
.skill-radar__polygon { fill: rgba(99,102,241,0.25); stroke: var(--color-primary); stroke-width: 2; }
.skill-radar__label { font-size: 9px; fill: var(--color-text-muted); font-family: var(--font); }

/* ── SkillProgressCard ── */
.skill-progress-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.skill-progress-card__header { display: flex; justify-content: space-between; align-items: center; }
.skill-progress-card__name { font-weight: 600; font-size: 0.9rem; }
.skill-progress-card__xp { font-size: 0.8rem; color: var(--color-text-muted); }
.skill-progress-card__recs { margin-top: 0.25rem; font-size: 0.78rem; color: var(--color-text-muted); }
.skill-progress-card__recs-label { font-weight: 600; margin-right: 0.25rem; }
.skill-progress-card__recs ul { list-style: disc; padding-left: 1rem; margin-top: 0.25rem; }

/* ── BadgeCard ── */
.badge-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1rem; display: flex; gap: 0.75rem; align-items: flex-start; }
.badge-card--locked { opacity: 0.5; }
.badge-card__icon { color: var(--color-primary); flex-shrink: 0; }
.badge-card--locked .badge-card__icon { color: var(--color-text-muted); }
.badge-card__body { display: flex; flex-direction: column; gap: 0.25rem; }
.badge-card__title { font-size: 0.9rem; font-weight: 600; }
.badge-card__description { font-size: 0.8rem; color: var(--color-text-muted); }
.badge-card__unlocked-at { font-size: 0.75rem; color: var(--color-ok); }
.badge-card__criteria { list-style: disc; padding-left: 1rem; font-size: 0.78rem; color: var(--color-text-muted); }

/* ── BadgeGrid ── */
.badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }

/* ── LearningPathCard ── */
.learning-path-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.learning-path-card__header { display: flex; justify-content: space-between; align-items: flex-start; }
.learning-path-card__title { font-size: 1rem; font-weight: 600; }
.learning-path-card__description { font-size: 0.875rem; color: var(--color-text-muted); }
.learning-path-card__progress-text { font-size: 0.8rem; color: var(--color-text-muted); }
.learning-path-card__cta { align-self: flex-start; background: var(--color-primary); color: #fff; border-radius: var(--radius); padding: 0.4rem 0.9rem; font-size: 0.85rem; font-weight: 500; text-decoration: none; display: inline-block; }
.learning-path-card--complete { border-color: var(--color-ok); }

/* ── LearningPathTimeline ── */
.learning-path-timeline { display: flex; flex-direction: column; gap: 0.75rem; }
.learning-path-timeline__step { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
.learning-path-timeline__step--completed { border-color: var(--color-ok); }
.learning-path-timeline__icon { flex-shrink: 0; }
.learning-path-timeline__step--completed .learning-path-timeline__icon { color: var(--color-ok); }
.learning-path-timeline__slug { font-size: 0.875rem; font-weight: 500; }
.learning-path-timeline__optional { font-size: 0.75rem; color: var(--color-text-muted); margin-left: 0.5rem; }

/* ── ChallengeCard ── */
.challenge-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1.5rem; max-width: 480px; }
.challenge-card--completed { border-color: var(--color-ok); }
.challenge-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.challenge-card__title { font-size: 1.1rem; font-weight: 600; }
.challenge-card__reward { font-size: 0.85rem; font-weight: 600; color: var(--color-primary); }
.challenge-card__description { font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem; }
.challenge-card__footer { display: flex; justify-content: space-between; align-items: center; }
.challenge-card__countdown { font-size: 0.8rem; color: var(--color-text-muted); }
.challenge-card__completed-badge { padding: 0.25rem 0.75rem; background: rgba(34,197,94,0.15); color: var(--color-ok); border-radius: 999px; font-size: 0.8rem; font-weight: 600; }

/* ── ArtifactCard ── */
.artifact-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
.artifact-card__type { font-size: 0.75rem; color: var(--color-text-muted); }
.artifact-card__title { font-size: 0.95rem; font-weight: 600; }
.artifact-card__date { font-size: 0.75rem; color: var(--color-text-muted); }
.artifact-card__actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.artifact-card__btn { padding: 0.3rem 0.7rem; border-radius: var(--radius); font-size: 0.8rem; cursor: pointer; border: 1px solid var(--color-border); background: transparent; color: var(--color-text); }
.artifact-card__btn:hover { background: var(--color-surface-2); }
.artifact-card__btn--danger { color: var(--color-danger); border-color: var(--color-danger); }

/* ── ArtifactGrid ── */
.artifact-grid { display: flex; flex-direction: column; gap: 1.25rem; }
.artifact-grid__controls { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.artifact-grid__search { flex: 1; min-width: 180px; padding: 0.4rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); font-size: 0.875rem; }
.artifact-grid__filter { padding: 0.4rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-text); font-size: 0.875rem; }
.artifact-grid__list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.artifact-grid__empty { color: var(--color-text-muted); font-size: 0.9rem; padding: 2rem 0; text-align: center; }

/* ── GamificationToast ── */
.gamification-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.15rem; min-width: 220px; max-width: 320px; box-shadow: var(--card-shadow); z-index: 1000; }
.gamification-toast__message { font-weight: 600; font-size: 0.9rem; }
.gamification-toast__detail { font-size: 0.8rem; color: var(--color-text-muted); }

/* ── Gamification pages ── */
.gamification-page { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 2rem; }
.gamification-page__title { font-size: 1.6rem; font-weight: 700; }
.gamification-page__section { display: flex; flex-direction: column; gap: 0.75rem; }
.gamification-page__section-title { font-size: 0.75rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.gamification-page__top { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; align-items: start; }
@media (max-width: 640px) { .gamification-page__top { grid-template-columns: 1fr; } }
.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.75rem; }
.paths-list { display: flex; flex-direction: column; gap: 1rem; }
.gamification-see-all { font-size: 0.85rem; color: var(--color-primary); text-decoration: none; align-self: flex-end; }
.gamification-see-all:hover { text-decoration: underline; }
```

- [ ] **Step 4: Create constants.ts**

```ts
// src/components/gamification/constants.ts
import type { SkillArea, ArtifactType } from '../../features/gamification'

export const SKILL_AREAS: SkillArea[] = [
  'conflict', 'communication', 'feedback', 'coaching',
  'facilitation', 'retrospective', 'problem_solving', 'team_health',
  'management_3_0', 'product_discovery', 'prioritization',
  'stakeholder_management', 'decision_making', 'flow',
  'delivery_excellence', 'systems_thinking', 'organization_design',
  'change_management', 'leadership',
]

export const SKILL_LABELS: Record<SkillArea, string> = {
  conflict: 'Conflit',
  communication: 'Communication',
  feedback: 'Feedback',
  coaching: 'Coaching',
  facilitation: 'Facilitation',
  retrospective: 'Rétrospective',
  problem_solving: 'Résolution',
  team_health: 'Santé équipe',
  management_3_0: 'Mgt 3.0',
  product_discovery: 'Découverte produit',
  prioritization: 'Priorisation',
  stakeholder_management: 'Parties prenantes',
  decision_making: 'Décision',
  flow: 'Flow',
  delivery_excellence: 'Livraison',
  systems_thinking: 'Systémique',
  organization_design: 'Design org.',
  change_management: 'Changement',
  leadership: 'Leadership',
}

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  feedback_sbi: 'Feedback SBI',
  grow_plan: 'Plan GROW',
  stakeholder_map: 'Carte parties prenantes',
  fishbone_diagram: 'Diagramme Ishikawa',
  five_whys: '5 Pourquoi',
  team_charter: "Charte d'équipe",
  working_agreements: 'Accords de travail',
  delegation_board: 'Tableau de délégation',
  facilitation_canvas: 'Canvas facilitation',
  retrospective_board: 'Board rétrospective',
  risk_map: 'Carte des risques',
  decision_matrix: 'Matrice de décision',
  customer_journey: 'Parcours client',
  value_stream_map: 'Value stream map',
  desc_message: 'Message DESC',
}
```

- [ ] **Step 5: Create MasteryLevelBadge.tsx**

```tsx
// src/components/gamification/MasteryLevelBadge.tsx
import type { MasteryLevel } from '../../features/gamification'
import { MASTERY_LABELS } from '../../features/gamification'

interface Props { level: MasteryLevel }

export function MasteryLevelBadge({ level }: Props) {
  return (
    <span className={`mastery-badge mastery-badge--${level}`}>
      {MASTERY_LABELS[level]}
    </span>
  )
}
```

- [ ] **Step 6: Add CSS import to src/main.tsx**

In `src/main.tsx`, add after `import './index.css'`:

```ts
import './components/gamification/gamification.css'
```

- [ ] **Step 7: Run test to verify it passes**

```
npm test -- MasteryLevelBadge.test.tsx
```
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add src/components/gamification/gamification.css src/components/gamification/constants.ts src/components/gamification/MasteryLevelBadge.tsx src/components/gamification/MasteryLevelBadge.test.tsx src/main.tsx
git commit -m "feat(gamification-ui): add CSS foundations, constants, MasteryLevelBadge"
```

---

## Task 3: XpSummaryCard + RecentProgressFeed

**Files:**
- Create: `src/components/gamification/XpSummaryCard.tsx` + `.test.tsx`
- Create: `src/components/gamification/RecentProgressFeed.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/gamification/XpSummaryCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { XpSummaryCard } from './XpSummaryCard'

describe('XpSummaryCard', () => {
  it('displays the XP value formatted for fr-FR locale', () => {
    const { container } = render(<XpSummaryCard totalXp={1250} />)
    expect(container.querySelector('.xp-summary-card__value')?.textContent).toBe(
      (1250).toLocaleString('fr-FR')
    )
  })

  it('shows "XP total" label', () => {
    render(<XpSummaryCard totalXp={0} />)
    expect(screen.getByText('XP total')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/gamification/RecentProgressFeed.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentProgressFeed } from './RecentProgressFeed'
import type { GamificationEvent } from '../../features/gamification'

function makeEvent(overrides: Partial<GamificationEvent> = {}): GamificationEvent {
  return {
    id: crypto.randomUUID(),
    type: 'WORKSHOP_COMPLETED',
    xpAwarded: 100,
    contentSlug: 'thomas-kilmann',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('RecentProgressFeed', () => {
  it('renders empty state when no events', () => {
    render(<RecentProgressFeed events={[]} />)
    expect(screen.getByText(/aucune activité/i)).toBeInTheDocument()
  })

  it('shows last 10 events in reverse chronological order', () => {
    const events = Array.from({ length: 12 }, (_, i) =>
      makeEvent({ id: String(i), xpAwarded: i + 1, contentSlug: `slug-${i}` })
    )
    const { container } = render(<RecentProgressFeed events={events} />)
    const items = container.querySelectorAll('.progress-feed__item')
    expect(items).toHaveLength(10)
  })

  it('shows +XP for each event', () => {
    render(<RecentProgressFeed events={[makeEvent({ xpAwarded: 150 })]} />)
    expect(screen.getByText('+150 XP')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- XpSummaryCard.test.tsx RecentProgressFeed.test.tsx
```
Expected: FAIL — components not found.

- [ ] **Step 3: Implement XpSummaryCard.tsx**

```tsx
// src/components/gamification/XpSummaryCard.tsx
interface Props { totalXp: number }

export function XpSummaryCard({ totalXp }: Props) {
  return (
    <div className="xp-summary-card">
      <div className="xp-summary-card__value">{totalXp.toLocaleString('fr-FR')}</div>
      <div className="xp-summary-card__label">XP total</div>
    </div>
  )
}
```

- [ ] **Step 4: Implement RecentProgressFeed.tsx**

```tsx
// src/components/gamification/RecentProgressFeed.tsx
import type { GamificationEvent } from '../../features/gamification'

function eventLabel(event: GamificationEvent): string {
  switch (event.type) {
    case 'WORKSHOP_COMPLETED': return `Atelier complété${event.contentSlug ? ` : ${event.contentSlug}` : ''}`
    case 'QUIZ_COMPLETED': return `Quiz complété${event.contentSlug ? ` : ${event.contentSlug}` : ''}`
    case 'ARTIFACT_CREATED': return 'Artefact créé'
    case 'BADGE_UNLOCKED': return 'Badge débloqué'
    case 'SKILL_LEVEL_UP': return 'Niveau de maîtrise atteint'
    case 'CHALLENGE_COMPLETED': return 'Défi hebdomadaire complété'
    case 'PATH_COMPLETED': return 'Parcours terminé'
    default: return event.type.replace(/_/g, ' ').toLowerCase()
  }
}

interface Props { events: GamificationEvent[] }

export function RecentProgressFeed({ events }: Props) {
  const recent = [...events].reverse().slice(0, 10)

  if (recent.length === 0) {
    return (
      <div className="progress-feed progress-feed--empty">
        <p>Aucune activité récente.</p>
      </div>
    )
  }

  return (
    <ul className="progress-feed" aria-label="Activité récente">
      {recent.map(event => (
        <li key={event.id} className="progress-feed__item">
          <span className="progress-feed__label">{eventLabel(event)}</span>
          <span className="progress-feed__xp">+{event.xpAwarded} XP</span>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```
npm test -- XpSummaryCard.test.tsx RecentProgressFeed.test.tsx
```
Expected: PASS (2 + 3 = 5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/XpSummaryCard.tsx src/components/gamification/XpSummaryCard.test.tsx src/components/gamification/RecentProgressFeed.tsx src/components/gamification/RecentProgressFeed.test.tsx
git commit -m "feat(gamification-ui): add XpSummaryCard and RecentProgressFeed"
```

---

## Task 4: SkillRadar (pure SVG)

**Files:**
- Create: `src/components/gamification/SkillRadar.tsx`
- Create: `src/components/gamification/SkillRadar.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/gamification/SkillRadar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillRadar } from './SkillRadar'

describe('SkillRadar', () => {
  it('renders an SVG with accessible label', () => {
    render(<SkillRadar skills={{}} />)
    expect(screen.getByRole('img', { name: /radar des compétences/i })).toBeInTheDocument()
  })

  it('renders exactly 19 axis lines', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelectorAll('.skill-radar__axis')).toHaveLength(19)
  })

  it('renders exactly 19 skill labels', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelectorAll('.skill-radar__label')).toHaveLength(19)
  })

  it('renders a filled polygon', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelector('.skill-radar__polygon')).toBeInTheDocument()
  })

  it('polygon x coordinate for max-XP conflict (axis 0) is ~200', () => {
    // conflict is axis 0, angle = -π/2 → x = CX + r·cos(-π/2) = 200 + 0 = 200
    const { container } = render(<SkillRadar skills={{ conflict: 3000 }} />)
    const polygon = container.querySelector('.skill-radar__polygon')!
    const points = polygon.getAttribute('points') ?? ''
    const firstPoint = points.split(' ')[0]
    const x = parseFloat(firstPoint.split(',')[0])
    expect(x).toBeCloseTo(200, 0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- SkillRadar.test.tsx
```
Expected: FAIL — `SkillRadar` not found.

- [ ] **Step 3: Implement SkillRadar.tsx**

```tsx
// src/components/gamification/SkillRadar.tsx
import type { SkillArea } from '../../features/gamification'
import { MASTERY_THRESHOLDS } from '../../features/gamification'
import { SKILL_AREAS, SKILL_LABELS } from './constants'

const CX = 200
const CY = 200
const MAX_RADIUS = 155
const MAX_XP = MASTERY_THRESHOLDS.transmission  // 3000

function toXY(cx: number, cy: number, radius: number, angle: number) {
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
}

interface Props {
  skills: Partial<Record<SkillArea, number>>
}

export function SkillRadar({ skills }: Props) {
  const n = SKILL_AREAS.length
  const angles = SKILL_AREAS.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n)

  const polygonPoints = SKILL_AREAS.map((skill, i) => {
    const xp = skills[skill] ?? 0
    const r = Math.min(1, xp / MAX_XP) * MAX_RADIUS
    const { x, y } = toXY(CX, CY, r, angles[i])
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 400 400"
      className="skill-radar"
      role="img"
      aria-label="Radar des compétences"
    >
      {[0.25, 0.5, 0.75, 1.0].map(level => (
        <circle
          key={level}
          cx={CX}
          cy={CY}
          r={level * MAX_RADIUS}
          className="skill-radar__grid-circle"
        />
      ))}

      {SKILL_AREAS.map((skill, i) => {
        const { x, y } = toXY(CX, CY, MAX_RADIUS, angles[i])
        return (
          <line
            key={skill}
            x1={CX} y1={CY}
            x2={x.toFixed(1)} y2={y.toFixed(1)}
            className="skill-radar__axis"
          />
        )
      })}

      <polygon points={polygonPoints} className="skill-radar__polygon" />

      {SKILL_AREAS.map((skill, i) => {
        const { x, y } = toXY(CX, CY, MAX_RADIUS + 22, angles[i])
        return (
          <text
            key={skill}
            x={x.toFixed(1)}
            y={y.toFixed(1)}
            className="skill-radar__label"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {SKILL_LABELS[skill]}
          </text>
        )
      })}
    </svg>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- SkillRadar.test.tsx
```
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/gamification/SkillRadar.tsx src/components/gamification/SkillRadar.test.tsx
git commit -m "feat(gamification-ui): add SkillRadar SVG component (19 axes)"
```

---

## Task 5: SkillProgressCard

**Files:**
- Create: `src/components/gamification/SkillProgressCard.tsx`
- Create: `src/components/gamification/SkillProgressCard.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/gamification/SkillProgressCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillProgressCard } from './SkillProgressCard'

describe('SkillProgressCard', () => {
  const defaultProps = {
    skill: 'conflict' as const,
    xp: 450,
    level: 'practice' as const,
    recommendations: ['thomas-kilmann', 'sbi'],
  }

  it('displays the French skill name', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('Conflit')).toBeInTheDocument()
  })

  it('displays the XP amount', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('450 XP')).toBeInTheDocument()
  })

  it('renders a MasteryLevelBadge with the correct level', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('Pratique')).toBeInTheDocument()
  })

  it('shows recommendations when provided', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByText('thomas-kilmann')).toBeInTheDocument()
    expect(screen.getByText('sbi')).toBeInTheDocument()
  })

  it('does not render recommendations section when array is empty', () => {
    const { container } = render(
      <SkillProgressCard {...defaultProps} recommendations={[]} />
    )
    expect(container.querySelector('.skill-progress-card__recs')).toBeNull()
  })

  it('renders a progressbar', () => {
    render(<SkillProgressCard {...defaultProps} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- SkillProgressCard.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement SkillProgressCard.tsx**

```tsx
// src/components/gamification/SkillProgressCard.tsx
import type { SkillArea, MasteryLevel } from '../../features/gamification'
import { MASTERY_THRESHOLDS } from '../../features/gamification'
import { MasteryLevelBadge } from './MasteryLevelBadge'
import { SKILL_LABELS } from './constants'

const LEVEL_ORDER: MasteryLevel[] = [
  'discovery', 'practice', 'proficiency', 'field_application', 'transmission',
]

function progressPct(xp: number, level: MasteryLevel): number {
  const idx = LEVEL_ORDER.indexOf(level)
  if (idx === LEVEL_ORDER.length - 1) return 100
  const current = MASTERY_THRESHOLDS[level]
  const next = MASTERY_THRESHOLDS[LEVEL_ORDER[idx + 1]]
  return Math.min(100, Math.round(((xp - current) / (next - current)) * 100))
}

interface Props {
  skill: SkillArea
  xp: number
  level: MasteryLevel
  recommendations: string[]
}

export function SkillProgressCard({ skill, xp, level, recommendations }: Props) {
  const pct = progressPct(xp, level)

  return (
    <article className="skill-progress-card">
      <div className="skill-progress-card__header">
        <span className="skill-progress-card__name">{SKILL_LABELS[skill]}</span>
        <MasteryLevelBadge level={level} />
      </div>
      <div className="skill-progress-card__xp">{xp} XP</div>
      <div className="progress-bar__track" style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          className="progress-bar__fill"
          style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 3, transition: 'width 0.4s ease' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {recommendations.length > 0 && (
        <div className="skill-progress-card__recs">
          <span className="skill-progress-card__recs-label">À explorer :</span>
          <ul>
            {recommendations.map(slug => <li key={slug}>{slug}</li>)}
          </ul>
        </div>
      )}
    </article>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- SkillProgressCard.test.tsx
```
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/gamification/SkillProgressCard.tsx src/components/gamification/SkillProgressCard.test.tsx
git commit -m "feat(gamification-ui): add SkillProgressCard"
```

---

## Task 6: BadgeCard + BadgeGrid

**Files:**
- Create: `src/components/gamification/BadgeCard.tsx` + `.test.tsx`
- Create: `src/components/gamification/BadgeGrid.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/gamification/BadgeCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgeCard } from './BadgeCard'
import type { BadgeDefinition } from '../../features/gamification'

const mockBadge: BadgeDefinition = {
  id: 'conflict-mediator',
  name: 'Médiateur en progression',
  description: 'Maîtrise des conflits.',
  skillArea: 'conflict',
  criteria: {
    completedContent: ['thomas-kilmann', 'ladder-of-inference'],
    minAverageScore: 75,
  },
}

describe('BadgeCard', () => {
  it('renders badge name', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText('Médiateur en progression')).toBeInTheDocument()
  })

  it('shows unlock date when unlockedAt is provided', () => {
    render(<BadgeCard badge={mockBadge} unlockedAt="2026-04-29T10:00:00.000Z" />)
    expect(screen.getByText(/débloqué le/i)).toBeInTheDocument()
  })

  it('shows criteria when locked', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText(/thomas-kilmann/i)).toBeInTheDocument()
    expect(screen.getByText(/75%/)).toBeInTheDocument()
  })

  it('applies locked class when no unlockedAt', () => {
    const { container } = render(<BadgeCard badge={mockBadge} />)
    expect(container.querySelector('.badge-card--locked')).toBeInTheDocument()
  })

  it('does not apply locked class when unlockedAt is provided', () => {
    const { container } = render(<BadgeCard badge={mockBadge} unlockedAt="2026-04-29T10:00:00.000Z" />)
    expect(container.querySelector('.badge-card--locked')).toBeNull()
  })
})
```

```tsx
// src/components/gamification/BadgeGrid.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgeGrid } from './BadgeGrid'
import { BADGES } from '../../features/gamification'

describe('BadgeGrid', () => {
  it('renders a card for each badge', () => {
    const { container } = render(
      <BadgeGrid badges={BADGES} unlockedIds={[]} events={[]} />
    )
    expect(container.querySelectorAll('.badge-card')).toHaveLength(BADGES.length)
  })

  it('puts unlocked badges before locked ones', () => {
    const firstBadgeId = BADGES[BADGES.length - 1].id  // pick last to test reordering
    const { container } = render(
      <BadgeGrid badges={BADGES} unlockedIds={[firstBadgeId]} events={[]} />
    )
    const cards = container.querySelectorAll('.badge-card')
    // First card should NOT have locked class
    expect(cards[0]).not.toHaveClass('badge-card--locked')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- BadgeCard.test.tsx BadgeGrid.test.tsx
```
Expected: FAIL.

- [ ] **Step 3: Implement BadgeCard.tsx**

```tsx
// src/components/gamification/BadgeCard.tsx
import { Award } from 'lucide-react'
import type { BadgeDefinition } from '../../features/gamification'

interface Props {
  badge: BadgeDefinition
  unlockedAt?: string  // ISO date string; undefined = locked
}

export function BadgeCard({ badge, unlockedAt }: Props) {
  const isUnlocked = unlockedAt !== undefined

  return (
    <article className={`badge-card${isUnlocked ? '' : ' badge-card--locked'}`}>
      <div className="badge-card__icon">
        <Award size={24} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="badge-card__body">
        <h3 className="badge-card__title">{badge.name}</h3>
        <p className="badge-card__description">{badge.description}</p>
        {isUnlocked ? (
          <span className="badge-card__unlocked-at">
            Débloqué le {new Date(unlockedAt).toLocaleDateString('fr-FR')}
          </span>
        ) : (
          <ul className="badge-card__criteria">
            {badge.criteria.completedContent && (
              <li>Compléter : {badge.criteria.completedContent.join(', ')}</li>
            )}
            {badge.criteria.minAverageScore !== undefined && (
              <li>Score moyen ≥ {badge.criteria.minAverageScore}%</li>
            )}
            {badge.criteria.minArtifactsCreated !== undefined && (
              <li>≥ {badge.criteria.minArtifactsCreated} artefacts créés</li>
            )}
          </ul>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Implement BadgeGrid.tsx**

```tsx
// src/components/gamification/BadgeGrid.tsx
import type { BadgeDefinition, GamificationEvent } from '../../features/gamification'
import { BadgeCard } from './BadgeCard'

interface Props {
  badges: BadgeDefinition[]
  unlockedIds: string[]
  events: GamificationEvent[]  // used to look up unlock dates
}

function getUnlockDate(badgeId: string, events: GamificationEvent[]): string | undefined {
  return events.find(
    e => e.type === 'BADGE_UNLOCKED' && e.metadata?.badgeId === badgeId
  )?.createdAt
}

export function BadgeGrid({ badges, unlockedIds, events }: Props) {
  const unlockedSet = new Set(unlockedIds)
  const sorted = [...badges].sort((a, b) => {
    const aUnlocked = unlockedSet.has(a.id) ? 0 : 1
    const bUnlocked = unlockedSet.has(b.id) ? 0 : 1
    return aUnlocked - bUnlocked
  })

  return (
    <div className="badge-grid">
      {sorted.map(badge => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          unlockedAt={getUnlockDate(badge.id, events)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```
npm test -- BadgeCard.test.tsx BadgeGrid.test.tsx
```
Expected: PASS (5 + 2 = 7 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/BadgeCard.tsx src/components/gamification/BadgeCard.test.tsx src/components/gamification/BadgeGrid.tsx src/components/gamification/BadgeGrid.test.tsx
git commit -m "feat(gamification-ui): add BadgeCard and BadgeGrid"
```

---

## Task 7: LearningPathCard + LearningPathTimeline

**Files:**
- Create: `src/components/gamification/LearningPathCard.tsx` + `.test.tsx`
- Create: `src/components/gamification/LearningPathTimeline.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/gamification/LearningPathCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LearningPathCard } from './LearningPathCard'
import { LEARNING_PATHS } from '../../features/gamification'

const path = LEARNING_PATHS[0]  // gestion-de-conflit
const progress = { slug: path.slug, completedSteps: [], requiredTotal: 4, requiredCompleted: 0, isComplete: false }

describe('LearningPathCard', () => {
  it('renders path title', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    expect(screen.getByText(path.title)).toBeInTheDocument()
  })

  it('shows progress fraction', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    expect(screen.getByText(/0 \/ 4/)).toBeInTheDocument()
  })

  it('renders Continuer link to /paths/:slug', () => {
    render(<MemoryRouter><LearningPathCard path={path} progress={progress} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /continuer/i })
    expect(link).toHaveAttribute('href', `/paths/${path.slug}`)
  })

  it('shows completed state when isComplete', () => {
    const done = { ...progress, isComplete: true, requiredCompleted: 4 }
    const { container } = render(<MemoryRouter><LearningPathCard path={path} progress={done} /></MemoryRouter>)
    expect(container.querySelector('.learning-path-card--complete')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/gamification/LearningPathTimeline.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LearningPathTimeline } from './LearningPathTimeline'
import { LEARNING_PATHS } from '../../features/gamification'

const path = LEARNING_PATHS[0]  // 4 steps

describe('LearningPathTimeline', () => {
  it('renders a step for each path step', () => {
    const { container } = render(
      <MemoryRouter>
        <LearningPathTimeline path={path} completedSlugs={[]} />
      </MemoryRouter>
    )
    expect(container.querySelectorAll('.learning-path-timeline__step')).toHaveLength(path.steps.length)
  })

  it('marks completed steps', () => {
    const { container } = render(
      <MemoryRouter>
        <LearningPathTimeline path={path} completedSlugs={['thomas-kilmann']} />
      </MemoryRouter>
    )
    expect(container.querySelectorAll('.learning-path-timeline__step--completed')).toHaveLength(1)
  })

  it('shows optional label for non-required steps', () => {
    const facilitation = LEARNING_PATHS.find(p => p.slug === 'facilitation')!
    render(
      <MemoryRouter>
        <LearningPathTimeline path={facilitation} completedSlugs={[]} />
      </MemoryRouter>
    )
    expect(screen.getByText(/optionnel/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- LearningPathCard.test.tsx LearningPathTimeline.test.tsx
```

- [ ] **Step 3: Implement LearningPathCard.tsx**

```tsx
// src/components/gamification/LearningPathCard.tsx
import { Link } from 'react-router-dom'
import { CheckCircle, Clock } from 'lucide-react'
import type { LearningPath, PathProgress } from '../../features/gamification'
import { MASTERY_LABELS } from '../../features/gamification'

interface Props {
  path: LearningPath
  progress: PathProgress
}

export function LearningPathCard({ path, progress }: Props) {
  const pct = Math.round((progress.requiredCompleted / Math.max(progress.requiredTotal, 1)) * 100)

  return (
    <article className={`learning-path-card${progress.isComplete ? ' learning-path-card--complete' : ''}`}>
      <div className="learning-path-card__header">
        <div>
          <h3 className="learning-path-card__title">{path.title}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
            <span className={`badge badge--${path.level === 'beginner' ? 'green' : path.level === 'intermediate' ? 'orange' : 'red'}`}>
              {path.level === 'beginner' ? 'Débutant' : path.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={11} strokeWidth={2} aria-hidden />
              {path.estimatedMinutes} min
            </span>
          </div>
        </div>
        {progress.isComplete && <CheckCircle size={20} color="var(--color-ok)" aria-hidden />}
      </div>

      <p className="learning-path-card__description">{path.description}</p>

      <div>
        <div className="learning-path-card__progress-text">
          {progress.requiredCompleted} / {progress.requiredTotal} étapes obligatoires
        </div>
        <div className="progress-bar__track" style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 3, overflow: 'hidden', marginTop: '0.35rem' }}>
          <div
            className="progress-bar__fill"
            style={{ width: `${pct}%`, height: '100%', background: progress.isComplete ? 'var(--color-ok)' : 'var(--color-primary)', borderRadius: 3, transition: 'width 0.4s ease' }}
          />
        </div>
      </div>

      <Link to={`/paths/${path.slug}`} className="learning-path-card__cta">
        {progress.isComplete ? 'Revoir' : 'Continuer'} →
      </Link>
    </article>
  )
}
```

- [ ] **Step 4: Implement LearningPathTimeline.tsx**

```tsx
// src/components/gamification/LearningPathTimeline.tsx
import { CheckCircle, Circle } from 'lucide-react'
import type { LearningPath } from '../../features/gamification'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'

function workshopRoute(slug: string): string | undefined {
  return WORKSHOP_DEFINITIONS.find(w => w.slug === slug)?.route
}

interface Props {
  path: LearningPath
  completedSlugs: string[]
}

export function LearningPathTimeline({ path, completedSlugs }: Props) {
  const completed = new Set(completedSlugs)
  const sorted = [...path.steps].sort((a, b) => a.order - b.order)

  return (
    <ol className="learning-path-timeline">
      {sorted.map(step => {
        const isDone = completed.has(step.contentSlug)
        const route = step.contentType === 'workshop' ? workshopRoute(step.contentSlug) : undefined

        return (
          <li
            key={step.contentSlug}
            className={`learning-path-timeline__step${isDone ? ' learning-path-timeline__step--completed' : ''}`}
          >
            <span className="learning-path-timeline__icon">
              {isDone
                ? <CheckCircle size={18} strokeWidth={2} aria-hidden />
                : <Circle size={18} strokeWidth={2} aria-hidden />}
            </span>
            <div>
              {route ? (
                <a href={route} className="learning-path-timeline__slug">{step.contentSlug}</a>
              ) : (
                <span className="learning-path-timeline__slug">{step.contentSlug}</span>
              )}
              {!step.required && (
                <span className="learning-path-timeline__optional">(optionnel)</span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```
npm test -- LearningPathCard.test.tsx LearningPathTimeline.test.tsx
```
Expected: PASS (4 + 3 = 7 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/LearningPathCard.tsx src/components/gamification/LearningPathCard.test.tsx src/components/gamification/LearningPathTimeline.tsx src/components/gamification/LearningPathTimeline.test.tsx
git commit -m "feat(gamification-ui): add LearningPathCard and LearningPathTimeline"
```

---

## Task 8: ChallengeCard

**Files:**
- Create: `src/components/gamification/ChallengeCard.tsx`
- Create: `src/components/gamification/ChallengeCard.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/gamification/ChallengeCard.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChallengeCard } from './ChallengeCard'
import { WEEKLY_CHALLENGES } from '../../features/gamification'

const challenge = WEEKLY_CHALLENGES[0]

describe('ChallengeCard', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('renders challenge title', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(challenge.title)).toBeInTheDocument()
  })

  it('renders challenge description', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(challenge.description)).toBeInTheDocument()
  })

  it('shows XP reward', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(`+${challenge.xpReward} XP`)).toBeInTheDocument()
  })

  it('shows completed badge when completed', () => {
    render(<ChallengeCard challenge={challenge} completed={true} />)
    expect(screen.getByText(/complété/i)).toBeInTheDocument()
  })

  it('applies completed class when completed', () => {
    const { container } = render(<ChallengeCard challenge={challenge} completed={true} />)
    expect(container.querySelector('.challenge-card--completed')).toBeInTheDocument()
  })

  it('shows countdown when not completed', () => {
    // Wednesday (day=3) → 5 days until next Monday
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'))  // Wednesday
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(/jours? restant/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- ChallengeCard.test.tsx
```

- [ ] **Step 3: Implement ChallengeCard.tsx**

```tsx
// src/components/gamification/ChallengeCard.tsx
import type { WeeklyChallenge } from '../../features/gamification'

function daysUntilNextMonday(): number {
  const day = new Date().getDay()  // 0=Sun, 1=Mon, ..., 6=Sat
  const d = (1 + 7 - day) % 7
  return d === 0 ? 7 : d
}

interface Props {
  challenge: WeeklyChallenge
  completed: boolean
}

export function ChallengeCard({ challenge, completed }: Props) {
  const days = daysUntilNextMonday()

  return (
    <article className={`challenge-card${completed ? ' challenge-card--completed' : ''}`}>
      <div className="challenge-card__header">
        <h3 className="challenge-card__title">{challenge.title}</h3>
        <span className="challenge-card__reward">+{challenge.xpReward} XP</span>
      </div>
      <p className="challenge-card__description">{challenge.description}</p>
      <div className="challenge-card__footer">
        <span className="challenge-card__countdown">
          {completed
            ? null
            : `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`}
        </span>
        {completed && (
          <span className="challenge-card__completed-badge">Complété ✓</span>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- ChallengeCard.test.tsx
```
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/gamification/ChallengeCard.tsx src/components/gamification/ChallengeCard.test.tsx
git commit -m "feat(gamification-ui): add ChallengeCard with countdown"
```

---

## Task 9: ArtifactCard + ArtifactGrid

**Files:**
- Create: `src/components/gamification/ArtifactCard.tsx` + `.test.tsx`
- Create: `src/components/gamification/ArtifactGrid.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/gamification/ArtifactCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArtifactCard } from './ArtifactCard'
import type { Artifact } from '../../features/gamification'

const mockArtifact: Artifact = {
  id: 'art-1',
  title: 'Mon feedback SBI',
  type: 'feedback_sbi',
  sourceContentSlug: 'sbi',
  data: {},
  createdAt: '2026-04-29T10:00:00.000Z',
  updatedAt: '2026-04-29T10:00:00.000Z',
}

describe('ArtifactCard', () => {
  it('renders artifact title', () => {
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Mon feedback SBI')).toBeInTheDocument()
  })

  it('renders French type label', () => {
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Feedback SBI')).toBeInTheDocument()
  })

  it('calls onExport when export button clicked', () => {
    const onExport = vi.fn()
    render(<ArtifactCard artifact={mockArtifact} onExport={onExport} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /exporter/i }))
    expect(onExport).toHaveBeenCalledWith('art-1')
  })

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(onDelete).toHaveBeenCalledWith('art-1')
  })
})
```

```tsx
// src/components/gamification/ArtifactGrid.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArtifactGrid } from './ArtifactGrid'
import type { Artifact } from '../../features/gamification'

function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    id: crypto.randomUUID(),
    title: 'Test artifact',
    type: 'feedback_sbi',
    sourceContentSlug: 'sbi',
    data: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('ArtifactGrid', () => {
  it('shows empty message when no artifacts', () => {
    render(<ArtifactGrid artifacts={[]} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/aucun artefact/i)).toBeInTheDocument()
  })

  it('renders a card for each artifact', () => {
    const artifacts = [makeArtifact(), makeArtifact({ title: 'Second' })]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(2)
  })

  it('filters by type', () => {
    const artifacts = [
      makeArtifact({ type: 'feedback_sbi', title: 'SBI one' }),
      makeArtifact({ type: 'grow_plan', title: 'GROW one' }),
    ]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    const select = container.querySelector('.artifact-grid__filter') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'feedback_sbi' } })
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(1)
    expect(screen.getByText('SBI one')).toBeInTheDocument()
  })

  it('filters by search text', () => {
    const artifacts = [makeArtifact({ title: 'Alpha' }), makeArtifact({ title: 'Beta' })]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    const input = container.querySelector('.artifact-grid__search') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'alpha' } })
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- ArtifactCard.test.tsx ArtifactGrid.test.tsx
```

- [ ] **Step 3: Implement ArtifactCard.tsx**

```tsx
// src/components/gamification/ArtifactCard.tsx
import type { Artifact } from '../../features/gamification'
import { ARTIFACT_TYPE_LABELS } from './constants'

interface Props {
  artifact: Artifact
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function ArtifactCard({ artifact, onExport, onDelete }: Props) {
  return (
    <article className="artifact-card">
      <span className="artifact-card__type">{ARTIFACT_TYPE_LABELS[artifact.type]}</span>
      <h3 className="artifact-card__title">{artifact.title}</h3>
      <span className="artifact-card__date">
        {new Date(artifact.createdAt).toLocaleDateString('fr-FR')}
      </span>
      <div className="artifact-card__actions">
        <button
          className="artifact-card__btn"
          onClick={() => onExport(artifact.id)}
          aria-label="Exporter en JSON"
        >
          Exporter
        </button>
        <button
          className="artifact-card__btn artifact-card__btn--danger"
          onClick={() => onDelete(artifact.id)}
          aria-label="Supprimer l'artefact"
        >
          Supprimer
        </button>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Implement ArtifactGrid.tsx**

```tsx
// src/components/gamification/ArtifactGrid.tsx
import { useState } from 'react'
import type { Artifact, ArtifactType } from '../../features/gamification'
import { ArtifactCard } from './ArtifactCard'
import { ARTIFACT_TYPE_LABELS } from './constants'

const ALL_TYPES = Object.keys(ARTIFACT_TYPE_LABELS) as ArtifactType[]

interface Props {
  artifacts: Artifact[]
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function ArtifactGrid({ artifacts, onExport, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ArtifactType | ''>('')

  const filtered = artifacts.filter(a =>
    (typeFilter === '' || a.type === typeFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="artifact-grid">
      <div className="artifact-grid__controls">
        <input
          className="artifact-grid__search"
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher un artefact"
        />
        <select
          className="artifact-grid__filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ArtifactType | '')}
          aria-label="Filtrer par type"
        >
          <option value="">Tous les types</option>
          {ALL_TYPES.map(type => (
            <option key={type} value={type}>{ARTIFACT_TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="artifact-grid__empty">Aucun artefact trouvé.</div>
      ) : (
        <div className="artifact-grid__list">
          {filtered.map(a => (
            <ArtifactCard key={a.id} artifact={a} onExport={onExport} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```
npm test -- ArtifactCard.test.tsx ArtifactGrid.test.tsx
```
Expected: PASS (4 + 4 = 8 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/gamification/ArtifactCard.tsx src/components/gamification/ArtifactCard.test.tsx src/components/gamification/ArtifactGrid.tsx src/components/gamification/ArtifactGrid.test.tsx
git commit -m "feat(gamification-ui): add ArtifactCard and ArtifactGrid"
```

---

## Task 10: GamificationToast

**Files:**
- Create: `src/components/gamification/GamificationToast.tsx`
- Create: `src/components/gamification/GamificationToast.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/gamification/GamificationToast.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { GamificationToast } from './GamificationToast'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: vi.fn(),
}))

import { useGamificationStore } from '../../features/gamification'

describe('GamificationToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders nothing when toast queue is empty', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [], dismissToast: vi.fn() })
    )
    const { container } = render(<GamificationToast />)
    expect(container.querySelector('.gamification-toast')).toBeNull()
  })

  it('renders toast message from queue', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'xp', message: '+100 XP', xp: 100 }], dismissToast: vi.fn() })
    )
    render(<GamificationToast />)
    expect(screen.getByText('+100 XP')).toBeInTheDocument()
  })

  it('renders detail when present', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'badge', message: 'Badge débloqué', detail: 'Médiateur' }], dismissToast: vi.fn() })
    )
    render(<GamificationToast />)
    expect(screen.getByText('Médiateur')).toBeInTheDocument()
  })

  it('calls dismissToast after 3 seconds', async () => {
    const dismissToast = vi.fn()
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'xp', message: '+50 XP' }], dismissToast })
    )
    render(<GamificationToast />)
    await act(async () => { vi.advanceTimersByTime(3000) })
    expect(dismissToast).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- GamificationToast.test.tsx
```

- [ ] **Step 3: Implement GamificationToast.tsx**

```tsx
// src/components/gamification/GamificationToast.tsx
import { useEffect } from 'react'
import { useGamificationStore } from '../../features/gamification'

export function GamificationToast() {
  const toastQueue = useGamificationStore(s => s.toastQueue)
  const dismissToast = useGamificationStore(s => s.dismissToast)
  const toast = toastQueue[0]

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismissToast, 3000)
    return () => clearTimeout(timer)
  }, [toast, dismissToast])

  if (!toast) return null

  return (
    <div className="gamification-toast" role="status" aria-live="polite">
      <span className="gamification-toast__message">{toast.message}</span>
      {toast.detail && (
        <span className="gamification-toast__detail">{toast.detail}</span>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- GamificationToast.test.tsx
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/gamification/GamificationToast.tsx src/components/gamification/GamificationToast.test.tsx
git commit -m "feat(gamification-ui): add GamificationToast"
```

---

## Task 11: ProgressPage + SkillsPage + BadgesPage

**Files:**
- Create: `src/pages/gamification/ProgressPage.tsx` + `.test.tsx`
- Create: `src/pages/gamification/SkillsPage.tsx` + `.test.tsx`
- Create: `src/pages/gamification/BadgesPage.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/pages/gamification/ProgressPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProgressPage } from './ProgressPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getTotalXp: () => 500,
    getAllSkillXp: () => ({ conflict: 200 }),
    events: [],
    artifacts: [],
    getUnlockedBadgeIds: () => [],
    getCompletedContentSlugs: () => [],
  }),
  LEARNING_PATHS: [],
  BADGES: [],
  computePathProgress: () => ({ slug: '', completedSteps: [], requiredTotal: 0, requiredCompleted: 0, isComplete: false }),
}))

describe('ProgressPage', () => {
  it('renders the page title', () => {
    render(<MemoryRouter><ProgressPage /></MemoryRouter>)
    expect(screen.getByText(/progression/i)).toBeInTheDocument()
  })

  it('renders XP summary', () => {
    render(<MemoryRouter><ProgressPage /></MemoryRouter>)
    expect(screen.getByText('XP total')).toBeInTheDocument()
  })
})
```

```tsx
// src/pages/gamification/SkillsPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsPage } from './SkillsPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getAllSkillXp: () => ({ conflict: 450 }),
    getMasteryLevelForSkill: () => 'practice',
    getCompletedContentSlugs: () => [],
  }),
  MASTERY_THRESHOLDS: { discovery: 0, practice: 300, proficiency: 900, field_application: 1800, transmission: 3000 },
}))

vi.mock('../../features/gamification/recommendations', () => ({
  getRecommendations: () => [],
}))

describe('SkillsPage', () => {
  it('renders page title', () => {
    render(<SkillsPage />)
    expect(screen.getByText(/compétences/i)).toBeInTheDocument()
  })

  it('renders a card for each of the 19 skills', () => {
    const { container } = render(<SkillsPage />)
    expect(container.querySelectorAll('.skill-progress-card')).toHaveLength(19)
  })
})
```

```tsx
// src/pages/gamification/BadgesPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgesPage } from './BadgesPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getUnlockedBadgeIds: () => [],
    events: [],
  }),
  BADGES: [
    { id: 'b1', name: 'Test Badge', description: 'Desc', skillArea: 'conflict', criteria: {} },
  ],
}))

describe('BadgesPage', () => {
  it('renders page title', () => {
    render(<BadgesPage />)
    expect(screen.getByText(/badges/i)).toBeInTheDocument()
  })

  it('renders the badge', () => {
    render(<BadgesPage />)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- ProgressPage.test.tsx SkillsPage.test.tsx BadgesPage.test.tsx
```

- [ ] **Step 3: Implement ProgressPage.tsx**

```tsx
// src/pages/gamification/ProgressPage.tsx
import { Link } from 'react-router-dom'
import { useGamificationStore, LEARNING_PATHS, BADGES, computePathProgress } from '../../features/gamification'
import { XpSummaryCard } from '../../components/gamification/XpSummaryCard'
import { SkillRadar } from '../../components/gamification/SkillRadar'
import { RecentProgressFeed } from '../../components/gamification/RecentProgressFeed'
import { BadgeGrid } from '../../components/gamification/BadgeGrid'
import { LearningPathCard } from '../../components/gamification/LearningPathCard'
import { ArtifactGrid } from '../../components/gamification/ArtifactGrid'

export function ProgressPage() {
  const totalXp = useGamificationStore(s => s.getTotalXp())
  const allSkillXp = useGamificationStore(s => s.getAllSkillXp())
  const events = useGamificationStore(s => s.events)
  const artifacts = useGamificationStore(s => s.artifacts)
  const unlockedIds = useGamificationStore(s => s.getUnlockedBadgeIds())
  const completedSlugs = useGamificationStore(s => s.getCompletedContentSlugs())
  const deleteArtifact = useGamificationStore(s => s.deleteArtifact)
  const markArtifactExported = useGamificationStore(s => s.markArtifactExported)

  const inProgressPath = LEARNING_PATHS
    .map(p => ({ path: p, progress: computePathProgress(p, completedSlugs) }))
    .find(({ progress }) => !progress.isComplete && progress.completedSteps.length > 0)

  const recentBadges = BADGES.filter(b => unlockedIds.includes(b.id)).slice(-3)
  const recentArtifacts = [...artifacts].reverse().slice(0, 3)

  function handleExport(id: string) {
    const art = artifacts.find(a => a.id === id)
    if (!art) return
    const blob = new Blob([JSON.stringify(art.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${art.title}.json`
    a.click()
    URL.revokeObjectURL(url)
    markArtifactExported(id)
  }

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Progression</h1>

      <div className="gamification-page__top">
        <div>
          <XpSummaryCard totalXp={totalXp} />
        </div>
        <SkillRadar skills={allSkillXp} />
      </div>

      <div className="gamification-page__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gamification-page__section-title">Activité récente</span>
        </div>
        <RecentProgressFeed events={events} />
      </div>

      {recentBadges.length > 0 && (
        <div className="gamification-page__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="gamification-page__section-title">Derniers badges</span>
            <Link to="/badges" className="gamification-see-all">Voir tous →</Link>
          </div>
          <BadgeGrid badges={recentBadges} unlockedIds={unlockedIds} events={events} />
        </div>
      )}

      {inProgressPath && (
        <div className="gamification-page__section">
          <span className="gamification-page__section-title">Parcours en cours</span>
          <LearningPathCard path={inProgressPath.path} progress={inProgressPath.progress} />
        </div>
      )}

      {recentArtifacts.length > 0 && (
        <div className="gamification-page__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="gamification-page__section-title">Artefacts récents</span>
            <Link to="/portfolio" className="gamification-see-all">Voir tout →</Link>
          </div>
          <ArtifactGrid artifacts={recentArtifacts} onExport={handleExport} onDelete={deleteArtifact} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement SkillsPage.tsx**

```tsx
// src/pages/gamification/SkillsPage.tsx
import { useGamificationStore } from '../../features/gamification'
import { getRecommendations } from '../../features/gamification/recommendations'
import { SkillProgressCard } from '../../components/gamification/SkillProgressCard'
import { SKILL_AREAS } from '../../components/gamification/constants'

export function SkillsPage() {
  const allSkillXp = useGamificationStore(s => s.getAllSkillXp())
  const getMasteryLevelForSkill = useGamificationStore(s => s.getMasteryLevelForSkill)
  const completedSlugs = useGamificationStore(s => s.getCompletedContentSlugs())

  const skillData = SKILL_AREAS
    .map(skill => ({
      skill,
      xp: allSkillXp[skill] ?? 0,
      level: getMasteryLevelForSkill(skill),
      recommendations: getRecommendations(skill, completedSlugs),
    }))
    .sort((a, b) => b.xp - a.xp)

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Compétences</h1>
      <div className="skills-grid">
        {skillData.map(({ skill, xp, level, recommendations }) => (
          <SkillProgressCard
            key={skill}
            skill={skill}
            xp={xp}
            level={level}
            recommendations={recommendations}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Implement BadgesPage.tsx**

```tsx
// src/pages/gamification/BadgesPage.tsx
import { useGamificationStore, BADGES } from '../../features/gamification'
import { BadgeGrid } from '../../components/gamification/BadgeGrid'

export function BadgesPage() {
  const unlockedIds = useGamificationStore(s => s.getUnlockedBadgeIds())
  const events = useGamificationStore(s => s.events)

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Badges</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        {unlockedIds.length} / {BADGES.length} badge{BADGES.length > 1 ? 's' : ''} débloqué{unlockedIds.length > 1 ? 's' : ''}
      </p>
      <BadgeGrid badges={BADGES} unlockedIds={unlockedIds} events={events} />
    </div>
  )
}
```

- [ ] **Step 6: Run tests to verify they pass**

```
npm test -- ProgressPage.test.tsx SkillsPage.test.tsx BadgesPage.test.tsx
```
Expected: PASS (2 + 2 + 2 = 6 tests).

- [ ] **Step 7: Commit**

```bash
git add src/pages/gamification/ProgressPage.tsx src/pages/gamification/ProgressPage.test.tsx src/pages/gamification/SkillsPage.tsx src/pages/gamification/SkillsPage.test.tsx src/pages/gamification/BadgesPage.tsx src/pages/gamification/BadgesPage.test.tsx
git commit -m "feat(gamification-ui): add ProgressPage, SkillsPage, BadgesPage"
```

---

## Task 12: PathsPage + PathDetailPage + ChallengesPage + PortfolioPage

**Files:**
- Create: `src/pages/gamification/PathsPage.tsx` + `.test.tsx`
- Create: `src/pages/gamification/PathDetailPage.tsx` + `.test.tsx`
- Create: `src/pages/gamification/ChallengesPage.tsx` + `.test.tsx`
- Create: `src/pages/gamification/PortfolioPage.tsx` + `.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/pages/gamification/PathsPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PathsPage } from './PathsPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({ getCompletedContentSlugs: () => [] }),
  LEARNING_PATHS: [
    { id: 'p1', slug: 'test-path', title: 'Test Path', description: 'Desc', level: 'beginner', skillAreas: [], estimatedMinutes: 30, steps: [] },
  ],
  computePathProgress: () => ({ slug: 'test-path', completedSteps: [], requiredTotal: 0, requiredCompleted: 0, isComplete: false }),
}))

describe('PathsPage', () => {
  it('renders page title', () => {
    render(<MemoryRouter><PathsPage /></MemoryRouter>)
    expect(screen.getByText(/parcours/i)).toBeInTheDocument()
  })

  it('renders a path card for each learning path', () => {
    render(<MemoryRouter><PathsPage /></MemoryRouter>)
    expect(screen.getByText('Test Path')).toBeInTheDocument()
  })
})
```

```tsx
// src/pages/gamification/PathDetailPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PathDetailPage } from './PathDetailPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({ getCompletedContentSlugs: () => [] }),
  LEARNING_PATHS: [
    {
      id: 'p1', slug: 'test-path', title: 'Parcours Test', description: 'Desc',
      level: 'beginner', skillAreas: [], estimatedMinutes: 30,
      steps: [{ order: 1, contentType: 'workshop', contentSlug: 'thomas-kilmann', required: true }],
    },
  ],
  BADGES: [],
  computePathProgress: () => ({ slug: 'test-path', completedSteps: [], requiredTotal: 1, requiredCompleted: 0, isComplete: false }),
}))

describe('PathDetailPage', () => {
  it('renders the path title', () => {
    render(
      <MemoryRouter initialEntries={['/paths/test-path']}>
        <Routes>
          <Route path="/paths/:slug" element={<PathDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Parcours Test')).toBeInTheDocument()
  })

  it('renders 404 message for unknown slug', () => {
    render(
      <MemoryRouter initialEntries={['/paths/nonexistent']}>
        <Routes>
          <Route path="/paths/:slug" element={<PathDetailPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/introuvable/i)).toBeInTheDocument()
  })
})
```

```tsx
// src/pages/gamification/ChallengesPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChallengesPage } from './ChallengesPage'

const mockChallenge = {
  id: 'ch-1', title: 'Défi Test', description: 'Desc', skillArea: 'coaching',
  criteria: { type: 'complete_content', contentSlug: 'sbi' }, xpReward: 150,
}

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getActiveChallenge: () => mockChallenge,
    isChallengeCompleted: () => false,
  }),
}))

describe('ChallengesPage', () => {
  it('renders page title', () => {
    render(<ChallengesPage />)
    expect(screen.getByText(/défi/i)).toBeInTheDocument()
  })

  it('renders the active challenge title', () => {
    render(<ChallengesPage />)
    expect(screen.getByText('Défi Test')).toBeInTheDocument()
  })
})
```

```tsx
// src/pages/gamification/PortfolioPage.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PortfolioPage } from './PortfolioPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    artifacts: [],
    deleteArtifact: vi.fn(),
    markArtifactExported: vi.fn(),
  }),
}))

describe('PortfolioPage', () => {
  it('renders page title', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument()
  })

  it('shows empty state when no artifacts', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/aucun artefact/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```
npm test -- PathsPage.test.tsx PathDetailPage.test.tsx ChallengesPage.test.tsx PortfolioPage.test.tsx
```

- [ ] **Step 3: Implement PathsPage.tsx**

```tsx
// src/pages/gamification/PathsPage.tsx
import { useGamificationStore, LEARNING_PATHS, computePathProgress } from '../../features/gamification'
import { LearningPathCard } from '../../components/gamification/LearningPathCard'

export function PathsPage() {
  const completedSlugs = useGamificationStore(s => s.getCompletedContentSlugs())

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Parcours guidés</h1>
      <div className="paths-list">
        {LEARNING_PATHS.map(path => (
          <LearningPathCard
            key={path.slug}
            path={path}
            progress={computePathProgress(path, completedSlugs)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement PathDetailPage.tsx**

```tsx
// src/pages/gamification/PathDetailPage.tsx
import { useParams } from 'react-router-dom'
import { useGamificationStore, LEARNING_PATHS, BADGES, computePathProgress } from '../../features/gamification'
import { LearningPathTimeline } from '../../components/gamification/LearningPathTimeline'
import { BadgeCard } from '../../components/gamification/BadgeCard'

export function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const completedSlugs = useGamificationStore(s => s.getCompletedContentSlugs())
  const events = useGamificationStore(s => s.events)
  const unlockedIds = useGamificationStore(s => s.getUnlockedBadgeIds())

  const path = LEARNING_PATHS.find(p => p.slug === slug)

  if (!path) {
    return (
      <div className="gamification-page">
        <p>Parcours introuvable.</p>
      </div>
    )
  }

  const progress = computePathProgress(path, completedSlugs)
  const completionBadge = path.completionBadgeId
    ? BADGES.find(b => b.id === path.completionBadgeId)
    : undefined

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">{path.title}</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{path.description}</p>
      <p style={{ fontSize: '0.85rem' }}>
        {progress.requiredCompleted} / {progress.requiredTotal} étapes obligatoires
        {progress.isComplete && ' — Complété ✓'}
      </p>

      <div className="gamification-page__section">
        <span className="gamification-page__section-title">Étapes</span>
        <LearningPathTimeline path={path} completedSlugs={completedSlugs} />
      </div>

      {completionBadge && (
        <div className="gamification-page__section">
          <span className="gamification-page__section-title">Badge associé</span>
          <BadgeCard
            badge={completionBadge}
            unlockedAt={
              events.find(e => e.type === 'BADGE_UNLOCKED' && e.metadata?.badgeId === completionBadge.id)?.createdAt
            }
          />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Implement ChallengesPage.tsx**

```tsx
// src/pages/gamification/ChallengesPage.tsx
import { useGamificationStore } from '../../features/gamification'
import { ChallengeCard } from '../../components/gamification/ChallengeCard'

export function ChallengesPage() {
  const getActiveChallenge = useGamificationStore(s => s.getActiveChallenge)
  const isChallengeCompleted = useGamificationStore(s => s.isChallengeCompleted)
  const challenge = getActiveChallenge()

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Défi hebdomadaire</h1>
      {challenge ? (
        <ChallengeCard
          challenge={challenge}
          completed={isChallengeCompleted(challenge.id)}
        />
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>Aucun défi actif.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Implement PortfolioPage.tsx**

```tsx
// src/pages/gamification/PortfolioPage.tsx
import { useGamificationStore } from '../../features/gamification'
import { ArtifactGrid } from '../../components/gamification/ArtifactGrid'

export function PortfolioPage() {
  const artifacts = useGamificationStore(s => s.artifacts)
  const deleteArtifact = useGamificationStore(s => s.deleteArtifact)
  const markArtifactExported = useGamificationStore(s => s.markArtifactExported)

  function handleExport(id: string) {
    const art = artifacts.find(a => a.id === id)
    if (!art) return
    const blob = new Blob([JSON.stringify(art.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${art.title}.json`
    a.click()
    URL.revokeObjectURL(url)
    markArtifactExported(id)
  }

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Portfolio</h1>
      <ArtifactGrid
        artifacts={artifacts}
        onExport={handleExport}
        onDelete={deleteArtifact}
      />
    </div>
  )
}
```

- [ ] **Step 7: Run tests to verify they pass**

```
npm test -- PathsPage.test.tsx PathDetailPage.test.tsx ChallengesPage.test.tsx PortfolioPage.test.tsx
```
Expected: PASS (2 + 2 + 2 + 2 = 8 tests).

- [ ] **Step 8: Commit**

```bash
git add src/pages/gamification/PathsPage.tsx src/pages/gamification/PathsPage.test.tsx src/pages/gamification/PathDetailPage.tsx src/pages/gamification/PathDetailPage.test.tsx src/pages/gamification/ChallengesPage.tsx src/pages/gamification/ChallengesPage.test.tsx src/pages/gamification/PortfolioPage.tsx src/pages/gamification/PortfolioPage.test.tsx
git commit -m "feat(gamification-ui): add PathsPage, PathDetailPage, ChallengesPage, PortfolioPage"
```

---

## Task 13: App.tsx routes + NavBar + GamificationToast in Layout

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/NavBar/index.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// Test: NavBar should have a Progression link
// src/components/NavBar/NavBar.test.tsx already exists — check it has a test for the Progression link.
// Add to the existing NavBar.test.tsx:
```

Read `src/components/NavBar/NavBar.test.tsx` first to understand existing tests, then add:

```tsx
it('renders a Progression nav link to /progress', () => {
  render(<MemoryRouter><NavBar /></MemoryRouter>)
  const link = screen.getByRole('link', { name: /progression/i })
  expect(link).toHaveAttribute('href', '/progress')
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- NavBar.test.tsx
```
Expected: FAIL — no Progression link.

- [ ] **Step 3: Update App.tsx — add imports, routes, GamificationToast in Layout**

Full updated `src/App.tsx`:

```tsx
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { GamificationToast } from './components/gamification/GamificationToast'
import { Home } from './components/Home'
import { ScenarioSelector } from './components/ScenarioSelector'
import { SimulationScreen } from './components/SimulationScreen'
import { Debrief } from './components/Debrief'
import { QuizSelector } from './components/QuizSelector'
import { QuizScreen } from './components/QuizScreen'
import { QuizResults } from './components/QuizResults'
import { AteliersHome } from './components/AteliersHome'
import { WorkshopCategoryPage } from './components/WorkshopCategoryPage'
import { ScrumGuideAtelier } from './components/ScrumGuideAtelier'
import { ConflictAtelier } from './components/ConflictAtelier'
import { DelegationPokerAtelier } from './components/DelegationPokerAtelier'
import { GrowModelAtelier } from './components/GrowModelAtelier'
import { StakeholderMappingAtelier } from './components/StakeholderMappingAtelier'
import { AskTellAtelier } from './components/AskTellAtelier'
import { MovingMotivatorsAtelier } from './components/MovingMotivatorsAtelier'
import { IshikawaAtelier } from './components/IshikawaAtelier'
import { TroikaConsultingAtelier } from './components/TroikaConsultingAtelier'
import { SBIAtelier } from './components/SBIAtelier'
import { TRIZAtelier } from './components/TRIZAtelier'
import { CynefinFrameworkAtelier } from './components/CynefinFrameworkAtelier'
import { ProgressPage } from './pages/gamification/ProgressPage'
import { SkillsPage } from './pages/gamification/SkillsPage'
import { BadgesPage } from './pages/gamification/BadgesPage'
import { PathsPage } from './pages/gamification/PathsPage'
import { PathDetailPage } from './pages/gamification/PathDetailPage'
import { ChallengesPage } from './pages/gamification/ChallengesPage'
import { PortfolioPage } from './pages/gamification/PortfolioPage'

function Layout() {
  return (
    <>
      <NavBar />
      <GamificationToast />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/simulation', element: <ScenarioSelector /> },
      { path: '/simulation/:id', element: <SimulationScreen /> },
      { path: '/debrief', element: <Debrief /> },
      { path: '/quiz', element: <QuizSelector /> },
      { path: '/quiz/:examId', element: <QuizScreen /> },
      { path: '/quiz/:examId/results', element: <QuizResults /> },
      { path: '/ateliers', element: <AteliersHome /> },
      { path: '/ateliers/scrum-guide', element: <ScrumGuideAtelier /> },
      { path: '/ateliers/conflits', element: <ConflictAtelier /> },
      { path: '/ateliers/delegation-poker', element: <DelegationPokerAtelier /> },
      { path: '/ateliers/grow-model', element: <GrowModelAtelier /> },
      { path: '/ateliers/stakeholder-mapping', element: <StakeholderMappingAtelier /> },
      { path: '/ateliers/ask-vs-tell', element: <AskTellAtelier /> },
      { path: '/ateliers/moving-motivators', element: <MovingMotivatorsAtelier /> },
      { path: '/ateliers/ishikawa', element: <IshikawaAtelier /> },
      { path: '/ateliers/troika-consulting', element: <TroikaConsultingAtelier /> },
      { path: '/ateliers/sbi', element: <SBIAtelier /> },
      { path: '/ateliers/triz', element: <TRIZAtelier /> },
      { path: '/ateliers/cynefin-framework', element: <CynefinFrameworkAtelier /> },
      { path: '/ateliers/categories/:slug', element: <WorkshopCategoryPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/skills', element: <SkillsPage /> },
      { path: '/badges', element: <BadgesPage /> },
      { path: '/paths', element: <PathsPage /> },
      { path: '/paths/:slug', element: <PathDetailPage /> },
      { path: '/challenges', element: <ChallengesPage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 4: Update NavBar — add Progression link**

In `src/components/NavBar/index.tsx`, update the `NAV_LINKS` array. Add `TrendingUp` to lucide imports. Full updated file:

```tsx
import { useLocation, Link } from 'react-router-dom'
import { Zap, FileCheck, BookOpen, TrendingUp, Sun, Moon, Layers } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const NAV_LINKS = [
  { to: '/simulation', label: 'Simulation', Icon: Zap },
  { to: '/quiz', label: 'Quiz PSM-1', Icon: FileCheck },
  { to: '/ateliers', label: 'Ateliers', Icon: BookOpen },
  { to: '/progress', label: 'Progression', Icon: TrendingUp },
] as const

export function NavBar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()

  return (
    <nav className="navbar" aria-label="Main">
      <Link to="/" className="navbar__brand" aria-label="Scrum Master Sim">
        <Layers size={18} strokeWidth={2} aria-hidden="true" className="navbar__brand-icon" />
        <span>Scrum Master Sim</span>
      </Link>

      <ul className="navbar__links">
        {NAV_LINKS.map(({ to, label, Icon }) => {
          const isActive = pathname === to || pathname.startsWith(to + '/')
          return (
            <li key={to}>
              <Link
                to={to}
                className={'navbar__link' + (isActive ? ' navbar__link--active' : '')}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      <button
        className="navbar__theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        {theme === 'dark'
          ? <Sun size={16} strokeWidth={2} />
          : <Moon size={16} strokeWidth={2} />}
      </button>
    </nav>
  )
}
```

- [ ] **Step 5: Add the test to NavBar.test.tsx**

Read the existing file at `src/components/NavBar/NavBar.test.tsx` and add this test to the existing `describe('NavBar')` block:

```tsx
it('renders a Progression nav link to /progress', () => {
  render(<MemoryRouter><NavBar /></MemoryRouter>)
  const link = screen.getByRole('link', { name: /progression/i })
  expect(link).toHaveAttribute('href', '/progress')
})
```

- [ ] **Step 6: Run all tests**

```
npm test
```
Expected: All tests pass. No regressions in existing tests.

- [ ] **Step 7: TypeScript check**

```
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 8: Build check**

```
npm run build
```
Expected: Build succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/components/NavBar/index.tsx src/components/NavBar/NavBar.test.tsx
git commit -m "feat(gamification-ui): wire 7 routes, NavBar Progression link, GamificationToast in Layout"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| `/progress` page with XpSummaryCard + SkillRadar + RecentProgressFeed + BadgeGrid(3) + LearningPathCard + ArtifactGrid(3) | Task 11 |
| `/skills` — 19 SkillProgressCard sorted by XP desc | Task 11 |
| `/badges` — BadgeGrid unlocked first | Task 11 |
| `/paths` — 5 LearningPathCard | Task 12 |
| `/paths/:slug` — LearningPathTimeline + CTA + badge | Task 12 |
| `/challenges` — ChallengeCard + countdown | Task 12 |
| `/portfolio` — ArtifactGrid with filter + search | Task 12 |
| 13 components (all listed in spec) | Tasks 2–10 |
| GamificationToast in Layout, reads toastQueue[0], 3s, dismissToast | Task 10 + 13 |
| NavBar Progression link | Task 13 |
| recommendations inverse skill-map helper | Task 1 |
| No new UI lib (pure SVG radar) | Task 4 ✓ |
| CSS variables from index.css | All tasks ✓ |
| TypeScript 0 errors | Task 13 |
| Build passes | Task 13 |

**Placeholder scan:** None found.

**Type consistency:** All components use types from `src/features/gamification`. `getMasteryLevelForSkill` (not `getMasteryLevel`) is used consistently in pages. `computePathProgress` is imported from `src/features/gamification` (exported in index.ts).
