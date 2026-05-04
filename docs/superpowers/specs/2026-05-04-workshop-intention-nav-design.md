# Design — Navigation ateliers par intention d'usage

**Date :** 2026-05-04  
**Statut :** Approuvé

## Résumé

Ajouter deux vues sur la page `/ateliers` :

1. **Vue par intention** (défaut) — 8 tuiles d'intention cliquables, la grille se filtre sur l'intention sélectionnée.
2. **Vue liste complète** — comportement actuel inchangé : filtre par catégorie + grille.

Un toggle pill en haut à droite de la page bascule entre les deux vues. La préférence est persistée en `localStorage`.

---

## Couche de données

### Nouveau fichier : `src/data/workshops/intentions.ts`

Deux exports :

```ts
export interface WorkshopIntention {
  slug: string
  name: string
  emoji: string
  subtitle: string   // mots-clés affichés sous le nom dans la tuile
}

export const WORKSHOP_INTENTIONS: WorkshopIntention[] = [
  { slug: 'gerer-conflit',             name: 'Gérer un conflit',              emoji: '⚡', subtitle: 'Tensions, feedback, négociation' },
  { slug: 'faciliter-decision',        name: 'Faciliter une décision',        emoji: '⚖️', subtitle: 'Consensus, vote, arbitrage' },
  { slug: 'debloquer-equipe',          name: 'Débloquer une équipe',          emoji: '🧩', subtitle: 'Co-dev, facilitation, résilience' },
  { slug: 'preparer-retro',            name: 'Préparer une rétrospective',    emoji: '🔄', subtitle: 'Formats, techniques, animation' },
  { slug: 'cause-racine',              name: 'Trouver une cause racine',      emoji: '🔍', subtitle: 'Analyse, Ishikawa, TRIZ' },
  { slug: 'aligner-parties-prenantes', name: 'Aligner les parties prenantes', emoji: '🤝', subtitle: 'Cartographie, engagement' },
  { slug: 'ameliorer-flow',            name: 'Améliorer le flow',             emoji: '📈', subtitle: 'Systèmes, flux, livraison' },
  { slug: 'preparer-coaching',         name: 'Préparer un coaching',          emoji: '🎯', subtitle: 'Questions, posture, GROW' },
]

export const INTENTION_WORKSHOP_MAP: Record<string, string[]> = {
  'gerer-conflit': [
    'thomas-kilmann', 'sbi', 'nonviolent-communication', 'radical-candor',
    'crucial-conversations', 'desc', 'feedforward', 'difficult-conversations', 'johari-window',
  ],
  'faciliter-decision': [
    'cynefin-framework', 'delegation-poker', 'troika-consulting', 'raci', 'daci', 'rapid',
    'decision-matrix', 'decision-tree', 'premortem', 'dot-voting', 'fist-of-five',
    'roman-voting', 'six-thinking-hats',
  ],
  'debloquer-equipe': [
    'troika-consulting', 'triz', 'moving-motivators', 'cynefin-framework',
    'liberating-structures', '1-2-4-all', 'fishbowl-discussion', 'appreciative-inquiry', 'scrum-guide',
  ],
  'preparer-retro': [
    'troika-consulting', 'triz', 'ishikawa', 'start-stop-continue', 'starfish', 'sailboat',
    'mad-sad-glad', '4-ls', 'timeline-retro', 'futurespective', 'retrospective-radar', 'happiness-door',
  ],
  'cause-racine': [
    'ishikawa', 'triz', '5-whys', 'root-cause-analysis', 'a3', 'dmaic', 'cynefin-framework',
  ],
  'aligner-parties-prenantes': [
    'stakeholder-mapping', 'customer-journey-mapping', 'service-blueprint',
    'impact-mapping', 'elevator-pitch',
  ],
  'ameliorer-flow': [
    'cynefin-framework', 'value-stream-mapping', 'kanban', 'littles-law',
    'pdca', 'kaizen', 'dora-metrics', 'dod-review', 'dor-review',
  ],
  'preparer-coaching': [
    'grow-model', 'ask-vs-tell', 'powerful-questions', 'solution-focused-coaching',
    'clean-language', 'systemic-coaching', 'immunity-to-change',
  ],
}
```

