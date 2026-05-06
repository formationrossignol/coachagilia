import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { IntentionModal } from '.'
import { WORKSHOP_INTENTIONS } from '../../data/workshops/intentions'
import { useGamificationStore } from '../../features/gamification'

beforeEach(() => {
  localStorage.clear()
  useGamificationStore.setState({ events: [], artifacts: [], toastQueue: [] }, true)
})

const conflitIntention = WORKSHOP_INTENTIONS.find(i => i.slug === 'gerer-conflit')!

function renderModal(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <IntentionModal intention={conflitIntention} onClose={onClose} />
    </MemoryRouter>
  )
}

describe('IntentionModal', () => {
  it('renders the intention name and emoji', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: /Gérer un conflit/ })).toBeInTheDocument()
    expect(screen.getByText('⚡')).toBeInTheDocument()
  })

  it('renders the short label', () => {
    renderModal()
    expect(screen.getByText('Intention')).toBeInTheDocument()
  })

  it('renders workshop cards for the intention', () => {
    renderModal()
    // thomas-kilmann and sbi are real workshops mapped to gerer-conflit
    expect(screen.getAllByText(/Thomas-Kilmann/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/SBI/).length).toBeGreaterThan(0)
  })

  it('renders a footer with available count', () => {
    renderModal()
    expect(screen.getByText(/atelier/)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    fireEvent.click(screen.getByRole('button', { name: /Fermer/ }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    const backdrop = document.querySelector('.intention-modal__backdrop')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn()
    renderModal(onClose)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
