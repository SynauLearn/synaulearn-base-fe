import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ SEED BASE COURSE ============
export const seedBaseCourse = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Check if course already exists
        const existingCourses = await ctx.db.query("courses").collect();
        if (existingCourses.length > 0) {
            return { message: "Courses already exist", count: existingCourses.length };
        }

        // Create Base Course
        const courseId = await ctx.db.insert("courses", {
            title: "Pengenalan Base",
            description: "Pelajari Base - blockchain Layer-2 yang dibangun oleh Coinbase. Dari konsep dasar hingga arsitektur lanjutan.",
            emoji: "⛓️",
            language: "id",
            difficulty: "Basic",
            category_id: undefined,
            total_lessons: 3,
            created_at: now,
            course_detail: `
# Tentang Kursus Ini

Pelajari dasar-dasar Base, blockchain Layer-2 yang aman, murah, dan developer-friendly yang dibangun di atas Ethereum.

## Apa yang akan Anda pelajari?
- Konsep dasar Layer-2 dan mengapa itu penting
- Cara menggunakan Base network
- Ekosistem dan tools di Base
- Tips keamanan dalam bertransaksi

## Untuk siapa kursus ini?
Kursus ini dirancang untuk pemula yang ingin memahami teknologi blockchain modern dan developer yang ingin mulai membangun di Base.
            `.trim(),
        });

        // Create Lesson 1: Introduction
        const lesson1Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Introduction to Base",
            lesson_number: 1,
            created_at: now,
        });

        // Create Lesson 2: Ecosystem
        const lesson2Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Ekosistem & Base Tools",
            lesson_number: 2,
            created_at: now,
        });

        // Create Lesson 3: Advanced
        const lesson3Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Konsep Lanjutan tentang Base",
            lesson_number: 3,
            created_at: now,
        });

        // Cards for Lesson 1
        const lesson1Cards = [
            {
                flashcard_question: "Apa itu Base dan Layer 2?",
                flashcard_answer: "Base adalah blockchain Layer-2 yang dibangun oleh Coinbase di atas Ethereum. Layer-2 adalah jaringan yang berjalan di atas blockchain lain (Layer-1) untuk membuat transaksi lebih cepat dan murah.",
                quiz_question: "Apa itu Base?",
                quiz_option_a: "Blockchain Layer-1",
                quiz_option_b: "Blockchain Layer-2 yang dibangun oleh Coinbase",
                quiz_option_c: "Dompet kripto baru",
                quiz_option_d: "Standar token",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Visi Base — \"Base for Everyone\"",
                flashcard_answer: "Base percaya bahwa setiap orang berhak untuk berada di dunia onchain, bukan hanya developer atau ahli kripto. Dengan biaya rendah dan proses onboarding yang mudah, Base membuat blockchain menjadi lebih mudah diakses.",
                quiz_question: "Apa fungsi blockchain Layer-2?",
                quiz_option_a: "Menggantikan Layer-1 sepenuhnya",
                quiz_option_b: "Memproses transaksi di luar rantai (off-chain) agar lebih cepat dan murah",
                quiz_option_c: "Meningkatkan biaya gas",
                quiz_option_d: "Menonaktifkan smart contract",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Mengapa Base Penting",
                flashcard_answer: "Dengan menggunakan Optimism OP Stack, Base menggabungkan keamanan Ethereum dengan kinerja yang lebih cepat. Developer dapat meluncurkan aplikasi DeFi, NFT, game, dan komunitas.",
                quiz_question: "Blockchain apa yang menjadi dasar Base?",
                quiz_option_a: "Solana",
                quiz_option_b: "Polygon",
                quiz_option_c: "Ethereum",
                quiz_option_d: "Bitcoin",
                quiz_correct_answer: "C",
            },
            {
                flashcard_question: "Teknologi Base",
                flashcard_answer: "Base dibangun menggunakan Optimism OP Stack, yaitu kerangka modular yang digunakan oleh banyak blockchain Layer-2. Ini memberikan Base keamanan Ethereum dengan kinerja yang lebih cepat.",
                quiz_question: "Teknologi apa yang digunakan Base?",
                quiz_option_a: "Binance Chain",
                quiz_option_b: "Optimism OP Stack",
                quiz_option_c: "Cosmos SDK",
                quiz_option_d: "Solana runtime",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Onchain Summer",
                flashcard_answer: "Onchain Summer adalah inisiatif yang dilakukan Base untuk mendorong kreator dan developer membangun di ekosistem Base.",
                quiz_question: "Inisiatif apa yang mendorong kreator untuk membangun di Base?",
                quiz_option_a: "Onchain Summer",
                quiz_option_b: "Winter of DeFi",
                quiz_option_c: "Base Connect",
                quiz_option_d: "Coinbase Dev Week",
                quiz_correct_answer: "A",
            },
        ];

        for (let i = 0; i < lesson1Cards.length; i++) {
            await ctx.db.insert("cards", {
                lesson_id: lesson1Id,
                card_number: i + 1,
                ...lesson1Cards[i],
                created_at: now,
            });
        }

        // Cards for Lesson 2
        const lesson2Cards = [
            {
                flashcard_question: "Memulai di Base",
                flashcard_answer: "Untuk mulai menggunakan Base, kamu memerlukan wallet yang kompatibel dengan Ethereum seperti Coinbase Wallet, MetaMask, atau Rainbow.",
                quiz_question: "Apa yang kamu butuhkan untuk mulai menggunakan Base?",
                quiz_option_a: "Hanya akun Coinbase",
                quiz_option_b: "Wallet yang kompatibel dengan Ethereum",
                quiz_option_c: "Perangkat keras khusus",
                quiz_option_d: "Token khusus Base",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Base Bridge",
                flashcard_answer: "Base Bridge adalah alat yang digunakan untuk mengirim ETH dari Ethereum mainnet ke jaringan Base. Bridge ini mengonversi ETH-mu agar bisa digunakan di Base.",
                quiz_question: "Untuk apa Base Bridge digunakan?",
                quiz_option_a: "Menghubungkan ke Solana",
                quiz_option_b: "Mengirim ETH dari Ethereum ke Base",
                quiz_option_c: "Mengonversi token ke fiat",
                quiz_option_d: "Membeli NFT secara langsung",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Farcaster di Base",
                flashcard_answer: "Farcaster adalah platform sosial terdesentralisasi yang berjalan di Base. Ini adalah salah satu contoh bagaimana Base mendukung aplikasi sosial Web3.",
                quiz_question: "Platform sosial mana yang berjalan di Base?",
                quiz_option_a: "Farcaster",
                quiz_option_b: "Instagram",
                quiz_option_c: "Reddit",
                quiz_option_d: "TikTok",
                quiz_correct_answer: "A",
            },
            {
                flashcard_question: "Keamanan: Wallet Draining",
                flashcard_answer: "Wallet-draining adalah jenis penipuan di mana penipu mencoba mengosongkan wallet-mu dengan meminta tanda tangan transaksi yang mencurigakan.",
                quiz_question: "Jenis penipuan apa yang umum dan harus dihindari pengguna?",
                quiz_option_a: "Airdrop resmi Base",
                quiz_option_b: "Transaksi wallet-draining",
                quiz_option_c: "Koleksi NFT terverifikasi",
                quiz_option_d: "Pengumuman dari Coinbase",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Menjaga Keamanan Wallet",
                flashcard_answer: "Untuk tetap aman, jangan pernah membagikan seed phrase atau private key wallet-mu kepada siapa pun.",
                quiz_question: "Apa yang tidak boleh kamu bagikan agar tetap aman?",
                quiz_option_a: "Alamat wallet",
                quiz_option_b: "Seed phrase atau private key",
                quiz_option_c: "Hash transaksi",
                quiz_option_d: "Gambar NFT",
                quiz_correct_answer: "B",
            },
        ];

        for (let i = 0; i < lesson2Cards.length; i++) {
            await ctx.db.insert("cards", {
                lesson_id: lesson2Id,
                card_number: i + 1,
                ...lesson2Cards[i],
                created_at: now,
            });
        }

        // Cards for Lesson 3
        const lesson3Cards = [
            {
                flashcard_question: "Cara Kerja Base: OP Stack",
                flashcard_answer: "Base dibangun menggunakan Optimism OP Stack, yaitu kerangka modular yang digunakan oleh banyak blockchain Layer-2.",
                quiz_question: "Teknologi apa yang digunakan oleh Base?",
                quiz_option_a: "Polygon SDK",
                quiz_option_b: "Optimism OP Stack",
                quiz_option_c: "Cosmos SDK",
                quiz_option_d: "Solana runtime",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Optimistic Rollup",
                flashcard_answer: "Base beroperasi sebagai Optimistic Rollup, yang berarti transaksi diproses off-chain lalu digabungkan dan dikirim kembali ke Ethereum.",
                quiz_question: "Jenis rollup apa yang digunakan oleh Base?",
                quiz_option_a: "Zero-Knowledge Rollup",
                quiz_option_b: "Optimistic Rollup",
                quiz_option_c: "Plasma Chain",
                quiz_option_d: "Sidechain",
                quiz_correct_answer: "B",
            },
            {
                flashcard_question: "Peran Sequencer",
                flashcard_answer: "Sequencer adalah komponen penting dalam sistem Base. Tugasnya adalah mengurutkan transaksi dan mengirimkannya ke Ethereum.",
                quiz_question: "Apa yang dilakukan sequencer di Base?",
                quiz_option_a: "Mengurutkan transaksi dan mengirimkannya ke Ethereum",
                quiz_option_b: "Membuat token baru",
                quiz_option_c: "Menambang blok",
                quiz_option_d: "Mengontrol wallet",
                quiz_correct_answer: "A",
            },
            {
                flashcard_question: "Superchain",
                flashcard_answer: "Superchain adalah sekelompok blockchain berbasis OP Stack yang berbagi infrastruktur yang sama.",
                quiz_question: "Apa itu \"Superchain\"?",
                quiz_option_a: "Sekelompok blockchain berbasis OP Stack yang berbagi infrastruktur yang sama",
                quiz_option_b: "Jaringan khusus Base",
                quiz_option_c: "Jaringan Coinbase yang tersentralisasi",
                quiz_option_d: "Jenis marketplace NFT",
                quiz_correct_answer: "A",
            },
            {
                flashcard_question: "Peran Base dalam Ekosistem Ethereum",
                flashcard_answer: "Base membantu Ethereum berkembang dan membawa lebih banyak pengguna onchain. Base tidak bersaing dengan Ethereum, melainkan memperluas kapabilitasnya.",
                quiz_question: "Apa peran Base dalam ekosistem Ethereum?",
                quiz_option_a: "Bersaing dengan Ethereum",
                quiz_option_b: "Membantu Ethereum berkembang dan membawa lebih banyak pengguna onchain",
                quiz_option_c: "Menggantikan semua Layer-2 lainnya",
                quiz_option_d: "Berjalan secara independen dari Ethereum",
                quiz_correct_answer: "B",
            },
        ];

        for (let i = 0; i < lesson3Cards.length; i++) {
            await ctx.db.insert("cards", {
                lesson_id: lesson3Id,
                card_number: i + 1,
                ...lesson3Cards[i],
                created_at: now,
            });
        }

        return {
            message: "Base course seeded successfully",
            courseId,
            lessons: [lesson1Id, lesson2Id, lesson3Id],
            totalCards: lesson1Cards.length + lesson2Cards.length + lesson3Cards.length,
        };
    },
});

