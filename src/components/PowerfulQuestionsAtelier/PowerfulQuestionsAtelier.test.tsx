import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { PowerfulQuestionsAtelier } from '.'

function renderAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/powerful-questions', element: <PowerfulQuestionsAtelier /> }],
    { initialEntries: ['/ateliers/powerful-questions'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('PowerfulQuestionsAtelier — Phase 1', () => {
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
      fireEvent.drop(document.querySelector('[data-category="closed"]')!)
    })
    expect(screen.getByRole('button', { name: 'Vérifier' })).not.toBeDisabled()
  })

  it('shows 12/12 and Phase suivante on perfect placement', () => {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'closed', q2: 'closed', q3: 'closed', q4: 'closed',
      q5: 'leading', q6: 'leading', q7: 'leading', q8: 'leading',
      q9: 'powerful', q10: 'powerful', q11: 'powerful', q12: 'powerful',
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
      fireEvent.drop(document.querySelector('[data-category="closed"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Phase suivante/ })).not.toBeInTheDocument()
  })
})

describe('PowerfulQuestionsAtelier — Phase 2', () => {
  function reachPhase2() {
    renderAtelier()
    const mapping: Record<string, string> = {
      q1: 'closed', q2: 'closed', q3: 'closed', q4: 'closed',
      q5: 'leading', q6: 'leading', q7: 'leading', q8: 'leading',
      q9: 'powerful', q10: 'powerful', q11: 'powerful', q12: 'powerful',
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
      s1: 'clarify', s2: 'clarify', s3: 'clarify',
      s4: 'explore', s5: 'explore', s6: 'explore',
      s7: 'empower', s8: 'empower', s9: 'empower',
      s10: 'decide', s11: 'decide', s12: 'decide',
      s13: 'act', s14: 'act', s15: 'act',
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
      fireEvent.drop(document.querySelector('[data-intent="clarify"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    expect(screen.getByRole('button', { name: 'Réessayer phase 2' })).toBeInTheDocument()
  })

  it('returns situations to pool after Réessayer phase 2', () => {
    reachPhase2()
    document.querySelectorAll('[data-situation]').forEach(card => {
      fireEvent.dragStart(card)
      fireEvent.drop(document.querySelector('[data-intent="clarify"]')!)
    })
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer phase 2' }))
    expect(document.querySelectorAll('[data-situation]')).toHaveLength(15)
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled()
  })
})
