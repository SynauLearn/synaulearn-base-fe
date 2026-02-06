/**
 * Supabase to Convex Migration Script
 * 
 * This script imports data from Supabase SQL dumps into Convex production.
 * 
 * Run with: npx convex run migrations/seedFromSupabase:runMigration --prod
 */

import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

// ============== SEED DATA ==============
// Data imported from sql_dump/convex_seed/*.json

const categoriesData = [
    { name: "Introduction to Web3 & Blockchain", name_id: "Pengenalan Web3 & Blockchain", description: "Learn the fundamentals of Web3, blockchain technology, and decentralized applications", description_id: "Pelajari dasar-dasar Web3, teknologi blockchain, dan aplikasi terdesentralisasi", emoji: "🌐", slug: "intro-web3-blockchain", order_index: 1, _temp_id: "1aaf219c-411c-4ee0-a497-8e866b0cd8f4" },
    { name: "Base Blockchain", name_id: "Blockchain Base", description: "Learn about Base - Coinbase Layer-2 blockchain built on Ethereum", description_id: "Pelajari Base - blockchain Layer-2 Coinbase yang dibangun di atas Ethereum", emoji: "⛓️", slug: "base-blockchain", order_index: 10, _temp_id: "4827012b-30a8-406d-81b6-6d052cdabb8b" },
    { name: "Security & Cryptography", name_id: "Keamanan & Kriptografi", description: "Learn blockchain security, cryptography, and best practices for safe development", description_id: "Pelajari keamanan blockchain, kriptografi, dan praktik terbaik untuk pengembangan yang aman", emoji: "🔐", slug: "security-cryptography", order_index: 5, _temp_id: "548e7c97-8f28-47d8-83bd-1cd712c87686" },
    { name: "DeFi & Smart Contracts", name_id: "DeFi & Smart Contract", description: "Explore decentralized finance protocols and smart contract development", description_id: "Jelajahi protokol keuangan terdesentralisasi dan pengembangan smart contract", emoji: "💰", slug: "defi-smart-contracts", order_index: 3, _temp_id: "5cb752e7-2697-4f6b-88d4-8f36011c5837" },
    { name: "Web3 Development", name_id: "Pengembangan Web3", description: "Master Web3 development from basics to building full-stack decentralized applications", description_id: "Kuasai pengembangan Web3 dari dasar hingga membangun aplikasi terdesentralisasi full-stack", emoji: "🌐", slug: "web3-development", order_index: 2, _temp_id: "701acacd-c930-4826-8a61-0c4f810d7a52" },
    { name: "NFT & Digital Assets", name_id: "NFT & Aset Digital", description: "Understand NFTs, digital ownership, and building NFT applications", description_id: "Pahami NFT, kepemilikan digital, dan membangun aplikasi NFT", emoji: "🎨", slug: "nft-digital-assets", order_index: 4, _temp_id: "c48c5e31-3158-4387-bb3c-c14d5a418315" },
    { name: "Blockchain Fundamental", name_id: "Dasar-Dasar Blockchain", description: "Learn the core concepts of blockchain technology, from basic principles to advanced architecture", description_id: "Pelajari konsep inti teknologi blockchain, dari prinsip dasar hingga arsitektur lanjutan", emoji: "🔗", slug: "blockchain-fundamentals", order_index: 1, _temp_id: "fd86fecb-2483-4e92-a0f3-4a178d3b25a7" },
];

