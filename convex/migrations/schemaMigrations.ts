import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Migration: Set course_number for existing courses
 * 
 * Run this once after deploying the schema change:
 * npx convex run migrations:setCourseNumbers
 */
export const setCourseNumbers = mutation({
    handler: async (ctx) => {
        // Get all courses ordered by creation date
        const courses = await ctx.db.query("courses").collect();

        // Sort by created_at to assign numbers in order of creation
        const sortedCourses = courses.sort((a, b) => a.created_at - b.created_at);

        let updated = 0;
        for (let i = 0; i < sortedCourses.length; i++) {
            const course = sortedCourses[i];
            const courseNumber = i + 1; // Start from 1

            // Only update if course_number is not set or different
            // @ts-ignore - course_number may not exist yet
            if (course.course_number !== courseNumber) {
                await ctx.db.patch(course._id, { course_number: courseNumber });
                updated++;
                console.log(`Set course_number ${courseNumber} for: ${course.title}`);
            }
        }

        return {
            totalCourses: courses.length,
            updated,
            message: `Migration complete. ${updated} courses updated.`
        };
    },
});

/**
 * Get the next available course number
 */
export const getNextCourseNumber = query({
    handler: async (ctx) => {
        const courses = await ctx.db.query("courses").collect();
        if (courses.length === 0) return 1;

        // @ts-ignore - course_number may not exist on older courses
        const maxNumber = Math.max(...courses.map(c => c.course_number ?? 0));
        return maxNumber + 1;
    },
});

/**
 * Migration: Add wallet_address to existing users
 * 
 * For users with fid > 0: Generate placeholder wallet (will be updated on next login)
 * For users with fid = 0: Extract wallet from username (if it's a wallet address)
 * 
 * Run this once after deploying the schema change:
 * npx convex run migrations:addWalletAddressToUsers
 */
export const addWalletAddressToUsers = mutation({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();

        let updated = 0;
        let skipped = 0;

        for (const user of users) {
            // @ts-ignore - wallet_address may not exist yet
            if (user.wallet_address) {
                skipped++;
                continue; // Already has wallet
            }

            let walletAddress: string | null = null;

            // Check if username looks like a wallet address
            if (user.username && user.username.startsWith('0x') && user.username.length === 42) {
                walletAddress = user.username.toLowerCase();
            } else if (user.username && user.username.includes('0x')) {
                // Try to extract wallet from username like "0xABC...1234"
                const match = user.username.match(/0x[a-fA-F0-9]{4,}/);
                if (match) {
                    // This is a truncated address, generate a placeholder
                    walletAddress = `placeholder_fid_${user.fid || user._id}_${Date.now()}`.toLowerCase();
                }
            }

            // Fallback: generate placeholder based on FID or user ID
            if (!walletAddress) {
                walletAddress = `placeholder_fid_${user.fid || 0}_${user._id}`.toLowerCase();
            }

            await ctx.db.patch(user._id, {
                wallet_address: walletAddress,
                updated_at: Date.now(),
            });

            console.log(`Added wallet ${walletAddress} to user: ${user.username || user._id}`);
            updated++;
        }


        return {
            totalUsers: users.length,
            updated,
            skipped,
            message: `Migration complete. ${updated} users updated, ${skipped} skipped.`
        };
    },
});

export const backfillCourseDetail = mutation({
    args: {},
    handler: async (ctx) => {
        const courses = await ctx.db.query("courses").collect();
        let count = 0;

        for (const course of courses) {
            // @ts-ignore
            if (course.course_detail === undefined) {
                // Default detail based on course title if possible, or generic
                let detail = "";
                if (course.title.includes("Base")) {
                    detail = `
# Tentang Kursus Ini

Pelajari dasar-dasar Base, blockchain Layer-2 yang aman, murah, dan developer-friendly yang dibangun di atas Ethereum.

## Apa yang akan Anda pelajari?
- Konsep dasar Layer-2 dan mengapa itu penting
- Cara menggunakan Base network
- Ekosistem dan tools di Base
- Tips keamanan dalam bertransaksi

## Untuk siapa kursus ini?
Kursus ini dirancang untuk pemula yang ingin memahami teknologi blockchain modern dan developer yang ingin mulai membangun di Base.
                    `.trim();
                } else if (course.title.includes("DeFi")) {
                    detail = `
# DeFi di Base

Jelajahi dunia Decentralized Finance (DeFi) di jaringan Base.

## Materi Kursus
- Pengenalan DEX (Decentralized Exchange)
- Landing & Borrowing protocols
- Yield Farming basics
- Manajemen risiko di DeFi
                    `.trim();
                } else {
                    detail = course.description || "Course detail coming soon.";
                }

                await ctx.db.patch(course._id, {
                    course_detail: detail,
                });
                count++;
            }
        }

        return { message: "Backfilled course_detail", count };
    },
});
