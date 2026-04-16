import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { applyChoice } from '../engine/simulator'
import { computeDebrief } from '../engine/scorer'
import { scenarios } from '../data/scenarios'
import type {
  Scenario, Scene, StateVariables, Choice, ChoiceRecord,
  CompetencyId, SimulationStatus, DebriefResult,
} from '../engine/types'

const ALL_COMPETENCIES: CompetencyId[] = [
  'facilitation', 'protection', 'conflict', 'flow',
  'po_coaching', 'org_improvement', 'scrum_knowledge',
]

const emptyScores = (): Record<CompetencyId, number> =>
  Object.fromEntries(ALL_COMPETENCIES.map(id => [id, 0])) as Record<CompetencyId, number>

interface SimulationStore {
  status: SimulationStatus
  scenario: Scenario | null
  currentScene: Scene | null
  stateVars: StateVariables
  history: ChoiceRecord[]
  competencyScores: Record<CompetencyId, number>
  pendingFeedback: { text: string; scrumPrinciple?: string } | null
  debriefResult: DebriefResult | null

  startSimulation(scenarioId: string): void
  makeChoice(choice: Choice): void
  dismissFeedback(): void
  resetSimulation(): void
}

const EMPTY_STATE_VARS: StateVariables = {
  teamTrust: 0, goalClarity: 0, sprintFocus: 0, productQuality: 0,
  techDebt: 0, poEngagement: 0, psychologicalSafety: 0, scrumMaturity: 0,
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      status: 'idle',
      scenario: null,
      currentScene: null,
      stateVars: EMPTY_STATE_VARS,
      history: [],
      competencyScores: emptyScores(),
      pendingFeedback: null,
      debriefResult: null,

      startSimulation(scenarioId: string) {
        const scenario = scenarios.find(s => s.id === scenarioId)
        if (!scenario) return
        set({
          status: 'playing',
          scenario,
          currentScene: scenario.scenes[scenario.startSceneId],
          stateVars: { ...scenario.initialState },
          history: [],
          competencyScores: emptyScores(),
          pendingFeedback: null,
          debriefResult: null,
        })
      },

      makeChoice(choice: Choice) {
        const { stateVars, competencyScores, currentScene, scenario } = get()
        if (!currentScene || !scenario) return

        const newStateVars = applyChoice(stateVars, choice)
        const newScores = { ...competencyScores }
        for (const [id, delta] of Object.entries(choice.competencyScores) as [CompetencyId, number][]) {
          newScores[id] = (newScores[id] ?? 0) + delta
        }

        const record: ChoiceRecord = {
          sceneId: currentScene.id,
          sceneTitle: currentScene.title,
          choiceId: choice.id,
          choiceText: choice.text,
          competencyScores: choice.competencyScores,
          feedback: choice.feedback,
          scrumPrinciple: choice.scrumPrinciple,
          nextSceneId: choice.nextSceneId,
        }

        set({
          stateVars: newStateVars,
          competencyScores: newScores,
          history: [...get().history, record],
          pendingFeedback: { text: choice.feedback, scrumPrinciple: choice.scrumPrinciple },
          status: 'awaiting_feedback',
        })
      },

      dismissFeedback() {
        const { history, scenario, competencyScores } = get()
        if (!scenario) return

        const lastRecord = history[history.length - 1]
        if (!lastRecord) return

        const nextScene = lastRecord.nextSceneId === 'END'
          ? null
          : scenario.scenes[lastRecord.nextSceneId] ?? null

        if (!nextScene) {
          const debriefResult = computeDebrief(scenario, history, competencyScores)
          set({ status: 'finished', currentScene: null, pendingFeedback: null, debriefResult })
        } else {
          set({ status: 'playing', currentScene: nextScene, pendingFeedback: null })
        }
      },

      resetSimulation() {
        set({
          status: 'idle',
          scenario: null,
          currentScene: null,
          stateVars: EMPTY_STATE_VARS,
          history: [],
          competencyScores: emptyScores(),
          pendingFeedback: null,
          debriefResult: null,
        })
      },
    }),
    {
      name: 'scrum-sim-session',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