// Course to Category mapping (from original SQL)
const courseCategoryMap: Record<string, string> = {
    "175fea19-9406-451d-a023-3f494be83b50": "1aaf219c-411c-4ee0-a497-8e866b0cd8f4", // Wallet Safety -> Intro Web3
    "283c52db-bf78-42b3-b178-eb3a3b50280e": "4827012b-30a8-406d-81b6-6d052cdabb8b", // Intro to Base -> Base Blockchain
    "2d637ba2-db08-4fb1-bd06-2516aecac8ff": "5cb752e7-2697-4f6b-88d4-8f36011c5837", // DeFi & Smart Contract -> DeFi
    "3c157441-888a-47af-ba98-8c691723c8b8": "4827012b-30a8-406d-81b6-6d052cdabb8b", // Konsep Lanjutan Base -> Base
    "4c7923da-5685-4b73-90af-69e24c2be260": "1aaf219c-411c-4ee0-a497-8e866b0cd8f4", // DeFi NFT Identity -> Intro Web3
    "7f9b298d-91ad-4d68-960f-9a2d3cf15373": "1aaf219c-411c-4ee0-a497-8e866b0cd8f4", // Intro Web3 Blockchain -> Intro Web3
    "8da85464-08f3-4708-bb47-451401fe8637": "fd86fecb-2483-4e92-a0f3-4a178d3b25a7", // Pengenalan Blockchain -> Blockchain Fund
    "9bea6cc1-8a0f-4aad-9d10-2984bf70368f": "5cb752e7-2697-4f6b-88d4-8f36011c5837", // Smart Contract Fund -> DeFi
    "be09f25c-3d2f-4485-a4e5-175c26c95c93": "fd86fecb-2483-4e92-a0f3-4a178d3b25a7", // Blockchain Basics -> Blockchain Fund
    "c641e339-dfa6-491e-bc96-5f5c8c27fddb": "4827012b-30a8-406d-81b6-6d052cdabb8b", // Ekosistem Base -> Base
    "e56e9279-aa5e-4657-9501-5aa1253b62d6": "5cb752e7-2697-4f6b-88d4-8f36011c5837", // Arsitektur -> DeFi
    "edcc44f4-02b6-476c-8768-51f165ca37c6": "", // Welcome to Web3 -> no category
};

