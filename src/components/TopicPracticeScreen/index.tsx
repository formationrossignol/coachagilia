import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getCertification, CERT_IDS } from '../../data/certifications'
import type { CertificationId, CertQuestion } from '../../data/certifications/types'
import { useGamificationStore } from '../../features/gamification/gamification.store'

type AnswerState = { selected: string[]; revealed: boolean }

export function TopicPracticeScreen() {
  const { certId, topicSlug } = useParams<{ certId: string; topicSlug: string }>()
  const recordEvent = useGamificationStore(s => s.recordEvent)

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState>({ selected: [], revealed: false })
  const [done, setDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  if (!certId || !CERT_IDS.includes(certId as CertificationId)) {
    return <Navigate to="/certifications" replace />
  }

  const cert = getCertification(certId as CertificationId)
  const topic = cert.topics.find(t => t.slug === topicSlug)

  if (!topic) {
    return <Navigate to={`/certifications/${certId}`} replace />
  }

  const questions: CertQuestion[] = cert.questions.filter(q => q.topic === topicSlug)

  if (questions.length === 0) {
    return (
      <div className="quiz-selector">
        <p>Aucune question disponible pour ce thème.</p>
        <Link to={`/certifications/${certId}`} className="btn btn--secondary" style={{ textDecoration: 'none' }}>Retour</Link>
      </div>
    )
  }

  const current = questions[index]

  function isCorrect(selected: string[]): boolean {
    return (
      selected.length === current.correctAnswer.length &&
      current.correctAnswer.every(a => selected.includes(a))
    )
  }

  function handleSelect(letter: string) {
    if (answers.revealed) return
    if (current.isMultiple) {
      setAnswers(prev => ({
        ...prev,
        selected: prev.selected.includes(letter)
          ? prev.selected.filter(l => l !== letter)
          : [...prev.selected, letter],
      }))
    } else {
      const selected = [letter]
      const correct = isCorrect(selected)
      if (correct) setCorrectCount(c => c + 1)
      setAnswers({ selected, revealed: true })
    }
  }

  function handleReveal() {
    const correct = isCorrect(answers.selected)
    if (correct) setCorrectCount(c => c + 1)
    setAnswers(prev => ({ ...prev, revealed: true }))
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      const score = Math.round((correctCount / questions.length) * 100)
      recordEvent({ type: 'QUIZ_COMPLETED', contentSlug: `${certId}-topic-${topicSlug}`, score })
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setAnswers({ selected: [], revealed: false })
    }
  }

  if (done) {
    const score = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="quiz-selector">
        <header className="selector-header">
          <h1>{topic.label} — Résultat</h1>
          <p>{correctCount} / {questions.length} correctes ({score}%)</p>
        </header>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn--primary" onClick={() => { setIndex(0); setAnswers({ selected: [], revealed: false }); setDone(false); setCorrectCount(0) }}>
            Recommencer
          </button>
          <Link to={`/certifications/${certId}`} className="btn btn--secondary" style={{ textDecoration: 'none' }}>
            Retour au portail
          </Link>
        </div>
      </div>
    )
  }

  const correct = answers.revealed && isCorrect(answers.selected)

  return (
    <div className="quiz-selector">
      <header className="selector-header">
        <h1>{topic.label}</h1>
        <p>Question {index + 1} / {questions.length}</p>
      </header>

      <article className="quiz-exam-card" style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: 500 }}>{current.text}</p>
        {current.isMultiple && <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Plusieurs réponses possibles</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          {current.options.map(opt => {
            const isSelected = answers.selected.includes(opt.letter)
            const isRightAnswer = current.correctAnswer.includes(opt.letter)
            let bg = 'transparent'
            if (answers.revealed && isRightAnswer) bg = 'rgba(16,185,129,0.15)'
            else if (answers.revealed && isSelected && !isRightAnswer) bg = 'rgba(239,68,68,0.15)'

            return (
              <button
                key={opt.letter}
                onClick={() => handleSelect(opt.letter)}
                style={{ textAlign: 'left', padding: '0.6rem 0.75rem', border: `1px solid ${isSelected ? 'var(--accent, #6366f1)' : 'var(--border, #e5e7eb)'}`, borderRadius: 6, background: bg, cursor: answers.revealed ? 'default' : 'pointer', fontWeight: isSelected ? 600 : 400 }}
              >
                {opt.letter}. {opt.text}
              </button>
            )
          })}
        </div>

        {answers.revealed && (
          <p style={{ marginTop: '0.75rem', fontWeight: 600, color: correct ? '#10b981' : '#ef4444' }}>
            {correct ? '✓ Correct' : '✗ Incorrect'} — Bonne réponse : {current.correctAnswer.join(', ')}
          </p>
        )}
      </article>

      {current.isMultiple && !answers.revealed && answers.selected.length > 0 && (
        <button className="btn btn--secondary" onClick={handleReveal} style={{ marginBottom: '0.75rem' }}>
          Valider
        </button>
      )}

      {answers.revealed && (
        <button className="btn btn--primary" onClick={handleNext}>
          {index + 1 >= questions.length ? 'Voir les résultats' : 'Question suivante →'}
        </button>
      )}
    </div>
  )
}
