// src/features/gamification/rules.ts
import type { GamificationEventType, MasteryLevel } from './types'

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
} as const

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
