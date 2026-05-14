# Powerful Questions Atelier — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier where learners (1) classify 12 questions into closed/leading/powerful categories, then (2) assign 15 Scrum situations to the matching coaching intent.

**Architecture:** Follows exactly the ConflictAtelier pattern — self-contained component with hardcoded game data, dataset file used only for the WorkshopDefinition, existing TKI CSS classes reused for columns/cards/pool. Phase 1 must be 100% correct before Phase 2 unlocks.

**Tech Stack:** React + TypeScript, existing TKI CSS classes (`tki-columns`, `tki-column`, `tki-situation-card`, `tki-pool`), vitest + testing-library, React Router v6.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/data/workshops/datasets/powerful-questions.ts` | Thin dataset for WorkshopDefinition (zones + cards) |
| Create | `src/components/PowerfulQuestionsAtelier/index.tsx` | Full atelier component with game state |
| Create | `src/components/PowerfulQuestionsAtelier/PowerfulQuestionsAtelier.test.tsx` | Tests for both phases |
| Modify | `src/data/workshops/definitions.ts` | Move from COMING_SOON to EXISTING, add pedagogy |
| Modify | `src/App.tsx` | Add route `/ateliers/powerful-questions` |

---

## Task 1: Dataset file

**Files:**
- Create: `src/data/workshops/datasets/powerful-questions.ts`

- [ ] **Step 1: Write the dataset file**

```typescript
import type { ClassificationDataset } from '../types'

