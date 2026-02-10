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


// ============ GET HOME DASHBOARD STATS ============
export const getHomeStats = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        const now = Date.now();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayMs = startOfToday.getTime();

        // 1. Get Card Progress (to determine New User & Daily Progress)
        const cardProgress = await ctx.db
            .query("user_card_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        const cardsCompleted = cardProgress.length;
        const isNewUser = cardsCompleted === 0;

        // 2. Calculate Daily Progress (for Quests)
        const todayProgress = cardProgress.filter(p => (p.completed_at || 0) >= startOfTodayMs);
        const lessonsCompletedToday = new Set(todayProgress.map(p => p.card_id)).size > 0 ? 1 : 0; // Simplified: 1 lesson if any card done (approx) -> ideally need lesson_id from card
        // Actually, we need to fetch cards to know lesson_id to be precise, but for now let's just count cards
        // Improvement: We can't easily count "lessons" without fetching cards. 
        // Let's use "Cards Completed Today" as a proxy or just count progress entries.
        // For the UI "Complete 1 lesson", if they have > 3 cards done today, that's likely a lesson.
        // Let's count 'quizzesCorrect' properly.
        const quizzesCorrectToday = todayProgress.filter(p => p.quiz_correct).length;


        // 3. Get Course Progress & Last Active Course
        const courseProgress = await ctx.db
            .query("user_course_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        const coursesDone = courseProgress.filter(c => c.completed_at).length;

        let lastActiveCourse = null;
        if (!isNewUser && cardProgress.length > 0) {
            // Find most recent card interaction
            const sortedProgress = cardProgress.sort((a, b) => (b.completed_at || 0) - (a.completed_at || 0));
            const lastCardId = sortedProgress[0].card_id;
            const lastCard = await ctx.db.get(lastCardId);
            if (lastCard) {
                const lastLesson = await ctx.db.get(lastCard.lesson_id);
                if (lastLesson) {
                    const course = await ctx.db.get(lastLesson.course_id);
                    if (course) {
                        // Calculate progress % for this course based on completed cards
                        const lessons = await ctx.db
                            .query("lessons")
                            .withIndex("by_course", (q) => q.eq("course_id", course._id))
                            .collect();

                        let totalCards = 0;
                        let completedCards = 0;

                        for (const lesson of lessons) {
                            const cards = await ctx.db
                                .query("cards")
                                .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                                .collect();

                            totalCards += cards.length;

                            for (const card of cards) {
                                const progress = cardProgress.find(p => p.card_id === card._id);
                                if (progress?.quiz_completed) {
                                    completedCards++;
                                }
                            }
                        }

                        const progressPercent = totalCards === 0
                            ? 0
                            : Math.round((completedCards / totalCards) * 100);

                        lastActiveCourse = {
                            id: course._id,
                            title: course.title,
                            lessonCount: course.total_lessons,
                            progress: progressPercent,
                            emoji: course.emoji
                        };
                    }
                }
            }
        }

        // 4. Get Recommended Courses (random 3)
        const allCourses = await ctx.db.query("courses").collect(); // Small dataset, safe to scan
        const shuffled = allCourses
            .map((course) => ({ course, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ course }) => course);
        const recommendedCourses = shuffled.slice(0, 3);

        // 5. Streak Calculation (Consecutive Days of Activity)
        // A streak counts consecutive days where the user completed at least one card
        let streak = 0;

        if (cardProgress.length > 0) {
            // Get all unique activity dates (in UTC, day precision)
            const activityDates = new Set<string>();
            for (const p of cardProgress) {
                if (p.completed_at) {
                    const date = new Date(p.completed_at);
                    // Format as YYYY-MM-DD for unique day comparison
                    activityDates.add(date.toISOString().split('T')[0]);
                }
            }

            // Convert to sorted array (descending - most recent first)
            const sortedDates = Array.from(activityDates).sort().reverse();

            if (sortedDates.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                // Check if most recent activity is today or yesterday (streak still active)
                const mostRecentDate = sortedDates[0];

                if (mostRecentDate === today || mostRecentDate === yesterday) {
                    // Count consecutive days backwards
                    streak = 1;
                    let checkDate = new Date(mostRecentDate);

                    for (let i = 1; i < sortedDates.length; i++) {
                        // Expected previous day
                        checkDate.setDate(checkDate.getDate() - 1);
                        const expectedDate = checkDate.toISOString().split('T')[0];

                        if (sortedDates[i] === expectedDate) {
                            streak++;
                        } else {
                            break; // Streak broken
                        }
                    }
                }
                // If most recent activity is older than yesterday, streak is 0
            }
        }


        return {
            isNewUser,
            username: user.username || "Genius",
            stats: {
                totalXP: user.total_xp,
                cardsMastered: cardsCompleted,
                coursesDone: coursesDone,
                streak: streak
            },
            dailyProgress: {
                cardsCompletedToday: todayProgress.length,
                quizzesCorrect: quizzesCorrectToday
            },
            lastActiveCourse,
            recommendedCourses
        };
    },
});
