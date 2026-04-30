import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useWorkshopCompletion } from '../../hooks/useWorkshopCompletion'
import {
  User, Compass, Code, Calendar, ClipboardList, MessageSquare, BarChart2,
  RotateCcw, List, ListChecks, Package, Target, Flag, FileCheck,
  CheckCircle, Shield, Crosshair, Globe, Heart,
  Eye, Search, RefreshCw,
} from 'lucide-react'
import { WORKSHOP_DEFINITIONS } from '../../data/workshops'
import { WorkshopPedagogyPanel } from '../WorkshopPedagogyPanel'
import { useExitGuard } from '../../hooks/useExitGuard'
import { ConfirmLeaveModal } from '../ui/ConfirmLeaveModal'

type ZoneType = 'role' | 'event' | 'artifact' | 'commitment' | 'value' | 'pillar'

type ZoneDef = {
  answer: string
  type: ZoneType
  Icon: LucideIcon
}

const ZONE_CONFIG: Record<string, ZoneDef> = {
  /* ── Roles ─────────────────────────────────────────── */
  'product-owner':        { answer: 'Product Owner',           type: 'role',       Icon: User },
  'scrum-master':         { answer: 'Scrum Master',            type: 'role',       Icon: Compass },
  'developers':           { answer: 'Developers',              type: 'role',       Icon: Code },
  /* ── Events ─────────────────────────────────────────── */
  'sprint':               { answer: 'Sprint',                  type: 'event',      Icon: Calendar },
  'sprint-planning':      { answer: 'Sprint Planning',         type: 'event',      Icon: ClipboardList },
  'daily-scrum':          { answer: 'Daily Scrum',             type: 'event',      Icon: MessageSquare },
  'sprint-review':        { answer: 'Sprint Review',           type: 'event',      Icon: BarChart2 },
  'sprint-retrospective': { answer: 'Sprint Retrospective',    type: 'event',      Icon: RotateCcw },
  /* ── Artifacts ───────────────────────────────────────── */
  'product-backlog':      { answer: 'Product Backlog',         type: 'artifact',   Icon: List },
  'sprint-backlog':       { answer: 'Sprint Backlog',          type: 'artifact',   Icon: ListChecks },
  'increment':            { answer: 'Increment',               type: 'artifact',   Icon: Package },
  /* ── Commitments ─────────────────────────────────────── */
  'objectif-produit':     { answer: 'Objectif Produit',        type: 'commitment', Icon: Target },
  'objectif-sprint':      { answer: 'Objectif Sprint',         type: 'commitment', Icon: Flag },
  'definition-done':      { answer: 'Définition du « Done »', type: 'commitment', Icon: FileCheck },
  /* ── Scrum Values ────────────────────────────────────── */
  'value-commitment': { answer: 'Commitment', type: 'value', Icon: CheckCircle },
  'value-courage':    { answer: 'Courage',    type: 'value', Icon: Shield },
  'value-focus':      { answer: 'Focus',      type: 'value', Icon: Crosshair },
  'value-openness':   { answer: 'Openness',   type: 'value', Icon: Globe },
  'value-respect':    { answer: 'Respect',    type: 'value', Icon: Heart },
  /* ── Empirical Pillars ───────────────────────────────── */
  'pillar-transparency': { answer: 'Transparence', type: 'pillar', Icon: Eye },
  'pillar-inspection':   { answer: 'Inspection',   type: 'pillar', Icon: Search },
  'pillar-adaptation':   { answer: 'Adaptation',   type: 'pillar', Icon: RefreshCw },
}

const ALL_LABELS = Object.values(ZONE_CONFIG).map(c => c.answer)
const ZONE_IDS = Object.keys(ZONE_CONFIG)

const LABEL_MAP: Record<string, ZoneDef> = Object.fromEntries(
  Object.entries(ZONE_CONFIG).map(([, def]) => [def.answer, def])
)

type ZoneState = Record<string, string>
type VerifyState = Record<string, boolean>

const TYPE_LABEL: Record<ZoneType, string> = {
  role: 'Rôle', event: 'Événement', artifact: 'Artefact',
  commitment: 'Engagement', value: 'Valeur', pillar: 'Pilier',
}

