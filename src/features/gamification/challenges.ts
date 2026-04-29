import type { WeeklyChallenge, GamificationEvent, Artifact } from './types'
import { CONTENT_SKILL_MAP } from './skill-map'

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'challenge-sbi-feedback',
    title: 'Formuler un feedback utile',
    description: "Complète l'atelier SBI et crée un feedback exploitable.",
    skillArea: 'feedback',
    criteria: { type: 'complete_content', contentSlug: 'sbi' },
    xpReward: 150,
  },
  {
    id: 'challenge-5-whys',
    title: 'Trouver une cause racine',
    description: "Réalise un 5 Whys sur un irritant d'équipe.",
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

export function getActiveChallenge(): WeeklyChallenge {
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return WEEKLY_CHALLENGES[weekIndex % WEEKLY_CHALLENGES.length]
}

export function isChallengeCompletedBy(
  challenge: WeeklyChallenge,
  events: GamificationEvent[],
  artifacts: Artifact[]
): boolean {
  const { criteria } = challenge
  const isCompleted = (e: GamificationEvent) =>
    e.type === 'WORKSHOP_COMPLETED' || e.type === 'QUIZ_COMPLETED'

  switch (criteria.type) {
    case 'complete_content':
      return events.some(e => isCompleted(e) && e.contentSlug === criteria.contentSlug)

    case 'create_artifact':
      return artifacts.some(a => a.type === criteria.artifactType)

    case 'complete_skill_activities': {
      const skillSlugs = Object.entries(CONTENT_SKILL_MAP)
        .filter(([, contribs]) => contribs.some(c => c.skill === criteria.skillArea))
        .map(([slug]) => slug)
      const count = events.filter(e => isCompleted(e) && skillSlugs.includes(e.contentSlug ?? '')).length
      return count >= criteria.count
    }

    case 'score_at_least':
      return events.some(e =>
        isCompleted(e) && e.contentSlug === criteria.contentSlug && (e.score ?? 0) >= criteria.score
      )
  }
}
