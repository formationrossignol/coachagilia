# Workshop Category Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un système de navigation par catégories pour les ateliers : filtre /ateliers, pages /ateliers/categories/:slug, panneaux pédagogiques collapsibles sur chaque atelier, datasets centralisés.

**Architecture:** Couche de données pure dans `src/data/workshops/` (types, catégories, définitions, datasets). 4 nouveaux composants React (`WorkshopPedagogyPanel`, `WorkshopCard`, `WorkshopCategoryNav`, `WorkshopCategoryPage`). `AteliersHome` refactorisé. Panneau pédagogique injecté dans les 11 ateliers existants sans toucher à leur logique de jeu.

**Tech Stack:** React 18, TypeScript, Vitest + Testing Library, react-router-dom v7, CSS variables existantes.

---

## File Map

**Créer :**
- `src/data/workshops/types.ts` — types TS (WorkshopDefinition, datasets, etc.)
- `src/data/workshops/categories.ts` — 7 WorkshopCategory
- `src/data/workshops/datasets/sbi.ts`
- `src/data/workshops/datasets/conflict.ts`
- `src/data/workshops/datasets/delegation-poker.ts`
- `src/data/workshops/datasets/grow-model.ts`
- `src/data/workshops/datasets/ask-vs-tell.ts`
- `src/data/workshops/datasets/moving-motivators.ts`
- `src/data/workshops/datasets/ishikawa.ts`
- `src/data/workshops/datasets/troika-consulting.ts`
- `src/data/workshops/datasets/triz.ts`
- `src/data/workshops/datasets/stakeholder-mapping.ts`
- `src/data/workshops/datasets/scrum-guide.ts`
- `src/data/workshops/definitions.ts` — 35 WorkshopDefinition (11 réels + 23 coming soon)
- `src/data/workshops/index.ts` — re-exports
- `src/components/WorkshopPedagogyPanel/index.tsx`
- `src/components/WorkshopPedagogyPanel/WorkshopPedagogyPanel.test.tsx`
- `src/components/WorkshopCard/index.tsx`
- `src/components/WorkshopCard/WorkshopCard.test.tsx`
- `src/components/WorkshopCategoryNav/index.tsx`
- `src/components/WorkshopCategoryNav/WorkshopCategoryNav.test.tsx`
- `src/components/WorkshopCategoryPage/index.tsx`
- `src/components/WorkshopCategoryPage/WorkshopCategoryPage.test.tsx`

**Modifier :**
- `src/components/AteliersHome/index.tsx` — filtre + nouveaux composants
- `src/components/AteliersHome/AteliersHome.test.tsx` — nouveaux tests
- `src/App.tsx` — route /ateliers/categories/:slug
- `src/index.css` — nouvelles classes CSS
- Les 11 composants ateliers existants — ajout WorkshopPedagogyPanel

---

## Task 1 — Types TypeScript

**Files:**
- Create: `src/data/workshops/types.ts`

- [ ] **Créer `src/data/workshops/types.ts`**

```ts
export type WorkshopCategorySlug =
  | 'conflict-and-communication'
  | 'facilitation'
  | 'coaching-and-posture'
  | 'team-intelligence'
  | 'management-3-0'
  | 'problem-solving'
  | 'stakeholders-and-alignment'

export interface WorkshopCategory {
  slug: WorkshopCategorySlug
  name: string
  description: string
}

export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced'

export type WorkshopInteractionType =
  | 'drag-and-drop'
  | 'canvas'
  | 'ranking'
  | 'matrix'
  | 'guided-form'
  | 'voting'
  | 'dialogue'
  | 'diagram'
  | 'reflection'

export const LEVEL_LABELS: Record<WorkshopLevel, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}

export const LEVEL_BADGE_VARIANT: Record<WorkshopLevel, 'green' | 'orange' | 'red'> = {
  beginner: 'green',
  intermediate: 'orange',
  advanced: 'red',
}

export const INTERACTION_TYPE_LABELS: Record<WorkshopInteractionType, string> = {
  'drag-and-drop': 'Drag & Drop',
  canvas: 'Canvas',
  ranking: 'Classement',
  matrix: 'Matrice',
  'guided-form': 'Formulaire guidé',
  voting: 'Vote',
  dialogue: 'Dialogue',
  diagram: 'Diagramme',
  reflection: 'Réflexion',
}

export interface ClassificationDataset {
  zones: { id: string; label: string; description: string }[]
  cards: { id: string; text: string; expectedZone: string; explanation?: string }[]
}

export interface RankingDataset {
  cards: { id: string; label: string; description: string }[]
}

export interface CanvasDataset {
  sections: { id: string; title: string; description: string; placeholder?: string }[]
  examples?: { sectionId: string; text: string }[]
}

export interface VotingDataset {
  proposal: string
  options: { id: string; label: string; description?: string }[]
}

export type WorkshopDataset =
  | ClassificationDataset
  | RankingDataset
  | CanvasDataset
  | VotingDataset

export interface WorkshopPedagogy {
  objectives: string[]
  toolExplanation: string
  whenToUse: string[]
  expectedOutput: string[]
  prerequisites?: string[]
}

export interface WorkshopDefinition {
  id: string
  slug: string
  title: string
  route: string
  categorySlug: WorkshopCategorySlug
  toolName: string
  level: WorkshopLevel
  durationMinutes: number
  interactionType: WorkshopInteractionType
  summary: string
  comingSoon?: true
  pedagogy?: WorkshopPedagogy
  dataset?: WorkshopDataset
}
```

- [ ] **Vérifier la compilation TypeScript**

```bash
cd /Users/loicrossignol/Desktop/Igensia/Scrum\ Master/scrum-master-sim
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Commit**

```bash
git add src/data/workshops/types.ts
git commit -m "feat(data): add WorkshopDefinition and dataset types"
```

---

## Task 2 — Catégories

**Files:**
- Create: `src/data/workshops/categories.ts`

- [ ] **Créer `src/data/workshops/categories.ts`**

```ts
import type { WorkshopCategory } from './types'

export const WORKSHOP_CATEGORIES: WorkshopCategory[] = [
  {
    slug: 'conflict-and-communication',
    name: 'Conflict and communication',
    description: 'Outils pour gérer les tensions, formuler du feedback, écouter activement et améliorer la qualité des conversations.',
  },
  {
    slug: 'facilitation',
    name: 'Facilitation',
    description: 'Outils pour concevoir, animer et faire converger un groupe vers une décision ou une production collective.',
  },
  {
    slug: 'coaching-and-posture',
    name: 'Coaching and posture',
    description: 'Outils pour développer une posture de coach, poser de meilleures questions et responsabiliser sans imposer.',
  },
  {
    slug: 'team-intelligence',
    name: 'Team intelligence',
    description: 'Outils pour renforcer la collaboration, les accords d\'équipe, la confiance et la compréhension mutuelle.',
  },
  {
    slug: 'management-3-0',
    name: 'Management 3.0',
    description: 'Pratiques centrées sur la motivation, la délégation, l\'autonomie et l\'amélioration du système de management.',
  },
  {
    slug: 'problem-solving',
    name: 'Problem solving',
    description: 'Outils pour analyser les causes, comprendre les problèmes et définir des actions correctives concrètes.',
  },
  {
    slug: 'stakeholders-and-alignment',
    name: 'Stakeholders and alignment',
    description: 'Outils pour cartographier les parties prenantes, clarifier l\'alignement et améliorer la communication externe.',
  },
]
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Commit**

```bash
git add src/data/workshops/categories.ts
git commit -m "feat(data): add 7 workshop categories"
```

---

## Task 3 — Datasets : SBI + Conflict

**Files:**
- Create: `src/data/workshops/datasets/sbi.ts`
- Create: `src/data/workshops/datasets/conflict.ts`

