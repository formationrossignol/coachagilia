import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Scenario } from '../engine/types'

// Use vi.hoisted so the variable is available when vi.mock factory runs
const { mockScenario } = vi.hoisted(() => {
  const mockScenario: Scenario = {
    id: 'scenario-01',
    title: 'Test Scenario',
    theme: 'Test',
    level: 'debutant',
    estimatedDuration: '10 min',
    targetCompetencies: ['facilitation'],
    initialState: {
      teamTrust: 50, goalClarity: 50, sprintFocus: 50, productQuality: 50,
      techDebt: 50, poEngagement: 50, psychologicalSafety: 50, scrumMaturity: 50,
    },
    startSceneId: 'briefing',
    characters: {},
    scenes: {
      briefing: {
        id: 'briefing',
        type: 'briefing',
        title: 'Briefing',
        narrative: 'Test briefing narrative',
        characters: [],
        choices: [
          {
            id: 'c1',
            text: 'Good choice',
            effects: { teamTrust: 10 },
            competencyScores: { facilitation: 2 },
            feedback: 'Well done.',
            nextSceneId: 'scene2',
            scrumPrinciple: 'Empiricism',
          },
          {
            id: 'c_bad',
            text: 'Bad choice',
            effects: { teamTrust: -10 },
            competencyScores: { facilitation: -2 },
            feedback: 'Not good.',
            nextSceneId: 'scene2',
          },
        ],
      },
      scene2: {
        id: 'scene2',
        type: 'event',
        title: 'Scene 2',
        narrative: 'Scene 2 narrative',
        characters: [],
        choices: [
          {
            id: 'c_end',
            text: 'End choice',
            effects: {},
            competencyScores: { facilitation: 1 },
            feedback: 'Sprint done.',
            nextSceneId: 'END',
          },
        ],
      },
    },
  }
  return { mockScenario }
})

vi.mock('../data/scenarios', () => ({
  scenarios: [mockScenario],
}))

// Import AFTER mocking
import { useSimulationStore } from './simulationStore'

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
})

describe('startSimulation', () => {
  it('sets status to playing after startSimulation with valid id', () => {
    useSimulationStore.getState().startSimulation('scenario-01')
    expect(useSimulationStore.getState().status).toBe('playing')
  })

  it('sets currentScene to the start scene', () => {
    useSimulationStore.getState().startSimulation('scenario-01')
    expect(useSimulationStore.getState().currentScene?.id).toBe('briefing')
  })

  it('does nothing if scenarioId does not exist', () => {
    useSimulationStore.getState().startSimulation('nonexistent')
    expect(useSimulationStore.getState().status).toBe('idle')
  })
})

describe('makeChoice', () => {
  beforeEach(() => {
    useSimulationStore.getState().startSimulation('scenario-01')
  })

  it('sets status to awaiting_feedback', () => {
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0])
    expect(useSimulationStore.getState().status).toBe('awaiting_feedback')
  })

  it('records choice in history', () => {
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0])
    expect(useSimulationStore.getState().history).toHaveLength(1)
  })

  it('applies effects to stateVars', () => {
    const scene = useSimulationStore.getState().currentScene!
    const before = useSimulationStore.getState().stateVars.teamTrust
    useSimulationStore.getState().makeChoice(scene.choices[0]) // effects: { teamTrust: 10 }
    expect(useSimulationStore.getState().stateVars.teamTrust).toBe(before + 10)
  })

  it('sets pendingFeedback with text', () => {
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0])
    expect(useSimulationStore.getState().pendingFeedback?.text).toBe('Well done.')
  })

  it('accumulates competencyScores', () => {
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0]) // facilitation: +2
    expect(useSimulationStore.getState().competencyScores.facilitation).toBe(2)
  })
})

describe('dismissFeedback', () => {
  beforeEach(() => {
    useSimulationStore.getState().startSimulation('scenario-01')
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0])
  })

  it('advances currentScene to the next scene', () => {
    useSimulationStore.getState().dismissFeedback()
    expect(useSimulationStore.getState().currentScene?.id).toBe('scene2')
  })

  it('sets status back to playing', () => {
    useSimulationStore.getState().dismissFeedback()
    expect(useSimulationStore.getState().status).toBe('playing')
  })

  it('clears pendingFeedback', () => {
    useSimulationStore.getState().dismissFeedback()
    expect(useSimulationStore.getState().pendingFeedback).toBeNull()
  })

  it('sets status to finished when last choice leads to END', () => {
    // dismiss first, advance to scene2
    useSimulationStore.getState().dismissFeedback()
    // make the END choice in scene2
    const scene2 = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene2.choices[0]) // nextSceneId: 'END'
    useSimulationStore.getState().dismissFeedback()
    expect(useSimulationStore.getState().status).toBe('finished')
  })

  it('sets debriefResult when finished', () => {
    useSimulationStore.getState().dismissFeedback()
    const scene2 = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene2.choices[0])
    useSimulationStore.getState().dismissFeedback()
    expect(useSimulationStore.getState().debriefResult).not.toBeNull()
  })
})

describe('resetSimulation', () => {
  it('returns status to idle', () => {
    useSimulationStore.getState().startSimulation('scenario-01')
    useSimulationStore.getState().resetSimulation()
    expect(useSimulationStore.getState().status).toBe('idle')
  })

  it('clears history', () => {
    useSimulationStore.getState().startSimulation('scenario-01')
    const scene = useSimulationStore.getState().currentScene!
    useSimulationStore.getState().makeChoice(scene.choices[0])
    useSimulationStore.getState().resetSimulation()
    expect(useSimulationStore.getState().history).toHaveLength(0)
  })
})
