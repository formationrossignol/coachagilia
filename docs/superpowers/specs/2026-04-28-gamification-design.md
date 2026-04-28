# Gamification System — Design Spec

## Goal

Ajouter un module de gamification sobre, professionnelle et orientée maîtrise à la plateforme Scrum Master Studio. Le système doit renforcer la pratique régulière, valoriser la montée en compétence, et produire un portfolio de livrables exploitables — sans jamais ressembler à un jeu vidéo.

## Contraintes techniques

- **Stack** : React 19 + TypeScript + Vite + Zustand + React Router v7
- **Persistence** : `localStorage` via Zustand `persist` middleware — aucun backend, aucun compte utilisateur, aucun Prisma
- **Clé localStorage** : `scrum-master-gamification`
- Pas de nouvelle lib UI externe (pas de recharts, pas de framer-motion)
- Radar SVG généré en pur React
- Style cohérent avec l'existant (variables CSS `--color-*`, `Badge.tsx`, `ProgressBar.tsx`)

## Découpage en 3 phases

| Phase | Scope | Livrable autonome |
|-------|-------|-------------------|
| **Phase 1** | Moteur : types, store, règles XP, skill map, badges, parcours, défis | Moteur testable sans UI dédiée |
| **Phase 2** | UI : 6 pages + 13 composants gamification | Interface complète de progression |
| **Phase 3** | Intégrations : 11 ateliers + quiz + toast + portail + admin | Plateforme entièrement gamifiée |

Chaque phase est un plan d'implémentation indépendant.

---

## Architecture

### Pattern : event log + sélecteurs dérivés

Un seul store Zustand persisté contenant un **log d'événements immuables**. Toutes les valeurs — XP total, XP par compétence, niveaux de maîtrise, badges débloqués — sont **calculées à la volée** par des sélecteurs purs à partir du log. Si les règles XP changent, on peut recalculer l'état complet en relisant les événements.

### Structure de fichiers

```
src/
  features/gamification/
    types.ts              — tous les types TypeScript
    rules.ts              — XP_RULES, XP_BONUSES, MASTERY_THRESHOLDS
    skill-map.ts          — CONTENT_SKILL_MAP (mapping contenu → compétences)
    badges.ts             — BADGES[] (définitions statiques)
    paths.ts              — LEARNING_PATHS[] (définitions statiques)
    challenges.ts         — WEEKLY_CHALLENGES[], getActiveChallenge()
    mastery.ts            — getMasteryLevel(), getSkillXp(), computeAllSkills()
    gamification.store.ts — Zustand store
    index.ts              — re-exports publics
```

---

## Types (`types.ts`)

