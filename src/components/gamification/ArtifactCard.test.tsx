import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArtifactCard } from './ArtifactCard'
import type { Artifact } from '../../features/gamification'

const mockArtifact: Artifact = {
  id: 'art-1',
  title: 'Mon feedback SBI',
  type: 'feedback_sbi',
  sourceContentSlug: 'sbi',
  data: {},
  createdAt: '2026-04-29T10:00:00.000Z',
  updatedAt: '2026-04-29T10:00:00.000Z',
}

describe('ArtifactCard', () => {
  it('renders artifact title', () => {
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Mon feedback SBI')).toBeInTheDocument()
  })

  it('renders French type label', () => {
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Feedback SBI')).toBeInTheDocument()
  })

  it('calls onExport when export button clicked', () => {
    const onExport = vi.fn()
    render(<ArtifactCard artifact={mockArtifact} onExport={onExport} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /exporter/i }))
    expect(onExport).toHaveBeenCalledWith('art-1')
  })

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<ArtifactCard artifact={mockArtifact} onExport={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))
    expect(onDelete).toHaveBeenCalledWith('art-1')
  })
})
