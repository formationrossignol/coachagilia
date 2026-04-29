// src/features/gamification/index.ts
export type {
  SkillArea, MasteryLevel, GamificationEventType, GamificationEvent,
  ArtifactType, Artifact, SkillContribution, BadgeCriteria, BadgeDefinition,
  LearningPath, LearningPathStep, PathProgress,
  WeeklyChallenge, GamificationToastPayload, RecordEventInput,
} from './types'

export { XP_RULES, XP_BONUSES, MASTERY_THRESHOLDS, MASTERY_LABELS } from './rules'
export { CONTENT_SKILL_MAP } from './skill-map'
export { getMasteryLevel, computeSkillXp, computeSkillImpacts } from './mastery'
export { BADGES, checkBadgeCriteria } from './badges'
export { LEARNING_PATHS, computePathProgress } from './paths'
export { WEEKLY_CHALLENGES, getActiveChallenge, isChallengeCompletedBy } from './challenges'
export { useGamificationStore } from './gamification.store'
