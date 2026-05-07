# Certification Portals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the PSM-only quiz section with a multi-certification hub (PSM, PSPO, PMI-ACP, SAFe), each with dedicated exams, topic-based practice, resources, and gamification integration.

**Architecture:** New `/certifications` route tree (Hub → Portal → TopicPractice). Exam flow reuses existing `/quiz/:examId` → `QuizScreen` → `QuizResults` unchanged. `getExam()` is extended to resolve cert exam IDs. New `src/data/certifications/` data layer; 4 new badges and learning paths in gamification.

**Tech Stack:** React, TypeScript, React Router v6, Zustand, Vite

**Run tests:** `npm test -- --run`

---

## File Map

**Create:**
- `src/data/certifications/types.ts` — CertificationId, CertQuestion, CertTopic, CertResource, CertDefinition, CertExamDef
- `src/data/certifications/index.ts` — getCertification(), getAllCertifications(), getCertExam()
- `src/data/certifications/psm/definition.ts` — PSM metadata + topics
- `src/data/certifications/psm/exams.ts` — migrated questions from exam-1/2/3 with topic tags
- `src/data/certifications/psm/resources.ts` — PSM study resources
- `src/data/certifications/pspo/definition.ts`
- `src/data/certifications/pspo/exams.ts`
- `src/data/certifications/pspo/resources.ts`
- `src/data/certifications/pmi-acp/definition.ts`
- `src/data/certifications/pmi-acp/exams.ts`
- `src/data/certifications/pmi-acp/resources.ts`
- `src/data/certifications/safe/definition.ts`
- `src/data/certifications/safe/exams.ts`
- `src/data/certifications/safe/resources.ts`
- `src/components/CertificationHub/index.tsx`
- `src/components/CertificationHub/CertificationHub.test.tsx`
- `src/components/CertificationPortal/index.tsx`
- `src/components/CertificationPortal/CertificationPortal.test.tsx`
- `src/components/TopicPracticeScreen/index.tsx`
- `src/components/TopicPracticeScreen/TopicPracticeScreen.test.tsx`

**Modify:**
- `src/data/quizzes/index.ts` — extend getExam() to resolve cert exam IDs
- `src/data/quizzes/types.ts` — add optional topic/certificationId fields
- `src/features/gamification/types.ts` — add minScoreOnAny to BadgeCriteria
- `src/features/gamification/badges.ts` — add 4 cert badges + update checkBadgeCriteria
- `src/features/gamification/paths.ts` — add 4 cert learning paths
- `src/components/NavBar/index.tsx` — update /quiz → /certifications
- `src/App.tsx` — add /certifications routes, redirect /quiz → /certifications

---

## Task 1: Certification types

**Files:**
- Create: `src/data/certifications/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// src/data/certifications/types.ts
import type { QuizQuestion } from '../quizzes/types'

export type CertificationId = 'psm' | 'pspo' | 'pmi-acp' | 'safe'

export interface CertQuestion extends QuizQuestion {
  topic: string
  certificationId: CertificationId
}

export interface CertTopic {
  slug: string
  label: string
}

export type CertResourceType = 'summary' | 'flashcards' | 'tips'

export interface CertResource {
  id: string
  title: string
  type: CertResourceType
  content: string
}

export interface CertExamDef {
  id: string
  title: string
  questionCount: number
  durationMinutes: number
  mode: 'full' | 'quick' | 'random'
}

export interface CertDefinition {
  id: CertificationId
  name: string
  shortName: string
  issuer: string
  levels: string[]
  color: string
  topics: CertTopic[]
  examDefs: CertExamDef[]
  resources: CertResource[]
  questions: CertQuestion[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/certifications/types.ts
git commit -m "feat(certifications): add data types"
```

---

## Task 2: PSM data

**Files:**
- Create: `src/data/certifications/psm/definition.ts`
- Create: `src/data/certifications/psm/exams.ts`
- Create: `src/data/certifications/psm/resources.ts`

- [ ] **Step 1: Create `src/data/certifications/psm/definition.ts`**

```ts
import type { CertDefinition } from '../types'
import { psmQuestions } from './exams'
import { psmResources } from './resources'

export const psmDefinition: CertDefinition = {
  id: 'psm',
  name: 'Professional Scrum Master',
  shortName: 'PSM',
  issuer: 'Scrum.org',
  levels: ['PSM I', 'PSM II', 'PSM III'],
  color: '#6366f1',
  topics: [
    { slug: 'scrum-theory', label: 'Scrum Theory' },
    { slug: 'scrum-team', label: 'Scrum Team' },
    { slug: 'scrum-events', label: 'Scrum Events' },
    { slug: 'scrum-artifacts', label: 'Scrum Artifacts' },
    { slug: 'done-quality', label: 'Done & Quality' },
    { slug: 'scaling', label: 'Scaling' },
    { slug: 'coaching', label: 'Coaching' },
    { slug: 'facilitation', label: 'Facilitation' },
  ],
  examDefs: [
    { id: 'psm-full-1', title: 'PSM I — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'psm-quick', title: 'PSM I — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'psm-random', title: 'PSM I — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: psmQuestions,
  resources: psmResources,
}
```

- [ ] **Step 2: Create `src/data/certifications/psm/resources.ts`**

```ts
import type { CertResource } from '../types'

export const psmResources: CertResource[] = [
  {
    id: 'psm-scrum-guide-summary',
    title: 'Scrum Guide 2020 — Résumé visuel',
    type: 'summary',
    content: `## Scrum en une page\n\n**Valeurs :** Engagement, Focus, Ouverture, Respect, Courage\n\n**Rôles :** Scrum Master · Product Owner · Developers\n\n**Événements :** Sprint · Sprint Planning · Daily Scrum · Sprint Review · Sprint Retrospective\n\n**Artefacts :** Product Backlog · Sprint Backlog · Increment\n\n**Engagement par artefact :** Product Goal · Sprint Goal · Definition of Done`,
  },
  {
    id: 'psm-flashcards',
    title: 'Flashcards — Rôles, cérémonies, artefacts',
    type: 'flashcards',
    content: `## Flashcards clés\n\n**Q: Durée max d'un Sprint ?** R: 1 mois (recommandé 2 semaines)\n\n**Q: Qui ordonne le Product Backlog ?** R: Le Product Owner\n\n**Q: Qui crée la Definition of Done ?** R: Les Developers (ou l'organisation si elle existe déjà)\n\n**Q: Qui participe au Sprint Review ?** R: Toute la Scrum Team + les parties prenantes\n\n**Q: La Daily Scrum est-elle obligatoirement de 15 min ?** R: 15 min maximum, format libre`,
  },
  {
    id: 'psm-tips',
    title: 'Points souvent mal compris au PSM I',
    type: 'tips',
    content: `## Pièges fréquents\n\n- Le Scrum Master **ne manage pas** l'équipe : il facilite et protège\n- Il n'y a **pas de rôle Chef de projet** dans Scrum\n- Le Sprint **ne peut pas être annulé** que par le Product Owner\n- La Retrospective est pour l'**équipe**, pas pour les parties prenantes\n- Le Product Backlog est **toujours vivant** — jamais figé\n- Le Sprint Backlog appartient aux **Developers**, pas au PO`,
  },
]
```

- [ ] **Step 3: Create `src/data/certifications/psm/exams.ts`**

Migrate all questions from `exam-1`, `exam-2`, `exam-3` by re-exporting them with `topic` and `certificationId` fields. Assign topic based on question content using this mapping guide:
- Questions about Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective → `scrum-events`
- Questions about PO, SM, Developers roles → `scrum-team`
- Questions about Product Backlog, Sprint Backlog, Increment → `scrum-artifacts`
- Questions about Definition of Done, quality → `done-quality`
- Questions about multiple teams, Nexus, scaling → `scaling`
- Questions about empiricism, transparency, pillars, values → `scrum-theory`
- Questions about coaching, impediments, servant leadership → `coaching`
- Questions about facilitation, ceremonies design → `facilitation`

```ts
import type { CertQuestion } from '../types'
import { questions as exam1 } from '../../quizzes/exam-1'
import { questions as exam2 } from '../../quizzes/exam-2'
import { questions as exam3 } from '../../quizzes/exam-3'

// Topic assignment map — key: question id, value: topic slug
const topicMap: Record<string, string> = {
  'e1-q1': 'scrum-artifacts',   // Product Backlog — single vs multiple teams
  'e1-q41': 'scaling',           // multiple teams coordination
  'e1-q2': 'done-quality',       // non-functional requirements
  'e1-q42': 'done-quality',      // engineering tools & DoD
  // Add all question IDs here — assign based on content
  // All unrecognized IDs fall back to 'scrum-theory'
}

