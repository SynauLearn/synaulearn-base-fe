import { query, mutation } from "./_generated/server";
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

// ============ ADMIN FUNCTIONS ============

export const listByCourseId = query({
    args: { course_id: v.id("courses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("lessons")
            .withIndex("by_course", (q) => q.eq("course_id", args.course_id))
            .collect();
    },
});

export const getById = query({
    args: { id: v.id("lessons") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        course_id: v.id("courses"), // Fixed: Match schema type
        lesson_number: v.number(),
        description: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const createdAt = Date.now();
        return await ctx.db.insert("lessons", {
            ...args,
            created_at: createdAt,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("lessons"),
        title: v.optional(v.string()),
        lesson_number: v.optional(v.number()),
        description: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("lessons") },
    handler: async (ctx, args) => {
        // Ideally delete cards too, but keeping it simple for now
        await ctx.db.delete(args.id);
    },
});
