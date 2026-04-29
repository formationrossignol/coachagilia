import type { SkillArea, ArtifactType } from '../../features/gamification'

export const SKILL_AREAS: SkillArea[] = [
  'conflict', 'communication', 'feedback', 'coaching',
  'facilitation', 'retrospective', 'problem_solving', 'team_health',
  'management_3_0', 'product_discovery', 'prioritization',
  'stakeholder_management', 'decision_making', 'flow',
  'delivery_excellence', 'systems_thinking', 'organization_design',
  'change_management', 'leadership',
]

export const SKILL_LABELS: Record<SkillArea, string> = {
  conflict: 'Conflit',
  communication: 'Communication',
  feedback: 'Feedback',
  coaching: 'Coaching',
  facilitation: 'Facilitation',
  retrospective: 'Rétrospective',
  problem_solving: 'Résolution',
  team_health: 'Santé équipe',
  management_3_0: 'Mgt 3.0',
  product_discovery: 'Découverte produit',
  prioritization: 'Priorisation',
  stakeholder_management: 'Parties prenantes',
  decision_making: 'Décision',
  flow: 'Flow',
  delivery_excellence: 'Livraison',
  systems_thinking: 'Systémique',
  organization_design: 'Design org.',
  change_management: 'Changement',
  leadership: 'Leadership',
}

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  feedback_sbi: 'Feedback SBI',
  grow_plan: 'Plan GROW',
  stakeholder_map: 'Carte parties prenantes',
  fishbone_diagram: 'Diagramme Ishikawa',
  five_whys: '5 Pourquoi',
  team_charter: "Charte d'équipe",
  working_agreements: 'Accords de travail',
  delegation_board: 'Tableau de délégation',
  facilitation_canvas: 'Canvas facilitation',
  retrospective_board: 'Board rétrospective',
  risk_map: 'Carte des risques',
  decision_matrix: 'Matrice de décision',
  customer_journey: 'Parcours client',
  value_stream_map: 'Value stream map',
  desc_message: 'Message DESC',
}
