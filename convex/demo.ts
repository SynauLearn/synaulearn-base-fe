import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ DEMO DATA QUERIES (public, no auth) ============

/**
 * Get the demo course for a given language
 */
export const getDemoCourse = query({
    args: { language: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const lang = args.language || "en";
        const courses = await ctx.db
            .query("courses")
            .withIndex("by_language", (q) => q.eq("language", lang))
            .collect();

        return courses.find((c) => c.is_demo === true) || null;
    },
});

/**
 * Get the first lesson of a demo course
 */
export const getDemoLesson = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
            .collect();

        // Return the first lesson (lesson_number = 1)
        return lessons.sort((a, b) => a.lesson_number - b.lesson_number)[0] || null;
    },
});

/**
 * Get cards for a demo lesson (limited to 5)
 */
export const getDemoCards = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        return cards
            .sort((a, b) => a.card_number - b.card_number)
            .slice(0, 5);
    },
});

/**
 * Get quizzes for a list of card IDs (demo)
 */
export const getDemoQuizzes = query({
    args: { cardIds: v.array(v.id("cards")) },
    handler: async (ctx, args) => {
        const quizzes = [];
        for (const cardId of args.cardIds) {
            const quiz = await ctx.db
                .query("quizzes")
                .withIndex("by_card", (q) => q.eq("card_id", cardId))
                .first();
            if (quiz) {
                quizzes.push(quiz);
            }
        }
        return quizzes;
    },
});

// ============ DEMO ANALYTICS MUTATIONS (public, no auth) ============

/**
 * Start a new demo session
 */
export const startSession = mutation({
    args: {
        session_id: v.string(),
        referrer: v.optional(v.string()),
        user_agent: v.optional(v.string()),
        locale: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if session already exists
        const existing = await ctx.db
            .query("demo_sessions")
            .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
            .first();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("demo_sessions", {
            session_id: args.session_id,
            started_at: Date.now(),
            completed: false,
            cards_viewed: 0,
            quiz_score: 0,
            cta_clicked: false,
            referrer: args.referrer,
            user_agent: args.user_agent,
            locale: args.locale,
        });
    },
});

/**
 * Update session progress (cards viewed, quiz score)
 */
export const updateSession = mutation({
    args: {
        session_id: v.string(),
        cards_viewed: v.number(),
        quiz_score: v.number(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("demo_sessions")
            .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
            .first();

        if (!session) return null;

        await ctx.db.patch(session._id, {
            cards_viewed: args.cards_viewed,
            quiz_score: args.quiz_score,
        });

        return session._id;
    },
});

/**
 * Mark session as completed
 */
export const completeSession = mutation({
    args: { session_id: v.string() },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("demo_sessions")
            .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
            .first();

        if (!session) return null;

        await ctx.db.patch(session._id, {
            completed: true,
            ended_at: Date.now(),
        });

        return session._id;
    },
});

/**
 * Record CTA click
 */
export const recordCtaClick = mutation({
    args: {
        session_id: v.string(),
        cta_type: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db
            .query("demo_sessions")
            .withIndex("by_session", (q) => q.eq("session_id", args.session_id))
            .first();

        if (!session) return null;

        await ctx.db.patch(session._id, {
            cta_clicked: true,
            cta_type: args.cta_type,
        });

        return session._id;
    },
});

/**
 * Get demo analytics summary (admin use)
 */
export const getAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const allSessions = await ctx.db.query("demo_sessions").collect();

        const totalSessions = allSessions.length;
        const completedSessions = allSessions.filter((s) => s.completed);
        const ctaClicks = allSessions.filter((s) => s.cta_clicked);

        // Calculate average duration for completed sessions
        const durations = completedSessions
            .filter((s) => s.ended_at)
            .map((s) => (s.ended_at! - s.started_at) / 1000); // in seconds

        const avgDuration = durations.length > 0
            ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
            : 0;

        // Average cards viewed
        const avgCardsViewed = totalSessions > 0
            ? Math.round((allSessions.reduce((a, s) => a + s.cards_viewed, 0) / totalSessions) * 10) / 10
            : 0;

        // Average quiz score for completed
        const avgQuizScore = completedSessions.length > 0
            ? Math.round((completedSessions.reduce((a, s) => a + s.quiz_score, 0) / completedSessions.length) * 10) / 10
            : 0;

        // Locale breakdown
        const localeBreakdown: Record<string, number> = {};
        for (const s of allSessions) {
            const locale = s.locale || "unknown";
            localeBreakdown[locale] = (localeBreakdown[locale] || 0) + 1;
        }

        return {
            totalSessions,
            completedCount: completedSessions.length,
            completionRate: totalSessions > 0
                ? Math.round((completedSessions.length / totalSessions) * 100)
                : 0,
            ctaClickCount: ctaClicks.length,
            ctaClickRate: totalSessions > 0
                ? Math.round((ctaClicks.length / totalSessions) * 100)
                : 0,
            avgDurationSeconds: avgDuration,
            avgCardsViewed,
            avgQuizScore,
            localeBreakdown,
        };
    },
});
