import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../features/gamification'

export function useWorkshopCompletion(slug: string) {
  const recordEvent = useGamificationStore(s => s.recordEvent)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))
  const isCompleted = completedSlugs.includes(slug)

  useEffect(() => {
    const { events, recordEvent: rec } = useGamificationStore.getState()
    const hasStarted = events.some(e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === slug)
    if (!hasStarted) rec({ type: 'WORKSHOP_STARTED', contentSlug: slug })
  }, [slug])

  function markComplete() {
    if (!useGamificationStore.getState().getCompletedContentSlugs().includes(slug)) {
      recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: slug })
    }
  }

  return { isCompleted, markComplete }
}
