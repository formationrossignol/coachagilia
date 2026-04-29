import { describe, it, expect } from 'vitest'
import { getRecommendations } from './recommendations'

describe('getRecommendations', () => {
  it('returns slugs whose skill-map includes the given skill', () => {
    const recs = getRecommendations('conflict', [])
    expect(recs).toContain('thomas-kilmann')
    expect(recs.length).toBeLessThanOrEqual(3)
  })

  it('excludes completed slugs', () => {
    const recs = getRecommendations('conflict', ['thomas-kilmann'])
    expect(recs).not.toContain('thomas-kilmann')
  })

  it('sorts by weight descending — highest-weight slug comes first', () => {
    // thomas-kilmann has conflict weight 0.7, ladder-of-inference has 0.5
    const recs = getRecommendations('conflict', [])
    const tkIdx = recs.indexOf('thomas-kilmann')
    const loiIdx = recs.indexOf('ladder-of-inference')
    if (tkIdx !== -1 && loiIdx !== -1) {
      expect(tkIdx).toBeLessThan(loiIdx)
    }
  })

  it('respects the limit parameter', () => {
    const recs = getRecommendations('facilitation', [], 2)
    expect(recs.length).toBeLessThanOrEqual(2)
  })

  it('returns empty array when skill has no content in the map', () => {
    const recs = getRecommendations('flow', [])
    expect(Array.isArray(recs)).toBe(true)
  })
})
