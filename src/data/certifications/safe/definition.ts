import type { CertDefinition } from '../types'
import { safeQuestions } from './exams'
import { safeResources } from './resources'

export const safeDefinition: CertDefinition = {
  id: 'safe',
  name: 'Scaled Agile Framework',
  shortName: 'SAFe',
  issuer: 'Scaled Agile',
  levels: ['SA', 'SP', 'SPC', 'SPCT'],
  color: '#ef4444',
  topics: [
    { slug: 'lean-agile', label: 'Lean-Agile Mindset' },
    { slug: 'art', label: 'Agile Release Train' },
    { slug: 'pi-planning', label: 'PI Planning' },
    { slug: 'rte', label: 'RTE & Rôles' },
    { slug: 'portfolio', label: 'Portfolio SAFe' },
    { slug: 'large-solution', label: 'Large Solution' },
    { slug: 'continuous-delivery', label: 'Continuous Delivery' },
    { slug: 'built-in-quality', label: 'Built-in Quality' },
    { slug: 'metrics', label: 'Métriques & OKRs' },
    { slug: 'transformation', label: 'Transformation SAFe' },
  ],
  examDefs: [
    { id: 'safe-full-1', title: 'SAFe SA — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'safe-quick', title: 'SAFe SA — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'safe-random', title: 'SAFe SA — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: safeQuestions,
  resources: safeResources,
}
