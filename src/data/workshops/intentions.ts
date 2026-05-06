export interface WorkshopIntention {
  slug: string
  name: string
  label: string
  emoji: string
  subtitle: string
}

export const WORKSHOP_INTENTIONS: WorkshopIntention[] = [
  { slug: 'gerer-conflit',             label: 'Conflits',        name: 'Gérer un conflit',              emoji: '⚡', subtitle: 'Tensions, feedback, négociation' },
  { slug: 'faciliter-decision',        label: 'Décision',        name: 'Faciliter une décision',        emoji: '⚖️', subtitle: 'Consensus, vote, arbitrage' },
  { slug: 'debloquer-equipe',          label: 'Équipe',          name: 'Débloquer une équipe',          emoji: '🧩', subtitle: 'Co-dev, facilitation, résilience' },
  { slug: 'preparer-retro',            label: 'Rétrospective',   name: 'Préparer une rétrospective',    emoji: '🔄', subtitle: 'Formats, techniques, animation' },
  { slug: 'cause-racine',              label: 'Diagnostic',      name: 'Trouver une cause racine',      emoji: '🔍', subtitle: 'Analyse, Ishikawa, TRIZ' },
  { slug: 'aligner-parties-prenantes', label: 'Alignement',      name: 'Aligner les parties prenantes', emoji: '🤝', subtitle: 'Cartographie, engagement' },
  { slug: 'ameliorer-flow',            label: 'Flow',            name: 'Améliorer le flow',             emoji: '📈', subtitle: 'Systèmes, flux, livraison' },
  { slug: 'preparer-coaching',         label: 'Coaching',        name: 'Préparer un coaching',          emoji: '🎯', subtitle: 'Questions, posture, GROW' },
]

export const INTENTION_WORKSHOP_MAP: Record<string, string[]> = {
  'gerer-conflit': [
    'thomas-kilmann', 'sbi', 'nonviolent-communication', 'radical-candor',
    'crucial-conversations', 'desc', 'feedforward', 'difficult-conversations', 'johari-window',
  ],
  'faciliter-decision': [
    'cynefin-framework', 'delegation-poker', 'troika-consulting', 'raci', 'daci', 'rapid',
    'decision-matrix', 'decision-tree', 'premortem', 'dot-voting', 'fist-of-five',
    'roman-voting', 'six-thinking-hats',
  ],
  'debloquer-equipe': [
    'troika-consulting', 'triz', 'moving-motivators', 'cynefin-framework',
    'liberating-structures', '1-2-4-all', 'fishbowl-discussion', 'appreciative-inquiry', 'scrum-guide',
  ],
  'preparer-retro': [
    'troika-consulting', 'triz', 'ishikawa', 'start-stop-continue', 'starfish', 'sailboat',
    'mad-sad-glad', '4-ls', 'timeline-retro', 'futurespective', 'retrospective-radar', 'happiness-door',
  ],
  'cause-racine': [
    'ishikawa', 'triz', '5-whys', 'root-cause-analysis', 'a3', 'dmaic', 'cynefin-framework',
  ],
  'aligner-parties-prenantes': [
    'stakeholder-mapping', 'customer-journey-mapping', 'service-blueprint',
    'impact-mapping', 'elevator-pitch',
  ],
  'ameliorer-flow': [
    'cynefin-framework', 'value-stream-mapping', 'kanban', 'littles-law',
    'pdca', 'kaizen', 'dora-metrics', 'dod-review', 'dor-review',
  ],
  'preparer-coaching': [
    'grow-model', 'ask-vs-tell', 'powerful-questions', 'solution-focused-coaching',
    'clean-language', 'systemic-coaching', 'immunity-to-change',
  ],
}
