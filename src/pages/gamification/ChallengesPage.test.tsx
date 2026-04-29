import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChallengesPage } from './ChallengesPage'

const mockChallenge = {
  id: 'ch-1', title: 'Défi Test', description: 'Desc', skillArea: 'coaching',
  criteria: { type: 'complete_content', contentSlug: 'sbi' }, xpReward: 150,
}

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    getActiveChallenge: () => mockChallenge,
    isChallengeCompleted: () => false,
  }),
}))

describe('ChallengesPage', () => {
  it('renders page title', () => {
    render(<ChallengesPage />)
    expect(screen.getByRole('heading', { name: /défi/i, level: 1 })).toBeInTheDocument()
  })

  it('renders the active challenge title', () => {
    render(<ChallengesPage />)
    expect(screen.getByText('Défi Test')).toBeInTheDocument()
  })
})
