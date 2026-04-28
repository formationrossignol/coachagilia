export type WorkshopCategorySlug =
  | 'conflict-and-communication'
  | 'facilitation'
  | 'coaching-and-posture'
  | 'leadership'
  | 'team-intelligence'
  | 'management-3-0'
  | 'retrospectives'
  | 'problem-solving'
  | 'stakeholders-and-alignment'
  | 'product-discovery'
  | 'prioritization'
  | 'decision-making'
  | 'delivery-excellence'
  | 'systems-thinking'
  | 'organization-design'
  | 'change-management'
  | 'strategic-thinking'

export interface WorkshopCategory {
  slug: WorkshopCategorySlug
  name: string
  description: string
}

export type WorkshopLevel = 'beginner' | 'intermediate' | 'advanced'

export type WorkshopInteractionType =
  | 'drag-and-drop'
  | 'canvas'
  | 'ranking'
  | 'matrix'
  | 'guided-form'
  | 'voting'
  | 'dialogue'
  | 'diagram'
  | 'reflection'

export const LEVEL_LABELS: Record<WorkshopLevel, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
}

export const LEVEL_BADGE_VARIANT: Record<WorkshopLevel, 'green' | 'orange' | 'red'> = {
  beginner: 'green',
  intermediate: 'orange',
  advanced: 'red',
}

export const INTERACTION_TYPE_LABELS: Record<WorkshopInteractionType, string> = {
  'drag-and-drop': 'Drag & Drop',
  canvas: 'Canvas',
  ranking: 'Classement',
  matrix: 'Matrice',
  'guided-form': 'Formulaire guidé',
  voting: 'Vote',
  dialogue: 'Dialogue',
  diagram: 'Diagramme',
  reflection: 'Réflexion',
}

export interface ClassificationDataset {
  zones: { id: string; label: string; description: string }[]
  cards: { id: string; text: string; expectedZone: string; explanation?: string }[]
}

export interface RankingDataset {
  cards: { id: string; label: string; description: string }[]
}

export interface CanvasDataset {
  sections: { id: string; title: string; description: string; placeholder?: string }[]
  examples?: { sectionId: string; text: string }[]
}

export interface VotingDataset {
  proposal: string
  options: { id: string; label: string; description?: string }[]
}

export type WorkshopDataset =
  | ClassificationDataset
  | RankingDataset
  | CanvasDataset
  | VotingDataset

export interface WorkshopPedagogy {
  objectives: string[]
  toolExplanation: string
  whenToUse: string[]
  expectedOutput: string[]
  prerequisites?: string[]
}

export interface WorkshopDefinition {
  id: string
  slug: string
  title: string
  route: string
  categorySlug: WorkshopCategorySlug
  toolName: string
  level: WorkshopLevel
  durationMinutes: number
  interactionType: WorkshopInteractionType
  summary: string
  comingSoon?: true
  pedagogy?: WorkshopPedagogy
  dataset?: WorkshopDataset
}
