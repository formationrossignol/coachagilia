import type { WorkshopDefinition } from './types'
import { sbiDataset } from './datasets/sbi'
import { conflictDataset } from './datasets/conflict'
import { delegationPokerDataset } from './datasets/delegation-poker'
import { growDataset } from './datasets/grow-model'
import { askVsTellDataset } from './datasets/ask-vs-tell'
import { movingMotivatorsDataset } from './datasets/moving-motivators'
import { ishikawaDataset } from './datasets/ishikawa'
import { troikaConsultingDataset } from './datasets/troika-consulting'
import { trizDataset } from './datasets/triz'
import { stakeholderMappingDataset } from './datasets/stakeholder-mapping'
import { scrumGuideDataset } from './datasets/scrum-guide'

const EXISTING: WorkshopDefinition[] = [
  {
    id: 'scrum-guide',
    slug: 'scrum-guide',
    title: 'Le cadre Scrum',
    route: '/ateliers/scrum-guide',
    categorySlug: 'team-intelligence',
    toolName: 'Scrum Guide',
    level: 'beginner',
    durationMinutes: 10,
    interactionType: 'diagram',
    summary: 'Replacez les rôles, événements, artefacts et engagements du Scrum Guide au bon endroit sur le diagramme.',
    pedagogy: {
      objectives: [
        'Identifier les 3 responsabilités Scrum',
        'Nommer les 5 événements Scrum',
        'Associer chaque artefact à son engagement',
      ],
      toolExplanation: 'Le Scrum Guide définit le cadre Scrum : 3 responsabilités (Product Owner, Scrum Master, Developers), 5 événements et 3 artefacts, chacun avec un engagement associé (Objectif Produit, Objectif Sprint, Definition of Done).',
      whenToUse: [
        'Pour vérifier sa compréhension du cadre Scrum',
        "En formation initiale ou lors d'un onboarding",
        "Pour consolider les bases avant d'approfondir des pratiques avancées",
      ],
      expectedOutput: [
        'Placement correct des 14 éléments du Scrum Guide',
        'Distinction claire entre rôles, événements, artefacts et engagements',
      ],
      prerequisites: ['Connaissance basique de Scrum recommandée'],
    },
    dataset: scrumGuideDataset,
  },
  {
    id: 'thomas-kilmann',
    slug: 'thomas-kilmann',
    title: 'Gestion des conflits — Thomas-Kilmann',
    route: '/ateliers/conflits',
    categorySlug: 'conflict-and-communication',
    toolName: 'Thomas-Kilmann Conflict Mode Instrument',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'matrix',
    summary: 'Positionnez les 5 modes du modèle Thomas-Kilmann sur le diagramme, puis associez des situations réelles à chaque mode.',
    pedagogy: {
      objectives: [
        'Nommer les 5 modes de gestion des conflits',
        "Positionner chaque mode sur le diagramme assertivité/coopération",
        'Reconnaître quel mode est adapté à quelle situation',
      ],
      toolExplanation: "Le modèle Thomas-Kilmann décrit 5 façons de gérer un conflit selon deux dimensions : assertivité (chercher à satisfaire ses propres intérêts) et coopération (chercher à satisfaire les intérêts de l'autre). Les 5 modes sont : Compétition, Collaboration, Compromis, Évitement, Accommodation.",
      whenToUse: [
        'Pour comprendre sa propre tendance en situation de conflit',
        "Pour former une équipe à la gestion constructive des tensions",
        'Pour choisir consciemment le mode adapté au contexte',
      ],
      expectedOutput: [
        'Positionnement correct des 5 modes sur le diagramme',
        'Association de situations réelles aux modes appropriés',
      ],
    },
    dataset: conflictDataset,
  },
  {
    id: 'delegation-poker',
    slug: 'delegation-poker',
    title: 'Delegation Poker',
    route: '/ateliers/delegation-poker',
    categorySlug: 'management-3-0',
    toolName: 'Delegation Poker',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: 'Ordonnez les 7 niveaux de délégation, puis associez des situations Scrum au niveau approprié.',
    pedagogy: {
      objectives: [
        'Nommer et ordonner les 7 niveaux de délégation',
        'Identifier le niveau approprié selon le contexte',
        'Distinguer délégation totale et autonomie guidée',
      ],
      toolExplanation: "Outil Management 3.0 qui définit 7 niveaux d'autorité décisionnelle, du \"Tell\" (je décide et informe) au \"Delegate\" (l'équipe décide en autonomie totale). Il aide à clarifier qui décide quoi et à quel niveau.",
      whenToUse: [
        "Pour clarifier les zones d'autorité dans une équipe",
        'Pour réduire la frustration liée aux décisions opaques',
        "Lors de l'onboarding d'une nouvelle équipe Scrum",
      ],
      expectedOutput: [
        'Ordre maîtrisé des 7 niveaux de délégation',
        'Correspondance correcte entre situations et niveaux',
      ],
    },
    dataset: delegationPokerDataset,
  },
  {
    id: 'grow-model',
    slug: 'grow-model',
    title: 'Modèle GROW',
    route: '/ateliers/grow-model',
    categorySlug: 'coaching-and-posture',
    toolName: 'GROW Model',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: 'Ordonnez les 4 étapes du modèle GROW, puis associez des questions de coaching à chaque étape.',
    pedagogy: {
      objectives: [
        'Nommer les 4 étapes du modèle GROW',
        'Distinguer les phases Goal, Reality, Options et Will',
        'Associer des questions de coaching à chaque étape',
      ],
      toolExplanation: "GROW est un modèle de coaching structuré en 4 étapes pour accompagner une personne vers une décision et un plan d'action : Goal (objectif), Reality (situation actuelle), Options (possibilités), Will (engagement).",
      whenToUse: [
        'Pour mener un entretien de coaching individuel',
        "Pour aider un membre à clarifier un objectif ou une décision",
        'Quand on veut guider sans imposer de solution',
      ],
      expectedOutput: [
        'Séquence GROW mémorisée',
        'Banque de questions de coaching par étape',
      ],
    },
    dataset: growDataset,
  },
  {
    id: 'stakeholder-mapping',
    slug: 'stakeholder-mapping',
    title: 'Stakeholder Mapping',
    route: '/ateliers/stakeholder-mapping',
    categorySlug: 'stakeholders-and-alignment',
    toolName: 'Stakeholder Mapping',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'matrix',
    summary: 'Associez la bonne stratégie à chaque quadrant de la matrice Influence / Intérêt, puis positionnez les parties prenantes.',
    pedagogy: {
      objectives: [
        'Identifier les 4 quadrants de la matrice Influence/Intérêt',
        'Associer la bonne stratégie à chaque quadrant',
        'Positionner des parties prenantes concrètes sur la matrice',
      ],
      toolExplanation: "La cartographie des parties prenantes positionne chaque acteur selon son niveau d'influence et d'intérêt. Chaque quadrant correspond à une stratégie : Gérer étroitement, Satisfaire, Informer, Surveiller.",
      whenToUse: [
        "En début de projet pour cartographier l'environnement",
        "Pour définir la stratégie de communication et d'engagement",
        "Pour prioriser les efforts de gestion des relations",
      ],
      expectedOutput: [
        'Matrice complétée avec une stratégie par quadrant',
        'Positionnement de parties prenantes réelles sur la matrice',
      ],
    },
    dataset: stakeholderMappingDataset,
  },
  {
    id: 'ask-vs-tell',
    slug: 'ask-vs-tell',
    title: 'Ask vs Tell',
    route: '/ateliers/ask-vs-tell',
    categorySlug: 'coaching-and-posture',
    toolName: 'Ask vs Tell',
    level: 'advanced',
    durationMinutes: 20,
    interactionType: 'guided-form',
    summary: "Identifiez la bonne posture de coaching, classez des situations selon qu'elles appellent une posture directive ou de coaching, puis reformulez des phrases directives en questions ouvertes.",
    pedagogy: {
      objectives: [
        'Distinguer la posture directive (Tell) de la posture de coaching (Ask)',
        'Identifier dans quelle situation chaque posture est adaptée',
        'Reformuler des injonctions en questions ouvertes',
      ],
      toolExplanation: 'Le modèle Ask vs Tell décrit deux postures : Tell (donner la réponse, diriger) et Ask (poser des questions, responsabiliser). Le Scrum Master efficace sait choisir consciemment sa posture selon le contexte.',
      whenToUse: [
        "Pour développer l'autonomie des membres d'une équipe",
        "Lors d'entretiens de coaching ou de résolution de problèmes",
        "Pour éviter de créer une dépendance à l'expert",
      ],
      expectedOutput: [
        'Identification de sa posture dominante',
        'Capacité à reformuler des phrases directives en questions ouvertes',
      ],
    },
    dataset: askVsTellDataset,
  },
  {
    id: 'moving-motivators',
    slug: 'moving-motivators',
    title: 'Moving Motivators',
    route: '/ateliers/moving-motivators',
    categorySlug: 'management-3-0',
    toolName: 'Moving Motivators',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'ranking',
    summary: "Classez vos 10 motivateurs intrinsèques par importance, évaluez votre satisfaction pour chacun, puis construisez un plan d'action pour les motivateurs critiques.",
    pedagogy: {
      objectives: [
        'Nommer les 10 motivateurs intrinsèques CHAMPFROGS',
        "Classer ses motivateurs par ordre d'importance personnelle",
        'Identifier les motivateurs sous tension et définir des actions',
      ],
      toolExplanation: 'Moving Motivators est un outil Management 3.0 basé sur 10 motivateurs intrinsèques (CHAMPFROGS) : Curiosity, Honor, Acceptance, Mastery, Power, Freedom, Relatedness, Order, Goal, Status.',
      whenToUse: [
        "Pour comprendre les sources de motivation d'un membre d'équipe",
        'Avant ou après un changement organisationnel',
        'En coaching individuel pour explorer les valeurs et besoins',
      ],
      expectedOutput: [
        'Classement personnel des 10 motivateurs',
        "Identification des motivateurs critiques et plan d'action",
      ],
    },
    dataset: movingMotivatorsDataset,
  },
  {
    id: 'ishikawa',
    slug: 'ishikawa',
    title: 'Ishikawa (Fishbone)',
    route: '/ateliers/ishikawa',
    categorySlug: 'problem-solving',
    toolName: 'Diagramme Ishikawa',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'diagram',
    summary: 'Positionnez les 6 catégories sur le diagramme en arête de poisson, classez 18 causes potentielles, puis identifiez les causes racines.',
    pedagogy: {
      objectives: [
        'Identifier les 6 catégories du diagramme Ishikawa',
        'Classer des causes potentielles dans la bonne catégorie',
        'Distinguer causes racines et symptômes',
      ],
      toolExplanation: "Le diagramme Ishikawa (arête de poisson) est un outil d'analyse de causes racines. Il organise les causes d'un problème en 6 catégories : People, Process, Tools, Product, Environment, Management.",
      whenToUse: [
        'En rétrospective pour analyser un problème récurrent',
        "Pour préparer un plan d'amélioration structuré",
        'Quand les symptômes sont connus mais pas les causes profondes',
      ],
      expectedOutput: [
        'Diagramme Ishikawa complété avec des causes classées par catégorie',
        'Identification des causes racines probables',
      ],
    },
    dataset: ishikawaDataset,
  },
  {
    id: 'troika-consulting',
    slug: 'troika-consulting',
    title: 'Troika Consulting',
    route: '/ateliers/troika-consulting',
    categorySlug: 'facilitation',
    toolName: 'Troika Consulting',
    level: 'advanced',
    durationMinutes: 20,
    interactionType: 'dialogue',
    summary: 'Ordonnez les 5 étapes de la pratique Troika Consulting, classez 15 interventions dans la bonne étape, puis simulez votre rôle de consultant.',
    pedagogy: {
      objectives: [
        'Mémoriser les 5 étapes du Troika Consulting',
        'Distinguer le rôle du porteur et celui des consultants',
        'Pratiquer des questions de clarification non directives',
      ],
      toolExplanation: "Le Troika Consulting est une pratique de co-développement en trinôme : un porteur expose son défi, deux consultants posent des questions de clarification, échangent entre eux, puis le porteur réagit et définit un plan d'action.",
      whenToUse: [
        'En rétrospective pour traiter des sujets complexes',
        "Pour développer l'intelligence collective",
        'Quand un problème nécessite plusieurs perspectives',
      ],
      expectedOutput: [
        'Maîtrise de la séquence en 5 étapes',
        'Capacité à poser des questions de clarification non directives',
      ],
    },
    dataset: troikaConsultingDataset,
  },
  {
    id: 'sbi',
    slug: 'sbi',
    title: 'SBI — Situation Behavior Impact',
    route: '/ateliers/sbi',
    categorySlug: 'conflict-and-communication',
    toolName: 'SBI',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Ordonnez les 3 composantes du modèle SBI, classez 12 éléments par catégorie, puis construisez un feedback complet à partir d'un cas concret.",
    pedagogy: {
      objectives: [
        'Identifier les trois composantes du modèle SBI',
        "Différencier un comportement observable d'un jugement",
        'Formuler un feedback clair et actionnable',
      ],
      toolExplanation: 'SBI est un modèle de feedback structuré en trois parties : Situation (contexte précis), Behavior (comportement observable) et Impact (effet produit). Il aide à éviter les jugements vagues en ancrant le feedback dans des faits.',
      whenToUse: [
        'Pour donner un feedback individuel sur un comportement',
        'Pour traiter une situation problématique sans accusation',
        'Pour rendre un retour plus factuel et moins émotionnel',
      ],
      expectedOutput: [
        'Un feedback complet au format Situation → Behavior → Impact',
        'Une distinction claire entre fait, comportement et impact',
      ],
    },
    dataset: sbiDataset,
  },
  {
    id: 'triz',
    slug: 'triz',
    title: 'TRIZ — Anti-Goal',
    route: '/ateliers/triz',
    categorySlug: 'facilitation',
    toolName: 'TRIZ Anti-Goal',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'guided-form',
    summary: "Formulez l'anti-objectif de votre défi Scrum, classez 15 comportements destructeurs, identifiez ceux présents dans votre contexte, puis construisez votre plan d'élimination.",
    pedagogy: {
      objectives: [
        "Formuler un anti-objectif à partir d'un objectif cible",
        'Identifier des comportements destructeurs par catégorie',
        "Construire un plan d'élimination concret",
      ],
      toolExplanation: "TRIZ appliqué au management consiste à inverser le problème : au lieu de chercher comment améliorer une situation, on cherche comment la rendre catastrophique. Cette inversion révèle des comportements nuisibles déjà présents.",
      whenToUse: [
        "En rétrospective pour identifier des anti-patterns d'équipe",
        "Quand l'équipe peine à progresser malgré les bonnes intentions",
        'Pour rendre visibles les comportements bloquants de manière ludique',
      ],
      expectedOutput: [
        'Un anti-objectif clair et cohérent',
        'Liste des comportements destructeurs présents dans le contexte',
        "Plan d'élimination avec actions concrètes et alternatives positives",
      ],
    },
    dataset: trizDataset,
  },
]

