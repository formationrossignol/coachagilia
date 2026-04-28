# Cynefin Framework — Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre visuellement les 3 phases du CynefinFrameworkAtelier pour reproduire le vrai diagramme Cynefin (quadrants colorés sombre/clair, étoile centrale Disorder, couleurs de domaine cohérentes dans les 3 phases).

**Architecture:** Modification de deux fichiers uniquement — `index.tsx` pour le JSX + types, `src/index.css` pour le remplacement des classes `.cf-*`. Aucun `data-*` attribute ne change, les 16 tests existants passent sans modification.

**Tech Stack:** React 18, TypeScript, CSS custom properties, HTML5 drag-and-drop natif, Vitest

---

## File Map

| Action | Path | Responsabilité |
|--------|------|----------------|
| Modify | `src/components/CynefinFrameworkAtelier/index.tsx` | DOMAIN_META étendu, nouveau composant CynefinQuad, JSX phases 1-2-3 |
| Modify | `src/index.css:2448-2659` | Remplacement complet des classes `.cf-*` |

---

## Task 1 — DOMAIN_META + Phase 1 : diagramme 2×2 avec centre Disorder

**Files:**
- Modify: `src/components/CynefinFrameworkAtelier/index.tsx:11-133` et `271-341`
- Modify: `src/index.css:2448-2593` (Phase 1 CSS uniquement)
- Test: `src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx` (aucun changement — sert de régression)

- [ ] **Step 1 : Run les tests existants pour établir la baseline**

```bash
npx vitest run src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx
```

Expected : 16 passed

- [ ] **Step 2 : Étendre DOMAIN_META avec practiceLabel, bgColor, textColor**

Dans `src/components/CynefinFrameworkAtelier/index.tsx`, remplacer les lignes 11-47 :

```tsx
const DOMAIN_META: Record<CynefinDomain, {
  label: string
  description: string
  responseStrategy: string
  suggestedPosture: string
  practiceLabel: string
  bgColor: string
  textColor: string
}> = {
  clear: {
    label: 'Clear',
    description: 'Tightly constrained — no degrees of freedom',
    responseStrategy: 'Sense → Categorize → Respond',
    suggestedPosture: 'Standardiser',
    practiceLabel: 'Best Practice',
    bgColor: '#f5f7fa',
    textColor: '#1e2433',
  },
  complicated: {
    label: 'Complicated',
    description: 'Governing constraints — tightly coupled',
    responseStrategy: 'Sense → Analyze → Respond',
    suggestedPosture: 'Analyser',
    practiceLabel: 'Good Practice',
    bgColor: '#d6dde6',
    textColor: '#1e2433',
  },
  complex: {
    label: 'Complex',
    description: 'Enabling constraints — loosely coupled',
    responseStrategy: 'Probe → Sense → Respond',
    suggestedPosture: 'Expérimenter',
    practiceLabel: 'Emergent Practice',
    bgColor: '#3d4f63',
    textColor: '#ffffff',
  },
  chaotic: {
    label: 'Chaotic',
    description: 'Lacking constraints — de-coupled',
    responseStrategy: 'Act → Sense → Respond',
    suggestedPosture: 'Agir immédiatement',
    practiceLabel: 'Novel Practice',
    bgColor: '#1e2433',
    textColor: '#ffffff',
  },
  disorder: {
    label: 'Disorder',
    description: 'Domaine non identifié',
    responseStrategy: 'Identifier le bon domaine',
    suggestedPosture: 'Diagnostiquer',
    practiceLabel: '',
    bgColor: '#e05c4b',
    textColor: '#ffffff',
  },
}
```

- [ ] **Step 3 : Remplacer le composant CynefinZone par CynefinQuad**

Remplacer les lignes 92-133 (le composant `CynefinZone` entier) par :

