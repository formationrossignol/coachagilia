# Gamification Phase 1 — Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete gamification engine — types, XP rules, skill mapping, mastery computation, badges, learning paths, weekly challenges, and the Zustand store — persisted in localStorage, no backend.

**Architecture:** Event-log pattern: a single Zustand store persists a raw array of `GamificationEvent[]`; all derived state (XP totals, skill levels, mastery, unlocked badges) is computed on-read from pure functions. This makes rule changes safe — just recompute from the log. Badge/level checks run synchronously inside `recordEvent` and emit additional events in one atomic `set()` call.

**Tech Stack:** TypeScript, Zustand 5 with `persist` + `createJSONStorage(() => localStorage)`, Vitest, jsdom. No new npm dependencies.

---

## File Structure

```
src/features/gamification/
  types.ts               — all TypeScript types (no logic)
  rules.ts               — XP_RULES, XP_BONUSES, MASTERY_THRESHOLDS, MASTERY_LABELS
  skill-map.ts           — CONTENT_SKILL_MAP: Record<slug, SkillContribution[]>
  mastery.ts             — getMasteryLevel(), computeSkillXp(), computeSkillImpacts()
  challenges.ts          — WEEKLY_CHALLENGES[], getActiveChallenge(), isChallengeCompletedBy()
  badges.ts              — BADGES[], checkBadgeCriteria()
  paths.ts               — LEARNING_PATHS[], computePathProgress()
  gamification.store.ts  — Zustand store: useGamificationStore
  index.ts               — public re-exports
  mastery.test.ts
  challenges.test.ts
  badges.test.ts
  paths.test.ts
  gamification.store.test.ts
```

---

## Task 1: Types

**Files:**
- Create: `src/features/gamification/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// src/features/gamification/types.ts

export type SkillArea =
  | 'conflict' | 'communication' | 'feedback' | 'coaching'
  | 'facilitation' | 'retrospective' | 'problem_solving' | 'team_health'
  | 'management_3_0' | 'product_discovery' | 'prioritization'
  | 'stakeholder_management' | 'decision_making' | 'flow'
  | 'delivery_excellence' | 'systems_thinking' | 'organization_design'
  | 'change_management' | 'leadership'

export type MasteryLevel =
  | 'discovery' | 'practice' | 'proficiency' | 'field_application' | 'transmission'

export type GamificationEventType =
  | 'WORKSHOP_STARTED' | 'WORKSHOP_COMPLETED' | 'QUIZ_COMPLETED'
  | 'ARTIFACT_CREATED' | 'ARTIFACT_EXPORTED' | 'CHALLENGE_COMPLETED'
  | 'PATH_STARTED' | 'PATH_COMPLETED' | 'SCORE_IMPROVED'
  | 'SKILL_LEVEL_UP' | 'BADGE_UNLOCKED'

export interface GamificationEvent {
  id: string
  type: GamificationEventType
  contentSlug?: string
  contentType?: 'workshop' | 'quiz' | 'path' | 'artifact' | 'challenge'
  xpAwarded: number
  skillImpacts?: Partial<Record<SkillArea, number>>
  score?: number
  metadata?: Record<string, unknown>
  createdAt: string
}

export type ArtifactType =
  | 'feedback_sbi' | 'grow_plan' | 'stakeholder_map' | 'fishbone_diagram'
  | 'five_whys' | 'team_charter' | 'working_agreements' | 'delegation_board'
  | 'facilitation_canvas' | 'retrospective_board' | 'risk_map'
  | 'decision_matrix' | 'customer_journey' | 'value_stream_map' | 'desc_message'

export interface Artifact {
  id: string
  title: string
  type: ArtifactType
  sourceContentSlug: string
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
  exportedAt?: string
}

export interface SkillContribution {
  skill: SkillArea
  weight: number
}

export interface BadgeCriteria {
  completedContent?: string[]
  minAverageScore?: number
  minArtifactsCreated?: number
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  skillArea: SkillArea
  criteria: BadgeCriteria
}

export interface LearningPathStep {
  order: number
  contentType: 'workshop' | 'quiz'
  contentSlug: string
  required: boolean
}

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  skillAreas: SkillArea[]
  estimatedMinutes: number
  steps: LearningPathStep[]
  completionBadgeId?: string
}

export interface PathProgress {
  slug: string
  completedSteps: string[]
  requiredTotal: number
  requiredCompleted: number
  isComplete: boolean
}

export interface WeeklyChallenge {
  id: string
  title: string
  description: string
  skillArea: SkillArea
  criteria:
    | { type: 'complete_content'; contentSlug: string }
    | { type: 'create_artifact'; artifactType: ArtifactType }
    | { type: 'complete_skill_activities'; skillArea: SkillArea; count: number }
    | { type: 'score_at_least'; contentSlug: string; score: number }
  xpReward: number
}

export interface GamificationToastPayload {
  type: 'xp' | 'badge' | 'level_up' | 'path_complete' | 'challenge_complete'
  message: string
  detail?: string
  xp?: number
}

export interface RecordEventInput {
  type: GamificationEventType
  contentSlug?: string
  contentType?: GamificationEvent['contentType']
  score?: number
  metadata?: Record<string, unknown>
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/gamification/types.ts
git commit -m "feat(gamification): add core TypeScript types"
```

---

## Task 2: Rules

**Files:**
- Create: `src/features/gamification/rules.ts`

- [ ] **Step 1: Create the rules file**

```ts
// src/features/gamification/rules.ts
import type { GamificationEventType, MasteryLevel } from './types'

export const XP_RULES: Record<GamificationEventType, number> = {
  WORKSHOP_STARTED: 5,
  WORKSHOP_COMPLETED: 100,
  QUIZ_COMPLETED: 80,
  ARTIFACT_CREATED: 60,
  ARTIFACT_EXPORTED: 30,
  CHALLENGE_COMPLETED: 150,
  PATH_STARTED: 20,
  PATH_COMPLETED: 300,
  SCORE_IMPROVED: 50,
  SKILL_LEVEL_UP: 100,
  BADGE_UNLOCKED: 200,
}

export const XP_BONUSES = {
  HIGH_SCORE_80: 25,
  HIGH_SCORE_90: 50,
  PERFECT_SCORE: 100,
  FIRST_ARTIFACT: 50,
  WEEKLY_STREAK: 75,
} as const

export const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
  discovery: 0,
  practice: 300,
  proficiency: 900,
  field_application: 1800,
  transmission: 3000,
}

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  discovery: 'Découverte',
  practice: 'Pratique',
  proficiency: 'Maîtrise',
  field_application: 'Application terrain',
  transmission: 'Transmission',
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/gamification/rules.ts
git commit -m "feat(gamification): add XP rules and mastery thresholds"
```

---

## Task 3: Skill Map

**Files:**
- Create: `src/features/gamification/skill-map.ts`

- [ ] **Step 1: Create the skill map file**

All 12 existing ateliers + 3 exam slugs + 5 coming-soon slugs referenced by badges/paths.

