import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

/**
 * Migration: Copy quiz data from cards table to new quizzes table
 * 
 * This migration:
 * 1. Reads all cards that have quiz data
 * 2. Creates corresponding entries in quizzes table with quiz_type: 'multiple_choice'
 * 3. Preserves card_id relationship
 * 4. Does NOT delete old fields (for rollback safety)
 */

// Get cards that have quiz data but no corresponding quiz in quizzes table
export const getCardsNeedingMigration = internalQuery({
    args: {
        batchSize: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const batchSize = args.batchSize ?? 100;

        // Get all cards with quiz_question (means they have quiz data)
        const cards = await ctx.db
            .query("cards")
            .collect();

        // Filter cards that have quiz data
        const cardsWithQuiz = cards.filter(card => card.quiz_question);

        // For each card, check if quiz already exists
        const cardsNeedingMigration = [];
        for (const card of cardsWithQuiz) {
            const existingQuiz = await ctx.db
                .query("quizzes")
                .withIndex("by_card", (q) => q.eq("card_id", card._id))
                .first();

            if (!existingQuiz) {
                cardsNeedingMigration.push(card);
            }
        }

        return {
            cards: cardsNeedingMigration.slice(0, batchSize),
            total: cardsNeedingMigration.length,
            hasMore: cardsNeedingMigration.length > batchSize,
        };
    },
});

// Migrate a batch of cards to quizzes table
export const migrateCardBatch = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Get cards needing migration
        const result = await ctx.runQuery(
            // @ts-expect-error - internal function
            "migrations/migrateQuizzes:getCardsNeedingMigration",
            { batchSize: 50 }
        );

        if (result.cards.length === 0) {
            return {
                migrated: 0,
                remaining: 0,
                done: true,
            };
        }

        let migrated = 0;
        for (const card of result.cards) {
            // Create quiz entry
            await ctx.db.insert("quizzes", {
                card_id: card._id,
                quiz_type: "multiple_choice",
                question: card.quiz_question!,
                options: [
                    { id: "A", text: card.quiz_option_a || "" },
                    { id: "B", text: card.quiz_option_b || "" },
                    { id: "C", text: card.quiz_option_c || "" },
                    { id: "D", text: card.quiz_option_d || "" },
                ],
                correct_answer: card.quiz_correct_answer || "A",
                created_at: Date.now(),
            });
            migrated++;
        }

        return {
            migrated,
            remaining: result.total - migrated,
            done: result.total <= migrated,
        };
    },
});

// Run full migration (call this repeatedly until done)
export const runMigration = internalMutation({
    args: {},
    handler: async (ctx) => {
        let totalMigrated = 0;
        let iterations = 0;
        const maxIterations = 20; // Safety limit

        while (iterations < maxIterations) {
            const result = await ctx.runMutation(
                // @ts-expect-error - internal function
                "migrations/migrateQuizzes:migrateCardBatch",
                {}
            );

            totalMigrated += result.migrated;
            iterations++;

            if (result.done) {
                break;
            }
        }

        return {
            totalMigrated,
            iterations,
            complete: iterations < maxIterations,
        };
    },
});

// Validate migration - check all cards with quizzes have corresponding entries
export const validateMigration = internalQuery({
    args: {},
    handler: async (ctx) => {
        const cards = await ctx.db.query("cards").collect();
        const cardsWithQuiz = cards.filter(card => card.quiz_question);

        const issues: string[] = [];
        let valid = 0;

        for (const card of cardsWithQuiz) {
            const quiz = await ctx.db
                .query("quizzes")
                .withIndex("by_card", (q) => q.eq("card_id", card._id))
                .first();

            if (!quiz) {
                issues.push(`Card ${card._id} missing quiz entry`);
            } else if (quiz.question !== card.quiz_question) {
                issues.push(`Card ${card._id} quiz question mismatch`);
            } else {
                valid++;
            }
        }

        const totalQuizzes = await ctx.db.query("quizzes").collect();

        return {
            cardsWithQuizData: cardsWithQuiz.length,
            quizzesInTable: totalQuizzes.length,
            validMigrations: valid,
            issues,
            success: issues.length === 0,
        };
    },
});