```tsx
function CynefinQuad({
  zoneId, placed, result, onDrop, onDragStart,
}: {
  zoneId: CynefinDomain
  placed: CynefinDomain | ''
  result: Record<CynefinDomain, boolean> | null
  onDrop: (id: CynefinDomain) => void
  onDragStart: (d: CynefinDomain) => void
}) {
  const meta = DOMAIN_META[zoneId]
  const correct = result?.[zoneId]
  const verified = result !== null
  return (
    <div
      data-zone={zoneId}
      className={[
        'cf-quad',
        `cf-quad--${zoneId}`,
        verified ? (correct ? 'cf-quad--correct' : 'cf-quad--wrong') : '',
      ].filter(Boolean).join(' ')}
      style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('cf-quad--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('cf-quad--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('cf-quad--hover'); onDrop(zoneId) }}
    >
      <div className="cf-quad__meta">
        <strong className="cf-quad__label">{meta.label.toUpperCase()}</strong>
        <span className="cf-quad__desc">{meta.description}</span>
        <span className="cf-quad__strategy">{meta.responseStrategy}</span>
      </div>
      <div className="cf-quad__drop-area">
        {placed ? (
          <div
            data-domain={placed}
            className="cf-domain-placed-card"
            draggable
            onDragStart={() => onDragStart(placed)}
          >
            <strong>{DOMAIN_META[placed].label}</strong>
          </div>
        ) : (
          <span className="cf-quad__placeholder">Déposer ici</span>
        )}
      </div>
      {meta.practiceLabel && (
        <span className="cf-quad__practice">{meta.practiceLabel}</span>
      )}
    </div>
  )
}
```

- [ ] **Step 4 : Supprimer le helper `zone()` et refaire le JSX Phase 1**

Supprimer la fonction `zone()` (lignes 260-269) et remplacer le bloc `{phase === 1 && ( ... )}` (lignes 284-341) par :

```tsx
{phase === 1 && (
  <>
    <div className="cf-phase1-layout">
      <div className="cf-diagram">
        <div className="cf-diagram-grid">
          {(['complex', 'complicated', 'chaotic', 'clear'] as CynefinDomain[]).map(id => (
            <CynefinQuad
              key={id}
              zoneId={id}
              placed={frameworkZones[id]}
              result={phase1Result}
              onDrop={handleDropOnZone}
              onDragStart={handleDragStartDomain}
            />
          ))}
        </div>
        <div className="cf-center">
          <div
            data-zone="disorder"
            className={[
              'cf-disorder-zone',
              phase1Result !== null
                ? (phase1Result['disorder'] ? 'cf-disorder-zone--correct' : 'cf-disorder-zone--wrong')
                : '',
            ].filter(Boolean).join(' ')}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleDropOnZone('disorder') }}
          >
            {frameworkZones['disorder'] ? (
              <div
                data-domain={frameworkZones['disorder']}
                className="cf-domain-placed-card cf-domain-placed-card--center"
                draggable
                onDragStart={() => handleDragStartDomain(frameworkZones['disorder'] as CynefinDomain)}
              >
                <strong>{DOMAIN_META[frameworkZones['disorder'] as CynefinDomain].label}</strong>
              </div>
            ) : (
              <span className="cf-disorder-zone__label">⬧<br />Disorder</span>
            )}
          </div>
        </div>
      </div>

      <div className="cf-palette" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPalette1}>
        <p className="mm-section-label">Domaines à placer</p>
        <div className="cf-palette__cards">
          {paletteDomains.map(d => (
            <div
              key={d}
              data-domain={d}
              className="cf-domain-card"
              draggable
              onDragStart={() => handleDragStartDomain(d)}
            >
              <strong className="cf-domain-card__name">{DOMAIN_META[d].label}</strong>
              <span className="cf-domain-card__desc">{DOMAIN_META[d].description}</span>
            </div>
          ))}
          {paletteDomains.length === 0 && (
            <span className="scrum-palette__empty">Tous les domaines ont été placés</span>
          )}
        </div>
      </div>
    </div>

    {phase1Result && (
      <div className="scrum-score-banner">
        <span className={`badge ${phase1Perfect ? 'badge--green' : 'badge--orange'}`}>
          {phase1Score} / 5 correct{phase1Perfect ? ' — Parfait !' : ''}
        </span>
      </div>
    )}

    <div className="scrum-actions">
      <button className="btn btn--primary" onClick={verifyPhase1} disabled={!phase1AllFilled}>Vérifier</button>
      {phase1Result && !phase1Perfect && (
        <button className="btn btn--secondary" onClick={resetPhase1}>Réessayer</button>
      )}
      {phase1Perfect && (
        <button className="btn btn--primary" onClick={() => setPhase(2)}>Phase suivante →</button>
      )}
    </div>
  </>
)}
```