const coursesData = [
    { title: "Wallet, Safety, & Best Practices", description: "Pelajari cara menggunakan wallet Web3, melindungi private key dan seed phrase, serta mencegah wallet drain dan scam. Keamanan adalah prioritas utama!", emoji: "🟩", total_lessons: 1, created_at: 1761279487259, language: "id", difficulty: "Advanced", _temp_id: "175fea19-9406-451d-a023-3f494be83b50" },
    { title: "Introduction to Base", description: "Pelajari dasar-dasar Base dan teknologi Layer-2. Pahami visi \"Base for Everyone\" dan mengapa Base penting dalam ekosistem blockchain.", emoji: "🔵", total_lessons: 1, created_at: 1761278336837, language: "id", difficulty: "Basic", _temp_id: "283c52db-bf78-42b3-b178-eb3a3b50280e" },
    { title: "DeFi dan Smart Contract", description: "Menguasai konsep Decentralized Finance dan pemrograman smart contract untuk aplikasi Web3", emoji: "💰", total_lessons: 3, created_at: 1761260414515, language: "id", difficulty: "Advanced", _temp_id: "2d637ba2-db08-4fb1-bd06-2516aecac8ff" },
    { title: "Konsep Lanjutan tentang Base", description: "Pahami arsitektur teknis Base: Optimistic Rollup, Sequencer, OP Stack, dan konsep Superchain. Level profesional untuk developer.", emoji: "🏗️", total_lessons: 1, created_at: 1761278336837, language: "id", difficulty: "Professional", _temp_id: "3c157441-888a-47af-ba98-8c691723c8b8" },
    { title: "DeFi, NFT, & Onchain Identity", description: "Pahami DeFi (keuangan terdesentralisasi), NFT, dan onchain identity. Pelajari cara berinteraksi dengan dApps secara aman dan membangun reputasi digital.", emoji: "🟥", total_lessons: 1, created_at: 1761279487259, language: "id", difficulty: "Professional", _temp_id: "4c7923da-5685-4b73-90af-69e24c2be260" },
    { title: "Introduction to Web3 & Blockchain", description: "Pelajari evolusi internet dari Web1 ke Web3, teknologi blockchain, dan aplikasi terdesentralisasi (dApps). Pahami mengapa Web3 penting untuk masa depan.", emoji: "🟦", total_lessons: 1, created_at: 1761279487259, language: "id", difficulty: "Basic", _temp_id: "7f9b298d-91ad-4d68-960f-9a2d3cf15373" },
    { title: "Pengenalan Blockchain", description: "Pelajari dasar-dasar teknologi blockchain dari awal dengan cara yang mudah dipahami", emoji: "📚", total_lessons: 3, created_at: 1761260410048, language: "id", difficulty: "Basic", _temp_id: "8da85464-08f3-4708-bb47-451401fe8637" },
    { title: "Smart Contract Fundamentals", description: "Discover what smart contracts are and how they automate agreements on the blockchain.", emoji: "📜", total_lessons: 1, created_at: 1760492096191, language: "en", difficulty: "Basic", _temp_id: "9bea6cc1-8a0f-4aad-9d10-2984bf70368f" },
    { title: "Blockchain Basics", description: "Learn the fundamental concepts of blockchain technology, the foundation of Web3.", emoji: "🔗", total_lessons: 1, created_at: 1760492096191, language: "en", difficulty: "Basic", _temp_id: "be09f25c-3d2f-4485-a4e5-175c26c95c93" },
    { title: "Ekosistem & Base Tools", description: "Pelajari cara menggunakan wallet, Base Bridge, dan berinteraksi dengan ekosistem Base. Pahami keamanan dan best practices.", emoji: "🛠️", total_lessons: 1, created_at: 1761278336837, language: "id", difficulty: "Advanced", _temp_id: "c641e339-dfa6-491e-bc96-5f5c8c27fddb" },
    { title: "Arsitektur Blockchain Profesional", description: "Merancang dan membangun aplikasi blockchain enterprise-grade dengan arsitektur yang scalable dan secure", emoji: "🏗️", total_lessons: 3, created_at: 1761260418113, language: "id", difficulty: "Professional", _temp_id: "e56e9279-aa5e-4657-9501-5aa1253b62d6" },
    { title: "Welcome to Web3", description: "Explore the core components of the decentralized internet, from dApps to DAOs.", emoji: "🌐", total_lessons: 1, created_at: 1760492096191, language: "en", difficulty: "Basic", _temp_id: "edcc44f4-02b6-476c-8768-51f165ca37c6" },
];

// Lesson to Course mapping (course _temp_id)
const lessonCourseMap: Record<string, string> = {
    "02e28cfe-fd34-4fbd-a186-0770d521a5f0": "c641e339-dfa6-491e-bc96-5f5c8c27fddb",
    "1372b7a3-4379-4f90-b434-f455f842fd11": "e56e9279-aa5e-4657-9501-5aa1253b62d6",
    "251efc60-54b0-49d9-9f24-54ce6f971161": "8da85464-08f3-4708-bb47-451401fe8637",
    "2be18f56-a203-4782-bbac-573a2852498c": "e56e9279-aa5e-4657-9501-5aa1253b62d6",
    "43acb0bd-472b-4dc0-8f4d-8874946188ed": "3c157441-888a-47af-ba98-8c691723c8b8",
    "4aaa0c8a-1344-44eb-aa80-02fe8b4ef22d": "be09f25c-3d2f-4485-a4e5-175c26c95c93",
    "4f3a7018-38bf-4728-8357-7551d6fe6d27": "8da85464-08f3-4708-bb47-451401fe8637",
    "7a0e798b-9f96-4354-97c5-d3a94d9b998b": "8da85464-08f3-4708-bb47-451401fe8637",
    "809c9f2d-5b7e-420a-a17f-01ac115b87e9": "9bea6cc1-8a0f-4aad-9d10-2984bf70368f",
    "8e23b6f5-72bc-4e03-982c-66a4a5fa2ae5": "2d637ba2-db08-4fb1-bd06-2516aecac8ff",
    "a2a5764c-8fce-42ec-b94e-34cea65f794f": "2d637ba2-db08-4fb1-bd06-2516aecac8ff",
    "b10f6654-6f11-4d73-a6d2-450f1a34106f": "edcc44f4-02b6-476c-8768-51f165ca37c6",
    "b7dd856d-c51d-4990-812c-cbdec3aa6b77": "175fea19-9406-451d-a023-3f494be83b50",
    "c2039bd4-3a7b-4618-ae66-3ba1fc4ce7ec": "4c7923da-5685-4b73-90af-69e24c2be260",
    "d36ae781-772e-4992-bb8e-9158c7d59d91": "7f9b298d-91ad-4d68-960f-9a2d3cf15373",
    "d6dae4da-fbd7-4131-ae16-55d961507d58": "283c52db-bf78-42b3-b178-eb3a3b50280e",
    "e652f2b3-9427-4a2c-8d55-2b8f26a44bce": "2d637ba2-db08-4fb1-bd06-2516aecac8ff",
    "fb9136eb-d3c3-4168-bee4-d34b88afca72": "e56e9279-aa5e-4657-9501-5aa1253b62d6",
};

