import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore, LEARNING_PATHS, computePathProgress } from '../../features/gamification'
import { LearningPathCard } from '../../components/gamification/LearningPathCard'

export function PathsPage() {
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  return (
    <div className="gamification-page">
      <h1 className="gamification-page__title">Parcours guidés</h1>
      <div className="paths-list">
        {LEARNING_PATHS.map(path => (
          <LearningPathCard
            key={path.slug}
            path={path}
            progress={computePathProgress(path, completedSlugs)}
          />
        ))}
      </div>
    </div>
  )
}
