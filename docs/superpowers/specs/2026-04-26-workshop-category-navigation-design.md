# Design — Navigation par catégories des ateliers

**Date :** 2026-04-26
**Statut :** Approuvé

---

## Contexte

Le catalogue d'ateliers (`/ateliers`) liste actuellement 11 ateliers implémentés sous forme de cartes simples sans catégorie ni métadonnées pédagogiques. L'objectif est d'ajouter un système de navigation par catégories, un modèle de données enrichi, des sections pédagogiques par atelier, et des datasets centralisés.

---

## Décisions clés

| Question | Décision |
|---|---|
| Ateliers non implémentés (~24) | Cartes "coming soon" grises, non cliquables, visibles dans le catalogue |
| Données des composants existants | Hybride : les composants gardent leurs constantes internes, `WorkshopDefinition` est additif |
| Filtre catégorie | `useState` local dans `AteliersHome`, pas de URL params, pas de Zustand |
| Panneau pédagogique | Réduit par défaut, bouton "Objectifs & contexte ▾" pour ouvrir |
| `scrum-guide` (absent du mapping) | Rattaché à `team-intelligence` |

---

## 1. Couche de données

### Structure de fichiers

```
src/data/workshops/
  categories.ts         — 7 WorkshopCategory
  definitions.ts        — WorkshopDefinition[] (~35 entrées)
  datasets/
    sbi.ts
    delegation-poker.ts
    grow-model.ts
    ask-vs-tell.ts
    moving-motivators.ts
    ishikawa.ts
    troika-consulting.ts
    triz.ts
    stakeholder-mapping.ts
    conflict.ts
    scrum-guide.ts
  index.ts              — re-exports centralisés
```

### Types

```ts
export type WorkshopCategorySlug =
  | "conflict-and-communication"
  | "facilitation"
  | "coaching-and-posture"
  | "team-intelligence"
  | "management-3-0"
  | "problem-solving"
  | "stakeholders-and-alignment"

export interface WorkshopCategory {
  slug: WorkshopCategorySlug
  name: string
  description: string
}

export interface WorkshopDefinition {
  id: string
  slug: string
  title: string
  categorySlug: WorkshopCategorySlug
  toolName: string
  level: "beginner" | "intermediate" | "advanced"
  durationMinutes: number
  interactionType:
    | "drag-and-drop"
    | "canvas"
    | "ranking"
    | "matrix"
    | "guided-form"
    | "voting"
    | "dialogue"
    | "diagram"
    | "reflection"
  summary: string
  route: string           // ex: "/ateliers/conflits" — override si slug ≠ segment de route
  comingSoon?: true
  pedagogy: {
    objectives: string[]
    toolExplanation: string
    whenToUse: string[]
    expectedOutput: string[]
    prerequisites?: string[]
  }
  dataset?: WorkshopDataset
}
```

### Catégories (7)

```ts
export const WORKSHOP_CATEGORIES: WorkshopCategory[] = [
  { slug: "conflict-and-communication", name: "Conflict and communication", description: "Outils pour gérer les tensions, formuler du feedback, écouter activement et améliorer la qualité des conversations." },
  { slug: "facilitation", name: "Facilitation", description: "Outils pour concevoir, animer et faire converger un groupe vers une décision ou une production collective." },
  { slug: "coaching-and-posture", name: "Coaching and posture", description: "Outils pour développer une posture de coach, poser de meilleures questions et responsabiliser sans imposer." },
  { slug: "team-intelligence", name: "Team intelligence", description: "Outils pour renforcer la collaboration, les accords d'équipe, la confiance et la compréhension mutuelle." },
  { slug: "management-3-0", name: "Management 3.0", description: "Pratiques centrées sur la motivation, la délégation, l'autonomie et l'amélioration du système de management." },
  { slug: "problem-solving", name: "Problem solving", description: "Outils pour analyser les causes, comprendre les problèmes et définir des actions correctives concrètes." },
  { slug: "stakeholders-and-alignment", name: "Stakeholders and alignment", description: "Outils pour cartographier les parties prenantes, clarifier l'alignement et améliorer la communication externe." },
]
```

