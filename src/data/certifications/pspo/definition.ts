import type { CertDefinition } from '../types'
import { pspoQuestions } from './exams'
import { pspoResources } from './resources'

export const pspoDefinition: CertDefinition = {
  id: 'pspo',
  name: 'Professional Scrum Product Owner',
  shortName: 'PSPO',
  issuer: 'Scrum.org',
  levels: ['PSPO I', 'PSPO II', 'PSPO III'],
  color: '#10b981',
  topics: [
    { slug: 'product-value', label: 'Product Value' },
    { slug: 'product-backlog', label: 'Product Backlog' },
    { slug: 'product-goal', label: 'Product Goal' },
    { slug: 'sprint', label: 'Sprint Management' },
    { slug: 'stakeholders', label: 'Stakeholder Management' },
    { slug: 'product-strategy', label: 'Product Strategy' },
    { slug: 'metrics', label: 'Métriques & ROI' },
  ],
  examDefs: [
    { id: 'pspo-full-1', title: 'PSPO I — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'pspo-quick', title: 'PSPO I — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'pspo-random', title: 'PSPO I — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: pspoQuestions,
  resources: pspoResources,
}
