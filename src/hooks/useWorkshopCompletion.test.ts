import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGamificationStore } from '../features/gamification'
import { useWorkshopCompletion } from './useWorkshopCompletion'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

describe('useWorkshopCompletion', () => {
  it('fires WORKSHOP_STARTED on mount if not already started', () => {
    renderHook(() => useWorkshopCompletion('sbi'))
    const events = useGamificationStore.getState().events
    expect(events.some(e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === 'sbi')).toBe(true)
  })

  it('does not fire WORKSHOP_STARTED twice for the same slug', () => {
    useGamificationStore.getState().recordEvent({ type: 'WORKSHOP_STARTED', contentSlug: 'sbi' })
    renderHook(() => useWorkshopCompletion('sbi'))
    const startEvents = useGamificationStore.getState().events.filter(
      e => e.type === 'WORKSHOP_STARTED' && e.contentSlug === 'sbi'
    )
    expect(startEvents).toHaveLength(1)
  })

  it('markComplete fires WORKSHOP_COMPLETED', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    act(() => { result.current.markComplete() })
    const events = useGamificationStore.getState().events
    expect(events.some(e => e.type === 'WORKSHOP_COMPLETED' && e.contentSlug === 'sbi')).toBe(true)
  })

  it('markComplete does not fire twice for the same slug', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    act(() => { result.current.markComplete() })
    act(() => { result.current.markComplete() })
    const completedEvents = useGamificationStore.getState().events.filter(
      e => e.type === 'WORKSHOP_COMPLETED' && e.contentSlug === 'sbi'
    )
    expect(completedEvents).toHaveLength(1)
  })

  it('isCompleted is false initially and true after markComplete', () => {
    const { result } = renderHook(() => useWorkshopCompletion('sbi'))
    expect(result.current.isCompleted).toBe(false)
    act(() => { result.current.markComplete() })
    expect(result.current.isCompleted).toBe(true)
  })
})
