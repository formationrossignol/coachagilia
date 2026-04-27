import React from 'react'
import { X } from 'lucide-react'

interface ConfirmLeaveModalProps {
  title: string
  body: React.ReactNode
  cancelLabel: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmLeaveModal({ title, body, cancelLabel, confirmLabel, onConfirm, onCancel }: ConfirmLeaveModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-leave-title">
      <div className="modal">
        <button className="modal__close" onClick={onCancel} aria-label="Fermer">
          <X size={18} />
        </button>
        <div className="modal__icon modal__icon--warning">
          <X size={28} />
        </div>
        <h2 className="modal__title" id="confirm-leave-title">{title}</h2>
        <p className="modal__body">{body}</p>
        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
