
export interface QuizQuestion {
  id: number;
  level: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export const quizQuestions: QuizQuestion[] = [
  // Level 1: The Basics of Optimum
  {
    id: 1,
    level: 1,
    question: "What is Optimum primarily about?",
    options: [
      "Launching meme tokens",
      "Delivering memory infrastructure for blockchains",
      "Becoming the next Ethereum",
      "Selling Web3 stickers"
    ],
    correct_answer: 1
  },
  {
    id: 2,
    level: 1,
    question: "Who co-founded Optimum?",
    options: [
      "Satoshi Nakamoto (on vacation)",
      "Vitalik's cousin",
      "Muriel Médard",
      "Elon Musk"
    ],
    correct_answer: 2
  },
  {
    id: 3,
    level: 1,
    question: "What powers Optimum's infrastructure?",
    options: [
      "AI dreams",
      "Quantum rainbows",
      "Random Linear Network Coding (RLNC)",
      "Magic beans"
    ],
    correct_answer: 2
  },
  {
    id: 4,
    level: 1,
    question: "Optimum is most like which computer part?",
    options: [
      "A dusty keyboard",
      "RAM and memory bus",
      "A toaster",
      "A calculator"
    ],
    correct_answer: 1
  },
  {
    id: 5,
    level: 1,
    question: "Optimum connects to:",
    options: [
      "Only Bitcoin",
      "Whatever's trending",
      "Any blockchain, permissionlessly",
      "TikTok nodes"
    ],
    correct_answer: 2
  },
  {
    id: 6,
    level: 1,
    question: "Optimum improves dApp performance by:",
    options: [
      "Cooking it faster",
      "Reducing network strain",
      "Praying to the node gods",
      "Teleporting packets"
    ],
    correct_answer: 1
  },
  {
    id: 7,
    level: 1,
    question: "What is the main challenge Optimum solves?",
    options: [
      "Validator insomnia",
      "Lack of real-time memory in blockchains",
      "Heavy wallets",
      "Gas leak"
    ],
    correct_answer: 1
  },
  {
    id: 8,
    level: 1,
    question: "How is Optimum built?",
    options: [
      "Like LEGO",
      "Modular and permissionless",
      "By freelancers",
      "With spaghetti code"
    ],
    correct_answer: 1
  },
  {
    id: 9,
    level: 1,
    question: "Which networks can use Optimum?",
    options: [
      "Only Layer 1",
      "Any blockchain",
      "Just Ethereum",
      "Only Solana"
    ],
    correct_answer: 1
  },
  {
    id: 10,
    level: 1,
    question: "Who benefits from Optimum?",
    options: [
      "Only whales",
      "Validators, devs, users, L1s and L2s",
      "Banks",
      "Aliens"
    ],
    correct_answer: 1
  },
  
  // Level 2: Memory Like a Blockchain Elephant
  {
    id: 11,
    level: 2,
    question: "What does RLNC stand for?",
    options: [
      "Really Loud Node Chatter",
      "Random Linear Network Coding",
      "Rotating Loop Node Controller",
      "Recursive Long Node Chain"
    ],
    correct_answer: 1
  },
  {
    id: 12,
    level: 2,
    question: "What's a shard in RLNC?",
    options: [
      "A magical relic",
      "A piece of a coded message",
      "A broken smart contract",
      "A sandwich"
    ],
    correct_answer: 1
  },
  {
    id: 13,
    level: 2,
    question: "Why are RLNC shards useful?",
    options: [
      "They look cool",
      "They reduce redundant bandwidth",
      "They sing in harmony",
      "They make coffee"
    ],
    correct_answer: 1
  },
  {
    id: 14,
    level: 2,
    question: "What happens if a node receives enough RLNC shards?",
    options: [
      "It celebrates",
      "It can decode the message",
      "It explodes",
      "It restarts"
    ],
    correct_answer: 1
  },
  {
    id: 15,
    level: 2,
    question: "RLNC helps peers start forwarding:",
    options: [
      "After a full message is received",
      "Immediately with the first shard",
      "When Mercury is in retrograde",
      "After morning coffee"
    ],
    correct_answer: 1
  },
  {
    id: 16,
    level: 2,
    question: "Traditional gossip protocols waste:",
    options: [
      "Good vibes",
      "Bandwidth",
      "Memory",
      "Snack time"
    ],
    correct_answer: 1
  },
  {
    id: 17,
    level: 2,
    question: "Gossipping in Web3 spreads:",
    options: [
      "Celebrity news",
      "Blocks and transactions",
      "Meme potential",
      "Airdrop rumors"
    ],
    correct_answer: 1
  },
  {
    id: 18,
    level: 2,
    question: "Message propagation is important for:",
    options: [
      "NFT minting speed",
      "Validator block rewards",
      "Memecoin launches",
      "Smart toaster updates"
    ],
    correct_answer: 1
  },
  {
    id: 19,
    level: 2,
    question: "How fast are RLNC-based messages?",
    options: [
      "Turtle speed",
      "Real-time",
      "Slow but steady",
      "Only when bribed"
    ],
    correct_answer: 1
  },
  {
    id: 20,
    level: 2,
    question: "Where was RLNC developed?",
    options: [
      "Hogwarts",
      "MIT",
      "Facebook",
      "Wakanda Tech Lab"
    ],
    correct_answer: 1
  },
  
  // Level 3: Flex Your Nodes
  {
    id: 21,
    level: 3,
    question: "What are Flexnodes?",
    options: [
      "Blockchain yoga instructors",
      "Homogeneous nodes in the Optimum network",
      "Shiny validators",
      "Nodes with attitude"
    ],
    correct_answer: 1
  },
  {
    id: 22,
    level: 3,
    question: "What can you do with a Flexnode?",
    options: [
      "Stream music",
      "Perform read/write operations",
      "Stake meme tokens",
      "Play chess"
    ],
    correct_answer: 1
  },
  {
    id: 23,
    level: 3,
    question: "Optimum DeRAM is best described as:",
    options: [
      "A RAM-destroying virus",
      "Decentralized Random Access Memory",
      "A memory cleaner",
      "Digital brain fog"
    ],
    correct_answer: 1
  },
  {
    id: 24,
    level: 3,
    question: "What is the goal of DeRAM?",
    options: [
      "Confuse developers",
      "Provide low-latency, high-throughput memory",
      "Censor data",
      "Create RAM NFTs"
    ],
    correct_answer: 1
  },
  {
    id: 25,
    level: 3,
    question: "Why is decentralization hard for memory?",
    options: [
      "Too many tabs open",
      "Asynchronous communication and malicious nodes",
      "All memory gets deleted",
      "Memory doesn't like freedom"
    ],
    correct_answer: 1
  },
  {
    id: 26,
    level: 3,
    question: "Flexnodes also act as:",
    options: [
      "Backup dancers",
      "Communication sockets",
      "NFT traders",
      "AI trainers"
    ],
    correct_answer: 1
  },
  {
    id: 27,
    level: 3,
    question: "DeRAM avoids which synchronization method?",
    options: [
      "Distributed synchronization primitives",
      "Handshakes",
      "WiFi passwords",
      "Memory meditation"
    ],
    correct_answer: 0
  },
  {
    id: 28,
    level: 3,
    question: "The benefit of avoiding those primitives is:",
    options: [
      "More party time",
      "Less complexity, more durability",
      "Node gossip reduction",
      "Cheaper minting fees"
    ],
    correct_answer: 1
  },
  {
    id: 29,
    level: 3,
    question: "Who interacts with Flexnodes?",
    options: [
      "Only miners",
      "External clients",
      "Celebrities",
      "Dogecoin holders"
    ],
    correct_answer: 1
  },
  {
    id: 30,
    level: 3,
    question: "How do Flexnodes achieve high availability?",
    options: [
      "Weekly yoga",
      "Non-blocking design",
      "Blockchain prayers",
      "Cloud computing rituals"
    ],
    correct_answer: 1
  },
  
  // Level 4: For the Curious Techie
  {
    id: 31,
    level: 4,
    question: "OptimumP2P is mainly used for:",
    options: [
      "Playing Web3 trivia",
      "Fast message propagation (aka gossiping)",
      "Building DAOs",
      "Podcast streaming"
    ],
    correct_answer: 1
  },
  {
    id: 32,
    level: 4,
    question: "What protocol does OptimumP2P use?",
    options: [
      "Gossip Girl Protocol",
      "Publish-Subscribe",
      "P2P2P",
      "Spam-chain"
    ],
    correct_answer: 1
  },
  {
    id: 33,
    level: 4,
    question: "What's wrong with normal gossiping?",
    options: [
      "Too slow and redundant",
      "Not juicy enough",
      "Only works at night",
      "Too centralized"
    ],
    correct_answer: 0
  },
  {
    id: 34,
    level: 4,
    question: "How is RLNC different in gossip?",
    options: [
      "It sings the message",
      "Sends shards instead of full messages",
      "Waits for full moon",
      "Uses emojis"
    ],
    correct_answer: 1
  },
  {
    id: 35,
    level: 4,
    question: "What happens to repeated info in RLNC gossip?",
    options: [
      "Crashes nodes",
      "It's much smaller",
      "Turns into spam",
      "Gets flagged"
    ],
    correct_answer: 1
  },
  {
    id: 36,
    level: 4,
    question: "What's a major performance benefit of OptimumP2P?",
    options: [
      "Colorful dashboards",
      "Low latency and bandwidth usage",
      "Push notifications",
      "Faster memes"
    ],
    correct_answer: 1
  },
  {
    id: 37,
    level: 4,
    question: "Traditional gossip delays message because:",
    options: [
      "Nodes are lazy",
      "Messages need full receipt before forwarding",
      "Too much chit-chat",
      "VPN issues"
    ],
    correct_answer: 1
  },
  {
    id: 38,
    level: 4,
    question: "Fast gossiping benefits who the most?",
    options: [
      "Memecoin traders",
      "Validators and MEV searchers",
      "TikTok creators",
      "Web2 devs"
    ],
    correct_answer: 1
  },
  {
    id: 39,
    level: 4,
    question: "If gossip is too slow, validators might:",
    options: [
      "Lose block rewards",
      "Go to therapy",
      "Rage quit",
      "Upgrade to GenZ nodes"
    ],
    correct_answer: 0
  },
  {
    id: 40,
    level: 4,
    question: "With RLNC, a peer can forward data:",
    options: [
      "After recharging",
      "After receiving the first shard",
      "At night",
      "With a lucky charm"
    ],
    correct_answer: 1
  },
  
  // Level 5: Final Boss Mode
  {
    id: 41,
    level: 5,
    question: "Optimum is backed by:",
    options: [
      "Hogwarts Investment Group",
      "1kx, Spartan, Kraken Ventures & more",
      "Blockbuster",
      "Elon's Twitter Space"
    ],
    correct_answer: 1
  },
  {
    id: 42,
    level: 5,
    question: "Who benefits from Optimum's memory system?",
    options: [
      "Only miners",
      "Everyone from validators to dApp users",
      "Block explorers",
      "Crypto influencers only"
    ],
    correct_answer: 1
  },
  {
    id: 43,
    level: 5,
    question: "Which component helps with reduced latency?",
    options: [
      "Magic spells",
      "RLNC-powered messaging",
      "Token inflation",
      "Time travel"
    ],
    correct_answer: 1
  },
  {
    id: 44,
    level: 5,
    question: "What is Optimum's design philosophy?",
    options: [
      "One-chain to rule them all",
      "Modular, permissionless, scalable",
      "No rules, just vibes",
      "Fork everything"
    ],
    correct_answer: 1
  },
  {
    id: 45,
    level: 5,
    question: "RLNC helps reduce:",
    options: [
      "Dancing validators",
      "Bandwidth wastage",
      "Web2 nostalgia",
      "The moon's gravitational pull"
    ],
    correct_answer: 1
  },
  {
    id: 46,
    level: 5,
    question: "What makes Optimum scalable?",
    options: [
      "Infinite memes",
      "Its memory infrastructure and RLNC",
      "Endless forks",
      "Daily node workouts"
    ],
    correct_answer: 1
  },
  {
    id: 47,
    level: 5,
    question: "What can happen to nodes in a bad gossip setup?",
    options: [
      "They oversleep",
      "Get overwhelmed by redundant data",
      "Order pizza",
      "Become influencers"
    ],
    correct_answer: 1
  },
  {
    id: 48,
    level: 5,
    question: "DeRAM handles reads/writes that are:",
    options: [
      "Spiritual",
      "Atomic",
      "Lazy",
      "Asynchronous only"
    ],
    correct_answer: 1
  },
  {
    id: 49,
    level: 5,
    question: "RLNC's flexibility helps avoid:",
    options: [
      "Boring meetings",
      "Costly synchronization",
      "Meme wars",
      "Token drift"
    ],
    correct_answer: 1
  },
  {
    id: 50,
    level: 5,
    question: "What's the most impressive thing about Optimum?",
    options: [
      "Its name",
      "It's provably optimal and scalable",
      "It runs on coffee",
      "It launched with no whitepaper"
    ],
    correct_answer: 1
  }
];
