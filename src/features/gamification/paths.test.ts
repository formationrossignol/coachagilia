import { describe, it, expect } from 'vitest'
import { LEARNING_PATHS, computePathProgress } from './paths'

describe('LEARNING_PATHS', () => {
  it('exports 5 learning paths', () => {
    expect(LEARNING_PATHS).toHaveLength(5)
  })

  it('each path has a unique slug', () => {
    const slugs = LEARNING_PATHS.map(p => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('each path has at least one required step', () => {
    for (const path of LEARNING_PATHS) {
      const required = path.steps.filter(s => s.required)
      expect(required.length).toBeGreaterThan(0)
    }
  })
})

describe('computePathProgress', () => {
  const path = LEARNING_PATHS.find(p => p.slug === 'resolution-de-problemes')!
  // steps: 5-whys (req), ishikawa (req), root-cause-analysis (req), problem-solving-quiz (req)

  it('returns no progress when nothing is completed', () => {
    const result = computePathProgress(path, [])
    expect(result.completedSteps).toHaveLength(0)
    expect(result.requiredCompleted).toBe(0)
    expect(result.isComplete).toBe(false)
  })

  it('counts only completed steps', () => {
    const result = computePathProgress(path, ['5-whys', 'ishikawa'])
    expect(result.completedSteps).toHaveLength(2)
    expect(result.requiredCompleted).toBe(2)
    expect(result.isComplete).toBe(false)
  })

  it('marks complete when all required steps done', () => {
    const result = computePathProgress(path, ['5-whys', 'ishikawa', 'root-cause-analysis', 'problem-solving-quiz'])
    expect(result.isComplete).toBe(true)
    expect(result.requiredCompleted).toBe(result.requiredTotal)
  })

  it('handles optional steps correctly', () => {
    const facilitation = LEARNING_PATHS.find(p => p.slug === 'facilitation')!
    // fist-of-five is optional
    const requiredOnly = facilitation.steps.filter(s => s.required).map(s => s.contentSlug)
    const result = computePathProgress(facilitation, requiredOnly)
    expect(result.isComplete).toBe(true)
  })

  it('includes the correct path slug in result', () => {
    const result = computePathProgress(path, [])
    expect(result.slug).toBe('resolution-de-problemes')
  })
})
