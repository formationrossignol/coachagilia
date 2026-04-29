import { CONTENT_SKILL_MAP } from './skill-map'
import type { SkillArea } from './types'

export function getRecommendations(
  skill: SkillArea,
  completedSlugs: string[],
  limit = 3,
): string[] {
  const completed = new Set(completedSlugs)
  return Object.entries(CONTENT_SKILL_MAP)
    .filter(([slug, contributions]) =>
      !completed.has(slug) && contributions.some(c => c.skill === skill)
    )
    .sort(([, a], [, b]) => {
      const wA = a.find(c => c.skill === skill)?.weight ?? 0
      const wB = b.find(c => c.skill === skill)?.weight ?? 0
      return wB - wA
    })
    .slice(0, limit)
    .map(([slug]) => slug)
}
