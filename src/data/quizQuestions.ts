
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
  {
    id: 12,
    level: 2,
    question: "What happens when you bid highest?",
    options: [
      "Immediate NFT drop",
      "Assigned to generate proof with higher chance",
      "Vitalik congratulates you",
      "Free Ethereum socks"
    ],
    correct_answer: 1
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
      "Coffee consumed",
      "Alpha (α) parameter",
      "Meme quality",
      "Gas fees spent"
    ],
    correct_answer: 1
  },
  {
    id: 15,
    level: 2,
    question: "The \"Execute()\" function primarily does what?",
    options: [
      "Executes bad provers",
      "Handles payments & collateral logic",
      "Orders pizza",
      "Sends Vitalik memes"
    ],
    correct_answer: 1
  },
  {
    id: 16,
    level: 2,
    question: "Provers reserve future proof slots by?",
    options: [
      "Sending love letters to the blockchain",
      "Pre-bidding slots",
      "Tweeting hashtags",
      "Minting NFTs"
    ],
    correct_answer: 1
  },
  {
    id: 17,
    level: 2,
    question: "Proof copying prevention relies on what?",
    options: [
      "Crypto copyright police",
      "Unique nonce",
      "Meme watermarking",
      "Proof NFTs"
    ],
    correct_answer: 1
  },
  {
    id: 18,
    level: 2,
    question: "SPAM proofs in Succinct earn?",
    options: [
      "Crypto jail time",
      "No economic reward",
      "Free gas tokens",
      "Discord emoji privileges"
    ],
    correct_answer: 1
  },
  {
    id: 19,
    level: 2,
    question: "Which mechanism reduces network contention in Succinct?",
    options: [
      "Mining rig smash tournament",
      "Proof contests assignment",
      "NFT battles",
      "Meme competitions"
    ],
    correct_answer: 1
  },
  {
    id: 20,
    level: 2,
    question: "The advantage of auctions in Succinct is?",
    options: [
      "It looks fancy",
      "Decentralizes proof selection",
      "Entertains provers",
      "Creates blockchain drama"
    ],
    correct_answer: 1
  },
  
  // Level 3: Advanced Proof Mechanisms
  {
    id: 21,
    level: 3,
    question: "Sybil resistance in Succinct means?",
    options: [
      "Multiple personalities discouraged",
      "Splitting identity reduces profits",
      "Crypto jail if you cheat",
      "Vitalik's stare-down"
    ],
    correct_answer: 1
  },
  {
    id: 22,
    level: 3,
    question: "What's a proving pool in Succinct?",
    options: [
      "Where provers swim after work",
      "Coordinated proof generation group",
      "Crypto liquidity reservoirs",
      "Ethereum hot tub parties"
    ],
    correct_answer: 1
  },
  {
    id: 23,
    level: 3,
    question: "Succinct's bidding window prevents what?",
    options: [
      "Shopping addiction",
      "Last-minute auction sniping",
      "Blockchain tantrums",
      "NFT FOMO"
    ],
    correct_answer: 1
  },
  {
    id: 24,
    level: 3,
    question: "What happens if no valid proofs are submitted before the deadline?",
    options: [
      "Blockchain has a meltdown",
      "Contest is re-run with a higher reward",
      "Vitalik personally intervenes",
      "Emergency meme deployment"
    ],
    correct_answer: 1
  },
  {
    id: 25,
    level: 3,
    question: "Prover's bids are proportional to?",
    options: [
      "Their Twitter followers",
      "Their proving capability",
      "Their NFT collection value",
      "Their meme creation skills"
    ],
    correct_answer: 1
  },
  {
    id: 26,
    level: 3,
    question: "What's the main advantage of Succinct's crypto-economic design?",
    options: [
      "Free crypto for everyone",
      "Aligned incentives for all participants",
      "Fancy blockchain terminology",
      "More NFT opportunities"
    ],
    correct_answer: 1
  },
  {
    id: 27,
    level: 3,
    question: "Which parameter helps optimize the balance between throughput and latency?",
    options: [
      "Caffeine level",
      "Bid value and Alpha (α)",
      "Blockchain hype cycle",
      "Moon phase alignment"
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
      "Blockchain police",
      "Decentralized assignment protocol",
      "Anti-manipulation spells",
      "Vitalik's watchful eye"
    ],
    correct_answer: 1
  },
  {
    id: 30,
    level: 3,
    question: "Succinct's assignment mechanism primarily optimizes for?",
    options: [
      "Maximum meme production",
      "Higher throughput and lower latency",
      "Prover entertainment",
      "Blockchain drama minimization"
    ],
    correct_answer: 1
  },
  
  // Level 4: Succinct Network Architecture
  {
    id: 31,
    level: 4,
    question: "Succinct improves latency by?",
    options: [
      "Faster typing provers",
      "Short bidding windows & quick assignments",
      "Crypto coffee breaks",
      "Hiring blockchain sprinters"
    ],
    correct_answer: 1
  },
  {
    id: 32,
    level: 4,
    question: "What's NOT a component of the Succinct network?",
    options: [
      "Provers",
      "Users",
      "Application-specific blockchain",
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
      "Proof generation & verification",
      "NFT drops",
      "Developer meetups"
    ],
    correct_answer: 1
  },
  {
    id: 34,
    level: 4,
    question: "How does Succinct handle failure in proof generation?",
    options: [
      "Sends apology NFTs",
      "Re-runs contests with increased incentives",
      "Blockchain timeout",
      "Emergency meme protocol"
    ],
    correct_answer: 1
  },
  {
    id: 35,
    level: 4,
    question: "What's the main hardware requirement for Succinct provers?",
    options: [
      "RGB gaming lights",
      "High-performance GPUs",
      "Liquid cooling for style points",
      "Blockchain-compatible coffee machines"
    ],
    correct_answer: 1
  },
  {
    id: 36,
    level: 4,
    question: "Succinct's proof verification is optimized for?",
    options: [
      "Maximum blockchain drama",
      "Cost and speed efficiency",
      "NFT compatibility",
      "Meme generation"
    ],
    correct_answer: 1
  },
  {
    id: 37,
    level: 4,
    question: "Which chain hosts the Succinct coordination layer?",
    options: [
      "The fun chain",
      "A dedicated application-specific blockchain",
      "Whatever chain Vitalik tweets about",
      "The chain with the best memes"
    ],
    correct_answer: 1
  },
  {
    id: 38,
    level: 4,
    question: "When would you use compressed vs. native proofs?",
    options: [
      "When you run out of blockchain space",
      "Based on verification cost-benefit analysis",
      "When the moon is full",
      "When your NFTs need compression"
    ],
    correct_answer: 1
  },
  {
    id: 39,
    level: 4,
    question: "What makes proof verification in Succinct efficient?",
    options: [
      "Blockchain magic",
      "Specialized ZK circuits & optimizations",
      "Prover energy drinks",
      "Quantum blockchain technology"
    ],
    correct_answer: 1
  },
  {
    id: 40,
    level: 4,
    question: "Which proof type offers the best cost-efficiency for most use cases?",
    options: [
      "The expensive one",
      "Compressed proofs",
      "The one with the coolest name",
      "Whatever Vitalik uses"
    ],
    correct_answer: 1
  },
  
  // Level 5: Practical Applications of Succinct
  {
    id: 41,
    level: 5,
    question: "ZK Rollups use Succinct because?",
    options: [
      "Rollups like trendy names",
      "Cheap & reliable proofs",
      "They like memes",
      "Ethereum told them to"
    ],
    correct_answer: 1
  },
  {
    id: 42,
    level: 5,
    question: "What's the benefit of Succinct for dApp developers?",
    options: [
      "More crypto parties",
      "Easier integration of ZK proofs",
      "Better blockchain memes",
      "Free NFT drops"
    ],
    correct_answer: 1
  },
  {
    id: 43,
    level: 5,
    question: "Which is NOT a benefit of Succinct's modular approach?",
    options: [
      "Specialized proving hardware",
      "Optimized cost structures",
      "Free blockchain counseling",
      "Improved scalability"
    ],
    correct_answer: 2
  },
  {
    id: 44,
    level: 5,
    question: "How does Succinct help with blockchain scaling?",
    options: [
      "Blockchain diet plans",
      "Efficient verification of off-chain computations",
      "Crypto yoga sessions",
      "NFT compression technology"
    ],
    correct_answer: 1
  },
  {
    id: 45,
    level: 5,
    question: "The 'economic alignment' in Succinct refers to?",
    options: [
      "Everyone getting rich",
      "Incentives that encourage honest proving",
      "Blockchain astrology",
      "NFT price stabilization"
    ],
    correct_answer: 1
  },
  {
    id: 46,
    level: 5,
    question: "Which network role benefits most from Succinct's tokenomics?",
    options: [
      "Meme creators",
      "Efficient provers with good hardware",
      "NFT collectors",
      "Blockchain influencers"
    ],
    correct_answer: 1
  },
  {
    id: 47,
    level: 5,
    question: "How does Succinct help blockchains maintain decentralization?",
    options: [
      "Blockchain therapy",
      "Distributing proving work through contests",
      "Mandatory decentralization workshops",
      "Proof diversity quotas"
    ],
    correct_answer: 1
  },
  {
    id: 48,
    level: 5,
    question: "What problem does Succinct's batching mechanism solve?",
    options: [
      "Too many individual proofs",
      "Cost-efficiency for small transactions",
      "Blockchain boredom",
      "Proof loneliness"
    ],
    correct_answer: 1
  },
  {
    id: 49,
    level: 5,
    question: "Which types of applications benefit most from Succinct?",
    options: [
      "Dating apps",
      "Computation-heavy blockchain applications",
      "Blockchain meme generators",
      "NFT art galleries"
    ],
    correct_answer: 1
  },
  {
    id: 50,
    level: 5,
    question: "What's the ultimate goal of the Succinct network?",
    options: [
      "Maximum blockchain drama",
      "Accessible & efficient ZK proof generation",
      "World domination through memes",
      "The perfect NFT marketplace"
    ],
    correct_answer: 1
  }
];
