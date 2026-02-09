import { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Id } from "@/convex/_generated/dataModel";
import CourseCard from "./components/CourseCard";
import { useLocale } from "@/lib/LocaleContext";
import { useSIWFProfile } from "@/components/SignInWithFarcaster";
import {
  useAllCoursesProgress,
  useCategories,
  useCourses,
  useGetOrCreateUser,
  UserId,
} from "@/lib/convexApi";

import SearchIcon from "@/assets/icons/search.svg";
import FlagId from "@/assets/vector/flag-id.svg";
import FlagEn from "@/assets/images/flag-en.svg";
import CloudCourse from "@/assets/images/img-decoration-course-cloud.svg";
import CatCourse from "@/assets/images/img-decoration-cat-course.svg";
import CatPawCourse from "@/assets/images/img-decoration-catpaw-course.svg";
import MonitorCourse from "@/assets/images/img-decoration-course-pc.svg";
import FilterAndViewMode from "./components/FilterAndViewMode";
import LevelDrawer, { Level } from "./components/LevelDrawer";
import CourseDetail from "./sections/CourseDetailSection";
import LessonPageSection from "./sections/LessonSection";
import { CourseProvider } from "./contexts/CourseContext";

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

const CoursesPage: FC<CoursesPageProps> = ({
  setIsLessonStart,
  preloadedCourses,
  preloadedCategories,
}) => {
  const { t } = useLocale();
  const { context } = useMiniKit();
  const siwfProfile = useSIWFProfile();
  const { address, isConnected } = useAccount();

  // Get FID from MiniKit or SIWF
  const fid = context?.user?.fid || siwfProfile.fid;
  const username = context?.user?.username || siwfProfile.username;
  const displayName = context?.user?.displayName || siwfProfile.displayName;

  // Convex hooks - will be skipped if preloaded data provided
  const getOrCreateUser = useGetOrCreateUser();
  //   const convexUser = useUserByFid(fid);
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
    courseDescription: string;
  } | null>(null);

  // State for active lesson (cards view)
  const [selectedLesson, setSelectedLesson] = useState<{
    courseId: Id<"courses">;
    lessonId: Id<"lessons">;
    courseTitle: string;
  } | null>(null);

  // Auto-detect browser language on first load
  const [languageFilter, setLanguageFilter] = useState<"en" | "id" | "all">(
    () => {
      if (typeof window !== "undefined") {
        const browserLang = navigator.language.toLowerCase();
        return browserLang.startsWith("id") ? "id" : "en";
      }
      return "en";
    },
  );

  // Category/Difficulty filter
  const [levelDrawerOpen, setLevelDrawerOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState<Level[]>([]);

  // View mode: 'list' or 'category'
  const [viewMode, setViewMode] = useState<"list" | "category">("list");

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create or get user in Convex when wallet is connected
  useEffect(() => {
    async function ensureUser() {
      // Wallet is required for user creation
      if (!address || !isConnected) return;

      try {
        const user = await getOrCreateUser({
          wallet_address: address,
          fid: fid || undefined,
          username: username || undefined,
          display_name: displayName || undefined,
        });
        if (user) {
          setConvexUserId(user._id);
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

    ensureUser();
  }, [address, isConnected, fid, username, displayName, getOrCreateUser]);

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

    return courses.map((course: ConvexCourse) => ({
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
        courseDescription: course.description || "",
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

  // Filter courses based on selected language, difficulty, and search query
  const filteredCourses = coursesWithProgress.filter((course: ConvexCourse) => {
    // Filter by language
    const matchesLanguage =
      languageFilter === "all" || course.language === languageFilter;

    // Filter by difficulty
    const matchesDifficulty = course.difficulty === levelFilter[0];

    // Filter by search query (searches in title and description)
    const matchesSearch =
      searchQuery.trim() === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesDifficulty && matchesSearch;
  });

  return (
    <CourseProvider>
      {selectedLesson ? (
        <LessonPageSection
          lessonId={selectedLesson.lessonId as string}
          courseTitle={selectedLesson.courseTitle}
          onBack={handleBackToLessons}
          onComplete={handleLessonComplete}
        />
      ) : selectedCourseForLessons ? (
        <CourseDetail
          courseId={selectedCourseForLessons.courseId}
          courseTitle={selectedCourseForLessons.courseTitle}
          courseDescription={selectedCourseForLessons.courseDescription}
          userId={convexUserId}
          onBack={handleBackToCourses}
          onLessonSelect={handleLessonSelect}
        />
      ) : loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">{t("courses.loading")}</p>
        </div>
      ) : (
        <section className="relative min-h-screen w-full bg-sapphire-200/10 pt-5 overflow-y-auto">
          <div className="relative flex gap-2 px-5 z-20">
            <div className="p-4 bg-white rounded-2xl w-3/4">
              <div className="flex gap-2 items-center">
                <SearchIcon className="text-graphite-200 size-4" />
                <input
                  type="text"
                  className="font-inter text-xs w-full bg-white"
                  placeholder="Search by topic"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() =>
                setLanguageFilter(languageFilter === "en" ? "id" : "en")
              }
              className="px-4 flex gap-2.5 items-center bg-white rounded-2xl"
            >
              {languageFilter === "en" ? (
                <Image
                  src={FlagEn}
                  alt="English"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : languageFilter === "id" ? (
                <FlagId className="size-6" />
              ) : null}
              <h2 className="font-inter text-sm font-medium text-black uppercase">
                {languageFilter}
              </h2>
            </button>
          </div>

          <div className="w-full">
            <Image
              src={CloudCourse}
              alt="Cloud Course"
              width={300}
              height={300}
              className="relative top-3 left-0 w-39"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 size-130 bg-sapphire-200/20 rounded-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-86 bg-sapphire-200/30 rounded-full" />
            </div>
          </div>

          <div className="absolute top-72 flex flex-col bg-gold-100 min-h-dvh w-full py-6 px-5 rounded-t-[2.25rem] gap-6 z-50">
            <div className="absolute -top-34 right-4 z-10">
              <div className="flex gap-4">
                <Image
                  src={MonitorCourse}
                  alt="Monitor Course"
                  width={300}
                  height={300}
                  className="relative -top-6 w-36"
                />
                <div className="absolute top-0 right-31 bg-white rounded-full p-3 border-8 border-sapphire-400/9">
                  <p className="text-xs font-bold text-graphite-700">
                    Glad to see you here...
                  </p>
                </div>
                <div className="flex flex-col">
                  <Image
                    src={CatCourse}
                    alt="Cat Course"
                    width={300}
                    height={300}
                    className="top-0 right-0 w-44"
                  />
                  <Image
                    src={CatPawCourse}
                    alt="Cat Paw Course"
                    width={300}
                    height={300}
                    className="relative -top-10 right-0 w-44 object-contain"
                  />
                </div>
              </div>
            </div>

            <FilterAndViewMode
              viewMode={viewMode}
              setViewMode={setViewMode}
              levelFilter={levelFilter}
              onClickLevelDrawer={() => setLevelDrawerOpen(true)}
            />

            <div className="flex flex-col items-start gap-3">
              {coursesWithProgress.map(
                (course: ConvexCourse, index: number) => (
                  <CourseCard
                    key={course._id}
                    id={index + 1}
                    title={course.title}
                    description={course.description || ""}
                    progress={0}
                    image={course.emoji || "📚"}
                    onClick={() => handleCourseClick(course._id)}
                    totalLessons={course.total_lessons}
                    level={course.difficulty}
                    category={
                      categories?.find(
                        (c: ConvexCategory) => c._id === course.category_id,
                      )?.name
                    }
                  />
                ),
              )}
            </div>
          </div>

          <LevelDrawer
            open={levelDrawerOpen}
            value={levelFilter}
            onClose={() => setLevelDrawerOpen(false)}
            onApply={(selected) => {
              setLevelFilter(selected);
              setLevelDrawerOpen(false);
            }}
          />
        </section>
      )}
    </CourseProvider>
  );
};

export default CoursesPage;
