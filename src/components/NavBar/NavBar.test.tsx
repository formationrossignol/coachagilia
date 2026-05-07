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

  it('renders Simulation, Certifications and Ateliers links', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /simulation/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /certifications/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ateliers/i })).toBeInTheDocument()
  })

  it('marks the active link with aria-current="page"', () => {
    renderWithRouter('/certifications')
    const certificationsLink = screen.getByRole('link', { name: /certifications/i })
    expect(certificationsLink).toHaveAttribute('aria-current', 'page')
  })

  it('renders a Progression nav link to /progress', () => {
    render(<MemoryRouter><NavBar /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /progression/i })
    expect(link).toHaveAttribute('href', '/progress')
  })
})
