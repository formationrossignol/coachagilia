import { Link } from 'react-router-dom'
import { getAllCertifications } from '../../data/certifications'
import { useGamificationStore } from '../../features/gamification/gamification.store'

export function CertificationHub() {
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  return (
    <div className="quiz-selector">
      <header className="selector-header">
        <h1>Certifications Agile</h1>
        <p>Prépare-toi à l'examen de ton choix — examens, entraînement par thème et ressources.</p>
      </header>
      <div className="quiz-exam-grid">
        {getAllCertifications().map(cert => {
          const completedCount = getCompletedSlugs().filter(s =>
            cert.examDefs.some(e => e.id === s)
          ).length
          const progress = Math.round((completedCount / cert.examDefs.length) * 100)

          return (
            <Link
              key={cert.id}
              to={`/certifications/${cert.id}`}
              className="quiz-exam-card"
              style={{ textDecoration: 'none', borderTop: `3px solid ${cert.color}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 36, height: 36, background: cert.color, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}>
                  {cert.shortName}
                </div>
                <div>
                  <h2 className="quiz-exam-card__title" style={{ margin: 0 }}>{cert.name}</h2>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>{cert.issuer} · {cert.levels.join(' / ')}</p>
                </div>
              </div>
              <p className="quiz-exam-card__meta">
                {cert.examDefs.length} examens · {cert.topics.length} thèmes
              </p>
              <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden', marginTop: '0.5rem' }}>
                <div style={{ height: '100%', background: cert.color, width: `${progress}%`, borderRadius: 2 }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
