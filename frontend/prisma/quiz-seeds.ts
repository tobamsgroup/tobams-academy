export type QuizSeed = {
  timeLimit: number
  passingScore: number
  attemptsAllowed: number
  questions: { text: string; options: { text: string; isCorrect: boolean }[] }[]
}

export const quizSeeds: Record<string, QuizSeed> = {
  'pm-basics-quiz': {
    timeLimit: 10,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'What is the primary responsibility of a Product Manager?',
        options: [
          { text: 'Writing code', isCorrect: false },
          { text: 'Defining product vision and strategy', isCorrect: true },
          { text: 'Managing the engineering team', isCorrect: false },
          { text: 'Handling customer support', isCorrect: false },
        ],
      },
      {
        text: 'Which framework is commonly used for prioritisation in product management?',
        options: [
          { text: 'RICE', isCorrect: true },
          { text: 'SWOT', isCorrect: false },
          { text: 'PESTLE', isCorrect: false },
          { text: 'Agile', isCorrect: false },
        ],
      },
      {
        text: 'What does MVP stand for?',
        options: [
          { text: 'Most Valuable Product', isCorrect: false },
          { text: 'Minimum Viable Product', isCorrect: true },
          { text: 'Maximum Value Proposition', isCorrect: false },
          { text: 'Minimum Value Plan', isCorrect: false },
        ],
      },
    ],
  },
  'python-basics-quiz': {
    timeLimit: 12,
    passingScore: 70,
    attemptsAllowed: 3,
    questions: [
      {
        text: 'Which of the following is used to define a function in Python?',
        options: [
          { text: 'function', isCorrect: false },
          { text: 'def', isCorrect: true },
          { text: 'fn', isCorrect: false },
          { text: 'define', isCorrect: false },
        ],
      },
      {
        text: "What is the output of `print(type(3.14))`?",
        options: [
          { text: "<class 'int'>", isCorrect: false },
          { text: "<class 'float'>", isCorrect: true },
          { text: "<class 'double'>", isCorrect: false },
          { text: "<class 'number'>", isCorrect: false },
        ],
      },
      {
        text: 'Which data structure uses key-value pairs in Python?',
        options: [
          { text: 'List', isCorrect: false },
          { text: 'Tuple', isCorrect: false },
          { text: 'Dictionary', isCorrect: true },
          { text: 'Set', isCorrect: false },
        ],
      },
    ],
  },
  'data-final-quiz': {
    timeLimit: 15,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which pandas method returns the first 5 rows of a DataFrame?',
        options: [
          { text: 'head()', isCorrect: true },
          { text: 'first()', isCorrect: false },
          { text: 'top()', isCorrect: false },
          { text: 'preview()', isCorrect: false },
        ],
      },
      {
        text: 'What library is commonly used for statistical plots in Python?',
        options: [
          { text: 'NumPy', isCorrect: false },
          { text: 'Seaborn', isCorrect: true },
          { text: 'Requests', isCorrect: false },
          { text: 'Flask', isCorrect: false },
        ],
      },
      {
        text: 'Which step comes first in a typical data analysis workflow?',
        options: [
          { text: 'Visualisation', isCorrect: false },
          { text: 'Data collection and cleaning', isCorrect: true },
          { text: 'Publishing results', isCorrect: false },
          { text: 'Model deployment', isCorrect: false },
        ],
      },
    ],
  },
  'leadership-styles-quiz': {
    timeLimit: 10,
    passingScore: 65,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which leadership style involves the leader making decisions without team input?',
        options: [
          { text: 'Democratic', isCorrect: false },
          { text: 'Autocratic', isCorrect: true },
          { text: 'Laissez-faire', isCorrect: false },
          { text: 'Transformational', isCorrect: false },
        ],
      },
      {
        text: "Situational leadership suggests that leaders should adapt their style based on what?",
        options: [
          { text: 'Their personal preference', isCorrect: false },
          { text: 'Company policy', isCorrect: false },
          { text: "The team member's competence and commitment", isCorrect: true },
          { text: 'The urgency of the task', isCorrect: false },
        ],
      },
      {
        text: 'Transformational leadership primarily focuses on:',
        options: [
          { text: 'Transactional rewards', isCorrect: false },
          { text: 'Inspiring and motivating followers toward a shared vision', isCorrect: true },
          { text: 'Strictly following established processes', isCorrect: false },
          { text: 'Delegating all decisions to the team', isCorrect: false },
        ],
      },
    ],
  },
  'html-css-quiz': {
    timeLimit: 10,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which HTML element is used to define the largest heading?',
        options: [
          { text: '<h6>', isCorrect: false },
          { text: '<heading>', isCorrect: false },
          { text: '<h1>', isCorrect: true },
          { text: '<head>', isCorrect: false },
        ],
      },
      {
        text: 'In CSS, which property is used to change the text colour?',
        options: [
          { text: 'font-color', isCorrect: false },
          { text: 'text-color', isCorrect: false },
          { text: 'color', isCorrect: true },
          { text: 'foreground', isCorrect: false },
        ],
      },
      {
        text: 'What does CSS stand for?',
        options: [
          { text: 'Cascading Style Sheets', isCorrect: true },
          { text: 'Creative Style System', isCorrect: false },
          { text: 'Computer Style Sheets', isCorrect: false },
          { text: 'Colorful Style Syntax', isCorrect: false },
        ],
      },
    ],
  },
  'fullstack-final-quiz': {
    timeLimit: 15,
    passingScore: 70,
    attemptsAllowed: 2,
    questions: [
      {
        text: 'Which HTTP method is typically used to create a new resource in a REST API?',
        options: [
          { text: 'GET', isCorrect: false },
          { text: 'POST', isCorrect: true },
          { text: 'DELETE', isCorrect: false },
          { text: 'OPTIONS', isCorrect: false },
        ],
      },
      {
        text: 'In React, which hook is used for side effects?',
        options: [
          { text: 'useState', isCorrect: false },
          { text: 'useEffect', isCorrect: true },
          { text: 'useMemo', isCorrect: false },
          { text: 'useRef', isCorrect: false },
        ],
      },
      {
        text: 'What does API stand for?',
        options: [
          { text: 'Application Programming Interface', isCorrect: true },
          { text: 'Advanced Program Integration', isCorrect: false },
          { text: 'Automated Process Interface', isCorrect: false },
          { text: 'Application Process Integration', isCorrect: false },
        ],
      },
    ],
  },
}
