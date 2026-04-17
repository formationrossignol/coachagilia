import { useNavigate, useParams } from 'react-router-dom'
import { useQuizStore } from '../../store/quizStore'

function formatElapsed(startedAt: number | null, submittedAt: number | null): string {
  if (!startedAt || !submittedAt) return '—'
  const seconds = Math.floor((submittedAt - startedAt) / 1000)
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function isCorrect(userAnswer: string[], correct: string[]): boolean {
  if (userAnswer.length !== correct.length) return false
  const u = [...userAnswer].sort()
  const c = [...correct].sort()
  return u.every((a, i) => a === c[i])
}

export function QuizResults() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const { exam, answers, startedAt, submittedAt, resetQuiz, startQuiz } = useQuizStore()

  if (!exam || !submittedAt) {
    return (
      <div className="debrief-empty">
        <p>Aucun examen soumis.</p>
        <button className="btn btn--primary" onClick={() => navigate('/quiz')}>
          Retour aux examens
        </button>
      </div>
    )
  }

  const questions = exam.questions
  const correctCount = questions.filter(q =>
    isCorrect(answers[q.id] ?? [], q.correctAnswer)
  ).length
  const pct = Math.round((correctCount / questions.length) * 100)
  const passed = pct >= 85

  function handleRestart() {
    resetQuiz()
    if (examId) {
      startQuiz(examId)
      navigate(`/quiz/${examId}`, { replace: true })
    }
  }

  return (
    <div className="quiz-results">
      <section className="quiz-results__global">
        <div className="quiz-score">
          <span className="quiz-score__value">{correctCount} / {questions.length}</span>
          <span className="quiz-score__pct">{pct} %</span>
        </div>
        <span className={`badge ${passed ? 'badge--green' : 'badge--red'} quiz-results__badge`}>
          {passed ? 'PASS ✓' : 'NOT YET'}
        </span>
        <p className="quiz-results__time">
          Temps utilisé : {formatElapsed(startedAt, submittedAt)}
        </p>
      </section>

      <section>
        <h2 className="quiz-results__section-title">Revue des questions</h2>
        <ol className="quiz-review-list">
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id] ?? []
            const correct = isCorrect(userAnswer, q.correctAnswer)
            return (
              <li
                key={q.id}
                className={`quiz-review-item ${correct ? 'quiz-review-item--correct' : 'quiz-review-item--wrong'}`}
              >
                <p className="quiz-review-item__question">
                  <strong>{idx + 1}.</strong> {q.text}
                </p>
                <p className="quiz-review-item__your-answer">
                  Votre réponse : <strong>{userAnswer.join(', ') || '—'}</strong>
                </p>
                {!correct && (
                  <p className="quiz-review-item__correct-answer">
                    Bonne réponse : <strong>{q.correctAnswer.join(', ')}</strong>
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <div className="quiz-results__actions">
        <button className="btn btn--primary" onClick={handleRestart}>
          Recommencer cet examen
        </button>
        <button className="btn btn--secondary" onClick={() => { resetQuiz(); navigate('/quiz') }}>
          Choisir un autre examen
        </button>
      </div>
    </div>
  )
}
