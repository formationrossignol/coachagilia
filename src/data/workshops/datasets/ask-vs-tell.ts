import type { ClassificationDataset } from '../types'

export const askVsTellDataset: ClassificationDataset = {
  zones: [
    { id: 'tell', label: 'Tell', description: 'Donner la solution, imposer une décision' },
    { id: 'ask',  label: 'Ask',  description: 'Questionner, faire réfléchir, responsabiliser' },
  ],
  cards: [
    { id: 's1',  text: 'Une faille de sécurité critique nécessite une action immédiate.',                  expectedZone: 'tell' },
    { id: 's2',  text: 'Une règle légale ou contractuelle doit être respectée sans discussion.',           expectedZone: 'tell' },
    { id: 's3',  text: "L'équipe viole la Definition of Done de manière répétée.",                        expectedZone: 'tell' },
    { id: 's4',  text: "Un comportement toxique impacte fortement l'équipe.",                             expectedZone: 'tell' },
    { id: 's5',  text: 'Une urgence production nécessite une décision rapide.',                           expectedZone: 'tell' },
    { id: 's6',  text: "Un standard technique obligatoire n'est pas respecté.",                           expectedZone: 'tell' },
    { id: 's7',  text: 'Un risque majeur est identifié et nécessite une action immédiate.',               expectedZone: 'tell' },
    { id: 's8',  text: 'Un développeur bloque sur une solution technique.',                               expectedZone: 'ask' },
    { id: 's9',  text: "L'équipe manque d'idées pour améliorer la rétrospective.",                       expectedZone: 'ask' },
    { id: 's10', text: 'Le Product Owner hésite sur une priorisation.',                                   expectedZone: 'ask' },
    { id: 's11', text: "L'équipe a du mal à s'organiser efficacement.",                                   expectedZone: 'ask' },
    { id: 's12', text: 'Un membre semble démotivé.',                                                      expectedZone: 'ask' },
    { id: 's13', text: "L'équipe ne comprend pas pourquoi une pratique est utile.",                      expectedZone: 'ask' },
    { id: 's14', text: 'Un conflit léger apparaît entre deux membres.',                                   expectedZone: 'ask' },
  ],
}
