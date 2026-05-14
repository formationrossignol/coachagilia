# Gamification Phase 3 — Integrations Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Wire the Phase 1 engine (store + events) into every live content point: 12 workshop ateliers emit `WORKSHOP_COMPLETED`, 3 quizzes emit `QUIZ_COMPLETED`, the ateliers portal shows completion status on every card, and an admin panel lets users reset their gamification state.

**Notifications come for free:** `recordEvent` already pushes XP/badge/level toasts to `toastQueue`; once events fire, the `GamificationToast` component (already in the Layout) handles display automatically.

**Tech stack:** Same as Phases 1–2 — React 19, TypeScript, Zustand 5, Vitest + Testing Library. No new dependencies.

---

## Slug Reference

| Component file | CONTENT_SKILL_MAP slug |
|---|---|
| `ScrumGuideAtelier` | `scrum-guide` |
| `ConflictAtelier` | `thomas-kilmann` |
| `DelegationPokerAtelier` | `delegation-poker` |
| `GrowModelAtelier` | `grow-model` |
| `StakeholderMappingAtelier` | `stakeholder-mapping` |
| `AskTellAtelier` | `ask-vs-tell` |
| `MovingMotivatorsAtelier` | `moving-motivators` |
| `IshikawaAtelier` | `ishikawa` |
| `TroikaConsultingAtelier` | `troika-consulting` |
| `SBIAtelier` | `sbi` |
| `TRIZAtelier` | `triz` |
| `CynefinFrameworkAtelier` | `cynefin-framework` |

---

## Final verify function per atelier

| Atelier | Phases | Final verify |
|---|---|---|
| `ScrumGuideAtelier` | 1 | `handleVerify` |
| `ConflictAtelier` | 2 | `handleVerifyPhase2` |
| `GrowModelAtelier` | 2 | `handleVerifyPhase2` |
| `DelegationPokerAtelier` | 2 | `handleVerifyPhase2` |
| `StakeholderMappingAtelier` | 2 | `handleVerifyPhase2` |
| `AskTellAtelier` | 3 | `handleVerifyPhase3` |
| `MovingMotivatorsAtelier` | 3 | button onClick → `setPhase3Verified(true)` |
| `IshikawaAtelier` | 3 | button onClick → `setPhase3Verified(true)` |
| `TroikaConsultingAtelier` | 3 | `verifyPhase3` |
| `SBIAtelier` | 3 | `verifyPhase3` |
| `TRIZAtelier` | 4 | `verifyPhase4` |
| `CynefinFrameworkAtelier` | 3 | `verifyPhase3` |

---

## Task 1: `useWorkshopCompletion` hook

**Files:**
- Create: `src/hooks/useWorkshopCompletion.ts`
- Create: `src/hooks/useWorkshopCompletion.test.ts`

### Step 1 — Failing tests

```ts
// src/hooks/useWorkshopCompletion.test.ts
import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGamificationStore } from '../features/gamification'
import { useWorkshopCompletion } from './useWorkshopCompletion'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

describe('useWorkshopCompletion', () => {
  it('fires WORKSHOP_STARTED on mount if not already started', () => {
    renderHook(() => useWorkshopCompletion('sbi'))
    const events = useGamificationStore.getState().events
    expect(events.some(e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === 'sbi')).toBe(true)
  })

  it('does not fire WORKSHOP_STARTED twice for the same slug', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_STARTED', contentSlug: 'sbi' })
    renderHook(() => useWorkshopCompletion('sbi'))
    const startEvents = useGamificationStore.getState().events.filter(
      e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === 'sbi'
    )
    expect(startEvents).toHaveLength(1)
  })

  it('markComplete fires WORKSHOP_COMPLETED', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    act(() => { result.current.markComplete() })
    const events = useGamificationStore.getState().events
    expect(events.some(e => e.type === 'WORKSHOP_COMPLETED' && e.contentSlug === 'sbi')).toBe(true)
  })

  it('markComplete does not fire twice for the same slug', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    act(() => { result.current.markComplete() })
    act(() => { result.current.markComplete() })
    const completedEvents = useGamificationStore.getState().events.filter(
      e => e.type === 'WORKSHOP_COMPLETED' && e.contentSlug === 'sbi'
    )
    expect(completedEvents).toHaveLength(1)
  })

  it('isCompleted is false initially and true after markComplete', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    expect(result.current.isCompleted).toBe(false)
    act(() => { result.current.markComplete() })
    expect(result.current.isCompleted).toBe(true)
  })
})
```

