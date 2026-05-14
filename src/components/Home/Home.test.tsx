import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './index'

describe('Home', () => {
  it('renders three mode cards', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Devenez plus solide quand Scrum devient difficile/i })).toBeInTheDocument()
    expect(screen.getByText(/Un simulateur d’entraînement/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Sprint Review sous tension/i })).toBeInTheDocument()
  })

  it('displays the redesigned training modes and immersive hero', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Mode Simulation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Mode Certification/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Mode Atelier/i })).toBeInTheDocument()
    expect(screen.getByText(/Sprint Review sous tension/i)).toBeInTheDocument()
  })

  it('renders primary navigation links for simulation, certifications and workshops', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/simulation')
    expect(hrefs).toContain('/certifications')
    expect(hrefs).toContain('/ateliers')
  })
})
