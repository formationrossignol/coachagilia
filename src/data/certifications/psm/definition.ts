import type { CertDefinition } from '../types'
import { psmQuestions } from './exams'
import { psmResources } from './resources'

export const psmDefinition: CertDefinition = {
  id: 'psm',
  name: 'Professional Scrum Master',
  shortName: 'PSM',
  issuer: 'Scrum.org',
  levels: ['PSM I', 'PSM II', 'PSM III'],
  color: '#6366f1',
  topics: [
    { slug: 'scrum-theory', label: 'Scrum Theory' },
    { slug: 'scrum-team', label: 'Scrum Team' },
    { slug: 'scrum-events', label: 'Scrum Events' },
    { slug: 'scrum-artifacts', label: 'Scrum Artifacts' },
    { slug: 'done-quality', label: 'Done & Quality' },
    { slug: 'scaling', label: 'Scaling' },
    { slug: 'coaching', label: 'Coaching' },
    { slug: 'facilitation', label: 'Facilitation' },
  ],
  examDefs: [
    { id: 'psm-full-1', title: 'PSM I — Examen complet', questionCount: 80, durationMinutes: 60, mode: 'full' },
    { id: 'psm-quick', title: 'PSM I — Examen rapide', questionCount: 40, durationMinutes: 30, mode: 'quick' },
    { id: 'psm-random', title: 'PSM I — Aléatoire', questionCount: 80, durationMinutes: 60, mode: 'random' },
  ],
  questions: psmQuestions,
  resources: psmResources,
}
