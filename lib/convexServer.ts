/**
 * Convex Server Utilities
 * 
 * Server-side functions for SSR with Convex.
 * Use these in Server Components for pre-rendering.
 */

import { preloadQuery, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Re-export for convenience
export { preloadQuery, fetchQuery };
export { api };

/**
 * Preload courses list for SSR
 * Returns preloaded data that can be hydrated on client
 */
export async function preloadCourses(language?: string) {
    return preloadQuery(api.courses.list, { language });
}

/**
 * Preload categories for SSR
 */
export async function preloadCategories() {
    return preloadQuery(api.categories.list, {});
}

/**
 * Preload leaderboard for SSR
 */
export async function preloadLeaderboard(limit: number = 50) {
    return preloadQuery(api.users.getLeaderboard, { limit });
}

/**
 * Fetch courses (non-reactive, pure SSR)
 */
export async function fetchCourses(language?: string) {
    return fetchQuery(api.courses.list, { language });
}

/**
 * Fetch categories (non-reactive, pure SSR)
 */
export async function fetchCategories() {
    return fetchQuery(api.categories.list, {});
}
