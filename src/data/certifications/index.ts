import type { CertDefinition, CertificationId } from './types'
import type { QuizExam } from '../quizzes/types'
import { psmDefinition } from './psm/definition'
import { pspoDefinition } from './pspo/definition'
import { pmiacpDefinition } from './pmi-acp/definition'
import { safeDefinition } from './safe/definition'

const CERTIFICATIONS: Record<CertificationId, CertDefinition> = {
  psm: psmDefinition,
  pspo: pspoDefinition,
  'pmi-acp': pmiacpDefinition,
  safe: safeDefinition,
}

export const CERT_IDS: CertificationId[] = ['psm', 'pspo', 'pmi-acp', 'safe']

export function getCertification(id: CertificationId): CertDefinition {
  return CERTIFICATIONS[id]
}

export function getAllCertifications(): CertDefinition[] {
  return CERT_IDS.map(id => CERTIFICATIONS[id])
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getCertExam(certId: CertificationId, examId: string): QuizExam | undefined {
  const cert = CERTIFICATIONS[certId]
  if (!cert) return undefined
  const def = cert.examDefs.find(e => e.id === examId)
  if (!def) return undefined

  let questions = cert.questions
  if (def.mode === 'random') questions = shuffle(questions)
  if (def.mode === 'quick') questions = shuffle(questions).slice(0, def.questionCount)

  return {
    id: def.id,
    title: def.title,
    questionCount: def.questionCount,
    durationMinutes: def.durationMinutes,
    questions: questions.slice(0, def.questionCount),
  }
}
