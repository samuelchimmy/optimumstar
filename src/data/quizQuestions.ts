
export interface QuizQuestion {
  id: number;
  level: number;
  question: string;
  options: string[];
  correct_answer: number;
}

// This is a simplified version of the quiz data
// In a real application, this would be stored in Supabase
export const quizQuestions: QuizQuestion[] = [
  // Level 1: Succinct Network Basics
  {
    id: 1,
    level: 1,
    question: "What problem does Succinct primarily solve?",
    options: [
      "Crypto insomnia",
      "Decentralized proof generation",
      "NFT boredom",
      "Blockchain diets"
    ],
    correct_answer: 1
  },
  {
    id: 2,
    level: 1,
    question: "Succinct uses what unique mechanism to assign proof requests?",
    options: [
      "Rock-paper-blockchain",
      "Proof contests",
      "Random tweet selector",
      "Vitalik's coin toss"
    ],
    correct_answer: 1
  },
  {
    id: 3,
    level: 1,
    question: "How does Succinct discourage malicious provers?",
    options: [
      "Public shaming on Discord",
      "Collateral staking",
      "Forced meme creation",
      "Crypto jail"
    ],
    correct_answer: 1
  },
  {
    id: 4,
    level: 1,
    question: "SP1 in Succinct stands for what?",
    options: [
      "Succinct Party 1",
      "Succinct Proof 1",
      "Super Protocol 1",
      "Sushi Party 1"
    ],
    correct_answer: 1
  },
  {
    id: 5,
    level: 1,
    question: "Succinct provides proofs for what type of programs?",
    options: [
      "JavaScript web apps",
      "Python scripts",
      "Deterministic Rust programs",
      "Crypto meme generators"
    ],
    correct_answer: 2
  },
  {
    id: 6,
    level: 1,
    question: "Proof uniqueness in Succinct is guaranteed by?",
    options: [
      "Special blockchain sauce",
      "Unique nonce & prover addresses",
      "NFT authenticity certificates",
      "User pinky promises"
    ],
    correct_answer: 1
  },
  {
    id: 7,
    level: 1,
    question: "If provers miss a deadline, they lose what?",
    options: [
      "Crypto dignity",
      "Collateral stake",
      "NFT collection",
      "Twitter verification badge"
    ],
    correct_answer: 1
  },
  {
    id: 8,
    level: 1,
    question: "Succinct's contest mechanism combats which common blockchain issue?",
    options: [
      "Too much coffee",
      "Nothing-at-stake problem",
      "Gas fee fatigue",
      "Crypto procrastination"
    ],
    correct_answer: 1
  },
  {
    id: 9,
    level: 1,
    question: "Which of these is NOT a proof type in Succinct?",
    options: [
      "GROTH16",
      "COMPRESSED",
      "CORE",
      "DOGE-PROOF"
    ],
    correct_answer: 3
  },
  {
    id: 10,
    level: 1,
    question: "What entity coordinates users and provers in Succinct?",
    options: [
      "Ethereum Foundation",
      "An application-specific blockchain",
      "Binance's CEO",
      "A smart blockchain cat"
    ],
    correct_answer: 1
  },
  
  // Level 2: Proof Contests & Bidding
  {
    id: 11,
    level: 2,
    question: "Why do provers bid on proofs?",
    options: [
      "Auction addiction",
      "To fairly allocate proof generation",
      "For blockchain fame",
      "To please Elon Musk"
    ],
    correct_answer: 1
  },
  // Add more questions for levels 2-5...
  // This is a sample - in a real implementation, you'd add all 50 questions
];
