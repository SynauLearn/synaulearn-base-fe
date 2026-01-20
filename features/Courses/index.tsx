import { useEffect, useState, useMemo } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

// Local type definition (moved from supabase)
type DifficultyLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Professional';
import Categories from "./components/Categories";
import CourseCard from "./components/CourseCard";
import LessonPage from "./components/LessonPage";
import LessonList from "./components/LessonList";
import LanguageFilter from "./components/LanguageFilter";
import CategoryAccordion from "./components/CategoryAccordion";
import { useLocale } from '@/lib/LocaleContext';
import { List, Grid3x3, Search, X } from 'lucide-react';
import { useSIWFProfile } from "@/components/SignInWithFarcaster";
import {
  useCourses,
  useCategories,
  useUserByFid,
  useGetOrCreateUser,
  useAllCoursesProgress,
  CourseId,
  UserId
} from "@/lib/convexApi";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

// Type for course from Convex (matches schema.ts)
type ConvexCourse = {
  _id: Id<"courses">;
  _creationTime: number;
  title: string;
  description?: string;
  emoji?: string;
  language: string;
  difficulty: string;
  category_id?: Id<"categories">;
  total_lessons: number;
  created_at: number;
};

// Type for category from Convex (matches schema.ts)
type ConvexCategory = {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
  name_id: string;
  description?: string;
  description_id?: string;
  emoji?: string;
  slug: string;
  order_index: number;
};