```ts
export type SkillArea =
  | 'conflict' | 'communication' | 'feedback' | 'coaching'
  | 'facilitation' | 'retrospective' | 'problem_solving' | 'team_health'
  | 'management_3_0' | 'product_discovery' | 'prioritization'
  | 'stakeholder_management' | 'decision_making' | 'flow'
  | 'delivery_excellence' | 'systems_thinking' | 'organization_design'
  | 'change_management' | 'leadership'

export type MasteryLevel =
  | 'discovery' | 'practice' | 'proficiency' | 'field_application' | 'transmission'

export type GamificationEventType =
  | 'WORKSHOP_STARTED' | 'WORKSHOP_COMPLETED' | 'QUIZ_COMPLETED'
  | 'ARTIFACT_CREATED' | 'ARTIFACT_EXPORTED' | 'CHALLENGE_COMPLETED'
  | 'PATH_STARTED' | 'PATH_COMPLETED' | 'SCORE_IMPROVED'
  | 'SKILL_LEVEL_UP' | 'BADGE_UNLOCKED'

export interface GamificationEvent {
  id: string
  type: GamificationEventType
  contentSlug?: string
  contentType?: 'workshop' | 'quiz' | 'path' | 'artifact' | 'challenge'
  xpAwarded: number
  skillImpacts?: Partial<Record<SkillArea, number>>
  score?: number
  metadata?: Record<string, unknown>
  createdAt: string
}

export type ArtifactType =
  | 'feedback_sbi' | 'grow_plan' | 'stakeholder_map' | 'fishbone_diagram'
  | 'five_whys' | 'team_charter' | 'working_agreements' | 'delegation_board'
  | 'facilitation_canvas' | 'retrospective_board' | 'risk_map'
  | 'decision_matrix' | 'customer_journey' | 'value_stream_map' | 'desc_message'

export interface Artifact {
  id: string
  title: string
  type: ArtifactType
  sourceContentSlug: string
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
  exportedAt?: string
}

export interface SkillContribution {
  skill: SkillArea
  weight: number
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  skillArea: SkillArea
  criteria: BadgeCriteria
}

export interface BadgeCriteria {
  completedContent?: string[]
  minAverageScore?: number
  minArtifactsCreated?: number
}

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  skillAreas: SkillArea[]
  estimatedMinutes: number
  steps: LearningPathStep[]
  completionBadgeId?: string
}

export interface LearningPathStep {
  order: number
  contentType: 'workshop' | 'quiz'
  contentSlug: string
  required: boolean
}

export interface PathProgress {
  slug: string
  completedSteps: string[]
  requiredTotal: number
  requiredCompleted: number
  isComplete: boolean
}

export interface WeeklyChallenge {
  id: string
  title: string
  description: string
  skillArea: SkillArea
  criteria:
    | { type: 'complete_content'; contentSlug: string }
    | { type: 'create_artifact'; artifactType: ArtifactType }
    | { type: 'complete_skill_activities'; skillArea: SkillArea; count: number }
    | { type: 'score_at_least'; contentSlug: string; score: number }
  xpReward: number
}

export interface GamificationToastPayload {
  type: 'xp' | 'badge' | 'level_up' | 'path_complete' | 'challenge_complete'
  message: string
  detail?: string
  xp?: number
}
```

---

## Règles XP (`rules.ts`)

```ts
export const XP_RULES: Record<GamificationEventType, number> = {
  WORKSHOP_STARTED: 5,
  WORKSHOP_COMPLETED: 100,
  QUIZ_COMPLETED: 80,
  ARTIFACT_CREATED: 60,
  ARTIFACT_EXPORTED: 30,
  CHALLENGE_COMPLETED: 150,
  PATH_STARTED: 20,
  PATH_COMPLETED: 300,
  SCORE_IMPROVED: 50,
  SKILL_LEVEL_UP: 100,
  BADGE_UNLOCKED: 200,
}

export const XP_BONUSES = {
  HIGH_SCORE_80: 25,
  HIGH_SCORE_90: 50,
  PERFECT_SCORE: 100,
  FIRST_ARTIFACT: 50,
  WEEKLY_STREAK: 75,
}

export const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
  discovery: 0,
  practice: 300,
  proficiency: 900,
  field_application: 1800,
  transmission: 3000,
}

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  discovery: 'Découverte',
  practice: 'Pratique',
  proficiency: 'Maîtrise',
  field_application: 'Application terrain',
  transmission: 'Transmission',
}
```

---

## Mapping compétences (`skill-map.ts`)

Mapping pour tous les ateliers existants + quiz. Couverture minimale de 20 contenus au lancement.

