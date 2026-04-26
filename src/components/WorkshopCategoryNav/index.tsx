import type { WorkshopCategory, WorkshopCategorySlug, WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  categories: WorkshopCategory[]
  workshops: WorkshopDefinition[]
  activeCategory: WorkshopCategorySlug | null
  onSelect: (slug: WorkshopCategorySlug | null) => void
}

export function WorkshopCategoryNav({ categories, workshops, activeCategory, onSelect }: Props) {
  const totalAvailable = workshops.filter(w => !w.comingSoon).length

  return (
    <nav className="workshop-category-nav">
      <button
        className={`workshop-category-nav__btn${activeCategory === null ? ' workshop-category-nav__btn--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        Tous ({totalAvailable})
      </button>
      {categories.map(cat => {
        const count = workshops.filter(w => w.categorySlug === cat.slug && !w.comingSoon).length
        const isActive = activeCategory === cat.slug
        return (
          <button
            key={cat.slug}
            className={`workshop-category-nav__btn${isActive ? ' workshop-category-nav__btn--active' : ''}`}
            onClick={() => onSelect(isActive ? null : cat.slug)}
          >
            {cat.name} ({count})
          </button>
        )
      })}
    </nav>
  )
}