// ============ SEED CATEGORIES ============
export const seedCategories = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if categories already exist
        const existingCategories = await ctx.db.query("categories").collect();
        if (existingCategories.length > 0) {
            return { message: "Categories already exist", count: existingCategories.length };
        }

        const categories = [
            { name: "Blockchain Basics", name_id: "Dasar Blockchain", emoji: "⛓️", slug: "blockchain-basics", order_index: 1 },
            { name: "DeFi", name_id: "DeFi", emoji: "💰", slug: "defi", order_index: 2 },
            { name: "Security", name_id: "Keamanan", emoji: "🔒", slug: "security", order_index: 3 },
        ];

        const categoryIds = [];
        for (const cat of categories) {
            const id = await ctx.db.insert("categories", cat);
            categoryIds.push(id);
        }

        return { message: "Categories seeded", count: categoryIds.length, ids: categoryIds };
    },
});

// ============ RESET AND RESEED ALL ============
export const reseedAll = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Delete existing data
        const existingCards = await ctx.db.query("cards").collect();
        for (const card of existingCards) {
            await ctx.db.delete(card._id);
        }

        const existingLessons = await ctx.db.query("lessons").collect();
        for (const lesson of existingLessons) {
            await ctx.db.delete(lesson._id);
        }

        const existingCourses = await ctx.db.query("courses").collect();
        for (const course of existingCourses) {
            await ctx.db.delete(course._id);
        }

        const existingCategories = await ctx.db.query("categories").collect();
        for (const cat of existingCategories) {
            await ctx.db.delete(cat._id);
        }

        // Create categories
        const basicCategoryId = await ctx.db.insert("categories", {
            name: "Blockchain Basics",
            name_id: "Dasar Blockchain",
            emoji: "⛓️",
            slug: "blockchain-basics",
            order_index: 1,
        });

        // Create Base Course with category
        const courseId = await ctx.db.insert("courses", {
            title: "Pengenalan Base",
            description: "Pelajari Base - blockchain Layer-2 yang dibangun oleh Coinbase.",
            emoji: "⛓️",
            language: "id",
            difficulty: "Basic",
            category_id: basicCategoryId,
            total_lessons: 3,
            created_at: now,
            course_detail: `
# Tentang Kursus Ini

Pelajari dasar-dasar Base, blockchain Layer-2 yang aman, murah, dan developer-friendly yang dibangun di atas Ethereum.

## Apa yang akan Anda pelajari?
- Konsep dasar Layer-2 dan mengapa itu penting
- Cara menggunakan Base network
- Ekosistem dan tools di Base
- Tips keamanan dalam bertransaksi

## Untuk siapa kursus ini?
Kursus ini dirancang untuk pemula yang ingin memahami teknologi blockchain modern dan developer yang ingin mulai membangun di Base.
            `.trim(),
        });

        // Create lessons
        const lesson1Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Introduction to Base",
            lesson_number: 1,
            created_at: now,
        });

        const lesson2Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Ekosistem & Base Tools",
            lesson_number: 2,
            created_at: now,
        });

        const lesson3Id = await ctx.db.insert("lessons", {
            course_id: courseId,
            title: "Konsep Lanjutan tentang Base",
            lesson_number: 3,
            created_at: now,
        });

        // Cards for Lesson 1 (5 cards)
        const lesson1Cards = [
            { flashcard_question: "Apa itu Base dan Layer 2?", flashcard_answer: "Base adalah blockchain Layer-2 yang dibangun oleh Coinbase di atas Ethereum.", quiz_question: "Apa itu Base?", quiz_option_a: "Blockchain Layer-1", quiz_option_b: "Blockchain Layer-2 yang dibangun oleh Coinbase", quiz_option_c: "Dompet kripto baru", quiz_option_d: "Standar token", quiz_correct_answer: "B" },
            { flashcard_question: "Visi Base — \"Base for Everyone\"", flashcard_answer: "Base percaya bahwa setiap orang berhak untuk berada di dunia onchain.", quiz_question: "Apa fungsi blockchain Layer-2?", quiz_option_a: "Menggantikan Layer-1 sepenuhnya", quiz_option_b: "Memproses transaksi di luar rantai agar lebih cepat dan murah", quiz_option_c: "Meningkatkan biaya gas", quiz_option_d: "Menonaktifkan smart contract", quiz_correct_answer: "B" },
            { flashcard_question: "Mengapa Base Penting", flashcard_answer: "Dengan menggunakan Optimism OP Stack, Base menggabungkan keamanan Ethereum dengan kinerja yang lebih cepat.", quiz_question: "Blockchain apa yang menjadi dasar Base?", quiz_option_a: "Solana", quiz_option_b: "Polygon", quiz_option_c: "Ethereum", quiz_option_d: "Bitcoin", quiz_correct_answer: "C" },
            { flashcard_question: "Teknologi Base", flashcard_answer: "Base dibangun menggunakan Optimism OP Stack.", quiz_question: "Teknologi apa yang digunakan Base?", quiz_option_a: "Binance Chain", quiz_option_b: "Optimism OP Stack", quiz_option_c: "Cosmos SDK", quiz_option_d: "Solana runtime", quiz_correct_answer: "B" },
            { flashcard_question: "Onchain Summer", flashcard_answer: "Onchain Summer adalah inisiatif yang dilakukan Base untuk mendorong kreator dan developer membangun di ekosistem Base.", quiz_question: "Inisiatif apa yang mendorong kreator untuk membangun di Base?", quiz_option_a: "Onchain Summer", quiz_option_b: "Winter of DeFi", quiz_option_c: "Base Connect", quiz_option_d: "Coinbase Dev Week", quiz_correct_answer: "A" },
        ];

        for (let i = 0; i < lesson1Cards.length; i++) {
            await ctx.db.insert("cards", { lesson_id: lesson1Id, card_number: i + 1, ...lesson1Cards[i], created_at: now });
        }

        // Cards for Lesson 2 (5 cards)
        const lesson2Cards = [
            { flashcard_question: "Memulai di Base", flashcard_answer: "Untuk mulai menggunakan Base, kamu memerlukan wallet yang kompatibel dengan Ethereum.", quiz_question: "Apa yang kamu butuhkan untuk mulai menggunakan Base?", quiz_option_a: "Hanya akun Coinbase", quiz_option_b: "Wallet yang kompatibel dengan Ethereum", quiz_option_c: "Perangkat keras khusus", quiz_option_d: "Token khusus Base", quiz_correct_answer: "B" },
            { flashcard_question: "Base Bridge", flashcard_answer: "Base Bridge adalah alat yang digunakan untuk mengirim ETH dari Ethereum mainnet ke jaringan Base.", quiz_question: "Untuk apa Base Bridge digunakan?", quiz_option_a: "Menghubungkan ke Solana", quiz_option_b: "Mengirim ETH dari Ethereum ke Base", quiz_option_c: "Mengonversi token ke fiat", quiz_option_d: "Membeli NFT secara langsung", quiz_correct_answer: "B" },
            { flashcard_question: "Farcaster di Base", flashcard_answer: "Farcaster adalah platform sosial terdesentralisasi yang berjalan di Base.", quiz_question: "Platform sosial mana yang berjalan di Base?", quiz_option_a: "Farcaster", quiz_option_b: "Instagram", quiz_option_c: "Reddit", quiz_option_d: "TikTok", quiz_correct_answer: "A" },
            { flashcard_question: "Keamanan: Wallet Draining", flashcard_answer: "Wallet-draining adalah jenis penipuan di mana penipu mencoba mengosongkan wallet-mu.", quiz_question: "Jenis penipuan apa yang harus dihindari pengguna?", quiz_option_a: "Airdrop resmi Base", quiz_option_b: "Transaksi wallet-draining", quiz_option_c: "Koleksi NFT terverifikasi", quiz_option_d: "Pengumuman dari Coinbase", quiz_correct_answer: "B" },
            { flashcard_question: "Menjaga Keamanan Wallet", flashcard_answer: "Jangan pernah membagikan seed phrase atau private key wallet-mu kepada siapa pun.", quiz_question: "Apa yang tidak boleh kamu bagikan agar tetap aman?", quiz_option_a: "Alamat wallet", quiz_option_b: "Seed phrase atau private key", quiz_option_c: "Hash transaksi", quiz_option_d: "Gambar NFT", quiz_correct_answer: "B" },
        ];

        for (let i = 0; i < lesson2Cards.length; i++) {
            await ctx.db.insert("cards", { lesson_id: lesson2Id, card_number: i + 1, ...lesson2Cards[i], created_at: now });
        }

        // Cards for Lesson 3 (5 cards)
        const lesson3Cards = [
            { flashcard_question: "Cara Kerja Base: OP Stack", flashcard_answer: "Base dibangun menggunakan Optimism OP Stack.", quiz_question: "Teknologi apa yang digunakan oleh Base?", quiz_option_a: "Polygon SDK", quiz_option_b: "Optimism OP Stack", quiz_option_c: "Cosmos SDK", quiz_option_d: "Solana runtime", quiz_correct_answer: "B" },
            { flashcard_question: "Optimistic Rollup", flashcard_answer: "Base beroperasi sebagai Optimistic Rollup, transaksi diproses off-chain lalu digabungkan.", quiz_question: "Jenis rollup apa yang digunakan oleh Base?", quiz_option_a: "Zero-Knowledge Rollup", quiz_option_b: "Optimistic Rollup", quiz_option_c: "Plasma Chain", quiz_option_d: "Sidechain", quiz_correct_answer: "B" },
            { flashcard_question: "Peran Sequencer", flashcard_answer: "Sequencer mengurutkan transaksi dan mengirimkannya ke Ethereum.", quiz_question: "Apa yang dilakukan sequencer di Base?", quiz_option_a: "Mengurutkan transaksi dan mengirimkannya ke Ethereum", quiz_option_b: "Membuat token baru", quiz_option_c: "Menambang blok", quiz_option_d: "Mengontrol wallet", quiz_correct_answer: "A" },
            { flashcard_question: "Superchain", flashcard_answer: "Superchain adalah sekelompok blockchain berbasis OP Stack yang berbagi infrastruktur yang sama.", quiz_question: "Apa itu Superchain?", quiz_option_a: "Sekelompok blockchain berbasis OP Stack", quiz_option_b: "Jaringan khusus Base", quiz_option_c: "Jaringan Coinbase tersentralisasi", quiz_option_d: "Jenis marketplace NFT", quiz_correct_answer: "A" },
            { flashcard_question: "Peran Base dalam Ekosistem Ethereum", flashcard_answer: "Base membantu Ethereum berkembang dan membawa lebih banyak pengguna onchain.", quiz_question: "Apa peran Base dalam ekosistem Ethereum?", quiz_option_a: "Bersaing dengan Ethereum", quiz_option_b: "Membantu Ethereum berkembang", quiz_option_c: "Menggantikan semua Layer-2", quiz_option_d: "Berjalan secara independen", quiz_correct_answer: "B" },
        ];

        for (let i = 0; i < lesson3Cards.length; i++) {
            await ctx.db.insert("cards", { lesson_id: lesson3Id, card_number: i + 1, ...lesson3Cards[i], created_at: now });
        }

        return {
            message: "All data reseeded successfully with 15 cards",
            category: basicCategoryId,
            course: courseId,
            lessons: [lesson1Id, lesson2Id, lesson3Id],
            totalCards: 15,
        };
    },
});