function tag(q: typeof exam1[0]): CertQuestion {
  return { ...q, certificationId: 'psm', topic: topicMap[q.id] ?? 'scrum-theory' }
}

export const psmQuestions: CertQuestion[] = [
  ...exam1.map(tag),
  ...exam2.map(tag),
  ...exam3.map(tag),
]
```

> **Note:** Fill in `topicMap` for all question IDs. The fallback `'scrum-theory'` ensures no question is untagged. You can run `npm test -- --run` at any point — data files have no unit tests, TypeScript compilation is the check.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/certifications/psm/
git commit -m "feat(certifications): add PSM data — definition, migrated questions, resources"
```

---

## Task 3: PSPO data

**Files:**
- Create: `src/data/certifications/pspo/definition.ts`
- Create: `src/data/certifications/pspo/exams.ts`
- Create: `src/data/certifications/pspo/resources.ts`

- [ ] **Step 1: Create `src/data/certifications/pspo/resources.ts`**

```ts
import type { CertResource } from '../types'

export const pspoResources: CertResource[] = [
  {
    id: 'pspo-summary',
    title: 'PSPO I — Résumé des responsabilités PO',
    type: 'summary',
    content: `## Product Owner — Responsabilités clés\n\n- **Maximiser la valeur** du produit et du travail de l'équipe\n- **Gérer le Product Backlog** : ordonner, clarifier, rendre transparent\n- **Product Goal** : vision à long terme, un seul PG actif à la fois\n- **Parties prenantes** : seul interface officielle avec l'équipe\n- **Sprint Review** : inspecter l'Increment et adapter le backlog`,
  },
  {
    id: 'pspo-flashcards',
    title: 'Flashcards — Produit, valeur, backlog',
    type: 'flashcards',
    content: `**Q: Qui peut annuler un Sprint ?** R: Uniquement le Product Owner\n\n**Q: Le PO peut-il déléguer la gestion du backlog ?** R: Oui, mais reste responsable\n\n**Q: Qu'est-ce que le Product Goal ?** R: Objectif à long terme du produit, commitment du Product Backlog\n\n**Q: La vélocité est-elle une métrique de valeur ?** R: Non — c'est une métrique de capacité, pas de valeur livrée`,
  },
  {
    id: 'pspo-tips',
    title: 'Pièges fréquents au PSPO I',
    type: 'tips',
    content: `## Erreurs classiques\n\n- Le PO **n'écrit pas** les User Stories — il les collabore avec l'équipe\n- "Ordonner" ≠ "prioriser par importance" — c'est une décision de **valeur + risque + dépendances**\n- Le PO n'est **pas un proxy passif** des parties prenantes — il décide\n- Le Sprint Backlog n'appartient **pas au PO** — il appartient aux Developers`,
  },
]
```

- [ ] **Step 2: Create `src/data/certifications/pspo/exams.ts`**

```ts
import type { CertQuestion } from '../types'

