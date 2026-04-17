import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../store/quizStore'

const EXAM_CARDS = [
  { id: 'exam-1', title: 'Examen 1', count: 80, duration: '60 min', badge: 'Officiel' },
  { id: 'exam-2', title: 'Examen 2', count: 40, duration: '30 min', badge: 'Officiel' },
  { id: 'exam-3', title: 'Examen 3', count: 80, duration: '60 min', badge: 'Officiel' },
  { id: 'random', title: 'Aléatoire', count: 80, duration: '60 min', badge: 'Mixte' },
] as const

export function QuizSelector() {
  const navigate = useNavigate()
  const startQuiz = useQuizStore(s => s.startQuiz)

  function handleStart(examId: string) {
    startQuiz(examId)
    navigate(`/quiz/${examId}`)
  }

  return (
    <div className="quiz-selector">
      <header className="selector-header">
        <h1>Préparer la certification PSM-1</h1>
        <p>Examens blancs chronométrés — seuil de réussite : 85 %</p>
      </header>
      <div className="quiz-exam-grid">
        {EXAM_CARDS.map(({ id, title, count, duration, badge }) => (
          <article key={id} className="quiz-exam-card">
            <span className="badge badge--blue">{badge}</span>
            <h2 className="quiz-exam-card__title">{title}</h2>
            <p className="quiz-exam-card__meta">{count} questions · {duration}</p>
            <button className="btn btn--primary" onClick={() => handleStart(id)}>
              Commencer
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
