import { describe, it, expect } from 'vitest'
import { applyChoice, resolveNextScene } from './simulator'
import type { StateVariables, Choice, Scenario } from './types'

const baseState: StateVariables = {
  teamTrust: 50,
  goalClarity: 50,
  sprintFocus: 50,
  productQuality: 50,
  techDebt: 50,
  poEngagement: 50,
  psychologicalSafety: 50,
  scrumMaturity: 50,
}

const mockChoice: Choice = {
  id: 'c1',
  text: 'Test choice',
  effects: { teamTrust: 20, goalClarity: -10 },
  competencyScores: { facilitation: 2 },
  feedback: 'Good choice',
  nextSceneId: 'scene2',
}

const mockScenario: Scenario = {
  id: 's1',
  title: 'Test',
  theme: 'Test',
  level: 'debutant',
  estimatedDuration: '10 min',
  targetCompetencies: ['facilitation'],
  initialState: baseState,
  startSceneId: 'scene1',
  characters: {},
  scenes: {
    scene2: {
      id: 'scene2',
      type: 'event',
      title: 'Scene 2',
      narrative: 'A test scene',
      characters: [],
      choices: [],
    },
  },
}

describe('applyChoice', () => {
  it('applies positive and negative deltas', () => {
    const result = applyChoice(baseState, mockChoice)
    expect(result.teamTrust).toBe(70)
    expect(result.goalClarity).toBe(40)
  })

  it('clamps values at 100 maximum', () => {
    const result = applyChoice({ ...baseState, teamTrust: 95 }, { ...mockChoice, effects: { teamTrust: 20 } })
    expect(result.teamTrust).toBe(100)
  })

  it('clamps values at 0 minimum', () => {
    const result = applyChoice({ ...baseState, goalClarity: 5 }, { ...mockChoice, effects: { goalClarity: -20 } })
    expect(result.goalClarity).toBe(0)
  })

  it('does not mutate the original state', () => {
    applyChoice(baseState, mockChoice)
    expect(baseState.teamTrust).toBe(50)
  })

  it('preserves variables not mentioned in effects', () => {
    const result = applyChoice(baseState, mockChoice)
    expect(result.sprintFocus).toBe(50)
    expect(result.techDebt).toBe(50)
  })
})

describe('resolveNextScene', () => {
  it('returns the scene referenced by nextSceneId', () => {
    const result = resolveNextScene(mockScenario, mockChoice)
    expect(result?.id).toBe('scene2')
  })

  it('returns null when nextSceneId is END', () => {
    const endChoice: Choice = { ...mockChoice, nextSceneId: 'END' }
    expect(resolveNextScene(mockScenario, endChoice)).toBeNull()
  })

  it('returns null when nextSceneId does not exist in scenario', () => {
    const badChoice: Choice = { ...mockChoice, nextSceneId: 'nonexistent' }
    expect(resolveNextScene(mockScenario, badChoice)).toBeNull()
  })
})
