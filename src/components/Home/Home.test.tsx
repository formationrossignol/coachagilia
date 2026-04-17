import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './index'

describe('Home', () => {
  it('renders three section cards', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('displays Simulation, Quiz PSM-1 and Ateliers cards', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText(/simulation/i)).toBeInTheDocument()
    expect(screen.getByText(/quiz psm-1/i)).toBeInTheDocument()
    expect(screen.getByText(/ateliers/i)).toBeInTheDocument()
  })

  it('renders links to /simulation, /quiz and /ateliers', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/simulation')
    expect(hrefs).toContain('/quiz')
    expect(hrefs).toContain('/ateliers')
  })
})
