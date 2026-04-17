import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizStore } from '../../store/quizStore'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function QuizScreen() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { exam, answers, startedAt, status, setAnswer, submitQuiz, startQuiz } = useQuizStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Start quiz if not already started for this examId
  useEffect(() => {
    if (status === 'idle' && examId) {
      startQuiz(examId)
    }
  }, [status, examId, startQuiz])

  // Redirect if submitted
  useEffect(() => {
    if (status === 'submitted') {
      navigate(`/quiz/${examId}/results`, { replace: true })
    }
  }, [status, examId, navigate])

  const handleSubmit = useCallback(() => {
    submitQuiz()
  }, [submitQuiz])

  // Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!exam || !startedAt) return 0
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    return Math.max(0, exam.durationMinutes * 60 - elapsed)
  })

  useEffect(() => {
    if (!exam || !startedAt) return
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    setSecondsLeft(Math.max(0, exam.durationMinutes * 60 - elapsed))
  }, [exam, startedAt])

  useEffect(() => {
    if (secondsLeft <= 0) {
      handleSubmit()
      return
    }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft, handleSubmit])

  if (!exam) return <div className="loading">Chargement de l'examen…</div>

  const question = exam.questions[currentIndex]
  const currentAnswer = answers[question.id] ?? []
  const isLast = currentIndex === exam.questions.length - 1
  const answeredCount = Object.keys(answers).length

  function toggleAnswer(letter: string) {
    if (question.isMultiple) {
      const next = currentAnswer.includes(letter)
        ? currentAnswer.filter(a => a !== letter)
        : [...currentAnswer, letter]
      setAnswer(question.id, next)
    } else {
      setAnswer(question.id, [letter])
    }
  }

  return (
    <div className="quiz-screen">
      <header className="quiz-header">
        <div className="quiz-header__left">
          <span className="quiz-exam-title">{exam.title}</span>
          <span className="quiz-question-counter">
            Question {currentIndex + 1} / {exam.questions.length}
          </span>
        </div>
        <div className="quiz-header__right">
          <span className="quiz-progress-count">{answeredCount} répondues</span>
          <span className={`quiz-timer${secondsLeft < 300 ? ' quiz-timer--urgent' : ''}`}>
            {formatTime(secondsLeft)}
          </span>
        </div>
      </header>

      <div className="quiz-body">
        <main className="quiz-main">
          {question.isMultiple && (
            <p className="quiz-multiple-hint">Plusieurs réponses possibles</p>
          )}
          <p className="quiz-question-text">{question.text}</p>
          <div className="quiz-options" role="group" aria-label="Options de réponse">
            {question.options.map(opt => {
              const checked = currentAnswer.includes(opt.letter)
              const inputType = question.isMultiple ? 'checkbox' : 'radio'
              return (
                <label
                  key={opt.letter}
                  className={`quiz-option${checked ? ' quiz-option--selected' : ''}`}
                >
                  <input
                    type={inputType}
                    name={question.id}
                    value={opt.letter}
                    checked={checked}
                    onChange={() => toggleAnswer(opt.letter)}
                    className="quiz-option__input"
                  />
                  <span className="quiz-option__letter">{opt.letter}</span>
                  <span className="quiz-option__text">{opt.text}</span>
                </label>
              )
            })}
          </div>

          <div className="quiz-nav-buttons">
            {currentIndex > 0 && (
              <button
                className="btn btn--secondary"
                onClick={() => setCurrentIndex(i => i - 1)}
              >
                ← Précédente
              </button>
            )}
            {!isLast ? (
              <button
                className="btn btn--primary"
                onClick={() => setCurrentIndex(i => i + 1)}
              >
                Question suivante →
              </button>
            ) : (
              <button className="btn btn--primary" onClick={handleSubmit}>
                Soumettre l'examen
              </button>
            )}
          </div>
        </main>

        <aside className="quiz-sidebar">
          <p className="quiz-sidebar__title">Questions</p>
          <div className="quiz-question-grid">
            {exam.questions.map((q, idx) => (
              <button
                key={q.id}
                className={
                  'quiz-question-dot' +
                  (answers[q.id] ? ' quiz-question-dot--answered' : '') +
                  (idx === currentIndex ? ' quiz-question-dot--current' : '')
                }
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
