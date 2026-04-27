import { useState } from 'react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

// Zone ID → correct label
const ZONE_ANSWERS: Record<string, string> = {
  'product-owner':        'Product Owner',
  'scrum-master':         'Scrum Master',
  'developers':           'Developers',
  'sprint':               'Sprint',
  'sprint-planning':      'Sprint Planning',
  'daily-scrum':          'Daily Scrum',
  'sprint-review':        'Sprint Review',
  'sprint-retrospective': 'Sprint Retrospective',
  'product-backlog':      'Product Backlog',
  'sprint-backlog':       'Sprint Backlog',
  'increment':            'Increment',
  'objectif-produit':     'Objectif Produit',
  'objectif-sprint':      'Objectif Sprint',
  'definition-done':      'Définition du « Done »',
}

const ALL_LABELS = Object.values(ZONE_ANSWERS)
const ZONE_IDS = Object.keys(ZONE_ANSWERS)

type ZoneState = Record<string, string>
type VerifyState = Record<string, boolean>

function DropZone({
  zoneId, label, verifyResult, onDrop, onDragStart,
}: {
  zoneId: string
  label: string
  verifyResult: VerifyState | null
  onDrop: (zoneId: string) => void
  onDragStart: (label: string, fromZone?: string) => void
}) {
  const verified = verifyResult !== null
  const correct = verifyResult?.[zoneId]

  return (
    <div
      data-zone={zoneId}
      role="region"
      aria-label={`Zone ${zoneId}`}
      className={
        'scrum-zone' +
        (label ? ' scrum-zone--filled' : ' scrum-zone--empty') +
        (verified ? (correct ? ' scrum-zone--correct' : ' scrum-zone--wrong') : '')
      }
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('scrum-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('scrum-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('scrum-zone--hover'); onDrop(zoneId) }}
    >
      {label ? (
        <span
          className="scrum-label scrum-label--placed"
          draggable
          onDragStart={() => onDragStart(label, zoneId)}
        >
          {label}
        </span>
      ) : (
        <span className="scrum-zone__placeholder">?</span>
      )}
    </div>
  )
}

