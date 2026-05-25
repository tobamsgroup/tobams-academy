export const GROWING_MY_MONEY_QUIZ_META = [
  { label: "Total Questions", value: "10" },
  { label: "Time Limit", value: "15 minutes" },
  { label: "Question Type", value: "Multiple Choice" },
  { label: "Passing Score", value: "70%" },
  { label: "Attempts Allowed", value: "2" },
] as const;

export type QuizQuestion = {
  id: string;
  text: string;
  options: readonly string[];
};

export const GROWING_MY_MONEY_QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "q1",
    text: "What is diversification in investing?",
    options: [
      "Putting all your money in one stock",
      "Investing only in real estate",
      "Keeping all money in a savings account",
      "Spreading investments across different asset types",
    ],
  },
  {
    id: "q2",
    text: "What is diversification in investing?",
    options: [
      "Putting all your money in one stock",
      "Investing only in real estate",
      "Keeping all money in a savings account",
      "Spreading investments across different asset types",
    ],
  },
  {
    id: "q3",
    text: "Which habit best supports long-term savings?",
    options: [
      "Spending bonuses immediately",
      "Paying yourself first each month",
      "Using credit for everyday purchases",
      "Avoiding all forms of investment",
    ],
  },
  {
    id: "q4",
    text: "What does compound interest mean?",
    options: [
      "Interest charged only once",
      "Earning interest on interest over time",
      "A fixed fee on every transaction",
      "Interest that never changes",
    ],
  },
];

export const GROWING_MY_MONEY_QUESTIONS_PER_PAGE = 2;
