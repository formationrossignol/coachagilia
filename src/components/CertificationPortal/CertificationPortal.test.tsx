import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CertificationPortal } from './index'

function renderPortal(certId = 'pspo') {
  return render(
    <MemoryRouter initialEntries={[`/certifications/${certId}`]}>
      <Routes>
        <Route path="/certifications/:certId" element={<CertificationPortal />} />
        <Route path="/certifications" element={<div>Hub</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CertificationPortal', () => {
  it('renders cert name and issuer', () => {
    renderPortal('pspo')
    expect(screen.getByText(/Professional Scrum Product Owner/i)).toBeInTheDocument()
    expect(screen.getByText(/Scrum\.org/i)).toBeInTheDocument()
  })

  it('shows Examens tab by default', () => {
    renderPortal('pspo')
    expect(screen.getByText(/Examen complet/i)).toBeInTheDocument()
  })

  it('switches to Thèmes tab', () => {
    renderPortal('pspo')
    fireEvent.click(screen.getByRole('tab', { name: /thèmes/i }))
    expect(screen.getByText(/Product Value/i)).toBeInTheDocument()
  })

  it('switches to Ressources tab', () => {
    renderPortal('pspo')
    fireEvent.click(screen.getByRole('tab', { name: /ressources/i }))
    expect(screen.getByText(/Résumé/i)).toBeInTheDocument()
  })

  it('redirects to /certifications for unknown certId', () => {
    render(
      <MemoryRouter initialEntries={['/certifications/unknown']}>
        <Routes>
          <Route path="/certifications/:certId" element={<CertificationPortal />} />
          <Route path="/certifications" element={<div>Hub</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Hub')).toBeInTheDocument()
  })
})
