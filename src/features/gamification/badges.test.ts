import { describe, it, expect } from 'vitest'
import { BADGES, checkBadgeCriteria } from './badges'
import type { GamificationEvent, Artifact } from './types'

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
  it('exports 9 badge definitions', () => {
    expect(BADGES).toHaveLength(9)
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
