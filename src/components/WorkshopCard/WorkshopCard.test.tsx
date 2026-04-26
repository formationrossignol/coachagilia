import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { WorkshopCard } from '.'
import type { WorkshopDefinition } from '../../data/workshops/types'

const mockWorkshop: WorkshopDefinition = {
  id: 'test',
  slug: 'test',
  title: 'Test Workshop',
  route: '/ateliers/test',
  categorySlug: 'facilitation',
  toolName: 'Test Tool',
  level: 'intermediate',
  durationMinutes: 15,
  interactionType: 'drag-and-drop',
  summary: 'Test summary',
}

describe('WorkshopCard', () => {
  it('renders title and summary', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText('Test Workshop')).toBeInTheDocument()
    expect(screen.getByText('Test summary')).toBeInTheDocument()
  })

  it('renders launch link to workshop route', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /Lancer/ })).toHaveAttribute('href', '/ateliers/test')
  })

  it('shows duration in minutes', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText(/15 min/)).toBeInTheDocument()
  })

  it('shows Bientôt badge and no launch link for coming soon', () => {
    const cs: WorkshopDefinition = { ...mockWorkshop, comingSoon: true }
    render(<MemoryRouter><WorkshopCard workshop={cs} /></MemoryRouter>)
    expect(screen.getByText('Bientôt')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Lancer/ })).not.toBeInTheDocument()
  })

  it('shows level badge', () => {
    render(<MemoryRouter><WorkshopCard workshop={mockWorkshop} /></MemoryRouter>)
    expect(screen.getByText('Intermédiaire')).toBeInTheDocument()
  })
})
