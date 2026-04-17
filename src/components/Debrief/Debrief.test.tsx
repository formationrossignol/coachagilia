import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Debrief } from './index'
import { useSimulationStore } from '../../store/simulationStore'

async function playThrough() {
  useSimulationStore.getState().startSimulation('scenario-01')
  let safety = 0
  while (useSimulationStore.getState().status !== 'finished' && safety < 30) {
    const state = useSimulationStore.getState()
    if (state.status === 'playing') {
      state.makeChoice(state.currentScene!.choices[0])
    } else if (state.status === 'awaiting_feedback') {
      state.dismissFeedback()
    }
    safety++
  }
}

beforeEach(async () => {
  await playThrough()
})

function renderDebrief() {
  return render(
    <MemoryRouter>
      <Debrief />
    </MemoryRouter>
  )
}

describe('Debrief', () => {
  it('renders the Score global heading', () => {
    renderDebrief()
    expect(screen.getByRole('heading', { name: /score global/i })).toBeInTheDocument()
  })

  it('renders competency labels for target competencies of scenario-01', () => {
    renderDebrief()
    // scenario-01 targets: scrum_knowledge, facilitation, po_coaching
    expect(screen.getByText(/Facilitation/i)).toBeInTheDocument()
  })

  it('renders Points forts section', () => {
    renderDebrief()
    expect(screen.getByText(/points forts/i)).toBeInTheDocument()
  })

  it('renders a Rejouer button', () => {
    renderDebrief()
    expect(screen.getByRole('button', { name: /rejouer/i })).toBeInTheDocument()
  })
})
