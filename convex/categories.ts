import { query } from "./_generated/server";

// ============ GET ALL CATEGORIES ============
export const list = query({
    args: {},
    handler: async (ctx) => {
        const categories = await ctx.db.query("categories").collect();
        return categories.sort((a, b) => a.order_index - b.order_index);
    },
});
