import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { useQuizStore } from '../../store/quizStore'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function QuizScreen() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { exam, answers, flaggedQuestions, startedAt, status, setAnswer, toggleFlag, submitQuiz, startQuiz } = useQuizStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (status === 'idle' && examId) startQuiz(examId)
  }, [status, examId, startQuiz])

  useEffect(() => {
    if (status === 'submitted') navigate(`/quiz/${examId}/results`, { replace: true })
  }, [status, examId, navigate])

  const handleSubmit = useCallback(() => { submitQuiz() }, [submitQuiz])

  const { showModal, confirm, cancel } = useExitGuard(status === 'in_progress')

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
    if (secondsLeft <= 0) { handleSubmit(); return }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft, handleSubmit])

  if (!exam) return <div className="loading">Chargement de l'examen…</div>

  const question = exam.questions[currentIndex]
  const currentAnswer = answers[question.id] ?? []
  const isFlagged = flaggedQuestions.includes(question.id)
  const isLast = currentIndex === exam.questions.length - 1
  const answeredCount = Object.keys(answers).length
  const flaggedCount = flaggedQuestions.length

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
    <>
      <div className="quiz-screen">
        <header className="quiz-header">
          <div className="quiz-header__left">
            <span className="quiz-exam-title">{exam.title}</span>
            <span className="quiz-question-counter">
              Question {currentIndex + 1} / {exam.questions.length}
            </span>
          </div>
          <div className="quiz-header__right">
            {flaggedCount > 0 && (
              <span className="quiz-flag-count">
                <Bookmark size={13} className="quiz-flag-count__icon" />
                {flaggedCount} signalée{flaggedCount > 1 ? 's' : ''}
              </span>
            )}
            <span className="quiz-progress-count">{answeredCount} répondues</span>
            <span className={`quiz-timer${secondsLeft < 300 ? ' quiz-timer--urgent' : ''}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </header>

        <div className="quiz-body">
          <main className="quiz-main">
            <div className="quiz-question-header">
              {question.isMultiple && (
                <p className="quiz-multiple-hint">Plusieurs réponses possibles</p>
              )}
              <button
                className={`quiz-flag-btn${isFlagged ? ' quiz-flag-btn--active' : ''}`}
                onClick={() => toggleFlag(question.id)}
                aria-label={isFlagged ? 'Retirer le signalement' : 'Signaler pour relecture'}
                title={isFlagged ? 'Retirer le signalement' : 'Signaler pour relecture'}
              >
                <Bookmark size={15} strokeWidth={2} />
                {isFlagged ? 'Signalée' : 'Signaler'}
              </button>
            </div>

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
                <button className="btn btn--secondary" onClick={() => setCurrentIndex(i => i - 1)}>
                  ← Précédente
                </button>
              )}
              {!isLast ? (
                <button className="btn btn--primary" onClick={() => setCurrentIndex(i => i + 1)}>
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
              {exam.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id]
                const isCurrentQ = idx === currentIndex
                const isFlaggedQ = flaggedQuestions.includes(q.id)
                return (
                  <button
                    key={q.id}
                    className={[
                      'quiz-question-dot',
                      isAnswered ? 'quiz-question-dot--answered' : '',
                      isCurrentQ ? 'quiz-question-dot--current' : '',
                      isFlaggedQ ? 'quiz-question-dot--flagged' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Question ${idx + 1}${isFlaggedQ ? ' (signalée)' : ''}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            {flaggedCount > 0 && (
              <div className="quiz-sidebar__legend">
                <span className="quiz-legend-dot quiz-legend-dot--flagged" />
                Signalée
              </div>
            )}
          </aside>
        </div>
      </div>

      {showModal && (
        <ConfirmLeaveModal
          title="Quitter le quiz ?"
          body={<>Vous avez répondu à <strong>{answeredCount}</strong> question{answeredCount > 1 ? 's' : ''} sur {exam.questions.length}. Quitter maintenant effacera votre progression.</>}
          cancelLabel="Continuer le quiz"
          confirmLabel="Quitter quand même"
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </>
  )
}
