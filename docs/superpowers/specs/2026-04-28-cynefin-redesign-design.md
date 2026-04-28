# Cynefin Framework Atelier — Visual Redesign

## Goal

Refonte visuelle complète des 3 phases du `CynefinFrameworkAtelier` pour que l'interface reflète fidèlement le diagramme Cynefin de référence : quadrants colorés (sombre/clair en diagonale), étoile centrale pour Disorder, et cohérence visuelle du domaine à travers les 3 phases.

## Architecture

Deux fichiers modifiés uniquement :

| Fichier | Changement |
|---------|-----------|
| `src/components/CynefinFrameworkAtelier/index.tsx` | Ajout de `practiceLabel` dans `DOMAIN_META`, refonte JSX des 3 phases |
| `src/index.css` | Remplacement de toutes les classes `.cf-*` |

Aucun changement aux `data-*` attributes, à la logique métier, ni aux tests existants.

---

## Design System Cynefin

### Couleurs des quadrants

| Domaine | Fond | Texte | Source |
|---------|------|-------|--------|
| complex | `#3d4f63` | `#ffffff` | Gris-bleu sombre (ref image) |
| complicated | `#d6dde6` | `#1e2433` | Gris clair (ref image) |
| chaotic | `#1e2433` | `#ffffff` | Presque noir (ref image) |
| clear | `#f5f7fa` | `#1e2433` | Blanc cassé (ref image) |
| disorder | `#e05c4b` | `#ffffff` | Rouge/corail — centre étoile |

### Practice Labels (ajout dans DOMAIN_META)

| Domaine | practiceLabel |
|---------|--------------|
| complex | Emergent Practice |
| complicated | Good Practice |
| chaotic | Novel Practice |
| clear | Best Practice |
| disorder | — |

---

## Phase 1 — Diagramme de placement

### Layout

CSS grid 2×2 avec un élément central positionné en absolu :

```
┌─────────────────┬─────────────────┐
│  COMPLEX        │  COMPLICATED    │
│  (sombre)       │  (clair)        │
│  probe-sense    │  sense-analyze  │
│  Emergent P.    │  Good P.        │
├────────┬────────┴──────┬──────────┤
│ CHAOTIC│   ⬧ Disorder  │  CLEAR   │
│(trèssombre)   center   │  (blanc) │
│ act-sense      star    │sense-cat │
│ Novel P.               │ Best P.  │
└────────────────────────┴──────────┘
```

### Structure HTML

```html
<div class="cf-diagram">
  <div data-zone="complex"     class="cf-quad cf-quad--complex">…</div>
  <div data-zone="complicated" class="cf-quad cf-quad--complicated">…</div>
  <div data-zone="chaotic"     class="cf-quad cf-quad--chaotic">…</div>
  <div data-zone="clear"       class="cf-quad cf-quad--clear">…</div>
  <div class="cf-center">
    <div data-zone="disorder" class="cf-disorder-zone">⬧</div>
  </div>
</div>
```

### Contenu d'un quadrant vide

```
COMPLEX
Enabling constraints, Loosely coupled
probe-sense-respond
─────────────────────
[ Déposer ici ]
EMERGENT PRACTICE
```

### Contenu d'un quadrant rempli

La carte domain remplace le placeholder. Elle reste `draggable` avec `data-domain`.

### CSS clés

```css
.cf-diagram {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  position: relative;
  width: 100%;
  max-width: 700px;
  aspect-ratio: 4/3;
  border-radius: 16px;
  overflow: hidden;
}

.cf-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  background: #e05c4b;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
}

.cf-quad--complex     { background: #3d4f63; color: #fff; }
.cf-quad--complicated { background: #d6dde6; color: #1e2433; }
.cf-quad--chaotic     { background: #1e2433; color: #fff; }
.cf-quad--clear       { background: #f5f7fa; color: #1e2433; }
```

---

## Phase 2 — Situations dans le diagramme

### Layout

Même diagramme 2×2, mais les quadrants deviennent des zones de dépôt multi-cartes. Les cartes s'empilent verticalement dans chaque quadrant. Overflow scroll vertical si le quadrant déborde. Pool de situations non classées en dessous.

### Structure HTML (quadrant en phase 2)

```html
<div data-domain-zone="complex" class="cf-quad cf-quad--complex cf-quad--droppable">
  <div class="cf-quad__header">COMPLEX</div>
  <div class="cf-quad__cards">
    <!-- cartes situation empilées -->
    <div data-situation="cx1" class="cf-sit-card">…texte…</div>
  </div>
</div>
```

### Cartes situation

- Fond semi-transparent blanc (phase 2 non vérifiée)
- Après vérification : `cf-sit-card--correct` (vert) ou `cf-sit-card--wrong` (rouge)
- `draggable`, `data-situation` conservé

### Disorder en Phase 2

Le centre `.cf-center` garde `data-domain-zone="disorder"` et ses handlers `onDrop`/`onDragOver`. Les cartes Disorder s'affichent à l'intérieur du cercle central (scroll si débordement).

### Pool

```html
<div class="cf-pool">
  <div class="cf-pool__cards">…</div>
</div>
```

---

## Phase 3 — Posture de décision

### Layout

Liste verticale de cards. Chaque card a un bandeau de couleur à gauche correspondant au domaine de la situation (`border-left: 4px solid <couleur domaine>`).

### Structure HTML d'une card

```html
<div class="cf-phase3-item cf-phase3-item--<domain>">
  <div class="cf-phase3-item__header">
    <input type="checkbox" data-situation-checkbox="cl1" />
    <span class="cf-domain-badge cf-domain-badge--clear">Clear</span>
    <span class="cf-phase3-item__text">texte situation</span>
  </div>
  <!-- si sélectionnée : -->
  <div class="cf-phase3-item__fields">
    <input data-posture="cl1" … />
    <input data-first-action="cl1" … />
    <!-- indicateur cohérence -->
  </div>
</div>
```

### Couleurs des badges et bandeaux

Identiques au design system ci-dessus : `cf-domain-badge--complex` → fond `#3d4f63`, etc.

---

## Tests

Aucun test à modifier. Tous les `data-*` attributes restent en place :
- `data-zone`, `data-domain` (phase 1)
- `data-domain-zone`, `data-situation` (phase 2)
- `data-situation-checkbox`, `data-posture`, `data-first-action` (phase 3)

Les 16 tests existants passent sans changement.
