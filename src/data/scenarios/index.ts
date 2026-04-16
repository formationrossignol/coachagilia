import { scenario01 } from './scenario-01-new-team'
import { scenario02 } from './scenario-02-daily-dysfunction'
import { scenario03 } from './scenario-03-debt-or-demo'
import type { Scenario } from '../../engine/types'

export const scenarios: Scenario[] = [scenario01, scenario02, scenario03]

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id)
}
