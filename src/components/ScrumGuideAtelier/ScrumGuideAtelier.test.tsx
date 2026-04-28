import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import React from 'react'
import { ScrumGuideAtelier } from './index'

function renderScrumGuideAtelier() {
  const router = createMemoryRouter(
    [{ path: '/ateliers/scrum-guide', element: <ScrumGuideAtelier /> }],
    { initialEntries: ['/ateliers/scrum-guide'] }
  )
  return render(<RouterProvider router={router} />)
}

describe('ScrumGuideAtelier', () => {
  it('renders 22 draggable labels in the palette', () => {
    renderScrumGuideAtelier()
    const labels = document.querySelectorAll('[data-label]')
    expect(labels).toHaveLength(22)
  })

  it('renders 22 drop zones', () => {
    renderScrumGuideAtelier()
    const zones = document.querySelectorAll('[data-zone]')
    expect(zones).toHaveLength(22)
  })

  it('"Vérifier" button is disabled when zones are empty', () => {
    renderScrumGuideAtelier()
    const btn = screen.getByRole('button', { name: /vérifier/i })
    expect(btn).toBeDisabled()
  })

  it('renders title and palette section', () => {
    renderScrumGuideAtelier()
    expect(screen.getByText(/cadre scrum/i)).toBeInTheDocument()
    expect(screen.getByText(/product owner/i)).toBeInTheDocument()
  })

  it('renders Scrum values in the palette', () => {
    renderScrumGuideAtelier()
    expect(screen.getByText('Commitment')).toBeInTheDocument()
    expect(screen.getByText('Courage')).toBeInTheDocument()
    expect(screen.getByText('Focus')).toBeInTheDocument()
    expect(screen.getByText('Openness')).toBeInTheDocument()
    expect(screen.getByText('Respect')).toBeInTheDocument()
  })

  it('renders empirical pillars in the palette', () => {
    renderScrumGuideAtelier()
    expect(screen.getByText('Transparence')).toBeInTheDocument()
    expect(screen.getByText('Inspection')).toBeInTheDocument()
    expect(screen.getByText('Adaptation')).toBeInTheDocument()
  })
})