- [ ] **Créer `src/data/workshops/datasets/sbi.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const sbiDataset: ClassificationDataset = {
  zones: [
    { id: 'situation', label: 'Situation', description: 'Contexte précis (quand, où)' },
    { id: 'behavior',  label: 'Behavior',  description: 'Comportement observable' },
    { id: 'impact',    label: 'Impact',    description: 'Effet produit' },
  ],
  cards: [
    { id: 's1', text: 'Lors du Daily Scrum de ce matin…',               expectedZone: 'situation' },
    { id: 's2', text: 'Pendant la Sprint Review de vendredi…',           expectedZone: 'situation' },
    { id: 's3', text: 'Lors de la dernière rétrospective…',             expectedZone: 'situation' },
    { id: 's4', text: 'Hier lors du refinement…',                       expectedZone: 'situation' },
    { id: 'b1', text: 'Tu as interrompu plusieurs fois les autres…',     expectedZone: 'behavior' },
    { id: 'b2', text: "Tu n'as pas partagé l'avancement de tes tâches…", expectedZone: 'behavior' },
    { id: 'b3', text: 'Tu as proposé une solution sans écouter…',        expectedZone: 'behavior' },
    { id: 'b4', text: 'Tu as quitté la réunion sans prévenir…',         expectedZone: 'behavior' },
    { id: 'i1', text: "Cela a créé de la confusion dans l'équipe…",     expectedZone: 'impact' },
    { id: 'i2', text: 'Cela a ralenti la prise de décision…',           expectedZone: 'impact' },
    { id: 'i3', text: 'Cela a frustré plusieurs membres…',              expectedZone: 'impact' },
    { id: 'i4', text: "Cela a empêché une bonne collaboration…",        expectedZone: 'impact' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/conflict.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const conflictDataset: ClassificationDataset = {
  zones: [
    { id: 'competition',    label: 'Compétition',    description: 'Assertif, non coopératif — imposer sa position' },
    { id: 'collaboration',  label: 'Collaboration',  description: 'Assertif et coopératif — trouver une solution gagnant-gagnant' },
    { id: 'compromise',     label: 'Compromis',      description: 'Modérément assertif et coopératif — trouver un terrain d\'entente' },
    { id: 'avoidance',      label: 'Évitement',      description: 'Non assertif, non coopératif — ne pas traiter le conflit' },
    { id: 'accommodation',  label: 'Accommodation',  description: 'Non assertif, coopératif — céder à l\'autre' },
  ],
  cards: [
    { id: 's1',  text: "Un membre pousse une solution non conforme à la DoD — le SM tranche pour protéger la qualité.",           expectedZone: 'competition' },
    { id: 's2',  text: "Une livraison est bloquée par un désaccord de dernière minute — une décision rapide s'impose.",            expectedZone: 'competition' },
    { id: 's3',  text: "Un développeur refuse systématiquement les revues de code — le SM pose une limite ferme.",                 expectedZone: 'competition' },
    { id: 's4',  text: "Deux développeurs ont des visions opposées sur l'architecture — le SM facilite une co-conception.",       expectedZone: 'collaboration' },
    { id: 's5',  text: "Une tension récurrente dégrade l'atmosphère — le SM organise un dialogue structuré.",                     expectedZone: 'collaboration' },
    { id: 's6',  text: "L'équipe ne s'accorde pas sur la Definition of Done — le SM anime un atelier.",                          expectedZone: 'collaboration' },
    { id: 's7',  text: "Le PO et l'équipe ne s'accordent pas sur deux US de même valeur — on négocie un ordre acceptable.",      expectedZone: 'compromise' },
    { id: 's8',  text: "L'équipe est divisée sur la durée du Sprint — on convient d'un essai réévalué en rétro.",                expectedZone: 'compromise' },
    { id: 's9',  text: "Les ressources ne permettent pas de tout traiter — on réduit le périmètre de manière équilibrée.",       expectedZone: 'compromise' },
    { id: 's10', text: "Une légère irritation sur un outil, sans impact — le SM laisse passer.",                                  expectedZone: 'avoidance' },
    { id: 's11', text: "Une friction ponctuelle en fin de Sprint surchargé — le SM note pour la rétro.",                         expectedZone: 'avoidance' },
    { id: 's12', text: "Un désaccord mineur sur le format des notes de standup — le SM ne prend pas position.",                  expectedZone: 'avoidance' },
    { id: 's13', text: "Un senior propose une approche différente avec une expertise reconnue — le SM cède et soutient.",        expectedZone: 'accommodation' },
    { id: 's14', text: "Un stakeholder demande un ajustement raisonnable en Sprint Review — le SM accepte.",                     expectedZone: 'accommodation' },
    { id: 's15', text: "Un membre demande de changer l'heure du Daily pour des raisons personnelles — le SM accommode.",        expectedZone: 'accommodation' },
  ],
}
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/datasets/sbi.ts src/data/workshops/datasets/conflict.ts
git commit -m "feat(data): add SBI and Conflict datasets"
```

---

## Task 4 — Datasets : Delegation Poker + GROW Model

**Files:**
- Create: `src/data/workshops/datasets/delegation-poker.ts`
- Create: `src/data/workshops/datasets/grow-model.ts`

- [ ] **Créer `src/data/workshops/datasets/delegation-poker.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const delegationPokerDataset: ClassificationDataset = {
  zones: [
    { id: 'tell',     label: 'Tell',     description: 'Je décide et informe.' },
    { id: 'sell',     label: 'Sell',     description: 'Je décide et explique pour obtenir l\'adhésion.' },
    { id: 'consult',  label: 'Consult',  description: 'Je consulte puis je décide.' },
    { id: 'agree',    label: 'Agree',    description: 'Nous décidons ensemble.' },
    { id: 'advise',   label: 'Advise',   description: 'Je conseille, l\'équipe décide.' },
    { id: 'inquire',  label: 'Inquire',  description: 'L\'équipe décide puis m\'informe.' },
    { id: 'delegate', label: 'Delegate', description: 'L\'équipe décide en autonomie totale.' },
  ],
  cards: [
    { id: 'dp1', text: 'Une faille de sécurité critique impose l\'arrêt immédiat d\'une pratique risquée.', expectedZone: 'tell' },
    { id: 'dp2', text: 'Un changement de process technique impacte toutes les équipes — le SM explique pourquoi et convainc.', expectedZone: 'sell' },
    { id: 'dp3', text: 'Le SM ajuste le format de rétro après avoir demandé l\'avis de l\'équipe.', expectedZone: 'consult' },
    { id: 'dp4', text: 'L\'équipe et le SM définissent ensemble la Definition of Done.', expectedZone: 'agree' },
    { id: 'dp5', text: 'L\'équipe veut tester une nouvelle méthode de refinement — le SM donne son avis mais laisse décider.', expectedZone: 'advise' },
    { id: 'dp6', text: 'L\'équipe choisit son outil de suivi — elle informe le SM après décision.', expectedZone: 'inquire' },
    { id: 'dp7', text: 'L\'équipe mature répartit elle-même son travail pendant le Sprint.', expectedZone: 'delegate' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/grow-model.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const growDataset: ClassificationDataset = {
  zones: [
    { id: 'goal',    label: 'Goal',    description: 'Clarifier l\'objectif' },
    { id: 'reality', label: 'Reality', description: 'Explorer la situation actuelle' },
    { id: 'options', label: 'Options', description: 'Identifier les possibilités' },
    { id: 'will',    label: 'Will',    description: 'Définir l\'engagement' },
  ],
  cards: [
    { id: 'g1', text: 'Quel est l\'objectif que tu veux atteindre ?',               expectedZone: 'goal' },
    { id: 'g2', text: 'À quoi ressemblerait un résultat réussi ?',                  expectedZone: 'goal' },
    { id: 'r1', text: 'Où en es-tu aujourd\'hui ?',                                 expectedZone: 'reality' },
    { id: 'r2', text: 'Qu\'as-tu déjà essayé ?',                                   expectedZone: 'reality' },
    { id: 'o1', text: 'Quelles options vois-tu ?',                                  expectedZone: 'options' },
    { id: 'o2', text: 'Que pourrais-tu essayer d\'autre ?',                         expectedZone: 'options' },
    { id: 'w1', text: 'Quelle est ta prochaine action concrète ?',                  expectedZone: 'will' },
    { id: 'w2', text: 'Quand vas-tu le faire ?',                                    expectedZone: 'will' },
  ],
}
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/datasets/delegation-poker.ts src/data/workshops/datasets/grow-model.ts
git commit -m "feat(data): add Delegation Poker and GROW datasets"
```

---

## Task 5 — Datasets : Ask vs Tell + Moving Motivators

**Files:**
- Create: `src/data/workshops/datasets/ask-vs-tell.ts`
- Create: `src/data/workshops/datasets/moving-motivators.ts`

- [ ] **Créer `src/data/workshops/datasets/ask-vs-tell.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const askVsTellDataset: ClassificationDataset = {
  zones: [
    { id: 'tell', label: 'Tell', description: 'Donner la solution, imposer une décision' },
    { id: 'ask',  label: 'Ask',  description: 'Questionner, faire réfléchir, responsabiliser' },
  ],
  cards: [
    { id: 's1',  text: 'Une faille de sécurité critique nécessite une action immédiate.',                  expectedZone: 'tell' },
    { id: 's2',  text: 'Une règle légale ou contractuelle doit être respectée sans discussion.',           expectedZone: 'tell' },
    { id: 's3',  text: "L'équipe viole la Definition of Done de manière répétée.",                        expectedZone: 'tell' },
    { id: 's4',  text: "Un comportement toxique impacte fortement l'équipe.",                             expectedZone: 'tell' },
    { id: 's5',  text: 'Une urgence production nécessite une décision rapide.',                           expectedZone: 'tell' },
    { id: 's6',  text: "Un standard technique obligatoire n'est pas respecté.",                           expectedZone: 'tell' },
    { id: 's7',  text: 'Un risque majeur est identifié et nécessite une action immédiate.',               expectedZone: 'tell' },
    { id: 's8',  text: 'Un développeur bloque sur une solution technique.',                               expectedZone: 'ask' },
    { id: 's9',  text: "L'équipe manque d'idées pour améliorer la rétrospective.",                       expectedZone: 'ask' },
    { id: 's10', text: 'Le Product Owner hésite sur une priorisation.',                                   expectedZone: 'ask' },
    { id: 's11', text: "L'équipe a du mal à s'organiser efficacement.",                                   expectedZone: 'ask' },
    { id: 's12', text: 'Un membre semble démotivé.',                                                      expectedZone: 'ask' },
    { id: 's13', text: "L'équipe ne comprend pas pourquoi une pratique est utile.",                      expectedZone: 'ask' },
    { id: 's14', text: 'Un conflit léger apparaît entre deux membres.',                                   expectedZone: 'ask' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/moving-motivators.ts`**

```ts
import type { RankingDataset } from '../types'

export const movingMotivatorsDataset: RankingDataset = {
  cards: [
    { id: 'curiosity',   label: 'Curiosity',   description: 'Apprendre et explorer de nouvelles idées' },
    { id: 'honor',       label: 'Honor',       description: 'Agir en accord avec ses valeurs' },
    { id: 'acceptance',  label: 'Acceptance',  description: 'Être reconnu et accepté par les autres' },
    { id: 'mastery',     label: 'Mastery',     description: 'Progresser et devenir expert dans son domaine' },
    { id: 'power',       label: 'Power',       description: "Influencer les décisions et avoir de l'impact" },
    { id: 'freedom',     label: 'Freedom',     description: 'Être autonome et indépendant' },
    { id: 'relatedness', label: 'Relatedness', description: 'Créer des liens et appartenir à un groupe' },
    { id: 'order',       label: 'Order',       description: 'Avoir de la structure et de la stabilité' },
    { id: 'goal',        label: 'Goal',        description: 'Avoir un objectif clair et une mission' },
    { id: 'status',      label: 'Status',      description: 'Être reconnu et respecté socialement' },
  ],
}
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/datasets/ask-vs-tell.ts src/data/workshops/datasets/moving-motivators.ts
git commit -m "feat(data): add Ask vs Tell and Moving Motivators datasets"
```