Un atelier peut apparaître dans plusieurs intentions (many-to-many). Les ateliers `comingSoon` sont inclus dans le map — ils s'affichent avec leur carte grisée habituelle.

`intentions.ts` est exporté depuis `src/data/workshops/index.ts`.

---

## Composants UI

### Nouveau : `src/components/IntentionNav/index.tsx`

**Props :**
```ts
interface Props {
  intentions: WorkshopIntention[]
  workshopMap: Record<string, string[]>
  workshops: WorkshopDefinition[]
  activeIntention: string | null
  onSelect: (slug: string | null) => void
}
```

**Rendu :** Grille 2 colonnes. Chaque tuile affiche emoji + nom + sous-titre + compteur (nombre de workshops dans la map pour cette intention). Re-cliquer la tuile active la désélectionne (`onSelect(null)`).

**Compteur :** nombre de slugs dans `INTENTION_WORKSHOP_MAP[slug]` qui correspondent à des `WorkshopDefinition` existantes (pour éviter les slugs orphelins dans le compteur).

### Modifié : `src/components/AteliersHome/index.tsx`

Deux nouveaux états :
- `view: 'intention' | 'list'` — initialisé depuis `localStorage` (`'ateliers-view'`), fallback `'intention'`
- `activeIntention: string | null` — réinitialisé à `null` au changement de vue

Le header reçoit le toggle pill (`.view-toggle`) à droite du texte d'intro.

Logique d'affichage :
- `view === 'intention'` → `<IntentionNav>` + grille filtrée par les slugs de `INTENTION_WORKSHOP_MAP[activeIntention]` (ou tous si `null`)
- `view === 'list'` → `<WorkshopCategoryNav>` existant + grille filtrée par catégorie (comportement actuel)

### Non modifié : `src/components/WorkshopCategoryNav/index.tsx`

Aucun changement.

---

## CSS

Deux nouveaux blocs ajoutés dans `src/index.css` (où vivent `.ateliers-home`, `.ateliers-grid`, `.workshop-category-nav`) :

**`.view-toggle`** — pill switch : conteneur avec border-radius arrondi, deux boutons enfants `.view-toggle__btn`, l'actif avec fond `var(--color-accent)` et texte blanc.

**`.intention-nav`** — grille CSS 2 colonnes, gap cohérent avec la grille workshops existante.

**`.intention-nav__tile`** — carte cliquable avec border, border-radius, padding. État actif (`:active`, `--active`) avec border colorée et fond légèrement teinté. Contient : `.intention-nav__emoji`, `.intention-nav__name`, `.intention-nav__subtitle`, `.intention-nav__count`.

---

## Tests

### Nouveau : `src/components/IntentionNav/IntentionNav.test.tsx`
- Rend les 8 tuiles
- Compteur correct par intention
- Click sélectionne l'intention (appelle `onSelect`)
- Re-click sur l'intention active la désélectionne (`onSelect(null)`)

### Modifié : `src/components/AteliersHome/AteliersHome.test.tsx`
- Toggle pill bascule de `'intention'` à `'list'`
- Préférence persistée en `localStorage`
- Préférence `localStorage` corrompue → fallback `'intention'`
- Filtre par intention affiche les bons ateliers
- Retour en vue liste : `WorkshopCategoryNav` visible, `IntentionNav` absent

---

## Cas limites

| Cas | Comportement |
|-----|-------------|
| Slug dans `INTENTION_WORKSHOP_MAP` absent de `WORKSHOP_DEFINITIONS` | Ignoré silencieusement (atelier futur non encore défini) |
| Intention sélectionnée, 0 ateliers actifs (tous `comingSoon`) | Grille affiche les cartes grises "Bientôt" normalement |
| `localStorage` corrompu | Fallback `'intention'` |
| Aucune intention sélectionnée | Tous les ateliers s'affichent (pas de filtre) |

---

## Hors périmètre

- Pas de nouvelle route ni page
- Pas de validation TypeScript des slugs dans la map (peut être ajouté en test Jest ultérieurement)
- Pas de changement aux composants d'atelier individuels
- Pas de changement à `WorkshopCategoryNav`
