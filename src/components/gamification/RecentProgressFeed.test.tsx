import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentProgressFeed } from './RecentProgressFeed'
import type { GamificationEvent } from '../../features/gamification'

function makeEvent(overrides: Partial<GamificationEvent> = {}): GamificationEvent {
  return {
    id: crypto.randomUUID(),
    type: 'WORKSHOP_COMPLETED',
    xpAwarded: 100,
    contentSlug: 'thomas-kilmann',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('RecentProgressFeed', () => {
  it('renders empty state when no events', () => {
    render(<RecentProgressFeed events={[]} />)
    expect(screen.getByText(/aucune activité/i)).toBeInTheDocument()
  })

  it('shows last 10 events in reverse chronological order', () => {
    const events = Array.from({ length: 12 }, (_, i) =>
      makeEvent({ id: String(i), xpAwarded: i + 1, contentSlug: `slug-${i}` })
    )
    const { container } = render(<RecentProgressFeed events={events} />)
    const items = container.querySelectorAll('.progress-feed__item')
    expect(items).toHaveLength(10)
  })

  it('shows +XP for each event', () => {
    render(<RecentProgressFeed events={[makeEvent({ xpAwarded: 150 })]} />)
    expect(screen.getByText('+150 XP')).toBeInTheDocument()
  })
})