---

## Task 6 — Datasets : Ishikawa + Troika + TRIZ

**Files:**
- Create: `src/data/workshops/datasets/ishikawa.ts`
- Create: `src/data/workshops/datasets/troika-consulting.ts`
- Create: `src/data/workshops/datasets/triz.ts`

- [ ] **Créer `src/data/workshops/datasets/ishikawa.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const ishikawaDataset: ClassificationDataset = {
  zones: [
    { id: 'people',      label: 'People',      description: 'Compétences, comportements, communication' },
    { id: 'process',     label: 'Process',     description: 'Méthodes, procédures, flux de travail' },
    { id: 'tools',       label: 'Tools',       description: 'Outils, technologies, infrastructure' },
    { id: 'product',     label: 'Product',     description: 'Exigences, périmètre, définition' },
    { id: 'environment', label: 'Environment', description: 'Contexte externe, contraintes, dépendances' },
    { id: 'management',  label: 'Management',  description: 'Décisions, priorités, organisation' },
  ],
  cards: [
    { id: 'c1',  text: 'Manque de communication entre développeurs',                            expectedZone: 'people' },
    { id: 'c2',  text: 'Développeurs peu familiers avec le domaine métier',                     expectedZone: 'people' },
    { id: 'c3',  text: 'Absence de rituel de partage des connaissances',                        expectedZone: 'people' },
    { id: 'c4',  text: 'Processus de refinement insuffisant',                                   expectedZone: 'process' },
    { id: 'c5',  text: "Absence de critères d'acceptation systématiques",                       expectedZone: 'process' },
    { id: 'c6',  text: 'Revues de code trop rares',                                             expectedZone: 'process' },
    { id: 'c7',  text: 'Outils de build instables',                                             expectedZone: 'tools' },
    { id: 'c8',  text: 'Environnements de test non représentatifs de la prod',                  expectedZone: 'tools' },
    { id: 'c9',  text: 'Absence de monitoring en production',                                   expectedZone: 'tools' },
    { id: 'c10', text: 'User Stories mal définies',                                             expectedZone: 'product' },
    { id: 'c11', text: 'Périmètre changeant en cours de Sprint',                                expectedZone: 'product' },
    { id: 'c12', text: 'Critères de succès non définis',                                        expectedZone: 'product' },
    { id: 'c13', text: 'Dépendances externes bloquantes',                                       expectedZone: 'environment' },
    { id: 'c14', text: 'Contraintes réglementaires non anticipées',                             expectedZone: 'environment' },
    { id: 'c15', text: 'Environnement de travail bruyant et source de distraction',             expectedZone: 'environment' },
    { id: 'c16', text: 'Priorités changeant constamment',                                       expectedZone: 'management' },
    { id: 'c17', text: 'Absence de Product Owner disponible',                                   expectedZone: 'management' },
    { id: 'c18', text: 'Pression sur les délais sans ajustement du périmètre',                  expectedZone: 'management' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/troika-consulting.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const troikaConsultingDataset: ClassificationDataset = {
  zones: [
    { id: 'problem',       label: 'Présentation du problème',   description: 'Le porteur expose son défi' },
    { id: 'clarification', label: 'Questions de clarification', description: 'Les consultants posent des questions' },
    { id: 'consultants',   label: 'Échange consultants',        description: 'Les consultants discutent entre eux' },
    { id: 'reaction',      label: 'Réaction du porteur',        description: 'Le porteur partage ce qu\'il retient' },
    { id: 'action',        label: "Plan d'action",              description: 'Définition des prochaines actions' },
  ],
  cards: [
    { id: 'i1',  text: "Mon équipe ne participe pas en rétrospective.",                                  expectedZone: 'problem' },
    { id: 'i2',  text: "Mon équipe ne respecte pas la Definition of Done.",                              expectedZone: 'problem' },
    { id: 'i3',  text: "Je n'arrive pas à faire adhérer le Product Owner.",                             expectedZone: 'problem' },
    { id: 'i4',  text: "Qu'as-tu déjà essayé ?",                                                        expectedZone: 'clarification' },
    { id: 'i5',  text: 'Depuis combien de temps cette situation dure ?',                                  expectedZone: 'clarification' },
    { id: 'i6',  text: "Qu'est-ce qui fonctionne déjà un peu ?",                                        expectedZone: 'clarification' },
    { id: 'i7',  text: "On dirait qu'il y a un problème de sécurité psychologique.",                    expectedZone: 'consultants' },
    { id: 'i8',  text: "Peut-être qu'un format différent de rétrospective aiderait.",                   expectedZone: 'consultants' },
    { id: 'i9',  text: "Le problème semble venir d'un manque de clarté sur les attentes.",              expectedZone: 'consultants' },
    { id: 'i10', text: "Ce qui me parle le plus, c'est l'idée de changer le format.",                   expectedZone: 'reaction' },
    { id: 'i11', text: "Je réalise que je n'ai pas assez exploré les causes.",                          expectedZone: 'reaction' },
    { id: 'i12', text: "Je pense que je dois mieux comprendre l'équipe.",                               expectedZone: 'reaction' },
    { id: 'i13', text: 'Je vais tester un nouveau format de rétrospective au prochain Sprint.',          expectedZone: 'action' },
    { id: 'i14', text: 'Je vais organiser un échange individuel avec le Product Owner.',                 expectedZone: 'action' },
    { id: 'i15', text: "Je vais recueillir du feedback auprès de l'équipe.",                            expectedZone: 'action' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/triz.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const trizDataset: ClassificationDataset = {
  zones: [
    { id: 'communication', label: 'Communication',       description: 'Échanges, écoute, feedback' },
    { id: 'organization',  label: 'Organisation',        description: 'Réunions, rôles, priorités' },
    { id: 'quality',       label: 'Qualité',             description: 'Standards, tests, dette technique' },
    { id: 'collaboration', label: 'Collaboration',       description: 'Travail d\'équipe, entraide, décisions' },
    { id: 'leadership',    label: 'Leadership / posture', description: 'Décisions, conflits, remise en question' },
  ],
  cards: [
    { id: 'b1',  text: 'Ne jamais écouter les autres',                         expectedZone: 'communication' },
    { id: 'b2',  text: 'Couper la parole en permanence',                       expectedZone: 'communication' },
    { id: 'b3',  text: 'Ignorer les feedbacks',                                expectedZone: 'communication' },
    { id: 'b4',  text: 'Ne jamais préparer les réunions',                      expectedZone: 'organization' },
    { id: 'b5',  text: 'Changer les priorités constamment',                    expectedZone: 'organization' },
    { id: 'b6',  text: 'Ne pas clarifier les rôles',                           expectedZone: 'organization' },
    { id: 'b7',  text: 'Ignorer la Definition of Done',                        expectedZone: 'quality' },
    { id: 'b8',  text: 'Livrer du code non testé',                             expectedZone: 'quality' },
    { id: 'b9',  text: 'Accumuler volontairement de la dette technique',       expectedZone: 'quality' },
    { id: 'b10', text: 'Travailler en silo',                                   expectedZone: 'collaboration' },
    { id: 'b11', text: 'Refuser toute aide',                                   expectedZone: 'collaboration' },
    { id: 'b12', text: 'Critiquer sans proposer de solution',                  expectedZone: 'collaboration' },
    { id: 'b13', text: 'Imposer toutes les décisions',                         expectedZone: 'leadership' },
    { id: 'b14', text: 'Éviter les conflits importants',                       expectedZone: 'leadership' },
    { id: 'b15', text: 'Ne jamais remettre en question les pratiques',         expectedZone: 'leadership' },
  ],
}
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/datasets/ishikawa.ts src/data/workshops/datasets/troika-consulting.ts src/data/workshops/datasets/triz.ts
git commit -m "feat(data): add Ishikawa, Troika Consulting and TRIZ datasets"
```

---

## Task 7 — Datasets : Stakeholder Mapping + Scrum Guide

**Files:**
- Create: `src/data/workshops/datasets/stakeholder-mapping.ts`
- Create: `src/data/workshops/datasets/scrum-guide.ts`

- [ ] **Créer `src/data/workshops/datasets/stakeholder-mapping.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const stakeholderMappingDataset: ClassificationDataset = {
  zones: [
    { id: 'high-high', label: 'Influence élevée / Intérêt élevé',  description: 'Gérer étroitement' },
    { id: 'high-low',  label: 'Influence élevée / Intérêt faible', description: 'Satisfaire' },
    { id: 'low-high',  label: 'Influence faible / Intérêt élevé',  description: 'Informer' },
    { id: 'low-low',   label: 'Influence faible / Intérêt faible', description: 'Surveiller' },
  ],
  cards: [
    { id: 'st1', text: 'Sponsor du projet avec fort enjeu business',              expectedZone: 'high-high' },
    { id: 'st2', text: 'Product Owner directement responsable du produit',        expectedZone: 'high-high' },
    { id: 'st3', text: 'Direction IT décisionnaire mais peu impliquée au quotidien', expectedZone: 'high-low' },
    { id: 'st4', text: 'Responsable sécurité validant les livraisons',            expectedZone: 'high-low' },
    { id: 'st5', text: 'Utilisateurs finaux impliqués dans les tests',            expectedZone: 'low-high' },
    { id: 'st6', text: 'Support applicatif en contact avec les clients',          expectedZone: 'low-high' },
    { id: 'st7', text: 'Département administratif peu concerné',                  expectedZone: 'low-low' },
    { id: 'st8', text: 'Observateur occasionnel du projet',                       expectedZone: 'low-low' },
  ],
}
```

- [ ] **Créer `src/data/workshops/datasets/scrum-guide.ts`**

