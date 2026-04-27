# Exit Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a confirmation modal when a user tries to navigate away from an atelier or simulation scenario they have started, reusing the same pattern already in place for the quiz.

**Architecture:** A shared `useExitGuard(isDirty)` hook encapsulates `useBlocker` + modal state. A shared `ConfirmLeaveModal` component renders using existing `.modal*` CSS classes. Each consumer computes a boolean `isDirty` from its own local state and passes it to the hook. QuizScreen is refactored to use these shared artefacts instead of its current inline duplication.

**Tech Stack:** React 18, React Router v6 (`useBlocker`), Vitest, React Testing Library, lucide-react, TypeScript.

**Spec:** `docs/superpowers/specs/2026-04-27-exit-confirmation-design.md`

---

## File Map

| File | Action |
|---|---|
| `src/hooks/useExitGuard.ts` | Create — hook wrapping `useBlocker` |
| `src/hooks/useExitGuard.test.tsx` | Create — unit tests for the hook |
| `src/components/ui/ConfirmLeaveModal.tsx` | Create — shared modal component |
| `src/components/ui/ConfirmLeaveModal.test.tsx` | Create — unit tests for the modal |
| `src/components/QuizScreen/index.tsx` | Modify — replace inline blocker logic with hook + component |
| `src/components/SimulationScreen/index.tsx` | Modify — add isDirty + hook + modal |
| `src/components/ScrumGuideAtelier/index.tsx` | Modify — add isDirty + hook + modal |
| `src/components/ConflictAtelier/index.tsx` | Modify |
| `src/components/DelegationPokerAtelier/index.tsx` | Modify |
| `src/components/GrowModelAtelier/index.tsx` | Modify |
| `src/components/StakeholderMappingAtelier/index.tsx` | Modify |
| `src/components/AskTellAtelier/index.tsx` | Modify |
| `src/components/MovingMotivatorsAtelier/index.tsx` | Modify |
| `src/components/TroikaConsultingAtelier/index.tsx` | Modify |
| `src/components/SBIAtelier/index.tsx` | Modify |
| `src/components/IshikawaAtelier/index.tsx` | Modify |
| `src/components/TRIZAtelier/index.tsx` | Modify |

---

### Task 1: `useExitGuard` hook

**Files:**
- Create: `src/hooks/useExitGuard.ts`
- Create: `src/hooks/useExitGuard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/hooks/useExitGuard.test.tsx
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { useExitGuard } from './useExitGuard'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

describe('useExitGuard', () => {
  it('showModal is false initially when isDirty=false', () => {
    const { result } = renderHook(() => useExitGuard(false), { wrapper })
    expect(result.current.showModal).toBe(false)
  })

  it('showModal is false initially when isDirty=true (no navigation attempted)', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(result.current.showModal).toBe(false)
  })

  it('returns confirm and cancel as functions', () => {
    const { result } = renderHook(() => useExitGuard(false), { wrapper })
    expect(typeof result.current.confirm).toBe('function')
    expect(typeof result.current.cancel).toBe('function')
  })

  it('calling confirm when not blocked does not throw', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(() => act(() => result.current.confirm())).not.toThrow()
  })

  it('calling cancel when not blocked does not throw', () => {
    const { result } = renderHook(() => useExitGuard(true), { wrapper })
    expect(() => act(() => result.current.cancel())).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useExitGuard.test.tsx
```

Expected: FAIL — `Cannot find module './useExitGuard'`

- [ ] **Step 3: Implement the hook**

```ts
// src/hooks/useExitGuard.ts
import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'

export function useExitGuard(isDirty: boolean) {
  const [showModal, setShowModal] = useState(false)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === 'blocked') setShowModal(true)
  }, [blocker.state])

  function confirm() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.proceed()
  }

  function cancel() {
    setShowModal(false)
    if (blocker.state === 'blocked') blocker.reset()
  }

  return { showModal, confirm, cancel }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/hooks/useExitGuard.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useExitGuard.ts src/hooks/useExitGuard.test.tsx
git commit -m "feat: add useExitGuard hook"
```

---

### Task 2: `ConfirmLeaveModal` component

