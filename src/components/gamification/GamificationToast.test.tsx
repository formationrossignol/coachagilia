import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { GamificationToast } from './GamificationToast'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: vi.fn(),
}))

import { useGamificationStore } from '../../features/gamification'

describe('GamificationToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders nothing when toast queue is empty', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [], dismissToast: vi.fn() })
    )
    const { container } = render(<GamificationToast />)
    expect(container.querySelector('.gamification-toast')).toBeNull()
  })

  it('renders toast message from queue', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'xp', message: '+100 XP', xp: 100 }], dismissToast: vi.fn() })
    )
    render(<GamificationToast />)
    expect(screen.getByText('+100 XP')).toBeInTheDocument()
  })

  it('renders detail when present', () => {
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'badge', message: 'Badge débloqué', detail: 'Médiateur' }], dismissToast: vi.fn() })
    )
    render(<GamificationToast />)
    expect(screen.getByText('Médiateur')).toBeInTheDocument()
  })

  it('calls dismissToast after 3 seconds', async () => {
    const dismissToast = vi.fn()
    vi.mocked(useGamificationStore).mockImplementation((sel: any) =>
      sel({ toastQueue: [{ type: 'xp', message: '+50 XP' }], dismissToast })
    )
    render(<GamificationToast />)
    await act(async () => { vi.advanceTimersByTime(3000) })
    expect(dismissToast).toHaveBeenCalled()
  })
})
