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
    <div
      className="cert-portal"
      style={{ '--cert-portal-color': cert.color } as React.CSSProperties}
    >
      <header className="cert-portal__header">
        <div className="cert-portal__icon">{cert.shortName}</div>
        <div>
          <h1 className="cert-portal__name">{cert.name}</h1>
          <p className="cert-portal__issuer">{cert.issuer} · {cert.levels.join(' · ')}</p>
        </div>
      </header>

      <div role="tablist" className="cert-portal__tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`cert-portal__tab${tab === t.id ? ' cert-portal__tab--active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'examens' && (
        <div className="cert-exam-list">
          {cert.examDefs.map(examDef => {
            const done = completedSlugs.includes(examDef.id)
            return (
              <article key={examDef.id} className="cert-exam-row">
                <div>
                  <div className="cert-exam-row__title">{examDef.title}</div>
                  <div className="cert-exam-row__meta">
                    {examDef.questionCount} questions · {examDef.durationMinutes} min
                    {done && <span className="cert-exam-row__done"> · ✓ Complété</span>}
                  </div>
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
          <p className="cert-themes__intro">Entraîne-toi thème par thème avec feedback immédiat après chaque réponse.</p>
          <div className="cert-themes__grid">
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
        <div className="cert-resources">
          {cert.resources.map(resource => (
            <article key={resource.id} className="cert-resource-card">
              <span className="cert-resource-card__type">{resource.type}</span>
              <h2 className="cert-resource-card__title">{resource.title}</h2>
              <div className="cert-resource-card__content">{resource.content}</div>
            </article>
          ))}
        </div>
      )}

      {tab === 'progression' && (
        <div>
          <p className="cert-progress__intro">
            Examens complétés : {cert.examDefs.filter(e => completedSlugs.includes(e.id)).length} / {cert.examDefs.length}
          </p>
          <div className="cert-progress__list">
            {cert.examDefs.map(e => {
              const done = completedSlugs.includes(e.id)
              return (
                <div key={e.id} className="cert-progress__row">
                  <span>{e.title}</span>
                  {done
                    ? <span className="cert-progress__check">✓ Complété</span>
                    : <span className="cert-progress__pending">—</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