const COMING_SOON: WorkshopDefinition[] = [
  { id: 'nonviolent-communication', slug: 'nonviolent-communication', title: 'Communication Non Violente', route: '/ateliers/nonviolent-communication', categorySlug: 'conflict-and-communication', toolName: 'CNV', level: 'intermediate', durationMinutes: 20, interactionType: 'guided-form', summary: 'Structurer une communication empathique en 4 étapes : Observation, Sentiment, Besoin, Demande.', comingSoon: true },
  { id: 'ladder-of-inference', slug: 'ladder-of-inference', title: "Échelle d'inférence", route: '/ateliers/ladder-of-inference', categorySlug: 'conflict-and-communication', toolName: 'Ladder of Inference', level: 'advanced', durationMinutes: 20, interactionType: 'diagram', summary: 'Comprendre comment nos croyances influencent nos conclusions et nos actions.', comingSoon: true },
  { id: 'desc', slug: 'desc', title: 'Méthode DESC', route: '/ateliers/desc', categorySlug: 'conflict-and-communication', toolName: 'DESC', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Formuler une critique constructive en 4 étapes : Décrire, Exprimer, Spécifier, Conclure.', comingSoon: true },
  { id: 'feedforward', slug: 'feedforward', title: 'Feedforward', route: '/ateliers/feedforward', categorySlug: 'conflict-and-communication', toolName: 'Feedforward', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: "Donner du feedback orienté vers l'avenir plutôt que le passé.", comingSoon: true },
  { id: 'active-listening', slug: 'active-listening', title: 'Écoute active', route: '/ateliers/active-listening', categorySlug: 'conflict-and-communication', toolName: 'Active Listening', level: 'intermediate', durationMinutes: 15, interactionType: 'reflection', summary: "Pratiquer les niveaux d'écoute et les techniques de reformulation.", comingSoon: true },
  { id: 'conflict-mediation', slug: 'conflict-mediation', title: 'Médiation de conflit', route: '/ateliers/conflict-mediation', categorySlug: 'conflict-and-communication', toolName: 'Conflict Mediation', level: 'advanced', durationMinutes: 25, interactionType: 'dialogue', summary: "Faciliter la résolution d'un conflit entre deux parties en tant que tiers neutre.", comingSoon: true },
  { id: 'silence-facilitation', slug: 'silence-facilitation', title: 'Le silence en facilitation', route: '/ateliers/silence-facilitation', categorySlug: 'facilitation', toolName: 'Silence Facilitation', level: 'intermediate', durationMinutes: 15, interactionType: 'reflection', summary: "Utiliser le silence comme outil de facilitation pour laisser émerger les idées.", comingSoon: true },
  { id: 'liberating-structures', slug: 'liberating-structures', title: 'Liberating Structures', route: '/ateliers/liberating-structures', categorySlug: 'facilitation', toolName: 'Liberating Structures', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Découvrir et pratiquer les structures libératrices pour engager tous les participants.', comingSoon: true },
  { id: '1-2-4-all', slug: '1-2-4-all', title: '1-2-4-All', route: '/ateliers/1-2-4-all', categorySlug: 'facilitation', toolName: '1-2-4-All', level: 'beginner', durationMinutes: 15, interactionType: 'reflection', summary: 'Structure de facilitation pour générer des idées seul, en binôme, en groupe, puis collectivement.', comingSoon: true },
  { id: 'fist-of-five', slug: 'fist-of-five', title: 'Fist of Five', route: '/ateliers/fist-of-five', categorySlug: 'facilitation', toolName: 'Fist of Five', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: "Mesurer le niveau d'accord d'un groupe sur une décision en 6 niveaux.", comingSoon: true },
  { id: 'dot-voting', slug: 'dot-voting', title: 'Dot Voting', route: '/ateliers/dot-voting', categorySlug: 'facilitation', toolName: 'Dot Voting', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: 'Prioriser collectivement des options en distribuant des points de vote.', comingSoon: true },
  { id: 'roman-voting', slug: 'roman-voting', title: 'Roman Voting', route: '/ateliers/roman-voting', categorySlug: 'facilitation', toolName: 'Roman Voting', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: "Recueillir rapidement l'avis d'un groupe : pouce levé, baissé ou horizontal.", comingSoon: true },
  { id: 'facilitation-canvas', slug: 'facilitation-canvas', title: 'Facilitation Canvas', route: '/ateliers/facilitation-canvas', categorySlug: 'facilitation', toolName: 'Facilitation Canvas', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Préparer une session de facilitation avec un canvas structuré.", comingSoon: true },
  { id: 'powerful-questions', slug: 'powerful-questions', title: 'Powerful Questions', route: '/ateliers/powerful-questions', categorySlug: 'coaching-and-posture', toolName: 'Powerful Questions', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Construire des questions ouvertes, non directives et orientées solution.', comingSoon: true },
  { id: 'reframing', slug: 'reframing', title: 'Recadrage cognitif', route: '/ateliers/reframing', categorySlug: 'coaching-and-posture', toolName: 'Reframing', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Transformer une croyance limitante en perspective constructive.', comingSoon: true },
  { id: 'working-agreements', slug: 'working-agreements', title: 'Working Agreements', route: '/ateliers/working-agreements', categorySlug: 'team-intelligence', toolName: 'Working Agreements', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: "Construire collectivement les règles de fonctionnement d'une équipe.", comingSoon: true },
  { id: 'team-charter', slug: 'team-charter', title: 'Team Charter', route: '/ateliers/team-charter', categorySlug: 'team-intelligence', toolName: 'Team Charter', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Définir l'identité, les valeurs et les engagements d'une équipe.", comingSoon: true },
  { id: 'empathy-map', slug: 'empathy-map', title: 'Empathy Map', route: '/ateliers/empathy-map', categorySlug: 'team-intelligence', toolName: 'Empathy Map', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Mieux comprendre les besoins et émotions d'un utilisateur ou d'un membre d'équipe.", comingSoon: true },
  { id: 'personal-maps', slug: 'personal-maps', title: 'Personal Maps', route: '/ateliers/personal-maps', categorySlug: 'management-3-0', toolName: 'Personal Maps', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: 'Créer une carte mentale personnelle pour mieux se connaître et se faire connaître.', comingSoon: true },
  { id: 'celebration-grid', slug: 'celebration-grid', title: 'Celebration Grid', route: '/ateliers/celebration-grid', categorySlug: 'management-3-0', toolName: 'Celebration Grid', level: 'intermediate', durationMinutes: 15, interactionType: 'matrix', summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.', comingSoon: true },
  { id: 'team-health-check', slug: 'team-health-check', title: 'Team Health Check', route: '/ateliers/team-health-check', categorySlug: 'management-3-0', toolName: 'Team Health Check', level: 'intermediate', durationMinutes: 20, interactionType: 'voting', summary: "Évaluer collectivement la santé de l'équipe sur plusieurs dimensions.", comingSoon: true },
  { id: '5-whys', slug: '5-whys', title: '5 Pourquoi', route: '/ateliers/5-whys', categorySlug: 'problem-solving', toolName: '5 Whys', level: 'beginner', durationMinutes: 15, interactionType: 'guided-form', summary: 'Identifier la cause racine d\'un problème en posant 5 fois la question "Pourquoi ?".', comingSoon: true },
  { id: 'root-cause-analysis', slug: 'root-cause-analysis', title: 'Analyse des causes racines', route: '/ateliers/root-cause-analysis', categorySlug: 'problem-solving', toolName: 'Root Cause Analysis', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: "Méthode structurée pour remonter des symptômes aux causes profondes d'un problème.", comingSoon: true },
]

export const WORKSHOP_DEFINITIONS: WorkshopDefinition[] = [...EXISTING, ...COMING_SOON]
