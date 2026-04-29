import type { BadgeDefinition, GamificationEvent, Artifact } from './types'

export const BADGES: BadgeDefinition[] = [
  {
    id: 'conflict-mediator',
    name: 'Médiateur en progression',
    description: 'A complété les fondamentaux de la gestion de conflit.',
    skillArea: 'conflict',
    criteria: { completedContent: ['thomas-kilmann', 'ladder-of-inference', 'nonviolent-communication'], minAverageScore: 75 },
  },
  {
    id: 'feedback-crafter',
    name: 'Artisan du feedback',
    description: 'Sait formuler un feedback clair, utile et non jugeant.',
    skillArea: 'feedback',
    criteria: { completedContent: ['sbi', 'desc', 'feedforward'], minArtifactsCreated: 2 },
  },
  {
    id: 'coach-questionneur',
    name: 'Coach questionnant',
    description: 'Développe une posture de coaching fondée sur les questions.',
    skillArea: 'coaching',
    criteria: { completedContent: ['active-listening', 'powerful-questions', 'grow-model', 'ask-vs-tell'], minAverageScore: 75 },
  },
  {
    id: 'facilitateur-structure',
    name: 'Facilitateur structuré',
    description: 'Sait concevoir et animer des ateliers participatifs.',
    skillArea: 'facilitation',
    criteria: { completedContent: ['facilitation-canvas', '1-2-4-all', 'dot-voting', 'lean-coffee'], minArtifactsCreated: 2 },
  },
  {
    id: 'analyste-cause-racine',
    name: 'Analyste cause racine',
    description: "Sait diagnostiquer un problème sans s'arrêter aux symptômes.",
    skillArea: 'problem_solving',
    criteria: { completedContent: ['5-whys', 'ishikawa', 'root-cause-analysis'], minAverageScore: 75 },
  },
  {
    id: 'gardien-securite-psychologique',
    name: 'Gardien de la sécurité psychologique',
    description: "Sait rendre visibles les signaux faibles d'une équipe.",
    skillArea: 'team_health',
    criteria: { completedContent: ['team-health-check', 'psychological-safety', 'working-agreements'], minArtifactsCreated: 2 },
  },
  {
    id: 'cartographe-parties-prenantes',
    name: 'Cartographe des parties prenantes',
    description: "Sait lire et structurer un écosystème d'acteurs.",
    skillArea: 'stakeholder_management',
    criteria: { completedContent: ['stakeholder-mapping', 'empathy-map', 'customer-journey-mapping'], minArtifactsCreated: 2 },
  },
  {
    id: 'strategist-flow',
    name: 'Stratège du flow',
    description: 'Sait analyser un système de travail et identifier les blocages.',
    skillArea: 'flow',
    criteria: { completedContent: ['kanban', 'value-stream-mapping', 'dependency-mapping'], minArtifactsCreated: 2 },
  },
  {
    id: 'leader-sans-autorite',
    name: 'Leader sans autorité',
    description: 'Sait influencer sans imposer.',
    skillArea: 'leadership',
    criteria: { completedContent: ['delegation-poker', 'circle-of-influence', 'situational-leadership'], minAverageScore: 75 },
  },
]

export function checkBadgeCriteria(
  badge: BadgeDefinition,
  events: GamificationEvent[],
  artifacts: Artifact[]
): boolean {
  const { criteria } = badge
  const isCompleted = (e: GamificationEvent) =>
    e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED'

  if (criteria.completedContent) {
    const completedSlugs = new Set(events.filter(isCompleted).map(e => e.contentSlug))
    if (!criteria.completedContent.every(slug => completedSlugs.has(slug))) return false
  }

  if (criteria.minAverageScore !== undefined) {
    const slugFilter = criteria.completedContent
    const relevant = events.filter(
      e => isCompleted(e) &&
        (!slugFilter || slugFilter.includes(e.contentSlug ?? '')) &&
        e.score !== undefined
    )
    if (relevant.length === 0) return false
    const avg = relevant.reduce((sum, e) => sum + (e.score ?? 0), 0) / relevant.length
    if (avg < criteria.minAverageScore) return false
  }

  if (criteria.minArtifactsCreated !== undefined) {
    if (artifacts.length < criteria.minArtifactsCreated) return false
  }

  return true
}