const lessonsData = [
    { title: "Ekosistem & Base Tools", lesson_number: 1, created_at: 1761278336837, _temp_id: "02e28cfe-fd34-4fbd-a186-0770d521a5f0" },
    { title: "Layer 2 Solutions", lesson_number: 1, created_at: 1761260418414, _temp_id: "1372b7a3-4379-4f90-b434-f455f842fd11" },
    { title: "Apa itu Blockchain?", lesson_number: 1, created_at: 1761260410373, _temp_id: "251efc60-54b0-49d9-9f24-54ce6f971161" },
    { title: "Advanced DApp Architecture", lesson_number: 3, created_at: 1761260420808, _temp_id: "2be18f56-a203-4782-bbac-573a2852498c" },
    { title: "Konsep Lanjutan tentang Base", lesson_number: 1, created_at: 1761278336837, _temp_id: "43acb0bd-472b-4dc0-8f4d-8874946188ed" },
    { title: "The Core Concepts", lesson_number: 1, created_at: 1760492096191, _temp_id: "4aaa0c8a-1344-44eb-aa80-02fe8b4ef22d" },
    { title: "Cryptocurrency Dasar", lesson_number: 3, created_at: 1761260413626, _temp_id: "4f3a7018-38bf-4728-8357-7551d6fe6d27" },
    { title: "Cara Kerja Blockchain", lesson_number: 2, created_at: 1761260412433, _temp_id: "7a0e798b-9f96-4354-97c5-d3a94d9b998b" },
    { title: "Introduction to Smart Contracts", lesson_number: 1, created_at: 1760492096191, _temp_id: "809c9f2d-5b7e-420a-a17f-01ac115b87e9" },
    { title: "DEX dan AMM", lesson_number: 3, created_at: 1761260417200, _temp_id: "8e23b6f5-72bc-4e03-982c-66a4a5fa2ae5" },
    { title: "Pengenalan DeFi", lesson_number: 1, created_at: 1761260414811, _temp_id: "a2a5764c-8fce-42ec-b94e-34cea65f794f" },
    { title: "Exploring the Web3 Ecosystem", lesson_number: 1, created_at: 1760492096191, _temp_id: "b10f6654-6f11-4d73-a6d2-450f1a34106f" },
    { title: "Wallet, Safety, & Best Practices", lesson_number: 1, created_at: 1761279487259, _temp_id: "b7dd856d-c51d-4990-812c-cbdec3aa6b77" },
    { title: "DeFi, NFT, & Onchain Identity", lesson_number: 1, created_at: 1761279487259, _temp_id: "c2039bd4-3a7b-4618-ae66-3ba1fc4ce7ec" },
    { title: "Introduction to Web3 & Blockchain", lesson_number: 1, created_at: 1761279487259, _temp_id: "d36ae781-772e-4992-bb8e-9158c7d59d91" },
    { title: "Introduction to Base", lesson_number: 1, created_at: 1761278336837, _temp_id: "d6dae4da-fbd7-4131-ae16-55d961507d58" },
    { title: "Smart Contract Fundamental", lesson_number: 2, created_at: 1761260416013, _temp_id: "e652f2b3-9427-4a2c-8d55-2b8f26a44bce" },
    { title: "Security Best Practices", lesson_number: 2, created_at: 1761260419619, _temp_id: "fb9136eb-d3c3-4168-bee4-d34b88afca72" },
];

