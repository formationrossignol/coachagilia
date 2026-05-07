import { useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { getCertification, CERT_IDS } from '../../data/certifications'
import type { CertificationId } from '../../data/certifications/types'
import { useQuizStore } from '../../store/quizStore'
import { useGamificationStore } from '../../features/gamification/gamification.store'

type Tab = 'examens' | 'themes' | 'ressources' | 'progression'

export function CertificationPortal() {
  const { certId } = useParams<{ certId: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('examens')
  const startQuiz = useQuizStore(s => s.startQuiz)
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  if (!certId || !CERT_IDS.includes(certId as CertificationId)) {
    return <Navigate to="/certifications" replace />
  }

  const cert = getCertification(certId as CertificationId)
  const completedSlugs = getCompletedSlugs()

  function handleStartExam(examId: string) {
    startQuiz(examId)
    navigate(`/quiz/${examId}`)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'examens', label: 'Examens' },
    { id: 'themes', label: 'Thèmes' },
    { id: 'ressources', label: 'Ressources' },
    { id: 'progression', label: 'Progression' },
  ]

  return (
    <div className="quiz-selector">
      <header className="selector-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 40, height: 40, background: cert.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
          {cert.shortName}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{cert.name}</h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{cert.issuer} · {cert.levels.join(' · ')}</p>
        </div>
      </header>

      <div role="tablist" style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border, #e5e7eb)', marginBottom: '1.5rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.5rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid ${cert.color}` : '2px solid transparent',
              color: tab === t.id ? cert.color : 'inherit',
              fontWeight: tab === t.id ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'examens' && (
        <div className="quiz-exam-grid" style={{ gridTemplateColumns: '1fr' }}>
          {cert.examDefs.map(examDef => {
            const done = completedSlugs.includes(examDef.id)
            return (
              <article key={examDef.id} className="quiz-exam-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 className="quiz-exam-card__title">{examDef.title}</h2>
                  <p className="quiz-exam-card__meta">{examDef.questionCount} questions · {examDef.durationMinutes} min{done ? ' · ✓ Complété' : ''}</p>
                </div>
                <button className="btn btn--primary" onClick={() => handleStartExam(examDef.id)}>
                  {done ? 'Recommencer' : 'Démarrer'}
                </button>
              </article>
            )
          })}
        </div>
      )}

      {tab === 'themes' && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.875rem' }}>Entraîne-toi thème par thème avec feedback immédiat après chaque réponse.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {cert.topics.map(topic => (
              <Link
                key={topic.slug}
                to={`/certifications/${cert.id}/topic/${topic.slug}`}
                className="btn btn--secondary"
                style={{ textDecoration: 'none' }}
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === 'ressources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cert.resources.map(resource => (
            <article key={resource.id} className="quiz-exam-card">
              <h2 className="quiz-exam-card__title">{resource.title}</h2>
              <p className="quiz-exam-card__meta" style={{ textTransform: 'capitalize' }}>{resource.type}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', whiteSpace: 'pre-wrap', opacity: 0.8 }}>
                {resource.content}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'progression' && (
        <div>
          <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.875rem' }}>
            Examens complétés : {cert.examDefs.filter(e => completedSlugs.includes(e.id)).length} / {cert.examDefs.length}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cert.examDefs.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>{e.title}</span>
                <span>{completedSlugs.includes(e.id) ? '✓' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
