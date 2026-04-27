import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmLeaveModal } from './ConfirmLeaveModal'

const defaults = {
  title: 'Quitter ?',
  body: 'Votre progression sera perdue.',
  cancelLabel: 'Continuer',
  confirmLabel: 'Quitter quand même',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe('ConfirmLeaveModal', () => {
  it('renders title and body', () => {
    render(<ConfirmLeaveModal {...defaults} />)
    expect(screen.getByText('Quitter ?')).toBeInTheDocument()
    expect(screen.getByText('Votre progression sera perdue.')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /continuer/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /quitter quand même/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when close (X) button clicked', () => {
    const onCancel = vi.fn()
    render(<ConfirmLeaveModal {...defaults} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /fermer/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('accepts ReactNode as body', () => {
    render(
      <ConfirmLeaveModal
        {...defaults}
        body={<>Répondu à <strong>3</strong> questions.</>}
      />
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
