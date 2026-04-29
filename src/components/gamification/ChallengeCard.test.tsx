import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChallengeCard } from './ChallengeCard'
import { WEEKLY_CHALLENGES } from '../../features/gamification'

const challenge = WEEKLY_CHALLENGES[0]

describe('ChallengeCard', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('renders challenge title', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(challenge.title)).toBeInTheDocument()
  })

  it('renders challenge description', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(challenge.description)).toBeInTheDocument()
  })

  it('shows XP reward', () => {
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(`+${challenge.xpReward} XP`)).toBeInTheDocument()
  })

  it('shows completed badge when completed', () => {
    render(<ChallengeCard challenge={challenge} completed={true} />)
    expect(screen.getByText(/complété/i)).toBeInTheDocument()
  })

  it('applies completed class when completed', () => {
    const { container } = render(<ChallengeCard challenge={challenge} completed={true} />)
    expect(container.querySelector('.challenge-card--completed')).toBeInTheDocument()
  })

  it('shows countdown when not completed', () => {
    // Wednesday (day=3) → 5 days until next Monday
    vi.setSystemTime(new Date('2026-04-29T10:00:00Z'))  // Wednesday
    render(<ChallengeCard challenge={challenge} completed={false} />)
    expect(screen.getByText(/jours? restant/i)).toBeInTheDocument()
  })
})
