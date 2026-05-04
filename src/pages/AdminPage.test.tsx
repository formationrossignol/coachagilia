import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useGamificationStore } from '../features/gamification'
import { AdminPage } from './AdminPage'

vi.mock('../features/gamification', () => ({
  useGamificationStore: vi.fn(),
}))

const mockState = {
  events: [{ id: '1', type: 'WORKSHOP_COMPLETED', xpAwarded: 100, createdAt: '2024-01-01T00:00:00Z' }],
  artifacts: [],
  getTotalXp: () => 100,
  getUnlockedBadgeIds: () => [],
  getCompletedContentSlugs: () => ['sbi'],
}

beforeEach(() => {
  vi.mocked(useGamificationStore).mockImplementation((selector: any) =>
    selector(mockState)
  )
})

function renderAdmin() {
  return render(<MemoryRouter><AdminPage /></MemoryRouter>)
}

describe('AdminPage', () => {
  it('renders the page title', () => {
    renderAdmin()
    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument()
  })

  it('displays total XP', () => {
    renderAdmin()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('has a reset button', () => {
    renderAdmin()
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('calls setState and clears localStorage on confirmed reset', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const setStateSpy = vi.fn()
    ;(useGamificationStore as any).setState = setStateSpy
    renderAdmin()
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }))
    expect(setStateSpy).toHaveBeenCalledWith({ events: [], artifacts: [], toastQueue: [] }, true)
  })

  it('does not reset when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const setStateSpy = vi.fn()
    ;(useGamificationStore as any).setState = setStateSpy
    renderAdmin()
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }))
    expect(setStateSpy).not.toHaveBeenCalled()
  })
})
