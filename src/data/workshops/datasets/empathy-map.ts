import type { ClassificationDataset } from '../types'

export const empathyMapDataset: ClassificationDataset = {
  zones: [
    { id: 'says',   label: 'Dit',     description: "Ce que la personne exprime explicitement, à l'oral ou à l'écrit." },
    { id: 'thinks', label: 'Pense',   description: 'Ce que la personne peut croire, anticiper, craindre ou questionner intérieurement.' },
    { id: 'does',   label: 'Fait',    description: 'Les comportements observables, actions, réactions ou routines.' },
    { id: 'feels',  label: 'Ressent', description: 'Les émotions, tensions, frustrations ou motivations ressenties.' },
  ],
  cards: [
    { id: 'c1',  text: "\"Je ne comprends pas pourquoi cette fonctionnalité est prioritaire.\"",   expectedZone: 'says' },
    { id: 'c2',  text: "\"Je perds trop de temps à chercher l'information.\"",                      expectedZone: 'says' },
    { id: 'c3',  text: "\"Le Daily ne m'aide pas vraiment à avancer.\"",                            expectedZone: 'says' },
    { id: 'c4',  text: "Il se demande si son avis est vraiment pris en compte.",                    expectedZone: 'thinks' },
    { id: 'c5',  text: "Elle pense que le produit devient trop complexe pour les utilisateurs.",    expectedZone: 'thinks' },
    { id: 'c6',  text: "Il craint que l'équipe ne soit pas prête pour la démonstration client.",    expectedZone: 'thinks' },
    { id: 'c7',  text: "Il consulte plusieurs outils avant de trouver la bonne information.",       expectedZone: 'does' },
    { id: 'c8',  text: "Elle évite de prendre la parole pendant les rétrospectives.",               expectedZone: 'does' },
    { id: 'c9',  text: "Il contacte directement un développeur au lieu de passer par le backlog.", expectedZone: 'does' },
    { id: 'c10', text: "Il se sent frustré par le manque de visibilité.",                           expectedZone: 'feels' },
    { id: 'c11', text: "Elle est rassurée quand les priorités sont clairement expliquées.",         expectedZone: 'feels' },
    { id: 'c12', text: "Il ressent de la pression à l'approche de la Sprint Review.",              expectedZone: 'feels' },
  ],
}