Run: `npx vitest run src/hooks/useWorkshopCompletion.test.ts`
Expected: FAIL

### Step 2 — Implement

```ts
// src/hooks/useWorkshopCompletion.ts
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../features/gamification'

export function useWorkshopCompletion(slug: string) {
  const recordEvent = useGamificationStore(s => s.recordEvent)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))
  const isCompleted = completedSlugs.includes(slug)

  useEffect(() => {
    const { events, recordEvent: rec } = useGamificationStore.getState()
    const hasStarted = events.some(e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === slug)
    if (!hasStarted) rec({ type: 'WORKSHOP_STARTED', contentSlug: slug })
  }, [slug])

  function markComplete() {
    if (!useGamificationStore.getState().getCompletedContentSlugs().includes(slug)) {
      recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: slug })
    }
  }

  return { isCompleted, markComplete }
}
```

### Step 3 — Verify tests pass

Run: `npx vitest run src/hooks/useWorkshopCompletion.test.ts`
Expected: all 5 tests PASS

### Step 4 — Full suite (no regressions)

Run: `npx vitest run`
Expected: all existing tests PASS

### Step 5 — Commit

```bash
git add src/hooks/useWorkshopCompletion.ts src/hooks/useWorkshopCompletion.test.ts
git commit -m "feat(gamification): add useWorkshopCompletion hook (WORKSHOP_STARTED + WORKSHOP_COMPLETED)"
```

---

## Task 2: Quiz completion integration

**Files:**
- Modify: `src/components/QuizResults/index.tsx`
- Modify: `src/components/QuizResults/QuizResults.test.tsx`

### Step 1 — Read existing test and component

Read both files before making changes.

### Step 2 — Failing test

Add a test to `QuizResults.test.tsx` that verifies `QUIZ_COMPLETED` fires with the right slug and score when the component mounts with a submitted quiz.

Pattern (add to existing describe block):
```ts
it('fires QUIZ_COMPLETED with score on mount', async () => {
  // Mock useQuizStore to return a submitted state with pct=80
  // Verify useGamificationStore receives recordEvent call with
  //   type: 'QUIZ_COMPLETED', contentSlug: 'exam-1', score: 80
})
```

Adjust the test to fit the existing mock pattern in the test file.

### Step 3 — Implement

In `QuizResults/index.tsx`:

1. Import `useGamificationStore` and `useShallow` from their packages.
2. Inside `QuizResults`:
   ```tsx
   const recordEvent = useGamificationStore(s => s.recordEvent)
   const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

   useEffect(() => {
     if (!exam || !submittedAt || !examId) return
     if (completedSlugs.includes(examId)) return
     recordEvent({ type: 'QUIZ_COMPLETED', contentSlug: examId, score: pct })
   }, [submittedAt])
   ```

   Place the `useEffect` after the `pct` and `passed` derivations.

### Step 4 — Verify tests pass

Run: `npx vitest run src/components/QuizResults/`
Expected: all tests PASS

### Step 5 — Full suite

Run: `npx vitest run`
Expected: all tests PASS

### Step 6 — Commit

```bash
git add src/components/QuizResults/index.tsx src/components/QuizResults/QuizResults.test.tsx
git commit -m "feat(gamification): record QUIZ_COMPLETED with score on quiz submission"
```

---

## Task 3: Portail — completion indicators

**Files:**
- Modify: `src/components/WorkshopCard/index.tsx`
- Modify: `src/components/AteliersHome/index.tsx`
- Modify: `src/components/WorkshopCategoryPage/index.tsx`

No new test files required — verify with existing tests + visual check.

### Step 1 — Read files

Read all three files before modifying.

### Step 2 — WorkshopCard

Add `isCompleted?: boolean` to the `Props` interface.

In the non-`comingSoon` return, add a completion indicator:
- When `isCompleted` is true: show a `<span className="workshop-card__completed">✓ Complété</span>` tag in the header (next to the duration badge).
- Change the CTA link text from `Lancer →` to `Revoir →` when completed.

