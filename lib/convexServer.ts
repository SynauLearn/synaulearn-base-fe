/**
 * Convex Server Utilities
 * 
 * Server-side functions for SSR with Convex.
 * Use these in Server Components for pre-rendering.
 */

import { preloadQuery, fetchQuery } from "convex/nextjs";
import { unstable_cache } from "next/cache";
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

// ============================================
// CACHED VERSIONS (with ISR-like revalidation)
// ============================================

/**
 * Cached fetch for courses - revalidates every 60 seconds
 * Use this when you don't need real-time updates
 */
export const getCachedCourses = unstable_cache(
    async (language?: string) => {
        return fetchQuery(api.courses.list, { language });
    },
    ['courses-list'],
    {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['courses']
    }
);

/**
 * Cached fetch for categories - revalidates every 5 minutes
 * Categories change rarely
 */
export const getCachedCategories = unstable_cache(
    async () => {
        return fetchQuery(api.categories.list, {});
    },
    ['categories-list'],
    {
        revalidate: 300, // 5 minutes
        tags: ['categories']
    }
);

/**
 * Cached fetch for leaderboard - revalidates every 30 seconds
 */
export const getCachedLeaderboard = unstable_cache(
    async (limit: number = 50) => {
        return fetchQuery(api.users.getLeaderboard, { limit });
    },
    ['leaderboard'],
    {
        revalidate: 30,
        tags: ['leaderboard']
    }
);