export const pspoQuestions: CertQuestion[] = [
  {
    id: 'pspo-q1', certificationId: 'pspo', topic: 'product-value',
    text: 'Who is responsible for maximizing the value of the product resulting from the work of the Scrum Team?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Product Owner' }, { letter: 'C', text: 'The Developers' }, { letter: 'D', text: 'The stakeholders' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q2', certificationId: 'pspo', topic: 'product-backlog',
    text: 'Who is accountable for ordering the Product Backlog?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Developers' }, { letter: 'C', text: 'The Product Owner' }, { letter: 'D', text: 'The stakeholders' }],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q3', certificationId: 'pspo', topic: 'sprint',
    text: 'Who has the authority to cancel a Sprint?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Product Owner' }, { letter: 'C', text: 'The Developers' }, { letter: 'D', text: 'Senior management' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q4', certificationId: 'pspo', topic: 'product-goal',
    text: 'What is the Product Goal?',
    options: [
      { letter: 'A', text: 'The Sprint objective for the current Sprint' },
      { letter: 'B', text: 'A long-term objective for the Scrum Team that gives purpose to the Product Backlog' },
      { letter: 'C', text: 'A list of all features to be delivered' },
      { letter: 'D', text: 'The release plan for the next quarter' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q5', certificationId: 'pspo', topic: 'stakeholders',
    text: 'During the Sprint Review, who should attend?',
    options: [
      { letter: 'A', text: 'Only the Scrum Team' },
      { letter: 'B', text: 'The Scrum Team and key stakeholders invited by the Product Owner' },
      { letter: 'C', text: 'Only the Product Owner and stakeholders' },
      { letter: 'D', text: 'The entire organization' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q6', certificationId: 'pspo', topic: 'product-backlog',
    text: 'Which two statements about Product Backlog refinement are correct? (Choose 2)',
    options: [
      { letter: 'A', text: 'It is a formal event with a fixed timebox' },
      { letter: 'B', text: 'It is an ongoing activity throughout the Sprint' },
      { letter: 'C', text: 'Only the Product Owner can refine items' },
      { letter: 'D', text: 'The Developers participate in refinement' },
    ],
    correctAnswer: ['B', 'D'], isMultiple: true,
  },
  {
    id: 'pspo-q7', certificationId: 'pspo', topic: 'product-value',
    text: 'A Product Owner is struggling to get stakeholder engagement during Sprint Reviews. What is the best action?',
    options: [
      { letter: 'A', text: 'Cancel the Sprint Reviews and send written reports instead' },
      { letter: 'B', text: 'Make Sprint Reviews more focused on business value and outcomes rather than technical details' },
      { letter: 'C', text: 'Ask the Scrum Master to mandate attendance' },
      { letter: 'D', text: 'Reduce the frequency of Sprint Reviews' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q8', certificationId: 'pspo', topic: 'product-backlog',
    text: 'What happens to the Product Backlog when a Product Goal is achieved?',
    options: [
      { letter: 'A', text: 'The Product Backlog is archived' },
      { letter: 'B', text: 'A new Product Goal is established or the product is retired' },
      { letter: 'C', text: 'The team automatically starts the next sprint' },
      { letter: 'D', text: 'The Scrum Master reorders the backlog' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q9', certificationId: 'pspo', topic: 'stakeholders',
    text: 'The Product Owner can delegate Product Backlog management tasks to others. However, who remains accountable?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Developers' }, { letter: 'C', text: 'The Product Owner' }, { letter: 'D', text: 'Whoever was delegated the task' }],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q10', certificationId: 'pspo', topic: 'product-value',
    text: 'Which of the following best describes value in Scrum?',
    options: [
      { letter: 'A', text: 'The number of features delivered per Sprint' },
      { letter: 'B', text: 'Meeting all items in the Sprint Backlog' },
      { letter: 'C', text: 'The outcome delivered to stakeholders and users that advances the Product Goal' },
      { letter: 'D', text: 'The velocity achieved by the Developers' },
    ],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q11', certificationId: 'pspo', topic: 'sprint',
    text: 'What should happen if the Developers determine they cannot complete all Sprint Backlog items by the end of the Sprint?',
    options: [
      { letter: 'A', text: 'Extend the Sprint to finish the work' },
      { letter: 'B', text: 'Negotiate the scope of the Sprint Backlog with the Product Owner' },
      { letter: 'C', text: 'Remove items from the Sprint Backlog without telling the PO' },
      { letter: 'D', text: 'Ask the Scrum Master to add more Developers' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q12', certificationId: 'pspo', topic: 'product-goal',
    text: 'How many Product Goals can a Scrum Team pursue at one time?',
    options: [{ letter: 'A', text: 'As many as needed' }, { letter: 'B', text: 'One' }, { letter: 'C', text: 'One per Developer' }, { letter: 'D', text: 'Two — one for the current Sprint, one long-term' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q13', certificationId: 'pspo', topic: 'stakeholders',
    text: 'Which two actions help a Product Owner manage stakeholder expectations effectively? (Choose 2)',
    options: [
      { letter: 'A', text: 'Share the Product Goal and roadmap direction regularly' },
      { letter: 'B', text: 'Promise specific features for specific dates' },
      { letter: 'C', text: 'Invite stakeholders to Sprint Reviews to inspect the Increment' },
      { letter: 'D', text: 'Keep backlog items secret to avoid pressure' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'pspo-q14', certificationId: 'pspo', topic: 'product-backlog',
    text: 'What is the purpose of ordering the Product Backlog?',
    options: [
      { letter: 'A', text: 'To ensure tasks are assigned to the right Developers' },
      { letter: 'B', text: 'To ensure the most valuable and important items are addressed first' },
      { letter: 'C', text: 'To document completed work' },
      { letter: 'D', text: 'To satisfy regulatory requirements' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q15', certificationId: 'pspo', topic: 'product-value',
    text: 'A stakeholder requests a feature that the Product Owner believes will not increase value. What should the PO do?',
    options: [
      { letter: 'A', text: 'Add it to the Product Backlog immediately to keep the stakeholder happy' },
      { letter: 'B', text: 'Discuss the value of the feature with the stakeholder and consider alternatives that achieve the same goal' },
      { letter: 'C', text: 'Ask the Scrum Master to refuse the request' },
      { letter: 'D', text: 'Add it to the bottom of the backlog and never prioritize it' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
]
```

- [ ] **Step 3: Create `src/data/certifications/pspo/definition.ts`**

```ts
import type { CertDefinition } from '../types'
import { pspoQuestions } from './exams'
import { pspoResources } from './resources'

export const pspoDefinition: CertDefinition = {
  id: 'pspo',
  name: 'Professional Scrum Product Owner',
  shortName: 'PSPO',
  issuer: 'Scrum.org',
  levels: ['PSPO I', 'PSPO II', 'PSPO III'],
  color: '#10b981',
  topics: [
    { slug: 'product-value', label: 'Product Value' },
    { slug: 'product-backlog', label: 'Product Backlog' },
    { slug: 'product-goal', label: 'Product Goal' },
    { slug: 'sprint', label: 'Sprint Management' },
    { slug: 'stakeholders', label: 'Stakeholder Management' },
    { slug: 'product-strategy', label: 'Product Strategy' },
    { slug: 'metrics', label: 'Métriques & ROI' },
  ],
  examDefs: [
    { id: 'pspo-full-1', title: 'PSPO I — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'pspo-quick', title: 'PSPO I — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'pspo-random', title: 'PSPO I — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: pspoQuestions,
  resources: pspoResources,
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/data/certifications/pspo/
git commit -m "feat(certifications): add PSPO data"
```

---

## Task 4: PMI-ACP data

**Files:**
- Create: `src/data/certifications/pmi-acp/definition.ts`
- Create: `src/data/certifications/pmi-acp/exams.ts`
- Create: `src/data/certifications/pmi-acp/resources.ts`

- [ ] **Step 1: Create `src/data/certifications/pmi-acp/resources.ts`**

```ts
import type { CertResource } from '../types'

export const pmiacpResources: CertResource[] = [
  {
    id: 'pmi-acp-summary',
    title: 'PMI-ACP — Domaines de connaissance',
    type: 'summary',
    content: `## 7 domaines PMI-ACP\n\n1. **Agile Principles & Mindset** — valeurs, manifeste, mindset\n2. **Value-Driven Delivery** — livrer de la valeur tôt et souvent\n3. **Stakeholder Engagement** — collaboration, communication\n4. **Team Performance** — équipes auto-organisées, vélocité\n5. **Adaptive Planning** — planning itératif, rolling wave\n6. **Problem Detection & Resolution** — retrospectives, amélioration\n7. **Continuous Improvement** — Kaizen, inspect & adapt`,
  },
  {
    id: 'pmi-acp-flashcards',
    title: 'Flashcards — Frameworks couverts',
    type: 'flashcards',
    content: `**Q: Frameworks inclus dans PMI-ACP ?** R: Scrum, Kanban, XP, Lean, Crystal, DSDM, FDD\n\n**Q: Qu'est-ce que le WIP limit ?** R: Limite du travail en cours (Kanban) — réduit le multitasking\n\n**Q: Planning Poker est une technique de ?** R: Estimation relative (story points)\n\n**Q: Definition of Ready ?** R: Critères qu'un item doit remplir avant d'entrer dans un Sprint`,
  },
  {
    id: 'pmi-acp-tips',
    title: 'Points clés PMI-ACP',
    type: 'tips',
    content: `## Différences PMI-ACP vs PSM\n\n- PMI-ACP couvre **plusieurs frameworks** (pas seulement Scrum)\n- Focus sur **valeur business** et ROI, pas seulement process\n- Les questions sont orientées **situations réelles** de PM\n- Connaître **Kanban, XP et Lean** est essentiel\n- Le rôle du PM Agile = **servant leader + facilitateur**`,
  },
]
```

- [ ] **Step 2: Create `src/data/certifications/pmi-acp/exams.ts`**

```ts
import type { CertQuestion } from '../types'

export const pmiacpQuestions: CertQuestion[] = [
  {
    id: 'acp-q1', certificationId: 'pmi-acp', topic: 'agile-mindset',
    text: 'Which of the following best describes the Agile Manifesto\'s stance on processes and tools versus individuals and interactions?',
    options: [
      { letter: 'A', text: 'Processes and tools are more important for scaling teams' },
      { letter: 'B', text: 'Individuals and interactions are valued over processes and tools' },
      { letter: 'C', text: 'Both are equally important' },
      { letter: 'D', text: 'Tools eliminate the need for interactions' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q2', certificationId: 'pmi-acp', topic: 'value-delivery',
    text: 'A project team delivers working software every two weeks but stakeholders rarely see business value. What should the team focus on?',
    options: [
      { letter: 'A', text: 'Increase delivery frequency to weekly' },
      { letter: 'B', text: 'Align iterations to deliver outcomes that measurably advance business goals' },
      { letter: 'C', text: 'Reduce the size of user stories' },
      { letter: 'D', text: 'Add a dedicated testing phase after each iteration' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q3', certificationId: 'pmi-acp', topic: 'adaptive-planning',
    text: 'What is rolling wave planning?',
    options: [
      { letter: 'A', text: 'Planning all details upfront before starting' },
      { letter: 'B', text: 'Planning near-term work in detail while keeping future work at a higher level' },
      { letter: 'C', text: 'Planning only one iteration at a time' },
      { letter: 'D', text: 'A Kanban planning ceremony' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q4', certificationId: 'pmi-acp', topic: 'team-performance',
    text: 'A team is underperforming. According to Agile principles, who should decide how to improve their process?',
    options: [
      { letter: 'A', text: 'The project manager' },
      { letter: 'B', text: 'The team itself through retrospectives' },
      { letter: 'C', text: 'The PMO' },
      { letter: 'D', text: 'An external consultant' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q5', certificationId: 'pmi-acp', topic: 'stakeholder-engagement',
    text: 'Which two practices best support ongoing stakeholder engagement in an Agile project? (Choose 2)',
    options: [
      { letter: 'A', text: 'Frequent demos of working software' },
      { letter: 'B', text: 'Formal written status reports sent monthly' },
      { letter: 'C', text: 'Involving stakeholders in backlog refinement' },
      { letter: 'D', text: 'Freezing requirements after kickoff' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'acp-q6', certificationId: 'pmi-acp', topic: 'continuous-improvement',
    text: 'What is the primary purpose of a retrospective in Agile?',
    options: [
      { letter: 'A', text: 'To report project status to management' },
      { letter: 'B', text: 'To inspect and adapt the team\'s process for continuous improvement' },
      { letter: 'C', text: 'To review the product backlog' },
      { letter: 'D', text: 'To plan the next iteration' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q7', certificationId: 'pmi-acp', topic: 'kanban',
    text: 'What is the main purpose of WIP limits in Kanban?',
    options: [
      { letter: 'A', text: 'To limit the number of team members' },
      { letter: 'B', text: 'To reduce multitasking and improve flow by limiting work in progress' },
      { letter: 'C', text: 'To set a deadline for each task' },
      { letter: 'D', text: 'To prevent new work from being requested' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q8', certificationId: 'pmi-acp', topic: 'value-delivery',
    text: 'A team is asked to add a large feature. Using Agile principles, what is the best approach?',
    options: [
      { letter: 'A', text: 'Build it in one long iteration to avoid disruption' },
      { letter: 'B', text: 'Break it into smaller deliverable increments with early value' },
      { letter: 'C', text: 'Defer it to after the project goes live' },
      { letter: 'D', text: 'Assign it to a separate team' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q9', certificationId: 'pmi-acp', topic: 'agile-mindset',
    text: 'Which statement best reflects the Agile principle of responding to change over following a plan?',
    options: [
      { letter: 'A', text: 'Plans should never change once agreed' },
      { letter: 'B', text: 'Change is inevitable and welcome when it delivers customer value' },
      { letter: 'C', text: 'Only the customer can request changes' },
      { letter: 'D', text: 'Changes must be submitted through a formal change control board' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q10', certificationId: 'pmi-acp', topic: 'team-performance',
    text: 'What is the benefit of co-locating an Agile team?',
    options: [
      { letter: 'A', text: 'It reduces the need for documentation' },
      { letter: 'B', text: 'It improves communication speed and reduces coordination overhead' },
      { letter: 'C', text: 'It guarantees faster delivery' },
      { letter: 'D', text: 'It replaces the need for daily standups' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q11', certificationId: 'pmi-acp', topic: 'adaptive-planning',
    text: 'Story points are used to estimate:',
    options: [
      { letter: 'A', text: 'Hours of work required' },
      { letter: 'B', text: 'Relative effort and complexity of a user story' },
      { letter: 'C', text: 'The number of team members needed' },
      { letter: 'D', text: 'Business value of a feature' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q12', certificationId: 'pmi-acp', topic: 'continuous-improvement',
    text: 'Which two activities support a culture of continuous improvement? (Choose 2)',
    options: [
      { letter: 'A', text: 'Regular retrospectives with actionable outcomes' },
      { letter: 'B', text: 'Blameless post-mortems after failures' },
      { letter: 'C', text: 'Assigning blame to underperforming individuals' },
      { letter: 'D', text: 'Freezing the process once it works' },
    ],
    correctAnswer: ['A', 'B'], isMultiple: true,
  },
]
```

- [ ] **Step 3: Create `src/data/certifications/pmi-acp/definition.ts`**

```ts
import type { CertDefinition } from '../types'
import { pmiacpQuestions } from './exams'
import { pmiacpResources } from './resources'

export const pmiacpDefinition: CertDefinition = {
  id: 'pmi-acp',
  name: 'PMI Agile Certified Practitioner',
  shortName: 'ACP',
  issuer: 'PMI',
  levels: ['PMI-ACP'],
  color: '#f59e0b',
  topics: [
    { slug: 'agile-mindset', label: 'Agile Mindset' },
    { slug: 'value-delivery', label: 'Value-Driven Delivery' },
    { slug: 'stakeholder-engagement', label: 'Stakeholder Engagement' },
    { slug: 'team-performance', label: 'Team Performance' },
    { slug: 'adaptive-planning', label: 'Adaptive Planning' },
    { slug: 'continuous-improvement', label: 'Continuous Improvement' },
    { slug: 'kanban', label: 'Kanban & Flow' },
    { slug: 'problem-detection', label: 'Problem Detection' },
    { slug: 'xp-lean', label: 'XP & Lean' },
  ],
  examDefs: [
    { id: 'pmi-acp-full-1', title: 'PMI-ACP — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'pmi-acp-quick', title: 'PMI-ACP — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'pmi-acp-random', title: 'PMI-ACP — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: pmiacpQuestions,
  resources: pmiacpResources,
}
```

- [ ] **Step 4: Verify TypeScript, commit**

```bash
npx tsc --noEmit
git add src/data/certifications/pmi-acp/
git commit -m "feat(certifications): add PMI-ACP data"
```

---

## Task 5: SAFe data

**Files:**
- Create: `src/data/certifications/safe/definition.ts`
- Create: `src/data/certifications/safe/exams.ts`
- Create: `src/data/certifications/safe/resources.ts`

- [ ] **Step 1: Create `src/data/certifications/safe/resources.ts`**

```ts
import type { CertResource } from '../types'

export const safeResources: CertResource[] = [
  {
    id: 'safe-summary',
    title: 'SAFe 6.0 — Big Picture',
    type: 'summary',
    content: `## SAFe en bref\n\n**Niveaux :** Team · Program (ART) · Large Solution · Portfolio\n\n**ART (Agile Release Train)** : 50-125 personnes, livrent en PI (Program Increment)\n\n**PI Planning** : cadence trimestrielle, toute l'ART planifie ensemble\n\n**Rôles clés :** Release Train Engineer (RTE), Product Manager, System Architect\n\n**Principes Lean-Agile :** Take an economic view · Apply systems thinking · Assume variability`,
  },
  {
    id: 'safe-flashcards',
    title: 'Flashcards — Rôles et cérémonies SAFe',
    type: 'flashcards',
    content: `**Q: Qu'est-ce qu'un PI ?** R: Program Increment — cadence de 8-12 semaines avec 4-6 Sprints\n\n**Q: Rôle du RTE ?** R: Chief Scrum Master de l'ART — facilite le PI Planning et supprime les obstacles\n\n**Q: Qu'est-ce que le System Demo ?** R: Démo intégrée de toutes les équipes à la fin de chaque Sprint\n\n**Q: IP Sprint ?** R: Innovation & Planning Sprint — dernier Sprint du PI, dédié à l'innovation et au PI Planning suivant`,
  },
  {
    id: 'safe-tips',
    title: 'Points clés pour l\'examen SAFe',
    type: 'tips',
    content: `## Pièges SAFe\n\n- Le **PI Planning** est un événement en présentiel (idéalement) — 2 jours\n- L'**ART** n'est pas un projet — c'est une équipe de long terme\n- Le **RTE** facilite mais ne manage pas les équipes\n- Les **ROAM** (Resolved, Owned, Accepted, Mitigated) gèrent les risques au PI Planning\n- SAFe ≠ simple Scrum à l'échelle — il y a des rôles et artefacts spécifiques`,
  },
]
```

- [ ] **Step 2: Create `src/data/certifications/safe/exams.ts`**

```ts
import type { CertQuestion } from '../types'

export const safeQuestions: CertQuestion[] = [
  {
    id: 'safe-q1', certificationId: 'safe', topic: 'art',
    text: 'What is an Agile Release Train (ART)?',
    options: [
      { letter: 'A', text: 'A single Scrum team scaled up to 50 people' },
      { letter: 'B', text: 'A long-lived team of Agile teams (50-125 people) that delivers value on a common mission' },
      { letter: 'C', text: 'A quarterly release process managed by the PMO' },
      { letter: 'D', text: 'A tool for tracking releases' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q2', certificationId: 'safe', topic: 'pi-planning',
    text: 'What is the primary purpose of PI Planning?',
    options: [
      { letter: 'A', text: 'To review the previous quarter\'s results' },
      { letter: 'B', text: 'To align all teams on the ART to a shared mission and plan the next Program Increment' },
      { letter: 'C', text: 'To update the portfolio backlog' },
      { letter: 'D', text: 'To assign work to individual developers' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q3', certificationId: 'safe', topic: 'rte',
    text: 'What is the role of the Release Train Engineer (RTE)?',
    options: [
      { letter: 'A', text: 'Manage the budget for the ART' },
      { letter: 'B', text: 'Serve as the chief Scrum Master for the ART, facilitating ART events and escalating impediments' },
      { letter: 'C', text: 'Write the program vision and roadmap' },
      { letter: 'D', text: 'Approve all user stories before implementation' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q4', certificationId: 'safe', topic: 'lean-agile',
    text: 'Which SAFe principle states that economic decisions should drive the delivery sequence?',
    options: [
      { letter: 'A', text: 'Apply systems thinking' },
      { letter: 'B', text: 'Take an economic view' },
      { letter: 'C', text: 'Assume variability; preserve options' },
      { letter: 'D', text: 'Build incrementally with fast, integrated learning cycles' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q5', certificationId: 'safe', topic: 'pi-planning',
    text: 'During PI Planning, how are risks managed?',
    options: [
      { letter: 'A', text: 'Risks are added to the program backlog for later resolution' },
      { letter: 'B', text: 'Risks are ROAM\'d: Resolved, Owned, Accepted, or Mitigated' },
      { letter: 'C', text: 'Risks are escalated to the portfolio level' },
      { letter: 'D', text: 'Risks are ignored if they are low probability' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q6', certificationId: 'safe', topic: 'art',
    text: 'How long is a typical Program Increment (PI)?',
    options: [
      { letter: 'A', text: '2 weeks' },
      { letter: 'B', text: '1 month' },
      { letter: 'C', text: '8-12 weeks, typically containing 4-6 Iterations' },
      { letter: 'D', text: '6 months' },
    ],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'safe-q7', certificationId: 'safe', topic: 'portfolio',
    text: 'What is the purpose of the SAFe Portfolio level?',
    options: [
      { letter: 'A', text: 'To manage individual team sprints' },
      { letter: 'B', text: 'To align strategy, funding, and Lean governance across multiple ARTs' },
      { letter: 'C', text: 'To track individual developer performance' },
      { letter: 'D', text: 'To write features for the program backlog' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q8', certificationId: 'safe', topic: 'lean-agile',
    text: 'What are the two pillars of the SAFe House of Lean?',
    options: [
      { letter: 'A', text: 'Speed and quality' },
      { letter: 'B', text: 'Respect for people and culture · Continuous improvement (Kaizen)' },
      { letter: 'C', text: 'Velocity and predictability' },
      { letter: 'D', text: 'Customer focus and innovation' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q9', certificationId: 'safe', topic: 'art',
    text: 'What is the System Demo in SAFe?',
    options: [
      { letter: 'A', text: 'A demo for the portfolio leadership only' },
      { letter: 'B', text: 'An integrated demonstration of all team increments at the end of each Iteration' },
      { letter: 'C', text: 'A final release demo at the end of the PI' },
      { letter: 'D', text: 'A tool demonstration for new teams' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q10', certificationId: 'safe', topic: 'pi-planning',
    text: 'Which two outputs are produced by PI Planning? (Choose 2)',
    options: [
      { letter: 'A', text: 'Program Board showing team dependencies and milestones' },
      { letter: 'B', text: 'Individual developer task assignments' },
      { letter: 'C', text: 'Team PI Objectives with business value' },
      { letter: 'D', text: 'A fixed scope contract for the PI' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'safe-q11', certificationId: 'safe', topic: 'lean-agile',
    text: 'What does "batch size reduction" mean in SAFe Lean thinking?',
    options: [
      { letter: 'A', text: 'Reducing the number of team members per team' },
      { letter: 'B', text: 'Delivering smaller increments of work more frequently to reduce risk and improve flow' },
      { letter: 'C', text: 'Limiting the size of the program backlog' },
      { letter: 'D', text: 'Reducing the number of features per release' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'safe-q12', certificationId: 'safe', topic: 'portfolio',
    text: 'What is an Epic in SAFe Portfolio?',
    options: [
      { letter: 'A', text: 'A large user story that spans multiple sprints' },
      { letter: 'B', text: 'A significant initiative requiring a Lean Business Case before implementation' },
      { letter: 'C', text: 'A collection of features for one team' },
      { letter: 'D', text: 'A PI Planning objective' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
]
```

- [ ] **Step 3: Create `src/data/certifications/safe/definition.ts`**

```ts
import type { CertDefinition } from '../types'
import { safeQuestions } from './exams'
import { safeResources } from './resources'

export const safeDefinition: CertDefinition = {
  id: 'safe',
  name: 'Scaled Agile Framework',
  shortName: 'SAFe',
  issuer: 'Scaled Agile',
  levels: ['SA', 'SP', 'SPC', 'SPCT'],
  color: '#ef4444',
  topics: [
    { slug: 'lean-agile', label: 'Lean-Agile Mindset' },
    { slug: 'art', label: 'Agile Release Train' },
    { slug: 'pi-planning', label: 'PI Planning' },
    { slug: 'rte', label: 'RTE & Rôles' },
    { slug: 'portfolio', label: 'Portfolio SAFe' },
    { slug: 'large-solution', label: 'Large Solution' },
    { slug: 'continuous-delivery', label: 'Continuous Delivery' },
    { slug: 'built-in-quality', label: 'Built-in Quality' },
    { slug: 'metrics', label: 'Métriques & OKRs' },
    { slug: 'transformation', label: 'Transformation SAFe' },
  ],
  examDefs: [
    { id: 'safe-full-1', title: 'SAFe SA — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'safe-quick', title: 'SAFe SA — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'safe-random', title: 'SAFe SA — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: safeQuestions,
  resources: safeResources,
}
```

- [ ] **Step 4: Verify TypeScript, commit**

```bash
npx tsc --noEmit
git add src/data/certifications/safe/
git commit -m "feat(certifications): add SAFe data"
```

---

## Task 6: Certifications index + extend getExam()

**Files:**
- Create: `src/data/certifications/index.ts`
- Modify: `src/data/quizzes/index.ts`
- Modify: `src/data/quizzes/types.ts`

- [ ] **Step 1: Add optional fields to QuizQuestion in `src/data/quizzes/types.ts`**

```ts
export interface QuizOption {
  letter: string
  text: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  correctAnswer: string[]
  isMultiple: boolean
  topic?: string           // added — optional for backward compat
  certificationId?: string // added — optional for backward compat
}

export interface QuizExam {
  id: string
  title: string
  questionCount: number
  durationMinutes: number
  questions: QuizQuestion[]
}
```

- [ ] **Step 2: Create `src/data/certifications/index.ts`**

```ts
import type { CertDefinition, CertificationId, CertExamDef } from './types'
import type { QuizExam } from '../quizzes/types'
import { psmDefinition } from './psm/definition'
import { pspoDefinition } from './pspo/definition'
import { pmiacpDefinition } from './pmi-acp/definition'
import { safeDefinition } from './safe/definition'

const CERTIFICATIONS: Record<CertificationId, CertDefinition> = {
  psm: psmDefinition,
  pspo: pspoDefinition,
  'pmi-acp': pmiacpDefinition,
  safe: safeDefinition,
}

export const CERT_IDS: CertificationId[] = ['psm', 'pspo', 'pmi-acp', 'safe']

export function getCertification(id: CertificationId): CertDefinition {
  return CERTIFICATIONS[id]
}

export function getAllCertifications(): CertDefinition[] {
  return CERT_IDS.map(id => CERTIFICATIONS[id])
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getCertExam(certId: CertificationId, examId: string): QuizExam | undefined {
  const cert = CERTIFICATIONS[certId]
  if (!cert) return undefined
  const def = cert.examDefs.find(e => e.id === examId)
  if (!def) return undefined

  let questions = cert.questions
  if (def.mode === 'random') questions = shuffle(questions)
  if (def.mode === 'quick') questions = shuffle(questions).slice(0, def.questionCount)

  return {
    id: def.id,
    title: def.title,
    questionCount: def.questionCount,
    durationMinutes: def.durationMinutes,
    questions: questions.slice(0, def.questionCount),
  }
}
```

- [ ] **Step 3: Write test for `getCertification` and `getCertExam`**

Create `src/data/certifications/certifications.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCertification, getAllCertifications, getCertExam } from './index'

describe('getCertification', () => {
  it('returns PSM definition', () => {
    const cert = getCertification('psm')
    expect(cert.id).toBe('psm')
    expect(cert.shortName).toBe('PSM')
    expect(cert.topics.length).toBeGreaterThan(0)
    expect(cert.examDefs.length).toBe(3)
  })

  it('returns all 4 certifications', () => {
    const all = getAllCertifications()
    expect(all).toHaveLength(4)
    expect(all.map(c => c.id)).toEqual(['psm', 'pspo', 'pmi-acp', 'safe'])
  })
})

describe('getCertExam', () => {
  it('returns a QuizExam for a valid cert exam id', () => {
    const exam = getCertExam('pspo', 'pspo-full-1')
    expect(exam).toBeDefined()
    expect(exam!.id).toBe('pspo-full-1')
    expect(exam!.questions.length).toBeLessThanOrEqual(80)
  })

  it('returns undefined for unknown exam id', () => {
    const exam = getCertExam('psm', 'unknown-exam')
    expect(exam).toBeUndefined()
  })

  it('quick mode returns fewer questions', () => {
    const exam = getCertExam('psm', 'psm-quick')
    expect(exam).toBeDefined()
    expect(exam!.questionCount).toBe(40)
  })
})
```

- [ ] **Step 4: Run test**

```bash
npm test -- --run src/data/certifications/certifications.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Extend `getExam()` in `src/data/quizzes/index.ts`**

Add handling for cert exam IDs by appending after the existing `getExam` function:

```ts
import { questions as exam1Questions } from './exam-1'
import { questions as exam2Questions } from './exam-2'
import { questions as exam3Questions } from './exam-3'
import type { QuizExam } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const exams: QuizExam[] = [
  { id: 'exam-1', title: 'Examen 1 — 80 questions', questionCount: 80, durationMinutes: 60, questions: exam1Questions },
  { id: 'exam-2', title: 'Examen 2 — 40 questions', questionCount: 40, durationMinutes: 30, questions: exam2Questions },
  { id: 'exam-3', title: 'Examen 3 — 80 questions', questionCount: 80, durationMinutes: 60, questions: exam3Questions },
]

const allQuestions = [...exam1Questions, ...exam2Questions, ...exam3Questions]

const CERT_ID_PREFIXES = ['psm-', 'pspo-', 'pmi-acp-', 'safe-'] as const

function isCertExamId(id: string): boolean {
  return CERT_ID_PREFIXES.some(prefix => id.startsWith(prefix))
}

function certIdFromExamId(examId: string): import('../certifications/types').CertificationId {
  if (examId.startsWith('pspo-')) return 'pspo'
  if (examId.startsWith('pmi-acp-')) return 'pmi-acp'
  if (examId.startsWith('safe-')) return 'safe'
  return 'psm'
}

export function getExam(id: string): QuizExam {
  if (id === 'random') {
    return { id: 'random', title: 'Examen Aléatoire — 80 questions', questionCount: 80, durationMinutes: 60, questions: shuffle(allQuestions).slice(0, 80) }
  }
  if (isCertExamId(id)) {
    const { getCertExam } = require('../certifications/index')
    const exam = getCertExam(certIdFromExamId(id), id)
    if (exam) return exam
  }
  const exam = exams.find(e => e.id === id)
  if (!exam) throw new Error(`Unknown exam id: ${id}`)
  return exam
}
```

> **Note:** The `require()` avoids circular import. Alternatively, move cert lookup to a shared utility. If your bundler warns about `require()`, use a dynamic import wrapper instead.

- [ ] **Step 6: Verify TypeScript + run existing quiz tests**

```bash
npx tsc --noEmit && npm test -- --run src/data/
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/data/certifications/index.ts src/data/certifications/certifications.test.ts src/data/quizzes/
git commit -m "feat(certifications): add index, getCertExam, extend getExam"
```

---

## Task 7: CertificationHub component

**Files:**
- Create: `src/components/CertificationHub/index.tsx`
- Create: `src/components/CertificationHub/CertificationHub.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/CertificationHub/CertificationHub.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CertificationHub } from './index'

function renderHub() {
  return render(<MemoryRouter><CertificationHub /></MemoryRouter>)
}

describe('CertificationHub', () => {
  it('renders all 4 certification cards', () => {
    renderHub()
    expect(screen.getByText(/Professional Scrum Master/i)).toBeInTheDocument()
    expect(screen.getByText(/Professional Scrum Product Owner/i)).toBeInTheDocument()
    expect(screen.getByText(/PMI Agile Certified Practitioner/i)).toBeInTheDocument()
    expect(screen.getByText(/Scaled Agile Framework/i)).toBeInTheDocument()
  })

  it('each card links to /certifications/:certId', () => {
    renderHub()
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/certifications/psm')
    expect(hrefs).toContain('/certifications/pspo')
    expect(hrefs).toContain('/certifications/pmi-acp')
    expect(hrefs).toContain('/certifications/safe')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --run src/components/CertificationHub/
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/CertificationHub/index.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { getAllCertifications } from '../../data/certifications'
import { useGamificationStore } from '../../features/gamification/gamification.store'

export function CertificationHub() {
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  return (
    <div className="quiz-selector">
      <header className="selector-header">
        <h1>Certifications Agile</h1>
        <p>Prépare-toi à l'examen de ton choix — examens, entraînement par thème et ressources.</p>
      </header>
      <div className="quiz-exam-grid">
        {getAllCertifications().map(cert => {
          const completedCount = getCompletedSlugs().filter(s =>
            cert.examDefs.some(e => e.id === s)
          ).length
          const progress = Math.round((completedCount / cert.examDefs.length) * 100)

          return (
            <Link
              key={cert.id}
              to={`/certifications/${cert.id}`}
              className="quiz-exam-card"
              style={{ textDecoration: 'none', borderTop: `3px solid ${cert.color}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 36, height: 36, background: cert.color, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>
                  {cert.shortName}
                </div>
                <div>
                  <h2 className="quiz-exam-card__title" style={{ margin: 0 }}>{cert.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>{cert.issuer} · {cert.levels.join(' / ')}</p>
                </div>
              </div>
              <p className="quiz-exam-card__meta">
                {cert.examDefs.length} examens · {cert.topics.length} thèmes
              </p>
              <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ height: '100%', background: cert.color, width: `${progress}%`, borderRadius: 2 }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --run src/components/CertificationHub/
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/CertificationHub/
git commit -m "feat(certifications): add CertificationHub component"
```

---

## Task 8: CertificationPortal component

**Files:**
- Create: `src/components/CertificationPortal/index.tsx`
- Create: `src/components/CertificationPortal/CertificationPortal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/CertificationPortal/CertificationPortal.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CertificationPortal } from './index'

function renderPortal(certId = 'pspo') {
  return render(
    <MemoryRouter initialEntries={[`/certifications/${certId}`]}>
      <Routes>
        <Route path="/certifications/:certId" element={<CertificationPortal />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CertificationPortal', () => {
  it('renders cert name and issuer', () => {
    renderPortal('pspo')
    expect(screen.getByText(/Professional Scrum Product Owner/i)).toBeInTheDocument()
    expect(screen.getByText(/Scrum\.org/i)).toBeInTheDocument()
  })

  it('shows Examens tab by default', () => {
    renderPortal('pspo')
    expect(screen.getByText(/Examen complet/i)).toBeInTheDocument()
  })

  it('switches to Thèmes tab', () => {
    renderPortal('pspo')
    fireEvent.click(screen.getByRole('tab', { name: /thèmes/i }))
    expect(screen.getByText(/Product Value/i)).toBeInTheDocument()
  })

  it('switches to Ressources tab', () => {
    renderPortal('pspo')
    fireEvent.click(screen.getByRole('tab', { name: /ressources/i }))
    expect(screen.getByText(/Résumé/i)).toBeInTheDocument()
  })

  it('redirects to /certifications for unknown certId', () => {
    render(
      <MemoryRouter initialEntries={['/certifications/unknown']}>
        <Routes>
          <Route path="/certifications/:certId" element={<CertificationPortal />} />
          <Route path="/certifications" element={<div>Hub</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Hub')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
npm test -- --run src/components/CertificationPortal/
```

- [ ] **Step 3: Implement `src/components/CertificationPortal/index.tsx`**

```tsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCertification, CERT_IDS } from '../../data/certifications'
import type { CertificationId } from '../../data/certifications/types'
import { useQuizStore } from '../../store/quizStore'
import { useGamificationStore } from '../../features/gamification/gamification.store'

type Tab = 'examens' | 'themes' | 'ressources' | 'progression'

export function CertificationPortal() {
  const { certId } = useParams<{ certId: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('examens')
  const startQuiz = useQuizStore(s => s.startQuiz)
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)
  const getAllSkillXp = useGamificationStore(s => s.getAllSkillXp)

  if (!certId || !CERT_IDS.includes(certId as CertificationId)) {
    navigate('/certifications', { replace: true })
    return null
  }

  const cert = getCertification(certId as CertificationId)
  const completedSlugs = getCompletedSlugs()

  function handleStartExam(examId: string) {
    startQuiz(examId)
    navigate(`/quiz/${examId}`)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'examens', label: 'Examens' },
    { id: 'themes', label: 'Thèmes' },
    { id: 'ressources', label: 'Ressources' },
    { id: 'progression', label: 'Progression' },
  ]

  return (
    <div className="quiz-selector">
      <header className="selector-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 40, height: 40, background: cert.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
          {cert.shortName}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{cert.name}</h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{cert.issuer} · {cert.levels.join(' · ')}</p>
        </div>
      </header>

      <div role="tablist" style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border, #e5e7eb)', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${cert.color}` : '2px solid transparent',
              color: tab === t.id ? cert.color : 'inherit',
              fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'examens' && (
        <div className="quiz-exam-grid" style={{ gridTemplateColumns: '1fr' }}>
          {cert.examDefs.map(examDef => {
            const done = completedSlugs.includes(examDef.id)
            return (
              <article key={examDef.id} className="quiz-exam-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="quiz-exam-card__title">{examDef.title}</h2>
                  <p className="quiz-exam-card__meta">{examDef.questionCount} questions · {examDef.durationMinutes} min{done ? ' · ✓ Complété' : ''}</p>
                </div>
                <button className="btn btn--primary" onClick={() => handleStartExam(examDef.id)}>
                  {done ? 'Recommencer' : 'Démarrer'}
                </button>
              </article>
            )
          })}
        </div>
      )}

      {tab === 'themes' && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.875rem' }}>Entraîne-toi thème par thème avec feedback immédiat après chaque réponse.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {cert.topics.map(topic => (
              <Link
                key={topic.slug}
                to={`/certifications/${cert.id}/topic/${topic.slug}`}
                className="btn btn--secondary"
                style={{ textDecoration: 'none' }}
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === 'ressources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cert.resources.map(resource => (
            <article key={resource.id} className="quiz-exam-card">
              <h2 className="quiz-exam-card__title">{resource.title}</h2>
              <p className="quiz-exam-card__meta" style={{ textTransform: 'capitalize' }}>{resource.type}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', whiteSpace: 'pre-wrap', opacity: 0.8 }}>
                {resource.content}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'progression' && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.875rem' }}>
            Examens complétés : {cert.examDefs.filter(e => completedSlugs.includes(e.id)).length} / {cert.examDefs.length}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cert.examDefs.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>{e.title}</span>
                <span>{completedSlugs.includes(e.id) ? '✓' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --run src/components/CertificationPortal/
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/CertificationPortal/
git commit -m "feat(certifications): add CertificationPortal component with 4 tabs"
```

---

## Task 9: TopicPracticeScreen component

**Files:**
- Create: `src/components/TopicPracticeScreen/index.tsx`
- Create: `src/components/TopicPracticeScreen/TopicPracticeScreen.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/TopicPracticeScreen/TopicPracticeScreen.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TopicPracticeScreen } from './index'

function renderPractice(certId = 'pspo', topicSlug = 'product-value') {
  return render(
    <MemoryRouter initialEntries={[`/certifications/${certId}/topic/${topicSlug}`]}>
      <Routes>
        <Route path="/certifications/:certId/topic/:topicSlug" element={<TopicPracticeScreen />} />
        <Route path="/certifications/:certId" element={<div>Portal</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TopicPracticeScreen', () => {
  it('renders topic label and first question', () => {
    renderPractice()
    expect(screen.getByText(/Product Value/i)).toBeInTheDocument()
    expect(screen.getByRole('radio', { hidden: true }) || screen.getAllByRole('button').length).toBeTruthy()
  })

  it('shows feedback after selecting an answer', () => {
    renderPractice()
    const firstOption = screen.getAllByRole('button').find(b => b.textContent?.match(/^[A-D]\./))
    if (firstOption) fireEvent.click(firstOption)
    expect(screen.getByText(/correct|incorrect/i)).toBeInTheDocument()
  })

  it('redirects to portal for unknown topic', () => {
    renderPractice('pspo', 'nonexistent-topic')
    expect(screen.getByText('Portal')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm fails**

```bash
npm test -- --run src/components/TopicPracticeScreen/
```

- [ ] **Step 3: Implement `src/components/TopicPracticeScreen/index.tsx`**

```tsx
import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCertification, CERT_IDS } from '../../data/certifications'
import type { CertificationId, CertQuestion } from '../../data/certifications/types'
import { useGamificationStore } from '../../features/gamification/gamification.store'

type AnswerState = { selected: string[]; revealed: boolean }

export function TopicPracticeScreen() {
  const { certId, topicSlug } = useParams<{ certId: string; topicSlug: string }>()
  const navigate = useNavigate()
  const recordEvent = useGamificationStore(s => s.recordEvent)

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState>({ selected: [], revealed: false })
  const [done, setDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  if (!certId || !CERT_IDS.includes(certId as CertificationId)) {
    navigate(`/certifications`, { replace: true })
    return null
  }

  const cert = getCertification(certId as CertificationId)
  const topic = cert.topics.find(t => t.slug === topicSlug)

  if (!topic) {
    navigate(`/certifications/${certId}`, { replace: true })
    return null
  }

  const questions: CertQuestion[] = cert.questions.filter(q => q.topic === topicSlug)

  if (questions.length === 0) {
    return (
      <div className="quiz-selector">
        <p>Aucune question disponible pour ce thème.</p>
        <Link to={`/certifications/${certId}`} className="btn btn--secondary">Retour</Link>
      </div>
    )
  }

  const current = questions[index]

  function isCorrect(selected: string[]): boolean {
    return (
      selected.length === current.correctAnswer.length &&
      current.correctAnswer.every(a => selected.includes(a))
    )
  }

  function handleSelect(letter: string) {
    if (answers.revealed) return
    if (current.isMultiple) {
      setAnswers(prev => ({
        ...prev,
        selected: prev.selected.includes(letter)
          ? prev.selected.filter(l => l !== letter)
          : [...prev.selected, letter],
      }))
    } else {
      const selected = [letter]
      const correct = isCorrect(selected)
      if (correct) setCorrectCount(c => c + 1)
      setAnswers({ selected, revealed: true })
    }
  }

  function handleReveal() {
    const correct = isCorrect(answers.selected)
    if (correct) setCorrectCount(c => c + 1)
    setAnswers(prev => ({ ...prev, revealed: true }))
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      const score = Math.round((correctCount / questions.length) * 100)
      recordEvent({ type: 'QUIZ_COMPLETED', contentSlug: `${certId}-topic-${topicSlug}`, score })
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setAnswers({ selected: [], revealed: false })
    }
  }

  if (done) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="quiz-selector">
        <header className="selector-header">
          <h1>{topic.label} — Résultat</h1>
          <p>{correctCount} / {questions.length} correctes ({score}%)</p>
        </header>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn--primary" onClick={() => { setIndex(0); setAnswers({ selected: [], revealed: false }); setDone(false); setCorrectCount(0) }}>
            Recommencer
          </button>
          <Link to={`/certifications/${certId}`} className="btn btn--secondary" style={{ textDecoration: 'none' }}>
            Retour au portail
          </Link>
        </div>
      </div>
    )
  }

  const correct = answers.revealed && isCorrect(answers.selected)
  const incorrect = answers.revealed && !isCorrect(answers.selected)

  return (
    <div className="quiz-selector">
      <header className="selector-header">
        <h1>{topic.label}</h1>
        <p>Question {index + 1} / {questions.length}</p>
      </header>

      <article className="quiz-exam-card" style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: 500 }}>{current.text}</p>
        {current.isMultiple && <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Plusieurs réponses possibles</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          {current.options.map(opt => {
            const isSelected = answers.selected.includes(opt.letter)
            const isRightAnswer = current.correctAnswer.includes(opt.letter)
            let bg = 'transparent'
            if (answers.revealed && isRightAnswer) bg = 'rgba(16,185,129,0.15)'
            else if (answers.revealed && isSelected && !isRightAnswer) bg = 'rgba(239,68,68,0.15)'

            return (
              <button
                key={opt.letter}
                onClick={() => handleSelect(opt.letter)}
                style={{ textAlign: 'left', padding: '0.6rem 0.75rem', border: `1px solid ${isSelected ? 'var(--accent, #6366f1)' : 'var(--border, #e5e7eb)'}`, borderRadius: 6, background: bg, cursor: answers.revealed ? 'default' : 'pointer', fontWeight: isSelected ? 600 : 400 }}
              >
                {opt.letter}. {opt.text}
              </button>
            )
          })}
        </div>

        {answers.revealed && (
          <p style={{ marginTop: '0.75rem', fontWeight: 600, color: correct ? '#10b981' : '#ef4444' }}>
            {correct ? '✓ Correct' : '✗ Incorrect'} — Bonne réponse : {current.correctAnswer.join(', ')}
          </p>
        )}
      </article>

      {current.isMultiple && !answers.revealed && answers.selected.length > 0 && (
        <button className="btn btn--secondary" onClick={handleReveal} style={{ marginBottom: '0.75rem' }}>
          Valider
        </button>
      )}

      {answers.revealed && (
        <button className="btn btn--primary" onClick={handleNext}>
          {index + 1 >= questions.length ? 'Voir les résultats' : 'Question suivante →'}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --run src/components/TopicPracticeScreen/
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TopicPracticeScreen/
git commit -m "feat(certifications): add TopicPracticeScreen with immediate feedback"
```

---

## Task 10: Routing + NavBar

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/NavBar/index.tsx`

- [ ] **Step 1: Update `src/App.tsx`**

Add imports at the top:

```tsx
import { CertificationHub } from './components/CertificationHub'
import { CertificationPortal } from './components/CertificationPortal'
import { TopicPracticeScreen } from './components/TopicPracticeScreen'
```

Add routes inside the `children` array (after existing quiz routes):

```tsx
{ path: '/certifications', element: <CertificationHub /> },
{ path: '/certifications/:certId', element: <CertificationPortal /> },
{ path: '/certifications/:certId/topic/:topicSlug', element: <TopicPracticeScreen /> },
{ path: '/quiz', element: <Navigate to="/certifications" replace /> },
```

The existing `/quiz/:examId` and `/quiz/:examId/results` routes remain unchanged — the `QuizScreen` and `QuizResults` are still used by the exam flow.

- [ ] **Step 2: Update NavBar in `src/components/NavBar/index.tsx`**

Change the quiz link from `/quiz` to `/certifications` and rename the label:

```tsx
const NAV_LINKS = [
  { to: '/simulation', label: 'Simulation', Icon: Zap },
  { to: '/certifications', label: 'Certifications', Icon: FileCheck },
  { to: '/ateliers', label: 'Ateliers', Icon: BookOpen },
  { to: '/progress', label: 'Progression', Icon: TrendingUp },
] as const
```

- [ ] **Step 3: Update NavBar test if it checks `/quiz` label**

Open `src/components/NavBar/NavBar.test.tsx` and replace any assertion on `'Quiz PSM-1'` with `'Certifications'` and `/quiz` with `/certifications`.

- [ ] **Step 4: Run all tests**

```bash
npm test -- --run
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/NavBar/
git commit -m "feat(certifications): add routes and update NavBar"
```

---

## Task 11: Gamification — 4 cert badges

**Files:**
- Modify: `src/features/gamification/types.ts`
- Modify: `src/features/gamification/badges.ts`

- [ ] **Step 1: Write failing test**

```ts
// Add to src/features/gamification/badges.test.ts (or create if missing)
import { describe, it, expect } from 'vitest'
import { checkBadgeCriteria, BADGES } from './badges'
import type { GamificationEvent } from './types'

function makeQuizEvent(slug: string, score: number): GamificationEvent {
  return { id: slug, type: 'QUIZ_COMPLETED', contentSlug: slug, xpAwarded: 80, score, createdAt: new Date().toISOString() }
}

describe('cert badge — minScoreOnAny', () => {
  const psmBadge = BADGES.find(b => b.id === 'psm-certified')!

  it('unlocks when score >= 85 on any PSM exam', () => {
    const events = [makeQuizEvent('psm-full-1', 90)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(true)
  })

  it('does not unlock when score < 85', () => {
    const events = [makeQuizEvent('psm-full-1', 70)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(false)
  })

  it('does not unlock when no PSM exam attempted', () => {
    const events = [makeQuizEvent('pspo-full-1', 95)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(false)
  })
})
```

- [ ] **Step 2: Run to confirm fails**

```bash
npm test -- --run src/features/gamification/badges.test.ts
```

- [ ] **Step 3: Add `minScoreOnAny` to `BadgeCriteria` in `src/features/gamification/types.ts`**

```ts
export interface BadgeCriteria {
  completedContent?: string[]
  minAverageScore?: number
  minArtifactsCreated?: number
  minScoreOnAny?: number  // passes if ANY event in completedContent has score >= this value
}
```

- [ ] **Step 4: Update `checkBadgeCriteria` in `src/features/gamification/badges.ts`**

Add after the `minArtifactsCreated` check:

```ts
if (criteria.minScoreOnAny !== undefined) {
  const slugFilter = criteria.completedContent
  const anyHighScore = events.some(
    e => isCompleted(e) &&
      (!slugFilter || slugFilter.includes(e.contentSlug ?? '')) &&
      (e.score ?? 0) >= (criteria.minScoreOnAny ?? 0)
  )
  if (!anyHighScore) return false
}
```

Then add the 4 cert badges to the `BADGES` array:

```ts
{
  id: 'psm-certified',
  name: 'PSM Certifié',
  description: 'A réussi un examen PSM complet avec ≥ 85%.',
  skillArea: 'facilitation',
  criteria: {
    completedContent: ['psm-full-1', 'psm-quick', 'psm-random'],
    minScoreOnAny: 85,
  },
},
{
  id: 'pspo-certified',
  name: 'PSPO Certifié',
  description: 'A réussi un examen PSPO complet avec ≥ 85%.',
  skillArea: 'product_discovery',
  criteria: {
    completedContent: ['pspo-full-1', 'pspo-quick', 'pspo-random'],
    minScoreOnAny: 85,
  },
},
{
  id: 'pmi-acp-certified',
  name: 'PMI-ACP Certifié',
  description: 'A réussi un examen PMI-ACP avec ≥ 85%.',
  skillArea: 'delivery_excellence',
  criteria: {
    completedContent: ['pmi-acp-full-1', 'pmi-acp-quick', 'pmi-acp-random'],
    minScoreOnAny: 85,
  },
},
{
  id: 'safe-certified',
  name: 'SAFe Certifié',
  description: 'A réussi un examen SAFe avec ≥ 85%.',
  skillArea: 'organization_design',
  criteria: {
    completedContent: ['safe-full-1', 'safe-quick', 'safe-random'],
    minScoreOnAny: 85,
  },
},
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run src/features/gamification/badges.test.ts
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/features/gamification/types.ts src/features/gamification/badges.ts
git commit -m "feat(gamification): add 4 certification badges with minScoreOnAny criterion"
```

---

## Task 12: Gamification — 4 cert learning paths

**Files:**
- Modify: `src/features/gamification/paths.ts`

- [ ] **Step 1: Write failing test**

```ts
// Add to src/features/gamification/paths.test.ts (or create)
import { describe, it, expect } from 'vitest'
import { LEARNING_PATHS } from './paths'

describe('cert learning paths', () => {
  it('PSM path exists with correct steps', () => {
    const path = LEARNING_PATHS.find(p => p.id === 'path-psm')
    expect(path).toBeDefined()
    expect(path!.completionBadgeId).toBe('psm-certified')
    expect(path!.steps.length).toBeGreaterThan(0)
  })

  it('PSPO path exists', () => {
    expect(LEARNING_PATHS.find(p => p.id === 'path-pspo')).toBeDefined()
  })

  it('PMI-ACP path exists', () => {
    expect(LEARNING_PATHS.find(p => p.id === 'path-pmi-acp')).toBeDefined()
  })

  it('SAFe path exists', () => {
    expect(LEARNING_PATHS.find(p => p.id === 'path-safe')).toBeDefined()
  })
})
```

- [ ] **Step 2: Run to confirm fails**

```bash
npm test -- --run src/features/gamification/paths.test.ts
```

- [ ] **Step 3: Add 4 paths to `LEARNING_PATHS` in `src/features/gamification/paths.ts`**

Append to the existing `LEARNING_PATHS` array:

```ts
{
  id: 'path-psm',
  slug: 'preparation-psm',
  title: 'Préparation PSM I',
  description: 'Préparez-vous à la certification Professional Scrum Master niveau I.',
  level: 'intermediate',
  skillAreas: ['facilitation', 'scrum_knowledge'],
  estimatedMinutes: 120,
  completionBadgeId: 'psm-certified',
  steps: [
    { order: 1, contentType: 'quiz', contentSlug: 'psm-quick', required: true },
    { order: 2, contentType: 'quiz', contentSlug: 'psm-full-1', required: true },
    { order: 3, contentType: 'quiz', contentSlug: 'psm-random', required: false },
  ],
},
{
  id: 'path-pspo',
  slug: 'preparation-pspo',
  title: 'Préparation PSPO I',
  description: 'Préparez-vous à la certification Professional Scrum Product Owner niveau I.',
  level: 'intermediate',
  skillAreas: ['product_discovery', 'prioritization'],
  estimatedMinutes: 120,
  completionBadgeId: 'pspo-certified',
  steps: [
    { order: 1, contentType: 'quiz', contentSlug: 'pspo-quick', required: true },
    { order: 2, contentType: 'quiz', contentSlug: 'pspo-full-1', required: true },
    { order: 3, contentType: 'quiz', contentSlug: 'pspo-random', required: false },
  ],
},
{
  id: 'path-pmi-acp',
  slug: 'preparation-pmi-acp',
  title: 'Préparation PMI-ACP',
  description: 'Préparez-vous à la certification PMI Agile Certified Practitioner.',
  level: 'advanced',
  skillAreas: ['delivery_excellence', 'flow'],
  estimatedMinutes: 120,
  completionBadgeId: 'pmi-acp-certified',
  steps: [
    { order: 1, contentType: 'quiz', contentSlug: 'pmi-acp-quick', required: true },
    { order: 2, contentType: 'quiz', contentSlug: 'pmi-acp-full-1', required: true },
    { order: 3, contentType: 'quiz', contentSlug: 'pmi-acp-random', required: false },
  ],
},
{
  id: 'path-safe',
  slug: 'preparation-safe',
  title: 'Préparation SAFe SA',
  description: 'Préparez-vous à la certification SAFe Agilist (SA).',
  level: 'advanced',
  skillAreas: ['organization_design', 'change_management'],
  estimatedMinutes: 120,
  completionBadgeId: 'safe-certified',
  steps: [
    { order: 1, contentType: 'quiz', contentSlug: 'safe-quick', required: true },
    { order: 2, contentType: 'quiz', contentSlug: 'safe-full-1', required: true },
    { order: 3, contentType: 'quiz', contentSlug: 'safe-random', required: false },
  ],
},
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --run src/features/gamification/paths.test.ts
```

Expected: all pass.

- [ ] **Step 5: Run all tests to ensure nothing broken**

```bash
npm test -- --run
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/features/gamification/paths.ts
git commit -m "feat(gamification): add 4 certification learning paths"
```

---

## Self-Review Checklist

- [x] Spec: Hub with 4 cert cards → `CertificationHub` (Task 7)
- [x] Spec: Portal with Examens / Thèmes / Ressources / Progression tabs → `CertificationPortal` (Task 8)
- [x] Spec: Topic practice with immediate feedback → `TopicPracticeScreen` (Task 9)
- [x] Spec: PSM migration from existing questions → Task 2
- [x] Spec: PSPO, PMI-ACP, SAFe question banks → Tasks 3-5
- [x] Spec: getCertification / getCertExam → Task 6
- [x] Spec: Routing `/certifications` → Task 10
- [x] Spec: 4 badges (minScoreOnAny) → Task 11
- [x] Spec: 4 learning paths → Task 12
- [x] Types consistent: `CertificationId`, `CertQuestion`, `CertDefinition` defined in Task 1, used in Tasks 2-9
- [x] `getCertification()` used in Tasks 8, 9 — defined in Task 6
- [x] `CERT_IDS` used in Tasks 8, 9 — exported from Task 6
- [x] Exam IDs (`psm-full-1`, `pspo-quick`, etc.) consistent across Tasks 2-5, 6, 8, 11-12
- [x] `minScoreOnAny` added to `BadgeCriteria` in Task 11 step 3 before it is used in step 4
