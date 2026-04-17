import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StateIndicators } from './index'
import { useSimulationStore } from '../../store/simulationStore'

beforeEach(() => {
  useSimulationStore.getState().startSimulation('scenario-01')
})

describe('StateIndicators', () => {
  it('renders 8 progress bars', () => {
    render(<StateIndicators />)
    expect(screen.getAllByRole('progressbar')).toHaveLength(8)
  })

  it('renders the Confiance équipe label', () => {
    render(<StateIndicators />)
    expect(screen.getByText('Confiance équipe')).toBeInTheDocument()
  })
})
