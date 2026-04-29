import type { Artifact } from '../../features/gamification'
import { ARTIFACT_TYPE_LABELS } from './constants'

interface Props {
  artifact: Artifact
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function ArtifactCard({ artifact, onExport, onDelete }: Props) {
  return (
    <article className="artifact-card">
      <span className="artifact-card__type">{ARTIFACT_TYPE_LABELS[artifact.type]}</span>
      <h3 className="artifact-card__title">{artifact.title}</h3>
      <span className="artifact-card__date">
        {new Date(artifact.createdAt).toLocaleDateString('fr-FR')}
      </span>
      <div className="artifact-card__actions">
        <button
          className="artifact-card__btn"
          onClick={() => onExport(artifact.id)}
          aria-label="Exporter en JSON"
        >
          Exporter
        </button>
        <button
          className="artifact-card__btn artifact-card__btn--danger"
          onClick={() => onDelete(artifact.id)}
          aria-label="Supprimer l'artefact"
        >
          Supprimer
        </button>
      </div>
    </article>
  )
}
