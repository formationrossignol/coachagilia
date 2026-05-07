import type { CertQuestion } from '../types'

export const pmiacpQuestions: CertQuestion[] = [
  {
    id: 'acp-q1', certificationId: 'pmi-acp', topic: 'agile-mindset',
    text: "Which of the following best describes the Agile Manifesto's stance on processes and tools versus individuals and interactions?",
    options: [
      { letter: 'A', text: 'Processes and tools are more important for scaling teams' },
      { letter: 'B', text: 'Individuals and interactions are valued over processes and tools' },
      { letter: 'C', text: 'Both are equally important' },
      { letter: 'D', text: 'Tools eliminate the need for interactions' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q2', certificationId: 'pmi-acp', topic: 'value-delivery',
    text: 'A project team delivers working software every two weeks but stakeholders rarely see business value. What should the team focus on?',
    options: [
      { letter: 'A', text: 'Increase delivery frequency to weekly' },
      { letter: 'B', text: 'Align iterations to deliver outcomes that measurably advance business goals' },
      { letter: 'C', text: 'Reduce the size of user stories' },
      { letter: 'D', text: 'Add a dedicated testing phase after each iteration' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q3', certificationId: 'pmi-acp', topic: 'adaptive-planning',
    text: 'What is rolling wave planning?',
    options: [
      { letter: 'A', text: 'Planning all details upfront before starting' },
      { letter: 'B', text: 'Planning near-term work in detail while keeping future work at a higher level' },
      { letter: 'C', text: 'Planning only one iteration at a time' },
      { letter: 'D', text: 'A Kanban planning ceremony' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q4', certificationId: 'pmi-acp', topic: 'team-performance',
    text: 'A team is underperforming. According to Agile principles, who should decide how to improve their process?',
    options: [
      { letter: 'A', text: 'The project manager' },
      { letter: 'B', text: 'The team itself through retrospectives' },
      { letter: 'C', text: 'The PMO' },
      { letter: 'D', text: 'An external consultant' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q5', certificationId: 'pmi-acp', topic: 'stakeholder-engagement',
    text: 'Which two practices best support ongoing stakeholder engagement in an Agile project? (Choose 2)',
    options: [
      { letter: 'A', text: 'Frequent demos of working software' },
      { letter: 'B', text: 'Formal written status reports sent monthly' },
      { letter: 'C', text: 'Involving stakeholders in backlog refinement' },
      { letter: 'D', text: 'Freezing requirements after kickoff' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'acp-q6', certificationId: 'pmi-acp', topic: 'continuous-improvement',
    text: "What is the primary purpose of a retrospective in Agile?",
    options: [
      { letter: 'A', text: 'To report project status to management' },
      { letter: 'B', text: "To inspect and adapt the team's process for continuous improvement" },
      { letter: 'C', text: 'To review the product backlog' },
      { letter: 'D', text: 'To plan the next iteration' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q7', certificationId: 'pmi-acp', topic: 'kanban',
    text: 'What is the main purpose of WIP limits in Kanban?',
    options: [
      { letter: 'A', text: 'To limit the number of team members' },
      { letter: 'B', text: 'To reduce multitasking and improve flow by limiting work in progress' },
      { letter: 'C', text: 'To set a deadline for each task' },
      { letter: 'D', text: 'To prevent new work from being requested' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q8', certificationId: 'pmi-acp', topic: 'value-delivery',
    text: 'A team is asked to add a large feature. Using Agile principles, what is the best approach?',
    options: [
      { letter: 'A', text: 'Build it in one long iteration to avoid disruption' },
      { letter: 'B', text: 'Break it into smaller deliverable increments with early value' },
      { letter: 'C', text: 'Defer it to after the project goes live' },
      { letter: 'D', text: 'Assign it to a separate team' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q9', certificationId: 'pmi-acp', topic: 'agile-mindset',
    text: 'Which statement best reflects the Agile principle of responding to change over following a plan?',
    options: [
      { letter: 'A', text: 'Plans should never change once agreed' },
      { letter: 'B', text: 'Change is inevitable and welcome when it delivers customer value' },
      { letter: 'C', text: 'Only the customer can request changes' },
      { letter: 'D', text: 'Changes must be submitted through a formal change control board' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q10', certificationId: 'pmi-acp', topic: 'team-performance',
    text: 'What is the benefit of co-locating an Agile team?',
    options: [
      { letter: 'A', text: 'It reduces the need for documentation' },
      { letter: 'B', text: 'It improves communication speed and reduces coordination overhead' },
      { letter: 'C', text: 'It guarantees faster delivery' },
      { letter: 'D', text: 'It replaces the need for daily standups' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q11', certificationId: 'pmi-acp', topic: 'adaptive-planning',
    text: 'Story points are used to estimate:',
    options: [
      { letter: 'A', text: 'Hours of work required' },
      { letter: 'B', text: 'Relative effort and complexity of a user story' },
      { letter: 'C', text: 'The number of team members needed' },
      { letter: 'D', text: 'Business value of a feature' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'acp-q12', certificationId: 'pmi-acp', topic: 'continuous-improvement',
    text: 'Which two activities support a culture of continuous improvement? (Choose 2)',
    options: [
      { letter: 'A', text: 'Regular retrospectives with actionable outcomes' },
      { letter: 'B', text: 'Blameless post-mortems after failures' },
      { letter: 'C', text: 'Assigning blame to underperforming individuals' },
      { letter: 'D', text: 'Freezing the process once it works' },
    ],
    correctAnswer: ['A', 'B'], isMultiple: true,
  },
]
