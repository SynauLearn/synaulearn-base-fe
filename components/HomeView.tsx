import React, { useState, useEffect, useMemo } from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import { SafeArea, useMiniKit } from '@coinbase/onchainkit/minikit';
import { useLocale } from '@/lib/LocaleContext';
import { useSIWFProfile } from './SignInWithFarcaster';
import {
  useUserByFid,
  useUserStats,
  useCourses,
  useAllCoursesProgress,
  useGetOrCreateUser,
  UserId
} from '@/lib/convexApi';

interface HomeProps {
  userName?: string;
}

interface CourseProgress {
  courseId: string;
  title: string;
  progress: number;
  emoji: string;
}

export default function HomeView({ userName = "User" }: HomeProps) {
  const { context } = useMiniKit();
  const { t } = useLocale();
  const siwfProfile = useSIWFProfile();

  // Get FID from MiniKit or SIWF
  const fid = context?.user?.fid || siwfProfile.fid;
  const fidUsername = context?.user?.username || siwfProfile.username;
  const fidDisplayName = context?.user?.displayName || siwfProfile.displayName;

  // Convex hooks
  const getOrCreateUser = useGetOrCreateUser();
  const convexUser = useUserByFid(fid);
  const courses = useCourses();

  const [convexUserId, setConvexUserId] = useState<UserId | null>(null);
  const userStats = useUserStats(convexUserId ?? undefined);
  const coursesProgress = useAllCoursesProgress(convexUserId ?? undefined);

  // Create or get user in Convex when FID is available
  useEffect(() => {
    async function ensureUser() {
      if (!fid) return;

      try {
        const user = await getOrCreateUser({
          fid,
          username: fidUsername || undefined,
          display_name: fidDisplayName || undefined,
        });
        if (user) {
          setConvexUserId(user._id);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

    ensureUser();
  }, [fid, fidUsername, fidDisplayName, getOrCreateUser]);

  // Build stats from Convex data
  const stats = useMemo(() => ({
    totalXP: userStats?.totalXP ?? 0,
    cardsCompleted: userStats?.cardsCompleted ?? 0,
    coursesCompleted: userStats?.coursesCompleted ?? 0,
    streak: 3, // TODO: Calculate real streak
  }), [userStats]);

  // Build courses in progress from Convex data
  const inProgressCourses = useMemo(() => {
    if (!courses || !coursesProgress) return [];

    // Create progress map
    const progressMap: Record<string, number> = {};
    for (const cp of coursesProgress) {
      progressMap[cp.courseId] = cp.progress;
    }

    // Get courses with progress between 0 and 100
    return courses
      .map(course => ({
        courseId: course._id,
        title: course.title,
        progress: progressMap[course._id] ?? 0,
        emoji: course.emoji || '📚',
      }))
      .filter(c => c.progress > 0 && c.progress < 100)
      .slice(0, 2); // Show max 2
  }, [courses, coursesProgress]);

  const loading = courses === undefined;

  if (loading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 dark:text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-100 mb-1">
          {t('home.welcomeBack')}, {userName}!
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">{t('home.continueLearning')}</p>
      </div>

      {/* Continue Learning Cards */}
      {inProgressCourses.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {inProgressCourses.map((course, index) => {
            const gradients = [
              'from-blue-500 via-purple-500 to-pink-500',
              'from-purple-600 via-pink-500 to-red-500',
            ];

            return (
              <div
                key={course.courseId}
                className="relative rounded-2xl overflow-hidden h-32 cursor-pointer group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]}`}></div>
                {/* <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div> */}
                <div className="relative h-full p-4 flex flex-col justify-end">
                  {/* <div className="text-3xl mb-2">{course.emoji}</div> */}
                  <SafeArea>
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {course.title}
                    </h3>
                  </SafeArea>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-xs font-medium">{course.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800/50 dark:bg-slate-800/70 border border-slate-700 dark:border-slate-600 rounded-2xl p-6 text-center">
          <p className="text-gray-400 dark:text-gray-400 mb-3">{t('home.noCoursesInProgress')}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">{t('home.startCoursePrompt')}</p>
        </div>
      )}

      {/* Daily Challenge */}
      {/* <WalletIsland /> */}
      {/* <ConnectWallet /> */}
      {/* <WalletComponents /> */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-slate-700 dark:border-slate-600">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-2">{t('home.dailyChallenge')}</h3>
            <p className="text-gray-400 dark:text-gray-400 text-sm mb-1">{t('home.dailyChallengeDesc')}</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs">{t('home.dailyChallengeSubtext')}</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all">
            {t('home.start')} →
          </button>
        </div>

        {/* Challenge Image/Illustration */}
        <div className="relative h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 dark:border-cyan-500/30">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Target className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Progress Snapshot */}
      <div>
        <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-4">{t('home.progressSnapshot')}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-800 dark:border-slate-700">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white dark:text-gray-100 mb-1">{stats.cardsCompleted}</div>
            <div className="text-xs text-gray-400 dark:text-gray-400">{t('home.cardsMastered')}</div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-800 dark:border-slate-700">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white dark:text-gray-100 mb-1">{stats.coursesCompleted}</div>
            <div className="text-xs text-gray-400 dark:text-gray-400">{t('home.coursesDone')}</div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-800 dark:border-slate-700">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 dark:bg-green-500/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white dark:text-gray-100 mb-1">{stats.streak}</div>
            <div className="text-xs text-gray-400 dark:text-gray-400">{t('home.dayStreak')}</div>
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <h3 className="text-white dark:text-gray-100 font-bold text-lg mb-4">{t('home.recommendedForYou')}</h3>
        <div className="space-y-3">
          {/* Course Card 1 */}
          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 border border-slate-800 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white dark:text-gray-100 font-semibold text-sm mb-1">{t('home.advancedSmartContracts')}</h4>
              <p className="text-gray-400 dark:text-gray-400 text-xs mb-2">
                {t('home.advancedSmartContractsDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-400 dark:text-blue-400">12 {t('home.lessons')}</span>
                <span className="text-gray-600 dark:text-gray-500">•</span>
                <span className="text-gray-400 dark:text-gray-400">{t('home.intermediate')}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              {t('home.start')}
            </button>
          </div>

          {/* Course Card 2 */}
          <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 border border-slate-800 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white dark:text-gray-100 font-semibold text-sm mb-1">{t('home.defiExplained')}</h4>
              <p className="text-gray-400 dark:text-gray-400 text-xs mb-2">
                {t('home.defiExplainedDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-blue-400 dark:text-blue-400">8 {t('home.lessons')}</span>
                <span className="text-gray-600 dark:text-gray-500">•</span>
                <span className="text-gray-400 dark:text-gray-400">{t('home.beginner')}</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              {t('home.start')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}