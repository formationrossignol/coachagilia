# Ishikawa — Refonte visuelle en arête de poisson

**Date :** 2026-04-27  
**Composant :** `src/components/IshikawaAtelier/index.tsx`  
**CSS :** `src/index.css` (classes `ishi-*`)

---

## Contexte

Le diagramme d'Ishikawa actuel utilise une grille plate :
- 3 boîtes en haut (grid 3 colonnes)
- une ligne horizontale (spine)
- 3 boîtes en bas (grid 3 colonnes)

Il n'y a aucune arête diagonale. L'objectif est de remplacer ce rendu par un vrai diagramme en arête de poisson, fidèle à la représentation classique.

---

## Design retenu : Option C — SVG décoratif + HTML fonctionnel

Une couche SVG (`pointer-events: none`) dessine uniquement les lignes. Une couche HTML positionnée par-dessus contient toutes les zones interactives (drag-and-drop, cartes).

### Anatomie du poisson

| Élément | Description | Implémentation |
|---|---|---|
| **Queue** | V ouvert vers la gauche, raccordé à la colonne | SVG `<polyline points="70,140 20,100 20,180 70,140">` |
| **Colonne** | Ligne horizontale (spine) | SVG `<line x1="70" y1="140" x2="680" y2="140">` |
| **Arêtes** | 3 diagonales montantes + 3 descendantes | SVG `<line>` avec jonctions à x=200, 370, 540 |
| **Tête** | Ovale à droite avec œil, contient l'effet | SVG `<path>` + `<circle>` + div HTML pour le label |

### Dimensions SVG (viewBox 0 0 820 280)

```
Queue  : points="70,140  20,100  20,180  70,140"
Spine  : x1=70 y1=140  →  x2=680 y2=140
Tête   : M680,100 Q760,100 780,140 Q760,180 680,180 Z
```

Jonctions des arêtes sur la spine : `x = 200 | 370 | 540`, `y = 140`

Extrémités des arêtes :
- **Haut** : (130, 30) | (300, 30) | (475, 30)
- **Bas**  : (130, 250) | (300, 250) | (475, 250)

---

## Impact par phase

### Phase 1 — Placement des catégories

Les 6 drop zones migrent des boîtes grid vers des divs positionnés en absolu aux extrémités des arêtes (coordonnées HTML alignées sur les tips SVG). L'utilisateur glisse les étiquettes de catégorie depuis la palette vers ces zones.

Structure HTML :
```
<div class="ishi-diagram"> (position: relative, width: 820px)
  <svg>  ← décor uniquement (pointer-events: none)
  <div class="ishi-drop-zone ishi-drop-zone--top-1"> ← haut gauche
  <div class="ishi-drop-zone ishi-drop-zone--top-2"> ← haut milieu
  ... (6 zones au total)
  <div class="ishi-effect-label">               ← dans la tête
```

### Phase 2 — Classement des causes

La structure fishbone reste affichée. Les drop zones s'élargissent verticalement pour accueillir les cartes-causes empilées le long de chaque arête. Les cartes restent draggables.

### Phase 3 — Causes racines

Aucun changement visuel : la vue liste actuelle (checkboxes + champs justification/action) est conservée telle quelle.

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/components/IshikawaAtelier/index.tsx` | Remplacer le JSX `.ishi-diagram` (phases 1 & 2) par la structure SVG + HTML absolue |
| `src/index.css` | Remplacer les classes `.ishi-diagram`, `.ishi-branches-row`, `.ishi-spine`, `.ishi-branch`, `.ishi-col` par les nouvelles classes fishbone |

Les classes `.ishi-pool`, `.ishi-cause-card`, `.ishi-root-*` ne changent pas.

---

## Critères de succès

- La queue ouvre vers la gauche (V avec pointe à droite raccordée à la spine)
- La tête est visible à droite avec le label "Vélocité insuffisante"
- Les 6 arêtes sont diagonales (3 montantes, 3 descendantes)
- Le drag-and-drop des phases 1 et 2 fonctionne identiquement à l'actuel
- Le layout est responsive (overflow-x sur mobile acceptable)
- Les tests existants (`IshikawaAtelier.test.tsx`) continuent de passer
