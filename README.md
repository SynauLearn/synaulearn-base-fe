# 🎓 SynauLearn

> *Onboarding the next billion users to Web3, one micro-lesson at a time.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![Base Sepolia](https://img.shields.io/badge/Network-Base_Sepolia-blue)](https://base.org/)
[![Farcaster](https://img.shields.io/badge/Platform-Farcaster_MiniApp-purple)](https://www.farcaster.xyz/)

**SynauLearn** is a gamified, mobile-first microlearning platform built as a Farcaster MiniApp that transforms complex blockchain concepts into bite-sized, engaging lessons. Users learn Web3 fundamentals through interactive flashcards and quizzes, then earn verifiable on-chain credentials (NFT badges) to build their Web3 reputation.

---

## 🌟 Why SynauLearn?

The Web3 education gap is real. Millions are curious about blockchain, DeFi, and NFTs, but existing resources are either too technical, too scattered, or simply overwhelming for beginners.

**SynauLearn solves this by:**

- **Structured Learning Paths**: No more "where do I start?" Follow curated courses from zero to hero
- **Micro-Learning Format**: Make real progress in just 5-10 minutes per day
- **Active Learning**: Flashcards + quizzes = better retention through active recall
- **On-Chain Credentials**: Mint achievement badges as NFTs to build your Web3 resume
- **Gamified Experience**: Earn XP, climb leaderboards, and unlock advanced content

---

## ✨ Key Features

### 📚 **Interactive Learning**
- **Flashcard-Based Lessons**: Swipe through concepts, tap to reveal explanations
- **Instant Quizzes**: Test your knowledge immediately after each lesson
- **Progress Tracking**: See your completion percentage and XP in real-time

### 🏆 **On-Chain Credentials**
- **Mint NFT Badges**: Turn your achievements into permanent on-chain proof
- **Build Your Reputation**: Collect badges to unlock advanced courses
- **Shareable Achievements**: Showcase your Web3 knowledge across platforms

### 🎮 **Gamification**
- **XP System**: Earn points for viewing flashcards (+5 XP) and correct answers (+10 XP)
- **Leaderboards**: Compete with other learners globally
- **Streak Tracking**: Build daily learning habits (coming soon)

### 📱 **Mobile-First Design**
- **Farcaster MiniApp**: Native integration with Farcaster's ecosystem
- **Touch-Optimized**: Swipe, tap, and interact naturally
- **Responsive UI**: Works seamlessly on any screen size

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- A Farcaster account (for MiniApp features)
- A Web3 wallet (for minting badges)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YohanesVito/SynauLearn.git
   cd SynauLearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OnchainKit Configuration
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   NEXT_PUBLIC_CDP_PROJECT_ID=your_coinbase_project_id

   # Smart Contract (Base Sepolia)
   NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0x086a...93aD

   # Optional: Pinata for IPFS
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

### Frontend
- **[Next.js 15.1](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[OnchainKit](https://onchainkit.xyz/)** - Coinbase's Web3 components
- **[MiniKit](https://docs.farcaster.xyz/developers/minikit)** - Farcaster MiniApp SDK

### Blockchain
- **[Base Sepolia](https://base.org/)** - L2 testnet for smart contracts
- **[Wagmi](https://wagmi.sh/)** - React Hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript interface for Ethereum
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection UI
- **[Solidity](https://soliditylang.org/)** - Smart contract language

### Backend & Storage
- **[Supabase](https://supabase.com/)** - PostgreSQL database + Auth
- **[Pinata](https://www.pinata.cloud/)** - IPFS for NFT metadata

### Web3 Integration
- **Farcaster MiniApp** - Native integration with Farcaster's social layer
- **ERC-721** - NFT standard for achievement badges
- **OnchainKit Components** - Identity, wallet, and transaction UI

---

## 📖 Usage

### For Learners

1. **Browse Courses**
   - Start with "Blockchain Basics" or "Welcome to Web3"
   - Each course has multiple bite-sized lessons

2. **Learn Through Flashcards**
   - Tap cards to flip and reveal explanations
   - Swipe right to move to the next card
   - Swipe up to take the quiz

3. **Take Quizzes**
   - Answer multiple-choice questions
   - Earn +10 XP for correct answers
   - Review incorrect answers and retry

4. **Mint Your Badges**
   - Complete a course (100% progress)
   - Connect your wallet via RainbowKit
   - Mint your achievement as an NFT badge (free on testnet)

5. **Track Your Progress**
   - View your total XP on the Profile page
   - See all earned and locked badges
   - Climb the global leaderboard

### For Developers

#### Architecture Diagram
```mermaid
graph TD
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef backend fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef blockchain fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef external fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px,stroke-dasharray: 5 5;
    classDef user fill:#fff,stroke:#333,stroke-width:2px;

    %% User Node
    User((User / Learner)):::user

    %% External Services
    subgraph External_Services ["External Services"]
        Farcaster["Farcaster Protocol<br/>(Social Graph & Auth)"]:::external
        RPC["RPC Nodes<br/>(Base / Base Sepolia)"]:::external
    end

    %% SynauLearn Application
    subgraph SynauLearn_App ["SynauLearn Frontend (Next.js 16)"]
        direction TB
        
        %% Clients
        Layout["Root Layout<br/>(Providers Wrapper)"]:::frontend
        PWA["PWA Module<br/>(Service Worker)"]:::frontend
        
        %% Providers
        subgraph Providers ["Context Providers"]
            direction TB
            AuthProv[AuthKitProvider]:::frontend
            ConvexProv[ConvexClientProvider]:::frontend
            WagmiProv[WagmiProvider]:::frontend
            OnchainProv[OnchainKitProvider]:::frontend
        end
        
        %% Pages & Components
        Pages["App Pages<br/>(Home, Courses, Lessons)"]:::frontend
        MiniappSDK["Farcaster Miniapp SDK"]:::frontend
    end

    %% Convex Backend
    subgraph Convex_Cloud ["Convex Backend (Serverless)"]
        direction TB
        
        %% Functions
        Functions["Public/Internal Functions<br/>(Queries & Mutations)"]:::backend
        
        %% Database Schema
        subgraph Database ["Convex Database"]
            UsersTable[("Users")]:::backend
            ContentTable[("Courses/Lessons/Cards")]:::backend
            ProgressTable[("UserProgress")]:::backend
            BadgesTable[("MintedBadges")]:::backend
        end
    end

    %% Blockchain Layer
    subgraph Blockchain_Layer ["Base Blockchain"]
        SmartContracts["Smart Contracts<br/>(Badges/Certificates)"]:::blockchain
        Wallet["Smart Wallet / EOA"]:::blockchain
    end

    %% Relationships
    User -->|Interacts| SynauLearn_App
    User -->|Connects| Wallet

    %% Frontend Internal
    Layout --> Providers
    Providers --> Pages
    Pages --> MiniappSDK
    PWA -.-> Pages

    %% Frontend <-> External
    AuthProv -->|SIWF| Farcaster
    MiniappSDK -->|Frame Interaction| Farcaster
    WagmiProv -->|JSON-RPC| RPC

    %% Frontend <-> Backend
    ConvexProv <-->|WebSocket/Sync| Functions
    Functions -->|Read/Write| Database

    %% Frontend <-> Blockchain
    OnchainProv -->|Tx Submission| Wallet
    Wallet -->|Mint/Sign| SmartContracts
    
    %% Backend <-> Blockchain (Optional Verification)
    Functions -.->|Verify Mint| RPC

    %% Data Relationships
    UsersTable --- ProgressTable
    ContentTable --- ProgressTable
    UsersTable --- BadgesTable
```

#### Project Structure
```
SynauLearn/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   └── api/                # API routes (if any)
├── components/             # React components
│   ├── BottomNav.tsx       # Navigation bar
│   ├── CardView.tsx        # Flashcard + Quiz logic
│   ├── Courses.tsx         # Course list with progress
│   ├── HomeView.tsx        # Dashboard
│   ├── Leaderboard.tsx     # Rankings
│   ├── MintBadge.tsx       # Badge minting UI
│   ├── Profile.tsx         # User profile & badges
│   └── ...
├── lib/                    # Utilities & helpers
│   ├── api.ts              # Supabase API functions
│   ├── badgeContract.ts    # Smart contract interactions
│   ├── courseMapping.ts    # UUID to numeric ID mapping
│   └── utils.ts            # General utilities
├── public/                 # Static assets
├── contracts/              # Solidity smart contracts (if included)
└── ...
```

#### Key Components

- **`CardView.tsx`**: Core learning interface with flashcards and quizzes
- **`MintBadge.tsx`**: Wallet connection and NFT minting flow
- **`Leaderboard.tsx`**: Global rankings based on XP
- **`Profile.tsx`**: User stats, badges, and on-chain verification

#### Database Schema (Supabase)

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  fid INTEGER UNIQUE,
  username TEXT,
  display_name TEXT,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP
)

-- Courses & Lessons
courses (id UUID, title TEXT, description TEXT, emoji TEXT)
lessons (id UUID, course_id UUID, title TEXT, order INTEGER)
cards (id UUID, lesson_id UUID, flashcard_question TEXT, ...)

-- Progress tracking
user_card_progress (user_id UUID, card_id UUID, completed BOOLEAN)

-- Minted badges
minted_badges (
  user_id UUID,
  course_id UUID,
  wallet_address TEXT,
  token_id TEXT,
  tx_hash TEXT
)
```

---

## 🎨 Screenshots

### Home Dashboard
![Home View](https://via.placeholder.com/800x400?text=Home+Dashboard)
*Track your progress, see in-progress courses, and daily challenges*

### Learning Interface
![Flashcard View](https://via.placeholder.com/800x400?text=Flashcard+Learning)
*Swipe through flashcards, tap to flip, swipe up for quiz*

### Badge Collection
![Profile & Badges](https://via.placeholder.com/800x400?text=Badge+Collection)
*Collect and mint NFT badges for completed courses*

---

## 🛠️ Smart Contract

**Contract Address (Base Sepolia):**  
`0x086a...93aD`

### Key Functions

```solidity
// Mint a badge for completing a course
function mintBadge(uint256 courseId) external

// Check if user has a specific badge
function hasBadge(address user, uint256 courseId) external view returns (bool)

// Get user's badge token ID for a course
function getUserBadgeForCourse(address user, uint256 courseId) external view returns (uint256)
```

### Deployment

The smart contract is deployed on **Base Sepolia** testnet. You can verify the contract on [BaseScan](https://sepolia.basescan.org/).

To deploy your own:
```bash
# Coming soon: Deployment scripts
```

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or educational content, your help makes SynauLearn better.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📚 Documentation

For more detailed documentation:

- **[OnchainKit Docs](https://docs.base.org/onchainkit)** - Coinbase's Web3 toolkit
- **[MiniKit Docs](https://docs.farcaster.xyz/developers/minikit)** - Farcaster MiniApp SDK
- **[Base Docs](https://docs.base.org/)** - Base blockchain documentation
- **[Supabase Docs](https://supabase.com/docs)** - Backend & database

---

## 🗺️ Roadmap

### ✅ Completed (MVP)
- [x] Flashcard-based learning system
- [x] Interactive quiz functionality
- [x] XP and progress tracking
- [x] NFT badge minting on Base Sepolia
- [x] Farcaster MiniApp integration
- [x] Global leaderboard

### 🚧 In Progress
- [ ] Daily streak tracking
- [ ] Push notifications for reminders
- [ ] Course creation dashboard for educators
- [ ] Advanced analytics for learners

### 🔮 Future Plans
- [ ] Multi-language support (starting with Bahasa Indonesia)
- [ ] Community-created courses
- [ ] Partnership integrations (sponsor-branded modules)
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment
- [ ] Token-gated courses and exclusive content
- [ ] Live expert Q&A sessions

---

## 🐛 Known Issues

- **Wallet Connection**: Sometimes requires page refresh after connecting
- **Badge Minting**: Transaction confirmations can take 30-60 seconds on testnet
- **Mobile Safari**: Some animations may have reduced performance

See [Issues](https://github.com/YohanesVito/SynauLearn/issues) for the latest bug reports and feature requests.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**SynauLearn** is built with ❤️ by [@killerbie](https://github.com/YohanesVito), 

---

## 🙏 Acknowledgments

- **[Coinbase](https://www.coinbase.com/)** for OnchainKit and Base blockchain
- **[Farcaster](https://www.farcaster.xyz/)** for the MiniApp platform
- **[Supabase](https://supabase.com/)** for backend infrastructure
- **[RainbowKit](https://www.rainbowkit.com/)** for wallet connection UI
- The Web3 education community for inspiration

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/YohanesVito/SynauLearn/issues)
- **Farcaster**: [@killerbie](https://warpcast.com/killerbie)

---

## 🌐 Live Demo

**Farcaster MiniApp**: [SynauLearn](https://farcaster.xyz/miniapps/rmyjRyYzTZ8a/synaulearn)
**Web Demo**: [synau-learn-base.vercel.app](https://synau-learn-base.vercel.app) *(placeholder)*

---

<div align="center">
  
**Built with 💜 for the next billion Web3 users**

[![GitHub Stars](https://img.shields.io/github/stars/YohanesVito/SynauLearn?style=social)](https://github.com/YohanesVito/SynauLearn)
[![Farcaster](https://img.shields.io/badge/Follow-Farcaster-purple?style=social)](https://warpcast.com/killerbie)

</div>