```ts
// src/features/gamification/skill-map.ts
import type { SkillContribution } from './types'

export const CONTENT_SKILL_MAP: Record<string, SkillContribution[]> = {
  // existing ateliers
  'thomas-kilmann':     [{ skill: 'conflict', weight: 0.7 }, { skill: 'communication', weight: 0.2 }, { skill: 'leadership', weight: 0.1 }],
  'sbi':                [{ skill: 'feedback', weight: 0.6 }, { skill: 'communication', weight: 0.3 }, { skill: 'conflict', weight: 0.1 }],
  'grow-model':         [{ skill: 'coaching', weight: 0.7 }, { skill: 'communication', weight: 0.2 }, { skill: 'leadership', weight: 0.1 }],
  'ask-vs-tell':        [{ skill: 'coaching', weight: 0.6 }, { skill: 'facilitation', weight: 0.2 }, { skill: 'leadership', weight: 0.2 }],
  'stakeholder-mapping':[{ skill: 'stakeholder_management', weight: 0.8 }, { skill: 'communication', weight: 0.2 }],
  'delegation-poker':   [{ skill: 'management_3_0', weight: 0.5 }, { skill: 'leadership', weight: 0.3 }, { skill: 'decision_making', weight: 0.2 }],
  'moving-motivators':  [{ skill: 'management_3_0', weight: 0.6 }, { skill: 'team_health', weight: 0.3 }, { skill: 'coaching', weight: 0.1 }],
  'ishikawa':           [{ skill: 'problem_solving', weight: 0.7 }, { skill: 'systems_thinking', weight: 0.3 }],
  'troika-consulting':  [{ skill: 'facilitation', weight: 0.6 }, { skill: 'coaching', weight: 0.3 }, { skill: 'communication', weight: 0.1 }],
  'triz':               [{ skill: 'problem_solving', weight: 0.5 }, { skill: 'facilitation', weight: 0.3 }, { skill: 'systems_thinking', weight: 0.2 }],
  'cynefin-framework':  [{ skill: 'systems_thinking', weight: 0.6 }, { skill: 'decision_making', weight: 0.3 }, { skill: 'leadership', weight: 0.1 }],
  'scrum-guide':        [{ skill: 'facilitation', weight: 0.4 }, { skill: 'team_health', weight: 0.4 }, { skill: 'delivery_excellence', weight: 0.2 }],
  // quiz exams
  'exam-1':             [{ skill: 'facilitation', weight: 0.4 }, { skill: 'team_health', weight: 0.3 }, { skill: 'delivery_excellence', weight: 0.3 }],
  'exam-2':             [{ skill: 'coaching', weight: 0.4 }, { skill: 'leadership', weight: 0.3 }, { skill: 'management_3_0', weight: 0.3 }],
  'exam-3':             [{ skill: 'problem_solving', weight: 0.4 }, { skill: 'systems_thinking', weight: 0.3 }, { skill: 'decision_making', weight: 0.3 }],
  // coming-soon — referenced in badges and paths
  'nonviolent-communication': [{ skill: 'communication', weight: 0.5 }, { skill: 'conflict', weight: 0.3 }, { skill: 'feedback', weight: 0.2 }],
  'ladder-of-inference':      [{ skill: 'conflict', weight: 0.5 }, { skill: 'communication', weight: 0.4 }, { skill: 'coaching', weight: 0.1 }],
  'facilitation-canvas':      [{ skill: 'facilitation', weight: 0.8 }, { skill: 'decision_making', weight: 0.2 }],
  '1-2-4-all':                [{ skill: 'facilitation', weight: 0.7 }, { skill: 'team_health', weight: 0.3 }],
  'dot-voting':               [{ skill: 'facilitation', weight: 0.6 }, { skill: 'decision_making', weight: 0.4 }],
  'active-listening':         [{ skill: 'coaching', weight: 0.6 }, { skill: 'communication', weight: 0.4 }],
  'powerful-questions':       [{ skill: 'coaching', weight: 0.7 }, { skill: 'facilitation', weight: 0.3 }],
  '5-whys':                   [{ skill: 'problem_solving', weight: 0.8 }, { skill: 'systems_thinking', weight: 0.2 }],
  'root-cause-analysis':      [{ skill: 'problem_solving', weight: 0.7 }, { skill: 'systems_thinking', weight: 0.3 }],
  'delegation-board':         [{ skill: 'management_3_0', weight: 0.6 }, { skill: 'decision_making', weight: 0.4 }],
  'celebration-grid':         [{ skill: 'management_3_0', weight: 0.5 }, { skill: 'team_health', weight: 0.5 }],
  'fist-of-five':             [{ skill: 'facilitation', weight: 0.7 }, { skill: 'decision_making', weight: 0.3 }],
  'lean-coffee':              [{ skill: 'facilitation', weight: 0.8 }, { skill: 'retrospective', weight: 0.2 }],
  'team-health-check':        [{ skill: 'team_health', weight: 0.8 }, { skill: 'facilitation', weight: 0.2 }],
  'psychological-safety':     [{ skill: 'team_health', weight: 0.7 }, { skill: 'leadership', weight: 0.3 }],
  'working-agreements':       [{ skill: 'team_health', weight: 0.6 }, { skill: 'facilitation', weight: 0.4 }],
  'empathy-map':              [{ skill: 'stakeholder_management', weight: 0.6 }, { skill: 'coaching', weight: 0.4 }],
  'customer-journey-mapping': [{ skill: 'stakeholder_management', weight: 0.7 }, { skill: 'product_discovery', weight: 0.3 }],
  'kanban':                   [{ skill: 'flow', weight: 0.7 }, { skill: 'systems_thinking', weight: 0.3 }],
  'value-stream-mapping':     [{ skill: 'flow', weight: 0.6 }, { skill: 'systems_thinking', weight: 0.4 }],
  'dependency-mapping':       [{ skill: 'flow', weight: 0.5 }, { skill: 'organization_design', weight: 0.5 }],
  'circle-of-influence':      [{ skill: 'leadership', weight: 0.6 }, { skill: 'coaching', weight: 0.4 }],
  'situational-leadership':   [{ skill: 'leadership', weight: 0.7 }, { skill: 'management_3_0', weight: 0.3 }],
  'desc':                     [{ skill: 'feedback', weight: 0.6 }, { skill: 'communication', weight: 0.4 }],
  'feedforward':              [{ skill: 'feedback', weight: 0.7 }, { skill: 'coaching', weight: 0.3 }],
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/features/gamification/skill-map.ts
git commit -m "feat(gamification): add content-to-skill mapping (40 entries)"
```

---

## Task 4: Mastery Helpers

