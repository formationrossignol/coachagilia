import { Link } from 'react-router-dom'
import { getAllCertifications } from '../../data/certifications'
import { useGamificationStore } from '../../features/gamification/gamification.store'

export function CertificationHub() {
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  return (
    <div className="cert-hub">
      <header className="selector-header">
        <h1>Certifications Agile</h1>
        <p>Prépare-toi à l'examen de ton choix — examens, entraînement par thème et ressources.</p>
      </header>
      <div className="cert-hub-grid">
        {getAllCertifications().map(cert => {
          const completedCount = getCompletedSlugs().filter(s =>
            cert.examDefs.some(e => e.id === s)
          ).length
          const progress = Math.round((completedCount / cert.examDefs.length) * 100)

          return (
            <Link
              key={cert.id}
              to={`/certifications/${cert.id}`}
              className="cert-card"
              style={{ '--cert-card-color': cert.color } as React.CSSProperties}
            >
              <div className="cert-card__header">
                <div className="cert-card__icon">{cert.shortName}</div>
                <div>
                  <h2 className="cert-card__title">{cert.name}</h2>
                  <p className="cert-card__subtitle">{cert.issuer} · {cert.levels.join(' / ')}</p>
                </div>
              </div>
              <p className="cert-card__meta">
                {cert.examDefs.length} examens · {cert.topics.length} thèmes
              </p>
              <div className="cert-card__progress-track">
                <div className="cert-card__progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
