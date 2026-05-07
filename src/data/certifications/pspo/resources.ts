import type { CertResource } from '../types'

export const pspoResources: CertResource[] = [
  {
    id: 'pspo-summary',
    title: 'PSPO I — Résumé des responsabilités PO',
    type: 'summary',
    content: `## Product Owner — Responsabilités clés\n\n- **Maximiser la valeur** du produit et du travail de l'équipe\n- **Gérer le Product Backlog** : ordonner, clarifier, rendre transparent\n- **Product Goal** : vision à long terme, un seul PG actif à la fois\n- **Parties prenantes** : seul interface officielle avec l'équipe\n- **Sprint Review** : inspecter l'Increment et adapter le backlog`,
  },
  {
    id: 'pspo-flashcards',
    title: 'Flashcards — Produit, valeur, backlog',
    type: 'flashcards',
    content: `**Q: Qui peut annuler un Sprint ?** R: Uniquement le Product Owner\n\n**Q: Le PO peut-il déléguer la gestion du backlog ?** R: Oui, mais reste responsable\n\n**Q: Qu'est-ce que le Product Goal ?** R: Objectif à long terme du produit, commitment du Product Backlog\n\n**Q: La vélocité est-elle une métrique de valeur ?** R: Non — c'est une métrique de capacité, pas de valeur livrée`,
  },
  {
    id: 'pspo-tips',
    title: 'Pièges fréquents au PSPO I',
    type: 'tips',
    content: `## Erreurs classiques\n\n- Le PO **n'écrit pas** les User Stories — il les collabore avec l'équipe\n- "Ordonner" ≠ "prioriser par importance" — c'est une décision de **valeur + risque + dépendances**\n- Le PO n'est **pas un proxy passif** des parties prenantes — il décide\n- Le Sprint Backlog n'appartient **pas au PO** — il appartient aux Developers`,
  },
]
