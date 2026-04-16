import { describe, it, expect } from 'vitest'
import { computeDebrief } from './scorer'
import type { Scenario, ChoiceRecord, StateVariables } from './types'

const baseState: StateVariables = {
  teamTrust: 50, goalClarity: 50, sprintFocus: 50, productQuality: 50,
  techDebt: 50, poEngagement: 50, psychologicalSafety: 50, scrumMaturity: 50,
}

const mockScenario: Scenario = {
  id: 's1', title: 'Test', theme: 'Test', level: 'debutant',
  estimatedDuration: '10 min', targetCompetencies: ['facilitation'],
  initialState: baseState, startSceneId: 'scene1', characters: {},
  scenes: {
    scene1: {
      id: 'scene1', type: 'briefing', title: 'Scene 1', narrative: '', characters: [],
      choices: [
        { id: 'best', text: '', effects: {}, competencyScores: { facilitation: 3 }, feedback: '', nextSceneId: 'END' },
        { id: 'ok',   text: '', effects: {}, competencyScores: { facilitation: 1 }, feedback: '', nextSceneId: 'END' },
        { id: 'bad',  text: '', effects: {}, competencyScores: { facilitation: -3 }, feedback: '', nextSceneId: 'END' },
      ],
    },
  },
}

const bestRecord: ChoiceRecord = {
  sceneId: 'scene1', sceneTitle: 'Scene 1', choiceId: 'best',
  choiceText: 'Best', competencyScores: { facilitation: 3 },
  feedback: 'Great', scrumPrinciple: 'Inspect and Adapt', nextSceneId: 'END',
}

const badRecord: ChoiceRecord = {
  sceneId: 'scene1', sceneTitle: 'Scene 1', choiceId: 'bad',
  choiceText: 'Bad', competencyScores: { facilitation: -3 },
  feedback: 'Poor', nextSceneId: 'END',
}

describe('computeDebrief', () => {
  it('returns 100 global score when best choice taken', () => {
    const result = computeDebrief(mockScenario, [bestRecord], { facilitation: 3, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.globalScore).toBe(100)
  })

  it('returns 0 global score when worst choice taken', () => {
    const result = computeDebrief(mockScenario, [badRecord], { facilitation: -3, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.globalScore).toBe(0)
  })

  it('identifies the best decision (highest total competency delta)', () => {
    const result = computeDebrief(mockScenario, [bestRecord, badRecord], { facilitation: 0, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.bestDecisions[0].choiceId).toBe('best')
  })

  it('identifies risky decision (lowest total competency delta)', () => {
    const result = computeDebrief(mockScenario, [bestRecord, badRecord], { facilitation: 0, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.riskyDecisions[0].choiceId).toBe('bad')
  })

  it('collects unique scrum principles from history', () => {
    const result = computeDebrief(mockScenario, [bestRecord], { facilitation: 3, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.scrumPrinciples).toContain('Inspect and Adapt')
  })

  it('returns empty scrumPrinciples when none in history', () => {
    const result = computeDebrief(mockScenario, [badRecord], { facilitation: -3, protection: 0, conflict: 0, flow: 0, po_coaching: 0, org_improvement: 0, scrum_knowledge: 0 })
    expect(result.scrumPrinciples).toHaveLength(0)
  })
})
