import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ SAVE CARD PROGRESS ============
export const saveCardProgress = mutation({
    args: {
        userId: v.id("users"),
        cardId: v.id("cards"),
        quizCorrect: v.boolean(),
    },
    handler: async (ctx, args) => {
        const xpEarned = args.quizCorrect ? 15 : 5;
        const now = Date.now();

        // Check if progress already exists
        const existing = await ctx.db
            .query("user_card_progress")
            .withIndex("by_user_and_card", (q) =>
                q.eq("user_id", args.userId).eq("card_id", args.cardId)
            )
            .first();

        if (existing) {
            // Update existing progress
            await ctx.db.patch(existing._id, {
                flashcard_viewed: true,
                quiz_completed: true,
                quiz_correct: args.quizCorrect,
                xp_earned: xpEarned,
                completed_at: now,
            });
        } else {
            // Create new progress
            await ctx.db.insert("user_card_progress", {
                user_id: args.userId,
                card_id: args.cardId,
                flashcard_viewed: true,
                quiz_completed: true,
                quiz_correct: args.quizCorrect,
                xp_earned: xpEarned,
                completed_at: now,
            });
        }

        // Update user XP
        const user = await ctx.db.get(args.userId);
        if (user) {
            await ctx.db.patch(args.userId, {
                total_xp: user.total_xp + xpEarned,
                updated_at: now,
            });
        }

        // Update course progress (aggregate by course)
        const card = await ctx.db.get(args.cardId);
        if (card) {
            const lesson = await ctx.db.get(card.lesson_id);
            if (lesson) {
                const courseId = lesson.course_id;
                const courseProgress = await ctx.db
                    .query("user_course_progress")
                    .withIndex("by_user_and_course", (q) =>
                        q.eq("user_id", args.userId).eq("course_id", courseId)
                    )
                    .first();

                const wasCorrect = existing?.quiz_correct ?? false;
                const incrementCompleted =
                    args.quizCorrect && !wasCorrect ? 1 : 0;

                const nextCardsCompleted =
                    (courseProgress?.cards_completed ?? 0) + incrementCompleted;
                const nextTotalXp =
                    (courseProgress?.total_xp_earned ?? 0) + xpEarned;

                let completedAt = courseProgress?.completed_at;

                if (!completedAt && incrementCompleted > 0) {
                    const lessons = await ctx.db
                        .query("lessons")
                        .withIndex("by_course", (q) =>
                            q.eq("course_id", courseId)
                        )
                        .collect();

                    let totalCards = 0;
                    for (const l of lessons) {
                        const cards = await ctx.db
                            .query("cards")
                            .withIndex("by_lesson", (q) =>
                                q.eq("lesson_id", l._id)
                            )
                            .collect();
                        totalCards += cards.length;
                    }

                    if (totalCards > 0 && nextCardsCompleted >= totalCards) {
                        completedAt = now;
                    }
                }

                if (courseProgress) {
                    await ctx.db.patch(courseProgress._id, {
                        cards_completed: nextCardsCompleted,
                        total_xp_earned: nextTotalXp,
                        completed_at: completedAt,
                    });
                } else {
                    await ctx.db.insert("user_course_progress", {
                        user_id: args.userId,
                        course_id: courseId,
                        cards_completed: nextCardsCompleted,
                        total_xp_earned: nextTotalXp,
                        completed_at: completedAt,
                    });
                }
            }
        }

        return { xpEarned };
    },
});

// ============ GET USER PROGRESS FOR LESSON ============
export const getUserProgressForLesson = query({
    args: {
        userId: v.id("users"),
        lessonId: v.id("lessons"),
    },
    handler: async (ctx, args) => {
        // Get all cards in lesson
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        if (cards.length === 0) return [];

        const cardIds = cards.map((c) => c._id);

        // Get progress for each card
        const allProgress = await ctx.db
            .query("user_card_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        return allProgress.filter((p) => cardIds.includes(p.card_id));
    },
});

// ============ GET COURSE PROGRESS ============
export const getCourseProgress = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("user_course_progress")
            .withIndex("by_user_and_course", (q) =>
                q.eq("user_id", args.userId).eq("course_id", args.courseId)
            )
            .first();
    },
});

// ============ UPDATE COURSE PROGRESS ============
export const updateCourseProgress = mutation({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
        cardsCompleted: v.number(),
        xpEarned: v.number(),
        isComplete: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("user_course_progress")
            .withIndex("by_user_and_course", (q) =>
                q.eq("user_id", args.userId).eq("course_id", args.courseId)
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                cards_completed: args.cardsCompleted,
                total_xp_earned: args.xpEarned,
                completed_at: args.isComplete ? Date.now() : existing.completed_at,
            });
        } else {
            await ctx.db.insert("user_course_progress", {
                user_id: args.userId,
                course_id: args.courseId,
                cards_completed: args.cardsCompleted,
                total_xp_earned: args.xpEarned,
                completed_at: args.isComplete ? Date.now() : undefined,
            });
        }
    },
});