**Files:**
- Create: `src/components/ui/ConfirmLeaveModal.tsx`
- Create: `src/components/ui/ConfirmLeaveModal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/ConfirmLeaveModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmLeaveModal } from './ConfirmLeaveModal'

const defaults = {
  title: 'Quitter ?',
  body: 'Votre progression sera perdue.',
  cancelLabel: 'Continuer',
  confirmLabel: 'Quitter quand même',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe('ConfirmLeaveModal', () => {
  it('renders title and body', () => {
    render(<ConfirmLeaveModal {...defaults} />)
    expect(screen.getByText('Quitter ?')).toBeInTheDocument()
    expect(screen.getByText('Votre progression sera perdue.')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /quitter quand même/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when close (X) button clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /fermer/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('accepts ReactNode as body', () => {
    render(
      <ConfirmLeaveModal
        {...defaults}
        body={<>Répondu à <strong>3</strong> questions.</>}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/ui/ConfirmLeaveModal.test.tsx
```

Expected: FAIL — `Cannot find module './ConfirmLeaveModal'`

- [ ] **Step 3: Implement the component**

```tsx
// src/components/ui/ConfirmLeaveModal.tsx
import React from 'react'
import { X } from 'lucide-react'

interface ConfirmLeaveModalProps {
  title: string
  body: React.ReactNode
  cancelLabel: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmLeaveModal({ title, body, cancelLabel, confirmLabel, onConfirm, onCancel }: ConfirmLeaveModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-leave-title">
      <div className="modal">
        <button className="modal__close" onClick={onCancel} aria-label="Fermer">
          <X size={18} />
        </button>
        <div className="modal__icon modal__icon--warning">
          <X size={28} />
        </div>
        <h2 className="modal__title" id="confirm-leave-title">{title}</h2>
        <p className="modal__body">{body}</p>
        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/ui/ConfirmLeaveModal.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ConfirmLeaveModal.tsx src/components/ui/ConfirmLeaveModal.test.tsx
git commit -m "feat: add ConfirmLeaveModal component"
```

---

### Task 3: Refactor `QuizScreen`

Remove the ~20 lines of inline blocker logic and replace with the shared hook + component.

**Files:**
- Modify: `src/components/QuizScreen/index.tsx`

- [ ] **Step 1: Replace the file content**

Replace the full content of `src/components/QuizScreen/index.tsx` with:

```tsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { useQuizStore } from '../../store/quizStore'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function QuizScreen() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { exam, answers, flaggedQuestions, startedAt, status, setAnswer, toggleFlag, submitQuiz, startQuiz } = useQuizStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (status === 'idle' && examId) startQuiz(examId)
  }, [status, examId, startQuiz])

  useEffect(() => {
    if (status === 'submitted') navigate(`/quiz/${examId}/results`, { replace: true })
  }, [status, examId, navigate])

  const handleSubmit = useCallback(() => { submitQuiz() }, [submitQuiz])

  const { showModal, confirm, cancel } = useExitGuard(status === 'in_progress')

  // Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!exam || !startedAt) return 0
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    return Math.max(0, exam.durationMinutes * 60 - elapsed)
  })

  useEffect(() => {
    if (!exam || !startedAt) return
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    setSecondsLeft(Math.max(0, exam.durationMinutes * 60 - elapsed))
  }, [exam, startedAt])

  useEffect(() => {
    if (secondsLeft <= 0) { handleSubmit(); return }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft, handleSubmit])

  if (!exam) return <div className="loading">Chargement de l'examen…</div>

  const question = exam.questions[currentIndex]
  const currentAnswer = answers[question.id] ?? []
  const isFlagged = flaggedQuestions.includes(question.id)
  const isLast = currentIndex === exam.questions.length - 1
  const answeredCount = Object.keys(answers).length
  const flaggedCount = flaggedQuestions.length

  function toggleAnswer(letter: string) {
    if (question.isMultiple) {
      const next = currentAnswer.includes(letter)
        ? currentAnswer.filter(a => a !== letter)
        : [...currentAnswer, letter]
      setAnswer(question.id, next)
    } else {
      setAnswer(question.id, [letter])
    }
  }

  return (
    <>
      <div className="quiz-screen">
        <header className="quiz-header">
          <div className="quiz-header__left">
            <span className="quiz-exam-title">{exam.title}</span>
            <span className="quiz-question-counter">
              Question {currentIndex + 1} / {exam.questions.length}
            </span>
          </div>
          <div className="quiz-header__right">
            {flaggedCount > 0 && (
              <span className="quiz-flag-count">
                <Bookmark size={13} className="quiz-flag-count__icon" />
                {flaggedCount} signalée{flaggedCount > 1 ? 's' : ''}
              </span>
            )}
            <span className="quiz-progress-count">{answeredCount} répondues</span>
            <span className={`quiz-timer${secondsLeft < 300 ? ' quiz-timer--urgent' : ''}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </header>

        <div className="quiz-body">
          <main className="quiz-main">
            <div className="quiz-question-header">
              {question.isMultiple && (
                <p className="quiz-multiple-hint">Plusieurs réponses possibles</p>
              )}
              <button
                className={`quiz-flag-btn${isFlagged ? ' quiz-flag-btn--active' : ''}`}
                onClick={() => toggleFlag(question.id)}
                aria-label={isFlagged ? 'Retirer le signalement' : 'Signaler pour relecture'}
                title={isFlagged ? 'Retirer le signalement' : 'Signaler pour relecture'}
              >
                <Bookmark size={15} strokeWidth={2} />
                {isFlagged ? 'Signalée' : 'Signaler'}
              </button>
            </div>

            <p className="quiz-question-text">{question.text}</p>

            <div className="quiz-options" role="group" aria-label="Options de réponse">
              {question.options.map(opt => {
                const checked = currentAnswer.includes(opt.letter)
                const inputType = question.isMultiple ? 'checkbox' : 'radio'
                return (
                  <label
                    key={opt.letter}
                    className={`quiz-option${checked ? ' quiz-option--selected' : ''}`}
                  >
                    <input
                      type={inputType}
                      name={question.id}
                      value={opt.letter}
                      checked={checked}
                      onChange={() => toggleAnswer(opt.letter)}
                      className="quiz-option__input"
                    />
                    <span className="quiz-option__letter">{opt.letter}</span>
                    <span className="quiz-option__text">{opt.text}</span>
                  </label>
                )
              })}
            </div>

            <div className="quiz-nav-buttons">
              {currentIndex > 0 && (
                <button className="btn btn--secondary" onClick={() => setCurrentIndex(i => i - 1)}>
                  ← Précédente
                </button>
              )}
              {!isLast ? (
                <button className="btn btn--primary" onClick={() => setCurrentIndex(i => i + 1)}>
                  Question suivante →
                </button>
              ) : (
                <button className="btn btn--primary" onClick={handleSubmit}>
                  Soumettre l'examen
                </button>
              )}
            </div>
          </main>

          <aside className="quiz-sidebar">
            <p className="quiz-sidebar__title">Questions</p>
            <div className="quiz-question-grid">
              {exam.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id]
                const isCurrentQ = idx === currentIndex
                const isFlaggedQ = flaggedQuestions.includes(q.id)
                return (
                  <button
                    key={q.id}
                    className={[
                      'quiz-question-dot',
                      isAnswered ? 'quiz-question-dot--answered' : '',
                      isCurrentQ ? 'quiz-question-dot--current' : '',
                      isFlaggedQ ? 'quiz-question-dot--flagged' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Question ${idx + 1}${isFlaggedQ ? ' (signalée)' : ''}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            {flaggedCount > 0 && (
              <div className="quiz-sidebar__legend">
                <span className="quiz-legend-dot quiz-legend-dot--flagged" />
                Signalée
              </div>
            )}
          </aside>
        </div>
      </div>

      {showModal && (
        <ConfirmLeaveModal
          title="Quitter le quiz ?"
          body={<>Vous avez répondu à <strong>{answeredCount}</strong> question{answeredCount > 1 ? 's' : ''} sur {exam.questions.length}. Quitter maintenant effacera votre progression.</>}
          cancelLabel="Continuer le quiz"
          confirmLabel="Quitter quand même"
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </>
  )
}
```

- [ ] **Step 2: Run existing QuizScreen tests to verify no regression**

```bash
npx vitest run src/components/QuizScreen/QuizScreen.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/QuizScreen/index.tsx
git commit -m "refactor: use useExitGuard + ConfirmLeaveModal in QuizScreen"
```

---

### Task 4: `SimulationScreen` — exit guard

`isDirty = status === 'running'`

**Files:**
- Modify: `src/components/SimulationScreen/index.tsx`

- [ ] **Step 1: Read the current top of the file to get the exact import line**

Read `src/components/SimulationScreen/index.tsx` lines 1–10.

- [ ] **Step 2: Add imports at the top of the file**

After the existing imports, add:

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 3: Add isDirty + hook inside the component**

`status` is already read from `useSimulationStore` on line 18. Add immediately after all the existing `const` declarations (before the first `useEffect`):

```tsx
const { showModal, confirm, cancel } = useExitGuard(status === 'running')
```

- [ ] **Step 4: Wrap the return in a Fragment and append the modal**

The current `return (` opens a `<div className="simulation-layout">`. Wrap in Fragment:

```tsx
return (
  <>
    <div className="simulation-layout">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter le scénario ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/SimulationScreen/index.tsx
git commit -m "feat: add exit confirmation to SimulationScreen"
```

---

### Task 5: `ScrumGuideAtelier` — exit guard

`isDirty = Object.values(zones).some(Boolean)` — no `phase` state, guard triggers as soon as the first label is dropped into any zone.

**Files:**
- Modify: `src/components/ScrumGuideAtelier/index.tsx`

- [ ] **Step 1: Add imports**

After the existing `import` block at the top of `src/components/ScrumGuideAtelier/index.tsx`, add:

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook inside `ScrumGuideAtelier`**

`zones` is already declared as `const [zones, setZones] = useState<ZoneState>(...)`. Immediately after that declaration, add:

```tsx
const isDirty = Object.values(zones).some(Boolean)
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap the return and append modal**

Change `return (<div ...>...</div>)` to:

```tsx
return (
  <>
    <div className="scrum-guide-atelier">
      {/* ...existing JSX unchanged... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run existing tests**

```bash
npx vitest run src/components/ScrumGuideAtelier/ScrumGuideAtelier.test.tsx
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrumGuideAtelier/index.tsx
git commit -m "feat: add exit confirmation to ScrumGuideAtelier"
```

---

### Task 6: Ateliers with `phase + zones/slots` — exit guard

Four ateliers share the same `isDirty` pattern: `phase > 1 || Object.values(<zoneState>).some(Boolean)`. Apply the same 4-step change to each.

**Files:**
- Modify: `src/components/ConflictAtelier/index.tsx`
- Modify: `src/components/DelegationPokerAtelier/index.tsx`
- Modify: `src/components/GrowModelAtelier/index.tsx`
- Modify: `src/components/StakeholderMappingAtelier/index.tsx`

The zone state variable names differ per file:

| File | phase var | zone state var |
|---|---|---|
| `ConflictAtelier` | `phase` | `diagramZones` |
| `DelegationPokerAtelier` | `phase` | `slots` |
| `GrowModelAtelier` | `phase` | `slots` |
| `StakeholderMappingAtelier` | `phase` | `matrixZones` |

For each file, perform the same 3 edits:

**Edit A — add imports** (after existing imports):
```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

**Edit B — add isDirty + hook** (after `phase` and zone state declarations, before derived state):
```tsx
// ConflictAtelier:
const isDirty = phase > 1 || Object.values(diagramZones).some(Boolean)
// DelegationPokerAtelier:
const isDirty = phase > 1 || Object.values(slots).some(Boolean)
// GrowModelAtelier:
const isDirty = phase > 1 || Object.values(slots).some(Boolean)
// StakeholderMappingAtelier:
const isDirty = phase > 1 || Object.values(matrixZones).some(Boolean)

const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

**Edit C — wrap return + modal** (same for all four):
```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 1: Apply edits to `ConflictAtelier`** (A + B + C)

- [ ] **Step 2: Apply edits to `DelegationPokerAtelier`** (A + B + C)

- [ ] **Step 3: Apply edits to `GrowModelAtelier`** (A + B + C)

- [ ] **Step 4: Apply edits to `StakeholderMappingAtelier`** (A + B + C)

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/ConflictAtelier/index.tsx \
        src/components/DelegationPokerAtelier/index.tsx \
        src/components/GrowModelAtelier/index.tsx \
        src/components/StakeholderMappingAtelier/index.tsx
git commit -m "feat: add exit confirmation to 4 drag-drop ateliers"
```

---

### Task 7: `AskTellAtelier` — exit guard

`isDirty = phase > 1 || Object.values(stanceZones).some(Boolean)` — 3-phase atelier with a `stanceZones` state.

**Files:**
- Modify: `src/components/AskTellAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `stanceZones` declaration):

```tsx
const isDirty = phase > 1 || Object.values(stanceZones).some(Boolean)
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/AskTellAtelier/index.tsx
git commit -m "feat: add exit confirmation to AskTellAtelier"
```

---

### Task 8: `MovingMotivatorsAtelier` — exit guard

`isDirty = phase > 1 || ranking.some(m => m !== null)` — `ranking` is `(Motivator | null)[]` with 10 slots initialized to `null`.

**Files:**
- Modify: `src/components/MovingMotivatorsAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `ranking` declaration):

```tsx
const isDirty = phase > 1 || ranking.some(m => m !== null)
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/MovingMotivatorsAtelier/index.tsx
git commit -m "feat: add exit confirmation to MovingMotivatorsAtelier"
```

---

### Task 9: `TroikaConsultingAtelier` — exit guard

`isDirty = phase > 1 || ranking.some(s => s !== null)` — `ranking` is `(TroikaStep | null)[]` with 5 slots.

**Files:**
- Modify: `src/components/TroikaConsultingAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `ranking` declaration):

```tsx
const isDirty = phase > 1 || ranking.some(s => s !== null)
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/TroikaConsultingAtelier/index.tsx
git commit -m "feat: add exit confirmation to TroikaConsultingAtelier"
```

---

### Task 10: `SBIAtelier` — exit guard

`isDirty = phase > 1 || ranking.some(b => b !== null)` — `ranking` is `(SBIType | null)[]` with 3 slots.

**Files:**
- Modify: `src/components/SBIAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `ranking` declaration):

```tsx
const isDirty = phase > 1 || ranking.some(b => b !== null)
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SBIAtelier/index.tsx
git commit -m "feat: add exit confirmation to SBIAtelier"
```

---

### Task 11: `IshikawaAtelier` — exit guard

`isDirty = phase > 1 || Object.keys(branchAssignments).length > 0` — `branchAssignments` is a `Partial<Record<string, IshikawaCategory>>` initialized as `{}`.

**Files:**
- Modify: `src/components/IshikawaAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `branchAssignments` declaration):

```tsx
const isDirty = phase > 1 || Object.keys(branchAssignments).length > 0
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run existing IshikawaAtelier tests**

```bash
npx vitest run src/components/IshikawaAtelier/IshikawaAtelier.test.tsx
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/IshikawaAtelier/index.tsx
git commit -m "feat: add exit confirmation to IshikawaAtelier"
```

---

### Task 12: `TRIZAtelier` — exit guard

`isDirty = phase > 1 || antiGoal.trim().length > 0` — `antiGoal` is a string initialized as `''`.

**Files:**
- Modify: `src/components/TRIZAtelier/index.tsx`

- [ ] **Step 1: Add imports** (after existing imports):

```tsx
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'
```

- [ ] **Step 2: Add isDirty + hook** (after `antiGoal` declaration):

```tsx
const isDirty = phase > 1 || antiGoal.trim().length > 0
const { showModal, confirm, cancel } = useExitGuard(isDirty)
```

- [ ] **Step 3: Wrap return + modal**

```tsx
return (
  <>
    <div className="atelier-page">
      {/* ...existing JSX unchanged — every line inside this div stays identical... */}
    </div>

    {showModal && (
      <ConfirmLeaveModal
        title="Quitter l'atelier ?"
        body="Votre progression sera perdue."
        cancelLabel="Continuer"
        confirmLabel="Quitter quand même"
        onConfirm={confirm}
        onCancel={cancel}
      />
    )}
  </>
)
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/TRIZAtelier/index.tsx
git commit -m "feat: add exit confirmation to TRIZAtelier"
```
