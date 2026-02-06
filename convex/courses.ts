import { query } from "./_generated/server";
import { v } from "convex/values";

// ============ GET ALL COURSES ============
export const list = query({
    args: {
        language: v.optional(v.string()),
        difficulty: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let courses;

        if (args.language) {
            courses = await ctx.db
                .query("courses")
                .withIndex("by_language", (q) => q.eq("language", args.language!))
                .collect();
        } else {
            courses = await ctx.db.query("courses").collect();
        }

        // Filter by difficulty if provided
        if (args.difficulty) {
            courses = courses.filter((c) => c.difficulty === args.difficulty);
        }

        // Sort by created_at
        return courses.sort((a, b) => a.created_at - b.created_at);
    },
});

// ============ GET SINGLE COURSE ============
export const get = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.courseId);
    },
});

// ============ GET COURSES WITH CATEGORIES ============
export const listWithCategories = query({
    args: { language: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let courses;

        if (args.language) {
            courses = await ctx.db
                .query("courses")
                .withIndex("by_language", (q) => q.eq("language", args.language!))
                .collect();
        } else {
            courses = await ctx.db.query("courses").collect();
        }

        // Fetch categories for each course
        const coursesWithCategories = await Promise.all(
            courses.map(async (course) => {
                let category = null;
                if (course.category_id) {
                    category = await ctx.db.get(course.category_id);
                }
                return { ...course, category };
            })
        );

        return coursesWithCategories.sort((a, b) => a.created_at - b.created_at);
    },
});
