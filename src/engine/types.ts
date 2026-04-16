// src/engine/types.ts

export type CompetencyId =
  | 'facilitation'
  | 'protection'
  | 'conflict'
  | 'flow'
  | 'po_coaching'
  | 'org_improvement'
  | 'scrum_knowledge'

export interface StateVariables {
  teamTrust: number
  goalClarity: number
  sprintFocus: number
  productQuality: number
  techDebt: number
  poEngagement: number
  psychologicalSafety: number
  scrumMaturity: number
}

export interface Choice {
  id: string
  text: string
  effects: Partial<StateVariables>
  competencyScores: Partial<Record<CompetencyId, number>>
  feedback: string
  nextSceneId: string | 'END'
  scrumPrinciple?: string
}

export interface ChoiceRecord {
  sceneId: string
  sceneTitle: string
  choiceId: string
  choiceText: string
  competencyScores: Partial<Record<CompetencyId, number>>
  feedback: string
  scrumPrinciple?: string
  nextSceneId: string
}

export interface Scene {
  id: string
  type: 'briefing' | 'event' | 'ceremony' | 'conflict'
  title: string
  narrative: string
  characters: string[]
  choices: Choice[]
}

export interface Character {
  id: string
  name: string
  role: string
  description: string
}

export interface Scenario {
  id: string
  title: string
  theme: string
  level: 'debutant' | 'intermediaire' | 'avance'
  estimatedDuration: string
  targetCompetencies: CompetencyId[]
  initialState: StateVariables
  scenes: Record<string, Scene>
  startSceneId: string
  characters: Record<string, Character>
}

export interface CompetencyResult {
  score: number
  level: 'debutant' | 'en_progression' | 'maitrise'
}

export interface DebriefResult {
  globalScore: number
  competencyResults: Partial<Record<CompetencyId, CompetencyResult>>
  bestDecisions: ChoiceRecord[]
  riskyDecisions: ChoiceRecord[]
  scrumPrinciples: string[]
}

export type SimulationStatus = 'idle' | 'playing' | 'awaiting_feedback' | 'finished'
