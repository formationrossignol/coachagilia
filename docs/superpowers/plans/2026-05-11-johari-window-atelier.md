# Johari Window Atelier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-phase drag-and-drop Johari Window atelier where learners first classify 12 items into 4 core zones (open/blind/hidden/unknown), then assign 15 team situations to 5 extended zones (adds towards-open).

**Architecture:** Two-phase pattern similar to EmpathyMapAtelier, but Phase 2 uses a fundamentally different state structure: `SituationZones = Record<string, JohariExtendedZone>` (maps situationId → zone) rather than `Record<Zone, string[]>`. This allows simpler state updates (no array filtering needed) but requires different render logic.

**Tech Stack:** React 18, TypeScript, Vitest + React Testing Library, native HTML5 drag-and-drop, Zustand (via `useWorkshopCompletion` hook), React Router v6.

---

## File Structure

- Create: `src/data/workshops/datasets/johari-window.ts` — ClassificationDataset for Phase 1
- Create: `src/components/JohariWindowAtelier/index.tsx` — full two-phase component
- Create: `src/components/JohariWindowAtelier/JohariWindowAtelier.test.tsx` — 11 tests
- Modify: `src/data/workshops/definitions.ts` — import dataset, add EXISTING entry, remove COMING_SOON
- Modify: `src/App.tsx` — import component, add route

---

### Task 1: Create johari-window dataset file

**Files:**
- Create: `src/data/workshops/datasets/johari-window.ts`

- [ ] **Step 1: Write the file**

```typescript
import type { ClassificationDataset } from '../types'

export const johariWindowDataset: ClassificationDataset = {
  zones: [
    { id: 'open',    label: 'Zone ouverte',  description: 'Ce que je connais de moi et que les autres connaissent aussi.' },
    { id: 'blind',   label: 'Zone aveugle',  description: 'Ce que les autres perçoivent de moi, mais que je ne vois pas clairement.' },
    { id: 'hidden',  label: 'Zone cachée',   description: 'Ce que je connais de moi, mais que je ne partage pas avec les autres.' },
    { id: 'unknown', label: 'Zone inconnue', description: "Ce qui n'est encore connu ni de moi, ni des autres." },
  ],
  cards: [
    { id: 'z1',  text: "Je sais que je suis à l'aise pour faciliter les rétrospectives, et l'équipe me le reconnaît.",          expectedZone: 'open' },
    { id: 'z2',  text: "Je connais mon rôle dans l'équipe et les autres savent sur quoi ils peuvent me solliciter.",              expectedZone: 'open' },
    { id: 'z3',  text: "Je dis clairement que j'ai besoin de temps pour préparer les ateliers, et l'équipe en tient compte.",    expectedZone: 'open' },
    { id: 'z4',  text: "L'équipe me trouve parfois trop direct en réunion, mais je ne m'en rends pas compte.",                   expectedZone: 'blind' },
    { id: 'z5',  text: "Les autres voient que je coupe souvent la parole, alors que je pense simplement accélérer la discussion.", expectedZone: 'blind' },
    { id: 'z6',  text: "Je crois être disponible, mais plusieurs personnes hésitent à venir me voir.",                           expectedZone: 'blind' },
    { id: 'z7',  text: "Je suis inquiet sur ma capacité à tenir mon rôle, mais je ne l'ai pas exprimé.",                        expectedZone: 'hidden' },
    { id: 'z8',  text: "Je sais que je ne comprends pas bien un sujet technique, mais je fais comme si tout allait bien.",       expectedZone: 'hidden' },
    { id: 'z9',  text: "Je suis frustré par certaines décisions, mais je garde cela pour moi.",                                  expectedZone: 'hidden' },
    { id: 'z10', text: "Je n'ai jamais été confronté à une crise projet majeure, donc je ne sais pas encore comment je réagirais.", expectedZone: 'unknown' },
    { id: 'z11', text: "L'équipe ne sait pas encore quelles compétences pourraient émerger si je prenais un nouveau rôle.",      expectedZone: 'unknown' },
    { id: 'z12', text: "Personne ne sait encore comment je me comporterais dans une situation de forte pression client.",         expectedZone: 'unknown' },
  ],
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/workshops/datasets/johari-window.ts
git commit -m "feat(data): add johari-window dataset"
```

