import type { LearningPath, PathProgress } from './types'

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-conflict',
    slug: 'gestion-de-conflit',
    title: 'Gestion de conflit',
    description: 'Maîtrisez les fondamentaux de la gestion constructive des tensions et désaccords.',
    level: 'intermediate',
    skillAreas: ['conflict', 'communication'],
    estimatedMinutes: 60,
    completionBadgeId: 'conflict-mediator',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'thomas-kilmann', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'ladder-of-inference', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'nonviolent-communication', required: true },
      { order: 4, contentType: 'quiz', contentSlug: 'conflict-management-quiz', required: true },
    ],
  },
  {
    id: 'path-facilitation',
    slug: 'facilitation',
    title: 'Facilitation',
    description: 'Apprenez à concevoir et animer des sessions participatives efficaces.',
    level: 'beginner',
    skillAreas: ['facilitation', 'decision_making'],
    estimatedMinutes: 60,
    completionBadgeId: 'facilitateur-structure',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'facilitation-canvas', required: true },
      { order: 2, contentType: 'workshop', contentSlug: '1-2-4-all', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'dot-voting', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'fist-of-five', required: false },
      { order: 5, contentType: 'quiz', contentSlug: 'facilitation-quiz', required: true },
    ],
  },
  {
    id: 'path-coaching',
    slug: 'coaching-scrum-master',
    title: 'Posture de coach',
    description: "Développez une posture de coaching fondée sur les questions et l'écoute.",
    level: 'intermediate',
    skillAreas: ['coaching', 'communication'],
    estimatedMinutes: 75,
    completionBadgeId: 'coach-questionneur',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'active-listening', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'powerful-questions', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'grow-model', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'ask-vs-tell', required: true },
      { order: 5, contentType: 'quiz', contentSlug: 'coaching-quiz', required: true },
    ],
  },
  {
    id: 'path-m30',
    slug: 'management-3-0',
    title: 'Management 3.0',
    description: "Explorez les pratiques de motivation, délégation et amélioration continue Management 3.0.",
    level: 'intermediate',
    skillAreas: ['management_3_0', 'team_health', 'leadership'],
    estimatedMinutes: 60,
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: 'moving-motivators', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'delegation-poker', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'delegation-board', required: true },
      { order: 4, contentType: 'workshop', contentSlug: 'celebration-grid', required: false },
      { order: 5, contentType: 'quiz', contentSlug: 'management-3-0-quiz', required: true },
    ],
  },
  {
    id: 'path-problem-solving',
    slug: 'resolution-de-problemes',
    title: 'Résolution de problèmes',
    description: "Apprenez à diagnostiquer des problèmes complexes en remontant aux causes racines.",
    level: 'beginner',
    skillAreas: ['problem_solving', 'systems_thinking'],
    estimatedMinutes: 45,
    completionBadgeId: 'analyste-cause-racine',
    steps: [
      { order: 1, contentType: 'workshop', contentSlug: '5-whys', required: true },
      { order: 2, contentType: 'workshop', contentSlug: 'ishikawa', required: true },
      { order: 3, contentType: 'workshop', contentSlug: 'root-cause-analysis', required: true },
      { order: 4, contentType: 'quiz', contentSlug: 'problem-solving-quiz', required: true },
    ],
  },
]

export function computePathProgress(
  path: LearningPath,
  completedSlugs: string[]
): PathProgress {
  const completed = new Set(completedSlugs)
  const completedSteps = path.steps.filter(s => completed.has(s.contentSlug)).map(s => s.contentSlug)
  const required = path.steps.filter(s => s.required)
  const requiredCompleted = required.filter(s => completed.has(s.contentSlug)).length
  return {
    slug: path.slug,
    completedSteps,
    requiredTotal: required.length,
    requiredCompleted,
    isComplete: requiredCompleted === required.length,
  }
}