const usersData = [
    { fid: 1378079, username: "crackhouse-vet", display_name: "crackhouse-veteran", total_xp: 0, created_at: 1763772207440, _temp_id: "019ef9da-a84b-44f7-af58-c03bdabdab6d" },
    { fid: 877622, username: "dglabs", display_name: "Arjen", total_xp: 0, created_at: 1763823124990, _temp_id: "04487f91-7b12-42fd-8d80-1e345b3d3d6d" },
    { fid: 243134, username: "rend", display_name: "rend", total_xp: 0, created_at: 1763771166281, _temp_id: "0625256a-333d-4c92-87b4-1be122319dbc" },
    { fid: 1063045, username: "haped.base.eth", display_name: "Hapeed", total_xp: 0, created_at: 1764744818254, _temp_id: "0cef8e95-05e0-4d5f-9a79-88a9df7ba733" },
    { fid: 1374637, username: "humanresources", display_name: "Linda Miller-Walker", total_xp: 0, created_at: 1763529658855, _temp_id: "0f19b426-c32d-4a11-aa5a-0b41a848b194" },
    { fid: 466462, username: "asmbyk", display_name: "Base Soldiers", total_xp: 0, created_at: 1764964070039, _temp_id: "148b9fd1-32b9-4032-bc25-e66354616eea" },
    { fid: 1120651, username: "eloyyael", display_name: "Eloy Yael", total_xp: 0, created_at: 1763585436453, _temp_id: "1dee894b-521c-45cb-824e-090ee144d1fa" },
    { fid: 1441777, username: "coldczn", display_name: "Roman", total_xp: 0, created_at: 1763771065957, _temp_id: "244579dd-d52f-47fa-b05a-941cdf77ec06" },
    { fid: 1166266, username: "toastysheepnuts", display_name: "ToastySheepNuts", total_xp: 15, created_at: 1763771869634, _temp_id: "274d119f-ca40-469c-a9d7-f76de5e85929" },
    { fid: 1385892, username: "killer2bie", display_name: undefined, total_xp: 525, created_at: 1760577433256, _temp_id: "2c11ec1a-e03b-4079-9c80-428a596d931e" },
    { fid: 1318586, username: "danustef", display_name: "Danu", total_xp: 0, created_at: 1763376950485, _temp_id: "2f1b7803-1bf8-4bfd-8e27-4effa041bebd" },
    { fid: 1388932, username: "yeheskieltame", display_name: "yeheskieltame.base.eth", total_xp: 15, created_at: 1761378327309, _temp_id: "3a58f101-5555-4ad0-be18-528618bea904" },
    { fid: 1112523, username: "angelinevivian", display_name: "avivian.base.eth", total_xp: 0, created_at: 1763487695671, _temp_id: "3a97bf9c-a282-4621-933f-61b0e2e467a6" },
    { fid: 286681, username: "goblok", display_name: "lau", total_xp: 0, created_at: 1763886267297, _temp_id: "3f3de775-4b7f-4d87-ad41-64a9dccc4312" },
    { fid: 286007, username: "adoniscyril", display_name: "Adonis Cyril", total_xp: 0, created_at: 1763501814388, _temp_id: "436ea38f-b166-45b8-a8b4-3e4f2dfc82d5" },
    { fid: 1302629, username: "anggasaputra10", display_name: "Violet Evergarden", total_xp: 30, created_at: 1763771566380, _temp_id: "460b4ba2-82e6-42b9-bb7d-a12faa336163" },
    { fid: 1397118, username: "blueneon", display_name: "blueneon", total_xp: 0, created_at: 1761180017222, _temp_id: "47096ca9-7f19-4e57-84c9-520d911ba295" },
    { fid: 267182, username: "isallkun", display_name: "Isallkun", total_xp: 0, created_at: 1764744817266, _temp_id: "47424c76-6809-4328-84b0-837daf02cac2" },
    { fid: 293759, username: "clmns", display_name: "Clemens", total_xp: 0, created_at: 1762413619104, _temp_id: "4fe7982b-9487-4a69-8d99-b4d0aad80291" },
    { fid: 1356108, username: "exoticnacho", display_name: "exoticnacho", total_xp: 0, created_at: 1763761497179, _temp_id: "50e8ef60-5570-411f-b066-36d3ea6ef1af" },
    { fid: 1356146, username: "killerbie", display_name: "killerbie", total_xp: 680, created_at: 1760639808155, _temp_id: "539b859f-504b-45ab-a479-894cae9884c3" },
    { fid: 1396964, username: "akbarwijaya", display_name: "akbarwijaya", total_xp: 135, created_at: 1765332986688, _temp_id: "552f1f60-c005-490b-bea9-3fd0b0b3d1d3" },
    { fid: 934625, username: "ezpzmz", display_name: "EzPzMz", total_xp: 0, created_at: 1763771295324, _temp_id: "57f3c21e-930a-4e39-b3f3-11e099cb3813" },
    { fid: 1367587, username: "madgenius", display_name: "0xmadgenius.base.eth", total_xp: 0, created_at: 1764999806201, _temp_id: "580d546a-1c28-4402-ac84-38ad4da03525" },
    { fid: 336830, username: "linolino", display_name: "Lino", total_xp: 0, created_at: 1763486734193, _temp_id: "5e394090-066c-4809-bea1-d816619d6edf" },
    { fid: 977990, username: "0xinggih", display_name: "singsing.base.eth", total_xp: 0, created_at: 1761343893567, _temp_id: "63533872-c1fe-41ac-95ef-deb2c6f4479b" },
    { fid: 1050463, username: "beatless", display_name: "user729184723", total_xp: 30, created_at: 1761350717825, _temp_id: "63ef7dde-4ed6-4145-90b6-678cb7014ccf" },
    { fid: 1393856, username: "imamzlkfli", display_name: "Imam Zulkifli", total_xp: 0, created_at: 1764126466390, _temp_id: "6662a3ce-4a21-4ad0-8848-f8dc93a39c2f" },
    { fid: 1062508, username: "zerodev", display_name: "Zer{} (Ø,G) base.eth", total_xp: 0, created_at: 1762377148351, _temp_id: "6ba6683d-4d53-4e9f-a86e-b340dbf86fbf" },
    { fid: 1365796, username: "hazelthedevil", display_name: "hazelthedevil", total_xp: 0, created_at: 1760684779459, _temp_id: "828831a9-7426-4bd9-93f6-d2402e0ec656" },
    { fid: 1099491, username: "bollerjee", display_name: "Boller jee", total_xp: 0, created_at: 1763476751446, _temp_id: "84104752-4504-431d-a1a0-0c82813d7c15" },
    { fid: 17318, username: "patty", display_name: "pat hughes", total_xp: 15, created_at: 1762261611829, _temp_id: "96a23553-4ad4-48c5-89dc-5a6fa6ff6115" },
    { fid: 448276, username: "jetsons", display_name: "Jetsons Lifestyle", total_xp: 0, created_at: 1763789424461, _temp_id: "97384dc8-5f66-4af1-824a-e28486f66713" },
    { fid: 944120, username: "daxsz", display_name: "daxszb", total_xp: 0, created_at: 1763771128737, _temp_id: "97aa2c54-cdb3-4d5f-8d86-e8b8fb297488" },
    { fid: 235407, username: "kodali", display_name: "Rama", total_xp: 0, created_at: 1763784169580, _temp_id: "981ca1cd-2f76-4950-8c47-27acde7f1a07" },
    { fid: 193844, username: "evslatts", display_name: "slatts.base.eth", total_xp: 75, created_at: 1761822808203, _temp_id: "9d098de0-ce88-4ab1-ae55-4857d0d9565b" },
    { fid: 1376153, username: "miawzyiest", display_name: "miawzyiest", total_xp: 0, created_at: 1761811068708, _temp_id: "a04c3c41-5071-449b-b899-3e776a623d36" },
    { fid: 1469641, username: "rudeus33", display_name: "rudeus33", total_xp: 0, created_at: 1763416601495, _temp_id: "a6cd6970-599d-4392-a309-1dcbf39f9b81" },
    { fid: 1177193, username: "bapet", display_name: "Bapet", total_xp: 30, created_at: 1765080947219, _temp_id: "b6fde0ef-10b3-42c0-85fa-4dfe9b661734" },
    { fid: 1556089, username: "cnuralim", display_name: "cnuralim", total_xp: 30, created_at: 1764804060088, _temp_id: "c5c9ec02-1925-4533-a90a-7be948d63cfc" },
    { fid: 1083697, username: "dii-gen", display_name: "Dii_Gen", total_xp: 0, created_at: 1763478288690, _temp_id: "c5ece57f-d1ef-44b4-9065-cd300714f5b1" },
    { fid: 304242, username: "metajitt", display_name: "metajitt", total_xp: 5, created_at: 1763811473867, _temp_id: "cbd8de5c-9d5f-4777-a3b3-a197afecb933" },
    { fid: 1049136, username: "hzbase", display_name: "HzBase", total_xp: 0, created_at: 1764966000467, _temp_id: "cbeb6452-66a2-419b-81c3-6bd0f98a228c" },
    { fid: 12345, username: "testuser", display_name: "Test User", total_xp: 0, created_at: 1760934080094, _temp_id: "ce6fae98-031a-4ab5-bfa6-24bf79000fc3" },
    { fid: 1060402, username: "iamleleo", display_name: "leleo", total_xp: 0, created_at: 1763530269773, _temp_id: "ce9c2330-519b-46a8-a5be-97ecd648844a" },
    { fid: 1356101, username: "ndruw.base.eth", display_name: "drew", total_xp: 0, created_at: 1763377019729, _temp_id: "ceb3498d-2b85-4fe0-bbf4-a4e14f7551eb" },
    { fid: 4914, username: "kunalvg", display_name: "Kunal", total_xp: 0, created_at: 1763519469412, _temp_id: "d885de0b-a13f-4227-b516-4766bbb0f75d" },
    { fid: 1144921, username: "jackmeyn", display_name: "jsysid", total_xp: 0, created_at: 1763788589921, _temp_id: "eda408e6-37e7-412e-8314-42ff7960db7f" },
];

