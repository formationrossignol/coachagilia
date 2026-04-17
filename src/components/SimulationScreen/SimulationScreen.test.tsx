import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SimulationScreen } from './index'
import { useSimulationStore } from '../../store/simulationStore'

function renderSimulation(scenarioId = 'scenario-01') {
  return render(
    <MemoryRouter initialEntries={[`/simulation/${scenarioId}`]}>
      <Routes>
        <Route path="/simulation/:id" element={<SimulationScreen />} />
        <Route path="/debrief" element={<div>Debrief</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useSimulationStore.getState().resetSimulation()
})

describe('SimulationScreen', () => {
  it('renders the first scene narrative', () => {
    renderSimulation()
    expect(screen.getByText(/Digify/i)).toBeInTheDocument()
  })

  it('renders at least 3 choice buttons', () => {
    renderSimulation()
    // choices are buttons, "Continuer" only appears after a choice
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('shows feedback text after making a choice', async () => {
    renderSimulation()
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    // feedback text appears — we check the "Continuer" button which only shows during feedback
    expect(screen.getByRole('button', { name: /continuer/i })).toBeInTheDocument()
  })

  it('advances to next scene after dismissing feedback', async () => {
    renderSimulation()
    const buttons = screen.getAllByRole('button')
    await userEvent.click(buttons[0])
    const continueBtn = screen.getByRole('button', { name: /continuer/i })
    await userEvent.click(continueBtn)
    // After dismissing, we should be on Sprint Planning scene
    expect(screen.getAllByText(/Sprint Planning/i).length).toBeGreaterThan(0)
  })
})
