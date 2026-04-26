import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkshopPedagogyPanel } from '.'
import type { WorkshopDefinition } from '../../data/workshops/types'

const mockWorkshop: WorkshopDefinition = {
  id: 'test',
  slug: 'test',
  title: 'Test Workshop',
  route: '/ateliers/test',
  categorySlug: 'facilitation',
  toolName: 'Test Tool',
  level: 'intermediate',
  durationMinutes: 15,
  interactionType: 'drag-and-drop',
  summary: 'Test summary',
  pedagogy: {
    objectives: ['Objectif 1', 'Objectif 2'],
    toolExplanation: "Explication de l'outil",
    whenToUse: ['Cas 1', 'Cas 2'],
    expectedOutput: ['Livrable 1'],
    prerequisites: ['Prérequis 1'],
  },
}

describe('WorkshopPedagogyPanel', () => {
  it('renders toggle button', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    expect(screen.getByRole('button', { name: /Objectifs & contexte/ })).toBeInTheDocument()
  })

  it('is closed by default — objectives not visible', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    expect(screen.queryByText('Objectif 1')).not.toBeInTheDocument()
  })

  it('shows objectives when toggle clicked', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Objectif 1')).toBeInTheDocument()
    expect(screen.getByText('Objectif 2')).toBeInTheDocument()
  })

  it('shows tool explanation when opened', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText(/Explication de l'outil/)).toBeInTheDocument()
  })

  it('shows prerequisites when provided', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Prérequis 1')).toBeInTheDocument()
  })

  it('hides prerequisites section when not provided', () => {
    const w = { ...mockWorkshop, pedagogy: { ...mockWorkshop.pedagogy!, prerequisites: undefined } }
    render(<WorkshopPedagogyPanel workshop={w} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.queryByText(/Prérequis/i)).not.toBeInTheDocument()
  })

  it('closes when toggle clicked again', () => {
    render(<WorkshopPedagogyPanel workshop={mockWorkshop} />)
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.getByText('Objectif 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Objectifs & contexte/ }))
    expect(screen.queryByText('Objectif 1')).not.toBeInTheDocument()
  })
})
