import { useState } from 'react'
import type { WorkshopDefinition } from '../../data/workshops/types'

interface Props {
  workshop: WorkshopDefinition
}

export function WorkshopPedagogyPanel({ workshop }: Props) {
  const [open, setOpen] = useState(false)

  if (!workshop.pedagogy) return null

  const { objectives, toolExplanation, whenToUse, expectedOutput, prerequisites } = workshop.pedagogy

  return (
    <div className="pedagogy-panel">
      <button className="pedagogy-panel__toggle" onClick={() => setOpen(o => !o)}>
        Objectifs &amp; contexte {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="pedagogy-panel__body">
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Objectifs pédagogiques</p>
            <ul className="pedagogy-panel__list">
              {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">L'outil</p>
            <p>{toolExplanation}</p>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Quand l'utiliser</p>
            <ul className="pedagogy-panel__list">
              {whenToUse.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
          <div className="pedagogy-panel__section">
            <p className="pedagogy-panel__section-title">Ce que vous allez produire</p>
            <ul className="pedagogy-panel__list">
              {expectedOutput.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          {prerequisites && prerequisites.length > 0 && (
            <div className="pedagogy-panel__section">
              <p className="pedagogy-panel__section-title">Prérequis</p>
              <ul className="pedagogy-panel__list">
                {prerequisites.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
