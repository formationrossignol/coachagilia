import type { CertQuestion } from '../types'

export const pspoQuestions: CertQuestion[] = [
  {
    id: 'pspo-q1', certificationId: 'pspo', topic: 'product-value',
    text: 'Who is responsible for maximizing the value of the product resulting from the work of the Scrum Team?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Product Owner' }, { letter: 'C', text: 'The Developers' }, { letter: 'D', text: 'The stakeholders' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q2', certificationId: 'pspo', topic: 'product-backlog',
    text: 'Who is accountable for ordering the Product Backlog?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Developers' }, { letter: 'C', text: 'The Product Owner' }, { letter: 'D', text: 'The stakeholders' }],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q3', certificationId: 'pspo', topic: 'sprint',
    text: 'Who has the authority to cancel a Sprint?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Product Owner' }, { letter: 'C', text: 'The Developers' }, { letter: 'D', text: 'Senior management' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q4', certificationId: 'pspo', topic: 'product-goal',
    text: 'What is the Product Goal?',
    options: [
      { letter: 'A', text: 'The Sprint objective for the current Sprint' },
      { letter: 'B', text: 'A long-term objective for the Scrum Team that gives purpose to the Product Backlog' },
      { letter: 'C', text: 'A list of all features to be delivered' },
      { letter: 'D', text: 'The release plan for the next quarter' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q5', certificationId: 'pspo', topic: 'stakeholders',
    text: 'During the Sprint Review, who should attend?',
    options: [
      { letter: 'A', text: 'Only the Scrum Team' },
      { letter: 'B', text: 'The Scrum Team and key stakeholders invited by the Product Owner' },
      { letter: 'C', text: 'Only the Product Owner and stakeholders' },
      { letter: 'D', text: 'The entire organization' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q6', certificationId: 'pspo', topic: 'product-backlog',
    text: 'Which two statements about Product Backlog refinement are correct? (Choose 2)',
    options: [
      { letter: 'A', text: 'It is a formal event with a fixed timebox' },
      { letter: 'B', text: 'It is an ongoing activity throughout the Sprint' },
      { letter: 'C', text: 'Only the Product Owner can refine items' },
      { letter: 'D', text: 'The Developers participate in refinement' },
    ],
    correctAnswer: ['B', 'D'], isMultiple: true,
  },
  {
    id: 'pspo-q7', certificationId: 'pspo', topic: 'product-value',
    text: 'A Product Owner is struggling to get stakeholder engagement during Sprint Reviews. What is the best action?',
    options: [
      { letter: 'A', text: 'Cancel the Sprint Reviews and send written reports instead' },
      { letter: 'B', text: 'Make Sprint Reviews more focused on business value and outcomes rather than technical details' },
      { letter: 'C', text: 'Ask the Scrum Master to mandate attendance' },
      { letter: 'D', text: 'Reduce the frequency of Sprint Reviews' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q8', certificationId: 'pspo', topic: 'product-backlog',
    text: 'What happens to the Product Backlog when a Product Goal is achieved?',
    options: [
      { letter: 'A', text: 'The Product Backlog is archived' },
      { letter: 'B', text: 'A new Product Goal is established or the product is retired' },
      { letter: 'C', text: 'The team automatically starts the next sprint' },
      { letter: 'D', text: 'The Scrum Master reorders the backlog' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q9', certificationId: 'pspo', topic: 'stakeholders',
    text: 'The Product Owner can delegate Product Backlog management tasks to others. However, who remains accountable?',
    options: [{ letter: 'A', text: 'The Scrum Master' }, { letter: 'B', text: 'The Developers' }, { letter: 'C', text: 'The Product Owner' }, { letter: 'D', text: 'Whoever was delegated the task' }],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q10', certificationId: 'pspo', topic: 'product-value',
    text: 'Which of the following best describes value in Scrum?',
    options: [
      { letter: 'A', text: 'The number of features delivered per Sprint' },
      { letter: 'B', text: 'Meeting all items in the Sprint Backlog' },
      { letter: 'C', text: 'The outcome delivered to stakeholders and users that advances the Product Goal' },
      { letter: 'D', text: 'The velocity achieved by the Developers' },
    ],
    correctAnswer: ['C'], isMultiple: false,
  },
  {
    id: 'pspo-q11', certificationId: 'pspo', topic: 'sprint',
    text: 'What should happen if the Developers determine they cannot complete all Sprint Backlog items by the end of the Sprint?',
    options: [
      { letter: 'A', text: 'Extend the Sprint to finish the work' },
      { letter: 'B', text: 'Negotiate the scope of the Sprint Backlog with the Product Owner' },
      { letter: 'C', text: 'Remove items from the Sprint Backlog without telling the PO' },
      { letter: 'D', text: 'Ask the Scrum Master to add more Developers' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q12', certificationId: 'pspo', topic: 'product-goal',
    text: 'How many Product Goals can a Scrum Team pursue at one time?',
    options: [{ letter: 'A', text: 'As many as needed' }, { letter: 'B', text: 'One' }, { letter: 'C', text: 'One per Developer' }, { letter: 'D', text: 'Two — one for the current Sprint, one long-term' }],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q13', certificationId: 'pspo', topic: 'stakeholders',
    text: 'Which two actions help a Product Owner manage stakeholder expectations effectively? (Choose 2)',
    options: [
      { letter: 'A', text: 'Share the Product Goal and roadmap direction regularly' },
      { letter: 'B', text: 'Promise specific features for specific dates' },
      { letter: 'C', text: 'Invite stakeholders to Sprint Reviews to inspect the Increment' },
      { letter: 'D', text: 'Keep backlog items secret to avoid pressure' },
    ],
    correctAnswer: ['A', 'C'], isMultiple: true,
  },
  {
    id: 'pspo-q14', certificationId: 'pspo', topic: 'product-backlog',
    text: 'What is the purpose of ordering the Product Backlog?',
    options: [
      { letter: 'A', text: 'To ensure tasks are assigned to the right Developers' },
      { letter: 'B', text: 'To ensure the most valuable and important items are addressed first' },
      { letter: 'C', text: 'To document completed work' },
      { letter: 'D', text: 'To satisfy regulatory requirements' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
  {
    id: 'pspo-q15', certificationId: 'pspo', topic: 'product-value',
    text: 'A stakeholder requests a feature that the Product Owner believes will not increase value. What should the PO do?',
    options: [
      { letter: 'A', text: 'Add it to the Product Backlog immediately to keep the stakeholder happy' },
      { letter: 'B', text: 'Discuss the value of the feature with the stakeholder and consider alternatives that achieve the same goal' },
      { letter: 'C', text: 'Ask the Scrum Master to refuse the request' },
      { letter: 'D', text: 'Add it to the bottom of the backlog and never prioritize it' },
    ],
    correctAnswer: ['B'], isMultiple: false,
  },
]
