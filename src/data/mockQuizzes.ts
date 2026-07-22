export interface Question {
  id: string;
  questionText: string;
  questionType: 'mcq' | 'true_false' | 'short_answer' | 'multi_select';
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  timeLimitMinutes: number;
  passingScore: number;
  shuffleQuestions: boolean;
  showExplanations: boolean;
  status: 'draft' | 'published' | 'archived';
  questionsCount: number;
  questions?: Question[];
}

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Rational Numbers Quiz',
    description: 'Test your understanding of rational numbers and their properties.',
    subject: 'Mathematics',
    timeLimitMinutes: 15,
    passingScore: 70,
    shuffleQuestions: true,
    showExplanations: true,
    status: 'published',
    questionsCount: 5,
    questions: [
      {
        id: 'q1',
        questionText: 'What is the additive identity for rational numbers?',
        questionType: 'mcq',
        options: ['0', '1', '-1', 'None of these'],
        correctAnswer: '0',
        explanation: 'Zero is the additive identity because adding zero to any number results in the same number.',
        points: 2
      }
    ]
  }
];
