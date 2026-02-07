/**
 * Migration: Regenerate User Course Progress
 * 
 * This migration does two things:
 * 1. Backfills `completed_at` timestamps on user_card_progress entries that are missing them
 * 2. Regenerates user_course_progress entries based on card progress data
 * 
 * Run this with: npx convex run migrations/regenerateCourseProgress:regenerateAllProgress
 */
import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// ============ STEP 1: BACKFILL COMPLETED_AT TIMESTAMPS ============
export const backfillCompletedAtTimestamps = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Get all card progress entries without completed_at
        const allCardProgress = await ctx.db
            .query("user_card_progress")
            .collect();

        let updatedCount = 0;
        const now = Date.now();

        for (const progress of allCardProgress) {
            // If quiz is completed but no completed_at, backfill it
            if (progress.quiz_completed && !progress.completed_at) {
                await ctx.db.patch(progress._id, {
                    completed_at: now // Use current time as fallback
                });
                updatedCount++;
            }
        }

        return {
            message: `Backfilled ${updatedCount} card progress entries with completed_at timestamp`,
            updated: updatedCount
        };
    },
});

// ============ STEP 2: REGENERATE USER COURSE PROGRESS ============
export const regenerateCourseProgress = internalMutation({
    args: {},
    handler: async (ctx) => {
        // Get all users
        const users = await ctx.db.query("users").collect();
        // Get all courses
        const courses = await ctx.db.query("courses").collect();

        let createdCount = 0;
        let updatedCount = 0;

        for (const user of users) {
            // Get all card progress for this user
            const userCardProgress = await ctx.db
                .query("user_card_progress")
                .withIndex("by_user", (q) => q.eq("user_id", user._id))
                .collect();

            if (userCardProgress.length === 0) continue;

            for (const course of courses) {
                // Get all lessons in this course
                const lessons = await ctx.db
                    .query("lessons")
                    .withIndex("by_course", (q) => q.eq("course_id", course._id))
                    .collect();

                if (lessons.length === 0) continue;

                // Get all cards in all lessons of this course
                let totalCards = 0;
                let completedCards = 0;
                let totalXP = 0;
                let latestCompletedAt: number | undefined;

                for (const lesson of lessons) {
                    const cards = await ctx.db
                        .query("cards")
                        .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                        .collect();

                    totalCards += cards.length;

                    for (const card of cards) {
                        const progress = userCardProgress.find(p => p.card_id === card._id);
                        if (progress?.quiz_completed) {
                            completedCards++;
                            totalXP += progress.xp_earned || 0;

                            // Track latest completed_at for course completion timestamp
                            if (progress.completed_at) {
                                if (!latestCompletedAt || progress.completed_at > latestCompletedAt) {
                                    latestCompletedAt = progress.completed_at;
                                }
                            }
                        }
                    }
                }

                // Only create/update if user has some progress in this course
                if (completedCards === 0) continue;

                const isComplete = completedCards === totalCards;

                // Check if entry exists
                const existing = await ctx.db
                    .query("user_course_progress")
                    .withIndex("by_user_and_course", (q) =>
                        q.eq("user_id", user._id).eq("course_id", course._id)
                    )
                    .first();

                if (existing) {
                    await ctx.db.patch(existing._id, {
                        cards_completed: completedCards,
                        total_xp_earned: totalXP,
                        completed_at: isComplete ? (latestCompletedAt || Date.now()) : undefined,
                    });
                    updatedCount++;
                } else {
                    await ctx.db.insert("user_course_progress", {
                        user_id: user._id,
                        course_id: course._id,
                        cards_completed: completedCards,
                        total_xp_earned: totalXP,
                        completed_at: isComplete ? (latestCompletedAt || Date.now()) : undefined,
                    });
                    createdCount++;
                }
            }
        }

        return {
            message: `Regenerated course progress: ${createdCount} created, ${updatedCount} updated`,
            created: createdCount,
            updated: updatedCount
        };
    },
});