function TypeBadge({ type }: { type: ZoneType }) {
  return <span className={`scrum-type-badge scrum-type-badge--${type}`}>{TYPE_LABEL[type]}</span>
}

function DropZone({
  zoneId, label, verifyResult, onDrop, onDragStart,
}: {
  zoneId: string
  label: string
  verifyResult: VerifyState | null
  onDrop: (zoneId: string) => void
  onDragStart: (label: string, fromZone?: string) => void
}) {
  const config = ZONE_CONFIG[zoneId]
  const { Icon, type } = config
  const verified = verifyResult !== null
  const correct = verifyResult?.[zoneId]

  return (
    <div
      data-zone={zoneId}
      role="region"
      aria-label={`Zone ${zoneId}`}
      className={[
        'scrum-zone',
        `scrum-zone--${type}`,
        label ? 'scrum-zone--filled' : 'scrum-zone--empty',
        verified ? (correct ? 'scrum-zone--correct' : 'scrum-zone--wrong') : '',
      ].filter(Boolean).join(' ')}
      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('scrum-zone--hover') }}
      onDragLeave={e => e.currentTarget.classList.remove('scrum-zone--hover')}
      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('scrum-zone--hover'); onDrop(zoneId) }}
    >
      {label ? (
        <span
          className={`scrum-label scrum-label--placed scrum-label--${type}`}
          draggable
          onDragStart={() => onDragStart(label, zoneId)}
        >
          <Icon size={12} strokeWidth={2} aria-hidden="true" />
          {label}
        </span>
      ) : (
        <div className="scrum-zone__placeholder">
          <Icon size={20} className="scrum-zone__icon" aria-hidden="true" />
          <TypeBadge type={type} />
        </div>
      )}
    </div>
  )
}