// ============ SEED DEMO COURSES (EN + ID) ============
export const seedDemoCourse = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Check if demo courses already exist
        const allCourses = await ctx.db.query("courses").collect();
        const existingDemo = allCourses.filter((c) => c.is_demo === true);
        if (existingDemo.length > 0) {
            return { message: "Demo courses already exist", count: existingDemo.length };
        }

        const results = [];

        // ── ENGLISH DEMO COURSE ──
        const enCourseId = await ctx.db.insert("courses", {
            title: "Welcome to Web3",
            description: "Your first step into the decentralized world. Learn the basics of blockchain, wallets, and why Web3 matters — no prior knowledge needed.",
            emoji: "🚀",
            language: "en",
            difficulty: "Basic",
            total_lessons: 1,
            is_demo: true,
            created_at: now,
            course_detail: `
# Welcome to Web3

This demo lesson introduces you to the world of blockchain and Web3. You'll learn what makes it different from the internet you know today.

## What you'll learn
- What blockchain and Web3 are
- How digital wallets work
- What makes transactions "decentralized"
- Why Web3 matters for you

## Who is this for?
Complete beginners. No coding or crypto experience needed.
            `.trim(),
        });

        const enLessonId = await ctx.db.insert("lessons", {
            course_id: enCourseId,
            title: "Web3 Basics: From Web2 to Web3",
            lesson_number: 1,
            created_at: now,
        });

        // EN Cards
        const enCards = [
            {
                flashcard_question: "What is Web3?",
                flashcard_answer: "Web3 is the next evolution of the internet. Unlike Web2 (where companies like Google and Facebook control your data), Web3 lets YOU own your data, money, and digital identity through blockchain technology.",
            },
            {
                flashcard_question: "What is a Blockchain?",
                flashcard_answer: "A blockchain is a shared digital record book that no single person or company controls. Once data is written, it can't be changed or deleted. Think of it like a Google Spreadsheet that everyone can see, but nobody can secretly edit.",
            },
            {
                flashcard_question: "What is a Digital Wallet?",
                flashcard_answer: "A digital wallet (like Coinbase Wallet or MetaMask) is your passport to Web3. It stores your cryptocurrency and lets you interact with blockchain apps — no bank account needed. Your wallet has a public address (like an email) and a private key (like a password you must never share).",
            },
            {
                flashcard_question: "What are Smart Contracts?",
                flashcard_answer: "Smart contracts are programs that run on the blockchain automatically. They execute agreements without middlemen. For example, a smart contract can automatically send you a concert ticket the moment your payment is confirmed — no Ticketmaster needed.",
            },
            {
                flashcard_question: "Why Does Web3 Matter?",
                flashcard_answer: "Web3 gives power back to users. You can own digital art (NFTs), earn money in games, lend/borrow without banks (DeFi), and participate in communities that you co-own (DAOs). It's the internet, but you're the owner — not the product.",
            },
        ];

        const enCardIds = [];
        for (let i = 0; i < enCards.length; i++) {
            const cardId = await ctx.db.insert("cards", {
                lesson_id: enLessonId,
                card_number: i + 1,
                ...enCards[i],
                created_at: now,
            });
            enCardIds.push(cardId);
        }

        // EN Quizzes: 2 MC, 2 TF, 1 Fill-blank
        const enQuizzes = [
            // MC 1
            {
                card_id: enCardIds[0],
                quiz_type: "multiple_choice",
                question: "What is the key difference between Web2 and Web3?",
                options: [
                    { id: "A", text: "Web3 is faster than Web2" },
                    { id: "B", text: "In Web3, users own their data instead of companies" },
                    { id: "C", text: "Web3 doesn't use the internet" },
                    { id: "D", text: "Web3 is only for developers" },
                ],
                correct_answer: "B",
                created_at: now,
            },
            // MC 2
            {
                card_id: enCardIds[1],
                quiz_type: "multiple_choice",
                question: "What is a blockchain best compared to?",
                options: [
                    { id: "A", text: "A private database owned by a company" },
                    { id: "B", text: "A shared record book that nobody can secretly change" },
                    { id: "C", text: "A regular website" },
                    { id: "D", text: "An email service" },
                ],
                correct_answer: "B",
                created_at: now,
            },
            // TF 1
            {
                card_id: enCardIds[2],
                quiz_type: "true_false",
                question: "A digital wallet's private key should be shared with friends for security.",
                correct_answer: "false",
                created_at: now,
            },
            // TF 2
            {
                card_id: enCardIds[3],
                quiz_type: "true_false",
                question: "Smart contracts can execute automatically without intermediaries.",
                correct_answer: "true",
                created_at: now,
            },
            // Fill-blank
            {
                card_id: enCardIds[4],
                quiz_type: "fill_blank",
                question: "In Web3, users can own digital art through tokens called ___.",
                correct_answer: "NFTs",
                acceptable_answers: ["NFT", "nfts", "nft", "Non-Fungible Tokens"],
                hint: "These three-letter tokens represent unique digital ownership",
                created_at: now,
            },
        ];

        for (const quiz of enQuizzes) {
            await ctx.db.insert("quizzes", quiz);
        }

        results.push({ language: "en", courseId: enCourseId, lessonId: enLessonId, cards: enCardIds.length, quizzes: enQuizzes.length });

        // ── INDONESIAN DEMO COURSE ──
        const idCourseId = await ctx.db.insert("courses", {
            title: "Selamat Datang di Web3",
            description: "Langkah pertama kamu ke dunia terdesentralisasi. Pelajari dasar-dasar blockchain, wallet, dan mengapa Web3 penting — tanpa perlu pengetahuan sebelumnya.",
            emoji: "🚀",
            language: "id",
            difficulty: "Basic",
            total_lessons: 1,
            is_demo: true,
            created_at: now,
            course_detail: `
# Selamat Datang di Web3

Demo ini memperkenalkan kamu ke dunia blockchain dan Web3. Kamu akan belajar apa yang membuatnya berbeda dari internet yang kamu kenal sehari-hari.

## Apa yang akan kamu pelajari?
- Apa itu blockchain dan Web3
- Cara kerja wallet digital
- Apa yang membuat transaksi "terdesentralisasi"
- Mengapa Web3 penting untukmu

## Untuk siapa ini?
Pemula total. Tidak perlu pengalaman coding atau kripto.
            `.trim(),
        });

        const idLessonId = await ctx.db.insert("lessons", {
            course_id: idCourseId,
            title: "Dasar Web3: Dari Web2 ke Web3",
            lesson_number: 1,
            created_at: now,
        });

        // ID Cards
        const idCards = [
            {
                flashcard_question: "Apa itu Web3?",
                flashcard_answer: "Web3 adalah evolusi internet berikutnya. Berbeda dengan Web2 (di mana perusahaan seperti Google dan Facebook menguasai datamu), Web3 memungkinkan KAMU yang memiliki data, uang, dan identitas digitalmu sendiri melalui teknologi blockchain.",
            },
            {
                flashcard_question: "Apa itu Blockchain?",
                flashcard_answer: "Blockchain adalah buku catatan digital bersama yang tidak dikontrol oleh satu orang atau perusahaan. Setelah data ditulis, data tidak bisa diubah atau dihapus. Bayangkan seperti Google Spreadsheet yang bisa dilihat semua orang, tapi tidak ada yang bisa mengeditnya diam-diam.",
            },
            {
                flashcard_question: "Apa itu Wallet Digital?",
                flashcard_answer: "Wallet digital (seperti Coinbase Wallet atau MetaMask) adalah paspor kamu ke dunia Web3. Wallet menyimpan cryptocurrency-mu dan memungkinkan kamu berinteraksi dengan aplikasi blockchain — tanpa perlu rekening bank. Wallet punya alamat publik (seperti email) dan private key (seperti password yang tidak boleh dibagikan).",
            },
            {
                flashcard_question: "Apa itu Smart Contract?",
                flashcard_answer: "Smart contract adalah program yang berjalan di blockchain secara otomatis. Mereka menjalankan perjanjian tanpa perantara. Contohnya, smart contract bisa otomatis mengirimkan tiket konser begitu pembayaranmu dikonfirmasi — tanpa perlu Ticketmaster.",
            },
            {
                flashcard_question: "Mengapa Web3 Penting?",
                flashcard_answer: "Web3 mengembalikan kekuatan kepada pengguna. Kamu bisa memiliki seni digital (NFT), menghasilkan uang di game, pinjam-meminjam tanpa bank (DeFi), dan berpartisipasi di komunitas yang kamu ikut miliki (DAO). Ini adalah internet, tapi kamu pemiliknya — bukan produknya.",
            },
        ];

        const idCardIds = [];
        for (let i = 0; i < idCards.length; i++) {
            const cardId = await ctx.db.insert("cards", {
                lesson_id: idLessonId,
                card_number: i + 1,
                ...idCards[i],
                created_at: now,
            });
            idCardIds.push(cardId);
        }

        // ID Quizzes: 2 MC, 2 TF, 1 Fill-blank
        const idQuizzes = [
            // MC 1
            {
                card_id: idCardIds[0],
                quiz_type: "multiple_choice",
                question: "Apa perbedaan utama antara Web2 dan Web3?",
                options: [
                    { id: "A", text: "Web3 lebih cepat dari Web2" },
                    { id: "B", text: "Di Web3, pengguna memiliki data mereka sendiri, bukan perusahaan" },
                    { id: "C", text: "Web3 tidak menggunakan internet" },
                    { id: "D", text: "Web3 hanya untuk developer" },
                ],
                correct_answer: "B",
                created_at: now,
            },
            // MC 2
            {
                card_id: idCardIds[1],
                quiz_type: "multiple_choice",
                question: "Blockchain paling mirip dengan apa?",
                options: [
                    { id: "A", text: "Database pribadi milik perusahaan" },
                    { id: "B", text: "Buku catatan bersama yang tidak bisa diubah diam-diam" },
                    { id: "C", text: "Website biasa" },
                    { id: "D", text: "Layanan email" },
                ],
                correct_answer: "B",
                created_at: now,
            },
            // TF 1
            {
                card_id: idCardIds[2],
                quiz_type: "true_false",
                question: "Private key wallet digital sebaiknya dibagikan ke teman untuk keamanan.",
                correct_answer: "false",
                created_at: now,
            },
            // TF 2
            {
                card_id: idCardIds[3],
                quiz_type: "true_false",
                question: "Smart contract bisa berjalan secara otomatis tanpa perantara.",
                correct_answer: "true",
                created_at: now,
            },
            // Fill-blank
            {
                card_id: idCardIds[4],
                quiz_type: "fill_blank",
                question: "Di Web3, pengguna bisa memiliki seni digital melalui token bernama ___.",
                correct_answer: "NFT",
                acceptable_answers: ["NFTs", "nft", "nfts", "Non-Fungible Token"],
                hint: "Token tiga huruf yang mewakili kepemilikan digital unik",
                created_at: now,
            },
        ];

        for (const quiz of idQuizzes) {
            await ctx.db.insert("quizzes", quiz);
        }

        results.push({ language: "id", courseId: idCourseId, lessonId: idLessonId, cards: idCardIds.length, quizzes: idQuizzes.length });

        return {
            message: "Demo courses seeded successfully (EN + ID)",
            results,
        };
    },
});
