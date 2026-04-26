import type { ClassificationDataset } from '../types'

export const troikaConsultingDataset: ClassificationDataset = {
  zones: [
    { id: 'problem',       label: 'Présentation du problème',   description: 'Le porteur expose son défi' },
    { id: 'clarification', label: 'Questions de clarification', description: 'Les consultants posent des questions' },
    { id: 'consultants',   label: 'Échange consultants',        description: 'Les consultants discutent entre eux' },
    { id: 'reaction',      label: 'Réaction du porteur',        description: "Le porteur partage ce qu'il retient" },
    { id: 'action',        label: "Plan d'action",              description: 'Définition des prochaines actions' },
  ],
  cards: [
    { id: 'i1',  text: "Mon équipe ne participe pas en rétrospective.",                                  expectedZone: 'problem' },
    { id: 'i2',  text: "Mon équipe ne respecte pas la Definition of Done.",                              expectedZone: 'problem' },
    { id: 'i3',  text: "Je n'arrive pas à faire adhérer le Product Owner.",                             expectedZone: 'problem' },
    { id: 'i4',  text: "Qu'as-tu déjà essayé ?",                                                        expectedZone: 'clarification' },
    { id: 'i5',  text: 'Depuis combien de temps cette situation dure ?',                                  expectedZone: 'clarification' },
    { id: 'i6',  text: "Qu'est-ce qui fonctionne déjà un peu ?",                                        expectedZone: 'clarification' },
    { id: 'i7',  text: "On dirait qu'il y a un problème de sécurité psychologique.",                    expectedZone: 'consultants' },
    { id: 'i8',  text: "Peut-être qu'un format différent de rétrospective aiderait.",                   expectedZone: 'consultants' },
    { id: 'i9',  text: "Le problème semble venir d'un manque de clarté sur les attentes.",              expectedZone: 'consultants' },
    { id: 'i10', text: "Ce qui me parle le plus, c'est l'idée de changer le format.",                   expectedZone: 'reaction' },
    { id: 'i11', text: "Je réalise que je n'ai pas assez exploré les causes.",                          expectedZone: 'reaction' },
    { id: 'i12', text: "Je pense que je dois mieux comprendre l'équipe.",                               expectedZone: 'reaction' },
    { id: 'i13', text: 'Je vais tester un nouveau format de rétrospective au prochain Sprint.',          expectedZone: 'action' },
    { id: 'i14', text: 'Je vais organiser un échange individuel avec le Product Owner.',                 expectedZone: 'action' },
    { id: 'i15', text: "Je vais recueillir du feedback auprès de l'équipe.",                            expectedZone: 'action' },
  ],
}
