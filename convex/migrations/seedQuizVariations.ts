import { internalMutation } from "../_generated/server";

/**
 * Seed Quiz Variations: Add True/False and Fill-in-the-Blank quizzes to existing lessons
 * 
 * This script:
 * 1. Finds lessons with only multiple_choice quizzes
 * 2. Converts some to true_false
 * 3. Converts some to fill_blank
 * 4. Ensures variety in each lesson
 */

// Sample true/false questions by topic
const trueFalseQuestions: Record<string, { question: string; answer: "true" | "false" }[]> = {
    blockchain: [
        { question: "Bitcoin was the first cryptocurrency ever created.", answer: "true" },
        { question: "Blockchain data can be easily modified or deleted.", answer: "false" },
        { question: "A blockchain is a centralized database controlled by one entity.", answer: "false" },
        { question: "Smart contracts execute automatically when conditions are met.", answer: "true" },
        { question: "All cryptocurrencies use the same blockchain.", answer: "false" },
    ],
    crypto: [
        { question: "Ethereum is primarily used for smart contracts and dApps.", answer: "true" },
        { question: "You need a bank account to own cryptocurrency.", answer: "false" },
        { question: "NFT stands for Non-Fungible Token.", answer: "true" },
        { question: "Private keys should be shared with exchanges for security.", answer: "false" },
        { question: "DeFi stands for Decentralized Finance.", answer: "true" },
    ],
    web3: [
        { question: "Web3 gives users more control over their data.", answer: "true" },
        { question: "DAOs are run by a single CEO or leader.", answer: "false" },
        { question: "Gas fees are needed to process transactions on Ethereum.", answer: "true" },
        { question: "A wallet address is the same as a private key.", answer: "false" },
        { question: "Staking allows you to earn rewards on your crypto.", answer: "true" },
    ],
};

// Sample fill-in-the-blank questions by topic
const fillBlankQuestions: Record<string, { question: string; answer: string; acceptable?: string[]; hint?: string }[]> = {
    blockchain: [
        { question: "A blockchain is a _____ ledger that records transactions.", answer: "distributed", acceptable: ["decentralized", "public"], hint: "Think about how the data is stored across many computers" },
        { question: "The process of verifying transactions is called _____.", answer: "mining", acceptable: ["validation", "consensus"], hint: "It involves solving complex mathematical puzzles" },
        { question: "Each block in a blockchain contains a _____ to the previous block.", answer: "hash", acceptable: ["link", "reference"], hint: "It's a cryptographic fingerprint" },
    ],
    crypto: [
        { question: "The smallest unit of Bitcoin is called a _____.", answer: "satoshi", acceptable: ["sat"], hint: "Named after Bitcoin's creator" },
        { question: "A _____ key is used to receive cryptocurrency.", answer: "public", hint: "This can be shared openly, like an email address" },
        { question: "Ethereum was proposed by _____ Buterin.", answer: "Vitalik", acceptable: ["vitalik", "Vitali"], hint: "First name of Ethereum's co-founder" },
    ],
    web3: [
        { question: "DAO stands for Decentralized _____ Organization.", answer: "Autonomous", acceptable: ["autonomous"], hint: "Means self-governing" },
        { question: "NFTs are stored on the _____ permanently.", answer: "blockchain", acceptable: ["chain"], hint: "The same technology that powers cryptocurrency" },
        { question: "_____ contracts automatically execute when conditions are met.", answer: "Smart", acceptable: ["smart"], hint: "They run on blockchain without human intervention" },
    ],
};

// Add quiz variations to a lesson
export const addVariationsToLesson = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Get all lessons
        const lessons = await ctx.db.query("lessons").collect();
        let modified = 0;

        for (const lesson of lessons) {
            // Get all cards for this lesson
            const cards = await ctx.db
                .query("cards")
                .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                .collect();

            // Get existing quizzes for these cards
            const quizzes = await Promise.all(
                cards.map(async (card) => {
                    const quiz = await ctx.db
                        .query("quizzes")
                        .withIndex("by_card", (q) => q.eq("card_id", card._id))
                        .first();
                    return { card, quiz };
                })
            );

            // Check quiz type distribution
            const quizTypes = quizzes.filter(q => q.quiz).map(q => q.quiz!.quiz_type);
            const hasTrueFalse = quizTypes.includes("true_false");
            const hasFillBlank = quizTypes.includes("fill_blank");

            // If already has variety, skip
            if (hasTrueFalse && hasFillBlank) continue;

            // Pick a category based on lesson title
            const title = lesson.title.toLowerCase();
            let category = "blockchain";
            if (title.includes("crypto") || title.includes("coin") || title.includes("ethereum")) {
                category = "crypto";
            } else if (title.includes("web3") || title.includes("dao") || title.includes("nft")) {
                category = "web3";
            }

            // Add true/false quiz if missing
            if (!hasTrueFalse && quizzes.length >= 2) {
                const mcQuizzes = quizzes.filter(q => q.quiz?.quiz_type === "multiple_choice");
                if (mcQuizzes.length > 0) {
                    const target = mcQuizzes[0];
                    const tfQuestion = trueFalseQuestions[category]?.[modified % trueFalseQuestions[category].length];
                    if (tfQuestion && target.quiz) {
                        await ctx.db.patch(target.quiz._id, {
                            quiz_type: "true_false",
                            question: tfQuestion.question,
                            correct_answer: tfQuestion.answer,
                            options: undefined, // Remove options for T/F
                        });
                        modified++;
                    }
                }
            }

            // Add fill-blank quiz if missing
            if (!hasFillBlank && quizzes.length >= 3) {
                const mcQuizzes = quizzes.filter(q => q.quiz?.quiz_type === "multiple_choice");
                if (mcQuizzes.length > 1) {
                    const target = mcQuizzes[1];
                    const fbQuestion = fillBlankQuestions[category]?.[modified % fillBlankQuestions[category].length];
                    if (fbQuestion && target.quiz) {
                        await ctx.db.patch(target.quiz._id, {
                            quiz_type: "fill_blank",
                            question: fbQuestion.question,
                            correct_answer: fbQuestion.answer,
                            acceptable_answers: fbQuestion.acceptable,
                            hint: fbQuestion.hint,
                            options: undefined, // Remove options for fill-blank
                        });
                        modified++;
                    }
                }
            }
        }

        return { lessonsProcessed: lessons.length, quizzesModified: modified };
    },
});

// Verify quiz distribution across all lessons
export const verifyDistribution = internalMutation({
    args: {},
    handler: async (ctx) => {
        const lessons = await ctx.db.query("lessons").collect();
        const results: Array<{
            lessonId: string;
            lessonTitle: string;
            totalCards: number;
            distribution: { multiple_choice: number; true_false: number; fill_blank: number };
        }> = [];

        for (const lesson of lessons) {
            const cards = await ctx.db
                .query("cards")
                .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                .collect();

            const distribution = { multiple_choice: 0, true_false: 0, fill_blank: 0 };

            for (const card of cards) {
                const quiz = await ctx.db
                    .query("quizzes")
                    .withIndex("by_card", (q) => q.eq("card_id", card._id))
                    .first();
                if (quiz) {
                    const type = quiz.quiz_type as keyof typeof distribution;
                    if (type in distribution) {
                        distribution[type]++;
                    }
                }
            }

            results.push({
                lessonId: lesson._id,
                lessonTitle: lesson.title,
                totalCards: cards.length,
                distribution,
            });
        }

        return results;
    },
});
