import { describe, it, expect } from 'vitest'
import { getCertification, getAllCertifications, getCertExam } from './index'

describe('getCertification', () => {
  it('returns PSM definition', () => {
    const cert = getCertification('psm')
    expect(cert.id).toBe('psm')
    expect(cert.shortName).toBe('PSM')
    expect(cert.topics.length).toBeGreaterThan(0)
    expect(cert.examDefs.length).toBe(3)
  })

  it('returns all 4 certifications', () => {
    const all = getAllCertifications()
    expect(all).toHaveLength(4)
    expect(all.map(c => c.id)).toEqual(['psm', 'pspo', 'pmi-acp', 'safe'])
  })
})

describe('getCertExam', () => {
  it('returns a QuizExam for a valid cert exam id', () => {
    const exam = getCertExam('pspo', 'pspo-full-1')
    expect(exam).toBeDefined()
    expect(exam!.id).toBe('pspo-full-1')
    expect(exam!.questions.length).toBeLessThanOrEqual(80)
  })

  it('returns undefined for unknown exam id', () => {
    const exam = getCertExam('psm', 'unknown-exam')
    expect(exam).toBeUndefined()
  })

  it('quick mode returns fewer questions', () => {
    const exam = getCertExam('psm', 'psm-quick')
    expect(exam).toBeDefined()
    expect(exam!.questionCount).toBe(40)
  })
})
