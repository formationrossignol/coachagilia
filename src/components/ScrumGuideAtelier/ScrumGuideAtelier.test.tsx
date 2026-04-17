import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrumGuideAtelier } from './index'

describe('ScrumGuideAtelier', () => {
  it('renders 14 draggable labels in the palette', () => {
    render(<ScrumGuideAtelier />)
    const labels = document.querySelectorAll('[data-label]')
    expect(labels).toHaveLength(14)
  })

  it('renders 14 drop zones', () => {
    render(<ScrumGuideAtelier />)
    const zones = document.querySelectorAll('[data-zone]')
    expect(zones).toHaveLength(14)
  })

  it('"Vérifier" button is disabled when zones are empty', () => {
    render(<ScrumGuideAtelier />)
    const btn = screen.getByRole('button', { name: /vérifier/i })
    expect(btn).toBeDisabled()
  })

  it('renders title and palette section', () => {
    render(<ScrumGuideAtelier />)
    expect(screen.getByText(/cadre scrum/i)).toBeInTheDocument()
    expect(screen.getByText(/product owner/i)).toBeInTheDocument()
  })
})
