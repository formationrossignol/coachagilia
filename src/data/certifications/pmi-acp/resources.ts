import type { CertResource } from '../types'

export const pmiacpResources: CertResource[] = [
  {
    id: 'pmi-acp-summary',
    title: 'PMI-ACP — Domaines de connaissance',
    type: 'summary',
    content: `## 7 domaines PMI-ACP\n\n1. **Agile Principles & Mindset** — valeurs, manifeste, mindset\n2. **Value-Driven Delivery** — livrer de la valeur tôt et souvent\n3. **Stakeholder Engagement** — collaboration, communication\n4. **Team Performance** — équipes auto-organisées, vélocité\n5. **Adaptive Planning** — planning itératif, rolling wave\n6. **Problem Detection & Resolution** — retrospectives, amélioration\n7. **Continuous Improvement** — Kaizen, inspect & adapt`,
  },
  {
    id: 'pmi-acp-flashcards',
    title: 'Flashcards — Frameworks couverts',
    type: 'flashcards',
    content: `**Q: Frameworks inclus dans PMI-ACP ?** R: Scrum, Kanban, XP, Lean, Crystal, DSDM, FDD\n\n**Q: Qu'est-ce que le WIP limit ?** R: Limite du travail en cours (Kanban) — réduit le multitasking\n\n**Q: Planning Poker est une technique de ?** R: Estimation relative (story points)\n\n**Q: Definition of Ready ?** R: Critères qu'un item doit remplir avant d'entrer dans un Sprint`,
  },
  {
    id: 'pmi-acp-tips',
    title: 'Points clés PMI-ACP',
    type: 'tips',
    content: `## Différences PMI-ACP vs PSM\n\n- PMI-ACP couvre **plusieurs frameworks** (pas seulement Scrum)\n- Focus sur **valeur business** et ROI, pas seulement process\n- Les questions sont orientées **situations réelles** de PM\n- Connaître **Kanban, XP et Lean** est essentiel\n- Le rôle du PM Agile = **servant leader + facilitateur**`,
  },
]
