import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PortfolioPage } from './PortfolioPage'

vi.mock('../../features/gamification', () => ({
  useGamificationStore: (sel: any) => sel({
    artifacts: [],
    deleteArtifact: vi.fn(),
    markArtifactExported: vi.fn(),
  }),
}))

describe('PortfolioPage', () => {
  it('renders page title', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument()
  })

  it('shows empty state when no artifacts', () => {
    render(<PortfolioPage />)
    expect(screen.getByText(/aucun artefact/i)).toBeInTheDocument()
  })
})