**Files:**
- Create: `src/features/gamification/mastery.ts`
- Create: `src/features/gamification/mastery.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/gamification/mastery.test.ts
import { describe, it, expect } from 'vitest'
import { getMasteryLevel, computeSkillXp, computeSkillImpacts } from './mastery'
import type { GamificationEvent } from './types'

describe('getMasteryLevel', () => {
  it('returns discovery for 0 xp', () => {
    expect(getMasteryLevel(0)).toBe('discovery')
  })

  it('returns discovery for 299 xp', () => {
    expect(getMasteryLevel(299)).toBe('discovery')
  })

  it('returns practice at 300 xp', () => {
    expect(getMasteryLevel(300)).toBe('practice')
  })

  it('returns proficiency at 900 xp', () => {
    expect(getMasteryLevel(900)).toBe('proficiency')
  })

  it('returns field_application at 1800 xp', () => {
    expect(getMasteryLevel(1800)).toBe('field_application')
  })

  it('returns transmission at 3000 xp', () => {
    expect(getMasteryLevel(3000)).toBe('transmission')
  })

  it('returns transmission above 3000 xp', () => {
    expect(getMasteryLevel(5000)).toBe('transmission')
  })
})

describe('computeSkillXp', () => {
  it('returns empty object for empty event log', () => {
    expect(computeSkillXp([])).toEqual({})
  })

  it('sums skillImpacts across events', () => {
    const events: GamificationEvent[] = [
      {
        id: '1',
        type: 'WORKSHOP_COMPLETED',
        xpAwarded: 100,
        skillImpacts: { conflict: 70, communication: 20, leadership: 10 },
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: 'WORKSHOP_COMPLETED',
        xpAwarded: 100,
        skillImpacts: { conflict: 50, communication: 40 },
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ]
    const result = computeSkillXp(events)
    expect(result.conflict).toBe(120)
    expect(result.communication).toBe(60)
    expect(result.leadership).toBe(10)
  })

  it('ignores events without skillImpacts', () => {
    const events: GamificationEvent[] = [
      { id: '1', type: 'BADGE_UNLOCKED', xpAwarded: 200, createdAt: '2024-01-01T00:00:00.000Z' },
    ]
    expect(computeSkillXp(events)).toEqual({})
  })
})

describe('computeSkillImpacts', () => {
  it('returns empty object for unknown slug', () => {
    expect(computeSkillImpacts('unknown-slug', 100)).toEqual({})
  })

  it('distributes XP by weight for thomas-kilmann', () => {
    const impacts = computeSkillImpacts('thomas-kilmann', 100)
    expect(impacts.conflict).toBe(70)
    expect(impacts.communication).toBe(20)
    expect(impacts.leadership).toBe(10)
  })

  it('rounds XP values', () => {
    const impacts = computeSkillImpacts('thomas-kilmann', 125)
    // conflict: 125 * 0.7 = 87.5 → 88
    expect(impacts.conflict).toBe(88)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/gamification/mastery.test.ts`
Expected: FAIL — "Cannot find module './mastery'"

- [ ] **Step 3: Implement mastery.ts**

```ts
// src/features/gamification/mastery.ts
import type { MasteryLevel, SkillArea, GamificationEvent } from './types'
import { MASTERY_THRESHOLDS } from './rules'
import { CONTENT_SKILL_MAP } from './skill-map'

export function getMasteryLevel(xp: number): MasteryLevel {
  const ordered: MasteryLevel[] = ['transmission', 'field_application', 'proficiency', 'practice', 'discovery']
  for (const level of ordered) {
    if (xp >= MASTERY_THRESHOLDS[level]) return level
  }
  return 'discovery'
}

export function computeSkillXp(events: GamificationEvent[]): Partial<Record<SkillArea, number>> {
  const result: Partial<Record<SkillArea, number>> = {}
  for (const event of events) {
    if (!event.skillImpacts) continue
    for (const [skill, xp] of Object.entries(event.skillImpacts)) {
      const s = skill as SkillArea
      result[s] = (result[s] ?? 0) + (xp ?? 0)
    }
  }
  return result
}

export function computeSkillImpacts(
  contentSlug: string,
  xpAwarded: number
): Partial<Record<SkillArea, number>> {
  const contributions = CONTENT_SKILL_MAP[contentSlug]
  if (!contributions) return {}
  const impacts: Partial<Record<SkillArea, number>> = {}
  for (const { skill, weight } of contributions) {
    impacts[skill] = Math.round(xpAwarded * weight)
  }
  return impacts
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/gamification/mastery.test.ts`
Expected: all 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/gamification/mastery.ts src/features/gamification/mastery.test.ts
git commit -m "feat(gamification): add mastery level computation and skill XP helpers"
```

---

## Task 5: Challenges

**Files:**
- Create: `src/features/gamification/challenges.ts`
- Create: `src/features/gamification/challenges.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/gamification/challenges.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getActiveChallenge, isChallengeCompletedBy, WEEKLY_CHALLENGES } from './challenges'
import type { GamificationEvent, Artifact } from './types'

afterEach(() => {
  vi.useRealTimers()
})

describe('getActiveChallenge', () => {
  it('returns a WeeklyChallenge', () => {
    const challenge = getActiveChallenge()
    expect(challenge).toHaveProperty('id')
    expect(challenge).toHaveProperty('xpReward')
    expect(challenge).toHaveProperty('criteria')
  })

  it('rotates weekly — week 0 and week 1 differ when there are at least 2 challenges', () => {
    // Week 0: epoch (1970-01-01)
    vi.setSystemTime(new Date(0))
    const week0 = getActiveChallenge()

    // Week 1: 7 days later
    vi.setSystemTime(new Date(7 * 24 * 60 * 60 * 1000))
    const week1 = getActiveChallenge()

    expect(week0.id).not.toBe(week1.id)
  })

  it('wraps around after all challenges have been shown', () => {
    vi.setSystemTime(new Date(0))
    const first = getActiveChallenge()

    // Advance by total number of challenges * 7 days
    vi.setSystemTime(new Date(WEEKLY_CHALLENGES.length * 7 * 24 * 60 * 60 * 1000))
    const wrapped = getActiveChallenge()

    expect(first.id).toBe(wrapped.id)
  })
})

describe('isChallengeCompletedBy — complete_content', () => {
  const challenge = WEEKLY_CHALLENGES.find(c => c.criteria.type === 'complete_content')!

  it('returns false when content not completed', () => {
    expect(isChallengeCompletedBy(challenge, [], [])).toBe(false)
  })

  it('returns true when content is completed', () => {
    const slug = (challenge.criteria as { type: 'complete_content'; contentSlug: string }).contentSlug
    const events: GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: slug,
      xpAwarded: 100, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(true)
  })
})