// ============ GET COURSE PROGRESS PERCENTAGE ============
export const getCourseProgressPercentage = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        // Get all lessons in course
        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
            .collect();

        if (lessons.length === 0) return 0;

        // Get all cards in all lessons
        let totalCards = 0;
        let completedCards = 0;

        for (const lesson of lessons) {
            const cards = await ctx.db
                .query("cards")
                .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                .collect();

            totalCards += cards.length;

            // Check completed cards
            for (const card of cards) {
                const progress = await ctx.db
                    .query("user_card_progress")
                    .withIndex("by_user_and_card", (q) =>
                        q.eq("user_id", args.userId).eq("card_id", card._id)
                    )
                    .first();

                if (progress?.quiz_completed) {
                    completedCards++;
                }
            }
        }

        if (totalCards === 0) return 0;
        return Math.round((completedCards / totalCards) * 100);
    },
});

// ============ GET LESSON COMPLETION STATUS ============
export const getLessonCompletionStatus = query({
    args: {
        userId: v.id("users"),
        lessonId: v.id("lessons"),
    },
    handler: async (ctx, args) => {
        // Get all cards in lesson
        const cards = await ctx.db
            .query("cards")
            .withIndex("by_lesson", (q) => q.eq("lesson_id", args.lessonId))
            .collect();

        if (cards.length === 0) return { completed: false, total: 0, done: 0 };

        // Check completed cards
        let completedCount = 0;
        for (const card of cards) {
            const progress = await ctx.db
                .query("user_card_progress")
                .withIndex("by_user_and_card", (q) =>
                    q.eq("user_id", args.userId).eq("card_id", card._id)
                )
                .first();

            if (progress?.quiz_completed) {
                completedCount++;
            }
        }

        return {
            completed: completedCount === cards.length,
            total: cards.length,
            done: completedCount,
        };
    },
});

// ============ GET ALL LESSONS PROGRESS FOR COURSE ============
export const getLessonsProgressForCourse = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        // Get all lessons in course
        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
            .collect();

        const result: { lessonId: string; completed: boolean; total: number; done: number }[] = [];

        for (const lesson of lessons) {
            const cards = await ctx.db
                .query("cards")
                .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                .collect();

            let completedCount = 0;
            for (const card of cards) {
                const progress = await ctx.db
                    .query("user_card_progress")
                    .withIndex("by_user_and_card", (q) =>
                        q.eq("user_id", args.userId).eq("card_id", card._id)
                    )
                    .first();

                if (progress?.quiz_completed) {
                    completedCount++;
                }
            }

            result.push({
                lessonId: lesson._id,
                completed: cards.length > 0 && completedCount === cards.length,
                total: cards.length,
                done: completedCount,
            });
        }

        return result;
    },
});

// ============ GET ALL COURSES PROGRESS ============
// REFACTORED: Now reads from pre-computed user_course_progress table (O(courses))
// instead of calculating from cards (O(courses × lessons × cards))
export const getAllCoursesProgress = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Get all courses
        const courses = await ctx.db.query("courses").collect();

        // Get user's course progress entries (single query, efficient)
        const userCourseProgress = await ctx.db
            .query("user_course_progress")
            .withIndex("by_user", (q) => q.eq("user_id", args.userId))
            .collect();

        // Create a map for quick lookup
        const progressMap = new Map(
            userCourseProgress.map(p => [p.course_id, p])
        );

        const result: { courseId: string; progress: number; completed: boolean }[] = [];

        for (const course of courses) {
            const courseProgress = progressMap.get(course._id);

            if (courseProgress) {
                // Get total cards in course for percentage calculation
                const lessons = await ctx.db
                    .query("lessons")
                    .withIndex("by_course", (q) => q.eq("course_id", course._id))
                    .collect();

                let totalCards = 0;
                for (const lesson of lessons) {
                    const cardsCount = await ctx.db
                        .query("cards")
                        .withIndex("by_lesson", (q) => q.eq("lesson_id", lesson._id))
                        .collect();
                    totalCards += cardsCount.length;
                }

                const progressPercent = totalCards === 0
                    ? 0
                    : Math.round((courseProgress.cards_completed / totalCards) * 100);

                result.push({
                    courseId: course._id,
                    progress: progressPercent,
                    completed: !!courseProgress.completed_at
                });
            } else {
                // No progress for this course
                result.push({ courseId: course._id, progress: 0, completed: false });
            }
        }

        return result;
    },
});
