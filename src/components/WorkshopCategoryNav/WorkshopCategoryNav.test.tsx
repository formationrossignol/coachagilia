import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorkshopCategoryNav } from '.'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'

describe('WorkshopCategoryNav', () => {
  it('renders Tous button', () => {
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Tous/ })).toBeInTheDocument()
  })

  it('renders one button per category', () => {
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Facilitation/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Management 3\.0/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Problem solving/ })).toBeInTheDocument()
  })

  it('calls onSelect with category slug when clicked', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(onSelect).toHaveBeenCalledWith('facilitation')
  })

  it('calls onSelect with null when active category clicked again', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory="facilitation" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Facilitation/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('calls onSelect with null when Tous clicked', () => {
    const onSelect = vi.fn()
    render(<WorkshopCategoryNav categories={WORKSHOP_CATEGORIES} workshops={WORKSHOP_DEFINITIONS} activeCategory="facilitation" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Tous/ }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
