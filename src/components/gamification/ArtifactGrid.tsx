import { useState } from 'react'
import type { Artifact, ArtifactType } from '../../features/gamification'
import { ArtifactCard } from './ArtifactCard'
import { ARTIFACT_TYPE_LABELS } from './constants'

const ALL_TYPES = Object.keys(ARTIFACT_TYPE_LABELS) as ArtifactType[]

interface Props {
  artifacts: Artifact[]
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function ArtifactGrid({ artifacts, onExport, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<ArtifactType | ''>('')

  const filtered = artifacts.filter(a =>
    (typeFilter === '' || a.type === typeFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="artifact-grid">
      <div className="artifact-grid__controls">
        <input
          className="artifact-grid__search"
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher un artefact"
        />
        <select
          className="artifact-grid__filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ArtifactType | '')}
          aria-label="Filtrer par type"
        >
          <option value="">Tous les types</option>
          {ALL_TYPES.map(type => (
            <option key={type} value={type}>{ARTIFACT_TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="artifact-grid__empty">Aucun artefact trouvé.</div>
      ) : (
        <div className="artifact-grid__list">
          {filtered.map(a => (
            <ArtifactCard key={a.id} artifact={a} onExport={onExport} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
