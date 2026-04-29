import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgeCard } from './BadgeCard'
import type { BadgeDefinition } from '../../features/gamification'

const mockBadge: BadgeDefinition = {
  id: 'conflict-mediator',
  name: 'Médiateur en progression',
  description: 'Maîtrise des conflits.',
  skillArea: 'conflict',
  criteria: {
    completedContent: ['thomas-kilmann', 'ladder-of-inference'],
    minAverageScore: 75,
  },
}

describe('BadgeCard', () => {
  it('renders badge name', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText('Médiateur en progression')).toBeInTheDocument()
  })

  it('shows unlock date when unlockedAt is provided', () => {
    render(<BadgeCard badge={mockBadge} unlockedAt="2026-04-29T10:00:00.000Z" />)
    expect(screen.getByText(/débloqué le/i)).toBeInTheDocument()
  })

  it('shows criteria when locked', () => {
    render(<BadgeCard badge={mockBadge} />)
    expect(screen.getByText(/thomas-kilmann/i)).toBeInTheDocument()
    expect(screen.getByText(/75%/)).toBeInTheDocument()
  })

  it('applies locked class when no unlockedAt', () => {
    const { container } = render(<BadgeCard badge={mockBadge} />)
    expect(container.querySelector('.badge-card--locked')).toBeInTheDocument()
  })

  it('does not apply locked class when unlockedAt is provided', () => {
    const { container } = render(<BadgeCard badge={mockBadge} unlockedAt="2026-04-29T10:00:00.000Z" />)
    expect(container.querySelector('.badge-card--locked')).toBeNull()
  })
})
