import Link from "next/link";
import Image from "next/image";
import PlaceholderIcon from "@/assets/icons/placeholder.svg";
import { ChevronRight, CheckCircle2, Circle } from "lucide-react";
import ImgDecorationDashboard from "@/assets/images/img-decoration-home-dashboard.svg";
import ImgCard1 from "@/assets/images/img-advanced-smart-contracts.svg";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface DashboardSectionProps {
  stats?: {
    totalXP: number;
    cardsMastered: number;
    coursesDone: number;
    streak: number;
  };
  dailyProgress?: {
    cardsCompletedToday: number;
    quizzesCorrect: number;
  };
  isNewUser?: boolean;
  recommendedCourses?: Doc<"courses">[];
  loading?: boolean;
  onOpenCourses?: () => void;
}

const DashboardSection = ({
  stats,
  dailyProgress,
  isNewUser = true,
  recommendedCourses = [],
  loading = false,
  onOpenCourses
}: DashboardSectionProps) => {

  if (loading) {
    return (
      <section className="relative flex flex-col gap-9 bg-gold-100 py-6 pb-24 px-4 w-full rounded-4xl min-h-dvh overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        {/* Learning Performance Skeleton */}
        <div className="flex flex-col w-full bg-graphite-700/20 rounded-3xl">
          <div className="flex flex-col bg-sapphire-100/60 rounded-3xl gap-4 px-4 py-6">
            <div className="flex flex-col gap-1">
              <div className="h-5 w-48 bg-white/40 rounded" />
              <div className="h-3 w-20 bg-white/30 rounded" />
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-16 bg-white/50 rounded-2xl" />
              <div className="flex-1 h-16 bg-white/50 rounded-2xl" />
              <div className="flex-1 h-16 bg-white/50 rounded-2xl" />
            </div>
          </div>
          <div className="h-8 bg-graphite-700/10 rounded-b-3xl" />
        </div>

        {/* Today's Quests Skeleton */}
        <div className="w-full pb-2 bg-zinc-800/20 rounded-3xl">
          <div className="px-4 py-6 bg-amber-200/60 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <div className="h-5 w-28 bg-white/40 rounded" />
              <div className="h-6 w-20 bg-zinc-800/20 rounded-full" />
            </div>
            <div className="h-32 bg-white/50 rounded-2xl" />
          </div>
        </div>

        {/* Recommended Courses Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-5 w-36 bg-white/40 rounded" />
          <div className="flex gap-3 overflow-hidden">
            <div className="shrink-0 w-72 h-40 bg-white/50 rounded-2xl" />
            <div className="shrink-0 w-72 h-40 bg-white/50 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  // Quests Logic
  const lessonQuestDone = (dailyProgress?.cardsCompletedToday || 0) >= 3; // Approx 3 cards = 1 lesson
  const quizQuestDone = (dailyProgress?.quizzesCorrect || 0) >= 3;

  return (
    // Your Learning Performance
    <section className="relative flex flex-col gap-9 bg-gold-100 py-6 pb-24 px-4 w-full rounded-4xl min-h-dvh overflow-clip">
      <Image
        src={ImgDecorationDashboard}
        alt="Decoration Dashboard"
        width={300}
        height={300}
        className="absolute w-[5.875rem] h-14 top-10 right-4"
      />

      {/* <div className="absolute left-0 top-10 w-52 h-26 bg-white/50 rounded-t-full z-10" /> */}

      <div className="flex flex-col w-full bg-graphite-700 rounded-3xl">
        <div className="flex flex-col bg-sapphire-100 rounded-3xl gap-4 px-4 py-6">
          <div className="flex flex-col items-start gap-1 text-graphite-700">
            <h2 className="font-bold">Your Learning Performance</h2>
            <p className="font-inter text-[0.625rem]">at a glance...</p>
          </div>
          <div className="flex items-stretch gap-2 w-full">
            {/* Cards Mastered */}
            <div className="flex-1 flex px-4 py-3 bg-white rounded-2xl justify-center items-center min-h-[80px]">
              <div className="flex flex-col items-center justify-center text-graphite-700">
                <h4 className="text-2xl font-bold">{stats?.cardsMastered || 0}</h4>
                <p className="font-inter text-[0.625rem] text-center leading-tight">Cards Mastered</p>
              </div>
            </div>
            {/* Courses Done */}
            <div className="flex-1 flex px-4 py-3 bg-white rounded-2xl justify-center items-center min-h-[80px]">
              <div className="flex flex-col items-center justify-center text-graphite-700">
                <h4 className="text-2xl font-bold">{stats?.coursesDone || 0}</h4>
                <p className="font-inter text-[0.625rem] text-center leading-tight">Courses Done</p>
              </div>
            </div>
            {/* Streak */}
            <div className="flex-1 flex px-4 py-3 bg-white rounded-2xl justify-center items-center min-h-[80px]">
              <div className="flex flex-col items-center justify-center text-graphite-700">
                <h4 className="text-2xl font-bold">{stats?.streak || 0}</h4>
                <p className="font-inter text-[0.625rem] text-center leading-tight">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2.5 py-2">
          <h3 className="font-bold text-[0.625rem] text-white">
            Boca said, &quot;Keep it up!&quot;
          </h3>
          <PlaceholderIcon className="size-3.5" />
        </div>
      </div>

      {/* Today's quests */}
      <div className="self-stretch w-full pb-2 bg-zinc-800 rounded-3xl inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
        <div className="self-stretch px-4 py-6 bg-amber-200 rounded-b-3xl flex flex-col justify-start items-start gap-4 overflow-hidden relative">
          <div className="self-stretch relative inline-flex justify-start items-start gap-1 z-10">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
              <div className="font-bold text-graphite-700">Today's quests</div>
              {!isNewUser && <div className="text-[10px] text-graphite-700">Do them. Get rewards. Repeat.</div>}
            </div>
            {!isNewUser && (
              <div
                className="px-3 py-1.5 bg-zinc-800 rounded-full flex items-center gap-1"
                aria-disabled="true"
              >
                <span className="text-[10px] font-bold text-white">Take Quests</span>
                <ChevronRight className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Background Decoration */}
          <div className="w-60 h-60 left-[-97px] top-[86px] absolute bg-white/50 rounded-full z-0" />

          <div className="self-stretch min-h-[100px] px-4 pt-6 pb-4 bg-white rounded-2xl flex flex-col justify-center items-center gap-3 z-10 w-full">
            {isNewUser ? (
              // New User: No Quests
              <>
                <div className="font-bold text-graphite-700">No quests right now</div>
                <div className="self-stretch text-center justify-center text-neutral-500 text-xs font-normal font-['Inter'] leading-4 line-clamp-2">Even heroes need a break.<br />Check back soon for new quests!</div>
                <Link href="/courses">
                  <div className="px-4 py-3 bg-zinc-800 rounded-full inline-flex justify-center items-center gap-1 min-w-[140px]">
                    <h3 className="font-normal text-xs text-white">Explore Lessons</h3>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              </>
            ) : (
              // Returning User: Checklist
              <div className="w-full flex flex-col gap-3">
                {/* Quest 1 */}
                <div className="flex items-center justify-between w-full p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-3">
                    {lessonQuestDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-zinc-300" />}
                    <span className={`text-xs ${lessonQuestDone ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>Complete 1 lesson</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">5 XP ⚡</span>
                </div>
                {/* Quest 2 */}
                <div className="flex items-center justify-between w-full p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-center gap-3">
                    {quizQuestDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-zinc-300" />}
                    <span className={`text-xs ${quizQuestDone ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>Answer 3 quizzes correctly</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">2 XP ⚡</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="inline-flex justify-center items-center gap-1">
          <h3 className="font-bold text-[0.625rem] text-white">
            {isNewUser ? 'Boca said, "Keep learning anyway!"' : 'Boca said, "I believe in you!"'}
          </h3>
          <PlaceholderIcon className="size-3.5" />
        </div>
      </div>

      {/* Recommended for you */}
      <div className="w-full inline-flex flex-col justify-start items-start gap-4">
        <h3 className="self-stretch text-zinc-800 text-base font-normal leading-5 px-1">Recommend For You</h3>
        <div className="w-full flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-2 px-2">
          {recommendedCourses.map((course) => (
            <div
              key={course._id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenCourses?.()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenCourses?.();
                }
              }}
              className="shrink-0 w-72 snap-start"
            >
              <div className="w-full px-3 py-3 bg-white rounded-2xl inline-flex flex-col justify-start items-start gap-2.5 shadow-sm">
                <div className="w-full inline-flex justify-between items-center">
                  <div className="px-2 py-1 bg-indigo-500 rounded-lg flex justify-center items-center gap-2.5">
                    <h3 className="justify-center text-white text-[10px] font-normal font-['Inter'] leading-3 line-clamp-1">
                      {course.category_id ? 'Crypto' : 'General'} {/* Fallback category name */}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="inline-flex justify-start items-center gap-2.5 w-full">
                  {course.emoji ? (
                    <div className="w-24 h-24 rounded-xl bg-orange-100 flex items-center justify-center text-4xl shrink-0">
                      {course.emoji}
                    </div>
                  ) : (
                    <Image
                      src={ImgCard1}
                      alt={course.title}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2 min-w-0">
                    <div className="w-full flex flex-col justify-start items-start gap-1">
                      <h3 className="w-full text-zinc-800 text-sm font-semibold leading-5 line-clamp-2">{course.title}</h3>
                      <h4 className="w-full text-zinc-600 text-[10px] font-normal leading-3 line-clamp-2">{course.description}</h4>
                    </div>
                    <div className="inline-flex justify-start items-center gap-2.5 flex-wrap">
                      <div className="justify-center text-zinc-800 text-[10px] font-normal font-['Inter'] leading-3">{course.total_lessons} Lessons</div>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <div className={`px-2 py-1 rounded-lg flex justify-center items-center gap-2.5 ${course.difficulty === 'Basic' ? 'bg-green-700' :
                        course.difficulty === 'Pro' ? 'bg-red-700' : 'bg-yellow-600'
                        }`}>
                        <div className="justify-center text-white text-[10px] font-medium font-['Bricolage_Grotesque'] leading-3">
                          {course.difficulty}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {recommendedCourses.length === 0 && (
            <div className="w-full text-center py-4 text-zinc-500 text-xs">
              No recommendations available.
            </div>
          )}
        </div>
      </div>
    </section >
  );
};

export default DashboardSection;
