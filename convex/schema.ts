import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ============ USERS ============
    users: defineTable({
        fid: v.number(), // Farcaster ID
        username: v.optional(v.string()),
        display_name: v.optional(v.string()),
        total_xp: v.number(),
        created_at: v.number(), // timestamp
        updated_at: v.number(),
    })
        .index("by_fid", ["fid"]),

    // ============ CATEGORIES ============
    categories: defineTable({
        name: v.string(), // English name
        name_id: v.string(), // Indonesian name
        description: v.optional(v.string()),
        description_id: v.optional(v.string()),
        emoji: v.optional(v.string()),
        slug: v.string(),
        order_index: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_order", ["order_index"]),

    // ============ COURSES ============
    courses: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        emoji: v.optional(v.string()),
        language: v.string(), // 'en' | 'id'
        difficulty: v.string(), // 'Basic' | 'Advanced' | 'Professional'
        category_id: v.optional(v.id("categories")),
        total_lessons: v.number(),
        created_at: v.number(),
    })
        .index("by_language", ["language"])
        .index("by_difficulty", ["difficulty"])
        .index("by_category", ["category_id"]),

    // ============ LESSONS ============
    lessons: defineTable({
        course_id: v.id("courses"),
        title: v.string(),
        lesson_number: v.number(),
        created_at: v.number(),
    })
        .index("by_course", ["course_id"])
        .index("by_course_and_number", ["course_id", "lesson_number"]),

    // ============ CARDS ============
    cards: defineTable({
        lesson_id: v.id("lessons"),
        card_number: v.number(),
        // Flashcard
        flashcard_question: v.string(),
        flashcard_answer: v.string(),
        // Quiz
        quiz_question: v.string(),
        quiz_option_a: v.string(),
        quiz_option_b: v.string(),
        quiz_option_c: v.string(),
        quiz_option_d: v.string(),
        quiz_correct_answer: v.string(), // 'A' | 'B' | 'C' | 'D'
        created_at: v.number(),
    })
        .index("by_lesson", ["lesson_id"])
        .index("by_lesson_and_number", ["lesson_id", "card_number"]),

    // ============ USER CARD PROGRESS ============
    user_card_progress: defineTable({
        user_id: v.id("users"),
        card_id: v.id("cards"),
        flashcard_viewed: v.boolean(),
        quiz_completed: v.boolean(),
        quiz_correct: v.boolean(),
        xp_earned: v.number(),
        completed_at: v.optional(v.number()),
    })
        .index("by_user", ["user_id"])
        .index("by_card", ["card_id"])
        .index("by_user_and_card", ["user_id", "card_id"]),

    // ============ USER COURSE PROGRESS ============
    user_course_progress: defineTable({
        user_id: v.id("users"),
        course_id: v.id("courses"),
        cards_completed: v.number(),
        total_xp_earned: v.number(),
        completed_at: v.optional(v.number()),
    })
        .index("by_user", ["user_id"])
        .index("by_course", ["course_id"])
        .index("by_user_and_course", ["user_id", "course_id"]),

    // ============ MINTED BADGES ============
    minted_badges: defineTable({
        user_id: v.id("users"),
        course_id: v.id("courses"),
        wallet_address: v.string(),
        token_id: v.string(),
        tx_hash: v.string(),
        minted_at: v.number(),
    })
        .index("by_user", ["user_id"])
        .index("by_course", ["course_id"])
        .index("by_wallet", ["wallet_address"])
        .index("by_user_and_course", ["user_id", "course_id"]),
});
