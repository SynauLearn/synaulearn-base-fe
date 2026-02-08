import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // ============ USERS ============
    users: defineTable({
        wallet_address: v.optional(v.string()),  // PRIMARY identifier (optional during migration)
        fid: v.optional(v.number()),          // Farcaster ID (optional, for enrichment)
        username: v.optional(v.string()),
        display_name: v.optional(v.string()),
        total_xp: v.number(),
        created_at: v.number(),               // timestamp
        updated_at: v.number(),
    })
        .index("by_wallet", ["wallet_address"])  // Primary lookup
        .index("by_fid", ["fid"]),               // Secondary lookup for Farcaster

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
        course_number: v.optional(v.number()), // Unique numeric ID for smart contract
        created_at: v.number(),
    })
        .index("by_language", ["language"])
        .index("by_difficulty", ["difficulty"])
        .index("by_category", ["category_id"])
        .index("by_course_number", ["course_number"]),

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
        // Quiz (DEPRECATED - kept for migration rollback, use quizzes table)
        quiz_question: v.optional(v.string()),
        quiz_option_a: v.optional(v.string()),
        quiz_option_b: v.optional(v.string()),
        quiz_option_c: v.optional(v.string()),
        quiz_option_d: v.optional(v.string()),
        quiz_correct_answer: v.optional(v.string()), // 'A' | 'B' | 'C' | 'D'
        created_at: v.number(),
    })
        .index("by_lesson", ["lesson_id"])
        .index("by_lesson_and_number", ["lesson_id", "card_number"]),

    // ============ QUIZZES ============
    quizzes: defineTable({
        card_id: v.id("cards"),
        quiz_type: v.string(), // 'multiple_choice' | 'true_false' | 'fill_blank'
        question: v.string(),

        // Multiple Choice specific (optional - only used when quiz_type = 'multiple_choice')
        options: v.optional(v.array(v.object({
            id: v.string(),  // 'A', 'B', 'C', 'D'
            text: v.string(),
        }))),

        // Universal answer field
        // For multiple_choice: 'A' | 'B' | 'C' | 'D'
        // For true_false: 'true' | 'false'
        // For fill_blank: the exact answer text
        correct_answer: v.string(),

        // Fill-in-the-Blank specific (optional)
        acceptable_answers: v.optional(v.array(v.string())), // Alternative correct answers
        hint: v.optional(v.string()), // Optional hint for fill-blank

        created_at: v.number(),
    })
        .index("by_card", ["card_id"])
        .index("by_type", ["quiz_type"]),

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
