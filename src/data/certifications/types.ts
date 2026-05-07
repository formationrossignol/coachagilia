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
