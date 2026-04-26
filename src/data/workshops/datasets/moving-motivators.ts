import type { RankingDataset } from '../types'

export const movingMotivatorsDataset: RankingDataset = {
  cards: [
    { id: 'curiosity',   label: 'Curiosity',   description: 'Apprendre et explorer de nouvelles idées' },
    { id: 'honor',       label: 'Honor',       description: 'Agir en accord avec ses valeurs' },
    { id: 'acceptance',  label: 'Acceptance',  description: 'Être reconnu et accepté par les autres' },
    { id: 'mastery',     label: 'Mastery',     description: 'Progresser et devenir expert dans son domaine' },
    { id: 'power',       label: 'Power',       description: "Influencer les décisions et avoir de l'impact" },
    { id: 'freedom',     label: 'Freedom',     description: 'Être autonome et indépendant' },
    { id: 'relatedness', label: 'Relatedness', description: 'Créer des liens et appartenir à un groupe' },
    { id: 'order',       label: 'Order',       description: 'Avoir de la structure et de la stabilité' },
    { id: 'goal',        label: 'Goal',        description: 'Avoir un objectif clair et une mission' },
    { id: 'status',      label: 'Status',      description: 'Être reconnu et respecté socialement' },
  ],
}
