import { useGamificationStore } from '../../features/gamification'
import { ArtifactGrid } from '../../components/gamification/ArtifactGrid'

export function PortfolioPage() {
  const artifacts = useGamificationStore(s => s.artifacts)
  const deleteArtifact = useGamificationStore(s => s.deleteArtifact)
  const markArtifactExported = useGamificationStore(s => s.markArtifactExported)

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
      <h1 className="gamification-page__title">Portfolio</h1>
      <ArtifactGrid
        artifacts={artifacts}
        onExport={handleExport}
        onDelete={deleteArtifact}
      />
    </div>
  )
}
