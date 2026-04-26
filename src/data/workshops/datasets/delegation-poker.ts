import type { ClassificationDataset } from '../types'

export const delegationPokerDataset: ClassificationDataset = {
  zones: [
    { id: 'tell',     label: 'Tell',     description: 'Je décide et informe.' },
    { id: 'sell',     label: 'Sell',     description: "Je décide et explique pour obtenir l'adhésion." },
    { id: 'consult',  label: 'Consult',  description: 'Je consulte puis je décide.' },
    { id: 'agree',    label: 'Agree',    description: 'Nous décidons ensemble.' },
    { id: 'advise',   label: 'Advise',   description: "Je conseille, l'équipe décide." },
    { id: 'inquire',  label: 'Inquire',  description: "L'équipe décide puis m'informe." },
    { id: 'delegate', label: 'Delegate', description: "L'équipe décide en autonomie totale." },
  ],
  cards: [
    { id: 'dp1', text: "Une faille de sécurité critique impose l'arrêt immédiat d'une pratique risquée.", expectedZone: 'tell' },
    { id: 'dp2', text: 'Un changement de process technique impacte toutes les équipes — le SM explique pourquoi et convainc.', expectedZone: 'sell' },
    { id: 'dp3', text: "Le SM ajuste le format de rétro après avoir demandé l'avis de l'équipe.", expectedZone: 'consult' },
    { id: 'dp4', text: "L'équipe et le SM définissent ensemble la Definition of Done.", expectedZone: 'agree' },
    { id: 'dp5', text: "L'équipe veut tester une nouvelle méthode de refinement — le SM donne son avis mais laisse décider.", expectedZone: 'advise' },
    { id: 'dp6', text: "L'équipe choisit son outil de suivi — elle informe le SM après décision.", expectedZone: 'inquire' },
    { id: 'dp7', text: "L'équipe mature répartit elle-même son travail pendant le Sprint.", expectedZone: 'delegate' },
  ],
}
