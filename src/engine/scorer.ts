import type { CompetencyId, CompetencyResult, ChoiceRecord, DebriefResult, Scenario } from './types'

function computeCompetencyBounds(
  scenario: Scenario,
  history: ChoiceRecord[]
): Partial<Record<CompetencyId, { min: number; max: number }>> {
  const bounds: Partial<Record<CompetencyId, { min: number; max: number }>> = {}

  for (const record of history) {
    const scene = scenario.scenes[record.sceneId]
    if (!scene) continue

    // Discover all competency IDs touched in this scene
    for (const choice of scene.choices) {
      for (const compId of Object.keys(choice.competencyScores) as CompetencyId[]) {
        if (!bounds[compId]) bounds[compId] = { min: 0, max: 0 }
      }
    }

    // Accumulate max and min across the choices of this visited scene
    for (const compId of Object.keys(bounds) as CompetencyId[]) {
      const sceneScores = scene.choices.map(c => c.competencyScores[compId] ?? 0)
      if (sceneScores.length > 0) {
        bounds[compId]!.max += Math.max(...sceneScores)
        bounds[compId]!.min += Math.min(...sceneScores)
      }
    }
  }

  return bounds
}

function totalScore(record: ChoiceRecord): number {
  return Object.values(record.competencyScores).reduce((sum, v) => sum + (v ?? 0), 0)
}

export function computeDebrief(
  scenario: Scenario,
  history: ChoiceRecord[],
  competencyScores: Record<CompetencyId, number>
): DebriefResult {
  const bounds = computeCompetencyBounds(scenario, history)

  const competencyResults: Partial<Record<CompetencyId, CompetencyResult>> = {}

  for (const id of scenario.targetCompetencies) {
    const raw = competencyScores[id] ?? 0
    const { min, max } = bounds[id] ?? { min: 0, max: 1 }
    const normalized = max === min ? 50 : Math.round(((raw - min) / (max - min)) * 100)
    const score = Math.max(0, Math.min(100, normalized))
    competencyResults[id] = {
      score,
      level: score < 40 ? 'debutant' : score < 70 ? 'en_progression' : 'maitrise',
    }
  }

  const scores = Object.values(competencyResults).map(r => r!.score)
  const globalScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  const sorted = [...history].sort((a, b) => totalScore(b) - totalScore(a))
  const bestDecisions = sorted.slice(0, 2)
  const riskyDecisions = [...history].sort((a, b) => totalScore(a) - totalScore(b)).slice(0, 2)

  const scrumPrinciples = [...new Set(
    history.filter(r => r.scrumPrinciple).map(r => r.scrumPrinciple!)
  )]

  return { globalScore, competencyResults, bestDecisions, riskyDecisions, scrumPrinciples }
}