export function ScrumGuideAtelier() {
  const [zones, setZones] = useState<ZoneState>(() =>
    Object.fromEntries(ZONE_IDS.map(id => [id, '']))
  )
  const isDirty = Object.values(zones).some(Boolean)
  const { showModal, confirm, cancel } = useExitGuard(isDirty)
  const [dragging, setDragging] = useState<{ label: string; fromZone?: string } | null>(null)
  const [verifyResult, setVerifyResult] = useState<VerifyState | null>(null)

  const placedLabels = new Set(Object.values(zones).filter(Boolean))
  const paletteLabels = ALL_LABELS.filter(l => !placedLabels.has(l))
  const allFilled = paletteLabels.length === 0

  function handleDragStart(label: string, fromZone?: string) {
    setDragging({ label, fromZone })
    setVerifyResult(null)
  }

  function handleDropOnZone(zoneId: string) {
    if (!dragging) return
    setZones(prev => {
      const next = { ...prev }
      if (dragging.fromZone) next[dragging.fromZone] = ''
      next[zoneId] = dragging.label
      return next
    })
    setDragging(null)
  }

  function handleDropOnPalette() {
    if (!dragging?.fromZone) { setDragging(null); return }
    setZones(prev => ({ ...prev, [dragging.fromZone!]: '' }))
    setDragging(null)
  }

  function handleVerify() {
    const result: VerifyState = {}
    for (const zoneId of ZONE_IDS) {
      result[zoneId] = zones[zoneId] === ZONE_ANSWERS[zoneId]
    }
    setVerifyResult(result)
  }

  function handleReset() {
    setZones(Object.fromEntries(ZONE_IDS.map(id => [id, ''])))
    setVerifyResult(null)
  }

  const score = verifyResult ? Object.values(verifyResult).filter(Boolean).length : null

  return (
    <>
      <div className="atelier-page">
        <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'scrum-guide')!} />
        <header className="atelier-header">
          <h1 className="atelier-title">Le cadre Scrum</h1>
          <p className="atelier-subtitle">Replacez les 14 éléments du Scrum Guide au bon endroit.</p>
        </header>

        <div className="scrum-diagram">
          {/* Left: Product Owner + Product Backlog + Objectif Produit */}
          <div className="scrum-col scrum-col--left">
            <DropZone zoneId="product-owner" label={zones['product-owner']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
            <div className="scrum-artifact-block">
              <DropZone zoneId="product-backlog" label={zones['product-backlog']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              <div className="scrum-commitment-row">
                <span className="scrum-commitment-label">Engagement :</span>
                <DropZone zoneId="objectif-produit" label={zones['objectif-produit']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              </div>
            </div>
          </div>

          {/* Center: Sprint box */}
          <div className="scrum-col scrum-col--center">
            <div className="scrum-sprint-box">
              <div className="scrum-sprint-header">
                <DropZone zoneId="sprint" label={zones['sprint']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
                <span className="scrum-sprint-duration">2–4 semaines</span>
              </div>
              <div className="scrum-sprint-events">
                <DropZone zoneId="sprint-planning" label={zones['sprint-planning']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
                <DropZone zoneId="developers" label={zones['developers']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
                <DropZone zoneId="daily-scrum" label={zones['daily-scrum']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
                <DropZone zoneId="sprint-review" label={zones['sprint-review']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              </div>
            </div>
            <div className="scrum-retro-row">
              <DropZone zoneId="sprint-retrospective" label={zones['sprint-retrospective']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              <DropZone zoneId="scrum-master" label={zones['scrum-master']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
            </div>
          </div>

          {/* Right: Sprint Backlog + Objectif Sprint + Increment + DoD */}
          <div className="scrum-col scrum-col--right">
            <div className="scrum-artifact-block">
              <DropZone zoneId="sprint-backlog" label={zones['sprint-backlog']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              <div className="scrum-commitment-row">
                <span className="scrum-commitment-label">Engagement :</span>
                <DropZone zoneId="objectif-sprint" label={zones['objectif-sprint']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              </div>
            </div>
            <div className="scrum-artifact-block">
              <DropZone zoneId="increment" label={zones['increment']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              <div className="scrum-commitment-row">
                <span className="scrum-commitment-label">Engagement :</span>
                <DropZone zoneId="definition-done" label={zones['definition-done']} verifyResult={verifyResult} onDrop={handleDropOnZone} onDragStart={handleDragStart} />
              </div>
            </div>
          </div>
        </div>

        {verifyResult && (
          <div className="scrum-score-banner">
            <span className={`badge ${score === 14 ? 'badge--green' : 'badge--orange'}`}>
              {score} / 14 correct{score === 14 ? ' — Parfait !' : ''}
            </span>
          </div>
        )}

        <div
          className="scrum-palette"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropOnPalette}
        >
          <p className="scrum-palette__title">Éléments à placer</p>
          <div className="scrum-palette__labels">
            {paletteLabels.map(label => (
              <span
                key={label}
                data-label={label}
                className="scrum-label"
                draggable
                onDragStart={() => handleDragStart(label)}
              >
                {label}
              </span>
            ))}
            {paletteLabels.length === 0 && (
              <span className="scrum-palette__empty">Tous les éléments ont été placés</span>
            )}
          </div>
        </div>

        <div className="scrum-actions">
          <button
            className="btn btn--primary"
            onClick={handleVerify}
            disabled={!allFilled}
          >
            Vérifier
          </button>
          {verifyResult && (
            <button className="btn btn--secondary" onClick={handleReset}>
              Réessayer
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <ConfirmLeaveModal
          title="Quitter l'atelier ?"
          body="Votre progression sera perdue."
          cancelLabel="Continuer"
          confirmLabel="Quitter quand même"
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}
    </>
  )
}