### Mapping ateliers existants → catégories

| Atelier | Slug | Catégorie |
|---|---|---|
| Le cadre Scrum | scrum-guide | team-intelligence |
| Gestion des conflits | thomas-kilmann | conflict-and-communication |
| Delegation Poker | delegation-poker | management-3-0 |
| Modèle GROW | grow-model | coaching-and-posture |
| Stakeholder Mapping | stakeholder-mapping | stakeholders-and-alignment |
| Ask vs Tell | ask-vs-tell | coaching-and-posture |
| Moving Motivators | moving-motivators | management-3-0 |
| Ishikawa | ishikawa | problem-solving |
| Troika Consulting | troika-consulting | facilitation |
| SBI | sbi | conflict-and-communication |
| TRIZ | triz | facilitation |

### Ateliers coming soon (~24)

Les **23 slugs** du mapping non encore implémentés reçoivent `comingSoon: true` et une `WorkshopDefinition` minimale (title, categorySlug, summary, level, durationMinutes, route). Pas de `dataset`, pas de `pedagogy` complète.

Total catalogue : 11 ateliers disponibles + 23 coming soon = **34 entrées** (+ scrum-guide hors mapping = 35 au total).

---

## 2. Routing

### Routes existantes (inchangées)

```
/ateliers/scrum-guide
/ateliers/conflits          ← slug de route conservé (≠ slug de données "thomas-kilmann")
/ateliers/delegation-poker
/ateliers/grow-model
/ateliers/stakeholder-mapping
/ateliers/ask-vs-tell
/ateliers/moving-motivators
/ateliers/ishikawa
/ateliers/troika-consulting
/ateliers/sbi
/ateliers/triz
```

### Nouvelle route

```tsx
<Route path="/ateliers/categories/:slug" element={<WorkshopCategoryPage />} />
```

Positionnée avant `<Route path="*">` dans `App.tsx`.

### Page `/ateliers`

`AteliersHome` remanié :
- `WorkshopCategoryNav` en haut
- `useState<WorkshopCategorySlug | null>(null)` pour le filtre actif (`null` = "Tous")
- Grille de `WorkshopCard`
- Ateliers coming soon affichés en dernier dans leur catégorie

---

## 3. Composants

### `WorkshopCategoryNav`

```tsx
interface Props {
  categories: WorkshopCategory[]
  workshops: WorkshopDefinition[]
  activeCategory: WorkshopCategorySlug | null
  onSelect: (slug: WorkshopCategorySlug | null) => void
}
```

- Bouton "Tous (N)" + un bouton par catégorie avec compteur (ateliers non-coming-soon)
- État actif : fond `--color-primary`, texte blanc
- Scroll horizontal sur petits écrans
- Clique sur catégorie active → reset (`null`)

### `WorkshopCard`

```tsx
interface Props {
  workshop: WorkshopDefinition
}
```

- Carte normale : titre, badge catégorie coloré, badge niveau, durée, type d'interaction, résumé, bouton `<Link to={workshop.route}>` "Lancer l'atelier"
- Carte coming soon : fond `--color-surface` atténué, badge "Bientôt" gris, pas de bouton, `pointer-events: none`

### `WorkshopPedagogyPanel`

```tsx
interface Props {
  workshop: WorkshopDefinition
}
```

- `useState<boolean>(false)` local pour l'état ouvert/fermé
- Fermé : bouton "Objectifs & contexte ▾" + badge catégorie + niveau + durée
- Ouvert : objectifs (liste à puces), explication de l'outil, cas d'usage, livrable attendu, prérequis (si présents)
- Inséré en premier dans chaque composant atelier existant

### `WorkshopCategoryPage`

```tsx
// route: /ateliers/categories/:slug
```

- `useParams()` pour lire le slug
- Trouve la catégorie dans `WORKSHOP_CATEGORIES`
- Filtre `WORKSHOP_DEFINITIONS` par `categorySlug`
- Affiche : header catégorie, description, compteur "N ateliers disponibles / M total", grille `WorkshopCard`, suggestion "Par où commencer" (premier atelier non-coming-soon)
- Lien retour vers `/ateliers`

