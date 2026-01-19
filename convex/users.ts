import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ GET USER BY FID ============
export const getByFid = query({
    args: { fid: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_fid", (q) => q.eq("fid", args.fid))
            .first();
    },
});

// ============ GET OR CREATE USER ============
export const getOrCreate = mutation({
    args: {
        fid: v.number(),
        username: v.optional(v.string()),
        display_name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if user exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_fid", (q) => q.eq("fid", args.fid))
            .first();

        if (existing) {
            return existing;
        }

        // Create new user
        const now = Date.now();
        const userId = await ctx.db.insert("users", {
            fid: args.fid,
            username: args.username,
            display_name: args.display_name,
            total_xp: 0,
            created_at: now,
            updated_at: now,
        });

        return await ctx.db.get(userId);
    },
});

// ============ UPDATE USER XP ============
export const updateXP = mutation({
    args: {
        userId: v.id("users"),
        xpToAdd: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        const newXP = user.total_xp + args.xpToAdd;
        await ctx.db.patch(args.userId, {
            total_xp: newXP,
            updated_at: Date.now(),
        });

        return newXP;
    },
});

// ============ GET LEADERBOARD ============
export const getLeaderboard = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        const users = await ctx.db
            .query("users")
            .order("desc")
            .take(100); // Get more than needed to sort

        // Sort by XP descending and take limit
        return users
            .sort((a, b) => b.total_xp - a.total_xp)
            .slice(0, limit);
    },
});

// ============ GET USER STATS ============
export const getStats = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        // Get card progress
        const cardProgress = await ctx.db
            .query("user_card_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        const totalCardsCompleted = cardProgress.length;
        const correctAnswers = cardProgress.filter((p) => p.quiz_correct).length;

        // Get completed courses
        const courseProgress = await ctx.db
            .query("user_course_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        const coursesCompleted = courseProgress.filter((p) => p.completed_at).length;

        // Get minted badges
        const badges = await ctx.db
            .query("minted_badges")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        return {
            totalXP: user.total_xp,
            cardsCompleted: totalCardsCompleted,
            correctAnswers,
            coursesCompleted,
            badgesMinted: badges.length,
            accuracy: totalCardsCompleted > 0
                ? Math.round((correctAnswers / totalCardsCompleted) * 100)
                : 0,
        };
    },
});
