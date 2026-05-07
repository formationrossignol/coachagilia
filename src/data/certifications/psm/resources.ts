import type { CertResource } from '../types'

export const psmResources: CertResource[] = [
  {
    id: 'psm-scrum-guide-summary',
    title: 'Scrum Guide 2020 — Résumé visuel',
    type: 'summary',
    content: `## Scrum en une page\n\n**Valeurs :** Engagement, Focus, Ouverture, Respect, Courage\n\n**Rôles :** Scrum Master · Product Owner · Developers\n\n**Événements :** Sprint · Sprint Planning · Daily Scrum · Sprint Review · Sprint Retrospective\n\n**Artefacts :** Product Backlog · Sprint Backlog · Increment\n\n**Engagement par artefact :** Product Goal · Sprint Goal · Definition of Done`,
  },
  {
    id: 'psm-flashcards',
    title: 'Flashcards — Rôles, cérémonies, artefacts',
    type: 'flashcards',
    content: `## Flashcards clés\n\n**Q: Durée max d'un Sprint ?** R: 1 mois (recommandé 2 semaines)\n\n**Q: Qui ordonne le Product Backlog ?** R: Le Product Owner\n\n**Q: Qui crée la Definition of Done ?** R: Les Developers (ou l'organisation si elle existe déjà)\n\n**Q: Qui participe au Sprint Review ?** R: Toute la Scrum Team + les parties prenantes\n\n**Q: La Daily Scrum est-elle obligatoirement de 15 min ?** R: 15 min maximum, format libre`,
  },
  {
    id: 'psm-tips',
    title: 'Points souvent mal compris au PSM I',
    type: 'tips',
    content: `## Pièges fréquents\n\n- Le Scrum Master **ne manage pas** l'équipe : il facilite et protège\n- Il n'y a **pas de rôle Chef de projet** dans Scrum\n- Le Sprint **ne peut pas être annulé** que par le Product Owner\n- La Retrospective est pour l'**équipe**, pas pour les parties prenantes\n- Le Product Backlog est **toujours vivant** — jamais figé\n- Le Sprint Backlog appartient aux **Developers**, pas au PO`,
  },
]
