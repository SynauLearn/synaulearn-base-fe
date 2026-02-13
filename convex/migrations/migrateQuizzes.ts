import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

/**
 * Legacy migration compatibility module.
 * Cards no longer store quiz_* fields. Quizzes live only in quizzes table.
 */

// Cards that still don't have quiz rows.
export const getCardsNeedingMigration = internalQuery({
    args: {
        batchSize: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const batchSize = args.batchSize ?? 100;
        const cards = await ctx.db.query("cards").collect();

        const missing = [];
        for (const card of cards) {
            const existingQuiz = await ctx.db
                .query("quizzes")
                .withIndex("by_card", (q) => q.eq("card_id", card._id))
                .first();
            if (!existingQuiz) missing.push(card);
        }

        return {
            cards: missing.slice(0, batchSize),
            total: missing.length,
            hasMore: missing.length > batchSize,
        };
    },
});

// For compatibility, create a placeholder quiz when missing.
export const migrateCardBatch = internalMutation({
    args: {},
    handler: async (ctx) => {
        const result = await ctx.runQuery(
            // @ts-expect-error internal string reference
            "migrations/migrateQuizzes:getCardsNeedingMigration",
            { batchSize: 50 }
        );

        if (result.cards.length === 0) {
            return { migrated: 0, remaining: 0, done: true };
        }

        let migrated = 0;
        for (const card of result.cards) {
            await ctx.db.insert("quizzes", {
                card_id: card._id,
                quiz_type: "multiple_choice",
                question: card.flashcard_question || "Quiz Question",
                options: [
                    { id: "A", text: "Option A" },
                    { id: "B", text: "Option B" },
                    { id: "C", text: "Option C" },
                    { id: "D", text: "Option D" },
                ],
                correct_answer: "A",
                created_at: Date.now(),
            });
            migrated++;
        }

        return {
            migrated,
            remaining: Math.max(0, result.total - migrated),
            done: result.total <= migrated,
        };
    },
});

export const runMigration = internalMutation({
    args: {},
    handler: async (ctx) => {
        let totalMigrated = 0;
        let iterations = 0;
        const maxIterations = 20;

        while (iterations < maxIterations) {
            const result = await ctx.runMutation(
                // @ts-expect-error internal string reference
                "migrations/migrateQuizzes:migrateCardBatch",
                {}
            );
            totalMigrated += result.migrated;
            iterations++;
            if (result.done) break;
        }

        return {
            totalMigrated,
            iterations,
            complete: iterations < maxIterations,
        };
    },
});

export const validateMigration = internalQuery({
    args: {},
    handler: async (ctx) => {
        const cards = await ctx.db.query("cards").collect();
        const quizzes = await ctx.db.query("quizzes").collect();
        const cardIds = new Set(cards.map((c) => c._id));

        const issues: string[] = [];
        let valid = 0;

        for (const card of cards) {
            const related = quizzes.filter((q) => q.card_id === card._id);
            if (related.length === 0) {
                issues.push(`Card ${card._id} missing quiz entry`);
            } else {
                valid++;
            }
        }

        const orphan = quizzes.filter((q) => !cardIds.has(q.card_id)).length;
        if (orphan > 0) issues.push(`${orphan} orphan quizzes found`);

        return {
            cardsTotal: cards.length,
            quizzesInTable: quizzes.length,
            validMigrations: valid,
            issues,
            success: issues.length === 0,
        };
    },
});

