import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScenarioSelector } from './index'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <ScenarioSelector />
    </MemoryRouter>
  )
}

describe('ScenarioSelector', () => {
  it('renders 3 scenario cards', () => {
    renderWithRouter()
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('displays the title of each scenario', () => {
    renderWithRouter()
    expect(screen.getByText('Premier Sprint')).toBeInTheDocument()
    expect(screen.getByText('La Daily qui tue')).toBeInTheDocument()
    expect(screen.getByText('Dette ou démo')).toBeInTheDocument()
  })

  it('renders a Jouer button for each scenario', () => {
    renderWithRouter()
    expect(screen.getAllByRole('button', { name: /jouer/i })).toHaveLength(3)
  })
})
