import type { MasteryLevel, SkillArea, GamificationEvent } from './types'
import { MASTERY_THRESHOLDS } from './rules'
import { CONTENT_SKILL_MAP } from './skill-map'

export function getMasteryLevel(xp: number): MasteryLevel {
  const ordered: MasteryLevel[] = ['transmission', 'field_application', 'proficiency', 'practice', 'discovery']
  for (const level of ordered) {
    if (xp >= MASTERY_THRESHOLDS[level]) return level
  }
  return 'discovery' // xp < 0 fallback
}

export function computeSkillXp(events: GamificationEvent[]): Partial<Record<SkillArea, number>> {
  const result: Partial<Record<SkillArea, number>> = {}
  for (const event of events) {
    if (!event.skillImpacts) continue
    for (const [skill, xp] of Object.entries(event.skillImpacts)) {
      const s = skill as SkillArea
      result[s] = (result[s] ?? 0) + (xp ?? 0)
    }
  }
  return result
}

export function computeSkillImpacts(
  contentSlug: string,
  xpAwarded: number
): Partial<Record<SkillArea, number>> {
  const contributions = CONTENT_SKILL_MAP[contentSlug]
  if (!contributions) return {}
  const impacts: Partial<Record<SkillArea, number>> = {}
  // Skill XP and total XP are tracked on separate ledgers — rounding drift is acceptable
  for (const { skill, weight } of contributions) {
    impacts[skill] = Math.round(xpAwarded * weight)
  }
  return impacts
}
