import { describe, it, expect } from 'vitest'
import { exams, getExam } from './index'

describe('exams registry', () => {
  it('contains 3 exams', () => {
    expect(exams).toHaveLength(3)
  })

  it('exam-1 has 80 questions', () => {
    expect(getExam('exam-1').questions).toHaveLength(80)
  })

  it('exam-2 has 40 questions', () => {
    expect(getExam('exam-2').questions).toHaveLength(40)
  })

  it('exam-3 has 80 questions', () => {
    expect(getExam('exam-3').questions).toHaveLength(80)
  })

  it('random exam returns exactly 80 questions', () => {
    expect(getExam('random').questions).toHaveLength(80)
  })

  it('random exam has durationMinutes=60 and id="random"', () => {
    const r = getExam('random')
    expect(r.durationMinutes).toBe(60)
    expect(r.id).toBe('random')
  })

  it('throws for unknown exam id', () => {
    expect(() => getExam('unknown')).toThrow()
  })
})