export const powerfulQuestionsDataset: ClassificationDataset = {
  zones: [
    { id: 'closed',   label: 'Question fermée',   description: 'Réponse courte, souvent oui/non, peu d'exploration.' },
    { id: 'leading',  label: 'Question orientée',  description: 'La question contient déjà une hypothèse ou pousse vers une réponse.' },
    { id: 'powerful', label: 'Powerful Question',  description: 'Question ouverte qui clarifie, responsabilise ou ouvre l'action.' },
  ],
  cards: [
    { id: 'q1',  text: 'Est-ce que tu as compris ce qui est attendu ?',                                         expectedZone: 'closed' },
    { id: 'q2',  text: 'Tu penses pouvoir finir cette User Story avant vendredi ?',                             expectedZone: 'closed' },
    { id: 'q3',  text: 'Est-ce que le problème vient du Product Owner ?',                                       expectedZone: 'closed' },
    { id: 'q4',  text: 'Vous êtes d'accord avec cette solution ?',                                              expectedZone: 'closed' },
    { id: 'q5',  text: 'Tu ne crois pas qu'il faudrait plutôt réduire le périmètre ?',                         expectedZone: 'leading' },
    { id: 'q6',  text: 'Pourquoi vous n'avez pas anticipé cette dépendance ?',                                  expectedZone: 'leading' },
    { id: 'q7',  text: 'Tu ne penses pas que le Daily est trop long parce que l'équipe manque de discipline ?', expectedZone: 'leading' },
    { id: 'q8',  text: 'Est-ce que la bonne solution ne serait pas de reprendre le backlog à zéro ?',           expectedZone: 'leading' },
    { id: 'q9',  text: 'Qu'est-ce qui te manque pour avancer sereinement ?',                                    expectedZone: 'powerful' },
    { id: 'q10', text: 'Qu'est-ce qui rend cette décision difficile pour l'équipe ?',                           expectedZone: 'powerful' },
    { id: 'q11', text: 'Quelle option créerait le plus de valeur avec le moins de risque ?',                    expectedZone: 'powerful' },
    { id: 'q12', text: 'Qu'est-ce que l'équipe pourrait expérimenter dès le prochain Sprint ?',                 expectedZone: 'powerful' },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/workshops/datasets/powerful-questions.ts
git commit -m "feat(data): add powerful-questions dataset"
```

---

## Task 2: Component

**Files:**
- Create: `src/components/PowerfulQuestionsAtelier/index.tsx`

> Important: Phase 1 uses 3 drop columns (closed / leading / powerful) with 12 question cards.
> Phase 2 uses 5 drop columns (clarify / explore / empower / decide / act) with 15 situation+question cards.
> CSS classes are reused from TKI: `tki-columns`, `tki-column`, `tki-column__title`, `tki-column__cards`, `tki-situation-card`, `tki-pool`, `tki-pool__cards`, `tki-situation-card--correct`, `tki-situation-card--wrong`.

- [ ] **Step 1: Write the full component**

```tsx
import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type QuestionCategory = 'closed' | 'leading' | 'powerful'
type CoachingIntent = 'clarify' | 'explore' | 'empower' | 'decide' | 'act'

const QUESTION_CATEGORIES: { id: QuestionCategory; label: string; description: string }[] = [
  { id: 'closed',   label: 'Question fermée',  description: 'Réponse courte, souvent oui/non, peu d'exploration.' },
  { id: 'leading',  label: 'Question orientée', description: 'La question contient déjà une hypothèse ou pousse vers une réponse.' },
  { id: 'powerful', label: 'Powerful Question', description: 'Question ouverte qui clarifie, responsabilise ou ouvre l'action.' },
]

const COACHING_INTENTS: { id: CoachingIntent; label: string; description: string }[] = [
  { id: 'clarify', label: 'Clarifier',          description: 'Comprendre le vrai problème avant de chercher une solution.' },
  { id: 'explore', label: 'Explorer',            description: 'Ouvrir les options, les angles morts et les alternatives.' },
  { id: 'empower', label: 'Responsabiliser',     description: 'Aider la personne ou l'équipe à retrouver du pouvoir d'action.' },
  { id: 'decide',  label: 'Décider',             description: 'Aider à choisir, prioriser ou arbitrer.' },
  { id: 'act',     label: 'Passer à l'action',   description: 'Transformer la réflexion en prochaine étape concrète.' },
]

type Question = { id: string; text: string; correctCategory: QuestionCategory }

const QUESTIONS: Question[] = [
  { id: 'q1',  text: 'Est-ce que tu as compris ce qui est attendu ?',                                         correctCategory: 'closed' },
  { id: 'q2',  text: 'Tu penses pouvoir finir cette User Story avant vendredi ?',                             correctCategory: 'closed' },
  { id: 'q3',  text: 'Est-ce que le problème vient du Product Owner ?',                                       correctCategory: 'closed' },
  { id: 'q4',  text: 'Vous êtes d'accord avec cette solution ?',                                              correctCategory: 'closed' },
  { id: 'q5',  text: 'Tu ne crois pas qu'il faudrait plutôt réduire le périmètre ?',                         correctCategory: 'leading' },
  { id: 'q6',  text: 'Pourquoi vous n'avez pas anticipé cette dépendance ?',                                  correctCategory: 'leading' },
  { id: 'q7',  text: 'Tu ne penses pas que le Daily est trop long parce que l'équipe manque de discipline ?', correctCategory: 'leading' },
  { id: 'q8',  text: 'Est-ce que la bonne solution ne serait pas de reprendre le backlog à zéro ?',           correctCategory: 'leading' },
  { id: 'q9',  text: 'Qu'est-ce qui te manque pour avancer sereinement ?',                                    correctCategory: 'powerful' },
  { id: 'q10', text: 'Qu'est-ce qui rend cette décision difficile pour l'équipe ?',                           correctCategory: 'powerful' },
  { id: 'q11', text: 'Quelle option créerait le plus de valeur avec le moins de risque ?',                    correctCategory: 'powerful' },
  { id: 'q12', text: 'Qu'est-ce que l'équipe pourrait expérimenter dès le prochain Sprint ?',                 correctCategory: 'powerful' },
]

type Situation = { id: string; situation: string; question: string; correctIntent: CoachingIntent }

const SITUATIONS: Situation[] = [
  { id: 's1',  situation: 'Le Daily Scrum dure 35 minutes et personne ne sait vraiment pourquoi il déborde.',           question: 'Qu'est-ce qui se joue réellement pendant ce Daily ?',                                   correctIntent: 'clarify' },
  { id: 's2',  situation: 'Une User Story revient plusieurs fois en Sprint Planning sans être prise.',                   question: 'Qu'est-ce qui n'est pas encore clair dans cette User Story ?',                         correctIntent: 'clarify' },
  { id: 's3',  situation: 'L'équipe dit "on manque de temps", mais sans identifier précisément la cause.',               question: 'Quand vous dites manquer de temps, de quoi manquez-vous exactement ?',                  correctIntent: 'clarify' },
  { id: 's4',  situation: 'Deux développeurs défendent deux approches techniques opposées.',                              question: 'Quelles options n'avons-nous pas encore explorées ?',                                   correctIntent: 'explore' },
  { id: 's5',  situation: 'Le Product Owner veut absolument livrer vite, mais l'équipe alerte sur la qualité.',          question: 'Quelles seraient les conséquences de chaque option à court et moyen terme ?',          correctIntent: 'explore' },
  { id: 's6',  situation: 'L'équipe répète toujours la même solution en rétrospective sans résultat durable.',           question: 'Qu'est-ce que vous n'avez pas encore essayé ?',                                          correctIntent: 'explore' },
  { id: 's7',  situation: 'Un membre de l'équipe attend systématiquement que le Scrum Master règle les blocages.',       question: 'Quelle serait ta première action possible avant de demander de l'aide ?',                correctIntent: 'empower' },
  { id: 's8',  situation: 'L'équipe accuse régulièrement les parties prenantes de ses difficultés.',                     question: 'Sur quoi l'équipe a-t-elle réellement du pouvoir d'action ?',                           correctIntent: 'empower' },
  { id: 's9',  situation: 'Un développeur se plaint d'une décision sans proposer d'alternative.',                        question: 'Qu'est-ce que tu proposerais comme option acceptable ?',                               correctIntent: 'empower' },
  { id: 's10', situation: 'L'équipe hésite entre réduire le périmètre ou décaler la livraison.',                         question: 'Quel choix protège le mieux la valeur et la qualité ?',                                correctIntent: 'decide' },
  { id: 's11', situation: 'Le Product Owner ne sait pas quelle User Story prioriser entre deux demandes importantes.',   question: 'Quel item crée le plus d'impact pour l'utilisateur maintenant ?',                       correctIntent: 'decide' },
  { id: 's12', situation: 'L'équipe débat longuement sans réussir à trancher.',                                          question: 'De quelle information avons-nous besoin pour décider ?',                               correctIntent: 'decide' },
  { id: 's13', situation: 'La rétrospective produit beaucoup d'idées, mais aucune action concrète.',                     question: 'Quelle action simple pouvons-nous tester dès cette semaine ?',                          correctIntent: 'act' },
  { id: 's14', situation: 'Un conflit latent est identifié mais personne ne sait comment l'aborder.',                   question: 'Quelle première conversation utile pourrait être engagée ?',                            correctIntent: 'act' },
  { id: 's15', situation: 'L'équipe veut améliorer son Definition of Done mais le sujet paraît trop vaste.',             question: 'Quel petit changement concret pouvons-nous intégrer au prochain Sprint ?',             correctIntent: 'act' },
]

export function PowerfulQuestionsAtelier() {
  const { markComplete } = useWorkshopCompletion('powerful-questions')
  const [phase, setPhase] = useState<1 | 2>(1)

  // Phase 1 state: which questions are in each category column
  const [questionZones, setQuestionZones] = useState<Record<QuestionCategory, string[]>>({
    closed: [], leading: [], powerful: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  // Phase 2 state: which situations are assigned to which intent
  const [situationZones, setSituationZones] = useState<Record<CoachingIntent, string[]>>({
    clarify: [], explore: [], empower: [], decide: [], act: [],
  })
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<
    | { type: 'question'; id: string; fromCategory?: QuestionCategory }
    | { type: 'situation'; id: string; fromIntent?: CoachingIntent }
    | null
  >(null)

  const isDirty =
    phase > 1 ||
    Object.values(questionZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedQuestionIds = new Set(Object.values(questionZones).flat())
  const paletteQuestions = QUESTIONS.filter(q => !placedQuestionIds.has(q.id))
  const phase1AllPlaced = paletteQuestions.length === 0

  function handleQuestionDragStart(id: string, fromCategory?: QuestionCategory) {
    setDragging({ type: 'question', id, fromCategory })
    setPhase1Result(null)
  }

  function handleDropOnQuestionColumn(category: QuestionCategory) {
    if (!dragging || dragging.type !== 'question') return
    setQuestionZones(prev => {
      const next = { ...prev, [category]: [...prev[category]] }
      if (dragging.fromCategory) {
        next[dragging.fromCategory] = next[dragging.fromCategory].filter(id => id !== dragging.id)
      }
      if (!next[category].includes(dragging.id)) next[category] = [...next[category], dragging.id]
      return next
    })
    setDragging(null)
  }

  function handleDropOnQuestionPalette() {
    if (!dragging || dragging.type !== 'question' || !dragging.fromCategory) { setDragging(null); return }
    setQuestionZones(prev => ({
      ...prev,
      [dragging.fromCategory!]: prev[dragging.fromCategory!].filter(id => id !== dragging.id),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const q of QUESTIONS) {
      const cat = (Object.entries(questionZones) as [QuestionCategory, string[]][])
        .find(([, ids]) => ids.includes(q.id))?.[0]
      result[q.id] = cat === q.correctCategory
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setQuestionZones({ closed: [], leading: [], powerful: [] })
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 12

  // Phase 2 helpers
  const placedSituationIds = new Set(Object.values(situationZones).flat())
  const poolSituations = SITUATIONS.filter(s => !placedSituationIds.has(s.id))
  const phase2AllPlaced = poolSituations.length === 0

  function handleSituationDragStart(id: string, fromIntent?: CoachingIntent) {
    setDragging({ type: 'situation', id, fromIntent })
    setPhase2Result(null)
  }

  function handleDropOnIntentColumn(intent: CoachingIntent) {
    if (!dragging || dragging.type !== 'situation') return
    setSituationZones(prev => {
      const next = { ...prev, [intent]: [...prev[intent]] }
      if (dragging.fromIntent) {
        next[dragging.fromIntent] = next[dragging.fromIntent].filter(id => id !== dragging.id)
      }
      if (!next[intent].includes(dragging.id)) next[intent] = [...next[intent], dragging.id]
      return next
    })
    setDragging(null)
  }

  function handleDropOnSituationPool() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromIntent) { setDragging(null); return }
    setSituationZones(prev => ({
      ...prev,
      [dragging.fromIntent!]: prev[dragging.fromIntent!].filter(id => id !== dragging.id),
    }))
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      const intent = (Object.entries(situationZones) as [CoachingIntent, string[]][])
        .find(([, ids]) => ids.includes(s.id))?.[0]
      result[s.id] = intent === s.correctIntent
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setSituationZones({ clarify: [], explore: [], empower: [], decide: [], act: [] })
    setPhase2Result(null)
  }

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'powerful-questions')!} />
        <header className="atelier-header">
          <h1 className="atelier-title">Powerful Questions</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Classez les 12 questions dans la bonne catégorie.'
              : 'Phase 2 / 2 — Associez chaque situation à l'intention de coaching appropriée.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {QUESTION_CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  data-category={cat.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnQuestionColumn(cat.id)}
                >
                  <h3 className="tki-column__title">{cat.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{cat.description}</p>
                  <div className="tki-column__cards">
                    {questionZones[cat.id].map(qid => {
                      const q = QUESTIONS.find(x => x.id === qid)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[q.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={q.id}
                          data-question={q.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleQuestionDragStart(q.id, cat.id)}
                        >
                          {q.text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / 12 correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
                {phase1Perfect && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Tu sais reconnaître les principaux pièges : fermer trop vite, orienter la réponse ou chercher à résoudre à la place de l'autre.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnQuestionPalette}
            >
              <p className="scrum-palette__title">Questions à classer</p>
              <div className="tki-pool__cards">
                {paletteQuestions.map(q => (
                  <div
                    key={q.id}
                    data-question={q.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleQuestionDragStart(q.id)}
                  >
                    {q.text}
                  </div>
                ))}
                {paletteQuestions.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les questions ont été classées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllPlaced}>
                Vérifier
              </button>
              {phase1Result && !phase1Perfect && (
                <button className="btn btn--secondary" onClick={handleResetPhase1}>Réessayer</button>
              )}
              {phase1Perfect && (
                <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
              )}
            </div>
          </>
        )}

        {phase === 2 && (
          <>
            <div className="tki-columns">
              {COACHING_INTENTS.map(intent => (
                <div
                  key={intent.id}
                  data-intent={intent.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnIntentColumn(intent.id)}
                >
                  <h3 className="tki-column__title">{intent.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{intent.description}</p>
                  <div className="tki-column__cards">
                    {situationZones[intent.id].map(sid => {
                      const s = SITUATIONS.find(x => x.id === sid)!
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, intent.id)}
                        >
                          <strong>{s.situation}</strong>
                          <br />
                          <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {phase2Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
                  {phase2Score} / 15 correct{phase2Score === 15 ? ' — Maîtrisé !' : ''}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {phase2Score === 15
                    ? 'Tu sais adapter la question à l'intention : clarifier, explorer, responsabiliser, décider ou faire émerger une action.'
                    : 'À consolider : certaines questions sont pertinentes, mais l'intention de coaching doit être mieux distinguée.'}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnSituationPool}
            >
              <p className="scrum-palette__title">Situations à classer</p>
              <div className="tki-pool__cards">
                {poolSituations.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleSituationDragStart(s.id)}
                  >
                    <strong>{s.situation}</strong>
                    <br />
                    <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>→ {s.question}</em>
                  </div>
                ))}
                {poolSituations.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase2} disabled={!phase2AllPlaced}>
                Vérifier
              </button>
              {phase2Result && (
                <button className="btn btn--secondary" onClick={handleResetPhase2}>Réessayer phase 2</button>
              )}
            </div>
          </>
        )}
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
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PowerfulQuestionsAtelier/index.tsx
git commit -m "feat(atelier): PowerfulQuestionsAtelier component — two-phase drag-and-drop"
```

---

## Task 3: Tests

**Files:**
- Create: `src/components/PowerfulQuestionsAtelier/PowerfulQuestionsAtelier.test.tsx`

- [ ] **Step 1: Write the test file**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { PowerfulQuestionsAtelier } from '.'

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/powerful-questions', element: <PowerfulQuestionsAtelier /> }],
    { initialEntries: ['/ateliers/powerful-questions'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('PowerfulQuestionsAtelier — Phase 1', () => {
  it('renders 12 question cards in the pool', () => {
    renderAtelier()
    expect(document.querySelectorAll('[data-question]')).toHaveLength(12)
  })

  it('disables Vérifier when not all questions are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 12 questions are placed in any column', () => {
    renderAtelier()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-category="closed"]')!)
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 12/12 and Phase suivante on perfect placement', () => {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'closed', q2: 'closed', q3: 'closed', q4: 'closed',
      q5: 'leading', q6: 'leading', q7: 'leading', q8: 'leading',
      q9: 'powerful', q10: 'powerful', q11: 'powerful', q12: 'powerful',
    }
    document.querySelectorAll('[data-question]').forEach(card => {
      const id = card.getAttribute('data-question')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-category="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/12 \/ 12 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer when placement is wrong', () => {
    renderAtelier()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-category="closed"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('PowerfulQuestionsAtelier — Phase 2', () => {
  function reachPhase2() {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'closed', q2: 'closed', q3: 'closed', q4: 'closed',
      q5: 'leading', q6: 'leading', q7: 'leading', q8: 'leading',
      q9: 'powerful', q10: 'powerful', q11: 'powerful', q12: 'powerful',
    }
    document.querySelectorAll('[data-question]').forEach(card => {
      const id = card.getAttribute('data-question')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-category="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 15 situation cards in the pool', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('disables Vérifier when not all situations are placed', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct assignment', () => {
    reachPhase2()
    const mapping: Record<string, string> = {
      s1: 'clarify', s2: 'clarify', s3: 'clarify',
      s4: 'explore', s5: 'explore', s6: 'explore',
      s7: 'empower', s8: 'empower', s9: 'empower',
      s10: 'decide', s11: 'decide', s12: 'decide',
      s13: 'act', s14: 'act', s15: 'act',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-intent="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-intent="clarify"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-intent="clarify"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/loicrossignol/Desktop/Igensia/Scrum\ Master/scrum-master-sim
npx vitest run src/components/PowerfulQuestionsAtelier/PowerfulQuestionsAtelier.test.tsx
```

Expected: all 10 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/PowerfulQuestionsAtelier/PowerfulQuestionsAtelier.test.tsx
git commit -m "test(atelier): PowerfulQuestionsAtelier — phase 1 and phase 2 tests"
```

---

## Task 4: Register in definitions.ts

**Files:**
- Modify: `src/data/workshops/definitions.ts`

The `powerful-questions` entry already exists in `COMING_SOON` at line 395. Move it to `EXISTING`, importing the dataset and adding the `pedagogy` block.

- [ ] **Step 1: Add the import**

At the top of `src/data/workshops/definitions.ts`, after the last existing import (e.g., `scrumGuideDataset`), add:

```typescript
import { powerfulQuestionsDataset } from './datasets/powerful-questions'
```

- [ ] **Step 2: Add entry to EXISTING array**

Append to the `EXISTING` array (before the closing `]`):

```typescript
  {
    id: 'powerful-questions',
    slug: 'powerful-questions',
    title: 'Powerful Questions',
    route: '/ateliers/powerful-questions',
    categorySlug: 'coaching-and-posture',
    toolName: 'Powerful Questions',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: 'Distinguez questions fermées, orientées et puissantes, puis associez des situations Scrum à la meilleure intention de coaching.',
    pedagogy: {
      objectives: [
        'Distinguer une question fermée, orientée et puissante',
        'Éviter les questions qui jugent, accusent ou induisent une réponse',
        'Choisir une question adaptée à une situation Scrum',
        "Relier une question à une intention de coaching",
        "Favoriser l'autonomie de l'équipe plutôt que résoudre à sa place",
      ],
      toolExplanation: "Les Powerful Questions (ICF) sont des questions ouvertes qui aident l'autre à penser plus clairement, voir autrement, choisir ou agir. Elles s'opposent aux questions fermées (oui/non) et aux questions orientées (qui induisent une réponse). En coaching Scrum, chaque question doit servir une intention : clarifier, explorer, responsabiliser, décider ou passer à l'action.",
      whenToUse: [
        'Pour accompagner un membre de l'équipe sans lui imposer une solution',
        'En rétrospective ou Sprint Planning pour débloquer une situation',
        'Pour développer l'autonomie de l'équipe',
      ],
      expectedOutput: [
        'Distinction maîtrisée entre question fermée, orientée et puissante',
        'Capacité à choisir une question selon l'intention de coaching',
      ],
    },
    dataset: powerfulQuestionsDataset,
  },
```

- [ ] **Step 3: Remove from COMING_SOON**

In the `COMING_SOON` array, delete the line that defines `powerful-questions` (the line at ~line 395 that starts with `{ id: 'powerful-questions'`).

- [ ] **Step 4: Commit**

```bash
git add src/data/workshops/definitions.ts src/data/workshops/datasets/powerful-questions.ts
git commit -m "feat(data): register powerful-questions in EXISTING workshop definitions"
```

---

## Task 5: Route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import**

After the last atelier import (e.g., `CynefinFrameworkAtelier`), add:

```typescript
import { PowerfulQuestionsAtelier } from './components/PowerfulQuestionsAtelier'
```

- [ ] **Step 2: Add route**

Inside the router children array, after the `cynefin-framework` route, add:

```typescript
{ path: '/ateliers/powerful-questions', element: <PowerfulQuestionsAtelier /> },
```

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/loicrossignol/Desktop/Igensia/Scrum\ Master/scrum-master-sim
npx vitest run
```

Expected: all tests pass, including the new PowerfulQuestionsAtelier tests.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(router): add /ateliers/powerful-questions route"
```

---

## Self-Review

**Spec coverage:**
- [x] Phase 1: 12 questions in 3 categories (closed / leading / powerful) — implemented
- [x] Phase 1: drag-and-drop to 3 columns — implemented
- [x] Phase 1: Vérifier disabled until all 12 placed — implemented
- [x] Phase 1: 12/12 → green banner, "Phase suivante" button — implemented
- [x] Phase 1: < 12/12 → red/green per card, "Réessayer" button — implemented
- [x] Phase 2: 15 situations in 5 intent columns — implemented
- [x] Phase 2: each card shows situation + coaching question — implemented
- [x] Phase 2: Vérifier disabled until all 15 placed — implemented
- [x] Phase 2: score X/15, correct green / wrong red — implemented
- [x] Phase 2: "Réessayer phase 2" (no reset to phase 1) — implemented
- [x] Phase 2: badge green 15/15 / orange <15 — implemented
- [x] Phase 1 must be 100% before phase 2 unlocks — implemented
- [x] Exit guard (ConfirmLeaveModal) — implemented
- [x] useWorkshopCompletion('powerful-questions') — implemented
- [x] WorkshopPedagogyPanel — implemented
- [x] WorkshopDefinition entry with pedagogy — implemented (Task 4)
- [x] Route added — implemented (Task 5)

**Placeholder scan:** No TBDs or "implement later" — all code is complete.

**Type consistency:** `QuestionCategory` and `CoachingIntent` used consistently across component. `data-question` used in Phase 1, `data-category` for column drops. `data-situation` used in Phase 2, `data-intent` for column drops. Tests use the same attribute names.
