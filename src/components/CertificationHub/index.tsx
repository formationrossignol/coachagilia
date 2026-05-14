import { Link } from 'react-router-dom'
import { getAllCertifications } from '../../data/certifications'
import { useGamificationStore } from '../../features/gamification/gamification.store'

const CERT_STATS = {
  psm: { progress: 62, score: '74 % · PSM I blanc', focus: 'Scrum Events · Accountability · Empiricism' },
  pspo: { progress: 48, score: '68 % · PSPO I blanc', focus: 'Value · Product Goal · Evidence-Based Management' },
  'pmi-acp': { progress: 35, score: '71 % · Agile Principles', focus: 'Risk · Stakeholders · Adaptive Planning' },
  safe: { progress: 41, score: '69 % · SAFe Agilist', focus: 'PI Planning · Lean Portfolio · ART' },
} as const

export function CertificationHub() {
  const getCompletedSlugs = useGamificationStore(s => s.getCompletedContentSlugs)

  return (
    <div className="cert-hub">
      <header className="selector-header">
        <h1>Certifications Agile</h1>
        <p>Entraînez-vous par thème, mesurez votre niveau et passez des examens blancs dans les conditions réelles.</p>
      </header>

      <div className="cert-kpis" aria-label="Indicateurs certification">
        <div><strong>12</strong><span>Examens passés</span></div>
        <div><strong>78 %</strong><span>Score moyen</span></div>
        <div><strong>19 / 34</strong><span>Thèmes maîtrisés</span></div>
      </div>

      <div className="cert-hub-grid">
        {getAllCertifications().map(cert => {
          const completedCount = getCompletedSlugs().filter(s =>
            cert.examDefs.some(e => e.id === s)
          ).length
          const fallbackProgress = Math.round((completedCount / cert.examDefs.length) * 100)
          const stats = CERT_STATS[cert.id as keyof typeof CERT_STATS]
          const progress = stats?.progress ?? fallbackProgress

          return (
            <article
              key={cert.id}
              className="cert-card"
              style={{ '--cert-card-color': cert.color } as React.CSSProperties}
            >
              <Link to={`/certifications/${cert.id}`} className="cert-card__main-link" aria-label={`${cert.name} - Continuer`} />
              <div className="cert-card__header">
                <div className="cert-card__icon">{cert.shortName}</div>
                <div>
                  <h2 className="cert-card__title">{cert.name}</h2>
                  <p className="cert-card__subtitle">{cert.issuer} · {cert.levels.join(' / ')}</p>
                </div>
              </div>
              <div className="cert-card__progress-block">
                <div className="cert-card__progress-label"><span>Progression globale</span><strong>{progress} %</strong></div>
                <div className="cert-card__progress-track"><div className="cert-card__progress-fill" style={{ width: `${progress}%` }} /></div>
              </div>
              <p className="cert-card__meta"><strong>Dernier score</strong>{stats?.score ?? 'Aucun examen blanc passé'}</p>
              <p className="cert-card__meta"><strong>À renforcer</strong>{stats?.focus ?? `${cert.topics.slice(0, 3).map(t => t.label).join(' · ')}`}</p>
              <div className="cert-card__actions">
                <Link to={`/certifications/${cert.id}`} className="btn btn--primary">Continuer</Link>
                <Link to={`/certifications/${cert.id}`} className="btn btn--secondary">Examens blancs</Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
