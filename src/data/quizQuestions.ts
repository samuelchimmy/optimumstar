
export interface QuizQuestion {
  id: number;
  level: number;
  question: string;
  options: string[];
  correct_answer: number;
}

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
      "Random tweet selector",
      "Proof contests",
      "Rock-paper-blockchain",
      "Vitalik's coin toss"
    ],
    correct_answer: 1
  },
  {
    id: 3,
    level: 1,
    question: "How does Succinct discourage malicious provers?",
    options: [
      "Crypto jail",
      "Collateral staking",
      "Public shaming on Discord",
      "Forced meme creation"
    ],
    correct_answer: 1
  },
  {
    id: 4,
    level: 1,
    question: "SP1 in Succinct stands for what?",
    options: [
      "Sushi Party 1",
      "Super Protocol 1",
      "Succinct Proof 1",
      "Succinct Party 1"
    ],
    correct_answer: 2
  },
  {
    id: 5,
    level: 1,
    question: "Succinct provides proofs for what type of programs?",
    options: [
      "JavaScript web apps",
      "Crypto meme generators",
      "Deterministic Rust programs",
      "Python scripts"
    ],
    correct_answer: 2
  },
  {
    id: 6,
    level: 1,
    question: "Proof uniqueness in Succinct is guaranteed by?",
    options: [
      "NFT authenticity certificates",
      "User pinky promises",
      "Unique nonce & prover addresses",
      "Special blockchain sauce"
    ],
    correct_answer: 2
  },
  {
    id: 7,
    level: 1,
    question: "If provers miss a deadline, they lose what?",
    options: [
      "Twitter verification badge",
      "Crypto dignity",
      "NFT collection",
      "Collateral stake"
    ],
    correct_answer: 3
  },
  {
    id: 8,
    level: 1,
    question: "Succinct's contest mechanism combats which common blockchain issue?",
    options: [
      "Gas fee fatigue",
      "Crypto procrastination",
      "Nothing-at-stake problem",
      "Too much coffee"
    ],
    correct_answer: 2
  },
  {
    id: 9,
    level: 1,
    question: "Which of these is NOT a proof type in Succinct?",
    options: [
      "CORE",
      "GROTH16",
      "COMPRESSED",
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
      "A smart blockchain cat",
      "An application-specific blockchain",
      "Binance's CEO"
    ],
    correct_answer: 2
  },
  
  // Level 2: Proof Contests & Bidding
  {
    id: 11,
    level: 2,
    question: "Why do provers bid on proofs?",
    options: [
      "Auction addiction",
      "To please Elon Musk",
      "For blockchain fame",
      "To fairly allocate proof generation"
    ],
    correct_answer: 3
  },
  {
    id: 12,
    level: 2,
    question: "What happens when you bid highest?",
    options: [
      "Free Ethereum socks",
      "Vitalik congratulates you",
      "Assigned to generate proof with higher chance",
      "Immediate NFT drop"
    ],
    correct_answer: 2
  },
  {
    id: 13,
    level: 2,
    question: "Collateral in Succinct helps prevent what?",
    options: [
      "Blockchain boredom",
      "Griefing attacks",
      "Sleepy nodes",
      "Meme spam"
    ],
    correct_answer: 1
  },
  {
    id: 14,
    level: 2,
    question: "What parameter influences proof assignment probability in Succinct?",
    options: [
      "Gas fees spent",
      "Alpha (α) parameter",
      "Coffee consumed",
      "Meme quality"
    ],
    correct_answer: 1
  },
  {
    id: 15,
    level: 2,
    question: "The \"Execute()\" function primarily does what?",
    options: [
      "Executes bad provers",
      "Orders pizza",
      "Handles payments & collateral logic",
      "Sends Vitalik memes"
    ],
    correct_answer: 2
  },
  {
    id: 16,
    level: 2,
    question: "Provers reserve future proof slots by?",
    options: [
      "Sending love letters to the blockchain",
      "Minting NFTs",
      "Pre-bidding slots",
      "Tweeting hashtags"
    ],
    correct_answer: 2
  },
  {
    id: 17,
    level: 2,
    question: "Proof copying prevention relies on what?",
    options: [
      "Proof NFTs",
      "Unique nonce",
      "Meme watermarking",
      "Crypto copyright police"
    ],
    correct_answer: 1
  },
  {
    id: 18,
    level: 2,
    question: "SPAM proofs in Succinct earn?",
    options: [
      "Crypto jail time",
      "Free gas tokens",
      "No economic reward",
      "Discord emoji privileges"
    ],
    correct_answer: 2
  },
  {
    id: 19,
    level: 2,
    question: "Which mechanism reduces network contention in Succinct?",
    options: [
      "Mining rig smash tournament",
      "NFT battles",
      "Meme competitions",
      "Proof contests assignment"
    ],
    correct_answer: 3
  },
  {
    id: 20,
    level: 2,
    question: "The advantage of auctions in Succinct is?",
    options: [
      "It looks fancy",
      "Creates blockchain drama",
      "Decentralizes proof selection",
      "Entertains provers"
    ],
    correct_answer: 2
  },
  
  // Level 3: Advanced Proof Mechanisms
  {
    id: 21,
    level: 3,
    question: "Sybil resistance in Succinct means?",
    options: [
      "Multiple personalities discouraged",
      "Crypto jail if you cheat",
      "Splitting identity reduces profits",
      "Vitalik's stare-down"
    ],
    correct_answer: 2
  },
  {
    id: 22,
    level: 3,
    question: "What's a proving pool in Succinct?",
    options: [
      "Ethereum hot tub parties",
      "Where provers swim after work",
      "Coordinated proof generation group",
      "Crypto liquidity reservoirs"
    ],
    correct_answer: 2
  },
  {
    id: 23,
    level: 3,
    question: "Succinct's bidding window prevents what?",
    options: [
      "Shopping addiction",
      "NFT FOMO",
      "Last-minute auction sniping",
      "Blockchain tantrums"
    ],
    correct_answer: 2
  },
  {
    id: 24,
    level: 3,
    question: "What happens if no valid proofs are submitted before the deadline?",
    options: [
      "Emergency meme deployment",
      "Contest is re-run with a higher reward",
      "Blockchain has a meltdown",
      "Vitalik personally intervenes"
    ],
    correct_answer: 1
  },
  {
    id: 25,
    level: 3,
    question: "Prover's bids are proportional to?",
    options: [
      "Their NFT collection value",
      "Their Twitter followers",
      "Their proving capability",
      "Their meme creation skills"
    ],
    correct_answer: 2
  },
  {
    id: 26,
    level: 3,
    question: "What's the main advantage of Succinct's crypto-economic design?",
    options: [
      "Free crypto for everyone",
      "More NFT opportunities",
      "Aligned incentives for all participants",
      "Fancy blockchain terminology"
    ],
    correct_answer: 2
  },
  {
    id: 27,
    level: 3,
    question: "Which parameter helps optimize the balance between throughput and latency?",
    options: [
      "Caffeine level",
      "Bid value and Alpha (α)",
      "Moon phase alignment",
      "Blockchain hype cycle"
    ],
    correct_answer: 1
  },
  {
    id: 28,
    level: 3,
    question: "How does Succinct increase probability of proper proof submission?",
    options: [
      "Motivational blockchain posters",
      "Economic penalties for missed deadlines",
      "Proof cheerleaders",
      "Blockchain therapy sessions"
    ],
    correct_answer: 1
  },
  {
    id: 29,
    level: 3,
    question: "What protects proof contests from central manipulation?",
    options: [
      "Anti-manipulation spells",
      "Decentralized assignment protocol",
      "Blockchain police",
      "Vitalik's watchful eye"
    ],
    correct_answer: 1
  },
  {
    id: 30,
    level: 3,
    question: "Succinct's assignment mechanism primarily optimizes for?",
    options: [
      "Prover entertainment",
      "Maximum meme production",
      "Higher throughput and lower latency",
      "Blockchain drama minimization"
    ],
    correct_answer: 2
  },
  
  // Level 4: Succinct Network Architecture
  {
    id: 31,
    level: 4,
    question: "Succinct improves latency by?",
    options: [
      "Faster typing provers",
      "Hiring blockchain sprinters",
      "Crypto coffee breaks",
      "Short bidding windows & quick assignments"
    ],
    correct_answer: 3
  },
  {
    id: 32,
    level: 4,
    question: "What's NOT a component of the Succinct network?",
    options: [
      "Provers",
      "Application-specific blockchain",
      "Users",
      "Blockchain therapists"
    ],
    correct_answer: 3
  },
  {
    id: 33,
    level: 4,
    question: "The blockchain in Succinct mainly coordinates what?",
    options: [
      "Crypto parties",
      "NFT drops",
      "Proof generation & verification",
      "Developer meetups"
    ],
    correct_answer: 2
  },
  {
    id: 34,
    level: 4,
    question: "How does Succinct handle failure in proof generation?",
    options: [
      "Blockchain timeout",
      "Re-runs contests with increased incentives",
      "Sends apology NFTs",
      "Emergency meme protocol"
    ],
    correct_answer: 1
  },
  {
    id: 35,
    level: 4,
    question: "What's the main hardware requirement for Succinct provers?",
    options: [
      "Liquid cooling for style points",
      "RGB gaming lights",
      "High-performance GPUs",
      "Blockchain-compatible coffee machines"
    ],
    correct_answer: 2
  },
  {
    id: 36,
    level: 4,
    question: "Succinct's proof verification is optimized for?",
    options: [
      "NFT compatibility",
      "Cost and speed efficiency",
      "Maximum blockchain drama",
      "Meme generation"
    ],
    correct_answer: 1
  },
  {
    id: 37,
    level: 4,
    question: "Which chain hosts the Succinct coordination layer?",
    options: [
      "A dedicated application-specific blockchain",
      "The chain with the best memes",
      "Whatever chain Vitalik tweets about",
      "The fun chain"
    ],
    correct_answer: 0
  },
  {
    id: 38,
    level: 4,
    question: "When would you use compressed vs. native proofs?",
    options: [
      "When the moon is full",
      "When your NFTs need compression",
      "Based on verification cost-benefit analysis",
      "When you run out of blockchain space"
    ],
    correct_answer: 2
  },
  {
    id: 39,
    level: 4,
    question: "What makes proof verification in Succinct efficient?",
    options: [
      "Quantum blockchain technology",
      "Blockchain magic",
      "Prover energy drinks",
      "Specialized ZK circuits & optimizations"
    ],
    correct_answer: 3
  },
  {
    id: 40,
    level: 4,
    question: "Which proof type offers the best cost-efficiency for most use cases?",
    options: [
      "Compressed proofs",
      "The one with the coolest name",
      "The expensive one",
      "Whatever Vitalik uses"
    ],
    correct_answer: 0
  },
  
  // Level 5: Practical Applications of Succinct
  {
    id: 41,
    level: 5,
    question: "ZK Rollups use Succinct because?",
    options: [
      "Ethereum told them to",
      "Cheap & reliable proofs",
      "Rollups like trendy names",
      "They like memes"
    ],
    correct_answer: 1
  },
  {
    id: 42,
    level: 5,
    question: "What's the benefit of Succinct for dApp developers?",
    options: [
      "Better blockchain memes",
      "Free NFT drops",
      "Easier integration of ZK proofs",
      "More crypto parties"
    ],
    correct_answer: 2
  },
  {
    id: 43,
    level: 5,
    question: "Which is NOT a benefit of Succinct's modular approach?",
    options: [
      "Optimized cost structures",
      "Free blockchain counseling",
      "Specialized proving hardware",
      "Improved scalability"
    ],
    correct_answer: 1
  },
  {
    id: 44,
    level: 5,
    question: "How does Succinct help with blockchain scaling?",
    options: [
      "Efficient verification of off-chain computations",
      "NFT compression technology",
      "Blockchain diet plans",
      "Crypto yoga sessions"
    ],
    correct_answer: 0
  },
  {
    id: 45,
    level: 5,
    question: "The 'economic alignment' in Succinct refers to?",
    options: [
      "NFT price stabilization",
      "Blockchain astrology",
      "Incentives that encourage honest proving",
      "Everyone getting rich"
    ],
    correct_answer: 2
  },
  {
    id: 46,
    level: 5,
    question: "Which network role benefits most from Succinct's tokenomics?",
    options: [
      "Blockchain influencers",
      "NFT collectors",
      "Meme creators",
      "Efficient provers with good hardware"
    ],
    correct_answer: 3
  },
  {
    id: 47,
    level: 5,
    question: "How does Succinct help blockchains maintain decentralization?",
    options: [
      "Blockchain therapy",
      "Proof diversity quotas",
      "Distributing proving work through contests",
      "Mandatory decentralization workshops"
    ],
    correct_answer: 2
  },
  {
    id: 48,
    level: 5,
    question: "What problem does Succinct's batching mechanism solve?",
    options: [
      "Proof loneliness",
      "Cost-efficiency for small transactions",
      "Too many individual proofs",
      "Blockchain boredom"
    ],
    correct_answer: 1
  },
  {
    id: 49,
    level: 5,
    question: "Which types of applications benefit most from Succinct?",
    options: [
      "Dating apps",
      "NFT art galleries",
      "Computation-heavy blockchain applications",
      "Blockchain meme generators"
    ],
    correct_answer: 2
  },
  {
    id: 50,
    level: 5,
    question: "What's the ultimate goal of the Succinct network?",
    options: [
      "Maximum blockchain drama",
      "World domination through memes",
      "The perfect NFT marketplace",
      "Accessible & efficient ZK proof generation"
    ],
    correct_answer: 3
  }
];