Add to `gamification.css` (or the workshop card's existing CSS) — but since the gamification CSS file already exists, add `.workshop-card__completed` there:
```css
.workshop-card__completed {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-success, #22c55e);
  background: color-mix(in srgb, var(--color-success, #22c55e) 12%, transparent);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
}
```

### Step 3 — AteliersHome

In `AteliersHome/index.tsx`:

1. Import `useGamificationStore` and `useShallow`.
2. Add: `const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))`
3. Pass `isCompleted={completedSlugs.includes(w.slug)}` to each `<WorkshopCard>`.

### Step 4 — WorkshopCategoryPage

Same as AteliersHome:
1. Import store + `useShallow`.
2. Add `completedSlugs` selector.
3. Pass `isCompleted` to `<WorkshopCard>`.

### Step 5 — Verify no regressions

Run: `npx vitest run`
Expected: all tests PASS

### Step 6 — Commit

```bash
git add src/components/WorkshopCard/index.tsx \
        src/components/AteliersHome/index.tsx \
        src/components/WorkshopCategoryPage/index.tsx \
        src/components/gamification/gamification.css
git commit -m "feat(gamification): show completion status on workshop cards"
```

---

## Task 4: Atelier integrations (12 ateliers)

**Files modified (one call each):**
- `src/components/ScrumGuideAtelier/index.tsx`
- `src/components/ConflictAtelier/index.tsx`
- `src/components/GrowModelAtelier/index.tsx`
- `src/components/DelegationPokerAtelier/index.tsx`
- `src/components/StakeholderMappingAtelier/index.tsx`
- `src/components/AskTellAtelier/index.tsx`
- `src/components/MovingMotivatorsAtelier/index.tsx`
- `src/components/IshikawaAtelier/index.tsx`
- `src/components/TroikaConsultingAtelier/index.tsx`
- `src/components/SBIAtelier/index.tsx`
- `src/components/TRIZAtelier/index.tsx`
- `src/components/CynefinFrameworkAtelier/index.tsx`

### Step 1 — Read all 12 files

Read each file before modifying.

### Step 2 — Apply the hook to each atelier

For each atelier:

1. Add import at the top:
   ```tsx
   import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
   ```

2. Inside the component function, add:
   ```tsx
   const { markComplete } = useWorkshopCompletion('<slug>')
   ```
   Replace `<slug>` with the correct value from the slug reference table above.

3. Call `markComplete()` inside the **final verify function** (per the table above):
   - For `function verify*() { ... }` style: add `markComplete()` at the START of the function body.
   - For `MovingMotivatorsAtelier` and `IshikawaAtelier` where phase 3 uses `onClick={() => setPhase3Verified(true)}`: wrap in an inline function:
     ```tsx
     onClick={() => { setPhase3Verified(true); markComplete() }}
     ```

### Step 3 — Run the full test suite

Run: `npx vitest run`
Expected: all tests PASS

Note: Since each atelier has tests, verify they still pass after the hook is added. The hook itself has no side effects that would break existing tests (the store is not mocked in atelier tests — if it is, the `useWorkshopCompletion` import may need to be mocked too; handle any test failures by adding the mock).

### Step 4 — Commit

```bash
git add src/components/ScrumGuideAtelier/index.tsx \
        src/components/ConflictAtelier/index.tsx \
        src/components/GrowModelAtelier/index.tsx \
        src/components/DelegationPokerAtelier/index.tsx \
        src/components/StakeholderMappingAtelier/index.tsx \
        src/components/AskTellAtelier/index.tsx \
        src/components/MovingMotivatorsAtelier/index.tsx \
        src/components/IshikawaAtelier/index.tsx \
        src/components/TroikaConsultingAtelier/index.tsx \
        src/components/SBIAtelier/index.tsx \
        src/components/TRIZAtelier/index.tsx \
        src/components/CynefinFrameworkAtelier/index.tsx
git commit -m "feat(gamification): integrate WORKSHOP_COMPLETED into all 12 active ateliers"
```

---

## Task 5: Admin reset panel

**Files:**
- Create: `src/pages/AdminPage.tsx`
- Create: `src/pages/AdminPage.test.tsx`
- Modify: `src/App.tsx`

### Step 1 — Failing test

```ts
// src/pages/AdminPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useGamificationStore } from '../features/gamification'
import { AdminPage } from './AdminPage'

vi.mock('../features/gamification', () => ({
  useGamificationStore: vi.fn(),
}))

beforeEach(() => {
  vi.mocked(useGamificationStore).mockImplementation((selector: (s: any) => any) =>
    selector({
      events: [{ id: '1', type: 'WORKSHOP_COMPLETED', xpAwarded: 100, createdAt: '2024-01-01T00:00:00Z' }],
      artifacts: [],
      getTotalXp: () => 100,
      getUnlockedBadgeIds: () => [],
      getCompletedContentSlugs: () => ['sbi'],
    })
  )
})

function render2() {
  return render(<MemoryRouter><AdminPage /></MemoryRouter>)
}

describe('AdminPage', () => {
  it('renders the page title', () => {
    render2()
    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument()
  })

  it('displays total XP', () => {
    render2()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('has a reset button', () => {
    render2()
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('calls setState and clears localStorage on reset click with confirmation', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const setStateSpy = vi.fn()
    vi.spyOn(useGamificationStore as any, 'setState').mockImplementation(setStateSpy)
    render2()
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }))
    expect(setStateSpy).toHaveBeenCalledWith({ events: [], artifacts: [], toastQueue: [] }, true)
  })

  it('does not reset when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const setStateSpy = vi.fn()
    vi.spyOn(useGamificationStore as any, 'setState').mockImplementation(setStateSpy)
    render2()
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }))
    expect(setStateSpy).not.toHaveBeenCalled()
  })
})
```

### Step 2 — Implement AdminPage

```tsx
// src/pages/AdminPage.tsx
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../features/gamification'

export function AdminPage() {
  const totalXp = useGamificationStore(s => s.getTotalXp())
  const eventCount = useGamificationStore(s => s.events.length)
  const artifactCount = useGamificationStore(s => s.artifacts.length)
  const completedCount = useGamificationStore(useShallow(s => s.getCompletedContentSlugs())).length
  const badgeCount = useGamificationStore(useShallow(s => s.getUnlockedBadgeIds())).length

  function handleReset() {
    if (!window.confirm('Réinitialiser toute la progression gamification ? Cette action est irréversible.')) return
    localStorage.removeItem('scrum-master-gamification')
    useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Admin — Gamification</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <tbody>
          <tr><td>XP total</td><td><strong>{totalXp}</strong></td></tr>
          <tr><td>Événements enregistrés</td><td><strong>{eventCount}</strong></td></tr>
          <tr><td>Contenus complétés</td><td><strong>{completedCount}</strong></td></tr>
          <tr><td>Badges débloqués</td><td><strong>{badgeCount}</strong></td></tr>
          <tr><td>Artefacts créés</td><td><strong>{artifactCount}</strong></td></tr>
        </tbody>
      </table>
      <button className="btn btn--danger" onClick={handleReset}>
        Réinitialiser la progression
      </button>
    </div>
  )
}
```

### Step 3 — Add route in App.tsx

In `src/App.tsx`:
1. Add import: `import { AdminPage } from './pages/AdminPage'`
2. Add route: `{ path: '/admin', element: <AdminPage /> }`

The `/admin` route is not linked from the NavBar — it is only accessible by direct URL.

### Step 4 — Verify tests pass

Run: `npx vitest run src/pages/AdminPage.test.tsx`
Expected: all 5 tests PASS

### Step 5 — Full suite

Run: `npx vitest run`
Expected: all tests PASS

### Step 6 — Commit

```bash
git add src/pages/AdminPage.tsx src/pages/AdminPage.test.tsx src/App.tsx
git commit -m "feat(gamification): add /admin reset panel with progress stats"
```

---

## Self-Review Checklist

| Requirement | Task |
|---|---|
| `useWorkshopCompletion` hook with STARTED + COMPLETED dedup | Task 1 |
| QUIZ_COMPLETED with score on quiz submission | Task 2 |
| WorkshopCard shows ✓ when slug is in completedSlugs | Task 3 |
| AteliersHome + CategoryPage pass isCompleted down | Task 3 |
| All 12 ateliers call markComplete on final verify | Task 4 |
| No duplicate WORKSHOP_COMPLETED events | Tasks 1+4 |
| Admin page at /admin with reset button | Task 5 |
| Reset clears localStorage + store state | Task 5 |
| All existing tests still pass | Every task |
