// src/features/gamification/types.ts

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

export interface BadgeCriteria {
  completedContent?: string[]
  minAverageScore?: number
  minArtifactsCreated?: number
  minScoreOnAny?: number  // passes if ANY event in completedContent has score >= this value
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  skillArea: SkillArea
  criteria: BadgeCriteria
}

export interface LearningPathStep {
  order: number
  contentType: 'workshop' | 'quiz'
  contentSlug: string
  required: boolean
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

export interface RecordEventInput {
  type: GamificationEventType
  contentSlug?: string
  contentType?: GamificationEvent['contentType']
  score?: number
  metadata?: Record<string, unknown>
}