describe('isChallengeCompletedBy — complete_skill_activities', () => {
  const challenge = WEEKLY_CHALLENGES.find(c => c.criteria.type === 'complete_skill_activities')!

  it('returns false when fewer than required activities completed', () => {
    const events: GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'troika-consulting',
      xpAwarded: 100, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(false)
  })

  it('returns true when enough skill activities completed', () => {
    const events: GamificationEvent[] = [
      { id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'troika-consulting', xpAwarded: 100, createdAt: new Date().toISOString() },
      { id: '2', type: 'WORKSHOP_COMPLETED', contentSlug: 'facilitation-canvas', xpAwarded: 100, createdAt: new Date().toISOString() },
    ]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/gamification/challenges.test.ts`
Expected: FAIL — "Cannot find module './challenges'"

- [ ] **Step 3: Implement challenges.ts**

```ts
// src/features/gamification/challenges.ts
import type { WeeklyChallenge, GamificationEvent, Artifact } from './types'
import { CONTENT_SKILL_MAP } from './skill-map'

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'challenge-sbi-feedback',
    title: 'Formuler un feedback utile',
    description: "Complète l'atelier SBI et crée un feedback exploitable.",
    skillArea: 'feedback',
    criteria: { type: 'complete_content', contentSlug: 'sbi' },
    xpReward: 150,
  },
  {
    id: 'challenge-5-whys',
    title: 'Trouver une cause racine',
    description: "Réalise un 5 Whys sur un irritant d'équipe.",
    skillArea: 'problem_solving',
    criteria: { type: 'create_artifact', artifactType: 'five_whys' },
    xpReward: 150,
  },
  {
    id: 'challenge-facilitation',
    title: 'Faciliter une décision',
    description: 'Complète deux activités de facilitation cette semaine.',
    skillArea: 'facilitation',
    criteria: { type: 'complete_skill_activities', skillArea: 'facilitation', count: 2 },
    xpReward: 200,
  },
]

export function getActiveChallenge(): WeeklyChallenge {
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return WEEKLY_CHALLENGES[weekIndex % WEEKLY_CHALLENGES.length]
}

export function isChallengeCompletedBy(
  challenge: WeeklyChallenge,
  events: GamificationEvent[],
  artifacts: Artifact[]
): boolean {
  const { criteria } = challenge
  const isCompleted = (e: GamificationEvent) =>
    e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED'

  switch (criteria.type) {
    case 'complete_content':
      return events.some(e => isCompleted(e) && e.contentSlug === criteria.contentSlug)

    case 'create_artifact':
      return artifacts.some(a => a.type === criteria.artifactType)

    case 'complete_skill_activities': {
      const skillSlugs = Object.entries(CONTENT_SKILL_MAP)
        .filter(([, contribs]) => contribs.some(c => c.skill === criteria.skillArea))
        .map(([slug]) => slug)
      const count = events.filter(e => isCompleted(e) && skillSlugs.includes(e.contentSlug ?? '')).length
      return count >= criteria.count
    }

    case 'score_at_least':
      return events.some(e =>
        isCompleted(e) && e.contentSlug === criteria.contentSlug && (e.score ?? 0) >= criteria.score
      )
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/gamification/challenges.test.ts`
Expected: all 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/gamification/challenges.ts src/features/gamification/challenges.test.ts
git commit -m "feat(gamification): add weekly challenges with date-based rotation"
```

---

## Task 6: Badges

**Files:**
- Create: `src/features/gamification/badges.ts`
- Create: `src/features/gamification/badges.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/gamification/badges.test.ts
import { describe, it, expect } from 'vitest'
import { BADGES, checkBadgeCriteria } from './badges'
import type { GamificationEvent, Artifact } from './types'

function makeCompletedEvent(slug: string, score?: number): GamificationEvent {
  return {
    id: crypto.randomUUID(),
    type: 'WORKSHOP_COMPLETED',
    contentSlug: slug,
    xpAwarded: 100,
    score,
    createdAt: new Date().toISOString(),
  }
}

describe('BADGES', () => {
  it('exports 9 badge definitions', () => {
    expect(BADGES).toHaveLength(9)
  })

  it('each badge has a unique id', () => {
    const ids = BADGES.map(b => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('checkBadgeCriteria', () => {
  describe('conflict-mediator badge', () => {
    const badge = BADGES.find(b => b.id === 'conflict-mediator')!

    it('returns false when required content not completed', () => {
      const events = [makeCompletedEvent('thomas-kilmann', 80)]
      expect(checkBadgeCriteria(badge, events, [])).toBe(false)
    })

    it('returns false when all content completed but score too low', () => {
      const events = [
        makeCompletedEvent('thomas-kilmann', 70),
        makeCompletedEvent('ladder-of-inference', 70),
        makeCompletedEvent('nonviolent-communication', 70),
      ]
      expect(checkBadgeCriteria(badge, events, [])).toBe(false)
    })

    it('returns true when all content completed with sufficient average score', () => {
      const events = [
        makeCompletedEvent('thomas-kilmann', 80),
        makeCompletedEvent('ladder-of-inference', 80),
        makeCompletedEvent('nonviolent-communication', 80),
      ]
      expect(checkBadgeCriteria(badge, events, [])).toBe(true)
    })
  })

  describe('feedback-crafter badge', () => {
    const badge = BADGES.find(b => b.id === 'feedback-crafter')!

    it('returns false when content completed but not enough artifacts', () => {
      const events = [
        makeCompletedEvent('sbi'),
        makeCompletedEvent('desc'),
        makeCompletedEvent('feedforward'),
      ]
      const artifacts: Artifact[] = [
        { id: '1', title: 'Test', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {}, createdAt: '', updatedAt: '' },
      ]
      expect(checkBadgeCriteria(badge, events, artifacts)).toBe(false)
    })

    it('returns true when content completed and enough artifacts', () => {
      const events = [
        makeCompletedEvent('sbi'),
        makeCompletedEvent('desc'),
        makeCompletedEvent('feedforward'),
      ]
      const artifacts: Artifact[] = [
        { id: '1', title: 'Test 1', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {}, createdAt: '', updatedAt: '' },
        { id: '2', title: 'Test 2', type: 'desc_message', sourceContentSlug: 'desc', data: {}, createdAt: '', updatedAt: '' },
      ]
      expect(checkBadgeCriteria(badge, events, artifacts)).toBe(true)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/gamification/badges.test.ts`
Expected: FAIL — "Cannot find module './badges'"

- [ ] **Step 3: Implement badges.ts**

```ts
// src/features/gamification/badges.ts
import type { BadgeDefinition, GamificationEvent, Artifact } from './types'

export const BADGES: BadgeDefinition[] = [
  {
    id: 'conflict-mediator',
    name: 'Médiateur en progression',
    description: 'A complété les fondamentaux de la gestion de conflit.',
    skillArea: 'conflict',
    criteria: { completedContent: ['thomas-kilmann', 'ladder-of-inference', 'nonviolent-communication'], minAverageScore: 75 },
  },
  {
    id: 'feedback-crafter',
    name: 'Artisan du feedback',
    description: 'Sait formuler un feedback clair, utile et non jugeant.',
    skillArea: 'feedback',
    criteria: { completedContent: ['sbi', 'desc', 'feedforward'], minArtifactsCreated: 2 },
  },
  {
    id: 'coach-questionneur',
    name: 'Coach questionnant',
    description: 'Développe une posture de coaching fondée sur les questions.',
    skillArea: 'coaching',
    criteria: { completedContent: ['active-listening', 'powerful-questions', 'grow-model', 'ask-vs-tell'], minAverageScore: 75 },
  },
  {
    id: 'facilitateur-structure',
    name: 'Facilitateur structuré',
    description: 'Sait concevoir et animer des ateliers participatifs.',
    skillArea: 'facilitation',
    criteria: { completedContent: ['facilitation-canvas', '1-2-4-all', 'dot-voting', 'lean-coffee'], minArtifactsCreated: 2 },
  },
  {
    id: 'analyste-cause-racine',
    name: 'Analyste cause racine',
    description: "Sait diagnostiquer un problème sans s'arrêter aux symptômes.",
    skillArea: 'problem_solving',
    criteria: { completedContent: ['5-whys', 'ishikawa', 'root-cause-analysis'], minAverageScore: 75 },
  },
  {
    id: 'gardien-securite-psychologique',
    name: 'Gardien de la sécurité psychologique',
    description: "Sait rendre visibles les signaux faibles d'une équipe.",
    skillArea: 'team_health',
    criteria: { completedContent: ['team-health-check', 'psychological-safety', 'working-agreements'], minArtifactsCreated: 2 },
  },
  {
    id: 'cartographe-parties-prenantes',
    name: 'Cartographe des parties prenantes',
    description: "Sait lire et structurer un écosystème d'acteurs.",
    skillArea: 'stakeholder_management',
    criteria: { completedContent: ['stakeholder-mapping', 'empathy-map', 'customer-journey-mapping'], minArtifactsCreated: 2 },
  },
  {
    id: 'strategist-flow',
    name: 'Stratège du flow',
    description: 'Sait analyser un système de travail et identifier les blocages.',
    skillArea: 'flow',
    criteria: { completedContent: ['kanban', 'value-stream-mapping', 'dependency-mapping'], minArtifactsCreated: 2 },
  },
  {
    id: 'leader-sans-autorite',
    name: 'Leader sans autorité',
    description: 'Sait influencer sans imposer.',
    skillArea: 'leadership',
    criteria: { completedContent: ['delegation-poker', 'circle-of-influence', 'situational-leadership'], minAverageScore: 75 },
  },
]

export function checkBadgeCriteria(
  badge: BadgeDefinition,
  events: GamificationEvent[],
  artifacts: Artifact[]
): boolean {
  const { criteria } = badge
  const isCompleted = (e: GamificationEvent) =>
    e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED'

  if (criteria.completedContent) {
    const completedSlugs = new Set(events.filter(isCompleted).map(e => e.contentSlug))
    if (!criteria.completedContent.every(slug => completedSlugs.has(slug))) return false
  }

  if (criteria.minAverageScore !== undefined && criteria.completedContent) {
    const relevant = events.filter(
      e => isCompleted(e) &&
        criteria.completedContent!.includes(e.contentSlug ?? '') &&
        e.score !== undefined
    )
    if (relevant.length === 0) return false
    const avg = relevant.reduce((sum, e) => sum + (e.score ?? 0), 0) / relevant.length
    if (avg < criteria.minAverageScore) return false
  }

  if (criteria.minArtifactsCreated !== undefined) {
    if (artifacts.length < criteria.minArtifactsCreated) return false
  }

  return true
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/gamification/badges.test.ts`
Expected: all 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/gamification/badges.ts src/features/gamification/badges.test.ts
git commit -m "feat(gamification): add 9 MVP badge definitions and criteria checker"
```

---

## Task 7: Learning Paths

**Files:**
- Create: `src/features/gamification/paths.ts`
- Create: `src/features/gamification/paths.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/gamification/paths.test.ts
import { describe, it, expect } from 'vitest'
import { LEARNING_PATHS, computePathProgress } from './paths'

describe('LEARNING_PATHS', () => {
  it('exports 5 learning paths', () => {
    expect(LEARNING_PATHS).toHaveLength(5)
  })

  it('each path has a unique slug', () => {
    const slugs = LEARNING_PATHS.map(p => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('each path has at least one required step', () => {
    for (const path of LEARNING_PATHS) {
      const required = path.steps.filter(s => s.required)
      expect(required.length).toBeGreaterThan(0)
    }
  })
})

describe('computePathProgress', () => {
  const path = LEARNING_PATHS.find(p => p.slug === 'resolution-de-problemes')!
  // steps: 5-whys (req), ishikawa (req), root-cause-analysis (req), problem-solving-quiz (req)

  it('returns no progress when nothing is completed', () => {
    const result = computePathProgress(path, [])
    expect(result.completedSteps).toHaveLength(0)
    expect(result.requiredCompleted).toBe(0)
    expect(result.isComplete).toBe(false)
  })

  it('counts only completed steps', () => {
    const result = computePathProgress(path, ['5-whys', 'ishikawa'])
    expect(result.completedSteps).toHaveLength(2)
    expect(result.requiredCompleted).toBe(2)
    expect(result.isComplete).toBe(false)
  })

  it('marks complete when all required steps done', () => {
    const result = computePathProgress(path, ['5-whys', 'ishikawa', 'root-cause-analysis', 'problem-solving-quiz'])
    expect(result.isComplete).toBe(true)
    expect(result.requiredCompleted).toBe(result.requiredTotal)
  })

  it('handles optional steps correctly', () => {
    const facilitation = LEARNING_PATHS.find(p => p.slug === 'facilitation')!
    // fist-of-five is optional
    const requiredOnly = facilitation.steps.filter(s => s.required).map(s => s.contentSlug)
    const result = computePathProgress(facilitation, requiredOnly)
    expect(result.isComplete).toBe(true)
  })

  it('includes the correct path slug in result', () => {
    const result = computePathProgress(path, [])
    expect(result.slug).toBe('resolution-de-problemes')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/gamification/paths.test.ts`
Expected: FAIL — "Cannot find module './paths'"

- [ ] **Step 3: Implement paths.ts**

```ts
// src/features/gamification/paths.ts
import type { LearningPath, PathProgress } from './types'

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-conflict',
    slug: 'gestion-de-conflit',
    title: 'Gestion de conflit',
    description: 'Maîtrisez les fondamentaux de la gestion constructive des tensions et désaccords.',
    level: 'intermediate',
    skillAreas: ['conflict', 'communication'],
    estimatedMinutes: 60,
    completionBadgeId: 'conflict-mediator',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'thomas-kilmann', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'ladder-of-inference', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'nonviolent-communication', required: true },
      { order: 4, contentType: 'quiz', contentSlug: 'conflict-management-quiz', required: true },
    ],
  },
  {
    id: 'path-facilitation',
    slug: 'facilitation',
    title: 'Facilitation',
    description: 'Apprenez à concevoir et animer des sessions participatives efficaces.',
    level: 'beginner',
    skillAreas: ['facilitation', 'decision_making'],
    estimatedMinutes: 60,
    completionBadgeId: 'facilitateur-structure',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'facilitation-canvas', required: true },
      { order: 2, contentType: 'workshop', contentSlug: '1-2-4-all', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'dot-voting', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'fist-of-five', required: false },
      { order: 5, contentType: 'quiz', contentSlug: 'facilitation-quiz', required: true },
    ],
  },
  {
    id: 'path-coaching',
    slug: 'coaching-scrum-master',
    title: 'Posture de coach',
    description: "Développez une posture de coaching fondée sur les questions et l'écoute.",
    level: 'intermediate',
    skillAreas: ['coaching', 'communication'],
    estimatedMinutes: 75,
    completionBadgeId: 'coach-questionneur',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'active-listening', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'powerful-questions', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'grow-model', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'ask-vs-tell', required: true },
      { order: 5, contentType: 'quiz', contentSlug: 'coaching-quiz', required: true },
    ],
  },
  {
    id: 'path-m30',
    slug: 'management-3-0',
    title: 'Management 3.0',
    description: "Explorez les pratiques de motivation, délégation et amélioration continue Management 3.0.",
    level: 'intermediate',
    skillAreas: ['management_3_0', 'team_health', 'leadership'],
    estimatedMinutes: 60,
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'moving-motivators', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'delegation-poker', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'delegation-board', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'celebration-grid', required: false },
      { order: 5, contentType: 'quiz', contentSlug: 'management-3-0-quiz', required: true },
    ],
  },
  {
    id: 'path-problem-solving',
    slug: 'resolution-de-problemes',
    title: 'Résolution de problèmes',
    description: "Apprenez à diagnostiquer des problèmes complexes en remontant aux causes racines.",
    level: 'beginner',
    skillAreas: ['problem_solving', 'systems_thinking'],
    estimatedMinutes: 45,
    completionBadgeId: 'analyste-cause-racine',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: '5-whys', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'ishikawa', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'root-cause-analysis', required: true },
      { order: 4, contentType: 'quiz', contentSlug: 'problem-solving-quiz', required: true },
    ],
  },
]

