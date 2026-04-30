import { useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '../features/gamification'

export function useWorkshopCompletion(slug: string) {
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))
  const isCompleted = completedSlugs.includes(slug)

  useEffect(() => {
    const { events, recordEvent } = useGamificationStore.getState()
    const hasStarted = events.some(e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === slug)
    if (!hasStarted) recordEvent({ type: 'WORKSHOP_STARTED', contentSlug: slug })
  }, [slug])

  const markComplete = useCallback(() => {
    const { getCompletedContentSlugs, recordEvent } = useGamificationStore.getState()
    if (!getCompletedContentSlugs().includes(slug)) {
      recordEvent({ type: 'WORKSHOP_COMPLETED', contentSlug: slug })
    }
  }, [slug])

  return { isCompleted, markComplete }
}