```ts
import type { ClassificationDataset } from '../types'

export const scrumGuideDataset: ClassificationDataset = {
  zones: [
    { id: 'roles',       label: 'Responsabilités', description: 'Product Owner, Scrum Master, Developers' },
    { id: 'events',      label: 'Événements',       description: 'Sprint, Planning, Daily, Review, Retrospective' },
    { id: 'artifacts',   label: 'Artefacts',        description: 'Product Backlog, Sprint Backlog, Increment' },
    { id: 'commitments', label: 'Engagements',      description: 'Objectif Produit, Objectif Sprint, Definition of Done' },
  ],
  cards: [
    { id: 'r1', text: 'Product Owner',           expectedZone: 'roles' },
    { id: 'r2', text: 'Scrum Master',            expectedZone: 'roles' },
    { id: 'r3', text: 'Developers',              expectedZone: 'roles' },
    { id: 'e1', text: 'Sprint',                  expectedZone: 'events' },
    { id: 'e2', text: 'Sprint Planning',         expectedZone: 'events' },
    { id: 'e3', text: 'Daily Scrum',             expectedZone: 'events' },
    { id: 'e4', text: 'Sprint Review',           expectedZone: 'events' },
    { id: 'e5', text: 'Sprint Retrospective',    expectedZone: 'events' },
    { id: 'a1', text: 'Product Backlog',         expectedZone: 'artifacts' },
    { id: 'a2', text: 'Sprint Backlog',          expectedZone: 'artifacts' },
    { id: 'a3', text: 'Increment',               expectedZone: 'artifacts' },
    { id: 'c1', text: 'Objectif Produit',        expectedZone: 'commitments' },
    { id: 'c2', text: 'Objectif Sprint',         expectedZone: 'commitments' },
    { id: 'c3', text: "Définition du « Done »",  expectedZone: 'commitments' },
  ],
}
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/datasets/stakeholder-mapping.ts src/data/workshops/datasets/scrum-guide.ts
git commit -m "feat(data): add Stakeholder Mapping and Scrum Guide datasets"
```

---

## Task 8 — Définitions des 11 ateliers existants

**Files:**
- Create: `src/data/workshops/definitions.ts`

- [ ] **Créer `src/data/workshops/definitions.ts` avec les 11 ateliers existants**

