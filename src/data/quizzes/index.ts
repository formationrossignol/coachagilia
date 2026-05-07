import { questions as exam1Questions } from './exam-1'
import { questions as exam2Questions } from './exam-2'
import { questions as exam3Questions } from './exam-3'
import type { QuizExam } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const exams: QuizExam[] = [
  { id: 'exam-1', title: 'Examen 1 — 80 questions', questionCount: 80, durationMinutes: 60, questions: exam1Questions },
  { id: 'exam-2', title: 'Examen 2 — 40 questions', questionCount: 40, durationMinutes: 30, questions: exam2Questions },
  { id: 'exam-3', title: 'Examen 3 — 80 questions', questionCount: 80, durationMinutes: 60, questions: exam3Questions },
]

const allQuestions = [...exam1Questions, ...exam2Questions, ...exam3Questions]

const CERT_PREFIXES = ['psm-', 'pspo-', 'pmi-acp-', 'safe-'] as const

function isCertExamId(id: string): boolean {
  return CERT_PREFIXES.some(prefix => id.startsWith(prefix))
}

function certIdFromExamId(examId: string): 'psm' | 'pspo' | 'pmi-acp' | 'safe' {
  if (examId.startsWith('pspo-')) return 'pspo'
  if (examId.startsWith('pmi-acp-')) return 'pmi-acp'
  if (examId.startsWith('safe-')) return 'safe'
  return 'psm'
}

export function getExam(id: string): QuizExam {
  if (id === 'random') {
    return {
      id: 'random',
      title: 'Examen Aléatoire — 80 questions',
      questionCount: 80,
      durationMinutes: 60,
      questions: shuffle(allQuestions).slice(0, 80),
    }
  }
  if (isCertExamId(id)) {
    const { getCertExam } = require('../certifications/index') as typeof import('../certifications/index')
    const exam = getCertExam(certIdFromExamId(id), id)
    if (exam) return exam
  }
  const exam = exams.find(e => e.id === id)
  if (!exam) throw new Error(`Unknown exam id: ${id}`)
  return exam
}
