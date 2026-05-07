import { describe, it, expect } from 'vitest'
import { BADGES, checkBadgeCriteria } from './badges'
import type { GamificationEvent, Artifact } from './types'

function makeQuizEvent(slug: string, score: number): GamificationEvent {
  return { id: slug, type: 'QUIZ_COMPLETED', contentSlug: slug, xpAwarded: 80, score, createdAt: new Date().toISOString() }
}

function makeCompletedEvent(contentSlug: string, score?: number): GamificationEvent {
  return {
    id: crypto.randomUUID(),
    type: 'WORKSHOP_COMPLETED',
    contentSlug,
    xpAwarded: 100,
    score,
    createdAt: new Date().toISOString(),
  }
}

describe('BADGES', () => {
  it('exports 13 badge definitions', () => {
    expect(BADGES).toHaveLength(13)
  })

  it('each badge has a unique id', () => {
    const ids = BADGES.map(b => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('checkBadgeCriteria', () => {
  describe('conflict-mediator badge', () => {
    const badge = BADGES.find(b => b.id === 'conflict-mediator')!

    it('returns false when required content not completed', () => {
      const events = [makeCompletedEvent('thomas-kilmann', 80)]
      expect(checkBadgeCriteria(badge, events, [])).toBe(false)
    })

    it('returns false when all content completed but score too low', () => {
      const events = [
        makeCompletedEvent('thomas-kilmann', 70),
        makeCompletedEvent('ladder-of-inference', 70),
        makeCompletedEvent('nonviolent-communication', 70),
      ]
      expect(checkBadgeCriteria(badge, events, [])).toBe(false)
    })

    it('returns true when all content completed with sufficient average score', () => {
      const events = [
        makeCompletedEvent('thomas-kilmann', 80),
        makeCompletedEvent('ladder-of-inference', 80),
        makeCompletedEvent('nonviolent-communication', 80),
      ]
      expect(checkBadgeCriteria(badge, events, [])).toBe(true)
    })

    it('returns false when all content completed but no events have a score', () => {
      const events = [
        makeCompletedEvent('thomas-kilmann'),
        makeCompletedEvent('ladder-of-inference'),
        makeCompletedEvent('nonviolent-communication'),
      ]
      expect(checkBadgeCriteria(badge, events, [])).toBe(false)
    })
  })

  describe('feedback-crafter badge', () => {
    const badge = BADGES.find(b => b.id === 'feedback-crafter')!

    it('returns false when content completed but not enough artifacts', () => {
      const events = [
        makeCompletedEvent('sbi'),
        makeCompletedEvent('desc'),
        makeCompletedEvent('feedforward'),
      ]
      const artifacts: Artifact[] = [
        { id: '1', title: 'Test', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {}, createdAt: '', updatedAt: '' },
      ]
      expect(checkBadgeCriteria(badge, events, artifacts)).toBe(false)
    })

    it('returns true when content completed and enough artifacts', () => {
      const events = [
        makeCompletedEvent('sbi'),
        makeCompletedEvent('desc'),
        makeCompletedEvent('feedforward'),
      ]
      const artifacts: Artifact[] = [
        { id: '1', title: 'Test 1', type: 'feedback_sbi', sourceContentSlug: 'sbi', data: {}, createdAt: '', updatedAt: '' },
        { id: '2', title: 'Test 2', type: 'desc_message', sourceContentSlug: 'desc', data: {}, createdAt: '', updatedAt: '' },
      ]
      expect(checkBadgeCriteria(badge, events, artifacts)).toBe(true)
    })
  })
})

describe('cert badge — minScoreOnAny', () => {
  const psmBadge = BADGES.find(b => b.id === 'psm-certified')!

  it('unlocks when score >= 85 on any PSM exam', () => {
    const events = [makeQuizEvent('psm-full-1', 90)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(true)
  })

  it('does not unlock when score < 85', () => {
    const events = [makeQuizEvent('psm-full-1', 70)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(false)
  })

  it('does not unlock when no PSM exam attempted', () => {
    const events = [makeQuizEvent('pspo-full-1', 95)]
    expect(checkBadgeCriteria(psmBadge, events, [])).toBe(false)
  })

  it('all 4 cert badges exist in BADGES', () => {
    expect(BADGES.find(b => b.id === 'psm-certified')).toBeDefined()
    expect(BADGES.find(b => b.id === 'pspo-certified')).toBeDefined()
    expect(BADGES.find(b => b.id === 'pmi-acp-certified')).toBeDefined()
    expect(BADGES.find(b => b.id === 'safe-certified')).toBeDefined()
  })
})