---

### Task 2: Create JohariWindowAtelier component

**Files:**
- Create: `src/components/JohariWindowAtelier/index.tsx`

**Critical architectural difference from previous ateliers:**
Phase 2 uses `SituationZones = Record<string, JohariExtendedZone>` — a map from situationId to the zone where it was placed. This is different from `Record<Zone, string[]>` used by SolutionFocusedAtelier and EmpathyMapAtelier. Consequences:
- Initial state: `{}` (empty object)
- Drop on zone: `{ ...prev, [situationId]: zone }` (no array filter needed)
- Drop on pool: delete the key — capture `id = dragging.situationId` before the callback, then `delete next[id]`
- Column render: `SITUATIONS.filter(s => situationZones[s.id] === zone.id)`
- Pool render: `SITUATIONS.filter(s => situationZones[s.id] === undefined)`
- All placed check: `SITUATIONS.filter(s => situationZones[s.id] === undefined).length === 0`
- Reset: `setSituationZones({})`

**Additional unique aspects:**
- 'towards-open' is a hyphenated zone key in JohariExtendedZone
- Phase 2 situation cards optionally show a `transformation` note (e.g., "Zone aveugle → Zone ouverte")
- Phase 1 cards use `data-card` attribute; Phase 2 situations use `data-situation` attribute
- Both phases share `data-zone` for columns (exclusive rendering prevents conflicts)
- `useWorkshopCompletion('johari-window')`
- `WORKSHOP_DEFINITIONS.find(w => w.id === 'johari-window')`

- [ ] **Step 1: Write the component**