---

## 4. Datasets (périmètre MVP)

Datasets pour les **11 ateliers existants uniquement**.

| Atelier | Type | Contenu |
|---|---|---|
| SBI | ClassificationDataset | 12 items → 3 zones |
| Delegation Poker | RankingDataset + ClassificationDataset | 7 niveaux + 4 situations |
| GROW Model | RankingDataset + ClassificationDataset | 4 étapes + 8 questions |
| Ask vs Tell | ClassificationDataset | situations → directive / coaching |
| Moving Motivators | RankingDataset | 10 motivateurs |
| Ishikawa | ClassificationDataset | 6 catégories + 18 causes |
| Troika Consulting | RankingDataset + ClassificationDataset | 5 étapes + 15 interventions |
| TRIZ | ClassificationDataset | 5 catégories + 15 comportements |
| Stakeholder Mapping | ClassificationDataset | 4 zones + 8 parties prenantes |
| Conflict (Thomas-Kilmann) | RankingDataset + ClassificationDataset | 5 modes + situations |
| Scrum Guide | ClassificationDataset | rôles, événements, artefacts, engagements |

**Principe hybride :** les datasets dans `src/data/workshops/datasets/` coexistent avec les constantes internes des composants. Les composants ne sont pas modifiés pour consommer les datasets — c'est une migration hors scope.

---

## 5. Intégration panneau pédagogique dans les ateliers existants

Chaque composant atelier reçoit une modification minimale :

```tsx
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'

export function SBIAtelier() {
  const def = WORKSHOP_DEFINITIONS.find(w => w.id === 'sbi')!
  return (
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={def} />
      {/* ... reste inchangé */}
    </div>
  )
}
```

---

## 6. CSS

Classes nouvelles à ajouter dans `index.css` :

- `.workshop-category-nav` — barre de filtres horizontale
- `.workshop-category-nav__btn` — bouton de filtre
- `.workshop-category-nav__btn--active` — état actif
- `.workshop-card` — carte atelier enrichie
- `.workshop-card--coming-soon` — variante grisée
- `.workshop-card__category-badge` — badge catégorie coloré par slug
- `.pedagogy-panel` — conteneur panneau pédagogique
- `.pedagogy-panel__toggle` — bouton ouvrir/fermer
- `.pedagogy-panel__body` — contenu (objectifs, explication, etc.)
- `.category-page` — layout page catégorie
- `.category-page__header` — header avec titre + description

---

## 7. Ordre d'implémentation

1. Types et catégories (`src/data/workshops/categories.ts`)
2. Définitions ateliers (`src/data/workshops/definitions.ts`) — 11 réels + ~24 coming soon
3. Datasets (`src/data/workshops/datasets/*.ts`)
4. `WorkshopPedagogyPanel` + CSS
5. `WorkshopCard` + CSS
6. `WorkshopCategoryNav` + CSS
7. `AteliersHome` remanié
8. `WorkshopCategoryPage` + route App.tsx
9. Intégration `WorkshopPedagogyPanel` dans les 11 ateliers existants
10. CSS `.category-page` + ajustements visuels

---

## Critères d'acceptation

- [ ] 7 catégories existent avec slug, name, description
- [ ] Chaque atelier implémenté est rattaché à une catégorie
- [ ] `/ateliers` permet de filtrer par catégorie
- [ ] Chaque catégorie affiche le bon nombre d'ateliers
- [ ] Ateliers coming soon visibles mais non cliquables
- [ ] `/ateliers/categories/:slug` affiche les ateliers de la catégorie
- [ ] Chaque atelier existant affiche un `WorkshopPedagogyPanel`
- [ ] Le panneau est réduit par défaut
- [ ] 11 datasets typés créés
- [ ] Aucun atelier existant n'apparaît sans catégorie ni objectif pédagogique
- [ ] Rendu cohérent avec le design system existant (dark theme, Inter, variables CSS)