- [ ] **Step 5 : Remplacer le CSS Phase 1 dans src/index.css**

Remplacer les lignes 2448–2525 (de `.cf-phase1-layout` jusqu'à `.cf-domain-card__desc`) par :

```css
/* ── Cynefin Phase 1 — Diagram layout ───────────────────── */
.cf-phase1-layout {
  display: flex;
  gap: 2rem;
  max-width: 900px;
  margin: 1rem auto;
  flex-wrap: wrap;
  align-items: flex-start;
}

.cf-diagram {
  position: relative;
  flex: 1;
  min-width: 320px;
}

.cf-diagram-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

/* Quadrant */
.cf-quad {
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 160px;
  transition: filter 0.15s;
}
.cf-quad--hover   { filter: brightness(1.12); }
.cf-quad--correct { outline: 3px solid var(--color-ok);     outline-offset: -3px; }
.cf-quad--wrong   { outline: 3px solid var(--color-danger); outline-offset: -3px; }

.cf-quad__meta    { display: flex; flex-direction: column; gap: 0.15rem; }
.cf-quad__label   { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.07em; }
.cf-quad__desc    { font-size: 0.67rem; opacity: 0.75; line-height: 1.3; }
.cf-quad__strategy { font-size: 0.63rem; opacity: 0.65; font-style: italic; }

.cf-quad__drop-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
}
.cf-quad__placeholder { font-size: 0.68rem; opacity: 0.45; font-style: italic; }
.cf-quad__practice    { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; opacity: 0.8; text-transform: uppercase; }

/* Domain card placed inside a quadrant */
.cf-domain-placed-card {
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: var(--radius);
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  cursor: grab;
  color: inherit;
  text-align: center;
}
.cf-domain-placed-card--center { font-size: 0.65rem; padding: 0.2rem 0.4rem; }

/* Center — Disorder circle */
.cf-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.cf-disorder-zone {
  width: 82px; height: 82px;
  background: #e05c4b;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  cursor: default;
  transition: filter 0.15s;
  line-height: 1.2;
}
.cf-disorder-zone--correct { outline: 3px solid var(--color-ok);     }
.cf-disorder-zone--wrong   { outline: 3px solid var(--color-danger);  }
.cf-disorder-zone__label   { font-size: 0.62rem; line-height: 1.3; opacity: 0.9; }

/* Palette (sidebar) */
.cf-palette       { min-width: 200px; flex: 0 0 auto; }
.cf-palette__cards { display: flex; flex-direction: column; gap: 0.5rem; }

/* Palette domain cards */
.cf-domain-card {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.35rem 0.6rem;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: calc(var(--radius) - 2px);
  cursor: grab;
}
.cf-domain-card:hover { border-color: var(--color-primary); }
.cf-domain-card__name { font-size: 0.85rem; font-weight: 600; color: var(--color-text); }
.cf-domain-card__desc { font-size: 0.72rem; color: var(--color-text-muted); line-height: 1.3; }
```

- [ ] **Step 6 : Run les tests**

```bash
npx vitest run src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx
```

Expected : 16 passed

- [ ] **Step 7 : Commit**

```bash
git add src/components/CynefinFrameworkAtelier/index.tsx src/index.css
git commit -m "feat(cynefin): redesign phase 1 — Cynefin 2×2 diagram with center Disorder"
```

---

## Task 2 — Phase 2 : situations dans le diagramme

**Files:**
- Modify: `src/components/CynefinFrameworkAtelier/index.tsx` — bloc phase 2 JSX
- Modify: `src/index.css` — remplacer `.cf-domain-columns` / `.cf-domain-col*` par nouvelles classes phase 2
- Test: `src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx` (régression)

- [ ] **Step 1 : Remplacer le JSX Phase 2**

Dans `index.tsx`, remplacer le bloc `{phase === 2 && ( ... )}` entier par :

```tsx
{phase === 2 && (
  <>
    <div className="cf-diagram cf-diagram--p2">
      <div className="cf-diagram-grid cf-diagram-grid--p2">
        {(['complex', 'complicated', 'chaotic', 'clear'] as CynefinDomain[]).map(domain => {
          const col = SITUATIONS.filter(s => situationAssignments[s.id] === domain)
          return (
            <div
              key={domain}
              data-domain-zone={domain}
              className={`cf-quad cf-quad--${domain} cf-quad--p2`}
              style={{ backgroundColor: DOMAIN_META[domain].bgColor, color: DOMAIN_META[domain].textColor }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDropOnDomainZone(domain)}
            >
              <div className="cf-quad__header">
                <strong className="cf-quad__label">{DOMAIN_META[domain].label.toUpperCase()}</strong>
                <span className="cf-quad__strategy">{DOMAIN_META[domain].responseStrategy}</span>
              </div>
              <div className="cf-quad__cards">
                {col.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className={'cf-sit-card' + (phase2Result ? (phase2Result[s.id] ? ' cf-sit-card--correct' : ' cf-sit-card--wrong') : '')}
                    draggable
                    onDragStart={() => handleDragStartSituation(s.id)}
                  >
                    {s.text}
                  </div>
                ))}
                {col.length === 0 && <span className="cf-quad__placeholder">Déposer ici</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="cf-center">
        <div
          data-domain-zone="disorder"
          className="cf-disorder-zone cf-disorder-zone--p2"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDropOnDomainZone('disorder')}
        >
          {(() => {
            const disorderCards = SITUATIONS.filter(s => situationAssignments[s.id] === 'disorder')
            return disorderCards.length === 0 ? (
              <span className="cf-disorder-zone__label">⬧<br />Disorder</span>
            ) : (
              <div className="cf-disorder-zone__cards">
                {disorderCards.map(s => (
                  <div
                    key={s.id}
                    data-situation={s.id}
                    className={'cf-sit-card cf-sit-card--tiny' + (phase2Result ? (phase2Result[s.id] ? ' cf-sit-card--correct' : ' cf-sit-card--wrong') : '')}
                    draggable
                    onDragStart={() => handleDragStartSituation(s.id)}
                  >
                    {s.text.length > 28 ? s.text.slice(0, 28) + '…' : s.text}
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </div>
    </div>

    <div className="cf-pool" onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool2}>
      <p className="scrum-palette__title">Situations à classer</p>
      <div className="cf-pool__cards">
        {pool2.map(s => (
          <div
            key={s.id}
            data-situation={s.id}
            className="cf-sit-card"
            draggable
            onDragStart={() => handleDragStartSituation(s.id)}
          >
            {s.text}
          </div>
        ))}
        {pool2.length === 0 && (
          <span className="scrum-palette__empty">Toutes les situations ont été classées</span>
        )}
      </div>
    </div>

    {phase2Result && (
      <div className="scrum-score-banner">
        <span className={`badge ${phase2Score === 15 ? 'badge--green' : 'badge--orange'}`}>
          {phase2Score} / 15 correct
        </span>
      </div>
    )}

    <div className="scrum-actions">
      <button className="btn btn--primary" onClick={verifyPhase2} disabled={!phase2AllAssigned}>Vérifier</button>
      {phase2Result && (
        <>
          <button className="btn btn--secondary" onClick={resetPhase2}>Réessayer phase 2</button>
          <button className="btn btn--primary" onClick={() => setPhase(3)}>Phase suivante →</button>
        </>
      )}
    </div>
  </>
)}
```

- [ ] **Step 2 : Remplacer le CSS Phase 2 dans src/index.css**

Remplacer les lignes 2527–2592 (de `/* Phase 2 — 5 domain columns */` jusqu'à `.cf-pool__cards { ... }`) par :

```css
/* ── Cynefin Phase 2 — Diagram as drop zones ────────────── */
.cf-diagram--p2   { margin-bottom: 0.75rem; }
.cf-diagram-grid--p2 { grid-template-rows: auto auto; }

.cf-quad--p2 {
  min-height: 200px;
  overflow-y: auto;
}
.cf-quad__header { display: flex; flex-direction: column; gap: 0.1rem; margin-bottom: 0.4rem; }
.cf-quad__cards  { display: flex; flex-direction: column; gap: 0.3rem; }

.cf-disorder-zone--p2 {
  width: 110px; height: 110px;
  overflow-y: auto;
  flex-direction: column;
  padding: 0.4rem;
  gap: 0.2rem;
}
.cf-disorder-zone__cards { display: flex; flex-direction: column; gap: 0.2rem; width: 100%; }

/* Situation cards */
.cf-sit-card {
  padding: 0.4rem 0.55rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.76rem;
  color: inherit;
  cursor: grab;
  line-height: 1.4;
}
.cf-sit-card--tiny    { font-size: 0.6rem; padding: 0.2rem 0.3rem; line-height: 1.25; }
.cf-sit-card:hover    { border-color: rgba(255,255,255,0.5); }
.cf-sit-card--correct { border-color: var(--color-ok);     background: rgba(20,83,45,0.35); }
.cf-sit-card--wrong   { border-color: var(--color-danger); background: rgba(127,29,29,0.35); }

/* Pool (unassigned situations) */
.cf-pool {
  max-width: 900px;
  margin: 0.75rem auto 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
}
.cf-pool__cards { display: flex; flex-wrap: wrap; gap: 0.5rem; }

/* Pool sit-cards override to use app colors (not quadrant inherit) */
.cf-pool .cf-sit-card {
  background: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text);
}
.cf-pool .cf-sit-card:hover { border-color: var(--color-primary); }
```

- [ ] **Step 3 : Run les tests**

```bash
npx vitest run src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx
```

Expected : 16 passed

- [ ] **Step 4 : Commit**

```bash
git add src/components/CynefinFrameworkAtelier/index.tsx src/index.css
git commit -m "feat(cynefin): redesign phase 2 — situations drop onto diagram quadrants"
```

---

## Task 3 — Phase 3 + badges + CSS cleanup

**Files:**
- Modify: `src/components/CynefinFrameworkAtelier/index.tsx` — aucun changement JSX (les classes sont déjà en place)
- Modify: `src/index.css:2595-2659` — Phase 3 + badges
- Test: `src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx` (régression)

- [ ] **Step 1 : Remplacer le CSS Phase 3 + badges dans src/index.css**

Remplacer les lignes 2595–2659 (de `/* Phase 3 — posture selection */` jusqu'à la fin `.cf-domain-badge--disorder { ... }`) par :

```css
/* ── Cynefin Phase 3 — Domain-colored posture cards ─────── */
.cf-phase3-intro {
  max-width: 760px;
  margin: 0.5rem auto 0.75rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.cf-phase3-list {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cf-phase3-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: var(--radius);
  padding: 0.6rem 0.75rem;
}
.cf-phase3-item--complex     { border-left-color: #3d4f63; }
.cf-phase3-item--complicated { border-left-color: #94a3b8; }
.cf-phase3-item--chaotic     { border-left-color: #1e2433; }
.cf-phase3-item--clear       { border-left-color: #64748b; }
.cf-phase3-item--disorder    { border-left-color: #e05c4b; }

.cf-phase3-item--selected {
  border-top-color: var(--color-primary);
  border-right-color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: rgba(99,102,241,0.04);
}
.cf-phase3-item__header {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}
.cf-phase3-item__header input[type="checkbox"] {
  margin-top: 0.1rem;
  flex-shrink: 0;
  cursor: pointer;
}
.cf-phase3-item__text {
  font-size: 0.83rem;
  color: var(--color-text);
  line-height: 1.45;
  flex: 1;
}
.cf-phase3-item__fields {
  margin-top: 0.6rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cf-field-row   { display: flex; flex-direction: column; gap: 0.25rem; }
.cf-field-label { font-size: 0.78rem; font-weight: 600; color: var(--color-text-muted); }

/* Domain badges — updated to Cynefin color system */
.cf-domain-badge {
  display: inline-block;
  flex-shrink: 0;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  white-space: nowrap;
}
.cf-domain-badge--clear       { background: #f5f7fa; color: #1e2433; border: 1px solid #64748b; }
.cf-domain-badge--complicated { background: #d6dde6; color: #1e2433; }
.cf-domain-badge--complex     { background: #3d4f63; color: #ffffff; }
.cf-domain-badge--chaotic     { background: #1e2433; color: #ffffff; }
.cf-domain-badge--disorder    { background: #e05c4b; color: #ffffff; }
```

- [ ] **Step 2 : Supprimer les classes CSS obsolètes**

Dans `src/index.css`, supprimer les blocs suivants qui ne sont plus utilisés (vérifier avec grep avant de supprimer) :

```bash
# Vérifier qu'aucun de ces sélecteurs n'est utilisé dans le tsx
grep -r "cf-zone\b\|cf-diagram-row\|cf-diagram-center\|cf-domain-columns\|cf-domain-col\b" src/components/CynefinFrameworkAtelier/index.tsx
```

Expected : aucune ligne (0 résultat)

Supprimer de `src/index.css` les lignes correspondant à :
- `.cf-zone { ... }` et ses variantes (`.cf-zone--filled`, `.cf-zone--hover`, `.cf-zone--correct`, `.cf-zone--wrong`, `.cf-zone--complex`, `.cf-zone--complicated`, `.cf-zone--chaotic`, `.cf-zone--clear`, `.cf-zone--disorder`)
- `.cf-zone__strategy { ... }`
- `.cf-zone__placeholder { ... }`
- `.cf-diagram-row { ... }` et `.cf-diagram-row .cf-zone { ... }`
- `.cf-diagram-center { ... }` et `.cf-diagram-center .cf-zone { ... }`
- `.cf-domain-columns { ... }`
- `.cf-domain-col { ... }` et ses variantes (`.cf-domain-col--complex`, `.cf-domain-col--complicated`, `.cf-domain-col--chaotic`, `.cf-domain-col--clear`, `.cf-domain-col--disorder`)
- `.cf-domain-col__header { ... }`
- `.cf-domain-col__strategy { ... }`
- `.cf-domain-col__cards { ... }`
- `.cf-domain-col__placeholder { ... }`
- `.cf-situation-card { ... }` et ses variantes (`.cf-situation-card:hover`, `.cf-situation-card--correct`, `.cf-situation-card--wrong`)
- `.cf-domain-card--placed { ... }` (remplacée par `.cf-domain-placed-card`)

- [ ] **Step 3 : Run tous les tests**

```bash
npx vitest run src/components/CynefinFrameworkAtelier/CynefinFrameworkAtelier.test.tsx
```

Expected : 16 passed

- [ ] **Step 4 : Run la suite complète**

```bash
npx vitest run
```

Expected : 276 passed (0 failures)

- [ ] **Step 5 : Commit**

```bash
git add src/components/CynefinFrameworkAtelier/index.tsx src/index.css
git commit -m "feat(cynefin): phase 3 domain colors + badge redesign + CSS cleanup"
```
