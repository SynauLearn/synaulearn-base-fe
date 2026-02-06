import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ SAVE MINTED BADGE ============
export const saveMintedBadge = mutation({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
        walletAddress: v.string(),
        tokenId: v.string(),
        txHash: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("minted_badges", {
            user_id: args.userId,
            course_id: args.courseId,
            wallet_address: args.walletAddress,
            token_id: args.tokenId,
            tx_hash: args.txHash,
            minted_at: Date.now(),
        });
    },
});

// ============ GET MINTED BADGE ============
export const getMintedBadge = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("minted_badges")
            .withIndex("by_user_and_course", (q) =>
                q.eq("user_id", args.userId).eq("course_id", args.courseId)
            )
            .first();
    },
});

// ============ HAS MINTED BADGE ============
export const hasMintedBadge = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        const badge = await ctx.db
            .query("minted_badges")
            .withIndex("by_user_and_course", (q) =>
                q.eq("user_id", args.userId).eq("course_id", args.courseId)
            )
            .first();
        return !!badge;
    },
});

// ============ GET USER MINTED BADGES ============
export const getUserBadges = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("minted_badges")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();
    },
});

// ============ GET BADGES BY WALLET ============
export const getByWallet = query({
    args: { walletAddress: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("minted_badges")
            .withIndex("by_wallet", (q) => q.eq("wallet_address", args.walletAddress))
            .collect();
    },
});

// ============ DELETE MINTED BADGE ============
export const deleteMintedBadge = mutation({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        const badge = await ctx.db
            .query("minted_badges")
            .withIndex("by_user_and_course", (q) =>
                q.eq("user_id", args.userId).eq("course_id", args.courseId)
            )
            .first();

        if (badge) {
            await ctx.db.delete(badge._id);
        }
    },
});