```ts
export const CONTENT_SKILL_MAP: Record<string, SkillContribution[]> = {
  'thomas-kilmann':        [{ skill: 'conflict', weight: 0.7 }, { skill: 'communication', weight: 0.2 }, { skill: 'leadership', weight: 0.1 }],
  'sbi':                   [{ skill: 'feedback', weight: 0.6 }, { skill: 'communication', weight: 0.3 }, { skill: 'conflict', weight: 0.1 }],
  'grow-model':            [{ skill: 'coaching', weight: 0.7 }, { skill: 'communication', weight: 0.2 }, { skill: 'leadership', weight: 0.1 }],
  'ask-vs-tell':           [{ skill: 'coaching', weight: 0.6 }, { skill: 'facilitation', weight: 0.2 }, { skill: 'leadership', weight: 0.2 }],
  'stakeholder-mapping':   [{ skill: 'stakeholder_management', weight: 0.8 }, { skill: 'communication', weight: 0.2 }],
  'delegation-poker':      [{ skill: 'management_3_0', weight: 0.5 }, { skill: 'leadership', weight: 0.3 }, { skill: 'decision_making', weight: 0.2 }],
  'moving-motivators':     [{ skill: 'management_3_0', weight: 0.6 }, { skill: 'team_health', weight: 0.3 }, { skill: 'coaching', weight: 0.1 }],
  'ishikawa':              [{ skill: 'problem_solving', weight: 0.7 }, { skill: 'systems_thinking', weight: 0.3 }],
  'troika-consulting':     [{ skill: 'facilitation', weight: 0.6 }, { skill: 'coaching', weight: 0.3 }, { skill: 'communication', weight: 0.1 }],
  'triz':                  [{ skill: 'problem_solving', weight: 0.5 }, { skill: 'facilitation', weight: 0.3 }, { skill: 'systems_thinking', weight: 0.2 }],
  'cynefin-framework':     [{ skill: 'systems_thinking', weight: 0.6 }, { skill: 'decision_making', weight: 0.3 }, { skill: 'leadership', weight: 0.1 }],
  'scrum-guide':           [{ skill: 'facilitation', weight: 0.4 }, { skill: 'team_health', weight: 0.4 }, { skill: 'delivery_excellence', weight: 0.2 }],
  // quiz
  'exam-1':                [{ skill: 'facilitation', weight: 0.4 }, { skill: 'team_health', weight: 0.3 }, { skill: 'delivery_excellence', weight: 0.3 }],
  'exam-2':                [{ skill: 'coaching', weight: 0.4 }, { skill: 'leadership', weight: 0.3 }, { skill: 'management_3_0', weight: 0.3 }],
  'exam-3':                [{ skill: 'problem_solving', weight: 0.4 }, { skill: 'systems_thinking', weight: 0.3 }, { skill: 'decision_making', weight: 0.3 }],
  // coming-soon (utilisés dans badges/parcours)
  'nonviolent-communication': [{ skill: 'communication', weight: 0.5 }, { skill: 'conflict', weight: 0.3 }, { skill: 'feedback', weight: 0.2 }],
  'ladder-of-inference':   [{ skill: 'conflict', weight: 0.5 }, { skill: 'communication', weight: 0.4 }, { skill: 'coaching', weight: 0.1 }],
  'facilitation-canvas':   [{ skill: 'facilitation', weight: 0.8 }, { skill: 'decision_making', weight: 0.2 }],
  '1-2-4-all':             [{ skill: 'facilitation', weight: 0.7 }, { skill: 'team_health', weight: 0.3 }],
  'dot-voting':            [{ skill: 'facilitation', weight: 0.6 }, { skill: 'decision_making', weight: 0.4 }],
}
```

---

## Badges (`badges.ts`)

9 badges MVP. Critères vérifiés automatiquement à chaque `recordEvent`.

| id | name | skillArea | Critères |
|----|------|-----------|---------|
| `conflict-mediator` | Médiateur en progression | `conflict` | thomas-kilmann + ladder-of-inference + nonviolent-communication, score ≥ 75 |
| `feedback-crafter` | Artisan du feedback | `feedback` | sbi + desc + feedforward, ≥ 2 artefacts |
| `coach-questionneur` | Coach questionnant | `coaching` | active-listening + powerful-questions + grow-model + ask-vs-tell, score ≥ 75 |
| `facilitateur-structure` | Facilitateur structuré | `facilitation` | facilitation-canvas + 1-2-4-all + dot-voting + lean-coffee, ≥ 2 artefacts |
| `analyste-cause-racine` | Analyste cause racine | `problem_solving` | 5-whys + ishikawa + root-cause-analysis, score ≥ 75 |
| `gardien-securite-psychologique` | Gardien de la sécurité psychologique | `team_health` | team-health-check + psychological-safety + working-agreements, ≥ 2 artefacts |
| `cartographe-parties-prenantes` | Cartographe des parties prenantes | `stakeholder_management` | stakeholder-mapping + empathy-map + customer-journey-mapping, ≥ 2 artefacts |
| `strategist-flow` | Stratège du flow | `flow` | kanban + value-stream-mapping + dependency-mapping, ≥ 2 artefacts |
| `leader-sans-autorite` | Leader sans autorité | `leadership` | delegation-poker + circle-of-influence + situational-leadership, score ≥ 75 |

