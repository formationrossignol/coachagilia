import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore, LEARNING_PATHS, BADGES, computePathProgress } from '../../features/gamification'
import { SkillRadar } from '../../components/gamification/SkillRadar'
import { RecentProgressFeed } from '../../components/gamification/RecentProgressFeed'
import { BadgeGrid } from '../../components/gamification/BadgeGrid'
import { LearningPathCard } from '../../components/gamification/LearningPathCard'
import { ArtifactGrid } from '../../components/gamification/ArtifactGrid'

const weakSkills = [
  ['Priorisation', 22],
  ['Stakeholders', 35],
  ['Flow', 41],
  ['Coaching', 48],
] as const

export function ProgressPage() {
  const totalXp = useGamificationStore(s => s.getTotalXp())
  const allSkillXp = useGamificationStore(useShallow(s => s.getAllSkillXp()))
  const events = useGamificationStore(s => s.events)
  const artifacts = useGamificationStore(s => s.artifacts)
  const unlockedIds = useGamificationStore(useShallow(s => s.getUnlockedBadgeIds()))
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))
  const deleteArtifact = useGamificationStore(s => s.deleteArtifact)
  const markArtifactExported = useGamificationStore(s => s.markArtifactExported)

  const inProgressPath = LEARNING_PATHS
    .map(p => ({ path: p, progress: computePathProgress(p, completedSlugs) }))
    .find(({ progress }) => !progress.isComplete && progress.completedSteps.length > 0)

  const recentBadges = BADGES.filter(b => unlockedIds.includes(b.id)).slice(-3)
  const recentArtifacts = [...artifacts].reverse().slice(0, 3)

  function handleExport(id: string) {
    const art = artifacts.find(a => a.id === id)
    if (!art) return
    const blob = new Blob([JSON.stringify(art.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${art.title}.json`
    a.click()
    URL.revokeObjectURL(url)
    markArtifactExported(id)
  }

  return (
    <div className="gamification-page progress-dashboard">
      <h1 className="gamification-page__title">Progression</h1>

      <div className="progress-kpi-grid" aria-label="Synthèse de progression">
        <div><strong>{totalXp}</strong><span>Points de maîtrise</span></div>
        <div><strong>{completedSlugs.length || 12}</strong><span>Ateliers</span></div>
        <div><strong>{unlockedIds.length || 4}</strong><span>Badges</span></div>
        <div><strong>72 %</strong><span>Score moyen</span></div>
      </div>

      <div className="progress-dashboard__split">
        <section className="progress-panel" aria-labelledby="radar-title">
          <span className="gamification-page__section-title" id="radar-title">Radar de compétences</span>
          <SkillRadar skills={allSkillXp} />
        </section>
        <section className="progress-panel progress-reco" aria-labelledby="next-title">
          <span className="gamification-page__section-title" id="next-title">Prochaine recommandation</span>
          <h2>Delegation Poker</h2>
          <p>15 min · Intermédiaire</p>
          <strong>Pourquoi ?</strong>
          <p>Renforce décision + leadership à partir de vos derniers résultats.</p>
          <Link to="/ateliers/delegation-poker" className="btn btn--primary">Démarrer l’atelier</Link>
        </section>
      </div>

      <section className="progress-panel">
        <span className="gamification-page__section-title">Compétences à renforcer</span>
        <div className="weak-skills">
          {weakSkills.map(([name, value]) => (
            <div key={name} className="weak-skill">
              <div><span>{name}</span><strong>{value} %</strong></div>
              <i><b style={{ width: `${value}%` }} /></i>
            </div>
          ))}
        </div>
      </section>

      <section className="gamification-page__section progress-panel">
        <span className="gamification-page__section-title">Journal d’entraînement</span>
        <RecentProgressFeed events={events} />
      </section>

      {inProgressPath && (
        <section className="gamification-page__section">
          <span className="gamification-page__section-title">Parcours en cours</span>
          <LearningPathCard path={inProgressPath.path} progress={inProgressPath.progress} />
        </section>
      )}

      {recentBadges.length > 0 && (
        <section className="gamification-page__section">
          <div className="gamification-section-row">
            <span className="gamification-page__section-title">Derniers badges</span>
            <Link to="/badges" className="gamification-see-all">Voir tous →</Link>
          </div>
          <BadgeGrid badges={recentBadges} unlockedIds={unlockedIds} events={events} />
        </section>
      )}

      {recentArtifacts.length > 0 && (
        <section className="gamification-page__section">
          <div className="gamification-section-row">
            <span className="gamification-page__section-title">Artefacts récents</span>
            <Link to="/portfolio" className="gamification-see-all">Voir tout →</Link>
          </div>
          <ArtifactGrid artifacts={recentArtifacts} onExport={handleExport} onDelete={deleteArtifact} />
        </section>
      )}
    </div>
  )
}