interface CoursesPageProps {
  setIsLessonStart: React.Dispatch<React.SetStateAction<boolean>>;
  // Optional: preloaded data from SSR
  preloadedCourses?: ConvexCourse[];
  preloadedCategories?: ConvexCategory[];
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  setIsLessonStart,
  preloadedCourses,
  preloadedCategories
}) => {
  const { t } = useLocale();
  const { context } = useMiniKit();
  const siwfProfile = useSIWFProfile();

  // Get FID from MiniKit or SIWF
  const fid = context?.user?.fid || siwfProfile.fid;
  const username = context?.user?.username || siwfProfile.username;
  const displayName = context?.user?.displayName || siwfProfile.displayName;

  // Convex hooks - will be skipped if preloaded data provided
  const getOrCreateUser = useGetOrCreateUser();
  const convexUser = useUserByFid(fid);
  const hookCourses = useCourses();
  const hookCategories = useCategories();

  // Use preloaded data if available, otherwise use hooks
  const courses = preloadedCourses ?? hookCourses;
  const categories = preloadedCategories ?? hookCategories;

  const [convexUserId, setConvexUserId] = useState<UserId | null>(null);
  const coursesProgress = useAllCoursesProgress(convexUserId ?? undefined);

  // State for showing lesson list (intermediate step)
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<{
    courseId: Id<"courses">;
    courseTitle: string;
    courseEmoji: string;
  } | null>(null);

  // State for active lesson (cards view)
  const [selectedLesson, setSelectedLesson] = useState<{
    courseId: Id<"courses">;
    lessonId: Id<"lessons">;
    courseTitle: string;
  } | null>(null);

  // Auto-detect browser language on first load
  const [languageFilter, setLanguageFilter] = useState<'en' | 'id' | 'all'>(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('id') ? 'id' : 'en';
    }
    return 'en';
  });

  // Category/Difficulty filter
  const [categoryFilter, setCategoryFilter] = useState<DifficultyLevel>('Basic');

  // View mode: 'list' or 'category'
  const [viewMode, setViewMode] = useState<'list' | 'category'>('category');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create or get user in Convex when FID is available
  useEffect(() => {
    async function ensureUser() {
      if (!fid) return;

      try {
        const user = await getOrCreateUser({
          fid,
          username: username || undefined,
          display_name: displayName || undefined,
        });
        if (user) {
          setConvexUserId(user._id);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

    ensureUser();
  }, [fid, username, displayName, getOrCreateUser]);

  // Build courses with progress from database
  const coursesWithProgress = useMemo(() => {
    if (!courses) return [];

    // Create a map of course progress for easy lookup
    const progressMap: Record<string, number> = {};
    if (coursesProgress) {
      for (const cp of coursesProgress) {
        progressMap[cp.courseId] = cp.progress;
      }
    }

    return courses.map(course => ({
      ...course,
      id: course._id,
      progress: progressMap[course._id] ?? 0,
    }));
  }, [courses, coursesProgress]);

  // Loading state
  const loading = courses === undefined;

  // Handle course click - show lesson list
  const handleCourseClick = (courseId: string) => {
    const course = coursesWithProgress.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourseForLessons({
        courseId: courseId as Id<"courses">,
        courseTitle: course.title,
        courseEmoji: course.emoji || '📚',
      });
      setIsLessonStart(true);
    }
  };

  // Handle lesson selection from LessonList
  const handleLessonSelect = (lessonId: Id<"lessons">, lessonTitle: string) => {
    if (selectedCourseForLessons) {
      setSelectedLesson({
        courseId: selectedCourseForLessons.courseId,
        lessonId: lessonId,
        courseTitle: selectedCourseForLessons.courseTitle,
      });
    }
  };

  // Handle back from lesson cards to lesson list
  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  // Handle back from lesson list to courses
  const handleBackToCourses = () => {
    setSelectedCourseForLessons(null);
    setSelectedLesson(null);
    setIsLessonStart(false);
  };

  const handleLessonComplete = () => {
    alert("Lesson completed!");
    setSelectedLesson(null); // Go back to lesson list after completing
  };

  // Show LessonPage (cards) when a specific lesson is selected
  if (selectedLesson) {
    return (
      <LessonPage
        lessonId={selectedLesson.lessonId as string}
        courseTitle={selectedLesson.courseTitle}
        onBack={handleBackToLessons}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Show LessonList when a course is selected
  if (selectedCourseForLessons) {
    return (
      <LessonList
        courseId={selectedCourseForLessons.courseId}
        courseTitle={selectedCourseForLessons.courseTitle}
        courseEmoji={selectedCourseForLessons.courseEmoji}
        userId={convexUserId}
        onBack={handleBackToCourses}
        onLessonSelect={handleLessonSelect}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">{t('courses.loading')}</p>
      </div>
    );
  }

  // Filter courses based on selected language, difficulty, and search query
  const filteredCourses = coursesWithProgress.filter(course => {
    // Filter by language
    const matchesLanguage = languageFilter === 'all' || course.language === languageFilter;

    // Filter by difficulty
    const matchesDifficulty = course.difficulty === categoryFilter;

    // Filter by search query (searches in title and description)
    const matchesSearch = searchQuery.trim() === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="flex flex-col p-4 gap-6">
      <h1 className="text-3xl font-bold text-white dark:text-gray-100">{t('courses.title')}</h1>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('courses.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-3 bg-slate-800 dark:bg-slate-800 border border-slate-700 dark:border-slate-600 rounded-xl text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>

      {/* Language Filter */}
      <LanguageFilter
        selected={languageFilter}
        onChange={setLanguageFilter}
      />

      {/* Difficulty Category Filter (only in list view) */}
      {viewMode === 'list' && (
        <Categories
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('category')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'category'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
        >
          <Grid3x3 className="w-4 h-4" />
          {t('courses.viewByCategory')}
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'list'
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
        >
          <List className="w-4 h-4" />
          {t('courses.viewAsList')}
        </button>
      </div>

      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {languageFilter === 'id'
                ? t('courses.noCoursesIndonesian')
                : t('courses.noCoursesEnglish')}
            </p>
          </div>
        ) : viewMode === 'category' ? (
          <CategoryAccordion
            categories={(categories || []).map(c => ({
              id: c._id as string,
              name: c.name,
              name_id: c.name_id,
              emoji: c.emoji || '',
              slug: c.slug,
              order_index: c.order_index,
              description: c.description || '',
              description_id: c.description_id || '',
            }))}
            courses={filteredCourses.map(c => ({
              id: c._id as string,
              title: c.title,
              description: c.description || '',
              emoji: c.emoji || '',
              language: c.language,
              difficulty: c.difficulty,
              category_id: c.category_id as string | null | undefined,
              total_lessons: c.total_lessons,
              progressPercentage: c.progress
            }))}
            onCourseClick={handleCourseClick}
          />
        ) : (
          filteredCourses.map((course, index) => {
            return (
              <CourseCard
                key={course._id}
                id={index + 1}
                title={course.title}
                description={course.description || ''}
                progress={course.progress}
                image={course.emoji || '📚'}
                onClick={() => handleCourseClick(course._id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
