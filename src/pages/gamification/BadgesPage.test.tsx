import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgesPage } from './BadgesPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getUnlockedBadgeIds: () => [],
    events: [],
  }),
  BADGES: [
    { id: 'b1', name: 'Test Badge', description: 'Desc', skillArea: 'conflict', criteria: {} },
  ],
}))

describe('BadgesPage', () => {
  it('renders page title', () => {
    render(<BadgesPage />)
    expect(screen.getByText(/badges/i)).toBeInTheDocument()
  })

  it('renders the badge', () => {
    render(<BadgesPage />)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })
})
