import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './index'

describe('Home', () => {
  it('renders the training desk hero and situation of the day', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Devenez plus solide quand Scrum devient difficile/i })).toBeInTheDocument()
    expect(screen.getByText(/Un simulateur d’entraînement/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Sprint Review sous tension/i })).toBeInTheDocument()
  })

  it('renders the required primary sections', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Reprendre votre entraînement/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Un board de pratique/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Des réflexes terrain observables/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Des plans courts/i })).toBeInTheDocument()
  })

  it('links to the daily simulation and paths', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /Lancer la situation du jour/i })).toHaveAttribute('href', '/simulation')
    expect(screen.getByRole('link', { name: /Voir les parcours/i })).toHaveAttribute('href', '/paths')
  })
})
