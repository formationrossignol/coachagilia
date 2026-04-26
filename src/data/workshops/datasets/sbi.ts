import type { ClassificationDataset } from '../types'

export const sbiDataset: ClassificationDataset = {
  zones: [
    { id: 'situation', label: 'Situation', description: 'Contexte précis (quand, où)' },
    { id: 'behavior',  label: 'Behavior',  description: 'Comportement observable' },
    { id: 'impact',    label: 'Impact',    description: 'Effet produit' },
  ],
  cards: [
    { id: 's1', text: 'Lors du Daily Scrum de ce matin…',               expectedZone: 'situation' },
    { id: 's2', text: 'Pendant la Sprint Review de vendredi…',           expectedZone: 'situation' },
    { id: 's3', text: 'Lors de la dernière rétrospective…',             expectedZone: 'situation' },
    { id: 's4', text: 'Hier lors du refinement…',                       expectedZone: 'situation' },
    { id: 'b1', text: 'Tu as interrompu plusieurs fois les autres…',     expectedZone: 'behavior' },
    { id: 'b2', text: "Tu n'as pas partagé l'avancement de tes tâches…", expectedZone: 'behavior' },
    { id: 'b3', text: 'Tu as proposé une solution sans écouter…',        expectedZone: 'behavior' },
    { id: 'b4', text: 'Tu as quitté la réunion sans prévenir…',         expectedZone: 'behavior' },
    { id: 'i1', text: "Cela a créé de la confusion dans l'équipe…",     expectedZone: 'impact' },
    { id: 'i2', text: 'Cela a ralenti la prise de décision…',           expectedZone: 'impact' },
    { id: 'i3', text: 'Cela a frustré plusieurs membres…',              expectedZone: 'impact' },
    { id: 'i4', text: "Cela a empêché une bonne collaboration…",        expectedZone: 'impact' },
  ],
}
