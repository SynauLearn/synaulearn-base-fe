import { query } from "./_generated/server";
import { v } from "convex/values";

// ============ GET LESSONS FOR COURSE ============
export const listByCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const lessons = await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("course_id", args.courseId))
            .collect();

        return lessons.sort((a, b) => a.lesson_number - b.lesson_number);
    },
});

// ============ GET SINGLE LESSON ============
export const get = query({
    args: { lessonId: v.id("lessons") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.lessonId);
    },
});
