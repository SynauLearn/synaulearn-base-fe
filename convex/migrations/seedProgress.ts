/**
 * User Progress and Badges Import Mutation
 * 
 * Imports user_card_progress and minted_badges with proper ID mapping.
 * 
 * Usage:
 *   node sql_dump/run_import_progress.mjs
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Schema for progress records
const progressSchema = v.object({
    _user_fid: v.number(),
    _card_question: v.string(),
    flashcard_viewed: v.boolean(),
    quiz_completed: v.boolean(),
    quiz_correct: v.boolean(),
    xp_earned: v.number(),
    completed_at: v.number(),
});

// Schema for badge records
const badgeSchema = v.object({
    _user_fid: v.number(),
    _course_title: v.string(),
    wallet_address: v.string(),
    token_id: v.optional(v.string()),
    tx_hash: v.string(),
    minted_at: v.number(),
});

// Import user card progress
export const insertProgress = mutation({
    args: {
        records: v.array(progressSchema),
    },
    handler: async (ctx, { records }) => {
        // Build user fid to ID mapping
        const users = await ctx.db.query("users").collect();
        const userFidToId: Record<number, Id<"users">> = {};
        for (const user of users) {
            if (user.fid !== undefined) {
                userFidToId[user.fid] = user._id;
            }
        }

        // Build card question to ID mapping
        const cards = await ctx.db.query("cards").collect();
        const cardQuestionToId: Record<string, Id<"cards">> = {};
        for (const card of cards) {
            if (card.flashcard_question) {
                cardQuestionToId[card.flashcard_question] = card._id;
            }
        }

        console.log(`📚 Found ${users.length} users, ${cards.length} cards`);
        console.log(`📦 Received ${records.length} progress records`);

        let inserted = 0;
        let skipped = 0;
        let errors: string[] = [];

        for (const record of records) {
            const user_id = userFidToId[record._user_fid];
            const card_id = cardQuestionToId[record._card_question];

            if (!user_id) {
                errors.push(`No user fid: ${record._user_fid}`);
                continue;
            }
            if (!card_id) {
                errors.push(`No card: ${record._card_question.substring(0, 30)}...`);
                continue;
            }

            // Check if already exists
            const existing = await ctx.db
                .query("user_card_progress")
                .withIndex("by_user_and_card", (q) =>
                    q.eq("user_id", user_id).eq("card_id", card_id)
                )
                .first();

            if (existing) {
                skipped++;
                continue;
            }

            await ctx.db.insert("user_card_progress", {
                user_id,
                card_id,
                flashcard_viewed: record.flashcard_viewed,
                quiz_completed: record.quiz_completed,
                quiz_correct: record.quiz_correct,
                xp_earned: record.xp_earned,
                completed_at: record.completed_at,
            });
            inserted++;
        }

        const result = { inserted, skipped, errors: errors.length, errorDetails: errors.slice(0, 5) };
        console.log(`✅ Progress: ${inserted} inserted, ${skipped} skipped, ${errors.length} errors`);
        return result;
    },
});

// Import minted badges
export const insertBadges = mutation({
    args: {
        records: v.array(badgeSchema),
    },
    handler: async (ctx, { records }) => {
        // Build user fid to ID mapping
        const users = await ctx.db.query("users").collect();
        const userFidToId: Record<number, Id<"users">> = {};
        for (const user of users) {
            if (user.fid !== undefined) {
                userFidToId[user.fid] = user._id;
            }
        }

        // Build course title to ID mapping
        const courses = await ctx.db.query("courses").collect();
        const courseTitleToId: Record<string, Id<"courses">> = {};
        for (const course of courses) {
            courseTitleToId[course.title] = course._id;
        }

        console.log(`📚 Found ${users.length} users, ${courses.length} courses`);
        console.log(`📦 Received ${records.length} badge records`);

        let inserted = 0;
        let skipped = 0;
        let errors: string[] = [];

        for (const record of records) {
            const user_id = userFidToId[record._user_fid];
            const course_id = courseTitleToId[record._course_title];

            if (!user_id) {
                errors.push(`No user fid: ${record._user_fid}`);
                continue;
            }
            if (!course_id) {
                errors.push(`No course: ${record._course_title}`);
                continue;
            }

            // Check if already exists
            const existing = await ctx.db
                .query("minted_badges")
                .withIndex("by_user_and_course", (q) =>
                    q.eq("user_id", user_id).eq("course_id", course_id)
                )
                .first();

            if (existing) {
                skipped++;
                continue;
            }

            await ctx.db.insert("minted_badges", {
                user_id,
                course_id,
                wallet_address: record.wallet_address,
                token_id: record.token_id || "",
                tx_hash: record.tx_hash,
                minted_at: record.minted_at,
            });
            inserted++;
        }

        const result = { inserted, skipped, errors: errors.length, errorDetails: errors.slice(0, 5) };
        console.log(`✅ Badges: ${inserted} inserted, ${skipped} skipped, ${errors.length} errors`);
        return result;
    },
});

// Get final stats
export const getFinalStats = mutation({
    handler: async (ctx) => {
        const categories = await ctx.db.query("categories").collect();
        const courses = await ctx.db.query("courses").collect();
        const lessons = await ctx.db.query("lessons").collect();
        const cards = await ctx.db.query("cards").collect();
        const users = await ctx.db.query("users").collect();
        const progress = await ctx.db.query("user_card_progress").collect();
        const badges = await ctx.db.query("minted_badges").collect();

        return {
            categories: categories.length,
            courses: courses.length,
            lessons: lessons.length,
            cards: cards.length,
            users: users.length,
            user_card_progress: progress.length,
            minted_badges: badges.length,
        };
    },
});