---

## Parcours guidés (`paths.ts`)

5 parcours MVP. Un parcours est complété quand toutes les étapes `required: true` sont dans le log d'événements.

### Gestion de conflit
```ts
{ slug: 'gestion-de-conflit', level: 'intermediate', estimatedMinutes: 60,
  skillAreas: ['conflict', 'communication'], completionBadgeId: 'conflict-mediator',
  steps: [
    { order: 1, contentType: 'workshop', contentSlug: 'thomas-kilmann', required: true },
    { order: 2, contentType: 'workshop', contentSlug: 'ladder-of-inference', required: true },
    { order: 3, contentType: 'workshop', contentSlug: 'nonviolent-communication', required: true },
    { order: 4, contentType: 'quiz', contentSlug: 'conflict-management-quiz', required: true },
  ]
}
```

### Facilitation
```ts
{ slug: 'facilitation', level: 'beginner', estimatedMinutes: 60,
  skillAreas: ['facilitation', 'decision_making'], completionBadgeId: 'facilitateur-structure',
  steps: [
    { order: 1, contentType: 'workshop', contentSlug: 'facilitation-canvas', required: true },
    { order: 2, contentType: 'workshop', contentSlug: '1-2-4-all', required: true },
    { order: 3, contentType: 'workshop', contentSlug: 'dot-voting', required: true },
    { order: 4, contentType: 'workshop', contentSlug: 'fist-of-five', required: false },
    { order: 5, contentType: 'quiz', contentSlug: 'facilitation-quiz', required: true },
  ]
}
```

### Posture de coach
```ts
{ slug: 'coaching-scrum-master', level: 'intermediate', estimatedMinutes: 75,
  skillAreas: ['coaching', 'communication'], completionBadgeId: 'coach-questionneur',
  steps: [
    { order: 1, contentType: 'workshop', contentSlug: 'active-listening', required: true },
    { order: 2, contentType: 'workshop', contentSlug: 'powerful-questions', required: true },
    { order: 3, contentType: 'workshop', contentSlug: 'grow-model', required: true },
    { order: 4, contentType: 'workshop', contentSlug: 'ask-vs-tell', required: true },
    { order: 5, contentType: 'quiz', contentSlug: 'coaching-quiz', required: true },
  ]
}
```

### Management 3.0
```ts
{ slug: 'management-3-0', level: 'intermediate', estimatedMinutes: 60,
  skillAreas: ['management_3_0', 'team_health', 'leadership'],
  steps: [
    { order: 1, contentType: 'workshop', contentSlug: 'moving-motivators', required: true },
    { order: 2, contentType: 'workshop', contentSlug: 'delegation-poker', required: true },
    { order: 3, contentType: 'workshop', contentSlug: 'delegation-board', required: true },
    { order: 4, contentType: 'workshop', contentSlug: 'celebration-grid', required: false },
    { order: 5, contentType: 'quiz', contentSlug: 'management-3-0-quiz', required: true },
  ]
}
```

### Résolution de problèmes
```ts
{ slug: 'resolution-de-problemes', level: 'beginner', estimatedMinutes: 45,
  skillAreas: ['problem_solving', 'systems_thinking'], completionBadgeId: 'analyste-cause-racine',
  steps: [
    { order: 1, contentType: 'workshop', contentSlug: '5-whys', required: true },
    { order: 2, contentType: 'workshop', contentSlug: 'ishikawa', required: true },
    { order: 3, contentType: 'workshop', contentSlug: 'root-cause-analysis', required: true },
    { order: 4, contentType: 'quiz', contentSlug: 'problem-solving-quiz', required: true },
  ]
}
```

---

## Défis hebdomadaires (`challenges.ts`)

Rotation automatique : `weekIndex = floor(Date.now() / 604_800_000)`, défi actif = `WEEKLY_CHALLENGES[weekIndex % length]`.

