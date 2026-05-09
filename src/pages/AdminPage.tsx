import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../features/gamification'

export function AdminPage() {
  const totalXp = useGamificationStore(s => s.getTotalXp())
  const eventCount = useGamificationStore(s => s.events.length)
  const artifactCount = useGamificationStore(s => s.artifacts.length)
  const completedCount = useGamificationStore(useShallow(s => s.getCompletedContentSlugs())).length
  const badgeCount = useGamificationStore(useShallow(s => s.getUnlockedBadgeIds())).length

  function handleReset() {
    if (!window.confirm('Réinitialiser toute la progression gamification ? Cette action est irréversible.')) return
    localStorage.removeItem('scrum-master-gamification')
    useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin — Gamification</h1>
      <table className="admin-page__stats">
        <tbody>
          <tr><td>XP total</td><td>{totalXp}</td></tr>
          <tr><td>Événements enregistrés</td><td>{eventCount}</td></tr>
          <tr><td>Contenus complétés</td><td>{completedCount}</td></tr>
          <tr><td>Badges débloqués</td><td>{badgeCount}</td></tr>
          <tr><td>Artefacts créés</td><td>{artifactCount}</td></tr>
        </tbody>
      </table>
      <div>
        <button className="btn btn--danger" onClick={handleReset}>
          Réinitialiser la progression
        </button>
      </div>
    </div>
  )
}