export function ScrumGuideAtelier() {
  const { markComplete } = useWorkshopCompletion('scrum-guide')
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
    markComplete()
    const result: VerifyState = {}
    for (const zoneId of ZONE_IDS) {
      result[zoneId] = zones[zoneId] === ZONE_CONFIG[zoneId].answer
    }
    setVerifyResult(result)
  }

  function handleReset() {
    setZones(Object.fromEntries(ZONE_IDS.map(id => [id, ''])))
    setVerifyResult(null)
  }

  const score = verifyResult ? Object.values(verifyResult).filter(Boolean).length : null

  const dz = (id: string) => (
    <DropZone
      zoneId={id}
      label={zones[id]}
      verifyResult={verifyResult}
      onDrop={handleDropOnZone}
      onDragStart={handleDragStart}
    />
  )

  return (
    <>
    <div className="atelier-page">
      <WorkshopPedagogyPanel workshop={WORKSHOP_DEFINITIONS.find(w => w.id === 'scrum-guide')!} />
      <header className="atelier-header">
        <h1 className="atelier-title">Le cadre Scrum</h1>
        <p className="atelier-subtitle">Replacez les 22 éléments du Scrum Guide au bon endroit.</p>
      </header>

      {/* ── Top: Values + Pillars ── */}
      <div className="scrum-foundations">
        <div className="scrum-foundation-block scrum-foundation-block--value">
          <div className="scrum-foundation-header scrum-foundation-header--value">
            Valeurs Scrum
          </div>
          <div className="scrum-foundation-zones">
            {dz('value-commitment')}
            {dz('value-courage')}
            {dz('value-focus')}
            {dz('value-openness')}
            {dz('value-respect')}
          </div>
        </div>

        <div className="scrum-foundation-block scrum-foundation-block--pillar">
          <div className="scrum-foundation-header scrum-foundation-header--pillar">
            Piliers de l'Empirisme
          </div>
          <div className="scrum-foundation-zones">
            {dz('pillar-transparency')}
            {dz('pillar-inspection')}
            {dz('pillar-adaptation')}
          </div>
        </div>
      </div>

      {/* ── Main diagram ── */}
      <div className="scrum-diagram">
        {/* Left: Product Owner + Product Backlog */}
        <div className="scrum-col scrum-col--left">
          <div className="scrum-section-block scrum-section-block--role">
            <div className="scrum-section-header scrum-section-header--role">Rôle</div>
            {dz('product-owner')}
          </div>

          <div className="scrum-section-block scrum-section-block--artifact">
            <div className="scrum-section-header scrum-section-header--artifact">Artefact</div>
            {dz('product-backlog')}
            <div className="scrum-commitment-row">
              <span className="scrum-commitment-label">Engagement</span>
              {dz('objectif-produit')}
            </div>
          </div>
        </div>

        <div className="scrum-col-arrow" aria-hidden="true">→</div>

        {/* Center: Sprint box */}
        <div className="scrum-col scrum-col--center">
          <div className="scrum-sprint-box">
            <div className="scrum-sprint-header">
              <div className="scrum-sprint-title-row">
                {dz('sprint')}
                <span className="scrum-sprint-duration">2–4 semaines</span>
              </div>
            </div>

            <div className="scrum-sprint-flow">
              <div className="scrum-flow-step">
                <div className="scrum-section-header scrum-section-header--event">Événement</div>
                {dz('sprint-planning')}
              </div>

              <div className="scrum-flow-connector" aria-hidden="true">→</div>

              <div className="scrum-flow-step scrum-flow-step--mid">
                <div className="scrum-section-header scrum-section-header--role">Rôle</div>
                {dz('developers')}
                <div className="scrum-section-header scrum-section-header--event" style={{ marginTop: '0.6rem' }}>Événement</div>
                {dz('daily-scrum')}
              </div>

              <div className="scrum-flow-connector" aria-hidden="true">→</div>

              <div className="scrum-flow-step">
                <div className="scrum-section-header scrum-section-header--event">Événement</div>
                {dz('sprint-review')}
              </div>
            </div>
          </div>

          <div className="scrum-retro-row">
            <div className="scrum-section-block scrum-section-block--event" style={{ flex: 1 }}>
              <div className="scrum-section-header scrum-section-header--event">Événement</div>
              {dz('sprint-retrospective')}
            </div>
            <div className="scrum-section-block scrum-section-block--role" style={{ flex: 1 }}>
              <div className="scrum-section-header scrum-section-header--role">Rôle</div>
              {dz('scrum-master')}
            </div>
          </div>
        </div>

        <div className="scrum-col-arrow" aria-hidden="true">→</div>

        {/* Right: Sprint Backlog + Increment */}
        <div className="scrum-col scrum-col--right">
          <div className="scrum-section-block scrum-section-block--artifact">
            <div className="scrum-section-header scrum-section-header--artifact">Artefact</div>
            {dz('sprint-backlog')}
            <div className="scrum-commitment-row">
              <span className="scrum-commitment-label">Engagement</span>
              {dz('objectif-sprint')}
            </div>
          </div>

          <div className="scrum-section-block scrum-section-block--artifact">
            <div className="scrum-section-header scrum-section-header--artifact">Artefact</div>
            {dz('increment')}
            <div className="scrum-commitment-row">
              <span className="scrum-commitment-label">Engagement</span>
              {dz('definition-done')}
            </div>
          </div>
        </div>
      </div>

      {verifyResult && (
        <div className="scrum-score-banner">
          <span className={`badge ${score === 22 ? 'badge--green' : 'badge--orange'}`}>
            {score} / 22 correct{score === 22 ? ' — Parfait !' : ''}
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
          {paletteLabels.map(label => {
            const def = LABEL_MAP[label]
            return (
              <span
                key={label}
                data-label={label}
                className={`scrum-label scrum-label--${def.type}`}
                draggable
                onDragStart={() => handleDragStart(label)}
              >
                <def.Icon size={12} strokeWidth={2} aria-hidden="true" />
                {label}
              </span>
            )
          })}
          {paletteLabels.length === 0 && (
            <span className="scrum-palette__empty">Tous les éléments ont été placés</span>
          )}
        </div>
      </div>

      <div className="scrum-actions">
        <button className="btn btn--primary" onClick={handleVerify} disabled={!allFilled}>
          Vérifier
        </button>
        {verifyResult && (
          <button className="btn btn--secondary" onClick={handleReset}>Réessayer</button>
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
