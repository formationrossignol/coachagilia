import type { ClassificationDataset } from '../types'

export const stakeholderMappingDataset: ClassificationDataset = {
  zones: [
    { id: 'high-high', label: 'Influence élevée / Intérêt élevé',  description: 'Gérer étroitement' },
    { id: 'high-low',  label: 'Influence élevée / Intérêt faible', description: 'Satisfaire' },
    { id: 'low-high',  label: 'Influence faible / Intérêt élevé',  description: 'Informer' },
    { id: 'low-low',   label: 'Influence faible / Intérêt faible', description: 'Surveiller' },
  ],
  cards: [
    { id: 'st1', text: 'Sponsor du projet avec fort enjeu business',              expectedZone: 'high-high' },
    { id: 'st2', text: 'Product Owner directement responsable du produit',        expectedZone: 'high-high' },
    { id: 'st3', text: 'Direction IT décisionnaire mais peu impliquée au quotidien', expectedZone: 'high-low' },
    { id: 'st4', text: 'Responsable sécurité validant les livraisons',            expectedZone: 'high-low' },
    { id: 'st5', text: 'Utilisateurs finaux impliqués dans les tests',            expectedZone: 'low-high' },
    { id: 'st6', text: 'Support applicatif en contact avec les clients',          expectedZone: 'low-high' },
    { id: 'st7', text: 'Département administratif peu concerné',                  expectedZone: 'low-low' },
    { id: 'st8', text: 'Observateur occasionnel du projet',                       expectedZone: 'low-low' },
  ],
}
