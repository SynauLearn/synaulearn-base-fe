import { query } from "./_generated/server";
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
