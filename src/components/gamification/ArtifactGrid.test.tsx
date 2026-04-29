import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArtifactGrid } from './ArtifactGrid'
import type { Artifact } from '../../features/gamification'

function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    id: crypto.randomUUID(),
    title: 'Test artifact',
    type: 'feedback_sbi',
    sourceContentSlug: 'sbi',
    data: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('ArtifactGrid', () => {
  it('shows empty message when no artifacts', () => {
    render(<ArtifactGrid artifacts={[]} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/aucun artefact/i)).toBeInTheDocument()
  })

  it('renders a card for each artifact', () => {
    const artifacts = [makeArtifact(), makeArtifact({ title: 'Second' })]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(2)
  })

  it('filters by type', () => {
    const artifacts = [
      makeArtifact({ type: 'feedback_sbi', title: 'SBI one' }),
      makeArtifact({ type: 'grow_plan', title: 'GROW one' }),
    ]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    const select = container.querySelector('.artifact-grid__filter') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'feedback_sbi' } })
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(1)
    expect(screen.getByText('SBI one')).toBeInTheDocument()
  })

  it('filters by search text', () => {
    const artifacts = [makeArtifact({ title: 'Alpha' }), makeArtifact({ title: 'Beta' })]
    const { container } = render(<ArtifactGrid artifacts={artifacts} onExport={vi.fn()} onDelete={vi.fn()} />)
    const input = container.querySelector('.artifact-grid__search') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'alpha' } })
    expect(container.querySelectorAll('.artifact-card')).toHaveLength(1)
  })
})
