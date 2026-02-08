import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Type definitions for quiz types
export type QuizType = "multiple_choice" | "true_false" | "fill_blank";

export interface QuizOption {
    id: string;
    text: string;
}

// Get quiz by card ID
export const getByCardId = query({
    args: { cardId: v.id("cards") },
    handler: async (ctx, args) => {
        const quiz = await ctx.db
            .query("quizzes")
            .withIndex("by_card", (q) => q.eq("card_id", args.cardId))
            .first();
        return quiz;
    },
});

// Get all quizzes for a lesson (by getting all cards first)
export const getByLessonId = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        // Get all cards for this lesson
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        // Get quizzes for each card
        const quizzes = await Promise.all(
            cards.map(async (card) => {
                const quiz = await ctx.db
                    .query("quizzes")
                    .withIndex("by_card", (q) => q.eq("card_id", card._id))
                    .first();
                return quiz ? { ...quiz, card } : null;
            })
        );

        return quizzes.filter(Boolean);
    },
});

// Get cards with their quizzes for a lesson (combined data)
export const getCardsWithQuizzes = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        // Get all cards for this lesson
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        // For each card, get its quiz
        const cardsWithQuizzes = await Promise.all(
            cards.map(async (card) => {
                const quiz = await ctx.db
                    .query("quizzes")
                    .withIndex("by_card", (q) => q.eq("card_id", card._id))
                    .first();

                return {
                    ...card,
                    quiz: quiz ?? null,
                };
            })
        );

        // Sort by card_number
        return cardsWithQuizzes.sort((a, b) => a.card_number - b.card_number);
    },
});

// Create a new quiz
export const create = mutation({
    args: {
        cardId: v.id("cards"),
        quizType: v.string(),
        question: v.string(),
        options: v.optional(v.array(v.object({
            id: v.string(),
            text: v.string(),
        }))),
        correctAnswer: v.string(),
        acceptableAnswers: v.optional(v.array(v.string())),
        hint: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Validate quiz type
        const validTypes = ["multiple_choice", "true_false", "fill_blank"];
        if (!validTypes.includes(args.quizType)) {
            throw new Error(`Invalid quiz type: ${args.quizType}`);
        }

        // Check if quiz already exists for this card
        const existing = await ctx.db
            .query("quizzes")
            .withIndex("by_card", (q) => q.eq("card_id", args.cardId))
            .first();

        if (existing) {
            throw new Error("Quiz already exists for this card. Use update instead.");
        }

        // Validate options for multiple choice
        if (args.quizType === "multiple_choice" && (!args.options || args.options.length !== 4)) {
            throw new Error("Multiple choice quiz must have exactly 4 options");
        }

        // Validate answer for true/false
        if (args.quizType === "true_false" && !["true", "false"].includes(args.correctAnswer)) {
            throw new Error("True/false quiz answer must be 'true' or 'false'");
        }

        const quizId = await ctx.db.insert("quizzes", {
            card_id: args.cardId,
            quiz_type: args.quizType,
            question: args.question,
            options: args.options,
            correct_answer: args.correctAnswer,
            acceptable_answers: args.acceptableAnswers,
            hint: args.hint,
            created_at: Date.now(),
        });

        return quizId;
    },
});

// Update an existing quiz
export const update = mutation({
    args: {
        quizId: v.id("quizzes"),
        quizType: v.optional(v.string()),
        question: v.optional(v.string()),
        options: v.optional(v.array(v.object({
            id: v.string(),
            text: v.string(),
        }))),
        correctAnswer: v.optional(v.string()),
        acceptableAnswers: v.optional(v.array(v.string())),
        hint: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { quizId, ...updates } = args;

        const existing = await ctx.db.get(quizId);
        if (!existing) {
            throw new Error("Quiz not found");
        }

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {};
        if (updates.quizType !== undefined) updateData.quiz_type = updates.quizType;
        if (updates.question !== undefined) updateData.question = updates.question;
        if (updates.options !== undefined) updateData.options = updates.options;
        if (updates.correctAnswer !== undefined) updateData.correct_answer = updates.correctAnswer;
        if (updates.acceptableAnswers !== undefined) updateData.acceptable_answers = updates.acceptableAnswers;
        if (updates.hint !== undefined) updateData.hint = updates.hint;

        await ctx.db.patch(quizId, updateData);
        return quizId;
    },
});

// Check if answer is correct
export const checkAnswer = query({
    args: {
        quizId: v.id("quizzes"),
        answer: v.string(),
    },
    handler: async (ctx, args) => {
        const quiz = await ctx.db.get(args.quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }

        const userAnswer = args.answer.toLowerCase().trim();

        switch (quiz.quiz_type) {
            case "multiple_choice":
            case "true_false":
                return {
                    correct: userAnswer === quiz.correct_answer.toLowerCase(),
                    correctAnswer: quiz.correct_answer,
                };

            case "fill_blank":
                // Check main answer
                if (userAnswer === quiz.correct_answer.toLowerCase().trim()) {
                    return { correct: true, correctAnswer: quiz.correct_answer };
                }
                // Check acceptable alternatives
                if (quiz.acceptable_answers?.some(
                    alt => userAnswer === alt.toLowerCase().trim()
                )) {
                    return { correct: true, correctAnswer: quiz.correct_answer };
                }
                return { correct: false, correctAnswer: quiz.correct_answer };

            default:
                throw new Error(`Unknown quiz type: ${quiz.quiz_type}`);
        }
    },
});
