import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavBar } from './index'

function renderWithRouter(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
    </MemoryRouter>
  )
}

describe('NavBar', () => {
  it('renders the app title link', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /scrum master sim/i })).toBeInTheDocument()
  })

  it('renders Simulation, Quiz PSM-1 and Ateliers links', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /simulation/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /quiz psm-1/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ateliers/i })).toBeInTheDocument()
  })

  it('marks the active link with aria-current="page"', () => {
    renderWithRouter('/quiz')
    const quizLink = screen.getByRole('link', { name: /quiz psm-1/i })
    expect(quizLink).toHaveAttribute('aria-current', 'page')
  })
})