```ts
export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'challenge-sbi-feedback',
    title: 'Formuler un feedback utile',
    description: 'Complète l\'atelier SBI et crée un feedback exploitable.',
    skillArea: 'feedback',
    criteria: { type: 'complete_content', contentSlug: 'sbi' },
    xpReward: 150,
  },
  {
    id: 'challenge-5-whys',
    title: 'Trouver une cause racine',
    description: 'Réalise un 5 Whys sur un irritant d\'équipe.',
    skillArea: 'problem_solving',
    criteria: { type: 'create_artifact', artifactType: 'five_whys' },
    xpReward: 150,
  },
  {
    id: 'challenge-facilitation',
    title: 'Faciliter une décision',
    description: 'Complète deux activités de facilitation cette semaine.',
    skillArea: 'facilitation',
    criteria: { type: 'complete_skill_activities', skillArea: 'facilitation', count: 2 },
    xpReward: 200,
  },
]
```

---

## Store Zustand (`gamification.store.ts`)

```ts
interface GamificationStore {
  // état persisté
  events: GamificationEvent[]
  artifacts: Artifact[]
  completedPathSteps: Record<string, string[]>   // pathSlug → contentSlugs[]
  challengeProgress: Record<string, 'active' | 'completed'>
  toastQueue: GamificationToastPayload[]

  // actions
  recordEvent(input: RecordEventInput): void
  saveArtifact(input: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): void
  deleteArtifact(id: string): void
  markArtifactExported(id: string): void
  dismissToast(): void

  // sélecteurs (computed, non persistés)
  getTotalXp(): number
  getSkillXp(skill: SkillArea): number
  getMasteryLevel(skill: SkillArea): MasteryLevel
  getAllSkillXp(): Partial<Record<SkillArea, number>>
  getUnlockedBadgeIds(): string[]
  getPathProgress(slug: string): PathProgress
  getCompletedContentSlugs(): string[]
  getActiveChallenge(): WeeklyChallenge | null
  isChallengeCompleted(id: string): boolean
}

interface RecordEventInput {
  type: GamificationEventType
  contentSlug?: string
  contentType?: GamificationEvent['contentType']
  score?: number
  artifactType?: ArtifactType
  metadata?: Record<string, unknown>
}
```

`recordEvent` exécute dans l'ordre :
1. Calculer XP de base (`XP_RULES[type]`)
2. Appliquer bonus score si `score` présent
3. Calculer `skillImpacts` depuis `CONTENT_SKILL_MAP[contentSlug]`
4. Pousser l'événement dans `events`
5. Vérifier si un niveau de maîtrise est atteint → pousser `SKILL_LEVEL_UP` + toast
6. Vérifier si un badge est débloqué → pousher `BADGE_UNLOCKED` + toast
7. Vérifier si le défi actif est complété → pousser `CHALLENGE_COMPLETED` + toast
8. Vérifier si une étape de parcours est complétée → mettre à jour `completedPathSteps`, vérifier completion parcours

---

## Pages UI

### `/progress`
XP total (XpSummaryCard) + SkillRadar (19 axes SVG) + RecentProgressFeed + BadgeGrid (3 derniers) + LearningPathCard (parcours en cours) + ArtifactGrid (3 derniers).

### `/skills`
Liste des 19 SkillProgressCard, triées par XP décroissant. Chaque carte : nom compétence + XP + barre de progression + MasteryLevelBadge + 2-3 contenus recommandés (non complétés, mapping inverse du skill-map).

### `/badges`
BadgeGrid complète. Badges débloqués en premier (avec date), badges verrouillés en grisé avec critères visibles.

### `/paths`
Liste des 5 LearningPathCard. Progression = required complétées / required total.

### `/paths/:slug`
LearningPathTimeline avec chaque étape (icône statut, titre, obligatoire/optionnel). CTA "Continuer" → lien vers l'atelier suivant non complété. Badge associé affiché si défini.

### `/challenges`
ChallengeCard du défi actif (semaine courante, countdown lundi suivant, XP reward, critères). Statut : actif / complété.

### `/portfolio`
ArtifactGrid avec filtre par `ArtifactType` et recherche texte sur `title`. Chaque carte : titre, type, date, lien atelier source, bouton export JSON, bouton supprimer.

