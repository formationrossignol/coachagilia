import { describe, it, expect } from 'vitest'
import { getMasteryLevel, computeSkillXp, computeSkillImpacts } from './mastery'
import type { GamificationEvent } from './types'

describe('getMasteryLevel', () => {
  it('returns discovery for 0 xp', () => {
    expect(getMasteryLevel(0)).toBe('discovery')
  })

  it('returns discovery for 299 xp', () => {
    expect(getMasteryLevel(299)).toBe('discovery')
  })

  it('returns practice at 300 xp', () => {
    expect(getMasteryLevel(300)).toBe('practice')
  })

  it('returns proficiency at 900 xp', () => {
    expect(getMasteryLevel(900)).toBe('proficiency')
  })

  it('returns field_application at 1800 xp', () => {
    expect(getMasteryLevel(1800)).toBe('field_application')
  })

  it('returns transmission at 3000 xp', () => {
    expect(getMasteryLevel(3000)).toBe('transmission')
  })

  it('returns transmission above 3000 xp', () => {
    expect(getMasteryLevel(5000)).toBe('transmission')
  })

  it('returns practice for 899 xp (below proficiency)', () => {
    expect(getMasteryLevel(899)).toBe('practice')
  })

  it('returns proficiency for 1799 xp (below field_application)', () => {
    expect(getMasteryLevel(1799)).toBe('proficiency')
  })

  it('returns field_application for 2999 xp (below transmission)', () => {
    expect(getMasteryLevel(2999)).toBe('field_application')
  })
})

describe('computeSkillXp', () => {
  it('returns empty object for empty event log', () => {
    expect(computeSkillXp([])).toEqual({})
  })

  it('sums skillImpacts across events', () => {
    const events: GamificationEvent[] = [
      {
        id: '1',
        type: 'WORKSHOP_COMPLETED',
        xpAwarded: 100,
        skillImpacts: { conflict: 70, communication: 20, leadership: 10 },
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        type: 'WORKSHOP_COMPLETED',
        xpAwarded: 100,
        skillImpacts: { conflict: 50, communication: 40 },
        createdAt: '2024-01-02T00:00:00.000Z',
      },
    ]
    const result = computeSkillXp(events)
    expect(result.conflict).toBe(120)
    expect(result.communication).toBe(60)
    expect(result.leadership).toBe(10)
  })

  it('ignores events without skillImpacts', () => {
    const events: GamificationEvent[] = [
      { id: '1', type: 'BADGE_UNLOCKED', xpAwarded: 200, createdAt: '2024-01-01T00:00:00.000Z' },
    ]
    expect(computeSkillXp(events)).toEqual({})
  })
})

describe('computeSkillImpacts', () => {
  it('returns empty object for unknown slug', () => {
    expect(computeSkillImpacts('unknown-slug', 100)).toEqual({})
  })

  it('distributes XP by weight for thomas-kilmann', () => {
    const impacts = computeSkillImpacts('thomas-kilmann', 100)
    expect(impacts.conflict).toBe(70)
    expect(impacts.communication).toBe(20)
    expect(impacts.leadership).toBe(10)
  })

  it('rounds XP values', () => {
    const impacts = computeSkillImpacts('thomas-kilmann', 125)
    // conflict: 125 * 0.7 = 87.5 → 88
    expect(impacts.conflict).toBe(88)
  })
})
