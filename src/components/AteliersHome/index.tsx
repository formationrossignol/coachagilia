import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { WORKSHOP_CATEGORIES, WORKSHOP_DEFINITIONS, WORKSHOP_INTENTIONS, INTENTION_WORKSHOP_MAP } from '../../data/workshops'
import { WorkshopCategoryNav } from '../WorkshopCategoryNav'
import { IntentionNav } from '../IntentionNav'
import { WorkshopCard } from '../WorkshopCard'
import type { WorkshopCategorySlug } from '../../data/workshops/types'
import { useGamificationStore } from '../../features/gamification'

type AteliersView = 'intention' | 'list'
const VIEW_KEY = 'ateliers-view'

function readView(): AteliersView {
  try {
    const v = localStorage.getItem(VIEW_KEY)
    if (v === 'intention' || v === 'list') return v
  } catch {
    // ignore
  }
  return 'intention'
}

export function AteliersHome() {
  const [view, setView] = useState<AteliersView>(readView)
  const [activeCategory, setActiveCategory] = useState<WorkshopCategorySlug | null>(null)
  const [activeIntention, setActiveIntention] = useState<string | null>(null)
  const completedSlugs = useGamificationStore(useShallow(s => s.getCompletedContentSlugs()))

  function handleViewChange(next: AteliersView) {
    setView(next)
    setActiveCategory(null)
    setActiveIntention(null)
    localStorage.setItem(VIEW_KEY, next)
  }

  const visible = view === 'list'
    ? (activeCategory
        ? WORKSHOP_DEFINITIONS.filter(w => w.categorySlug === activeCategory)
        : WORKSHOP_DEFINITIONS)
    : (activeIntention
        ? WORKSHOP_DEFINITIONS.filter(w => (INTENTION_WORKSHOP_MAP[activeIntention] ?? []).includes(w.slug))
        : WORKSHOP_DEFINITIONS)

  return (
    <div className="ateliers-home">
      <header className="selector-header">
        <h1>Ateliers</h1>
        <p>Ancrez les concepts par la pratique : glisser-déposer, puzzles, cartes.</p>
      </header>
      <div className="ateliers-home__toolbar">
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${view === 'intention' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => handleViewChange('intention')}
          >
            Par intention
          </button>
          <button
            className={`view-toggle__btn${view === 'list' ? ' view-toggle__btn--active' : ''}`}
            onClick={() => handleViewChange('list')}
          >
            Liste complète
          </button>
        </div>
      </div>
      {view === 'intention' ? (
        <IntentionNav
          intentions={WORKSHOP_INTENTIONS}
          workshopMap={INTENTION_WORKSHOP_MAP}
          workshops={WORKSHOP_DEFINITIONS}
          activeIntention={activeIntention}
          onSelect={setActiveIntention}
        />
      ) : (
        <WorkshopCategoryNav
          categories={WORKSHOP_CATEGORIES}
          workshops={WORKSHOP_DEFINITIONS}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}
      <div className="ateliers-grid">
        {visible.map(w => (
          <WorkshopCard key={w.id} workshop={w} isCompleted={completedSlugs.includes(w.slug)} />
        ))}
      </div>
    </div>
  )
}