// ============== MIGRATION MUTATIONS ==============

export const seedCategories = internalMutation({
    handler: async (ctx) => {
        const mapping: Record<string, Id<"categories">> = {};

        for (const cat of categoriesData) {
            const { _temp_id, ...data } = cat;
            const id = await ctx.db.insert("categories", data);
            mapping[_temp_id] = id;
            console.log(`✅ Category: ${data.name} -> ${id}`);
        }

        return mapping;
    },
});

export const seedCourses = internalMutation({
    handler: async (ctx) => {
        // First get category mappings
        const categories = await ctx.db.query("categories").collect();
        const catNameToId: Record<string, Id<"categories">> = {};

        // Build mapping from old UUID to new Convex ID
        for (const cat of categoriesData) {
            const found = categories.find(c => c.slug === cat.slug);
            if (found) {
                catNameToId[cat._temp_id] = found._id;
            }
        }

        const mapping: Record<string, Id<"courses">> = {};

        for (const course of coursesData) {
            const { _temp_id, ...data } = course;
            const categoryUuid = courseCategoryMap[_temp_id];
            const category_id = categoryUuid ? catNameToId[categoryUuid] : undefined;

            const id = await ctx.db.insert("courses", {
                ...data,
                category_id,
            });
            mapping[_temp_id] = id;
            console.log(`✅ Course: ${data.title} -> ${id}`);
        }

        return mapping;
    },
});