```typescript
import { useState } from 'react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type JohariZone = 'open' | 'blind' | 'hidden' | 'unknown'
type JohariExtendedZone = 'open' | 'blind' | 'hidden' | 'unknown' | 'towards-open'
type JohariZones = Record<JohariZone, string[]>
type SituationZones = Record<string, JohariExtendedZone>

const JOHARI_ZONES: { id: JohariZone; label: string; description: string }[] = [
  { id: 'open',    label: 'Zone ouverte',  description: 'Ce que je connais de moi et que les autres connaissent aussi.' },
  { id: 'blind',   label: 'Zone aveugle',  description: 'Ce que les autres perçoivent de moi, mais que je ne vois pas clairement.' },
  { id: 'hidden',  label: 'Zone cachée',   description: 'Ce que je connais de moi, mais que je ne partage pas avec les autres.' },
  { id: 'unknown', label: 'Zone inconnue', description: "Ce qui n'est encore connu ni de moi, ni des autres." },
]

const JOHARI_EXTENDED_ZONES: { id: JohariExtendedZone; label: string; description: string }[] = [
  { id: 'open',         label: 'Zone ouverte',     description: 'Information connue de soi et connue des autres.' },
  { id: 'blind',        label: 'Zone aveugle',     description: 'Information visible par les autres mais non consciente pour soi.' },
  { id: 'hidden',       label: 'Zone cachée',      description: 'Information connue de soi mais non partagée aux autres.' },
  { id: 'unknown',      label: 'Zone inconnue',    description: "Information non encore connue de soi ni des autres." },
  { id: 'towards-open', label: 'Vers zone ouverte', description: "Situation où le feedback, le partage ou l'expérimentation agrandit la zone ouverte." },
]

type ZoneCard = { id: string; text: string; correctZone: JohariZone }

const ZONE_CARDS: ZoneCard[] = [
  { id: 'z1',  text: "Je sais que je suis à l'aise pour faciliter les rétrospectives, et l'équipe me le reconnaît.",           correctZone: 'open' },
  { id: 'z2',  text: "Je connais mon rôle dans l'équipe et les autres savent sur quoi ils peuvent me solliciter.",              correctZone: 'open' },
  { id: 'z3',  text: "Je dis clairement que j'ai besoin de temps pour préparer les ateliers, et l'équipe en tient compte.",    correctZone: 'open' },
  { id: 'z4',  text: "L'équipe me trouve parfois trop direct en réunion, mais je ne m'en rends pas compte.",                   correctZone: 'blind' },
  { id: 'z5',  text: "Les autres voient que je coupe souvent la parole, alors que je pense simplement accélérer la discussion.", correctZone: 'blind' },
  { id: 'z6',  text: "Je crois être disponible, mais plusieurs personnes hésitent à venir me voir.",                           correctZone: 'blind' },
  { id: 'z7',  text: "Je suis inquiet sur ma capacité à tenir mon rôle, mais je ne l'ai pas exprimé.",                        correctZone: 'hidden' },
  { id: 'z8',  text: "Je sais que je ne comprends pas bien un sujet technique, mais je fais comme si tout allait bien.",       correctZone: 'hidden' },
  { id: 'z9',  text: "Je suis frustré par certaines décisions, mais je garde cela pour moi.",                                  correctZone: 'hidden' },
  { id: 'z10', text: "Je n'ai jamais été confronté à une crise projet majeure, donc je ne sais pas encore comment je réagirais.", correctZone: 'unknown' },
  { id: 'z11', text: "L'équipe ne sait pas encore quelles compétences pourraient émerger si je prenais un nouveau rôle.",      correctZone: 'unknown' },
  { id: 'z12', text: "Personne ne sait encore comment je me comporterais dans une situation de forte pression client.",         correctZone: 'unknown' },
]

type Situation = { id: string; text: string; transformation?: string; correctZone: JohariExtendedZone }

const SITUATIONS: Situation[] = [
  { id: 's1',  text: "L'équipe sait que le Scrum Master est très à l'aise pour faciliter les ateliers complexes.",                                                                             correctZone: 'open' },
  { id: 's2',  text: "Le Product Owner explique clairement qu'il a besoin d'aide sur la priorisation technique.",                                                                              correctZone: 'open' },
  { id: 's3',  text: "Un développeur partage à l'équipe qu'il préfère travailler sur les sujets d'architecture.",                                                                             correctZone: 'open' },
  { id: 's4',  text: "Un membre pense être synthétique, mais plusieurs collègues trouvent ses explications confuses.",                                                                         correctZone: 'blind' },
  { id: 's5',  text: "Le Scrum Master croit laisser de l'espace, mais l'équipe ressent qu'il prend trop souvent la parole.",                                                                  correctZone: 'blind' },
  { id: 's6',  text: "Un développeur pense aider en corrigeant les autres, mais cela est vécu comme du contrôle.",                                                                            correctZone: 'blind' },
  { id: 's7',  text: "Le Product Owner est inquiet sur la roadmap, mais ne l'a pas encore dit à l'équipe.",                                                                                   correctZone: 'hidden' },
  { id: 's8',  text: "Un membre ne comprend pas une décision d'architecture, mais n'ose pas poser de question.",                                                                               correctZone: 'hidden' },
  { id: 's9',  text: "Le Scrum Master doute de la maturité agile de l'équipe, mais garde cette analyse pour lui.",                                                                            correctZone: 'hidden' },
  { id: 's10', text: "Personne ne sait encore comment l'équipe réagirait face à une interruption de production majeure.",                                                                     correctZone: 'unknown' },
  { id: 's11', text: "Un développeur n'a jamais animé d'atelier, et l'équipe ne sait pas encore s'il pourrait être à l'aise dans ce rôle.",                                                  correctZone: 'unknown' },
  { id: 's12', text: "L'équipe n'a jamais travaillé en binôme avec un métier critique, donc ses capacités d'adaptation restent inconnues.",                                                  correctZone: 'unknown' },
  { id: 's13', text: "Après un feedback en rétrospective, un membre réalise qu'il interrompt souvent les discussions et décide d'y faire attention.", transformation: "Zone aveugle → Zone ouverte",  correctZone: 'towards-open' },
  { id: 's14', text: "Le Product Owner partage une contrainte métier jusque-là gardée pour lui, ce qui aide l'équipe à comprendre ses arbitrages.",   transformation: "Zone cachée → Zone ouverte",   correctZone: 'towards-open' },
  { id: 's15', text: "Un développeur expérimente l'animation d'un refinement et découvre une compétence reconnue ensuite par l'équipe.",              transformation: "Zone inconnue → Zone ouverte", correctZone: 'towards-open' },
]

type DraggingItem =
  | { type: 'zone-card';  cardId: string;      fromZone?: JohariZone }
  | { type: 'situation';  situationId: string; fromZone?: JohariExtendedZone }
  | null

export function JohariWindowAtelier() {
  const { markComplete } = useWorkshopCompletion('johari-window')
  const [phase, setPhase] = useState<1 | 2>(1)

  const [johariZones, setJohariZones] = useState<JohariZones>({
    open: [], blind: [], hidden: [], unknown: [],
  })
  const [phase1Result, setPhase1Result] = useState<Record<string, boolean> | null>(null)

  const [situationZones, setSituationZones] = useState<SituationZones>({})
  const [phase2Result, setPhase2Result] = useState<Record<string, boolean> | null>(null)

  const [dragging, setDragging] = useState<DraggingItem>(null)

  const isDirty = phase > 1 || Object.values(johariZones).some(arr => arr.length > 0)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)

  // Phase 1 helpers
  const placedCardIds = new Set(Object.values(johariZones).flat())
  const paletteCards = ZONE_CARDS.filter(c => !placedCardIds.has(c.id))
  const phase1AllPlaced = paletteCards.length === 0

  function handleCardDragStart(cardId: string, fromZone?: JohariZone) {
    setDragging({ type: 'zone-card', cardId, fromZone })
    setPhase1Result(null)
  }

  function handleDropOnJohariZone(zone: JohariZone) {
    if (!dragging || dragging.type !== 'zone-card') return
    setJohariZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) {
        next[dragging.fromZone] = next[dragging.fromZone].filter(id => id !== dragging.cardId)
      }
      if (!next[zone].includes(dragging.cardId)) next[zone] = [...next[zone], dragging.cardId]
      return next
    })
    setDragging(null)
  }

  function handleDropOnCardPalette() {
    if (!dragging || dragging.type !== 'zone-card' || !dragging.fromZone) { setDragging(null); return }
    setJohariZones(prev => ({
      ...prev,
      [dragging.fromZone!]: prev[dragging.fromZone!].filter(id => id !== dragging.cardId),
    }))
    setDragging(null)
  }

  function handleVerifyPhase1() {
    const result: Record<string, boolean> = {}
    for (const c of ZONE_CARDS) {
      const zone = (Object.entries(johariZones) as [JohariZone, string[]][])
        .find(([, ids]) => ids.includes(c.id))?.[0]
      result[c.id] = zone === c.correctZone
    }
    setPhase1Result(result)
  }

  function handleResetPhase1() {
    setJohariZones({ open: [], blind: [], hidden: [], unknown: [] })
    setPhase1Result(null)
  }

  const phase1Score = phase1Result ? Object.values(phase1Result).filter(Boolean).length : null
  const phase1Perfect = phase1Score === 12

  // Phase 2 helpers
  const poolSituations = SITUATIONS.filter(s => situationZones[s.id] === undefined)
  const phase2AllPlaced = poolSituations.length === 0

  function handleSituationDragStart(situationId: string, fromZone?: JohariExtendedZone) {
    setDragging({ type: 'situation', situationId, fromZone })
    setPhase2Result(null)
  }

  function handleDropOnExtendedZone(zone: JohariExtendedZone) {
    if (!dragging || dragging.type !== 'situation') return
    const id = dragging.situationId
    setSituationZones(prev => ({ ...prev, [id]: zone }))
    setDragging(null)
  }

  function handleDropOnSituationPool() {
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

  const phase2Score = phase2Result ? Object.values(phase2Result).filter(Boolean).length : null

  const workshopDef = WORKSHOP_DEFINITIONS.find(w => w.id === 'johari-window')!

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={workshopDef} />
        <header className="atelier-header">
          <h1 className="atelier-title">Fenêtre de Johari</h1>
          <p className="atelier-subtitle">
            {phase === 1
              ? "Phase 1 / 2 — Classez les 12 cartes dans la bonne zone de la Fenêtre de Johari."
              : "Phase 2 / 2 — Associez chaque situation à la zone de Johari correspondante."}
          </p>
        </header>

        {phase === 1 && (
          <>
            <div className="tki-columns">
              {JOHARI_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-zone={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnJohariZone(zone.id)}
                >
                  <h3 className="tki-column__title">{zone.label}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{zone.description}</p>
                  <div className="tki-column__cards">
                    {johariZones[zone.id].map(cardId => {
                      const card = ZONE_CARDS.find(x => x.id === cardId)!
                      const resultClass = phase1Result !== null
                        ? phase1Result[card.id] ? ' tki-situation-card--correct' : ' tki-situation-card--wrong'
                        : ''
                      return (
                        <div
                          key={card.id}
                          data-card={card.id}
                          className={`tki-situation-card${resultClass}`}
                          draggable
                          onDragStart={() => handleCardDragStart(card.id, zone.id)}
                        >
                          {card.text}
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
                    Tu sais distinguer les 4 zones du modèle : ouverte, aveugle, cachée et inconnue.
                  </p>
                )}
              </div>
            )}

            <div
              className="tki-pool"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnCardPalette}
            >
              <p className="scrum-palette__title">Cartes à classer</p>
              <div className="tki-pool__cards">
                {paletteCards.map(card => (
                  <div
                    key={card.id}
                    data-card={card.id}
                    className="tki-situation-card"
                    draggable
                    onDragStart={() => handleCardDragStart(card.id)}
                  >
                    {card.text}
                  </div>
                ))}
                {paletteCards.length === 0 && (
                  <span className="scrum-palette__empty">Toutes les cartes ont été classées</span>
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
              {JOHARI_EXTENDED_ZONES.map(zone => (
                <div
                  key={zone.id}
                  data-zone={zone.id}
                  className="tki-column"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDropOnExtendedZone(zone.id)}
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
                          {s.text}
                          {s.transformation && (
                            <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                              → {s.transformation}
                            </em>
                          )}
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
                    ? "Tu sais utiliser Johari pour identifier les angles morts, encourager le feedback et développer la connaissance mutuelle."
                    : "À consolider : certaines situations sont proches, mais la différence entre zone aveugle, cachée et inconnue doit être mieux distinguée."}
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
                    {s.text}
                    {s.transformation && (
                      <em style={{ fontSize: '0.8em', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                        → {s.transformation}
                      </em>
                    )}
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

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/JohariWindowAtelier/index.tsx
git commit -m "feat(atelier): JohariWindowAtelier component — two-phase drag-and-drop"
```

