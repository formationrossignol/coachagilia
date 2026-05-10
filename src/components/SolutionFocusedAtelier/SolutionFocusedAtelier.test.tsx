import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { SolutionFocusedAtelier } from '.'

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/solution-focused', element: <SolutionFocusedAtelier /> }],
    { initialEntries: ['/ateliers/solution-focused'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('SolutionFocusedAtelier — Phase 1', () => {
  it('renders 12 question cards in the pool', () => {
    renderAtelier()
    expect(document.querySelectorAll('[data-question]')).toHaveLength(12)
  })

  it('disables Vérifier when not all questions are placed', () => {
    renderAtelier()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('enables Vérifier after all 12 questions are placed in any column', () => {
    renderAtelier()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-category="miracle"]')!)
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 12/12 and Phase suivante on perfect placement', () => {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'miracle',   q2: 'miracle',    q3: 'miracle',
      q4: 'scale',     q5: 'scale',      q6: 'scale',
      q7: 'exception', q8: 'exception',  q9: 'exception',
      q10: 'resource', q11: 'resource',  q12: 'resource',
    }
    document.querySelectorAll('[data-question]').forEach(card => {
      const id = card.getAttribute('data-question')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-category="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/12 \/ 12 correct/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Phase suivante/ })).toBeInTheDocument()
  })

  it('shows Réessayer when placement is wrong', () => {
    renderAtelier()
    document.querySelectorAll('[data-question]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-category="miracle"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('SolutionFocusedAtelier — Phase 2', () => {
  function reachPhase2() {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'miracle',   q2: 'miracle',    q3: 'miracle',
      q4: 'scale',     q5: 'scale',      q6: 'scale',
      q7: 'exception', q8: 'exception',  q9: 'exception',
      q10: 'resource', q11: 'resource',  q12: 'resource',
    }
    document.querySelectorAll('[data-question]').forEach(card => {
      const id = card.getAttribute('data-question')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-category="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: /Phase suivante/ }))
  }

  it('renders 15 situation cards in the pool', () => {
    reachPhase2()
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
  })

  it('disables Vérifier when not all situations are placed', () => {
    reachPhase2()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })

  it('shows 15/15 on all-correct assignment', () => {
    reachPhase2()
    const mapping: Record<string, string> = {
      s1: 'future',    s2: 'future',    s3: 'future',
      s4: 'progress',  s5: 'progress',  s6: 'progress',
      s7: 'exception', s8: 'exception', s9: 'exception',
      s10: 'resource', s11: 'resource', s12: 'resource',
      s13: 'small-step', s14: 'small-step', s15: 'small-step',
    }
    document.querySelectorAll('[data-situation]').forEach(card => {
      const id = card.getAttribute('data-situation')!
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector(`[data-intent="${mapping[id]}"]`)!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByText(/15 \/ 15 correct/)).toBeInTheDocument()
  })

  it('shows Réessayer phase 2 button after verification', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-intent="future"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-intent="future"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