export const seedLessons = internalMutation({
    handler: async (ctx) => {
        // Get courses to build mapping
        const courses = await ctx.db.query("courses").collect();
        const courseMapping: Record<string, Id<"courses">> = {};

        // Map course temp_id to Convex ID based on title
        for (const course of coursesData) {
            const found = courses.find(c => c.title === course.title);
            if (found) {
                courseMapping[course._temp_id] = found._id;
            }
        }

        const mapping: Record<string, Id<"lessons">> = {};

        for (const lesson of lessonsData) {
            const { _temp_id, ...data } = lesson;
            const courseUuid = lessonCourseMap[_temp_id];
            const course_id = courseMapping[courseUuid];

            if (!course_id) {
                console.log(`⚠️ Lesson skipped (no course): ${data.title}`);
                continue;
            }

            const id = await ctx.db.insert("lessons", {
                ...data,
                course_id,
            });
            mapping[_temp_id] = id;
            console.log(`✅ Lesson: ${data.title} -> ${id}`);
        }

        return mapping;
    },
});

export const seedUsers = internalMutation({
    handler: async (ctx) => {
        const mapping: Record<string, Id<"users">> = {};
        const now = Date.now();

        for (const user of usersData) {
            const { _temp_id, ...data } = user;

            // Check if user already exists by fid
            const existing = await ctx.db
                .query("users")
                .withIndex("by_fid", (q) => q.eq("fid", data.fid))
                .first();

            if (existing) {
                mapping[_temp_id] = existing._id;
                console.log(`⏭️ User exists: ${data.username} (fid: ${data.fid})`);
                continue;
            }

            const id = await ctx.db.insert("users", {
                fid: data.fid,
                username: data.username,
                display_name: data.display_name,
                total_xp: data.total_xp,
                created_at: data.created_at,
                updated_at: now,
            });
            mapping[_temp_id] = id;
            console.log(`✅ User: ${data.username} (fid: ${data.fid}) -> ${id}`);
        }

        return mapping;
    },
});

