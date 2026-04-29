import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillRadar } from './SkillRadar'

describe('SkillRadar', () => {
  it('renders an SVG with accessible label', () => {
    render(<SkillRadar skills={{}} />)
    expect(screen.getByRole('img', { name: /radar des compétences/i })).toBeInTheDocument()
  })

  it('renders exactly 19 axis lines', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelectorAll('.skill-radar__axis')).toHaveLength(19)
  })

  it('renders exactly 19 skill labels', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelectorAll('.skill-radar__label')).toHaveLength(19)
  })

  it('renders a filled polygon', () => {
    const { container } = render(<SkillRadar skills={{}} />)
    expect(container.querySelector('.skill-radar__polygon')).toBeInTheDocument()
  })

  it('polygon x coordinate for max-XP conflict (axis 0) is ~200', () => {
    // conflict is axis 0, angle = -π/2 → x = CX + r·cos(-π/2) = 200 + 0 = 200
    const { container } = render(<SkillRadar skills={{ conflict: 3000 }} />)
    const polygon = container.querySelector('.skill-radar__polygon')!
    const points = polygon.getAttribute('points') ?? ''
    const firstPoint = points.split(' ')[0]
    const x = parseFloat(firstPoint.split(',')[0])
    expect(x).toBeCloseTo(200, 0)
  })
})
