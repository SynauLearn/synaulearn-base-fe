/**
 * Cards Batch Import Mutation
 * 
 * Accepts cards array as argument and inserts with proper lesson_id mapping.
 * 
 * Usage from CLI:
 *   npx convex run migrations/seedCardsBatch:insertCards --prod < cards_arg.json
 */

import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Card schema for validation
const cardSchema = v.object({
    _lesson_title: v.string(),
    card_number: v.number(),
    flashcard_question: v.string(),
    flashcard_answer: v.string(),
    quiz_question: v.string(),
    quiz_option_a: v.string(),
    quiz_option_b: v.string(),
    quiz_option_c: v.string(),
    quiz_option_d: v.string(),
    quiz_correct_answer: v.string(),
    created_at: v.number(),
});

// Public mutation that accepts array of cards
export const insertCards = mutation({
    args: {
        cards: v.array(cardSchema),
    },
    handler: async (ctx, { cards }) => {
        // Build lesson title to ID mapping
        const lessons = await ctx.db.query("lessons").collect();
        const lessonMapping: Record<string, Id<"lessons">> = {};

        for (const lesson of lessons) {
            lessonMapping[lesson.title] = lesson._id;
        }

        console.log(`📚 Found ${lessons.length} lessons`);
        console.log(`📦 Received ${cards.length} cards to insert`);

        let inserted = 0;
        let skipped = 0;
        let errors: string[] = [];

        for (const card of cards) {
            const lesson_id = lessonMapping[card._lesson_title];

            if (!lesson_id) {
                errors.push(`No lesson: ${card._lesson_title}`);
                continue;
            }

            // Check if card exists
            const existing = await ctx.db
                .query("cards")
                .withIndex("by_lesson_and_number", (q) =>
                    q.eq("lesson_id", lesson_id).eq("card_number", card.card_number)
                )
                .first();

            if (existing) {
                skipped++;
                continue;
            }

            await ctx.db.insert("cards", {
                lesson_id,
                card_number: card.card_number,
                flashcard_question: card.flashcard_question,
                flashcard_answer: card.flashcard_answer,
                quiz_question: card.quiz_question,
                quiz_option_a: card.quiz_option_a,
                quiz_option_b: card.quiz_option_b,
                quiz_option_c: card.quiz_option_c,
                quiz_option_d: card.quiz_option_d,
                quiz_correct_answer: card.quiz_correct_answer,
                created_at: card.created_at,
            });
            inserted++;
        }

        const result = { inserted, skipped, errors: errors.length, errorDetails: errors.slice(0, 5) };
        console.log(`✅ Result:`, JSON.stringify(result));
        return result;
    },
});

// Get current card count
export const getCardCount = mutation({
    handler: async (ctx) => {
        const cards = await ctx.db.query("cards").collect();
        const lessons = await ctx.db.query("lessons").collect();

        // Group by lesson
        const byLesson: Record<string, number> = {};
        for (const card of cards) {
            const lesson = lessons.find(l => l._id === card.lesson_id);
            const title = lesson?.title || "Unknown";
            byLesson[title] = (byLesson[title] || 0) + 1;
        }

        return {
            totalCards: cards.length,
            totalLessons: lessons.length,
            cardsByLesson: byLesson
        };
    },
});