---

### Task 3: Create JohariWindowAtelier tests

**Files:**
- Create: `src/components/JohariWindowAtelier/JohariWindowAtelier.test.tsx`

Phase 1 correct mapping: z1–z3→open, z4–z6→blind, z7–z9→hidden, z10–z12→unknown
Phase 2 correct mapping: s1–s3→open, s4–s6→blind, s7–s9→hidden, s10–s12→unknown, s13–s15→towards-open

Attribute convention:
- Phase 1 columns: `data-zone` | Phase 1 cards: `data-card`
- Phase 2 columns: `data-zone` | Phase 2 situations: `data-situation`

Two drag helpers: `dragCard` for Phase 1, `dragSituation` for Phase 2.

- [ ] **Step 1: Write the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { JohariWindowAtelier } from './index'

vi.mock('../../data/workshops', () => ({
  WORKSHOP_DEFINITIONS: [
    {
      id: 'johari-window',
      slug: 'johari-window',
      title: 'Fenêtre de Johari',
      route: '/ateliers/johari-window',
      categorySlug: 'conflict-and-communication',
      toolName: 'Johari Window',
      level: 'intermediate',
      durationMinutes: 15,
      interactionType: 'drag-and-drop',
      summary: "Comprendre les zones d'aveuglement et améliorer la connaissance de soi dans l'équipe.",
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
    [{ path: '/ateliers/johari-window', element: <JohariWindowAtelier /> }],
    { initialEntries: ['/ateliers/johari-window'] }
  )
  return render(<RouterProvider router={router} />)
}

function dragCard(cardId: string, zoneId: string) {
  const card = document.querySelector(`[data-card="${cardId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(card)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

function dragSituation(situationId: string, zoneId: string) {
  const situation = document.querySelector(`[data-situation="${situationId}"]`)!
  const zone = document.querySelector(`[data-zone="${zoneId}"]`)!
  fireEvent.dragStart(situation)
  fireEvent.dragOver(zone)
  fireEvent.drop(zone)
}

describe('JohariWindowAtelier', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders phase 1 with 12 cards in the palette', () => {
    renderAtelier()
    expect(screen.getByText(/Phase 1/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-card]')).toHaveLength(12)
  })

  it('Vérifier button is disabled until all 12 cards are placed', () => {
    renderAtelier()
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).toBeDisabled()
  })

  it('places a card in a johari zone via drag-and-drop', () => {
    renderAtelier()
    dragCard('z1', 'open')
    const zone = document.querySelector('[data-zone="open"]')!
    expect(zone.querySelector('[data-card="z1"]')).toBeInTheDocument()
  })

  it('returns a card to the palette on drop on palette', () => {
    renderAtelier()
    dragCard('z1', 'open')
    const palette = document.querySelector('.tki-pool')!
    const card = document.querySelector('[data-zone="open"] [data-card="z1"]')!
    fireEvent.dragStart(card)
    fireEvent.dragOver(palette)
    fireEvent.drop(palette)
    expect(document.querySelector('.tki-pool [data-card="z1"]')).toBeInTheDocument()
  })

  it('enables Vérifier and shows 12/12 on all-correct phase 1', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    const btn = screen.getByRole('button', { name: 'Vérifier' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)
    expect(screen.getByText(/12 \/ 12/)).toBeInTheDocument()
    expect(screen.getByText(/Phase suivante/)).toBeInTheDocument()
  })

  it('shows Réessayer on wrong phase 1 result', () => {
    renderAtelier()
    ;['z1','z2','z3','z4','z5','z6'].forEach(id => dragCard(id, 'open'))
    ;['z7','z8','z9','z10','z11','z12'].forEach(id => dragCard(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByText(/Phase suivante/)).not.toBeInTheDocument()
  })

  it('renders phase 2 with 15 situations after phase 1 success', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    expect(screen.getByText(/Phase 2/)).toBeInTheDocument()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('places a situation in an extended zone via drag-and-drop (phase 2)', () => {
    renderAtelier()
    const correct = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    correct.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    dragSituation('s1', 'open')
    const zone = document.querySelector('[data-zone="open"]')!
    expect(zone.querySelector('[data-situation="s1"]')).toBeInTheDocument()
  })

  it('shows 15/15 and Maîtrisé on all-correct phase 2', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    const p2 = [
      ['s1','open'],['s2','open'],['s3','open'],
      ['s4','blind'],['s5','blind'],['s6','blind'],
      ['s7','hidden'],['s8','hidden'],['s9','hidden'],
      ['s10','unknown'],['s11','unknown'],['s12','unknown'],
      ['s13','towards-open'],['s14','towards-open'],['s15','towards-open'],
    ]
    p2.forEach(([id, zone]) => dragSituation(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15/)).toBeInTheDocument()
    expect(screen.getByText(/Maîtrisé/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 on wrong phase 2 result', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))

    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'open'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('resets phase 2 situations on Réessayer phase 2', () => {
    renderAtelier()
    const p1 = [
      ['z1','open'],['z2','open'],['z3','open'],
      ['z4','blind'],['z5','blind'],['z6','blind'],
      ['z7','hidden'],['z8','hidden'],['z9','hidden'],
      ['z10','unknown'],['z11','unknown'],['z12','unknown'],
    ]
    p1.forEach(([id, zone]) => dragCard(id, zone))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
    ;['s1','s2','s3','s4','s5','s6','s7','s8'].forEach(id => dragSituation(id, 'open'))
    ;['s9','s10','s11','s12','s13','s14','s15'].forEach(id => dragSituation(id, 'blind'))
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('.tki-pool [data-situation]')).toHaveLength(15)
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/components/JohariWindowAtelier/JohariWindowAtelier.test.tsx
```

Expected: 11 tests passing.

- [ ] **Step 3: Commit**

```bash
git add src/components/JohariWindowAtelier/JohariWindowAtelier.test.tsx
git commit -m "test(atelier): JohariWindowAtelier — phase 1 and phase 2 tests"
```

---

### Task 4: Register johari-window in definitions.ts

**Files:**
- Modify: `src/data/workshops/definitions.ts`

The COMING_SOON entry (line ~506) is:
```typescript
{ id: 'johari-window', slug: 'johari-window', title: 'Fenêtre de Johari', route: '/ateliers/johari-window', categorySlug: 'conflict-and-communication', toolName: 'Johari Window', level: 'intermediate', durationMinutes: 15, interactionType: 'matrix', summary: "Comprendre les zones d'aveuglement et améliorer la connaissance de soi dans l'équipe.", comingSoon: true },
```

- [ ] **Step 1: Add import**

After `import { empathyMapDataset } from './datasets/empathy-map'` (line ~16), add:

```typescript
import { johariWindowDataset } from './datasets/johari-window'
```

- [ ] **Step 2: Add EXISTING entry**

After the `empathy-map` entry and before the closing `]` of EXISTING, add:

```typescript
  {
    id: 'johari-window',
    slug: 'johari-window',
    title: 'Fenêtre de Johari',
    route: '/ateliers/johari-window',
    categorySlug: 'conflict-and-communication',
    toolName: 'Johari Window',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les 4 zones de la Fenêtre de Johari, puis diagnostiquez des situations d'équipe en distinguant zone ouverte, aveugle, cachée, inconnue et mouvement vers l'ouverture.",
    pedagogy: {
      objectives: [
        "Distinguer les 4 zones de la Fenêtre de Johari",
        "Repérer une zone aveugle dans une situation d'équipe",
        "Comprendre le rôle du feedback dans la réduction des angles morts",
        "Comprendre le rôle du partage volontaire dans la réduction de la zone cachée",
        "Identifier les situations où l'expérimentation révèle des compétences ou réactions inconnues",
        "Utiliser le modèle pour améliorer la communication, la confiance et la connaissance mutuelle dans une équipe",
      ],
      toolExplanation: "La Fenêtre de Johari (Luft & Ingham, 1955) est un modèle de connaissance de soi et de dynamique de groupe. Elle distingue 4 zones : la zone ouverte (connue de soi et des autres), la zone aveugle (perçue par les autres mais pas par soi), la zone cachée (connue de soi mais non partagée) et la zone inconnue (ni connue de soi, ni des autres). Le feedback réduit la zone aveugle, l'auto-divulgation maîtrisée réduit la zone cachée, et l'expérimentation révèle la zone inconnue.",
      whenToUse: [
        "En rétrospective pour améliorer la communication et le feedback dans l'équipe",
        "Pour accompagner un membre de l'équipe sur ses angles morts",
        "Pour développer une culture de feedback psychologiquement sécurisante",
      ],
      expectedOutput: [
        "Distinction maîtrisée des 4 zones de Johari",
        "Capacité à diagnostiquer une situation d'équipe et à identifier comment agrandir la zone ouverte",
      ],
    },
    dataset: johariWindowDataset,
  },
```

- [ ] **Step 3: Remove COMING_SOON entry**

Remove the line with `id: 'johari-window'` from the COMING_SOON array.

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/workshops/definitions.ts
git commit -m "feat(data): register johari-window in EXISTING workshop definitions"
```

---

### Task 5: Add /ateliers/johari-window route in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import**

After `import { EmpathyMapAtelier } from './components/EmpathyMapAtelier'` (line ~26), add:

```typescript
import { JohariWindowAtelier } from './components/JohariWindowAtelier'
```

- [ ] **Step 2: Add route**

After `{ path: '/ateliers/empathy-map', element: <EmpathyMapAtelier /> }` (line ~78), add:

```typescript
      { path: '/ateliers/johari-window', element: <JohariWindowAtelier /> },
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(router): add /ateliers/johari-window route"
```