export function computePathProgress(
  path: LearningPath,
  completedSlugs: string[]
): PathProgress {
  const completed = new Set(completedSlugs)
  const completedSteps = path.steps.filter(s => completed.has(s.contentSlug)).map(s => s.contentSlug)
  const required = path.steps.filter(s => s.required)
  const requiredCompleted = required.filter(s => completed.has(s.contentSlug)).length
  return {
    slug: path.slug,
    completedSteps,
    requiredTotal: required.length,
    requiredCompleted,
    isComplete: requiredCompleted === required.length,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/gamification/paths.test.ts`
Expected: all 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/gamification/paths.ts src/features/gamification/paths.test.ts
git commit -m "feat(gamification): add 5 learning paths and path progress computation"
```

---

## Task 8: Gamification Store

**Files:**
- Create: `src/features/gamification/gamification.store.ts`
- Create: `src/features/gamification/gamification.store.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/gamification/gamification.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGamificationStore } from './gamification.store'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

describe('recordEvent', () => {
  it('adds an event to the events array', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { events } = useGamificationStore.getState()
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('WORKSHOP_COMPLETED')
  })

  it('awards correct base XP for WORKSHOP_COMPLETED', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(100)
  })

  it('awards HIGH_SCORE_80 bonus when score is 80', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide', score: 80 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(125) // 100 + 25
  })

  it('awards PERFECT_SCORE bonus when score is 100', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide', score: 100 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    expect(main.xpAwarded).toBe(200) // 100 + 100
  })

  it('computes skillImpacts from CONTENT_SKILL_MAP', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 80 })
    const { events } = useGamificationStore.getState()
    const main = events.find(e => e.type === 'WORKSHOP_COMPLETED')!
    // xpAwarded = 125, conflict weight = 0.7 → Math.round(125 * 0.7) = 88
    expect(main.skillImpacts?.conflict).toBe(88)
  })

  it('emits SKILL_LEVEL_UP when mastery level increases', () => {
    // practice threshold is 300 XP in conflict skill
    // thomas-kilmann 100% score = 200 XP * 0.7 conflict = 140 skill XP per event
    // 3 events = 420 skill XP → crosses practice (300)
    for (let i = 0; i < 3; i++) {
      useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 100 })
    }
    const { events } = useGamificationStore.getState()
    const levelUp = events.find(e => e.type === 'SKILL_LEVEL_UP')
    expect(levelUp).toBeDefined()
    expect(levelUp?.metadata?.skill).toBe('conflict')
  })

  it('does not duplicate SKILL_LEVEL_UP for same level', () => {
    for (let i = 0; i < 6; i++) {
      useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann', score: 100 })
    }
    const { events } = useGamificationStore.getState()
    const levelUps = events.filter(e => e.type === 'SKILL_LEVEL_UP' && e.metadata?.skill === 'conflict' && e.metadata?.newLevel === 'practice')
    expect(levelUps).toHaveLength(1)
  })
})

describe('getTotalXp', () => {
  it('returns 0 with no events', () => {
    expect(useGamificationStore.getState().getTotalXp()).toBe(0)
  })

  it('sums all xpAwarded across all events including derived events', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const total = useGamificationStore.getState().getTotalXp()
    expect(total).toBeGreaterThanOrEqual(100)
  })
})

describe('getSkillXp', () => {
  it('returns 0 for a skill with no events', () => {
    expect(useGamificationStore.getState().getSkillXp('conflict')).toBe(0)
  })

  it('returns accumulated skill XP', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'thomas-kilmann' })
    // xp = 100, conflict weight = 0.7 → 70
    expect(useGamificationStore.getState().getSkillXp('conflict')).toBe(70)
  })
})

describe('getCompletedContentSlugs', () => {
  it('returns empty array initially', () => {
    expect(useGamificationStore.getState().getCompletedContentSlugs()).toEqual([])
  })

  it('returns completed workshop slugs', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'sbi' })
    useGamificationStore.getState().recordEvent({ type: 'QUIZ_COMPLETED', contentSlug: 'exam-1' })
    const slugs = useGamificationStore.getState().getCompletedContentSlugs()
    expect(slugs).toContain('sbi')
    expect(slugs).toContain('exam-1')
  })
})

describe('saveArtifact', () => {
  it('adds artifact to artifacts array', () => {
    useGamificationStore.getState().saveArtifact({
      title: 'Test SBI',
      type: 'feedback_sbi',
      sourceContentSlug: 'sbi',
      data: { situation: 'test', behavior: 'test', impact: 'test' },
    })
    const { artifacts } = useGamificationStore.getState()
    expect(artifacts).toHaveLength(1)
    expect(artifacts[0].type).toBe('feedback_sbi')
  })

  it('records an ARTIFACT_CREATED event', () => {
    useGamificationStore.getState().saveArtifact({
      title: 'Test',
      type: 'grow_plan',
      sourceContentSlug: 'grow-model',
      data: {},
    })
    const { events } = useGamificationStore.getState()
    expect(events.some(e => e.type === 'ARTIFACT_CREATED')).toBe(true)
  })

  it('assigns a unique id to each artifact', () => {
    useGamificationStore.getState().saveArtifact({ title: 'A', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {} })
    useGamificationStore.getState().saveArtifact({ title: 'B', type: 'grow_plan', sourceContentSlug: 'grow-model', data: {} })
    const { artifacts } = useGamificationStore.getState()
    expect(artifacts[0].id).not.toBe(artifacts[1].id)
  })
})

describe('deleteArtifact', () => {
  it('removes artifact from artifacts array', () => {
    useGamificationStore.getState().saveArtifact({ title: 'Del', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {} })
    const id = useGamificationStore.getState().artifacts[0].id
    useGamificationStore.getState().deleteArtifact(id)
    expect(useGamificationStore.getState().artifacts).toHaveLength(0)
  })
})

describe('markArtifactExported', () => {
  it('sets exportedAt on the artifact', () => {
    useGamificationStore.getState().saveArtifact({ title: 'Exp', type: 'fishbone_diagram', sourceContentSlug: 'ishikawa', data: {} })
    const id = useGamificationStore.getState().artifacts[0].id
    useGamificationStore.getState().markArtifactExported(id)
    const artifact = useGamificationStore.getState().artifacts[0]
    expect(artifact.exportedAt).toBeDefined()
  })
})

describe('getPathProgress', () => {
  it('returns null for unknown path slug', () => {
    expect(useGamificationStore.getState().getPathProgress('nonexistent')).toBeNull()
  })

  it('returns correct progress after completing path steps', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: '5-whys' })
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'ishikawa' })
    const progress = useGamificationStore.getState().getPathProgress('resolution-de-problemes')
    expect(progress?.requiredCompleted).toBe(2)
    expect(progress?.isComplete).toBe(false)
  })
})

describe('toastQueue', () => {
  it('adds a toast when XP is awarded', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    const { toastQueue } = useGamificationStore.getState()
    expect(toastQueue.length).toBeGreaterThan(0)
    expect(toastQueue[0].type).toBe('xp')
  })

  it('dismissToast removes the first toast', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: 'scrum-guide' })
    useGamificationStore.getState().dismissToast()
    const remaining = useGamificationStore.getState().toastQueue
    // first toast removed
    expect(remaining.every(t => t.type !== 'xp' || remaining.indexOf(t) > 0)).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/gamification/gamification.store.test.ts`
Expected: FAIL — "Cannot find module './gamification.store'"

- [ ] **Step 3: Implement gamification.store.ts**

```ts
// src/features/gamification/gamification.store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GamificationEvent, GamificationToastPayload, Artifact,
  SkillArea, MasteryLevel, PathProgress, WeeklyChallenge, RecordEventInput,
} from './types'
import { XP_RULES, XP_BONUSES } from './rules'
import { computeSkillImpacts, computeSkillXp, getMasteryLevel } from './mastery'
import { BADGES, checkBadgeCriteria } from './badges'
import { LEARNING_PATHS, computePathProgress } from './paths'
import { WEEKLY_CHALLENGES, getActiveChallenge as getActiveChallengeData, isChallengeCompletedBy } from './challenges'

interface GamificationStore {
  events: GamificationEvent[]
  artifacts: Artifact[]
  toastQueue: GamificationToastPayload[]

  recordEvent(input: RecordEventInput): void
  saveArtifact(input: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): void
  deleteArtifact(id: string): void
  markArtifactExported(id: string): void
  dismissToast(): void

  getTotalXp(): number
  getSkillXp(skill: SkillArea): number
  getMasteryLevelForSkill(skill: SkillArea): MasteryLevel
  getAllSkillXp(): Partial<Record<SkillArea, number>>
  getUnlockedBadgeIds(): string[]
  getPathProgress(slug: string): PathProgress | null
  getCompletedContentSlugs(): string[]
  getActiveChallenge(): WeeklyChallenge | null
  isChallengeCompleted(id: string): boolean
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      events: [],
      artifacts: [],
      toastQueue: [],

      recordEvent(input: RecordEventInput) {
        const state = get()
        const baseXp = XP_RULES[input.type] ?? 0

        let bonusXp = 0
        if (input.score !== undefined) {
          if (input.score === 100) bonusXp += XP_BONUSES.PERFECT_SCORE
          else if (input.score >= 90) bonusXp += XP_BONUSES.HIGH_SCORE_90
          else if (input.score >= 80) bonusXp += XP_BONUSES.HIGH_SCORE_80
        }
        if (input.type === 'ARTIFACT_CREATED' && state.artifacts.length === 1) {
          bonusXp += XP_BONUSES.FIRST_ARTIFACT
        }

        const xpAwarded = baseXp + bonusXp
        const skillImpacts = input.contentSlug ? computeSkillImpacts(input.contentSlug, xpAwarded) : undefined

        const event: GamificationEvent = {
          id: crypto.randomUUID(),
          type: input.type,
          contentSlug: input.contentSlug,
          contentType: input.contentType,
          xpAwarded,
          skillImpacts: skillImpacts && Object.keys(skillImpacts).length > 0 ? skillImpacts : undefined,
          score: input.score,
          metadata: input.metadata,
          createdAt: new Date().toISOString(),
        }

        const toastQueue = [...state.toastQueue]
        if (xpAwarded > 0) {
          toastQueue.push({ type: 'xp', message: `+${xpAwarded} XP`, xp: xpAwarded })
        }

        const newEvents = [...state.events, event]
        const derivedEvents: GamificationEvent[] = []

        // mastery level-ups
        const oldSkillXp = computeSkillXp(state.events)
        const newSkillXp = computeSkillXp(newEvents)
        for (const [skill, newXp] of Object.entries(newSkillXp) as [SkillArea, number][]) {
          const oldXp = oldSkillXp[skill] ?? 0
          if (getMasteryLevel(oldXp) !== getMasteryLevel(newXp)) {
            const newLevel = getMasteryLevel(newXp)
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'SKILL_LEVEL_UP',
              xpAwarded: XP_RULES.SKILL_LEVEL_UP,
              metadata: { skill, newLevel },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'level_up', message: `Niveau atteint : ${newLevel}`, detail: skill })
          }
        }

        // badge unlocks
        const alreadyUnlockedIds = new Set(
          state.events
            .filter(e => e.type === 'BADGE_UNLOCKED')
            .map(e => e.metadata?.badgeId as string)
        )
        const allEventsForBadge = [...newEvents, ...derivedEvents]
        for (const badge of BADGES) {
          if (alreadyUnlockedIds.has(badge.id)) continue
          if (checkBadgeCriteria(badge, allEventsForBadge, state.artifacts)) {
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'BADGE_UNLOCKED',
              xpAwarded: XP_RULES.BADGE_UNLOCKED,
              metadata: { badgeId: badge.id },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'badge', message: `Badge débloqué : ${badge.name}`, detail: badge.description })
          }
        }

        // challenge completion
        const activeChallenge = getActiveChallengeData()
        const allEvents = [...newEvents, ...derivedEvents]
        const alreadyChallengeCompleted = state.events.some(
          e => e.type === 'CHALLENGE_COMPLETED' && e.metadata?.challengeId === activeChallenge.id
        )
        if (!alreadyChallengeCompleted && isChallengeCompletedBy(activeChallenge, allEvents, state.artifacts)) {
          derivedEvents.push({
            id: crypto.randomUUID(),
            type: 'CHALLENGE_COMPLETED',
            xpAwarded: activeChallenge.xpReward,
            metadata: { challengeId: activeChallenge.id },
            createdAt: new Date().toISOString(),
          })
          toastQueue.push({ type: 'challenge_complete', message: `Défi complété : ${activeChallenge.title}`, xp: activeChallenge.xpReward })
        }

        // path completion
        const finalEvents = [...newEvents, ...derivedEvents]
        const completedSlugs = finalEvents
          .filter(e => e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED')
          .map(e => e.contentSlug)
          .filter((s): s is string => Boolean(s))
        for (const path of LEARNING_PATHS) {
          const already = state.events.some(e => e.type === 'PATH_COMPLETED' && e.metadata?.pathSlug === path.slug)
          if (already) continue
          if (computePathProgress(path, completedSlugs).isComplete) {
            derivedEvents.push({
              id: crypto.randomUUID(),
              type: 'PATH_COMPLETED',
              xpAwarded: XP_RULES.PATH_COMPLETED,
              metadata: { pathSlug: path.slug },
              createdAt: new Date().toISOString(),
            })
            toastQueue.push({ type: 'path_complete', message: `Parcours terminé : ${path.title}`, xp: XP_RULES.PATH_COMPLETED })
          }
        }

        set({ events: [...newEvents, ...derivedEvents], toastQueue })
      },

      saveArtifact(input) {
        const artifact: Artifact = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({ artifacts: [...state.artifacts, artifact] }))
        get().recordEvent({
          type: 'ARTIFACT_CREATED',
          contentSlug: input.sourceContentSlug,
          metadata: { artifactId: artifact.id },
        })
      },

      deleteArtifact(id: string) {
        set(state => ({ artifacts: state.artifacts.filter(a => a.id !== id) }))
      },

      markArtifactExported(id: string) {
        const now = new Date().toISOString()
        set(state => ({
          artifacts: state.artifacts.map(a => a.id === id ? { ...a, exportedAt: now } : a),
        }))
        get().recordEvent({ type: 'ARTIFACT_EXPORTED' })
      },

      dismissToast() {
        set(state => ({ toastQueue: state.toastQueue.slice(1) }))
      },

      getTotalXp() {
        return get().events.reduce((sum, e) => sum + e.xpAwarded, 0)
      },

      getSkillXp(skill: SkillArea) {
        return computeSkillXp(get().events)[skill] ?? 0
      },

      getMasteryLevelForSkill(skill: SkillArea) {
        return getMasteryLevel(get().getSkillXp(skill))
      },

      getAllSkillXp() {
        return computeSkillXp(get().events)
      },

      getUnlockedBadgeIds() {
        return get().events
          .filter(e => e.type === 'BADGE_UNLOCKED')
          .map(e => e.metadata?.badgeId as string)
          .filter(Boolean)
      },

      getPathProgress(slug: string) {
        const path = LEARNING_PATHS.find(p => p.slug === slug)
        if (!path) return null
        return computePathProgress(path, get().getCompletedContentSlugs())
      },

      getCompletedContentSlugs() {
        return get().events
          .filter(e => e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED')
          .map(e => e.contentSlug)
          .filter((s): s is string => Boolean(s))
      },

      getActiveChallenge() {
        return getActiveChallengeData()
      },

      isChallengeCompleted(id: string) {
        return get().events.some(
          e => e.type === 'CHALLENGE_COMPLETED' && e.metadata?.challengeId === id
        )
      },
    }),
    {
      name: 'scrum-master-gamification',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/gamification/gamification.store.test.ts`
Expected: all 19 tests PASS

- [ ] **Step 5: Run the full test suite to verify no regressions**

Run: `npx vitest run`
Expected: 276 existing tests + new gamification tests, all PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/gamification/gamification.store.ts src/features/gamification/gamification.store.test.ts
git commit -m "feat(gamification): add Zustand store with event log, skill XP, badges, paths, challenges"
```

---

## Task 9: Index + Final Verification

**Files:**
- Create: `src/features/gamification/index.ts`

- [ ] **Step 1: Create the index file**

```ts
// src/features/gamification/index.ts
export type {
  SkillArea, MasteryLevel, GamificationEventType, GamificationEvent,
  ArtifactType, Artifact, SkillContribution, BadgeCriteria, BadgeDefinition,
  LearningPath, LearningPathStep, PathProgress,
  WeeklyChallenge, GamificationToastPayload, RecordEventInput,
} from './types'

export { XP_RULES, XP_BONUSES, MASTERY_THRESHOLDS, MASTERY_LABELS } from './rules'
export { CONTENT_SKILL_MAP } from './skill-map'
export { getMasteryLevel, computeSkillXp, computeSkillImpacts } from './mastery'
export { BADGES, checkBadgeCriteria } from './badges'
export { LEARNING_PATHS, computePathProgress } from './paths'
export { WEEKLY_CHALLENGES, getActiveChallenge, isChallengeCompletedBy } from './challenges'
export { useGamificationStore } from './gamification.store'
```

- [ ] **Step 2: Verify TypeScript compiles without errors**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Run the full test suite one final time**

Run: `npx vitest run`
Expected: all tests PASS (276 existing + ~50 new gamification tests)

- [ ] **Step 4: Commit**

```bash
git add src/features/gamification/index.ts
git commit -m "feat(gamification): add public index — Phase 1 engine complete"
```

---

## Self-Review Checklist

### Spec coverage

| Requirement | Task |
|-------------|------|
| 19 SkillArea types | Task 1 |
| 5 MasteryLevel types | Task 1 |
| 11 GamificationEventType | Task 1 |
| 15 ArtifactType | Task 1 |
| XP_RULES, XP_BONUSES, MASTERY_THRESHOLDS | Task 2 |
| CONTENT_SKILL_MAP ≥ 20 content entries | Task 3 |
| getMasteryLevel() | Task 4 |
| computeSkillXp() | Task 4 |
| computeSkillImpacts() | Task 4 |
| WEEKLY_CHALLENGES (3) + getActiveChallenge() | Task 5 |
| isChallengeCompletedBy() (4 criteria types) | Task 5 |
| BADGES (9) + checkBadgeCriteria() | Task 6 |
| LEARNING_PATHS (5) + computePathProgress() | Task 7 |
| Zustand store with persist (localStorage) | Task 8 |
| recordEvent with XP, bonus, skill impacts, level-up, badge, challenge, path | Task 8 |
| saveArtifact / deleteArtifact / markArtifactExported | Task 8 |
| toastQueue / dismissToast | Task 8 |
| All computed selectors | Task 8 |
| Public index | Task 9 |

### No regressions
The 276 existing tests must still pass after Task 9.
