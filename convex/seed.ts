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

