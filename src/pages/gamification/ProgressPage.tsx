import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore, LEARNING_PATHS, BADGES, computePathProgress } from '../../features/gamification'
import { XpSummaryCard } from '../../components/gamification/XpSummaryCard'
import { SkillRadar } from '../../components/gamification/SkillRadar'
import { RecentProgressFeed } from '../../components/gamification/RecentProgressFeed'
import { BadgeGrid } from '../../components/gamification/BadgeGrid'
import { LearningPathCard } from '../../components/gamification/LearningPathCard'
import { ArtifactGrid } from '../../components/gamification/ArtifactGrid'

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
    <div className="gamification-page">
      <h1 className="gamification-page__title">Progression</h1>

      <div className="gamification-page__top">
        <div>
          <XpSummaryCard totalXp={totalXp} />
        </div>
        <SkillRadar skills={allSkillXp} />
      </div>

      <div className="gamification-page__section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gamification-page__section-title">Activité récente</span>
        </div>
        <RecentProgressFeed events={events} />
      </div>

      {recentBadges.length > 0 && (
        <div className="gamification-page__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="gamification-page__section-title">Derniers badges</span>
            <Link to="/badges" className="gamification-see-all">Voir tous →</Link>
          </div>
          <BadgeGrid badges={recentBadges} unlockedIds={unlockedIds} events={events} />
        </div>
      )}

      {inProgressPath && (
        <div className="gamification-page__section">
          <span className="gamification-page__section-title">Parcours en cours</span>
          <LearningPathCard path={inProgressPath.path} progress={inProgressPath.progress} />
        </div>
      )}

      {recentArtifacts.length > 0 && (
        <div className="gamification-page__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="gamification-page__section-title">Artefacts récents</span>
            <Link to="/portfolio" className="gamification-see-all">Voir tout →</Link>
          </div>
          <ArtifactGrid artifacts={recentArtifacts} onExport={handleExport} onDelete={deleteArtifact} />
        </div>
      )}
    </div>
  )
}
