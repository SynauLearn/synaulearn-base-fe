import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ GET USER BY WALLET ============
export const getByWallet = query({
    args: { wallet_address: v.string() },
    handler: async (ctx, args) => {
        const normalizedWallet = args.wallet_address.toLowerCase();
        return await ctx.db
            .query("users")
            .withIndex("by_wallet", (q) => q.eq("wallet_address", normalizedWallet))
            .first();
    },
});

// ============ GET USER BY FID (legacy support) ============
export const getByFid = query({
    args: { fid: v.number() },
    handler: async (ctx, args) => {
        if (!args.fid || args.fid === 0) return null;
        return await ctx.db
            .query("users")
            .withIndex("by_fid", (q) => q.eq("fid", args.fid))
            .first();
    },
});

// ============ GET OR CREATE USER ============
// Primary lookup: wallet_address
// Secondary: FID (for linking existing Farcaster users to new wallet)
export const getOrCreate = mutation({
    args: {
        wallet_address: v.string(),
        fid: v.optional(v.number()),
        username: v.optional(v.string()),
        display_name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const normalizedWallet = args.wallet_address.toLowerCase();
        const now = Date.now();

        // Step 1: Look up by wallet address (primary identifier)
        const existingByWallet = await ctx.db
            .query("users")
            .withIndex("by_wallet", (q) => q.eq("wallet_address", normalizedWallet))
            .first();

        if (existingByWallet) {
            // User found by wallet - check if we should enrich with Farcaster data
            const hasFid = args.fid && args.fid > 0;
            const needsEnrichment = hasFid && !existingByWallet.fid;

            if (needsEnrichment) {
                // Wallet-only user is now connecting Farcaster - enrich!
                await ctx.db.patch(existingByWallet._id, {
                    fid: args.fid,
                    username: args.username || existingByWallet.username,
                    display_name: args.display_name || existingByWallet.display_name,
                    updated_at: now,
                });
                console.log(`✅ Enriched user ${normalizedWallet} with FID ${args.fid}`);
            }

            return await ctx.db.get(existingByWallet._id);
        }

        // Step 2: User not found by wallet - check if they exist by FID
        // (Farcaster user connecting with a new wallet)
        if (args.fid && args.fid > 0) {
            const existingByFid = await ctx.db
                .query("users")
                .withIndex("by_fid", (q) => q.eq("fid", args.fid))
                .first();

            if (existingByFid) {
                // Farcaster user exists but with different/no wallet - update with new wallet
                await ctx.db.patch(existingByFid._id, {
                    wallet_address: normalizedWallet,
                    username: args.username || existingByFid.username,
                    display_name: args.display_name || existingByFid.display_name,
                    updated_at: now,
                });
                console.log(`✅ Linked wallet ${normalizedWallet} to existing FID ${args.fid}`);
                return await ctx.db.get(existingByFid._id);
            }
        }

        // Step 3: Completely new user - create
        const userId = await ctx.db.insert("users", {
            wallet_address: normalizedWallet,
            fid: args.fid && args.fid > 0 ? args.fid : undefined,
            username: args.username || `${normalizedWallet.slice(0, 6)}...${normalizedWallet.slice(-4)}`,
            display_name: args.display_name,
            total_xp: 0,
            created_at: now,
            updated_at: now,
        });

        console.log(`✅ Created new user: wallet=${normalizedWallet}, fid=${args.fid || 'none'}`);
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
