import type { SkillArea } from '../../features/gamification'
import { MASTERY_THRESHOLDS } from '../../features/gamification'
import { SKILL_AREAS, SKILL_LABELS } from './constants'

const CX = 200
const CY = 200
const MAX_RADIUS = 155
const MAX_XP = MASTERY_THRESHOLDS.transmission  // 3000

function toXY(cx: number, cy: number, radius: number, angle: number) {
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
}

interface Props {
  skills: Partial<Record<SkillArea, number>>
}

export function SkillRadar({ skills }: Props) {
  const n = SKILL_AREAS.length
  const angles = SKILL_AREAS.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n)

  const polygonPoints = SKILL_AREAS.map((skill, i) => {
    const xp = skills[skill] ?? 0
    const r = Math.min(1, xp / MAX_XP) * MAX_RADIUS
    const { x, y } = toXY(CX, CY, r, angles[i])
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 400 400"
      className="skill-radar"
      role="img"
      aria-label="Radar des compétences"
    >
      {[0.25, 0.5, 0.75, 1.0].map(level => (
        <circle
          key={level}
          cx={CX}
          cy={CY}
          r={level * MAX_RADIUS}
          className="skill-radar__grid-circle"
        />
      ))}

      {SKILL_AREAS.map((skill, i) => {
        const { x, y } = toXY(CX, CY, MAX_RADIUS, angles[i])
        return (
          <line
            key={skill}
            x1={CX} y1={CY}
            x2={x.toFixed(1)} y2={y.toFixed(1)}
            className="skill-radar__axis"
          />
        )
      })}

      <polygon points={polygonPoints} className="skill-radar__polygon" />

      {SKILL_AREAS.map((skill, i) => {
        const { x, y } = toXY(CX, CY, MAX_RADIUS + 22, angles[i])
        return (
          <text
            key={skill}
            x={x.toFixed(1)}
            y={y.toFixed(1)}
            className="skill-radar__label"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {SKILL_LABELS[skill]}
          </text>
        )
      })}
    </svg>
  )
}
