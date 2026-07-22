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
  difficulty?: 'Medium' | 'Tough / Advanced' | 'Hard';
  questions?: Question[];
}

export const mockQuizzes: Quiz[] = [
  // ==========================================
  // QUIZ 1: ADVANCED RATIONAL NUMBERS (10 Qs, 10 Mins, TOUGH)
  // ==========================================
  {
    id: 'quiz-rational-numbers-adv',
    title: 'Advanced Rational Numbers Challenge',
    description: 'Challenging 10-question speed quiz on multiplicative inverses, density property, complex algebraic operations, and word problems.',
    subject: 'Mathematics',
    timeLimitMinutes: 10,
    passingScore: 70,
    shuffleQuestions: true,
    showExplanations: true,
    status: 'published',
    questionsCount: 10,
    difficulty: 'Tough / Advanced',
    questions: [
      {
        id: 'rn-1',
        questionText: 'What is the multiplicative inverse of (-5/8) × (-3/7)?',
        questionType: 'mcq',
        options: ['15/56', '56/15', '-56/15', '-15/56'],
        correctAnswer: '56/15',
        explanation: '(-5/8) × (-3/7) = 15/56. The multiplicative inverse (reciprocal) of 15/56 is 56/15.',
        points: 2
      },
      {
        id: 'rn-2',
        questionText: 'Which rational number lies exactly halfway between -3/4 and 5/6?',
        questionType: 'mcq',
        options: ['1/24', '1/12', '1/6', '7/24'],
        correctAnswer: '1/24',
        explanation: 'Midpoint = [(-3/4) + (5/6)] / 2 = [(-9/12) + (10/12)] / 2 = (1/12) / 2 = 1/24.',
        points: 2
      },
      {
        id: 'rn-3',
        questionText: 'Evaluate: 2/3 + (-5/6) ÷ (15/4) - (-2/5) × (3/4)',
        questionType: 'mcq',
        options: ['67/90', '43/90', '71/90', '1/2'],
        correctAnswer: '67/90',
        explanation: 'Division: (-5/6) ÷ (15/4) = -2/9. Multiplication: (-2/5) × (3/4) = -3/10. Expression = 2/3 - 2/9 - (-3/10) = 4/9 + 3/10 = 67/90.',
        points: 2
      },
      {
        id: 'rn-4',
        questionText: 'If a = -2/3, b = 4/5, and c = -1/2, evaluate a(b - c) - b(c - a).',
        questionType: 'mcq',
        options: ['-1', '1/15', '-11/15', '2/15'],
        correctAnswer: '-1',
        explanation: 'a(b-c) = (-2/3)(4/5 + 1/2) = (-2/3)(13/10) = -13/15. b(c-a) = (4/5)(-1/2 + 2/3) = (4/5)(1/6) = 2/15. Difference = -13/15 - 2/15 = -15/15 = -1.',
        points: 2
      },
      {
        id: 'rn-5',
        questionText: 'How many distinct rational numbers exist strictly between -1/3 and 1/3?',
        questionType: 'mcq',
        options: ['Infinitely many', '0', '1', '9'],
        correctAnswer: 'Infinitely many',
        explanation: 'By the density property of rational numbers, between any two distinct rational numbers, there are infinitely many rational numbers.',
        points: 2
      },
      {
        id: 'rn-6',
        questionText: 'Express 0.363636... as a rational number p/q in simplest form. What is p + q?',
        questionType: 'mcq',
        options: ['15', '135', '45', '11'],
        correctAnswer: '15',
        explanation: 'Let x = 0.3636... 100x = 36.3636... 99x = 36 => x = 36/99 = 4/11. Thus p = 4, q = 11, so p + q = 15.',
        points: 2
      },
      {
        id: 'rn-7',
        questionText: 'The sum of two rational numbers is -3/7. If one of them is -11/14, what is the other number?',
        questionType: 'mcq',
        options: ['5/14', '17/14', '-5/14', '-17/14'],
        correctAnswer: '5/14',
        explanation: 'x + (-11/14) = -3/7 = -6/14 => x = -6/14 + 11/14 = 5/14.',
        points: 2
      },
      {
        id: 'rn-8',
        questionText: 'Solve for x: (x/3) + (1/4) = (x/2) - (2/5).',
        questionType: 'mcq',
        options: ['39/10', '13/10', '10/39', '-39/10'],
        correctAnswer: '39/10',
        explanation: '1/4 + 2/5 = x/2 - x/3 => 13/20 = x/6 => x = 78/20 = 39/10.',
        points: 2
      },
      {
        id: 'rn-9',
        questionText: 'What is the additive inverse of the multiplicative inverse of -4/9?',
        questionType: 'mcq',
        options: ['9/4', '-9/4', '-4/9', '4/9'],
        correctAnswer: '9/4',
        explanation: 'Multiplicative inverse of -4/9 is -9/4. Additive inverse of -9/4 is +9/4.',
        points: 2
      },
      {
        id: 'rn-10',
        questionText: 'A container has 7/8 liters of oil. A student uses 1/3 of the oil for an experiment and then adds 1/4 liter back. How much oil is in the container now?',
        questionType: 'mcq',
        options: ['5/6 L', '7/12 L', '5/8 L', '19/24 L'],
        correctAnswer: '5/6 L',
        explanation: 'Oil remaining after experiment = (7/8) × (2/3) = 7/12 liters. Adding 1/4 liter: 7/12 + 1/4 = 7/12 + 3/12 = 10/12 = 5/6 liters.',
        points: 2
      }
    ]
  },

  // ==========================================
  // QUIZ 2: ADVANCED EXPONENTS AND POWERS (10 Qs, 10 Mins, TOUGH)
  // ==========================================
  {
    id: 'quiz-exponents-powers-adv',
    title: 'Advanced Exponents & Powers Challenge',
    description: 'Tough 10-question speed quiz on negative indices, algebraic exponents, scientific notation, and exponential equations.',
    subject: 'Mathematics',
    timeLimitMinutes: 10,
    passingScore: 70,
    shuffleQuestions: true,
    showExplanations: true,
    status: 'published',
    questionsCount: 10,
    difficulty: 'Tough / Advanced',
    questions: [
      {
        id: 'exp-1',
        questionText: 'Simplify: [ (2^-1 × 3^-2) / (2^-3 × 3^-1) ]^-2',
        questionType: 'mcq',
        options: ['9/16', '16/9', '9/4', '4/9'],
        correctAnswer: '9/16',
        explanation: 'Inside brackets: (2^-1 / 2^-3) = 4; (3^-2 / 3^-1) = 1/3. Product inside = 4/3. Raised to -2: (4/3)^-2 = (3/4)^2 = 9/16.',
        points: 2
      },
      {
        id: 'exp-2',
        questionText: 'Solve for x: 5^(2x + 1) ÷ 25 = 125.',
        questionType: 'mcq',
        options: ['2', '3', '1', '4'],
        correctAnswer: '2',
        explanation: '5^(2x+1) ÷ 5^2 = 5^3 => 5^(2x-1) = 5^3 => 2x - 1 = 3 => 2x = 4 => x = 2.',
        points: 2
      },
      {
        id: 'exp-3',
        questionText: 'Express the speed of light (300,000,000 m/s) in standard scientific notation.',
        questionType: 'mcq',
        options: ['3.0 × 10^8', '30.0 × 10^7', '0.3 × 10^9', '3.0 × 10^7'],
        correctAnswer: '3.0 × 10^8',
        explanation: 'Standard scientific form requires a coefficient between 1 and 10. 300,000,000 = 3.0 × 10^8.',
        points: 2
      },
      {
        id: 'exp-4',
        questionText: 'What is the value of (-1)^101 + (-1)^102 + (-1)^103 + (-1)^104?',
        questionType: 'mcq',
        options: ['0', '-2', '2', '-4'],
        correctAnswer: '0',
        explanation: '(-1) to an odd power is -1, and to an even power is +1. (-1) + 1 + (-1) + 1 = 0.',
        points: 2
      },
      {
        id: 'exp-5',
        questionText: 'Simplify: (3^(n+4) - 6 × 3^(n+1)) / 3^(n+2)',
        questionType: 'mcq',
        options: ['7', '9', '21', '3'],
        correctAnswer: '7',
        explanation: 'Divide each term by 3^(n+2): 3^2 - 6 × 3^-1 = 9 - (6/3) = 9 - 2 = 7.',
        points: 2
      },
      {
        id: 'exp-6',
        questionText: 'Which of the following exponential values is the LARGEST? 2^50, 3^40, 4^30, 5^20',
        questionType: 'mcq',
        options: ['3^40', '2^50', '4^30', '5^20'],
        correctAnswer: '3^40',
        explanation: 'Rewrite with base exponent 10: 2^50 = (2^5)^10 = 32^10; 3^40 = (3^4)^10 = 81^10; 4^30 = (4^3)^10 = 64^10; 5^20 = (5^2)^10 = 25^10. Since 81 is the largest base, 3^40 is the greatest.',
        points: 2
      },
      {
        id: 'exp-7',
        questionText: 'If 2^a = 3, 3^b = 5, and 5^c = 8, what is the value of a × b × c?',
        questionType: 'mcq',
        options: ['3', '2', '1', '4'],
        correctAnswer: '3',
        explanation: 'Substituting: 5^c = (3^b)^c = 3^(bc) = (2^a)^(bc) = 2^(abc). Given 5^c = 8 = 2^3, we have 2^(abc) = 2^3 => abc = 3.',
        points: 2
      },
      {
        id: 'exp-8',
        questionText: 'If (2/3)^-3 × (2/3)^5 = (2/3)^(2x - 1), find the value of x.',
        questionType: 'mcq',
        options: ['3/2', '3', '1/2', '2'],
        correctAnswer: '3/2',
        explanation: '(2/3)^(-3+5) = (2/3)^2. So (2/3)^2 = (2/3)^(2x-1) => 2 = 2x - 1 => 2x = 3 => x = 3/2.',
        points: 2
      },
      {
        id: 'exp-9',
        questionText: 'Evaluate: (6^-1 - 8^-1)^-1 + (2^-1 - 3^-1)^-1.',
        questionType: 'mcq',
        options: ['30', '24', '18', '36'],
        correctAnswer: '30',
        explanation: '(1/6 - 1/8)^-1 = (1/24)^-1 = 24. (1/2 - 1/3)^-1 = (1/6)^-1 = 6. 24 + 6 = 30.',
        points: 2
      },
      {
        id: 'exp-10',
        questionText: 'A cell diameter is 0.0000000000075 meters. In standard scientific notation, this is:',
        questionType: 'mcq',
        options: ['7.5 × 10^-12', '7.5 × 10^-11', '75 × 10^-13', '0.75 × 10^-11'],
        correctAnswer: '7.5 × 10^-12',
        explanation: 'Move the decimal point 12 places to the right to get 7.5 × 10^-12 meters.',
        points: 2
      }
    ]
  },

  // ==========================================
  // QUIZ 3: HUMAN MIGRATION & DEMOGRAPHICS (10 Qs, 10 Mins, TOUGH)
  // ==========================================
  {
    id: 'quiz-migration-demographics-adv',
    title: 'Human Migration & Global Demographics',
    description: 'Challenging 10-question geography test on push/pull dynamics, migration types, demographic transition, and economic impacts.',
    subject: 'Social Studies',
    timeLimitMinutes: 10,
    passingScore: 70,
    shuffleQuestions: true,
    showExplanations: true,
    status: 'published',
    questionsCount: 10,
    difficulty: 'Tough / Advanced',
    questions: [
      {
        id: 'mig-1',
        questionText: 'Which of the following is classified strictly as a "Push Factor" in human migration?',
        questionType: 'mcq',
        options: ['Famine and severe drought', 'Higher wages and job prospects', 'Better healthcare systems', 'Political stability and safety'],
        correctAnswer: 'Famine and severe drought',
        explanation: 'Push factors are unfavorable conditions that force or compel people to leave their home region (such as drought, war, or famine).',
        points: 2
      },
      {
        id: 'mig-2',
        questionText: 'What term describes the emigration of highly educated and skilled professionals from developing nations to wealthier developed nations?',
        questionType: 'mcq',
        options: ['Brain Drain', 'Counter-urbanization', 'Step Migration', 'Transhumance'],
        correctAnswer: 'Brain Drain',
        explanation: 'Brain Drain is the loss of intellectual and technical talent from a country due to emigration of educated specialists.',
        points: 2
      },
      {
        id: 'mig-3',
        questionText: 'Seasonal movement of pastoral farmers and their livestock between high summer pastures and low winter valleys is known as:',
        questionType: 'mcq',
        options: ['Transhumance', 'Chain migration', 'Urban sprawl', 'Emigration'],
        correctAnswer: 'Transhumance',
        explanation: 'Transhumance is the practice of moving livestock between mountain pastures in summer and lowland valleys in winter.',
        points: 2
      },
      {
        id: 'mig-4',
        questionText: 'Individuals who are forced to flee their home country due to war, violent conflict, or persecution across international borders are legally defined as:',
        questionType: 'mcq',
        options: ['Refugees', 'Economic Migrants', 'Expatriates', 'Nomads'],
        correctAnswer: 'Refugees',
        explanation: 'Under international law, refugees are persons compelled to flee their country owing to a well-founded fear of persecution or war.',
        points: 2
      },
      {
        id: 'mig-5',
        questionText: 'Which demographic measure calculates the difference between immigrants and emigrants per 1,000 residents in a given year?',
        questionType: 'mcq',
        options: ['Net Migration Rate', 'Crude Birth Rate', 'Dependency Ratio', 'Population Growth Rate'],
        correctAnswer: 'Net Migration Rate',
        explanation: 'Net Migration Rate = [(Immigrants - Emigrants) / Total Population] × 1000.',
        points: 2
      },
      {
        id: 'mig-6',
        questionText: 'Which factor historically accelerated "Rural-to-Urban Migration" during industrialization?',
        questionType: 'mcq',
        options: ['Mechanization of agriculture reducing farm labor needs', 'High cost of urban housing', 'Abundance of cheap rural land', 'Strict urban entry quotas'],
        correctAnswer: 'Mechanization of agriculture reducing farm labor needs',
        explanation: 'As tractors and machines reduced the need for manual farm labor, agricultural workers moved to industrial cities for factory employment.',
        points: 2
      },
      {
        id: 'mig-7',
        questionText: 'What are "Financial Remittances" in the context of international migration?',
        questionType: 'mcq',
        options: ['Money sent by migrant workers back to family members in their country of origin', 'Taxes paid by multinational companies', 'Foreign aid given by international organizations', 'Visa application fees'],
        correctAnswer: 'Money sent by migrant workers back to family members in their country of origin',
        explanation: 'Remittances are financial transfers sent by emigrants to their families back home, forming a crucial income source in developing economies.',
        points: 2
      },
      {
        id: 'mig-8',
        questionText: 'What does the term "Counter-urbanization" refer to?',
        questionType: 'mcq',
        options: ['Movement of population away from major cities to rural areas or smaller towns', 'Rapid growth of suburban slums', 'Migration between capital cities', 'Government-enforced relocation'],
        correctAnswer: 'Movement of population away from major cities to rural areas or smaller towns',
        explanation: 'Counter-urbanization occurs when people leave congested metropolitan areas to live in rural regions or small towns.',
        points: 2
      },
      {
        id: 'mig-9',
        questionText: 'According to E.G. Ravenstein’s Laws of Migration, which statement about migration distance is generally accurate?',
        questionType: 'mcq',
        options: ['The majority of migrants travel short distances', 'Long-distance migrants prefer rural villages over commercial hubs', 'Female migrants travel internationally more than males', 'City dwellers migrate more frequently than rural inhabitants'],
        correctAnswer: 'The majority of migrants travel short distances',
        explanation: 'Ravenstein established that most migration occurs over short distances because of economic costs and distance decay.',
        points: 2
      },
      {
        id: 'mig-10',
        questionText: 'Which global environmental crisis is an increasingly major driver of "Environmental / Climate Migration"?',
        questionType: 'mcq',
        options: ['Rising sea levels inundating low-lying coastal and island zones', 'Volcanic eruptions in remote regions', 'Expansion of national parks', 'Ozone layer recovery'],
        correctAnswer: 'Rising sea levels inundating low-lying coastal and island zones',
        explanation: 'Sea level rise and coastal erosion threaten low-lying coastal cities and island nations, driving large-scale environmental displacement.',
        points: 2
      }
    ]
  }
];