```ts
import type { WorkshopDefinition } from './types'
import { sbiDataset } from './datasets/sbi'
import { conflictDataset } from './datasets/conflict'
import { delegationPokerDataset } from './datasets/delegation-poker'
import { growDataset } from './datasets/grow-model'
import { askVsTellDataset } from './datasets/ask-vs-tell'
import { movingMotivatorsDataset } from './datasets/moving-motivators'
import { ishikawaDataset } from './datasets/ishikawa'
import { troikaConsultingDataset } from './datasets/troika-consulting'
import { trizDataset } from './datasets/triz'
import { stakeholderMappingDataset } from './datasets/stakeholder-mapping'
import { scrumGuideDataset } from './datasets/scrum-guide'

const EXISTING: WorkshopDefinition[] = [
  {
    id: 'scrum-guide',
    slug: 'scrum-guide',
    title: 'Le cadre Scrum',
    route: '/ateliers/scrum-guide',
    categorySlug: 'team-intelligence',
    toolName: 'Scrum Guide',
    level: 'beginner',
    durationMinutes: 10,
    interactionType: 'diagram',
    summary: 'Replacez les rôles, événements, artefacts et engagements du Scrum Guide au bon endroit sur le diagramme.',
    pedagogy: {
      objectives: [
        'Identifier les 3 responsabilités Scrum',
        'Nommer les 5 événements Scrum',
        'Associer chaque artefact à son engagement',
      ],
      toolExplanation: 'Le Scrum Guide définit le cadre Scrum : 3 responsabilités (Product Owner, Scrum Master, Developers), 5 événements et 3 artefacts, chacun avec un engagement associé (Objectif Produit, Objectif Sprint, Definition of Done).',
      whenToUse: [
        'Pour vérifier sa compréhension du cadre Scrum',
        'En formation initiale ou lors d\'un onboarding',
        'Pour consolider les bases avant d\'approfondir des pratiques avancées',
      ],
      expectedOutput: [
        'Placement correct des 14 éléments du Scrum Guide',
        'Distinction claire entre rôles, événements, artefacts et engagements',
      ],
      prerequisites: ['Connaissance basique de Scrum recommandée'],
    },
    dataset: scrumGuideDataset,
  },
  {
    id: 'thomas-kilmann',
    slug: 'thomas-kilmann',
    title: 'Gestion des conflits — Thomas-Kilmann',
    route: '/ateliers/conflits',
    categorySlug: 'conflict-and-communication',
    toolName: 'Thomas-Kilmann Conflict Mode Instrument',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'matrix',
    summary: 'Positionnez les 5 modes du modèle Thomas-Kilmann sur le diagramme, puis associez des situations réelles à chaque mode.',
    pedagogy: {
      objectives: [
        'Nommer les 5 modes de gestion des conflits',
        'Positionner chaque mode sur le diagramme assertivité/coopération',
        'Reconnaître quel mode est adapté à quelle situation',
      ],
      toolExplanation: 'Le modèle Thomas-Kilmann décrit 5 façons de gérer un conflit selon deux dimensions : assertivité (chercher à satisfaire ses propres intérêts) et coopération (chercher à satisfaire les intérêts de l\'autre). Les 5 modes sont : Compétition, Collaboration, Compromis, Évitement, Accommodation.',
      whenToUse: [
        'Pour comprendre sa propre tendance en situation de conflit',
        'Pour former une équipe à la gestion constructive des tensions',
        'Pour choisir consciemment le mode adapté au contexte',
      ],
      expectedOutput: [
        'Positionnement correct des 5 modes sur le diagramme',
        'Association de situations réelles aux modes appropriés',
      ],
    },
    dataset: conflictDataset,
  },
  {
    id: 'delegation-poker',
    slug: 'delegation-poker',
    title: 'Delegation Poker',
    route: '/ateliers/delegation-poker',
    categorySlug: 'management-3-0',
    toolName: 'Delegation Poker',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: 'Ordonnez les 7 niveaux de délégation, puis associez des situations Scrum au niveau approprié.',
    pedagogy: {
      objectives: [
        'Nommer et ordonner les 7 niveaux de délégation',
        'Identifier le niveau approprié selon le contexte',
        'Distinguer délégation totale et autonomie guidée',
      ],
      toolExplanation: 'Outil Management 3.0 qui définit 7 niveaux d\'autorité décisionnelle, du "Tell" (je décide et informe) au "Delegate" (l\'équipe décide en autonomie totale). Il aide à clarifier qui décide quoi et à quel niveau.',
      whenToUse: [
        'Pour clarifier les zones d\'autorité dans une équipe',
        'Pour réduire la frustration liée aux décisions opaques',
        'Lors de l\'onboarding d\'une nouvelle équipe Scrum',
      ],
      expectedOutput: [
        'Ordre maîtrisé des 7 niveaux de délégation',
        'Correspondance correcte entre situations et niveaux',
      ],
    },
    dataset: delegationPokerDataset,
  },
  {
    id: 'grow-model',
    slug: 'grow-model',
    title: 'Modèle GROW',
    route: '/ateliers/grow-model',
    categorySlug: 'coaching-and-posture',
    toolName: 'GROW Model',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: 'Ordonnez les 4 étapes du modèle GROW, puis associez des questions de coaching à chaque étape.',
    pedagogy: {
      objectives: [
        'Nommer les 4 étapes du modèle GROW',
        'Distinguer les phases Goal, Reality, Options et Will',
        'Associer des questions de coaching à chaque étape',
      ],
      toolExplanation: 'GROW est un modèle de coaching structuré en 4 étapes pour accompagner une personne vers une décision et un plan d\'action : Goal (objectif), Reality (situation actuelle), Options (possibilités), Will (engagement).',
      whenToUse: [
        'Pour mener un entretien de coaching individuel',
        'Pour aider un membre à clarifier un objectif ou une décision',
        'Quand on veut guider sans imposer de solution',
      ],
      expectedOutput: [
        'Séquence GROW mémorisée',
        'Banque de questions de coaching par étape',
      ],
    },
    dataset: growDataset,
  },
  {
    id: 'stakeholder-mapping',
    slug: 'stakeholder-mapping',
    title: 'Stakeholder Mapping',
    route: '/ateliers/stakeholder-mapping',
    categorySlug: 'stakeholders-and-alignment',
    toolName: 'Stakeholder Mapping',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'matrix',
    summary: 'Associez la bonne stratégie à chaque quadrant de la matrice Influence / Intérêt, puis positionnez les parties prenantes.',
    pedagogy: {
      objectives: [
        'Identifier les 4 quadrants de la matrice Influence/Intérêt',
        'Associer la bonne stratégie à chaque quadrant',
        'Positionner des parties prenantes concrètes sur la matrice',
      ],
      toolExplanation: 'La cartographie des parties prenantes positionne chaque acteur selon son niveau d\'influence et d\'intérêt. Chaque quadrant correspond à une stratégie : Gérer étroitement, Satisfaire, Informer, Surveiller.',
      whenToUse: [
        'En début de projet pour cartographier l\'environnement',
        'Pour définir la stratégie de communication et d\'engagement',
        'Pour prioriser les efforts de gestion des relations',
      ],
      expectedOutput: [
        'Matrice complétée avec une stratégie par quadrant',
        'Positionnement de parties prenantes réelles sur la matrice',
      ],
    },
    dataset: stakeholderMappingDataset,
  },
  {
    id: 'ask-vs-tell',
    slug: 'ask-vs-tell',
    title: 'Ask vs Tell',
    route: '/ateliers/ask-vs-tell',
    categorySlug: 'coaching-and-posture',
    toolName: 'Ask vs Tell',
    level: 'advanced',
    durationMinutes: 20,
    interactionType: 'guided-form',
    summary: "Identifiez la bonne posture de coaching, classez des situations selon qu'elles appellent une posture directive ou de coaching, puis reformulez des phrases directives en questions ouvertes.",
    pedagogy: {
      objectives: [
        'Distinguer la posture directive (Tell) de la posture de coaching (Ask)',
        'Identifier dans quelle situation chaque posture est adaptée',
        'Reformuler des injonctions en questions ouvertes',
      ],
      toolExplanation: 'Le modèle Ask vs Tell décrit deux postures : Tell (donner la réponse, diriger) et Ask (poser des questions, responsabiliser). Le Scrum Master efficace sait choisir consciemment sa posture selon le contexte.',
      whenToUse: [
        'Pour développer l\'autonomie des membres d\'une équipe',
        'Lors d\'entretiens de coaching ou de résolution de problèmes',
        'Pour éviter de créer une dépendance à l\'expert',
      ],
      expectedOutput: [
        'Identification de sa posture dominante',
        'Capacité à reformuler des phrases directives en questions ouvertes',
      ],
    },
    dataset: askVsTellDataset,
  },
  {
    id: 'moving-motivators',
    slug: 'moving-motivators',
    title: 'Moving Motivators',
    route: '/ateliers/moving-motivators',
    categorySlug: 'management-3-0',
    toolName: 'Moving Motivators',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: "Classez vos 10 motivateurs intrinsèques par importance, évaluez votre satisfaction pour chacun, puis construisez un plan d'action pour les motivateurs critiques.",
    pedagogy: {
      objectives: [
        'Nommer les 10 motivateurs intrinsèques CHAMPFROGS',
        'Classer ses motivateurs par ordre d\'importance personnelle',
        'Identifier les motivateurs sous tension et définir des actions',
      ],
      toolExplanation: 'Moving Motivators est un outil Management 3.0 basé sur 10 motivateurs intrinsèques (CHAMPFROGS) : Curiosity, Honor, Acceptance, Mastery, Power, Freedom, Relatedness, Order, Goal, Status.',
      whenToUse: [
        'Pour comprendre les sources de motivation d\'un membre d\'équipe',
        'Avant ou après un changement organisationnel',
        'En coaching individuel pour explorer les valeurs et besoins',
      ],
      expectedOutput: [
        'Classement personnel des 10 motivateurs',
        'Identification des motivateurs critiques et plan d\'action',
      ],
    },
    dataset: movingMotivatorsDataset,
  },
  {
    id: 'ishikawa',
    slug: 'ishikawa',
    title: 'Ishikawa (Fishbone)',
    route: '/ateliers/ishikawa',
    categorySlug: 'problem-solving',
    toolName: 'Diagramme Ishikawa',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'diagram',
    summary: 'Positionnez les 6 catégories sur le diagramme en arête de poisson, classez 18 causes potentielles, puis identifiez les causes racines.',
    pedagogy: {
      objectives: [
        'Identifier les 6 catégories du diagramme Ishikawa',
        'Classer des causes potentielles dans la bonne catégorie',
        'Distinguer causes racines et symptômes',
      ],
      toolExplanation: 'Le diagramme Ishikawa (arête de poisson) est un outil d\'analyse de causes racines. Il organise les causes d\'un problème en 6 catégories : People, Process, Tools, Product, Environment, Management.',
      whenToUse: [
        'En rétrospective pour analyser un problème récurrent',
        'Pour préparer un plan d\'amélioration structuré',
        'Quand les symptômes sont connus mais pas les causes profondes',
      ],
      expectedOutput: [
        'Diagramme Ishikawa complété avec des causes classées par catégorie',
        'Identification des causes racines probables',
      ],
    },
    dataset: ishikawaDataset,
  },
  {
    id: 'troika-consulting',
    slug: 'troika-consulting',
    title: 'Troika Consulting',
    route: '/ateliers/troika-consulting',
    categorySlug: 'facilitation',
    toolName: 'Troika Consulting',
    level: 'advanced',
    durationMinutes: 20,
    interactionType: 'dialogue',
    summary: 'Ordonnez les 5 étapes de la pratique Troika Consulting, classez 15 interventions dans la bonne étape, puis simulez votre rôle de consultant.',
    pedagogy: {
      objectives: [
        'Mémoriser les 5 étapes du Troika Consulting',
        'Distinguer le rôle du porteur et celui des consultants',
        'Pratiquer des questions de clarification non directives',
      ],
      toolExplanation: 'Le Troika Consulting est une pratique de co-développement en trinôme : un porteur expose son défi, deux consultants posent des questions de clarification, échangent entre eux, puis le porteur réagit et définit un plan d\'action.',
      whenToUse: [
        'En rétrospective pour traiter des sujets complexes',
        'Pour développer l\'intelligence collective',
        'Quand un problème nécessite plusieurs perspectives',
      ],
      expectedOutput: [
        'Maîtrise de la séquence en 5 étapes',
        'Capacité à poser des questions de clarification non directives',
      ],
    },
    dataset: troikaConsultingDataset,
  },
  {
    id: 'sbi',
    slug: 'sbi',
    title: 'SBI — Situation Behavior Impact',
    route: '/ateliers/sbi',
    categorySlug: 'conflict-and-communication',
    toolName: 'SBI',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: 'Ordonnez les 3 composantes du modèle SBI, classez 12 éléments par catégorie, puis construisez un feedback complet à partir d\'un cas concret.',
    pedagogy: {
      objectives: [
        'Identifier les trois composantes du modèle SBI',
        'Différencier un comportement observable d\'un jugement',
        'Formuler un feedback clair et actionnable',
      ],
      toolExplanation: 'SBI est un modèle de feedback structuré en trois parties : Situation (contexte précis), Behavior (comportement observable) et Impact (effet produit). Il aide à éviter les jugements vagues en ancrant le feedback dans des faits.',
      whenToUse: [
        'Pour donner un feedback individuel sur un comportement',
        'Pour traiter une situation problématique sans accusation',
        'Pour rendre un retour plus factuel et moins émotionnel',
      ],
      expectedOutput: [
        'Un feedback complet au format Situation → Behavior → Impact',
        'Une distinction claire entre fait, comportement et impact',
      ],
    },
    dataset: sbiDataset,
  },
  {
    id: 'triz',
    slug: 'triz',
    title: 'TRIZ — Anti-Goal',
    route: '/ateliers/triz',
    categorySlug: 'facilitation',
    toolName: 'TRIZ Anti-Goal',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'guided-form',
    summary: "Formulez l'anti-objectif de votre défi Scrum, classez 15 comportements destructeurs, identifiez ceux présents dans votre contexte, puis construisez votre plan d'élimination.",
    pedagogy: {
      objectives: [
        'Formuler un anti-objectif à partir d\'un objectif cible',
        'Identifier des comportements destructeurs par catégorie',
        'Construire un plan d\'élimination concret',
      ],
      toolExplanation: 'TRIZ appliqué au management consiste à inverser le problème : au lieu de chercher comment améliorer une situation, on cherche comment la rendre catastrophique. Cette inversion révèle des comportements nuisibles déjà présents.',
      whenToUse: [
        'En rétrospective pour identifier des anti-patterns d\'équipe',
        'Quand l\'équipe peine à progresser malgré les bonnes intentions',
        'Pour rendre visibles les comportements bloquants de manière ludique',
      ],
      expectedOutput: [
        'Un anti-objectif clair et cohérent',
        'Liste des comportements destructeurs présents dans le contexte',
        'Plan d\'élimination avec actions concrètes et alternatives positives',
      ],
    },
    dataset: trizDataset,
  },
]

export const WORKSHOP_DEFINITIONS: WorkshopDefinition[] = EXISTING
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

- [ ] **Commit**

```bash
git add src/data/workshops/definitions.ts
git commit -m "feat(data): add WorkshopDefinition for 11 existing ateliers"
```

---

## Task 9 — Définitions des 23 ateliers coming soon + index.ts

**Files:**
- Modify: `src/data/workshops/definitions.ts`
- Create: `src/data/workshops/index.ts`

- [ ] **Ajouter les 23 coming soon à la fin de `definitions.ts`**

Remplacer la dernière ligne `export const WORKSHOP_DEFINITIONS: WorkshopDefinition[] = EXISTING` par :

```ts
const COMING_SOON: WorkshopDefinition[] = [
  { id: 'nonviolent-communication', slug: 'nonviolent-communication', title: 'Communication Non Violente', route: '/ateliers/nonviolent-communication', categorySlug: 'conflict-and-communication', toolName: 'CNV', level: 'intermediate', durationMinutes: 20, interactionType: 'guided-form', summary: 'Structurer une communication empathique en 4 étapes : Observation, Sentiment, Besoin, Demande.', comingSoon: true },
  { id: 'ladder-of-inference', slug: 'ladder-of-inference', title: "Échelle d'inférence", route: '/ateliers/ladder-of-inference', categorySlug: 'conflict-and-communication', toolName: "Ladder of Inference", level: 'advanced', durationMinutes: 20, interactionType: 'diagram', summary: 'Comprendre comment nos croyances influencent nos conclusions et nos actions.', comingSoon: true },
  { id: 'desc', slug: 'desc', title: 'Méthode DESC', route: '/ateliers/desc', categorySlug: 'conflict-and-communication', toolName: 'DESC', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Formuler une critique constructive en 4 étapes : Décrire, Exprimer, Spécifier, Conclure.', comingSoon: true },
  { id: 'feedforward', slug: 'feedforward', title: 'Feedforward', route: '/ateliers/feedforward', categorySlug: 'conflict-and-communication', toolName: 'Feedforward', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: "Donner du feedback orienté vers l'avenir plutôt que le passé.", comingSoon: true },
  { id: 'active-listening', slug: 'active-listening', title: 'Écoute active', route: '/ateliers/active-listening', categorySlug: 'conflict-and-communication', toolName: 'Active Listening', level: 'intermediate', durationMinutes: 15, interactionType: 'reflection', summary: "Pratiquer les niveaux d'écoute et les techniques de reformulation.", comingSoon: true },
  { id: 'conflict-mediation', slug: 'conflict-mediation', title: 'Médiation de conflit', route: '/ateliers/conflict-mediation', categorySlug: 'conflict-and-communication', toolName: 'Conflict Mediation', level: 'advanced', durationMinutes: 25, interactionType: 'dialogue', summary: 'Faciliter la résolution d\'un conflit entre deux parties en tant que tiers neutre.', comingSoon: true },
  { id: 'silence-facilitation', slug: 'silence-facilitation', title: 'Le silence en facilitation', route: '/ateliers/silence-facilitation', categorySlug: 'facilitation', toolName: 'Silence Facilitation', level: 'intermediate', durationMinutes: 15, interactionType: 'reflection', summary: "Utiliser le silence comme outil de facilitation pour laisser émerger les idées.", comingSoon: true },
  { id: 'liberating-structures', slug: 'liberating-structures', title: 'Liberating Structures', route: '/ateliers/liberating-structures', categorySlug: 'facilitation', toolName: 'Liberating Structures', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Découvrir et pratiquer les structures libératrices pour engager tous les participants.', comingSoon: true },
  { id: '1-2-4-all', slug: '1-2-4-all', title: '1-2-4-All', route: '/ateliers/1-2-4-all', categorySlug: 'facilitation', toolName: '1-2-4-All', level: 'beginner', durationMinutes: 15, interactionType: 'reflection', summary: 'Structure de facilitation pour générer des idées seul, en binôme, en groupe, puis collectivement.', comingSoon: true },
  { id: 'fist-of-five', slug: 'fist-of-five', title: 'Fist of Five', route: '/ateliers/fist-of-five', categorySlug: 'facilitation', toolName: 'Fist of Five', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: "Mesurer le niveau d'accord d'un groupe sur une décision en 6 niveaux.", comingSoon: true },
  { id: 'dot-voting', slug: 'dot-voting', title: 'Dot Voting', route: '/ateliers/dot-voting', categorySlug: 'facilitation', toolName: 'Dot Voting', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: 'Prioriser collectivement des options en distribuant des points de vote.', comingSoon: true },
  { id: 'roman-voting', slug: 'roman-voting', title: 'Roman Voting', route: '/ateliers/roman-voting', categorySlug: 'facilitation', toolName: 'Roman Voting', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: "Recueillir rapidement l'avis d'un groupe : pouce levé, baissé ou horizontal.", comingSoon: true },
  { id: 'facilitation-canvas', slug: 'facilitation-canvas', title: 'Facilitation Canvas', route: '/ateliers/facilitation-canvas', categorySlug: 'facilitation', toolName: 'Facilitation Canvas', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Préparer une session de facilitation avec un canvas structuré.", comingSoon: true },
  { id: 'powerful-questions', slug: 'powerful-questions', title: 'Powerful Questions', route: '/ateliers/powerful-questions', categorySlug: 'coaching-and-posture', toolName: 'Powerful Questions', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Construire des questions ouvertes, non directives et orientées solution.', comingSoon: true },
  { id: 'reframing', slug: 'reframing', title: 'Recadrage cognitif', route: '/ateliers/reframing', categorySlug: 'coaching-and-posture', toolName: 'Reframing', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Transformer une croyance limitante en perspective constructive.', comingSoon: true },
  { id: 'working-agreements', slug: 'working-agreements', title: 'Working Agreements', route: '/ateliers/working-agreements', categorySlug: 'team-intelligence', toolName: 'Working Agreements', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: "Construire collectivement les règles de fonctionnement d'une équipe.", comingSoon: true },
  { id: 'team-charter', slug: 'team-charter', title: 'Team Charter', route: '/ateliers/team-charter', categorySlug: 'team-intelligence', toolName: 'Team Charter', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Définir l'identité, les valeurs et les engagements d'une équipe.", comingSoon: true },
  { id: 'empathy-map', slug: 'empathy-map', title: "Empathy Map", route: '/ateliers/empathy-map', categorySlug: 'team-intelligence', toolName: 'Empathy Map', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.", comingSoon: true },
  { id: 'personal-maps', slug: 'personal-maps', title: 'Personal Maps', route: '/ateliers/personal-maps', categorySlug: 'management-3-0', toolName: 'Personal Maps', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: 'Créer une carte mentale personnelle pour mieux se connaître et se faire connaître.', comingSoon: true },
  { id: 'celebration-grid', slug: 'celebration-grid', title: 'Celebration Grid', route: '/ateliers/celebration-grid', categorySlug: 'management-3-0', toolName: 'Celebration Grid', level: 'intermediate', durationMinutes: 15, interactionType: 'matrix', summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.', comingSoon: true },
  { id: 'team-health-check', slug: 'team-health-check', title: 'Team Health Check', route: '/ateliers/team-health-check', categorySlug: 'management-3-0', toolName: 'Team Health Check', level: 'intermediate', durationMinutes: 20, interactionType: 'voting', summary: "Évaluer collectivement la santé de l'équipe sur plusieurs dimensions.", comingSoon: true },
  { id: '5-whys', slug: '5-whys', title: '5 Pourquoi', route: '/ateliers/5-whys', categorySlug: 'problem-solving', toolName: '5 Whys', level: 'beginner', durationMinutes: 15, interactionType: 'guided-form', summary: 'Identifier la cause racine d\'un problème en posant 5 fois la question "Pourquoi ?".', comingSoon: true },
  { id: 'root-cause-analysis', slug: 'root-cause-analysis', title: "Analyse des causes racines", route: '/ateliers/root-cause-analysis', categorySlug: 'problem-solving', toolName: 'Root Cause Analysis', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: 'Méthode structurée pour remonter des symptômes aux causes profondes d\'un problème.', comingSoon: true },
]

export const WORKSHOP_DEFINITIONS: WorkshopDefinition[] = [...EXISTING, ...COMING_SOON]
```

- [ ] **Créer `src/data/workshops/index.ts`**

```ts
export { WORKSHOP_CATEGORIES } from './categories'
export { WORKSHOP_DEFINITIONS } from './definitions'
export type {
  WorkshopDefinition,
  WorkshopCategory,
  WorkshopCategorySlug,
  WorkshopLevel,
  WorkshopInteractionType,
  WorkshopPedagogy,
  WorkshopDataset,
  ClassificationDataset,
  RankingDataset,
  CanvasDataset,
  VotingDataset,
  LEVEL_LABELS,
  LEVEL_BADGE_VARIANT,
  INTERACTION_TYPE_LABELS,
} from './types'
export {
  LEVEL_LABELS,
  LEVEL_BADGE_VARIANT,
  INTERACTION_TYPE_LABELS,
} from './types'
```

- [ ] **Vérifier la compilation**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Commit**

```bash
git add src/data/workshops/definitions.ts src/data/workshops/index.ts
git commit -m "feat(data): add 23 coming soon definitions and data layer index"
```

---

## Task 10 — WorkshopPedagogyPanel (TDD)

**Files:**
- Create: `src/components/WorkshopPedagogyPanel/WorkshopPedagogyPanel.test.tsx`
- Create: `src/components/WorkshopPedagogyPanel/index.tsx`

- [ ] **Écrire le test**

Créer `src/components/WorkshopPedagogyPanel/WorkshopPedagogyPanel.test.tsx` :

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkshopPedagogyPanel } from '.'
import type { WorkshopDefinition } from '../../data/workshops/types'

const mockWorkshop: WorkshopDefinition = {
  id: 'test',
  slug: 'test',
  title: 'Test Workshop',
  route: '/ateliers/test',
  categorySlug: 'facilitation',
  toolName: 'Test Tool',
  level: 'intermediate',
  durationMinutes: 15,
  interactionType: 'drag-and-drop',
  summary: 'Test summary',
  pedagogy: {
    objectives: ['Objectif 1', 'Objectif 2'],
    toolExplanation: "Explication de l'outil",
    whenToUse: ['Cas 1', 'Cas 2'],
    expectedOutput: ['Livrable 1'],
    prerequisites: ['Prérequis 1'],
  },
}

describe('WorkshopPedagogyPanel', () => {
  it('renders toggle button', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    expect(screen.getByRole('button', { name: /Objectifs & contexte/ })).toBeInTheDocument()
  })

  it('is closed by default — objectives not visible', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    expect(screen.queryByText('Objectif 1')).not.toBeInTheDocument()
  })

  it('shows objectives when toggle clicked', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Objectif 1')).toBeInTheDocument()
    expect(screen.getByText('Objectif 2')).toBeInTheDocument()
  })

  it('shows tool explanation when opened', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText(/Explication de l'outil/)).toBeInTheDocument()
  })

  it('shows prerequisites when provided', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Prérequis 1')).toBeInTheDocument()
  })

  it('hides prerequisites section when not provided', () => {
    const w = { ...mockWorkshop, pedagogy: { ...mockWorkshop.pedagogy!, prerequisites: undefined } }
    render(<WorkshopPedagogyPanel workshop={w} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.queryByText(/Prérequis/i)).not.toBeInTheDocument()
  })

  it('closes when toggle clicked again', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Objectif 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.queryByText('Objectif 1')).not.toBeInTheDocument()
  })
})
```

- [ ] **Vérifier que les tests échouent (RED)**

```bash
npx vitest run src/components/WorkshopPedagogyPanel/WorkshopPedagogyPanel.test.tsx
```

Expected: erreur "Cannot find module '.' " — module non créé.

- [ ] **Créer `src/components/WorkshopPedagogyPanel/index.tsx`**

```tsx
import { useState } from 'react'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  workshop: WorkshopDefinition
}

export function WorkshopPedagogyPanel({ workshop }: Props) {
  const [open, setOpen] = useState(false)

  if (!workshop.pedagogy) return null

  const { objectives, toolExplanation, whenToUse, expectedOutput, prerequisites } = workshop.pedagogy

  return (
    <div className="pedagogy-panel">
      <button className="pedagogy-panel__toggle" onClick={() => setOpen(o => !o)}>
        Objectifs &amp; contexte {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="pedagogy-panel__body">
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Objectifs pédagogiques</p>
            <ul className="pedagogy-panel__list">
              {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">L'outil</p>
            <p>{toolExplanation}</p>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Quand l'utiliser</p>
            <ul className="pedagogy-panel__list">
              {whenToUse.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Ce que vous allez produire</p>
            <ul className="pedagogy-panel__list">
              {expectedOutput.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          {prerequisites && prerequisites.length > 0 && (
            <div className="pedagogy-panel__section">
              <p className="pedagogy-panel__section-title">Prérequis</p>
              <ul className="pedagogy-panel__list">
                {prerequisites.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Vérifier que les tests passent (GREEN)**

```bash
npx vitest run src/components/WorkshopPedagogyPanel/WorkshopPedagogyPanel.test.tsx
```

Expected: 7 tests passed.

- [ ] **Commit**

```bash
git add src/components/WorkshopPedagogyPanel/
git commit -m "feat: add WorkshopPedagogyPanel component"
```

---

## Task 11 — WorkshopCard (TDD)

**Files:**
- Create: `src/components/WorkshopCard/WorkshopCard.test.tsx`
- Create: `src/components/WorkshopCard/index.tsx`

- [ ] **Écrire le test**

Créer `src/components/WorkshopCard/WorkshopCard.test.tsx` :

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { WorkshopCard } from '.'
import type { WorkshopDefinition } from '../../data/workshops/types'

const mockWorkshop: WorkshopDefinition = {
  id: 'test',
  slug: 'test',
  title: 'Test Workshop',
  route: '/ateliers/test',
  categorySlug: 'facilitation',
  toolName: 'Test Tool',
  level: 'intermediate',
  durationMinutes: 15,
  interactionType: 'drag-and-drop',
  summary: 'Test summary',
}

describe('WorkshopCard', () => {
  it('renders title and summary', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText('Test Workshop')).toBeInTheDocument()
    expect(screen.getByText('Test summary')).toBeInTheDocument()
  })

  it('renders launch link to workshop route', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /Lancer/ })).toHaveAttribute('href', '/ateliers/test')
  })

  it('shows duration in minutes', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText(/15 min/)).toBeInTheDocument()
  })

  it('shows Bientôt badge and no launch link for coming soon', () => {
    const cs: WorkshopDefinition = { ...mockWorkshop, comingSoon: true }
    render(<MemoryRouter><WorkshopCard workshop={cs} /></MemoryRouter>)
    expect(screen.getByText('Bientôt')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Lancer/ })).not.toBeInTheDocument()
  })

  it('shows level badge', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText('Intermédiaire')).toBeInTheDocument()
  })
})
```

- [ ] **Vérifier RED**

```bash
npx vitest run src/components/WorkshopCard/WorkshopCard.test.tsx
```

Expected: erreur "Cannot find module".

- [ ] **Créer `src/components/WorkshopCard/index.tsx`**

```tsx
import { Link } from 'react-router-dom'
import type { WorkshopDefinition } from '../../data/workshops/types'
import { LEVEL_LABELS, LEVEL_BADGE_VARIANT, INTERACTION_TYPE_LABELS } from '../../data/workshops/types'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'

interface Props {
  workshop: WorkshopDefinition
}

export function WorkshopCard({ workshop }: Props) {
  const category = WORKSHOP_CATEGORIES.find(c => c.slug === workshop.categorySlug)

  if (workshop.comingSoon) {
    return (
      <article className="workshop-card workshop-card--coming-soon">
        <div className="scenario-card__meta">
          <span className="badge badge--blue">{category?.name ?? workshop.categorySlug}</span>
          <span className="badge">Bientôt</span>
        </div>
        <h2 className="scenario-card__title">{workshop.title}</h2>
        <p className="scenario-card__theme">{workshop.summary}</p>
      </article>
    )
  }

  return (
    <article className="workshop-card">
      <div className="scenario-card__meta">
        <span className={`badge badge--${LEVEL_BADGE_VARIANT[workshop.level]}`}>
          {LEVEL_LABELS[workshop.level]}
        </span>
        <span className="scenario-card__duration">{workshop.durationMinutes} min</span>
      </div>
      <h2 className="scenario-card__title">{workshop.title}</h2>
      <p className="scenario-card__theme">{workshop.summary}</p>
      <div className="workshop-card__footer">
        <span className="competency-tag">{INTERACTION_TYPE_LABELS[workshop.interactionType]}</span>
        <Link to={workshop.route} className="btn btn--primary">Lancer l'atelier</Link>
      </div>
    </article>
  )
}
```

- [ ] **Vérifier GREEN**

```bash
npx vitest run src/components/WorkshopCard/WorkshopCard.test.tsx
```

Expected: 5 tests passed.

- [ ] **Commit**

```bash
git add src/components/WorkshopCard/
git commit -m "feat: add WorkshopCard component"
```

---

## Task 12 — WorkshopCategoryNav (TDD)

**Files:**
- Create: `src/components/WorkshopCategoryNav/WorkshopCategoryNav.test.tsx`
- Create: `src/components/WorkshopCategoryNav/index.tsx`

- [ ] **Écrire le test**

Créer `src/components/WorkshopCategoryNav/WorkshopCategoryNav.test.tsx` :

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkshopCategoryNav } from '.'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'

describe('WorkshopCategoryNav', () => {
  it('renders Tous button', () => {
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Tous/ })).toBeInTheDocument()
  })

  it('renders one button per category', () => {
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Management 3\.0/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Problem solving/ })).toBeInTheDocument()
  })

  it('calls onSelect with category slug when clicked', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(onSelect).toHaveBeenCalledWith('facilitation')
  })

  it('calls onSelect with null when active category clicked again', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory="facilitation" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('calls onSelect with null when Tous clicked', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory="facilitation" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Tous/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
```

- [ ] **Vérifier RED**

```bash
npx vitest run src/components/WorkshopCategoryNav/WorkshopCategoryNav.test.tsx
```

Expected: erreur "Cannot find module".

- [ ] **Créer `src/components/WorkshopCategoryNav/index.tsx`**

```tsx
import type { WorkshopCategory, WorkshopCategorySlug, WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  categories: WorkshopCategory[]
  workshops: WorkshopDefinition[]
  activeCategory: WorkshopCategorySlug | null
  onSelect: (slug: WorkshopCategorySlug | null) => void
}

export function WorkshopCategoryNav({ categories, workshops, activeCategory, onSelect }: Props) {
  const totalAvailable = workshops.filter(w => !w.comingSoon).length

  return (
    <nav className="workshop-category-nav">
      <button
        className={`workshop-category-nav__btn${activeCategory === null ? ' workshop-category-nav__btn--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        Tous ({totalAvailable})
      </button>
      {categories.map(cat => {
        const count = workshops.filter(w => w.categorySlug === cat.slug && !w.comingSoon).length
        const isActive = activeCategory === cat.slug
        return (
          <button
            key={cat.slug}
            className={`workshop-category-nav__btn${isActive ? ' workshop-category-nav__btn--active' : ''}`}
            onClick={() => onSelect(isActive ? null : cat.slug)}
          >
            {cat.name} ({count})
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Vérifier GREEN**

```bash
npx vitest run src/components/WorkshopCategoryNav/WorkshopCategoryNav.test.tsx
```

Expected: 5 tests passed.

- [ ] **Commit**

```bash
git add src/components/WorkshopCategoryNav/
git commit -m "feat: add WorkshopCategoryNav component"
```

---

## Task 13 — WorkshopCategoryPage (TDD)

**Files:**
- Create: `src/components/WorkshopCategoryPage/WorkshopCategoryPage.test.tsx`
- Create: `src/components/WorkshopCategoryPage/index.tsx`

- [ ] **Écrire le test**

Créer `src/components/WorkshopCategoryPage/WorkshopCategoryPage.test.tsx` :

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { WorkshopCategoryPage } from '.'

function renderWithRoute(slug: string) {
  render(
    <MemoryRouter initialEntries={[`/ateliers/categories/${slug}`]}>
      <Routes>
        <Route path="/ateliers/categories/:slug" element={<WorkshopCategoryPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkshopCategoryPage', () => {
  it('renders category title', () => {
    renderWithRoute('facilitation')
    expect(screen.getByRole('heading', { name: 'Facilitation' })).toBeInTheDocument()
  })

  it('renders category description', () => {
    renderWithRoute('facilitation')
    expect(screen.getByText(/concevoir, animer/)).toBeInTheDocument()
  })

  it('renders available workshops in the category', () => {
    renderWithRoute('facilitation')
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.getByText(/TRIZ/)).toBeInTheDocument()
  })

  it('shows Par où commencer section', () => {
    renderWithRoute('facilitation')
    expect(screen.getByText(/Par où commencer/)).toBeInTheDocument()
  })

  it('renders back link to /ateliers', () => {
    renderWithRoute('facilitation')
    expect(screen.getByRole('link', { name: /Ateliers/ })).toHaveAttribute('href', '/ateliers')
  })

  it('shows error for unknown category slug', () => {
    renderWithRoute('unknown-slug')
    expect(screen.getByText(/introuvable/i)).toBeInTheDocument()
  })
})
```

- [ ] **Vérifier RED**

```bash
npx vitest run src/components/WorkshopCategoryPage/WorkshopCategoryPage.test.tsx
```

Expected: erreur "Cannot find module".

- [ ] **Créer `src/components/WorkshopCategoryPage/index.tsx`**

```tsx
import { Link, useParams } from 'react-router-dom'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'
import { WorkshopCard } from '../WorkshopCard'

export function WorkshopCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = WORKSHOP_CATEGORIES.find(c => c.slug === slug)

  if (!category) {
    return <div className="loading">Catégorie introuvable.</div>
  }

  const workshops = WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === slug)
  const available = workshops.filter(w => !w.comingSoon)
  const suggestion = available[0]

  return (
    <div className="category-page">
      <Link to="/ateliers" className="btn btn--secondary category-page__back">← Ateliers</Link>

      <header className="category-page__header">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <p className="category-page__meta">
          {available.length} atelier{available.length > 1 ? 's' : ''} disponible{available.length > 1 ? 's' : ''} · {workshops.length} au total
        </p>
      </header>

      {suggestion && (
        <div className="category-page__suggestion">
          <p>Par où commencer : <strong>{suggestion.title}</strong></p>
          <Link to={suggestion.route} className="btn btn--primary">Démarrer</Link>
        </div>
      )}

      <div className="ateliers-grid">
        {workshops.map(w => <WorkshopCard key={w.id} workshop={w} />)}
      </div>
    </div>
  )
}
```

- [ ] **Vérifier GREEN**

```bash
npx vitest run src/components/WorkshopCategoryPage/WorkshopCategoryPage.test.tsx
```

Expected: 6 tests passed.

- [ ] **Commit**

```bash
git add src/components/WorkshopCategoryPage/
git commit -m "feat: add WorkshopCategoryPage component"
```

---

## Task 14 — AteliersHome refactor (TDD)

**Files:**
- Modify: `src/components/AteliersHome/index.tsx`
- Create: `src/components/AteliersHome/AteliersHome.test.tsx`

- [ ] **Écrire le test**

Créer `src/components/AteliersHome/AteliersHome.test.tsx` :

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { AteliersHome } from '.'

describe('AteliersHome', () => {
  it('renders all available workshops by default', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
    expect(screen.getByText('TRIZ — Anti-Goal')).toBeInTheDocument()
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
  })

  it('renders category navigation', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Management 3\.0/ })).toBeInTheDocument()
  })

  it('filters to facilitation category workshops only', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('Troika Consulting')).toBeInTheDocument()
    expect(screen.queryByText('SBI — Situation Behavior Impact')).not.toBeInTheDocument()
  })

  it('resets filter when active category clicked again', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(screen.getByText('SBI — Situation Behavior Impact')).toBeInTheDocument()
  })

  it('shows coming soon cards', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByText('Bientôt').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Vérifier RED**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: tests fail — AteliersHome doesn't have filter logic yet.

- [ ] **Réécrire `src/components/AteliersHome/index.tsx`**

```tsx
import { useState } from 'react'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'
import { WorkshopCategoryNav } from '../WorkshopCategoryNav'
import { WorkshopCard } from '../WorkshopCard'
import type { WorkshopCategorySlug } from '../../data/workshops/types'

export function AteliersHome() {
  const [activeCategory, setActiveCategory] = useState<WorkshopCategorySlug | null>(null)

  const visible = activeCategory
    ? WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === activeCategory)
    : WORKSHOP_DEFINITIONS

  return (
    <div className="ateliers-home">
      <header className="selector-header">
        <h1>Ateliers</h1>
        <p>Ancrez les concepts par la pratique : glisser-déposer, puzzles, cartes.</p>
      </header>
      <WorkshopCategoryNav
        categories={WORKSHOP_CATEGORIES}
        workshops={WORKSHOP_DEFINITIONS}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="ateliers-grid">
        {visible.map(w => <WorkshopCard key={w.id} workshop={w} />)}
      </div>
    </div>
  )
}
```

- [ ] **Vérifier GREEN**

```bash
npx vitest run src/components/AteliersHome/AteliersHome.test.tsx
```

Expected: 5 tests passed.

- [ ] **Commit**

```bash
git add src/components/AteliersHome/
git commit -m "feat: refactor AteliersHome with category filter and WorkshopCard"
```

---

## Task 15 — App.tsx + CSS

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Ajouter la route dans `src/App.tsx`**

Ajouter l'import après l'import `AteliersHome` existant :

```tsx
import { WorkshopCategoryPage } from './components/WorkshopCategoryPage'
```

Ajouter la route avant `<Route path="*">` :

```tsx
<Route path="/ateliers/categories/:slug" element={<WorkshopCategoryPage />} />
```

- [ ] **Ajouter les classes CSS dans `src/index.css`**

Ajouter après la dernière règle CSS du fichier :

```css
/* ── Workshop Category Nav ── */
.workshop-category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.workshop-category-nav__btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}
.workshop-category-nav__btn:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}
.workshop-category-nav__btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* ── Workshop Card ── */
.workshop-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.workshop-card--coming-soon { opacity: 0.45; pointer-events: none; }
.workshop-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  gap: 0.5rem;
}

/* ── Pedagogy Panel ── */
.pedagogy-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.pedagogy-panel__toggle {
  width: 100%;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.15s;
}
.pedagogy-panel__toggle:hover { background: var(--color-surface-2); color: var(--color-text); }
.pedagogy-panel__body {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.pedagogy-panel__section-title {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}
.pedagogy-panel__list {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.9rem;
}

/* ── Category Page ── */
.category-page { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; }
.category-page__back { display: inline-flex; margin-bottom: 2rem; }
.category-page__header { margin-bottom: 2.5rem; }
.category-page__header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
.category-page__header p { color: var(--color-text-muted); font-size: 1rem; }
.category-page__meta { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.5rem; }
.category-page__suggestion {
  background: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
```

- [ ] **Vérifier la compilation TypeScript**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Vérifier tous les tests**

```bash
npx vitest run
```

Expected: tous les tests passent, aucune régression.

- [ ] **Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat: add /ateliers/categories/:slug route and workshop CSS"
```

---

## Task 16 — Intégration WorkshopPedagogyPanel dans les 11 ateliers

**Files:**
- Modify: `src/components/ScrumGuideAtelier/index.tsx`
- Modify: `src/components/ConflictAtelier/index.tsx`
- Modify: `src/components/DelegationPokerAtelier/index.tsx`
- Modify: `src/components/GrowModelAtelier/index.tsx`
- Modify: `src/components/StakeholderMappingAtelier/index.tsx`
- Modify: `src/components/AskTellAtelier/index.tsx`
- Modify: `src/components/MovingMotivatorsAtelier/index.tsx`
- Modify: `src/components/IshikawaAtelier/index.tsx`
- Modify: `src/components/TroikaConsultingAtelier/index.tsx`
- Modify: `src/components/SBIAtelier/index.tsx`
- Modify: `src/components/TRIZAtelier/index.tsx`

Chaque modification est identique : ajouter 2 imports en haut du fichier et 1 ligne dans le JSX.

**Pattern à appliquer pour chaque atelier :**

Ajouter après les imports existants :
```tsx
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
```

Dans le `return`, juste après `<div className="atelier-page">` et avant `<header className="atelier-header">` :
```tsx
<WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'ATELIER_ID')!} />
```

- [ ] **Appliquer à ScrumGuideAtelier** (`id: 'scrum-guide'`)

- [ ] **Appliquer à ConflictAtelier** (`id: 'thomas-kilmann'`)

- [ ] **Appliquer à DelegationPokerAtelier** (`id: 'delegation-poker'`)

- [ ] **Appliquer à GrowModelAtelier** (`id: 'grow-model'`)

- [ ] **Appliquer à StakeholderMappingAtelier** (`id: 'stakeholder-mapping'`)

- [ ] **Appliquer à AskTellAtelier** (`id: 'ask-vs-tell'`)

- [ ] **Appliquer à MovingMotivatorsAtelier** (`id: 'moving-motivators'`)

- [ ] **Appliquer à IshikawaAtelier** (`id: 'ishikawa'`)

- [ ] **Appliquer à TroikaConsultingAtelier** (`id: 'troika-consulting'`)

- [ ] **Appliquer à SBIAtelier** (`id: 'sbi'`)

- [ ] **Appliquer à TRIZAtelier** (`id: 'triz'`)

- [ ] **Vérifier que tous les tests existants passent toujours (aucune régression)**

```bash
npx vitest run
```

Expected: tous les tests passent.

- [ ] **Commit final**

```bash
git add src/components/ScrumGuideAtelier/index.tsx \
        src/components/ConflictAtelier/index.tsx \
        src/components/DelegationPokerAtelier/index.tsx \
        src/components/GrowModelAtelier/index.tsx \
        src/components/StakeholderMappingAtelier/index.tsx \
        src/components/AskTellAtelier/index.tsx \
        src/components/MovingMotivatorsAtelier/index.tsx \
        src/components/IshikawaAtelier/index.tsx \
        src/components/TroikaConsultingAtelier/index.tsx \
        src/components/SBIAtelier/index.tsx \
        src/components/TRIZAtelier/index.tsx
git commit -m "feat: inject WorkshopPedagogyPanel into all 11 existing ateliers"
```

---

## Checklist de validation finale

- [ ] `npx tsc --noEmit` — 0 erreur
- [ ] `npx vitest run` — tous les tests passent
- [ ] `/ateliers` affiche les 35 ateliers avec filtre par catégorie
- [ ] Cliquer sur une catégorie filtre les cartes
- [ ] Les 23 coming soon s'affichent en grisé, non cliquables
- [ ] `/ateliers/categories/facilitation` affiche Troika + TRIZ + coming soon de facilitation
- [ ] Le bouton "Par où commencer" pointe sur le bon atelier
- [ ] Chaque atelier affiche le bouton "Objectifs & contexte ▾"
- [ ] Le panneau s'ouvre/se ferme correctement
- [ ] La route `/ateliers/categories/unknown` affiche "Catégorie introuvable"
