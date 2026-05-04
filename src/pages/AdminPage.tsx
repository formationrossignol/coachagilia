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
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Admin — Gamification</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <tbody>
          <tr><td>XP total</td><td><strong>{totalXp}</strong></td></tr>
          <tr><td>Événements enregistrés</td><td><strong>{eventCount}</strong></td></tr>
          <tr><td>Contenus complétés</td><td><strong>{completedCount}</strong></td></tr>
          <tr><td>Badges débloqués</td><td><strong>{badgeCount}</strong></td></tr>
          <tr><td>Artefacts créés</td><td><strong>{artifactCount}</strong></td></tr>
        </tbody>
      </table>
      <button className="btn btn--danger" onClick={handleReset}>
        Réinitialiser la progression
      </button>
    </div>
  )
}
