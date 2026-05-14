# Radical Candor Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop atelier that teaches the Radical Candor model — Phase 1 places the 4 postures on a 2×2 diagram (Care Personally × Challenge Directly), Phase 2 classifies 15 Agile/Scrum situations into 5 zones (4 postures + Vers Radical Candor).

**Architecture:** Follows the established atelier pattern: standalone React component at `src/components/RadicalCandorAtelier/index.tsx`, with native HTML5 drag-and-drop, two-phase state machine, and `useWorkshopCompletion`/`useExitGuard` hooks. Phase 1 reuses `.tki-diagram`, `.tki-axis`, `.tki-zone` CSS with a new `.rc-grid` 2×2 class. Phase 2 reuses `.tki-columns` / `.tki-pool` columns layout. The COMING_SOON entry in `definitions.ts` is promoted to EXISTING with a new `ClassificationDataset`.

**Tech Stack:** React 18, TypeScript, Vitest + React Testing Library, native HTML5 DnD, CSS custom properties (existing design tokens)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/data/workshops/datasets/radical-candor.ts` | Create | `ClassificationDataset` — 5 zones, 15 cards for WorkshopPedagogyPanel |
| `src/index.css` | Modify | Add `.rc-grid` 2×2 CSS grid class |
| `src/components/RadicalCandorAtelier/index.tsx` | Create | Main two-phase component with all data, handlers, and JSX |
| `src/components/RadicalCandorAtelier/RadicalCandorAtelier.test.tsx` | Create | 11 Vitest tests covering both phases |
| `src/data/workshops/definitions.ts` | Modify | Promote `radical-candor` from COMING_SOON to EXISTING with dataset |
| `src/App.tsx` | Modify | Add import + route `/ateliers/radical-candor` |

---

### Task 1: Create the dataset file

**Files:**
- Create: `src/data/workshops/datasets/radical-candor.ts`

- [ ] **Step 1: Write the failing test (none needed — data file)**

  Data files have no tests; verify by TypeScript compilation in Step 4.

- [ ] **Step 2: Create the file**

```typescript
import type { ClassificationDataset } from '../types'

