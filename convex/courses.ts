import { query, mutation } from "./_generated/server";
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

        // Exclude demo courses from production listing
        courses = courses.filter((c) => c.is_demo !== true);

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

        // Exclude demo courses from production listing
        courses = courses.filter((c) => c.is_demo !== true);

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

// ============ ADMIN FUNCTIONS ============

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("courses").collect();
    },
});

export const getById = query({
    args: { id: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        category_id: v.optional(v.id("categories")), // Fixed: Match schema type
        language: v.string(),
        difficulty: v.string(),
        emoji: v.string(),
        total_lessons: v.number(),
        slug: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const createdAt = Date.now();
        return await ctx.db.insert("courses", {
            ...args,
            created_at: createdAt,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("courses"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        category_id: v.optional(v.id("categories")), // Fixed: Match schema type
        language: v.optional(v.string()),
        difficulty: v.optional(v.string()),
        emoji: v.optional(v.string()),
        total_lessons: v.optional(v.number()),
        slug: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("courses") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
