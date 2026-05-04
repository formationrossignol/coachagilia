export interface WorkshopIntention {
  slug: string
  name: string
  emoji: string
  subtitle: string
}

export const WORKSHOP_INTENTIONS: WorkshopIntention[] = [
  { slug: 'gerer-conflit',             name: 'Gérer un conflit',              emoji: '⚡', subtitle: 'Tensions, feedback, négociation' },
  { slug: 'faciliter-decision',        name: 'Faciliter une décision',        emoji: '⚖️', subtitle: 'Consensus, vote, arbitrage' },
  { slug: 'debloquer-equipe',          name: 'Débloquer une équipe',          emoji: '🧩', subtitle: 'Co-dev, facilitation, résilience' },
  { slug: 'preparer-retro',            name: 'Préparer une rétrospective',    emoji: '🔄', subtitle: 'Formats, techniques, animation' },
  { slug: 'cause-racine',              name: 'Trouver une cause racine',      emoji: '🔍', subtitle: 'Analyse, Ishikawa, TRIZ' },
  { slug: 'aligner-parties-prenantes', name: 'Aligner les parties prenantes', emoji: '🤝', subtitle: 'Cartographie, engagement' },
  { slug: 'ameliorer-flow',            name: 'Améliorer le flow',             emoji: '📈', subtitle: 'Systèmes, flux, livraison' },
  { slug: 'preparer-coaching',         name: 'Préparer un coaching',          emoji: '🎯', subtitle: 'Questions, posture, GROW' },
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
