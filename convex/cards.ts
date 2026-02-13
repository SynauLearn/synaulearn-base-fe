import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ GET CARDS FOR LESSON ============
export const listByLesson = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        return cards.sort((a, b) => a.card_number - b.card_number);
    },
});

// ============ GET SINGLE CARD ============
export const get = query({
    args: { cardId: v.id("cards") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.cardId);
    },
});

// ============ ADMIN FUNCTIONS ============

export const listByLessonId = query({
    args: { lesson_id: v.id("lessons") }, // Fixed: Using v.id() to match schema
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lesson_id))
            .collect();
    },
});

export const getById = query({
    args: { id: v.id("cards") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        card_number: v.number(),
        lesson_id: v.id("lessons"), // Fixed: Using v.id() to match schema

        // Optional content fields
        flashcard_answer: v.optional(v.string()),
        flashcard_question: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const createdAt = Date.now();
        return await ctx.db.insert("cards", {
            ...args,
            created_at: createdAt,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("cards"),
        card_number: v.optional(v.number()),

        // Optional content fields
        flashcard_answer: v.optional(v.string()),
        flashcard_question: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("cards") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
