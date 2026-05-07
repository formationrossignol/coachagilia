import type { CertDefinition } from '../types'
import { pmiacpQuestions } from './exams'
import { pmiacpResources } from './resources'

export const pmiacpDefinition: CertDefinition = {
  id: 'pmi-acp',
  name: 'PMI Agile Certified Practitioner',
  shortName: 'ACP',
  issuer: 'PMI',
  levels: ['PMI-ACP'],
  color: '#f59e0b',
  topics: [
    { slug: 'agile-mindset', label: 'Agile Mindset' },
    { slug: 'value-delivery', label: 'Value-Driven Delivery' },
    { slug: 'stakeholder-engagement', label: 'Stakeholder Engagement' },
    { slug: 'team-performance', label: 'Team Performance' },
    { slug: 'adaptive-planning', label: 'Adaptive Planning' },
    { slug: 'continuous-improvement', label: 'Continuous Improvement' },
    { slug: 'kanban', label: 'Kanban & Flow' },
    { slug: 'problem-detection', label: 'Problem Detection' },
    { slug: 'xp-lean', label: 'XP & Lean' },
  ],
  examDefs: [
    { id: 'pmi-acp-full-1', title: 'PMI-ACP — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'pmi-acp-quick', title: 'PMI-ACP — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'pmi-acp-random', title: 'PMI-ACP — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: pmiacpQuestions,
  resources: pmiacpResources,
}
