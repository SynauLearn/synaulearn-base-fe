
import { query } from "./_generated/server";

export const sample = query({
    args: {},
    handler: async (ctx) => {
        const course = await ctx.db.query("courses").first();
        const lesson = await ctx.db.query("lessons").first();
        const card = await ctx.db.query("cards").first();
        const user = await ctx.db.query("users").first();

        return { course, lesson, card, user };
    },
});
