/**
 * Convex API Hooks
 * 
 * This file provides React hooks for accessing Convex data.
 * Use these hooks in React components instead of the old lib/api.ts
 */

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// ============ RE-EXPORT TYPES ============
export type UserId = Id<"users">;
export type CourseId = Id<"courses">;
export type LessonId = Id<"lessons">;
export type CardId = Id<"cards">;

// ============ USERS ============
export function useUserByWallet(wallet_address: string | undefined) {
    return useQuery(api.users.getByWallet, wallet_address ? { wallet_address } : "skip");
}

export function useUserByFid(fid: number | undefined) {
    return useQuery(api.users.getByFid, fid ? { fid } : "skip");
}

export function useUserStats(userId: UserId | undefined) {
    return useQuery(api.users.getStats, userId ? { userId } : "skip");
}

export function useLeaderboard(limit?: number) {
    return useQuery(api.users.getLeaderboard, { limit });
}

export function useGetOrCreateUser() {
    return useMutation(api.users.getOrCreate);
}

// ============ COURSES ============
export function useCourses(language?: string) {
    return useQuery(api.courses.list, { language });
}

export function useCourse(courseId: CourseId | undefined) {
    return useQuery(api.courses.get, courseId ? { courseId } : "skip");
}

export function useCoursesWithCategories(language?: string) {
    return useQuery(api.courses.listWithCategories, { language });
}

// ============ CATEGORIES ============
export function useCategories() {
    return useQuery(api.categories.list, {});
}

// ============ LESSONS ============
export function useLessonsByCourse(courseId: CourseId | undefined) {
    return useQuery(api.lessons.listByCourse, courseId ? { courseId } : "skip");
}

export function useLesson(lessonId: LessonId | undefined) {
    return useQuery(api.lessons.get, lessonId ? { lessonId } : "skip");
}

// ============ CARDS ============
export function useCardsByLesson(lessonId: LessonId | undefined) {
    return useQuery(api.cards.listByLesson, lessonId ? { lessonId } : "skip");
}

// ============ PROGRESS ============
export function useSaveCardProgress() {
    return useMutation(api.progress.saveCardProgress);
}

export function useUserProgressForLesson(userId: UserId | undefined, lessonId: LessonId | undefined) {
    return useQuery(
        api.progress.getUserProgressForLesson,
        userId && lessonId ? { userId, lessonId } : "skip"
    );
}

export function useCourseProgress(userId: UserId | undefined, courseId: CourseId | undefined) {
    return useQuery(
        api.progress.getCourseProgress,
        userId && courseId ? { userId, courseId } : "skip"
    );
}

export function useCourseProgressPercentage(userId: UserId | undefined, courseId: CourseId | undefined) {
    return useQuery(
        api.progress.getCourseProgressPercentage,
        userId && courseId ? { userId, courseId } : "skip"
    );
}

export function useUpdateCourseProgress() {
    return useMutation(api.progress.updateCourseProgress);
}

export function useLessonCompletionStatus(userId: UserId | undefined, lessonId: LessonId | undefined) {
    return useQuery(
        api.progress.getLessonCompletionStatus,
        userId && lessonId ? { userId, lessonId } : "skip"
    );
}

export function useLessonsProgressForCourse(userId: UserId | undefined, courseId: CourseId | undefined) {
    return useQuery(
        api.progress.getLessonsProgressForCourse,
        userId && courseId ? { userId, courseId } : "skip"
    );
}

export function useAllCoursesProgress(userId: UserId | undefined) {
    return useQuery(
        api.progress.getAllCoursesProgress,
        userId ? { userId } : "skip"
    );
}

// ============ BADGES ============
export function useUserBadges(userId: UserId | undefined) {
    return useQuery(api.badges.getUserBadges, userId ? { userId } : "skip");
}

export function useHasMintedBadge(userId: UserId | undefined, courseId: CourseId | undefined) {
    return useQuery(
        api.badges.hasMintedBadge,
        userId && courseId ? { userId, courseId } : "skip"
    );
}

export function useSaveMintedBadge() {
    return useMutation(api.badges.saveMintedBadge);
}

export function useDeleteMintedBadge() {
    return useMutation(api.badges.deleteMintedBadge);
}