export const radicalCandorDataset: ClassificationDataset = {
  zones: [
    { id: 'radical-candor',           label: 'Radical Candor',           description: 'Feedback clair, spécifique, utile et humain.' },
    { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Évitement du feedback difficile par peur de blesser.' },
    { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Feedback direct mais dur, humiliant ou peu respectueux.' },
    { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: 'Feedback évité, indirect, politique ou non sincère.' },
    { id: 'towards-radical-candor',   label: 'Vers Radical Candor',      description: "Reformulation d'un feedback faible, brutal ou ambigu en feedback clair et aidant." },
  ],
  cards: [
    { id: 's1',  text: 'Un développeur livre régulièrement du code non conforme à la Definition of Done.',                                                          expectedZone: 'radical-candor' },
    { id: 's2',  text: 'Le Scrum Master monopolise souvent la parole en rétrospective.',                                                                            expectedZone: 'radical-candor' },
    { id: 's3',  text: 'Le Product Owner arrive souvent en Sprint Planning avec des User Stories insuffisamment préparées.',                                         expectedZone: 'radical-candor' },
    { id: 's4',  text: 'Un membre perturbe régulièrement les Daily Scrums, mais le Scrum Master ne dit rien pour ne pas le vexer.',                                 expectedZone: 'ruinous-empathy' },
    { id: 's5',  text: "Le PO sait qu'une User Story est mal rédigée, mais la laisse passer pour ne pas mettre le Business Analyst en difficulté.",                 expectedZone: 'ruinous-empathy' },
    { id: 's6',  text: "Un manager donne un feedback très vague : \"C'est bien, continue\", alors que la prestation n'est pas au niveau attendu.",                   expectedZone: 'ruinous-empathy' },
    { id: 's7',  text: "Un lead technique dit en réunion : \"Cette solution est mauvaise, tu n'as clairement pas réfléchi.\"",                                       expectedZone: 'obnoxious-aggression' },
    { id: 's8',  text: "Un Scrum Master humilie un membre devant l'équipe parce qu'il n'a pas terminé sa tâche.",                                                   expectedZone: 'obnoxious-aggression' },
    { id: 's9',  text: 'Un manager corrige publiquement une erreur avec un ton sarcastique.',                                                                        expectedZone: 'obnoxious-aggression' },
    { id: 's10', text: 'Un collègue dit en face que tout va bien, puis critique fortement la personne en dehors de la réunion.',                                     expectedZone: 'manipulative-insincerity' },
    { id: 's11', text: 'Un manager évite un feedback difficile pour préserver son image de "manager sympa".',                                                        expectedZone: 'manipulative-insincerity' },
    { id: 's12', text: 'Un membre valide une décision en réunion, puis cherche discrètement à la saboter.',                                                         expectedZone: 'manipulative-insincerity' },
    { id: 's13', text: "Au lieu de dire \"Tu n'es pas assez rigoureux\", le Scrum Master reformule en observation précise.",                                         expectedZone: 'towards-radical-candor' },
    { id: 's14', text: "Au lieu d'éviter un feedback sur une facilitation confuse, un pair propose une aide concrète.",                                              expectedZone: 'towards-radical-candor' },
    { id: 's15', text: 'Au lieu de critiquer un développeur en public, le lead technique choisit un feedback direct en privé.',                                     expectedZone: 'towards-radical-candor' },
  ],
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project /Users/loicrossignol/Desktop/Igensia/Scrum\ Master/scrum-master-sim/tsconfig.json 2>&1 | head -20`
Expected: no errors relating to `radical-candor.ts`

- [ ] **Step 4: Commit**

```bash
git add src/data/workshops/datasets/radical-candor.ts
git commit -m "feat(radical-candor): add dataset"
```

---

### Task 2: Add CSS class + Create the component

**Files:**
- Modify: `src/index.css` (after `.tki-cell--empty` line)
- Create: `src/components/RadicalCandorAtelier/index.tsx`

- [ ] **Step 1: Add `.rc-grid` CSS class to `src/index.css`**

Find the block ending with `.tki-cell--empty { background: transparent; }` (around line 1545) and insert after it:

```css
.rc-grid {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem;
  min-height: 240px;
}
```

- [ ] **Step 2: Create `src/components/RadicalCandorAtelier/index.tsx`**

```tsx
import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type RadicalCandorQuadrant =
  | 'radical-candor'
  | 'ruinous-empathy'
  | 'obnoxious-aggression'
  | 'manipulative-insincerity'

type RadicalCandorExtendedZone = RadicalCandorQuadrant | 'towards-radical-candor'

type DiagramPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type DiagramZones = Record<DiagramPosition, RadicalCandorQuadrant | null>
type SituationZones = Record<string, RadicalCandorExtendedZone>

const DIAGRAM_POSITIONS: DiagramPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

const DIAGRAM_ANSWERS: Record<DiagramPosition, RadicalCandorQuadrant> = {
  'top-left':     'ruinous-empathy',
  'top-right':    'radical-candor',
  'bottom-left':  'manipulative-insincerity',
  'bottom-right': 'obnoxious-aggression',
}

const QUADRANTS: { id: RadicalCandorQuadrant; label: string; description: string }[] = [
  { id: 'radical-candor',           label: 'Radical Candor',           description: 'Défier directement tout en montrant une attention personnelle réelle.' },
  { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Se soucier de la personne, mais éviter le feedback nécessaire.' },
  { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Défier directement sans montrer assez de considération personnelle.' },
  { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: "Ne pas challenger directement et ne pas montrer d'attention sincère." },
]

const EXTENDED_ZONES: { id: RadicalCandorExtendedZone; label: string; description: string }[] = [
  { id: 'radical-candor',           label: 'Radical Candor',           description: 'Feedback clair, spécifique, utile et humain.' },
  { id: 'ruinous-empathy',          label: 'Ruinous Empathy',          description: 'Évitement du feedback difficile par peur de blesser.' },
  { id: 'obnoxious-aggression',     label: 'Obnoxious Aggression',     description: 'Feedback direct mais dur, humiliant ou peu respectueux.' },
  { id: 'manipulative-insincerity', label: 'Manipulative Insincerity', description: 'Feedback évité, indirect, politique ou non sincère.' },
  { id: 'towards-radical-candor',   label: 'Vers Radical Candor',      description: "Reformulation d'un feedback faible, brutal ou ambigu en feedback clair et aidant." },
]

type Situation = { id: string; situation: string; context: string; correctZone: RadicalCandorExtendedZone }

const SITUATIONS: Situation[] = [
  {
    id: 's1',
    situation: "Un développeur livre régulièrement du code non conforme à la Definition of Done.",
    context: "\"Je veux te parler d'un point important. Plusieurs items livrés ne respectent pas la DoD, notamment sur les tests. Je sais que tu veux bien faire, et je veux qu'on voie ensemble ce qui bloque pour sécuriser les prochaines livraisons.\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's2',
    situation: "Le Scrum Master monopolise souvent la parole en rétrospective.",
    context: "\"Je remarque que tu interviens beaucoup pendant les rétrospectives. Ton intention est d'aider, mais cela laisse moins d'espace à l'équipe. Comment pourrait-on faciliter autrement la prochaine fois ?\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's3',
    situation: "Le Product Owner arrive souvent en Sprint Planning avec des User Stories insuffisamment préparées.",
    context: "\"Les trois dernières sessions de planning ont été ralenties parce que certaines stories n'étaient pas assez claires. L'équipe a besoin d'éléments plus solides pour s'engager correctement.\"",
    correctZone: 'radical-candor',
  },
  {
    id: 's4',
    situation: "Un membre perturbe régulièrement les Daily Scrums, mais le Scrum Master ne dit rien pour ne pas le vexer.",
    context: "Posture : il se soucie de la personne, mais n'ose pas challenger directement.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's5',
    situation: "Le PO sait qu'une User Story est mal rédigée, mais la laisse passer pour ne pas mettre le Business Analyst en difficulté.",
    context: "Posture : il préserve le confort immédiat, mais crée un problème pour l'équipe.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's6',
    situation: "Un manager donne un feedback très vague : \"C'est bien, continue\", alors que la prestation n'est pas au niveau attendu.",
    context: "Posture : le feedback paraît bienveillant, mais il n'aide pas la personne à progresser.",
    correctZone: 'ruinous-empathy',
  },
  {
    id: 's7',
    situation: "Un lead technique dit en réunion : \"Cette solution est mauvaise, tu n'as clairement pas réfléchi.\"",
    context: "Posture : le feedback est direct, mais il attaque la personne au lieu d'aider.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's8',
    situation: "Un Scrum Master humilie un membre devant l'équipe parce qu'il n'a pas terminé sa tâche.",
    context: "Posture : il challenge, mais sans respect ni attention personnelle.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's9',
    situation: "Un manager corrige publiquement une erreur avec un ton sarcastique.",
    context: "Posture : la franchise devient une démonstration de pouvoir.",
    correctZone: 'obnoxious-aggression',
  },
  {
    id: 's10',
    situation: "Un collègue dit en face que tout va bien, puis critique fortement la personne en dehors de la réunion.",
    context: "Posture : ni franchise utile, ni intention d'aide.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's11',
    situation: "Un manager évite un feedback difficile pour préserver son image de \"manager sympa\".",
    context: "Posture : il protège surtout son confort personnel.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's12',
    situation: "Un membre valide une décision en réunion, puis cherche discrètement à la saboter.",
    context: "Posture : absence de transparence et absence d'engagement sincère.",
    correctZone: 'manipulative-insincerity',
  },
  {
    id: 's13',
    situation: "Au lieu de dire \"Tu n'es pas assez rigoureux\", le Scrum Master reformule en observation précise.",
    context: "\"Sur les deux dernières stories, les critères d'acceptation n'étaient pas vérifiés avant passage en Done. Qu'est-ce qui t'aiderait à fiabiliser ce point ?\"",
    correctZone: 'towards-radical-candor',
  },
  {
    id: 's14',
    situation: "Au lieu d'éviter un feedback sur une facilitation confuse, un pair propose une aide concrète.",
    context: "\"J'ai eu du mal à suivre la séquence de l'atelier. Tu as une bonne intention de participation, et je peux t'aider à clarifier le déroulé si tu veux.\"",
    correctZone: 'towards-radical-candor',
  },
  {
    id: 's15',
    situation: "Au lieu de critiquer un développeur en public, le lead technique choisit un feedback direct en privé.",
    context: "\"Je veux revenir sur la revue de code. Certaines remarques étaient justes sur le fond, mais le ton a fermé la discussion. Comment peux-tu garder l'exigence technique sans braquer l'équipe ?\"",
    correctZone: 'towards-radical-candor',
  },
]

type DraggingItem =
  | { type: 'quadrant-label'; label: RadicalCandorQuadrant; fromPosition?: DiagramPosition }
  | { type: 'situation'; situationId: string; fromZone?: RadicalCandorExtendedZone }
  | null

const EMPTY_DIAGRAM: DiagramZones = { 'top-left': null, 'top-right': null, 'bottom-left': null, 'bottom-right': null }

export function RadicalCandorAtelier() {
  const { markComplete } = useWorkshopCompletion('radical-candor')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [diagramZones, setDiagramZones] = useState<DiagramZones>({ ...EMPTY_DIAGRAM })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<DraggingItem>(null)

  const isDirty = phase > 1 || Object.values(diagramZones).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedQuadrants = new Set(Object.values(diagramZones).filter((v): v is RadicalCandorQuadrant => v !== null))
  const paletteLabels = QUADRANTS.filter(q => !placedQuadrants.has(q.id))
  const phase1AllFilled = paletteLabels.length === 0
  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 4

  function handleLabelDragStart(label: RadicalCandorQuadrant, fromPosition?: DiagramPosition) {
    setDragging({ type: 'quadrant-label', label, fromPosition })
    setPhase1Result(null)
  }

  function handleDropOnDiagramZone(position: DiagramPosition) {
    if (!dragging || dragging.type !== 'quadrant-label') return
    const label = dragging.label
    const fromPosition = dragging.fromPosition
    setDiagramZones(prev => {
      const next = { ...prev }
      if (fromPosition) next[fromPosition] = null
      next[position] = label
      return next
    })
    setDragging(null)
  }

  function handleDropOnDiagramPalette() {
    if (!dragging || dragging.type !== 'quadrant-label' || !dragging.fromPosition) { setDragging(null); return }
    const fromPosition = dragging.fromPosition
    setDiagramZones(prev => ({ ...prev, [fromPosition]: null }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const pos of DIAGRAM_POSITIONS) {
      result[pos] = diagramZones[pos] === DIAGRAM_ANSWERS[pos]
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setDiagramZones({ ...EMPTY_DIAGRAM })
    setPhase1Result(null)
  }

  // Phase 2 helpers
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0
  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  function handleSituationDragStart(situationId: string, fromZone?: RadicalCandorExtendedZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnColumn(zone: RadicalCandorExtendedZone) {
    if (!dragging || dragging.type !== 'situation') return
    const id = dragging.situationId
    setSituationZones(prev => ({ ...prev, [id]: zone }))
    setDragging(null)
  }

  function handleDropOnPool() {
    if (!dragging || dragging.type !== 'situation' || !dragging.fromZone) { setDragging(null); return }
    const id = dragging.situationId
    setSituationZones(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setDragging(null)
  }

  function handleVerifyPhase2() {
    markComplete()
    const result: Record<string, boolean> = {}
    for (const s of SITUATIONS) {
      result[s.id] = situationZones[s.id] === s.correctZone
    }
    setPhase2Result(result)
  }

  function handleResetPhase2() {
    setSituationZones({})
    setPhase2Result(null)
  }

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'radical-candor')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Radical Candor</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? 'Phase 1 / 2 — Placez les 4 postures Radical Candor sur le diagramme Care Personally / Challenge Directly.'
              : 'Phase 2 / 2 — Associez chaque situation à la posture de feedback appropriée.'}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-diagram">
              <div className="tki-axis tki-axis--y">Care Personally ↑</div>
              <div className="rc-grid">
                {DIAGRAM_POSITIONS.map(pos => {
                  const placed = diagramZones[pos]
                  const quadrant = placed ? QUADRANTS.find(q => q.id === placed) : null
                  const verified = phase1Result !== null
                  const correct = phase1Result?.[pos]
                  return (
                    <div
                      key={pos}
                      data-zone={pos}
                      className={
                        'tki-zone' +
                        (placed ? ' tki-zone--filled' : '') +
                        (verified ? (correct ? ' tki-zone--correct' : ' tki-zone--wrong') : '')
                      }
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDropOnDiagramZone(pos)}
                    >
                      {quadrant ? (
                        <span
                          data-label={quadrant.id}
                          className="scrum-label scrum-label--placed"
                          draggable
                          onDragStart={() => handleLabelDragStart(quadrant.id, pos)}
                        >
                          {quadrant.label}
                        </span>
                      ) : (
                        <span className="scrum-zone__placeholder">?</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="tki-axis tki-axis--x">Challenge Directly →</div>
            </div>

            {phase1Result && (
              <div className="scrum-score-banner">
                <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
                  {phase1Score} / 4 correct{phase1Perfect ? ' — Parfait !' : ''}
                </span>
              </div>
            )}

            <div className="scrum-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnDiagramPalette}>
              <p className="scrum-palette__title">Postures à placer</p>
              <div className="scrum-palette__labels">
                {paletteLabels.map(q => (
                  <span
                    key={q.id}
                    data-label={q.id}
                    className="scrum-label"
                    draggable
                    onDragStart={() => handleLabelDragStart(q.id)}
                  >
                    {q.label}
                  </span>
                ))}
                {paletteLabels.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les postures ont été placées</span>
                )}
              </div>
            </div>

            <div className="scrum-actions">
              <button className="btn btn--primary" onClick={handleVerifyPhase1} disabled={!phase1AllFilled}>
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
              {EXTENDED_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-column={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnColumn(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {SITUATIONS.filter(s => situationZones[s.id] === zone.id).map(s => {
                      const resultClass = phase2Result !== null
                        ? phase2Result[s.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={s.id}
                          data-situation={s.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleSituationDragStart(s.id, zone.id)}
                        >
                          <strong>{s.situation}</strong>
                          <br />
                          <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>{s.context}</em>
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
                    ? "Tu sais reconnaître et distinguer franchise utile, fausse gentillesse, agressivité et insincérité."
                    : "À consolider : certaines postures se ressemblent, mais l'équilibre entre attention personnelle et défi direct doit être mieux distingué."}
                </p>
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnPool}
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
                    <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)' }}>{s.context}</em>
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
              {phase2Result && phase2Score !== 15 && (
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

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project /Users/loicrossignol/Desktop/Igensia/Scrum\ Master/scrum-master-sim/tsconfig.json 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/components/RadicalCandorAtelier/index.tsx
git commit -m "feat(radical-candor): add component + rc-grid CSS"
```

---

### Task 3: Create tests

**Files:**
- Create: `src/components/RadicalCandorAtelier/RadicalCandorAtelier.test.tsx`

- [ ] **Step 1: Write the tests**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { RadicalCandorAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'radical-candor',
      slug: 'radical-candor',
      title: 'Radical Candor',
      route: '/ateliers/radical-candor',
      categorySlug: 'conflict-and-communication',
      toolName: 'Radical Candor',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: 'Apprendre à défier directement tout en montrant que vous vous souciez personnellement.',
    },
  ],
}))

vi.mock('../../features/gamification', () => {
  const storeState = {
    events: [],
    recordEvent: vi.fn(),
    getCompletedContentSlugs: () => [],
  }
  const useGamificationStore = Object.assign(
    (selector: (s: typeof storeState) => unknown) => selector(storeState),
    { getState: () => storeState }
  )
  return { useGamificationStore }
})

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/radical-candor', element: <RadicalCandorAtelier /> }],
    { initialEntries: ['/ateliers/radical-candor'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragLabel(quadrantId: string, zoneId: string) {
  const label = document.querySelector(`[data-label="${quadrantId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(label)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, columnId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const column = document.querySelector(`[data-column="${columnId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(column)
  fireEvent.drop(column)
}

const CORRECT_P1: [string, string][] = [
  ['ruinous-empathy', 'top-left'],
  ['radical-candor', 'top-right'],
  ['manipulative-insincerity', 'bottom-left'],
  ['obnoxious-aggression', 'bottom-right'],
]

const CORRECT_P2: [string, string][] = [
  ['s1', 'radical-candor'], ['s2', 'radical-candor'], ['s3', 'radical-candor'],
  ['s4', 'ruinous-empathy'], ['s5', 'ruinous-empathy'], ['s6', 'ruinous-empathy'],
  ['s7', 'obnoxious-aggression'], ['s8', 'obnoxious-aggression'], ['s9', 'obnoxious-aggression'],
  ['s10', 'manipulative-insincerity'], ['s11', 'manipulative-insincerity'], ['s12', 'manipulative-insincerity'],
  ['s13', 'towards-radical-candor'], ['s14', 'towards-radical-candor'], ['s15', 'towards-radical-candor'],
]

describe('RadicalCandorAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 4 labels in the palette', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-label]')).toHaveLength(4)
  })

  it('Vérifier button is disabled until all 4 labels are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('places a label in a diagram zone via drag-and-drop', () => {
    renderAtelier()
    dragLabel('radical-candor', 'top-right')
    const zone = document.querySelector('[data-zone="top-right"]')!
    expect(zone.querySelector('[data-label="radical-candor"]')).toBeInTheDocument()
  })

  it('returns a label to palette on drop on palette', () => {
    renderAtelier()
    dragLabel('radical-candor', 'top-right')
    const palette = document.querySelector('.scrum-palette')!
    const label = document.querySelector('[data-zone="top-right"] [data-label="radical-candor"]')!
    fireEvent.dragStart(label)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.scrum-palette [data-label="radical-candor"]')).toBeInTheDocument()
  })

  it('shows 4/4 and Phase suivante on all-correct phase 1', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/4 \/ 4/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    // Place all labels wrong (swapped)
    dragLabel('radical-candor', 'top-left')
    dragLabel('ruinous-empathy', 'top-right')
    dragLabel('obnoxious-aggression', 'bottom-left')
    dragLabel('manipulative-insincerity', 'bottom-right')
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in a column via drag-and-drop (phase 2)', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'radical-candor')
    const column = document.querySelector('[data-column="radical-candor"]')!
    expect(column.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    CORRECT_P2.forEach(([id, col]) => dragSituation(id, col))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    // All situations placed wrong
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'ruinous-empathy'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'radical-candor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    CORRECT_P1.forEach(([label, zone]) => dragLabel(label, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'ruinous-empathy'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'radical-candor'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests — expect PASS**

Run: `npx vitest run src/components/RadicalCandorAtelier/RadicalCandorAtelier.test.tsx`
Expected: 11 tests pass, 0 failures

- [ ] **Step 3: Commit**

```bash
git add src/components/RadicalCandorAtelier/RadicalCandorAtelier.test.tsx
git commit -m "test(radical-candor): add 11 tests for both phases"
```

---

### Task 4: Register in definitions.ts and App.tsx

**Files:**
- Modify: `src/data/workshops/definitions.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import in `src/data/workshops/definitions.ts`**

After the existing `import { sixHatsDataset } from './datasets/six-hats'` line, add:

```typescript
import { radicalCandorDataset } from './datasets/radical-candor'
```

- [ ] **Step 2: Move radical-candor from COMING_SOON to EXISTING in `definitions.ts`**

Remove the COMING_SOON entry (find by `id: 'radical-candor'` — it's in the conflict-and-communication additions block):
```typescript
{ id: 'radical-candor', slug: 'radical-candor', title: 'Radical Candor', route: '/ateliers/radical-candor', categorySlug: 'conflict-and-communication', toolName: 'Radical Candor', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Apprendre à défier directement tout en montrant que vous vous souciez personnellement.', comingSoon: true },
```

Add this entry to the EXISTING array (after the `six-hats` entry):
```typescript
  {
    id: 'radical-candor',
    slug: 'radical-candor',
    title: 'Radical Candor',
    route: '/ateliers/radical-candor',
    categorySlug: 'conflict-and-communication',
    toolName: 'Radical Candor',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Distinguez les 4 postures du modèle Radical Candor, puis identifiez la posture appropriée dans 15 situations Scrum et Agile.",
    pedagogy: {
      objectives: [
        'Distinguer les 4 quadrants du modèle Radical Candor',
        'Reconnaître un feedback trop vague, trop brutal ou insincère',
        'Formuler un feedback direct sans attaquer la personne',
        'Montrer une intention d\'aide explicite',
        'Utiliser Radical Candor dans une rétrospective, une revue de code ou un accompagnement Scrum Master',
      ],
      toolExplanation: "Radical Candor (Kim Scott) repose sur deux dimensions : montrer que l'on se soucie personnellement de la personne (Care Personally) et la défier directement (Challenge Directly). Le quadrant cible combine les deux. Les autres quadrants — Ruinous Empathy (care sans challenge), Obnoxious Aggression (challenge sans care) et Manipulative Insincerity (ni l'un ni l'autre) — décrivent des postures à éviter.",
      whenToUse: [
        'Pour donner un feedback individuel à la fois direct et humain',
        'En rétrospective pour nommer un comportement sans attaquer la personne',
        'Pour accompagner un Scrum Master sur sa posture de feedback',
      ],
      expectedOutput: [
        'Positionnement maîtrisé des 4 postures sur le diagramme',
        'Capacité à identifier et reformuler un feedback trop vague, brutal ou insincère',
      ],
    },
    dataset: radicalCandorDataset,
  },
```

- [ ] **Step 3: Add import and route in `src/App.tsx`**

After the line `import { SixHatsAtelier } from './components/SixHatsAtelier'`, add:
```typescript
import { RadicalCandorAtelier } from './components/RadicalCandorAtelier'
```

After the route `{ path: '/ateliers/six-hats', element: <SixHatsAtelier /> }`, add:
```typescript
{ path: '/ateliers/radical-candor', element: <RadicalCandorAtelier /> },
```

- [ ] **Step 4: Run all tests to confirm nothing is broken**

Run: `npx vitest run --reporter=verbose 2>&1 | tail -20`
Expected: all tests pass (green), new 11 Radical Candor tests included

- [ ] **Step 5: Commit**

```bash
git add src/data/workshops/definitions.ts src/App.tsx
git commit -m "feat(radical-candor): register atelier in definitions and routing"
```

---

## Self-Review

**1. Spec coverage:**

| Spec requirement | Covered by |
|---|---|
| Phase 1: 4 postures on 2×2 diagram (Care Personally × Challenge Directly) | Task 2 — diagram layout with DIAGRAM_ANSWERS |
| Phase 1: palette of 4 draggable labels | Task 2 — `paletteLabels` from QUADRANTS |
| Phase 1: Vérifier disabled until 4/4 placed | Task 2 — `disabled={!phase1AllFilled}` |
| Phase 1: 4/4 → Parfait + Phase suivante | Task 2 — `phase1Perfect` check |
| Phase 1: <4/4 → wrong zones in red, Réessayer | Task 2 — `phase1Result` classes |
| Phase 2: 15 situations → 5 columns | Task 2 — EXTENDED_ZONES + SITUATIONS |
| Phase 2: situations pool + drag to columns | Task 2 — `poolSituations`, `handleDropOnColumn` |
| Phase 2: Vérifier disabled until 15 placed | Task 2 — `disabled={!phase2AllPlaced}` |
| Phase 2: 15/15 → Maîtrisé (green badge) | Task 2 — `badge--green` |
| Phase 2: <15/15 → À consolider + Réessayer phase 2 | Task 2 — `badge--orange` + reset |
| markComplete() on Phase 2 verify | Task 2 — called in `handleVerifyPhase2` |
| ConfirmLeaveModal when isDirty | Task 2 — `useExitGuard` |
| WorkshopPedagogyPanel | Task 4 — `dataset: radicalCandorDataset` in definitions |
| Route `/ateliers/radical-candor` | Task 4 |

**2. Placeholder scan:** No TBD, no "add error handling", no "similar to Task N" — all code is explicit.

**3. Type consistency:**
- `RadicalCandorQuadrant` defined at top, used in `DiagramZones` and `DraggingItem.label` — consistent
- `RadicalCandorExtendedZone` defined at top, used in `SituationZones`, `DraggingItem.fromZone`, `handleDropOnColumn` parameter — consistent
- `DiagramPosition` used in `DiagramZones`, `DraggingItem.fromPosition`, `handleDropOnDiagramZone` parameter — consistent
- `DIAGRAM_POSITIONS: DiagramPosition[]` iterated in JSX and in `handleVerifyPhase1` — consistent
- `EXTENDED_ZONES` iterated in Phase 2 JSX, column uses `data-column={zone.id}` — matches test helper `dragSituation` which queries `[data-column="${columnId}"]` — consistent
- `CORRECT_P1` uses position values matching `data-zone` attributes — consistent
- `CORRECT_P2` zone values match `RadicalCandorExtendedZone` literals — consistent
