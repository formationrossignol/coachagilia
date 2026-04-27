import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { ConflictAtelier } from '.'

function renderConflictAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/conflict', element: <ConflictAtelier /> }],
    { initialEntries: ['/ateliers/conflict'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('ConflictAtelier — Phase 1', () => {
  it('renders 5 TKI mode labels in the palette', () => {
    renderConflictAtelier()
    expect(screen.getByText('Compétition')).toBeInTheDocument()
    expect(screen.getByText('Collaboration')).toBeInTheDocument()
    expect(screen.getByText('Compromis')).toBeInTheDocument()
    expect(screen.getByText('Évitement')).toBeInTheDocument()
    expect(screen.getByText('Accommodation')).toBeInTheDocument()
  })

  it('disables Vérifier button when not all zones are filled', () => {
    renderConflictAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 5 modes are placed', () => {
    renderConflictAtelier()
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 5/5 and Phase suivante button on perfect placement', () => {
    renderConflictAtelier()
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/5 \/ 5 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer button when placement is wrong', () => {
    renderConflictAtelier()
    const placements = [
      ['Accommodation','top-left'],
      ['Évitement',    'top-right'],
      ['Compromis',    'center'],
      ['Collaboration','bottom-left'],
      ['Compétition',  'bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('ConflictAtelier — Phase 2', () => {
  function reachPhase2() {
    renderConflictAtelier()
    const placements = [
      ['Compétition',  'top-left'],
      ['Collaboration','top-right'],
      ['Compromis',    'center'],
      ['Évitement',    'bottom-left'],
      ['Accommodation','bottom-right'],
    ]
    placements.forEach(([mode, zoneId]) => {
      fireEvent.dragStart(screen.getByText(mode))
      fireEvent.drop(document.querySelector(`[data-zone="${zoneId}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 15 situation cards in the pool after entering phase 2', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('disables Vérifier when not all situations are assigned', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct assignment', () => {
    reachPhase2()
    const modeById: Record<string, string> = {
      s1: 'Compétition',  s2: 'Compétition',  s3: 'Compétition',
      s4: 'Collaboration',s5: 'Collaboration', s6: 'Collaboration',
      s7: 'Compromis',    s8: 'Compromis',     s9: 'Compromis',
      s10:'Évitement',    s11:'Évitement',     s12:'Évitement',
      s13:'Accommodation',s14:'Accommodation', s15:'Accommodation',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-mode="${modeById[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="Compétition"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-mode="Compétition"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
