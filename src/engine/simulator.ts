import type { StateVariables, Choice, Scenario, Scene } from './types'

export function applyChoice(state: StateVariables, choice: Choice): StateVariables {
  const next = { ...state }
  for (const [key, delta] of Object.entries(choice.effects) as [keyof StateVariables, number][]) {
    next[key] = Math.max(0, Math.min(100, state[key] + delta))
  }
  return next
}

export function resolveNextScene(scenario: Scenario, choice: Choice): Scene | null {
  if (choice.nextSceneId === 'END') return null
  return scenario.scenes[choice.nextSceneId] ?? null
}
