import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getActiveChallenge, isChallengeCompletedBy, WEEKLY_CHALLENGES } from './challenges'
import type { GamificationEvent, Artifact } from './types'

afterEach(() => {
  vi.useRealTimers()
})

describe('getActiveChallenge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns a WeeklyChallenge', () => {
    const challenge = getActiveChallenge()
    expect(challenge).toHaveProperty('id')
    expect(challenge).toHaveProperty('xpReward')
    expect(challenge).toHaveProperty('criteria')
  })

  it('rotates weekly — week 0 and week 1 differ when there are at least 2 challenges', () => {
    // Week 0: epoch (1970-01-01)
    vi.setSystemTime(new Date(0))
    const week0 = getActiveChallenge()

    // Week 1: 7 days later
    vi.setSystemTime(new Date(7 * 24 * 60 * 60 * 1000))
    const week1 = getActiveChallenge()

    expect(week0.id).not.toBe(week1.id)
  })

  it('wraps around after all challenges have been shown', () => {
    vi.setSystemTime(new Date(0))
    const first = getActiveChallenge()

    // Advance by total number of challenges * 7 days
    vi.setSystemTime(new Date(WEEKLY_CHALLENGES.length * 7 * 24 * 60 * 60 * 1000))
    const wrapped = getActiveChallenge()

    expect(first.id).toBe(wrapped.id)
  })
})

describe('isChallengeCompletedBy — complete_content', () => {
  const challenge = WEEKLY_CHALLENGES.find(c => c.criteria.type === 'complete_content')!

  it('returns false when content not completed', () => {
    expect(isChallengeCompletedBy(challenge, [], [])).toBe(false)
  })

  it('returns true when content is completed', () => {
    const slug = (challenge.criteria as { type: 'complete_content'; contentSlug: string }).contentSlug
    const events: GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: slug,
      xpAwarded: 100, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(true)
  })
})

describe('isChallengeCompletedBy — complete_skill_activities', () => {
  const challenge = WEEKLY_CHALLENGES.find(c => c.criteria.type === 'complete_skill_activities')!

  it('returns false when fewer than required activities completed', () => {
    const events: GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'troika-consulting',
      xpAwarded: 100, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(false)
  })

  it('returns true when enough skill activities completed', () => {
    const events: GamificationEvent[] = [
      { id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'troika-consulting', xpAwarded: 100, createdAt: new Date().toISOString() },
      { id: '2', type: 'WORKSHOP_COMPLETED', contentSlug: 'facilitation-canvas', xpAwarded: 100, createdAt: new Date().toISOString() },
    ]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(true)
  })
})

describe('isChallengeCompletedBy — create_artifact', () => {
  const challenge = WEEKLY_CHALLENGES.find(c => c.criteria.type === 'create_artifact')!

  it('returns false when no artifacts exist', () => {
    expect(isChallengeCompletedBy(challenge, [], [])).toBe(false)
  })

  it('returns true when matching artifact exists', () => {
    const artifactType = (challenge.criteria as { type: 'create_artifact'; artifactType: import('./types').ArtifactType }).artifactType
    const artifacts: import('./types').Artifact[] = [{
      id: '1', title: 'Test', type: artifactType,
      sourceContentSlug: 'sbi', data: {}, createdAt: '', updatedAt: '',
    }]
    expect(isChallengeCompletedBy(challenge, [], artifacts)).toBe(true)
  })
})

describe('isChallengeCompletedBy — score_at_least', () => {
  const challenge: import('./types').WeeklyChallenge = {
    id: 'test-score', title: 'Score test', description: 'test',
    skillArea: 'feedback',
    criteria: { type: 'score_at_least', contentSlug: 'sbi', score: 80 },
    xpReward: 100,
  }

  it('returns false when score is below threshold', () => {
    const events: import('./types').GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'sbi',
      xpAwarded: 100, score: 70, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(false)
  })

  it('returns true when score meets threshold', () => {
    const events: import('./types').GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'sbi',
      xpAwarded: 100, score: 80, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(true)
  })

  it('returns false when content slug does not match', () => {
    const events: import('./types').GamificationEvent[] = [{
      id: '1', type: 'WORKSHOP_COMPLETED', contentSlug: 'grow-model',
      xpAwarded: 100, score: 90, createdAt: new Date().toISOString(),
    }]
    expect(isChallengeCompletedBy(challenge, events, [])).toBe(false)
  })
})
