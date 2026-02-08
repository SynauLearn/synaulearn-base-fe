import Link from "next/link";
import Image from "next/image";
import MailIcon from "@/assets/icons/mail.svg";
import { ChevronRight, User } from "lucide-react";
import CatGreeting from "@/assets/images/img-decoration-cat-home-greeting.svg";
import { Id } from "@/convex/_generated/dataModel";

interface GreetingsSectionProps {
  isNewUser?: boolean;
  username?: string;
  lastActiveCourse?: {
    id: Id<"courses">;
    title: string;
    lessonCount: number;
    progress: number;
  } | null;
  loading?: boolean;
  pfpUrl?: string | null;
  onContinueLearning?: () => void;
  onProfileClick?: () => void;
}

const GreetingsSection = ({
  isNewUser = true,
  username,
  lastActiveCourse,
  loading = false,
  pfpUrl,
  onContinueLearning,
  onProfileClick
}: GreetingsSectionProps) => {
  if (loading) {
    return (
      <section className="relative flex gap-2.5">
        <div className="relative w-full h-[245px] bg-[#DCE1FC] rounded-[32px] overflow-hidden">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

          {/* Skeleton content */}
          <div className="absolute top-5 left-6 flex flex-col gap-2">
            <div className="h-7 w-32 bg-white/40 rounded-lg" />
            <div className="h-4 w-48 bg-white/30 rounded" />
            <div className="h-3 w-40 bg-white/20 rounded" />
          </div>

          {/* Skeleton card */}
          <div className="absolute left-6 w-[180px] bottom-6 h-24 bg-white/50 rounded-[20px]" />
        </div>

        {/* Skeleton icons */}
        <div className="absolute right-2 top-0 flex gap-2.5">
          <div className="w-11 h-11 rounded-full bg-[#6B7CFF]/30" />
          <div className="w-11 h-11 rounded-full bg-[#DCE1FC]" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex gap-2.5">
      <div className="relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="371"
          height="245"
          viewBox="0 0 371 245"
          fill="none"
        >
          <path
            d="M225.5 0C241.24 0 254 12.7599 254 28.5C254 44.2401 266.76 57 282.5 57H339C356.673 57 371 71.3269 371 89V213C371 230.673 356.673 245 339 245H32C14.3269 245 0 230.673 0 213V32C0 14.3269 14.3269 0 32 0H225.5Z"
            fill="#DCE1FC"
          />
        </svg>

        <div className="absolute top-5 left-6 flex flex-col justify-center items-start gap-2">
          <h1 className="text-2xl font-extrabold text-graphite-700">
            {isNewUser ? "Welcome!" : "Welcome back!"}
          </h1>
          <h2 className="text-zinc-600 text-sm font-normal font-inter leading-5">
            Learn blockchain only 5 minutes <br /> Boca here, will judge you...
          </h2>
        </div>

        {/* Dynamic Card */}
        <div className="absolute left-6 w-[200px] bottom-6 flex flex-col items-start py-3 px-4 gap-3 rounded-[20px] bg-white shadow-sm">
          {!isNewUser && lastActiveCourse ? (
            // Returning User: Course Progress
            <button onClick={onContinueLearning} className="w-full text-left">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-full">
                    Continue Learning
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-800 leading-tight line-clamp-2">
                  {lastActiveCourse.title}
                </h3>
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${lastActiveCourse.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500">
                    {lastActiveCourse.progress}%
                  </span>
                </div>
              </div>
            </button>
          ) : (
            // New User: Welcome CTA
            <>
              <h2 className="text-sm font-extrabold text-zinc-800 leading-tight">
                Hey, genius. <br /> Ready to level up?
              </h2>
              <Link href="/courses">
                <div className="px-4 py-3 bg-zinc-800 rounded-full inline-flex justify-center items-center gap-1 min-w-[140px]">
                  <h3 className="font-normal text-xs text-white">Open Course</h3>
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </>
          )}
        </div>

        <Image
          src={CatGreeting}
          alt="Cat Greeting"
          width={300}
          height={300}
          className="absolute bottom-0 right-2 size-52"
        />
      </div>

      <div className="absolute right-2 top-0 flex gap-2.5">
        <button className="rounded-full bg-sapphire-400 p-2">
          <MailIcon className="size-7 text-white" />
        </button>
        <button
          onClick={onProfileClick}
          className={`rounded-full overflow-hidden ${pfpUrl ? 'w-11 h-11' : 'bg-sapphire-100 p-2'}`}
        >
          {pfpUrl ? (
            <img
              src={pfpUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="size-7 text-white" />
          )}
        </button>
      </div>
    </section>
  );
};

export default GreetingsSection;

