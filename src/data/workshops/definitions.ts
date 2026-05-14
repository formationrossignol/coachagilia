import type { WorkshopDefinition } from './types'
import { cynefinFrameworkDataset } from './datasets/cynefin-framework'
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
import { powerfulQuestionsDataset } from './datasets/powerful-questions'
import { solutionFocusedDataset } from './datasets/solution-focused'
import { empathyMapDataset } from './datasets/empathy-map'
import { johariWindowDataset } from './datasets/johari-window'
import { sixHatsDataset } from './datasets/six-hats'
import { radicalCandorDataset } from './datasets/radical-candor'
import { sailboatRetrospectiveDataset } from './datasets/sailboat-retrospective'
import { starfishRetrospectiveDataset } from './datasets/starfish-retrospective'

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
  {
    id: 'cynefin-framework',
    slug: 'cynefin-framework',
    title: 'Cynefin Framework',
    route: '/ateliers/cynefin-framework',
    categorySlug: 'problem-solving',
    toolName: 'Cynefin Framework',
    level: 'advanced',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: 'Positionnez les 5 domaines du Cynefin Framework, classez 15 situations Scrum / produit / organisation dans le bon domaine, puis définissez votre posture de décision.',
    pedagogy: {
      objectives: [
        'Identifier et positionner les 5 domaines du Cynefin Framework',
        'Distinguer un contexte Complex d\'un contexte Complicated',
        'Adapter sa posture de décision selon le type de contexte',
      ],
      toolExplanation: "Le Cynefin Framework (Snowden, 1999) est un modèle de sense-making qui distingue 5 domaines : Clear (cause-effet évidente), Complicated (expertise requise), Complex (émergence), Chaotic (urgence) et Disorder (domaine non identifié). Chaque domaine appelle une réponse adaptée : Sense→Categorize→Respond, Sense→Analyze→Respond, Probe→Sense→Respond ou Act→Sense→Respond.",
      whenToUse: [
        "Pour choisir la bonne approche face à un problème organisationnel ou produit",
        "En rétrospective pour analyser pourquoi une décision n'a pas produit les effets attendus",
        "Pour former une équipe à adapter sa posture selon le contexte",
      ],
      expectedOutput: [
        'Maîtrise des 5 domaines Cynefin et de leurs stratégies de réponse',
        'Capacité à classer des situations et à adapter sa posture de décision',
      ],
      prerequisites: ['Expérience en environnement Scrum ou produit recommandée'],
    },
    dataset: cynefinFrameworkDataset,
  },
  {
    id: 'powerful-questions',
    slug: 'powerful-questions',
    title: 'Powerful Questions',
    route: '/ateliers/powerful-questions',
    categorySlug: 'coaching-and-posture',
    toolName: 'Powerful Questions',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Distinguez questions fermées, orientées et puissantes, puis associez des situations Scrum à la meilleure intention de coaching.",
    pedagogy: {
      objectives: [
        'Distinguer une question fermée, orientée et puissante',
        'Éviter les questions qui jugent, accusent ou induisent une réponse',
        'Choisir une question adaptée à une situation Scrum',
        "Relier une question à une intention de coaching",
        "Favoriser l'autonomie de l'équipe plutôt que résoudre à sa place",
      ],
      toolExplanation: "Les Powerful Questions (ICF) sont des questions ouvertes qui aident l'autre à penser plus clairement, voir autrement, choisir ou agir. Elles s'opposent aux questions fermées (oui/non) et aux questions orientées (qui induisent une réponse). En coaching Scrum, chaque question doit servir une intention : clarifier, explorer, responsabiliser, décider ou passer à l'action.",
      whenToUse: [
        "Pour accompagner un membre de l'équipe sans lui imposer une solution",
        'En rétrospective ou Sprint Planning pour débloquer une situation',
        "Pour développer l'autonomie de l'équipe",
      ],
      expectedOutput: [
        'Distinction maîtrisée entre question fermée, orientée et puissante',
        'Capacité à choisir une question selon l\'intention de coaching',
      ],
    },
    dataset: powerfulQuestionsDataset,
  },
  {
    id: 'solution-focused-coaching',
    slug: 'solution-focused-coaching',
    title: 'Solution Focused Coaching',
    route: '/ateliers/solution-focused',
    categorySlug: 'coaching-and-posture',
    toolName: 'Solution Focused Coaching',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Distinguez les familles de questions Solution Focused, puis associez des situations Scrum à la bonne intention : futur souhaité, progression, exceptions, ressources ou petit pas.",
    pedagogy: {
      objectives: [
        'Distinguer les principales familles de questions Solution Focused',
        'Formuler une question orientée solution plutôt que centrée problème',
        'Repérer les exceptions où la situation fonctionne déjà mieux',
        "Aider une équipe à mesurer son niveau actuel sans jugement",
        "Transformer une difficulté large en prochain petit pas concret",
      ],
      toolExplanation: "Le Solution Focused Coaching (de Shazer, Berg) déplace la conversation du problème vers les ressources : il aide la personne ou l'équipe à décrire ce qu'elle veut voir apparaître, à repérer ce qui fonctionne déjà et à avancer par petits pas. Ses outils principaux : la question miracle (futur souhaité), la question d'échelle (progression), la question d'exception (moments où ça va mieux) et la question de ressources (forces disponibles).",
      whenToUse: [
        "Pour déplacer une rétrospective d'une liste de problèmes vers des pistes d'action",
        "Quand une équipe est dans un jugement global négatif (\"rien ne marche\")",
        "Pour coacher un membre de l'équipe sans lui imposer une solution",
      ],
      expectedOutput: [
        'Maîtrise des 4 familles de questions Solution Focused',
        "Capacité à choisir une question selon l'intention : futur, progression, exception, ressources ou petit pas",
      ],
    },
    dataset: solutionFocusedDataset,
  },
  {
    id: 'empathy-map',
    slug: 'empathy-map',
    title: 'Empathy Map',
    route: '/ateliers/empathy-map',
    categorySlug: 'team-intelligence',
    toolName: 'Empathy Map',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les zones de l'Empathy Map, puis classez des observations utilisateur ou équipe dans la bonne zone : Dit, Pense, Fait, Ressent ou Besoin.",
    pedagogy: {
      objectives: [
        "Distinguer un verbatim, une pensée supposée, un comportement observable et une émotion",
        "Structurer une situation utilisateur ou équipe avec une Empathy Map",
        "Éviter de confondre observation et interprétation",
        "Identifier des besoins à partir de signaux concrets",
        "Utiliser l'Empathy Map pour améliorer une discussion produit, une rétrospective ou une analyse stakeholder",
      ],
      toolExplanation: "L'Empathy Map (Dave Gray / XPLANE) aide les équipes à développer une compréhension partagée d'une personne ou d'un groupe. Elle distingue ce que la personne Dit (verbatims explicites), Pense (croyances, anticipations, craintes), Fait (comportements observables) et Ressent (émotions, tensions). La version enrichie ajoute les Besoins, déduits des observations et émotions.",
      whenToUse: [
        "Pour mieux comprendre un stakeholder avant un Sprint Review ou une présentation produit",
        "En rétrospective pour cartographier l'expérience vécue par l'équipe",
        "Pour préparer une conversation difficile avec un membre de l'équipe ou un client",
      ],
      expectedOutput: [
        "Distinction maîtrisée entre Dit, Pense, Fait, Ressent et Besoin",
        "Capacité à structurer une situation avec une Empathy Map pour faire émerger les besoins",
      ],
    },
    dataset: empathyMapDataset,
  },
  {
    id: 'johari-window',
    slug: 'johari-window',
    title: 'Fenêtre de Johari',
    route: '/ateliers/johari-window',
    categorySlug: 'conflict-and-communication',
    toolName: 'Johari Window',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les 4 zones de la Fenêtre de Johari, puis diagnostiquez des situations d'équipe en distinguant zone ouverte, aveugle, cachée, inconnue et mouvement vers l'ouverture.",
    pedagogy: {
      objectives: [
        "Distinguer les 4 zones de la Fenêtre de Johari",
        "Repérer une zone aveugle dans une situation d'équipe",
        "Comprendre le rôle du feedback dans la réduction des angles morts",
        "Comprendre le rôle du partage volontaire dans la réduction de la zone cachée",
        "Identifier les situations où l'expérimentation révèle des compétences ou réactions inconnues",
        "Utiliser le modèle pour améliorer la communication, la confiance et la connaissance mutuelle dans une équipe",
      ],
      toolExplanation: "La Fenêtre de Johari (Luft & Ingham, 1955) est un modèle de connaissance de soi et de dynamique de groupe. Elle distingue 4 zones : la zone ouverte (connue de soi et des autres), la zone aveugle (perçue par les autres mais pas par soi), la zone cachée (connue de soi mais non partagée) et la zone inconnue (ni connue de soi, ni des autres). Le feedback réduit la zone aveugle, l'auto-divulgation maîtrisée réduit la zone cachée, et l'expérimentation révèle la zone inconnue.",
      whenToUse: [
        "En rétrospective pour améliorer la communication et le feedback dans l'équipe",
        "Pour accompagner un membre de l'équipe sur ses angles morts",
        "Pour développer une culture de feedback psychologiquement sécurisante",
      ],
      expectedOutput: [
        "Distinction maîtrisée des 4 zones de Johari",
        "Capacité à diagnostiquer une situation d'équipe et à identifier comment agrandir la zone ouverte",
      ],
    },
    dataset: johariWindowDataset,
  },
  {
    id: 'six-hats',
    slug: 'six-hats',
    title: 'Six Chapeaux de Bono',
    route: '/ateliers/six-hats',
    categorySlug: 'facilitation',
    toolName: 'Six Thinking Hats',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Identifiez les 6 perspectives de pensée, puis associez des situations Scrum au bon chapeau : faits, ressentis, risques, bénéfices, idées ou pilotage.",
    pedagogy: {
      objectives: [
        "Distinguer les 6 chapeaux et leur rôle",
        "Éviter de mélanger faits, ressentis, risques, bénéfices, idées et pilotage",
        "Choisir la bonne perspective selon une situation d'équipe",
        "Structurer une discussion collective sans tomber dans le débat désorganisé",
        "Utiliser les chapeaux pour améliorer une rétrospective, une décision produit ou une résolution de problème",
      ],
      toolExplanation: "Les Six Chapeaux de Bono (Edward de Bono, 1985) structurent la réflexion collective en demandant au groupe d'explorer successivement 6 perspectives : les faits (blanc), les émotions (rouge), les risques (noir), les bénéfices (jaune), les idées nouvelles (vert) et le pilotage de la discussion (bleu). En séparant les registres de pensée, la méthode réduit les débats confus et améliore la qualité des décisions collectives.",
      whenToUse: [
        "En rétrospective pour explorer un sujet complexe sans mélanger les registres",
        "Pour structurer une décision produit ou une session de résolution de problème",
        "Quand une discussion devient émotionnelle ou part dans plusieurs directions à la fois",
      ],
      expectedOutput: [
        "Distinction maîtrisée des 6 perspectives de Bono",
        "Capacité à choisir le bon chapeau selon la situation et le besoin de la discussion",
      ],
    },
    dataset: sixHatsDataset,
  },
  {
    id: 'radical-candor',
    slug: 'radical-candor',
    title: 'Radical Candor',
    route: '/ateliers/radical-candor',
    categorySlug: 'conflict-and-communication',
    toolName: 'Radical Candor',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Distinguez les 4 postures du modèle Radical Candor, puis identifiez la posture appropriée dans 15 situations Scrum et Agile.",
    pedagogy: {
      objectives: [
        'Distinguer les 4 quadrants du modèle Radical Candor',
        'Reconnaître un feedback trop vague, trop brutal ou insincère',
        "Formuler un feedback direct sans attaquer la personne",
        "Montrer une intention d'aide explicite",
        'Utiliser Radical Candor dans une rétrospective, une revue de code ou un accompagnement Scrum Master',
      ],
      toolExplanation: "Radical Candor (Kim Scott) repose sur deux dimensions : montrer que l'on se soucie personnellement de la personne (Care Personally) et la défier directement (Challenge Directly). Le quadrant cible combine les deux. Les autres quadrants — Ruinous Empathy (care sans challenge), Obnoxious Aggression (challenge sans care) et Manipulative Insincerity (ni l'un ni l'autre) — décrivent des postures à éviter.",
      whenToUse: [
        'Pour donner un feedback individuel à la fois direct et humain',
        'En rétrospective pour nommer un comportement sans attaquer la personne',
        'Pour accompagner un Scrum Master sur sa posture de feedback',
      ],
      expectedOutput: [
        'Positionnement maîtrisé des 4 postures sur le diagramme',
        "Capacité à identifier et reformuler un feedback trop vague, brutal ou insincère",
      ],
    },
    dataset: radicalCandorDataset,
  },
  {
    id: 'sailboat',
    slug: 'sailboat',
    title: 'Sailboat Retrospective',
    route: '/ateliers/sailboat',
    categorySlug: 'retrospectives',
    toolName: 'Sailboat / Speed Boat',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Visualiser ce qui propulse et ce qui freine l'équipe comme un voilier : vent, ancre, risques, destination et énergie.",
    pedagogy: {
      objectives: [
        "Identifier les 5 zones de la Sailboat Retrospective",
        "Distinguer un frein actuel d'un risque futur",
        "Reconnaître les moteurs, la destination et les sources d'énergie positive",
      ],
      toolExplanation: "La Sailboat Retrospective aide l'équipe à visualiser sa situation comme un voilier : le vent représente ce qui pousse l'équipe, l'ancre ce qui la freine, les rochers les risques à anticiper, l'île la destination et le soleil ce qui donne de l'énergie.",
      whenToUse: [
        "En rétrospective de Sprint pour structurer le diagnostic d'équipe",
        "Pour rendre visible ce qui aide, freine et menace l'équipe",
        "Pour aligner l'équipe sur un objectif commun",
      ],
      expectedOutput: [
        "Identification correcte des 5 zones du voilier",
        "Classement de situations Scrum dans les zones appropriées",
      ],
    },
    dataset: sailboatRetrospectiveDataset,
  },
  {
    id: 'starfish',
    slug: 'starfish',
    title: 'Rétrospective Starfish',
    route: '/ateliers/starfish',
    categorySlug: 'retrospectives',
    toolName: 'Starfish Retrospective',
    level: 'intermediate',
    durationMinutes: 15,
    interactionType: 'drag-and-drop',
    summary: "Nuancer l'amélioration continue en 5 dimensions : amplifier, réduire, commencer, arrêter et conserver.",
    pedagogy: {
      objectives: [
        'Identifier les 5 dimensions de la Starfish Retrospective',
        'Distinguer Less of et Stop',
        'Distinguer More of et Keep',
        "Transformer des constats de rétrospective en intentions d'amélioration claires",
      ],
      toolExplanation: "La Starfish Retrospective aide l'équipe à nuancer son amélioration continue. Tout ne doit pas être seulement gardé ou supprimé : certaines pratiques méritent d'être amplifiées (More of), réduites (Less of), commencées (Start), arrêtées (Stop) ou préservées (Keep).",
      whenToUse: [
        'En rétrospective de Sprint pour dépasser le simple bien/mal',
        "Pour différencier ce qui doit être amplifié de ce qui doit être supprimé",
        "Pour produire des actions d'amélioration plus précises et actionnables",
      ],
      expectedOutput: [
        'Identification correcte des 5 dimensions Starfish',
        'Classification de situations Scrum dans les 5 dimensions',
      ],
    },
    dataset: starfishRetrospectiveDataset,
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
{ id: 'reframing', slug: 'reframing', title: 'Recadrage cognitif', route: '/ateliers/reframing', categorySlug: 'coaching-and-posture', toolName: 'Reframing', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Transformer une croyance limitante en perspective constructive.', comingSoon: true },
  { id: 'working-agreements', slug: 'working-agreements', title: 'Working Agreements', route: '/ateliers/working-agreements', categorySlug: 'team-intelligence', toolName: 'Working Agreements', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: "Construire collectivement les règles de fonctionnement d'une équipe.", comingSoon: true },
  { id: 'team-charter', slug: 'team-charter', title: 'Team Charter', route: '/ateliers/team-charter', categorySlug: 'team-intelligence', toolName: 'Team Charter', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Définir l'identité, les valeurs et les engagements d'une équipe.", comingSoon: true },
{ id: 'personal-maps', slug: 'personal-maps', title: 'Personal Maps', route: '/ateliers/personal-maps', categorySlug: 'management-3-0', toolName: 'Personal Maps', level: 'beginner', durationMinutes: 15, interactionType: 'canvas', summary: 'Créer une carte mentale personnelle pour mieux se connaître et se faire connaître.', comingSoon: true },
  { id: 'celebration-grid', slug: 'celebration-grid', title: 'Celebration Grid', route: '/ateliers/celebration-grid', categorySlug: 'management-3-0', toolName: 'Celebration Grid', level: 'intermediate', durationMinutes: 15, interactionType: 'matrix', summary: 'Distinguer succès et échecs liés aux pratiques vs à la chance pour célébrer intelligemment.', comingSoon: true },
  { id: 'team-health-check', slug: 'team-health-check', title: 'Team Health Check', route: '/ateliers/team-health-check', categorySlug: 'management-3-0', toolName: 'Team Health Check', level: 'intermediate', durationMinutes: 20, interactionType: 'voting', summary: "Évaluer collectivement la santé de l'équipe sur plusieurs dimensions.", comingSoon: true },
  { id: '5-whys', slug: '5-whys', title: '5 Pourquoi', route: '/ateliers/5-whys', categorySlug: 'problem-solving', toolName: '5 Whys', level: 'beginner', durationMinutes: 15, interactionType: 'guided-form', summary: 'Identifier la cause racine d\'un problème en posant 5 fois la question "Pourquoi ?".', comingSoon: true },
  { id: 'root-cause-analysis', slug: 'root-cause-analysis', title: 'Analyse des causes racines', route: '/ateliers/root-cause-analysis', categorySlug: 'problem-solving', toolName: 'Root Cause Analysis', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: "Méthode structurée pour remonter des symptômes aux causes profondes d'un problème.", comingSoon: true },

  // Conflict and communication — additions
  { id: 'crucial-conversations', slug: 'crucial-conversations', title: 'Crucial Conversations', route: '/ateliers/crucial-conversations', categorySlug: 'conflict-and-communication', toolName: 'Crucial Conversations', level: 'advanced', durationMinutes: 20, interactionType: 'dialogue', summary: 'Gérer les conversations à enjeux élevés avec sécurité et clarté.', comingSoon: true },
  { id: 'difficult-conversations', slug: 'difficult-conversations', title: 'Conversations difficiles', route: '/ateliers/difficult-conversations', categorySlug: 'conflict-and-communication', toolName: 'Difficult Conversations', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Framework pour aborder les conversations délicates avec empathie et clarté.', comingSoon: true },

  // Coaching and posture — additions

  { id: 'clean-language', slug: 'clean-language', title: 'Clean Language', route: '/ateliers/clean-language', categorySlug: 'coaching-and-posture', toolName: 'Clean Language', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: "Utiliser des questions neutres pour explorer les métaphores et croyances de l'interlocuteur.", comingSoon: true },
  { id: 'systemic-coaching', slug: 'systemic-coaching', title: 'Coaching systémique', route: '/ateliers/systemic-coaching', categorySlug: 'coaching-and-posture', toolName: 'Systemic Coaching', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Comprendre les dynamiques systémiques d'une équipe ou organisation.", comingSoon: true },
  { id: 'orsc', slug: 'orsc', title: 'ORSC — Organization and Relationship Systems Coaching', route: '/ateliers/orsc', categorySlug: 'coaching-and-posture', toolName: 'ORSC', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: 'Accompagner les systèmes relationnels (équipes, organisations) en coaching.', comingSoon: true },
  { id: 'immunity-to-change', slug: 'immunity-to-change', title: 'Immunity to Change', route: '/ateliers/immunity-to-change', categorySlug: 'coaching-and-posture', toolName: 'Immunity to Change', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: 'Identifier et lever les immunités au changement qui bloquent la croissance personnelle.', comingSoon: true },

  // Leadership (new category)
  { id: 'servant-leadership', slug: 'servant-leadership', title: 'Servant Leadership', route: '/ateliers/servant-leadership', categorySlug: 'leadership', toolName: 'Servant Leadership', level: 'intermediate', durationMinutes: 15, interactionType: 'reflection', summary: "Comprendre et pratiquer le leadership au service de l'équipe plutôt que du pouvoir.", comingSoon: true },
  { id: 'situational-leadership', slug: 'situational-leadership', title: 'Situational Leadership', route: '/ateliers/situational-leadership', categorySlug: 'leadership', toolName: 'Situational Leadership', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: "Adapter son style de leadership au niveau de maturité et d'autonomie du collaborateur.", comingSoon: true },

  // Facilitation — additions
  { id: 'lean-coffee', slug: 'lean-coffee', title: 'Lean Coffee', route: '/ateliers/lean-coffee', categorySlug: 'facilitation', toolName: 'Lean Coffee', level: 'beginner', durationMinutes: 15, interactionType: 'voting', summary: 'Organiser une réunion sans agenda prédéfini, guidée par les votes des participants.', comingSoon: true },
  { id: 'open-space-technology', slug: 'open-space-technology', title: 'Open Space Technology', route: '/ateliers/open-space-technology', categorySlug: 'facilitation', toolName: 'Open Space Technology', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: 'Organiser une grande réunion auto-organisée autour des thèmes qui émergent des participants.', comingSoon: true },
  { id: 'world-cafe', slug: 'world-cafe', title: 'World Café', route: '/ateliers/world-cafe', categorySlug: 'facilitation', toolName: 'World Café', level: 'beginner', durationMinutes: 20, interactionType: 'canvas', summary: "Faciliter des conversations profondes en petits groupes tournants autour d'une question centrale.", comingSoon: true },
  { id: 'appreciative-inquiry', slug: 'appreciative-inquiry', title: 'Appreciative Inquiry', route: '/ateliers/appreciative-inquiry', categorySlug: 'facilitation', toolName: 'Appreciative Inquiry', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Construire sur les forces et les succès passés pour imaginer l'avenir positif.", comingSoon: true },
{ id: 'fishbowl-discussion', slug: 'fishbowl-discussion', title: 'Fishbowl Discussion', route: '/ateliers/fishbowl-discussion', categorySlug: 'facilitation', toolName: 'Fishbowl Discussion', level: 'intermediate', durationMinutes: 20, interactionType: 'dialogue', summary: 'Faciliter un débat entre un petit groupe au centre observé par le reste des participants.', comingSoon: true },
  { id: 'confidence-vote', slug: 'confidence-vote', title: 'Confidence Vote', route: '/ateliers/confidence-vote', categorySlug: 'facilitation', toolName: 'Confidence Vote', level: 'beginner', durationMinutes: 10, interactionType: 'voting', summary: "Mesurer le niveau de confiance d'un groupe envers une décision ou un plan.", comingSoon: true },

  // Retrospectives (new category)
  { id: 'start-stop-continue', slug: 'start-stop-continue', title: 'Start/Stop/Continue', route: '/ateliers/start-stop-continue', categorySlug: 'retrospectives', toolName: 'Start/Stop/Continue', level: 'beginner', durationMinutes: 30, interactionType: 'canvas', summary: "Identifier ce que l'équipe devrait commencer, arrêter et continuer de faire.", comingSoon: true },

  { id: 'mad-sad-glad', slug: 'mad-sad-glad', title: 'Mad/Sad/Glad', route: '/ateliers/mad-sad-glad', categorySlug: 'retrospectives', toolName: 'Mad/Sad/Glad', level: 'beginner', durationMinutes: 20, interactionType: 'canvas', summary: "Explorer les émotions de l'équipe autour du sprint.", comingSoon: true },
  { id: '4-ls', slug: '4-ls', title: '4Ls — Liked, Learned, Lacked, Longed For', route: '/ateliers/4-ls', categorySlug: 'retrospectives', toolName: '4Ls', level: 'beginner', durationMinutes: 30, interactionType: 'canvas', summary: 'Rétrospective structurée en 4 catégories pour un feedback équilibré.', comingSoon: true },
  { id: 'timeline-retro', slug: 'timeline-retro', title: 'Timeline Retrospective', route: '/ateliers/timeline-retro', categorySlug: 'retrospectives', toolName: 'Timeline', level: 'intermediate', durationMinutes: 40, interactionType: 'canvas', summary: 'Reconstituer la chronologie du sprint ou de la release pour identifier les moments clés.', comingSoon: true },
  { id: 'futurespective', slug: 'futurespective', title: 'Futurespective', route: '/ateliers/futurespective', categorySlug: 'retrospectives', toolName: 'Futurespective', level: 'intermediate', durationMinutes: 30, interactionType: 'canvas', summary: "Imaginer un futur idéal et travailler à rebours pour définir les actions présentes.", comingSoon: true },
  { id: 'retrospective-radar', slug: 'retrospective-radar', title: 'Retrospective Radar', route: '/ateliers/retrospective-radar', categorySlug: 'retrospectives', toolName: 'Retrospective Radar', level: 'intermediate', durationMinutes: 25, interactionType: 'matrix', summary: "Évaluer la santé de l'équipe sur plusieurs dimensions avec un graphique radar.", comingSoon: true },
  { id: 'happiness-door', slug: 'happiness-door', title: 'Happiness Door', route: '/ateliers/happiness-door', categorySlug: 'retrospectives', toolName: 'Happiness Door', level: 'beginner', durationMinutes: 5, interactionType: 'voting', summary: 'Mesurer rapidement la satisfaction des participants à la fin d\'une session.', comingSoon: true },

  // Problem solving — additions
  { id: 'a3', slug: 'a3', title: 'A3 — Problem Solving', route: '/ateliers/a3', categorySlug: 'problem-solving', toolName: 'A3 Report', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Structurer la résolution de problème sur une feuille A3 : problème, analyse, solution, suivi.", comingSoon: true },
  { id: 'theory-of-constraints', slug: 'theory-of-constraints', title: 'Théorie des Contraintes', route: '/ateliers/theory-of-constraints', categorySlug: 'problem-solving', toolName: 'Theory of Constraints', level: 'advanced', durationMinutes: 25, interactionType: 'diagram', summary: "Identifier et éliminer le goulot d'étranglement qui limite le flux de valeur.", comingSoon: true },
  { id: 'dmaic', slug: 'dmaic', title: 'DMAIC — Six Sigma', route: '/ateliers/dmaic', categorySlug: 'problem-solving', toolName: 'DMAIC', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Processus d'amélioration continue en 5 étapes : Define, Measure, Analyze, Improve, Control.", comingSoon: true },
  { id: 'sipoc', slug: 'sipoc', title: 'SIPOC', route: '/ateliers/sipoc', categorySlug: 'problem-solving', toolName: 'SIPOC', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Cartographier un processus en 5 dimensions : Suppliers, Inputs, Process, Outputs, Customers.", comingSoon: true },
  { id: 'poka-yoke', slug: 'poka-yoke', title: 'Poka-Yoke', route: '/ateliers/poka-yoke', categorySlug: 'problem-solving', toolName: 'Poka-Yoke', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Concevoir des dispositifs anti-erreur pour rendre les défauts impossibles ou immédiatement détectables.', comingSoon: true },

  // Management 3.0 — additions
  { id: 'delegation-board', slug: 'delegation-board', title: 'Delegation Board', route: '/ateliers/delegation-board', categorySlug: 'management-3-0', toolName: 'Delegation Board', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: "Clarifier les niveaux de délégation pour chaque décision clé de l'équipe ou organisation.", comingSoon: true },
  { id: 'kudo-cards', slug: 'kudo-cards', title: 'Kudo Cards', route: '/ateliers/kudo-cards', categorySlug: 'management-3-0', toolName: 'Kudo Cards', level: 'beginner', durationMinutes: 10, interactionType: 'canvas', summary: 'Pratiquer la reconnaissance peer-to-peer avec des cartes de remerciement.', comingSoon: true },
  { id: 'merit-money', slug: 'merit-money', title: 'Merit Money', route: '/ateliers/merit-money', categorySlug: 'management-3-0', toolName: 'Merit Money', level: 'advanced', durationMinutes: 25, interactionType: 'voting', summary: 'Distribuer des points de mérite entre coéquipiers pour récompenser les comportements positifs.', comingSoon: true },
  { id: 'feedback-wraps', slug: 'feedback-wraps', title: 'Feedback Wraps', route: '/ateliers/feedback-wraps', categorySlug: 'management-3-0', toolName: 'Feedback Wraps', level: 'intermediate', durationMinutes: 20, interactionType: 'guided-form', summary: 'Structure Management 3.0 pour formuler un feedback constructif en 5 étapes.', comingSoon: true },

  // Team intelligence — additions
  { id: 'psychological-safety', slug: 'psychological-safety', title: 'Sécurité Psychologique', route: '/ateliers/psychological-safety', categorySlug: 'team-intelligence', toolName: 'Psychological Safety', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: "Évaluer et renforcer la sécurité psychologique au sein de l'équipe.", comingSoon: true },
  { id: 'team-canvas', slug: 'team-canvas', title: 'Team Canvas', route: '/ateliers/team-canvas', categorySlug: 'team-intelligence', toolName: 'Team Canvas', level: 'intermediate', durationMinutes: 30, interactionType: 'canvas', summary: "Co-construire l'identité, les valeurs et les processus d'une équipe en démarrage.", comingSoon: true },
  { id: 'tuckman', slug: 'tuckman', title: 'Modèle de Tuckman', route: '/ateliers/tuckman', categorySlug: 'team-intelligence', toolName: 'Tuckman Model', level: 'beginner', durationMinutes: 15, interactionType: 'diagram', summary: "Comprendre les 4 étapes du développement d'une équipe : Forming, Storming, Norming, Performing.", comingSoon: true },

  // Product discovery (new category)
  { id: 'user-story-mapping', slug: 'user-story-mapping', title: 'User Story Mapping', route: '/ateliers/user-story-mapping', categorySlug: 'product-discovery', toolName: 'User Story Mapping', level: 'intermediate', durationMinutes: 30, interactionType: 'canvas', summary: 'Organiser les user stories en carte pour visualiser le parcours utilisateur et prioriser les releases.', comingSoon: true },
  { id: 'impact-mapping', slug: 'impact-mapping', title: 'Impact Mapping', route: '/ateliers/impact-mapping', categorySlug: 'product-discovery', toolName: 'Impact Mapping', level: 'intermediate', durationMinutes: 25, interactionType: 'diagram', summary: 'Aligner les fonctionnalités aux objectifs en cartographiant acteurs, impacts et livrables.', comingSoon: true },
  { id: 'event-storming', slug: 'event-storming', title: 'Event Storming', route: '/ateliers/event-storming', categorySlug: 'product-discovery', toolName: 'Event Storming', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: 'Modéliser rapidement un domaine métier complexe par les événements.', comingSoon: true },
  { id: 'example-mapping', slug: 'example-mapping', title: 'Example Mapping', route: '/ateliers/example-mapping', categorySlug: 'product-discovery', toolName: 'Example Mapping', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Clarifier les user stories par des exemples, règles et questions avant le développement.', comingSoon: true },
  { id: 'story-splitting', slug: 'story-splitting', title: 'Story Splitting', route: '/ateliers/story-splitting', categorySlug: 'product-discovery', toolName: 'Story Splitting', level: 'intermediate', durationMinutes: 20, interactionType: 'guided-form', summary: 'Décomposer les grandes user stories en tranches livrables de valeur.', comingSoon: true },
  { id: 'three-amigos', slug: 'three-amigos', title: 'Three Amigos', route: '/ateliers/three-amigos', categorySlug: 'product-discovery', toolName: 'Three Amigos', level: 'intermediate', durationMinutes: 20, interactionType: 'dialogue', summary: 'Aligner BA, Dev et Test sur la compréhension d\'une story avant le développement.', comingSoon: true },
  { id: 'spec-by-example', slug: 'spec-by-example', title: 'Specification by Example', route: '/ateliers/spec-by-example', categorySlug: 'product-discovery', toolName: 'Spec by Example', level: 'advanced', durationMinutes: 25, interactionType: 'guided-form', summary: 'Rédiger des spécifications exécutables basées sur des exemples concrets.', comingSoon: true },
  { id: 'ost', slug: 'ost', title: 'OST — Objectif, Scope, Timeline', route: '/ateliers/ost', categorySlug: 'product-discovery', toolName: 'OST Framework', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Définir et aligner l'équipe sur l'objectif, le périmètre et le calendrier d'un projet.", comingSoon: true },
  { id: 'lean-inception', slug: 'lean-inception', title: 'Lean Inception', route: '/ateliers/lean-inception', categorySlug: 'product-discovery', toolName: 'Lean Inception', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: 'Workshop structuré pour aligner Product et Tech sur le MVP à construire.', comingSoon: true },
  { id: 'product-vision-board', slug: 'product-vision-board', title: 'Product Vision Board', route: '/ateliers/product-vision-board', categorySlug: 'product-discovery', toolName: 'Product Vision Board', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: 'Articuler la vision produit, la cible, les besoins, les fonctionnalités clés et la proposition de valeur.', comingSoon: true },
  { id: 'elevator-pitch', slug: 'elevator-pitch', title: 'Elevator Pitch', route: '/ateliers/elevator-pitch', categorySlug: 'product-discovery', toolName: 'Elevator Pitch', level: 'beginner', durationMinutes: 20, interactionType: 'guided-form', summary: "Formuler la valeur d'un produit en 30 secondes avec une structure claire.", comingSoon: true },
  { id: 'buy-a-feature', slug: 'buy-a-feature', title: 'Buy a Feature', route: '/ateliers/buy-a-feature', categorySlug: 'product-discovery', toolName: 'Buy a Feature', level: 'intermediate', durationMinutes: 25, interactionType: 'voting', summary: 'Prioriser les fonctionnalités en simulant un achat avec un budget fictif.', comingSoon: true },
  { id: 'prune-the-product-tree', slug: 'prune-the-product-tree', title: 'Prune the Product Tree', route: '/ateliers/prune-the-product-tree', categorySlug: 'product-discovery', toolName: 'Product Tree', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: 'Visualiser et prioriser le backlog produit sous forme d\'arbre de fonctionnalités.', comingSoon: true },
  { id: 'jtbd', slug: 'jtbd', title: 'Jobs to be Done', route: '/ateliers/jtbd', categorySlug: 'product-discovery', toolName: 'Jobs to be Done', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Comprendre les motivations profondes des utilisateurs pour concevoir un produit pertinent.", comingSoon: true },
  { id: 'design-thinking', slug: 'design-thinking', title: 'Design Thinking', route: '/ateliers/design-thinking', categorySlug: 'product-discovery', toolName: 'Design Thinking', level: 'intermediate', durationMinutes: 30, interactionType: 'canvas', summary: "Résoudre des problèmes complexes en 5 étapes centrées sur l'humain : Empathy, Define, Ideate, Prototype, Test.", comingSoon: true },
  { id: 'double-diamond', slug: 'double-diamond', title: 'Double Diamond', route: '/ateliers/double-diamond', categorySlug: 'product-discovery', toolName: 'Double Diamond', level: 'intermediate', durationMinutes: 25, interactionType: 'diagram', summary: 'Processus de design en 4 phases : Discover, Define, Develop, Deliver.', comingSoon: true },
  { id: 'design-sprint', slug: 'design-sprint', title: 'Design Sprint', route: '/ateliers/design-sprint', categorySlug: 'product-discovery', toolName: 'Design Sprint', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: 'Workshop de 5 jours pour concevoir, prototyper et tester une solution rapidement.', comingSoon: true },

  // Prioritization (new category)
  { id: 'wsjf', slug: 'wsjf', title: 'WSJF — Weighted Shortest Job First', route: '/ateliers/wsjf', categorySlug: 'prioritization', toolName: 'WSJF', level: 'advanced', durationMinutes: 20, interactionType: 'matrix', summary: 'Prioriser les fonctionnalités SAFe en divisant le Coût du Délai par la taille.', comingSoon: true },
  { id: 'rice', slug: 'rice', title: 'RICE Scoring', route: '/ateliers/rice', categorySlug: 'prioritization', toolName: 'RICE', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Prioriser les initiatives selon Reach, Impact, Confidence et Effort.', comingSoon: true },
  { id: 'moscow', slug: 'moscow', title: 'MoSCoW', route: '/ateliers/moscow', categorySlug: 'prioritization', toolName: 'MoSCoW', level: 'beginner', durationMinutes: 15, interactionType: 'drag-and-drop', summary: "Classer les exigences en Must have, Should have, Could have et Won't have.", comingSoon: true },
  { id: 'kano', slug: 'kano', title: 'Modèle de Kano', route: '/ateliers/kano', categorySlug: 'prioritization', toolName: 'Kano Model', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Classer les fonctionnalités selon leur impact sur la satisfaction client.', comingSoon: true },
  { id: 'cost-of-delay', slug: 'cost-of-delay', title: 'Cost of Delay', route: '/ateliers/cost-of-delay', categorySlug: 'prioritization', toolName: 'Cost of Delay', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Quantifier le coût économique du retard de livraison d\'une fonctionnalité.', comingSoon: true },
  { id: 'eisenhower', slug: 'eisenhower', title: 'Matrice Eisenhower', route: '/ateliers/eisenhower', categorySlug: 'prioritization', toolName: 'Eisenhower Matrix', level: 'beginner', durationMinutes: 15, interactionType: 'matrix', summary: 'Prioriser ses actions selon les axes Urgent/Important pour gérer son temps.', comingSoon: true },
  { id: 'impact-effort', slug: 'impact-effort', title: 'Matrice Impact/Effort', route: '/ateliers/impact-effort', categorySlug: 'prioritization', toolName: 'Impact/Effort Matrix', level: 'beginner', durationMinutes: 15, interactionType: 'matrix', summary: 'Identifier les quick wins, projets majeurs, tâches de remplissage et actions à éviter.', comingSoon: true },

  // Stakeholders and alignment — additions
  { id: 'customer-journey-mapping', slug: 'customer-journey-mapping', title: 'Customer Journey Mapping', route: '/ateliers/customer-journey-mapping', categorySlug: 'stakeholders-and-alignment', toolName: 'Customer Journey Map', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Visualiser le parcours complet d'un client et identifier les moments de vérité et points de friction.", comingSoon: true },
  { id: 'service-blueprint', slug: 'service-blueprint', title: 'Service Blueprint', route: '/ateliers/service-blueprint', categorySlug: 'stakeholders-and-alignment', toolName: 'Service Blueprint', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: 'Cartographier les processus de service en distinguant les parties visibles et invisibles pour l\'utilisateur.', comingSoon: true },

  // Decision making (new category)
  { id: 'raci', slug: 'raci', title: 'Matrice RACI', route: '/ateliers/raci', categorySlug: 'decision-making', toolName: 'RACI', level: 'beginner', durationMinutes: 20, interactionType: 'matrix', summary: 'Clarifier les rôles décisionnels : Responsible, Accountable, Consulted, Informed.', comingSoon: true },
  { id: 'daci', slug: 'daci', title: 'DACI', route: '/ateliers/daci', categorySlug: 'decision-making', toolName: 'DACI', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Définir les rôles de décision : Driver, Approver, Contributors, Informed.', comingSoon: true },
  { id: 'rapid', slug: 'rapid', title: 'RAPID', route: '/ateliers/rapid', categorySlug: 'decision-making', toolName: 'RAPID Decision Making', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Framework de décision Bain avec 5 rôles : Recommend, Agree, Perform, Input, Decide.', comingSoon: true },
  { id: 'decision-matrix', slug: 'decision-matrix', title: 'Matrice de Décision', route: '/ateliers/decision-matrix', categorySlug: 'decision-making', toolName: 'Decision Matrix', level: 'beginner', durationMinutes: 20, interactionType: 'matrix', summary: 'Évaluer et comparer des options selon des critères pondérés.', comingSoon: true },
  { id: 'decision-tree', slug: 'decision-tree', title: 'Arbre de Décision', route: '/ateliers/decision-tree', categorySlug: 'decision-making', toolName: 'Decision Tree', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: 'Structurer les décisions complexes et leurs conséquences sous forme d\'arbre.', comingSoon: true },
  { id: 'premortem', slug: 'premortem', title: 'Premortem', route: '/ateliers/premortem', categorySlug: 'decision-making', toolName: 'Premortem', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Anticiper les échecs potentiels d'un projet en se projetant dans un futur négatif.", comingSoon: true },

  // Delivery excellence (new category)
  { id: 'blameless-postmortem', slug: 'blameless-postmortem', title: 'Blameless Postmortem', route: '/ateliers/blameless-postmortem', categorySlug: 'delivery-excellence', toolName: 'Blameless Postmortem', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: "Analyser un incident sans chercher de coupable pour apprendre et améliorer les systèmes.", comingSoon: true },
  { id: 'incident-review', slug: 'incident-review', title: 'Incident Review', route: '/ateliers/incident-review', categorySlug: 'delivery-excellence', toolName: 'Incident Review', level: 'intermediate', durationMinutes: 25, interactionType: 'canvas', summary: "Structurer l'analyse d'un incident pour identifier les actions préventives.", comingSoon: true },
  { id: 'learning-review', slug: 'learning-review', title: 'Learning Review', route: '/ateliers/learning-review', categorySlug: 'delivery-excellence', toolName: 'Learning Review', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Tirer les enseignements d'une expérimentation ou d'un échec pour améliorer les pratiques.", comingSoon: true },
  { id: 'dora-metrics', slug: 'dora-metrics', title: 'DORA Metrics', route: '/ateliers/dora-metrics', categorySlug: 'delivery-excellence', toolName: 'DORA Metrics', level: 'advanced', durationMinutes: 20, interactionType: 'matrix', summary: 'Mesurer la performance de livraison avec les 4 métriques DORA : Deployment Frequency, Lead Time, MTTR, Change Failure Rate.', comingSoon: true },
  { id: 'dor-review', slug: 'dor-review', title: 'Definition of Ready Review', route: '/ateliers/dor-review', categorySlug: 'delivery-excellence', toolName: 'DoR Review', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Évaluer et améliorer la Definition of Ready pour garantir la qualité des entrées de sprint.", comingSoon: true },
  { id: 'dod-review', slug: 'dod-review', title: 'Definition of Done Review', route: '/ateliers/dod-review', categorySlug: 'delivery-excellence', toolName: 'DoD Review', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Évaluer et améliorer la Definition of Done pour garantir la qualité des livrables.', comingSoon: true },

  // Systems thinking (new category)
  { id: 'value-stream-mapping', slug: 'value-stream-mapping', title: 'Value Stream Mapping', route: '/ateliers/value-stream-mapping', categorySlug: 'systems-thinking', toolName: 'Value Stream Mapping', level: 'advanced', durationMinutes: 30, interactionType: 'diagram', summary: "Visualiser et analyser le flux de valeur de bout en bout pour identifier les gaspillages.", comingSoon: true },
  { id: 'dependency-mapping', slug: 'dependency-mapping', title: 'Dependency Mapping', route: '/ateliers/dependency-mapping', categorySlug: 'systems-thinking', toolName: 'Dependency Mapping', level: 'intermediate', durationMinutes: 25, interactionType: 'diagram', summary: 'Cartographier les dépendances entre équipes ou composants pour réduire les blocages.', comingSoon: true },
  { id: 'kanban', slug: 'kanban', title: 'Kanban', route: '/ateliers/kanban', categorySlug: 'systems-thinking', toolName: 'Kanban', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Visualiser et optimiser le flux de travail en limitant le travail en cours (WIP).', comingSoon: true },
  { id: 'littles-law', slug: 'littles-law', title: "Loi de Little", route: '/ateliers/littles-law', categorySlug: 'systems-thinking', toolName: "Little's Law", level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: 'Comprendre la relation entre WIP, débit et temps de cycle dans un système de flux.', comingSoon: true },
  { id: 'wardley-mapping', slug: 'wardley-mapping', title: 'Wardley Mapping', route: '/ateliers/wardley-mapping', categorySlug: 'systems-thinking', toolName: 'Wardley Mapping', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: "Visualiser le paysage stratégique et les évolutions d'une industrie pour guider les décisions.", comingSoon: true },
  { id: 'causal-loop-diagram', slug: 'causal-loop-diagram', title: 'Diagramme Causal', route: '/ateliers/causal-loop-diagram', categorySlug: 'systems-thinking', toolName: 'Causal Loop Diagram', level: 'advanced', durationMinutes: 25, interactionType: 'diagram', summary: "Modéliser les boucles de causalité d'un système pour comprendre les dynamiques.", comingSoon: true },
  { id: 'systems-thinking-atelier', slug: 'systems-thinking-atelier', title: 'Pensée Systémique', route: '/ateliers/systems-thinking-atelier', categorySlug: 'systems-thinking', toolName: 'Systems Thinking', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Comprendre les interdépendances, boucles de rétroaction et effets de levier dans un système complexe.", comingSoon: true },
  { id: 'ooda-loop', slug: 'ooda-loop', title: 'Boucle OODA', route: '/ateliers/ooda-loop', categorySlug: 'systems-thinking', toolName: 'OODA Loop', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: 'Observer, Orienter, Décider, Agir : un cycle de prise de décision pour les environnements incertains.', comingSoon: true },
  { id: 'pdca', slug: 'pdca', title: 'Roue de Deming (PDCA)', route: '/ateliers/pdca', categorySlug: 'systems-thinking', toolName: 'PDCA', level: 'beginner', durationMinutes: 15, interactionType: 'diagram', summary: 'Améliorer continuellement par 4 étapes : Plan, Do, Check, Act.', comingSoon: true },
  { id: 'kaizen', slug: 'kaizen', title: 'Kaizen', route: '/ateliers/kaizen', categorySlug: 'systems-thinking', toolName: 'Kaizen', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: "Mettre en œuvre une culture d'amélioration continue par des petits changements incrémentaux.", comingSoon: true },

  // Organization design (new category)
  { id: 'conways-law', slug: 'conways-law', title: "Loi de Conway", route: '/ateliers/conways-law', categorySlug: 'organization-design', toolName: "Conway's Law", level: 'intermediate', durationMinutes: 20, interactionType: 'reflection', summary: "Comprendre comment la structure organisationnelle influence l'architecture des systèmes produits.", comingSoon: true },
  { id: 'inverse-conway', slug: 'inverse-conway', title: "Manœuvre de Conway Inverse", route: '/ateliers/inverse-conway', categorySlug: 'organization-design', toolName: "Inverse Conway Maneuver", level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Concevoir la structure organisationnelle à partir de l'architecture cible du système.", comingSoon: true },
  { id: 'team-topologies', slug: 'team-topologies', title: 'Team Topologies', route: '/ateliers/team-topologies', categorySlug: 'organization-design', toolName: 'Team Topologies', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: 'Concevoir des équipes optimales pour le flux de valeur : Stream-aligned, Platform, Enabling, Complicated-subsystem.', comingSoon: true },
  { id: 'mckinsey-7s', slug: 'mckinsey-7s', title: 'McKinsey 7S', route: '/ateliers/mckinsey-7s', categorySlug: 'organization-design', toolName: 'McKinsey 7S Framework', level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Analyser l'alignement de 7 dimensions organisationnelles : Strategy, Structure, Systems, Shared Values, Skills, Style, Staff.", comingSoon: true },

  // Change management (new category)
  { id: 'adkar', slug: 'adkar', title: 'ADKAR', route: '/ateliers/adkar', categorySlug: 'change-management', toolName: 'ADKAR Model', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Comprendre et accompagner le changement individuel : Awareness, Desire, Knowledge, Ability, Reinforcement.', comingSoon: true },
  { id: 'kotter-8-step', slug: 'kotter-8-step', title: '8 Étapes de Kotter', route: '/ateliers/kotter-8-step', categorySlug: 'change-management', toolName: 'Kotter 8-Step Change Model', level: 'intermediate', durationMinutes: 25, interactionType: 'ranking', summary: 'Guider un changement organisationnel en 8 étapes structurées.', comingSoon: true },
  { id: 'bridges-transition', slug: 'bridges-transition', title: 'Modèle de Transition de Bridges', route: '/ateliers/bridges-transition', categorySlug: 'change-management', toolName: 'Bridges Transition Model', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: 'Accompagner les équipes à travers les 3 phases psychologiques du changement.', comingSoon: true },
  { id: 'satir-change', slug: 'satir-change', title: 'Modèle de Changement de Satir', route: '/ateliers/satir-change', categorySlug: 'change-management', toolName: 'Satir Change Model', level: 'intermediate', durationMinutes: 20, interactionType: 'diagram', summary: 'Comprendre les phases émotionnelles traversées lors d\'un changement systémique.', comingSoon: true },
  { id: 'force-field-analysis', slug: 'force-field-analysis', title: 'Analyse de Champ de Forces', route: '/ateliers/force-field-analysis', categorySlug: 'change-management', toolName: 'Force Field Analysis', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Identifier les forces favorisant et freinant un changement pour définir les actions de levier.', comingSoon: true },
  { id: 'scarf', slug: 'scarf', title: 'Modèle SCARF', route: '/ateliers/scarf', categorySlug: 'change-management', toolName: 'SCARF Model', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: 'Comprendre les 5 déclencheurs sociaux qui influencent le comportement humain : Status, Certainty, Autonomy, Relatedness, Fairness.', comingSoon: true },

  // Strategic thinking (new category)
  { id: 'circle-of-influence', slug: 'circle-of-influence', title: "Cercle d'Influence", route: '/ateliers/circle-of-influence', categorySlug: 'strategic-thinking', toolName: "Circle of Influence", level: 'beginner', durationMinutes: 15, interactionType: 'matrix', summary: "Distinguer ce qui est sous contrôle, sous influence et hors de portée pour concentrer l'énergie.", comingSoon: true },
  { id: '7-habits', slug: '7-habits', title: 'Les 7 Habitudes', route: '/ateliers/7-habits', categorySlug: 'strategic-thinking', toolName: 'The 7 Habits of Highly Effective People', level: 'intermediate', durationMinutes: 25, interactionType: 'ranking', summary: 'Comprendre et appliquer les 7 habitudes de Covey pour un leadership efficace.', comingSoon: true },
  { id: 'antifragile', slug: 'antifragile', title: 'Antifragile', route: '/ateliers/antifragile', categorySlug: 'strategic-thinking', toolName: 'Antifragile', level: 'advanced', durationMinutes: 25, interactionType: 'reflection', summary: "Concevoir des systèmes et pratiques qui se renforcent sous la pression et l'incertitude.", comingSoon: true },
  { id: 'double-loop-learning', slug: 'double-loop-learning', title: 'Double Loop Learning', route: '/ateliers/double-loop-learning', categorySlug: 'strategic-thinking', toolName: 'Double Loop Learning', level: 'advanced', durationMinutes: 20, interactionType: 'reflection', summary: 'Remettre en question les hypothèses profondes, pas seulement les actions (simple vs double loop).', comingSoon: true },
  { id: 'first-principles', slug: 'first-principles', title: 'Raisonnement par Premiers Principes', route: '/ateliers/first-principles', categorySlug: 'strategic-thinking', toolName: 'First Principles Thinking', level: 'advanced', durationMinutes: 20, interactionType: 'guided-form', summary: "Décomposer un problème jusqu'à ses vérités fondamentales pour innover radicalement.", comingSoon: true },
  { id: 'second-order-thinking', slug: 'second-order-thinking', title: 'Pensée de Second Ordre', route: '/ateliers/second-order-thinking', categorySlug: 'strategic-thinking', toolName: 'Second-Order Thinking', level: 'advanced', durationMinutes: 20, interactionType: 'reflection', summary: 'Anticiper les conséquences des conséquences pour des décisions plus robustes.', comingSoon: true },
  { id: 'mental-models', slug: 'mental-models', title: 'Modèles Mentaux', route: '/ateliers/mental-models', categorySlug: 'strategic-thinking', toolName: 'Mental Models', level: 'intermediate', durationMinutes: 20, interactionType: 'canvas', summary: 'Enrichir sa boîte à outils cognitive avec des cadres de réflexion transversaux.', comingSoon: true },
  { id: 'inversion-thinking', slug: 'inversion-thinking', title: 'Pensée Inversée', route: '/ateliers/inversion-thinking', categorySlug: 'strategic-thinking', toolName: 'Inversion Thinking', level: 'intermediate', durationMinutes: 15, interactionType: 'guided-form', summary: 'Résoudre des problèmes en inversant la question : "Comment rater ?" plutôt que "Comment réussir ?"', comingSoon: true },
  { id: 'hoshin-kanri', slug: 'hoshin-kanri', title: 'Hoshin Kanri', route: '/ateliers/hoshin-kanri', categorySlug: 'strategic-thinking', toolName: 'Hoshin Kanri', level: 'advanced', durationMinutes: 30, interactionType: 'canvas', summary: "Déployer la stratégie de l'organisation jusqu'aux équipes opérationnelles par la méthode X-Matrix.", comingSoon: true },
  { id: 'swot', slug: 'swot', title: 'Analyse SWOT', route: '/ateliers/swot', categorySlug: 'strategic-thinking', toolName: 'SWOT Analysis', level: 'beginner', durationMinutes: 15, interactionType: 'matrix', summary: "Évaluer les Forces, Faiblesses, Opportunités et Menaces d'une situation ou d'un projet.", comingSoon: true },
  { id: 'pest', slug: 'pest', title: 'Analyse PEST', route: '/ateliers/pest', categorySlug: 'strategic-thinking', toolName: 'PEST Analysis', level: 'intermediate', durationMinutes: 20, interactionType: 'matrix', summary: "Analyser les facteurs Politiques, Économiques, Sociaux et Technologiques d'un environnement.", comingSoon: true },
  { id: 'porters-five-forces', slug: 'porters-five-forces', title: "5 Forces de Porter", route: '/ateliers/porters-five-forces', categorySlug: 'strategic-thinking', toolName: "Porter's Five Forces", level: 'advanced', durationMinutes: 25, interactionType: 'canvas', summary: "Analyser l'intensité concurrentielle d'un secteur selon 5 forces.", comingSoon: true },
]

export const WORKSHOP_DEFINITIONS: WorkshopDefinition[] = [...EXISTING, ...COMING_SOON]
