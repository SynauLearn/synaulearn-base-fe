'use client';

import React from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Lock, Play } from 'lucide-react';
import { useLessonsByCourse, useCourseProgressPercentage, useLessonsProgressForCourse, UserId } from '@/lib/convexApi';
import { Id } from '@/convex/_generated/dataModel';
import { useLocale } from '@/lib/LocaleContext';

interface LessonListProps {
    courseId: Id<"courses">;
    courseTitle: string;
    courseEmoji: string;
    userId?: UserId | null;
    onBack: () => void;
    onLessonSelect: (lessonId: Id<"lessons">, lessonTitle: string) => void;
}

export default function LessonList({
    courseId,
    courseTitle,
    courseEmoji,
    userId,
    onBack,
    onLessonSelect,
}: LessonListProps) {
    const { t } = useLocale();
    const lessons = useLessonsByCourse(courseId);
    const courseProgress = useCourseProgressPercentage(userId ?? undefined, courseId);
    const lessonsProgress = useLessonsProgressForCourse(userId ?? undefined, courseId);

    const loading = lessons === undefined;

    // Create a map of lesson progress for easy lookup
    const progressMap = React.useMemo(() => {
        const map: Record<string, { completed: boolean; total: number; done: number }> = {};
        if (lessonsProgress) {
            for (const lp of lessonsProgress) {
                map[lp.lessonId] = { completed: lp.completed, total: lp.total, done: lp.done };
            }
        }
        return map;
    }, [lessonsProgress]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading lessons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 pb-6">
                <div className="px-4 pt-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                </div>

                <div className="px-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                            {courseEmoji}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{courseTitle}</h1>
                            <p className="text-white/70">{lessons.length} lessons</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/70">Progress</span>
                            <span className="text-white font-medium">{courseProgress ?? 0}%</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${courseProgress ?? 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lessons List */}
            <div className="px-4 py-6 space-y-3">
                <h2 className="text-lg font-semibold text-white mb-4">Lessons</h2>

                {lessons.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No lessons available yet</p>
                    </div>
                ) : (
                    lessons.map((lesson, index) => {
                        const progress = progressMap[lesson._id];
                        const isCompleted = progress?.completed ?? false;
                        const cardsDone = progress?.done ?? 0;
                        const cardsTotal = progress?.total ?? 0;
                        const isLocked = false; // Can implement sequential locking later

                        return (
                            <button
                                key={lesson._id}
                                onClick={() => !isLocked && onLessonSelect(lesson._id, lesson.title)}
                                disabled={isLocked}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${isCompleted
                                    ? 'bg-green-900/30 border border-green-500/30'
                                    : isLocked
                                        ? 'bg-slate-900/50 opacity-60 cursor-not-allowed'
                                        : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
                                    }`}
                            >
                                {/* Lesson Number */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCompleted
                                    ? 'bg-green-500 text-white'
                                    : isLocked
                                        ? 'bg-slate-700 text-gray-500'
                                        : 'bg-blue-600 text-white'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : isLocked ? (
                                        <Lock className="w-4 h-4" />
                                    ) : (
                                        lesson.lesson_number
                                    )}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 text-left">
                                    <h3 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {isCompleted
                                            ? `✓ ${cardsTotal} cards completed`
                                            : cardsDone > 0
                                                ? `${cardsDone}/${cardsTotal} cards`
                                                : `${cardsTotal} cards`
                                        }
                                    </p>
                                </div>

                                {/* Play Icon or Completed */}
                                {!isLocked && !isCompleted && (
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-blue-400 fill-blue-400" />
                                    </div>
                                )}

                                {isCompleted && (
                                    <span className="text-sm text-green-400 font-medium">Completed</span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