---

## Composants gamification

Tous dans `src/components/gamification/`.

| Composant | Props clés |
|-----------|------------|
| `XpSummaryCard` | `totalXp: number` |
| `SkillRadar` | `skills: Partial<Record<SkillArea, number>>` — SVG pur, polygone sur 19 axes |
| `SkillProgressCard` | `skill: SkillArea, xp: number, level: MasteryLevel, recommendations: string[]` |
| `MasteryLevelBadge` | `level: MasteryLevel` — pill colorée |
| `BadgeCard` | `badge: BadgeDefinition, unlockedAt?: string` |
| `BadgeGrid` | `badges: BadgeDefinition[], unlockedIds: string[]` |
| `LearningPathCard` | `path: LearningPath, progress: PathProgress` |
| `LearningPathTimeline` | `path: LearningPath, completedSlugs: string[]` |
| `ChallengeCard` | `challenge: WeeklyChallenge, completed: boolean` |
| `ArtifactCard` | `artifact: Artifact, onExport, onDelete` |
| `ArtifactGrid` | `artifacts: Artifact[], onExport, onDelete` |
| `GamificationToast` | Monté dans `Layout`, lit `toastQueue` du store |
| `RecentProgressFeed` | `events: GamificationEvent[]` — 10 derniers |

---

## Intégrations

### Ateliers — complétion
À la fin de chaque atelier (écran de résultats), appel :
```ts
recordEvent({
  type: 'WORKSHOP_COMPLETED',
  contentSlug: workshop.slug,
  score: finalScore, // 0–100
})
```

### Ateliers — artefacts sauvegardables

| Atelier | Type artefact | Données sauvegardées |
|---------|--------------|---------------------|
| SBI | `feedback_sbi` | situation, behavior, impact |
| GROW Model | `grow_plan` | goal, reality, options, will |
| Stakeholder Mapping | `stakeholder_map` | positions sur la matrice |
| Ishikawa | `fishbone_diagram` | causes par catégorie |
| Delegation Poker | `delegation_board` | niveaux par situation |
| Troika Consulting | `facilitation_canvas` | défi, questions, plan |

Bouton "Sauvegarder en portfolio" affiché sur l'écran de résultats de ces 6 ateliers. Déclenche `saveArtifact()` puis `recordEvent({ type: 'ARTIFACT_CREATED' })`.

### Quiz
Dans `QuizResults`, à la soumission :
```ts
recordEvent({
  type: 'QUIZ_COMPLETED',
  contentSlug: examId,
  contentType: 'quiz',
  score: scorePercentage,
})
```

### Toast
`GamificationToast` monté dans `Layout` à côté de `NavBar`. Lit `toastQueue[0]`, affiche 3s, puis appelle `dismissToast()`. Une seule notification visible simultanément.

### Portail (`/`)
`Home` affiche : XP total, compétence la plus avancée (badge), parcours en cours (1 carte), défi actif, 3 derniers badges.

### Admin (`/admin`)
Page lecture seule listant : règles XP (tableau), badges avec critères (liste), parcours (liste avec étapes). Aucune édition dans le MVP.

---

## Critères d'acceptation

- Chaque atelier terminé attribue de l'XP
- Les compétences progressent selon le mapping
- Les niveaux de maîtrise se calculent correctement depuis le XP
- Les badges sont débloqués automatiquement quand les critères sont atteints
- Les parcours affichent une progression correcte
- Le défi actif tourne chaque semaine
- Les artefacts sont sauvegardés et exportables en JSON
- Le portail affiche les éléments de progression
- Les pages /progress, /skills, /badges, /paths, /challenges, /portfolio fonctionnent
- TypeScript compile sans erreur
- Le build Vite passe
- Les 276 tests existants continuent de passer

---

## Ce qui est explicitement hors scope du MVP

- Comptes utilisateurs / auth
- Backend / API
- Synchronisation entre appareils
- Classements / leaderboards
- Monnaie virtuelle
- Avatars
- Édition des badges/parcours/défis depuis l'admin
- Partage de livrables
