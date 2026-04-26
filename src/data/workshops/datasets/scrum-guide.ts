import type { ClassificationDataset } from '../types'

export const scrumGuideDataset: ClassificationDataset = {
  zones: [
    { id: 'roles',       label: 'Responsabilités', description: 'Product Owner, Scrum Master, Developers' },
    { id: 'events',      label: 'Événements',       description: 'Sprint, Planning, Daily, Review, Retrospective' },
    { id: 'artifacts',   label: 'Artefacts',        description: 'Product Backlog, Sprint Backlog, Increment' },
    { id: 'commitments', label: 'Engagements',      description: 'Objectif Produit, Objectif Sprint, Definition of Done' },
  ],
  cards: [
    { id: 'r1', text: 'Product Owner',           expectedZone: 'roles' },
    { id: 'r2', text: 'Scrum Master',            expectedZone: 'roles' },
    { id: 'r3', text: 'Developers',              expectedZone: 'roles' },
    { id: 'e1', text: 'Sprint',                  expectedZone: 'events' },
    { id: 'e2', text: 'Sprint Planning',         expectedZone: 'events' },
    { id: 'e3', text: 'Daily Scrum',             expectedZone: 'events' },
    { id: 'e4', text: 'Sprint Review',           expectedZone: 'events' },
    { id: 'e5', text: 'Sprint Retrospective',    expectedZone: 'events' },
    { id: 'a1', text: 'Product Backlog',         expectedZone: 'artifacts' },
    { id: 'a2', text: 'Sprint Backlog',          expectedZone: 'artifacts' },
    { id: 'a3', text: 'Increment',               expectedZone: 'artifacts' },
    { id: 'c1', text: 'Objectif Produit',        expectedZone: 'commitments' },
    { id: 'c2', text: 'Objectif Sprint',         expectedZone: 'commitments' },
    { id: 'c3', text: "Définition du « Done »",  expectedZone: 'commitments' },
  ],
}