// ============== MAIN MIGRATION ACTION ==============

export const runMigration = internalAction({
    handler: async (ctx) => {
        console.log("🚀 Starting Supabase to Convex Migration...\n");

        // Step 1: Seed Categories
        console.log("📦 Step 1/4: Seeding Categories...");
        await ctx.runMutation(internal.migrations.seedFromSupabase.seedCategories);
        console.log("");

        // Step 2: Seed Courses
        console.log("📚 Step 2/4: Seeding Courses...");
        await ctx.runMutation(internal.migrations.seedFromSupabase.seedCourses);
        console.log("");

        // Step 3: Seed Lessons
        console.log("📖 Step 3/4: Seeding Lessons...");
        await ctx.runMutation(internal.migrations.seedFromSupabase.seedLessons);
        console.log("");

        // Step 4: Seed Users
        console.log("👤 Step 4/4: Seeding Users...");
        await ctx.runMutation(internal.migrations.seedFromSupabase.seedUsers);
        console.log("");

        console.log("✅ Migration Complete!");
        console.log(`
Summary:
- Categories: ${categoriesData.length}
- Courses: ${coursesData.length}
- Lessons: ${lessonsData.length}
- Users: ${usersData.length}

Note: Cards and user_card_progress need separate migration due to size.
Run: npx convex run migrations/seedFromSupabase:seedCardsFromFile --prod
    `);

        return { success: true };
    },
});