// ============ RUN ALL REGENERATION STEPS ============
export const regenerateAllProgress = internalMutation({
    args: {},
    handler: async (ctx) => {
        console.log("Step 1: Backfilling completed_at timestamps...");

        // Step 1: Get all card progress entries without completed_at
        const allCardProgress = await ctx.db.query("user_card_progress").collect();
        let cardUpdatedCount = 0;
        const now = Date.now();

        for (const progress of allCardProgress) {
            if (progress.quiz_completed && !progress.completed_at) {
                await ctx.db.patch(progress._id, { completed_at: now });
                cardUpdatedCount++;
            }
        }

        console.log(`Backfilled ${cardUpdatedCount} card entries.`);
        console.log("Step 2: Regenerating course progress...");

        // Step 2: Regenerate course progress
        const users = await ctx.db.query("users").collect();
        const courses = await ctx.db.query("courses").collect();

        let createdCount = 0;
        let updatedCount = 0;

        for (const user of users) {
            const userCardProgress = await ctx.db
                .query("user_card_progress")
                .withIndex("by_user", (q) => q.eq("user_id", user._id))
                .collect();

            if (userCardProgress.length === 0) continue;

            for (const course of courses) {
                const lessons = await ctx.db
                    .query("lessons")
                    .withIndex("by_course", (q) => q.eq("course_id", course._id))
                    .collect();

                if (lessons.length === 0) continue;

                let totalCards = 0;
                let completedCards = 0;
                let totalXP = 0;
                let latestCompletedAt: number | undefined;

                for (const lesson of lessons) {
                    const cards = await ctx.db
                        .query("cards")
                        .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                        .collect();

                    totalCards += cards.length;

                    for (const card of cards) {
                        const progress = userCardProgress.find(p => p.card_id === card._id);
                        if (progress?.quiz_completed) {
                            completedCards++;
                            totalXP += progress.xp_earned || 0;
                            if (progress.completed_at) {
                                if (!latestCompletedAt || progress.completed_at > latestCompletedAt) {
                                    latestCompletedAt = progress.completed_at;
                                }
                            }
                        }
                    }
                }

                if (completedCards === 0) continue;

                const isComplete = completedCards === totalCards;

                const existing = await ctx.db
                    .query("user_course_progress")
                    .withIndex("by_user_and_course", (q) =>
                        q.eq("user_id", user._id).eq("course_id", course._id)
                    )
                    .first();

                if (existing) {
                    await ctx.db.patch(existing._id, {
                        cards_completed: completedCards,
                        total_xp_earned: totalXP,
                        completed_at: isComplete ? (latestCompletedAt || now) : undefined,
                    });
                    updatedCount++;
                } else {
                    await ctx.db.insert("user_course_progress", {
                        user_id: user._id,
                        course_id: course._id,
                        cards_completed: completedCards,
                        total_xp_earned: totalXP,
                        completed_at: isComplete ? (latestCompletedAt || now) : undefined,
                    });
                    createdCount++;
                }
            }
        }

        return {
            summary: "Migration complete",
            cardProgressBackfilled: cardUpdatedCount,
            courseProgressCreated: createdCount,
            courseProgressUpdated: updatedCount
        };
    },
});

// ============ PREVIEW (DRY RUN) ============
export const previewRegeneration = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        const courses = await ctx.db.query("courses").collect();

        // Count card progress missing completed_at
        const allCardProgress = await ctx.db.query("user_card_progress").collect();
        const missingTimestamps = allCardProgress.filter(
            p => p.quiz_completed && !p.completed_at
        ).length;

        // Count existing course progress
        const existingCourseProgress = await ctx.db.query("user_course_progress").collect();

        // Estimate new entries needed
        let estimatedNewEntries = 0;
        for (const user of users) {
            const userProgress = allCardProgress.filter(p => p.user_id === user._id);
            if (userProgress.length > 0) {
                // User has some progress, might need course entries
                estimatedNewEntries += courses.length; // Conservative estimate
            }
        }

        return {
            totalUsers: users.length,
            totalCourses: courses.length,
            existingCardProgress: allCardProgress.length,
            cardProgressMissingTimestamps: missingTimestamps,
            existingCourseProgress: existingCourseProgress.length,
            estimatedNewCourseProgressEntries: estimatedNewEntries,
            note: "Run regenerateAllProgress to execute the migration"
        };
    },
});
