import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { WORKSHOP_CATEGORIES } from '../../data/workshops/categories'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops/definitions'
import { WorkshopCategoryNav } from '../WorkshopCategoryNav'
import { WorkshopCard } from '../WorkshopCard'
import type { WorkshopCategorySlug } from '../../data/workshops/types'
import { useGamificationStore } from '../../features/gamification'

export function AteliersHome() {
  const [activeCategory, setActiveCategory] = useState<WorkshopCategorySlug | null>(null)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  const visible = activeCategory
    ? WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === activeCategory)
    : WORKSHOP_DEFINITIONS

  return (
    <div className="ateliers-home">
      <header className="selector-header">
        <h1>Ateliers</h1>
        <p>Ancrez les concepts par la pratique : glisser-déposer, puzzles, cartes.</p>
      </header>
      <WorkshopCategoryNav
        categories={WORKSHOP_CATEGORIES}
        workshops={WORKSHOP_DEFINITIONS}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="ateliers-grid">
        {visible.map(w => <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />)}
      </div>
    </div>
  )
}
