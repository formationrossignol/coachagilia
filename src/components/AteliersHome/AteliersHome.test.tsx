import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AteliersHome } from './index'

describe('AteliersHome', () => {
  it('renders at least one atelier card', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
  })

  it('shows the Scrum Guide atelier card', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    expect(screen.getByText(/le cadre scrum/i)).toBeInTheDocument()
  })

  it('links to /ateliers/scrum-guide', () => {
    render(<MemoryRouter><AteliersHome /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /démarrer/i })
    expect(link).toHaveAttribute('href', '/ateliers/scrum-guide')
  })
})
