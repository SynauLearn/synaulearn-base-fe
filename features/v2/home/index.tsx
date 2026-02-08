import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useUserByFid, useUserByWallet } from "@/lib/convexApi";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import GreetingsSection from "./sections/GreetingsSection";
import DashboardSection from "./sections/DashboardSection";

interface HomePageProps {
  onNavigate?: (view: "home" | "courses" | "profile" | "leaderboard" | "balance" | "mintbadge") => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const { user: authUser, isLoading: isAuthLoading } = useUnifiedAuth();

  // Resolve Convex User
  // Prioritize wallet lookup, fall back to FID if available
  const walletUser = useUserByWallet(authUser?.walletAddress);
  const fidUser = useUserByFid(authUser?.fid);
  const convexUser = walletUser || fidUser;

  // Extract stable userId to prevent unnecessary re-renders
  const userId = convexUser?._id;

  // Fetch Home Stats - using useQuery directly for maximum reactivity
  // Convex queries are reactive and will auto-update when underlying data changes
  const homeStats = useQuery(
    api.users.getHomeStats,
    userId ? { userId } : "skip"
  );

  // Loading State: Auth loading OR (User exists but stats not loaded yet)
  const isLoading = isAuthLoading || (!!authUser && homeStats === undefined);

  // Default / Empty values if not loaded or no user
  const isNewUser = homeStats?.isNewUser ?? true;

  // Navigation handlers
  const handleContinueLearning = () => {
    onNavigate?.("courses");
  };

  const handleProfileClick = () => {
    onNavigate?.("profile");
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col gap-5 py-5 px-2">
      <GreetingsSection
        isNewUser={isNewUser}
        username={homeStats?.username}
        lastActiveCourse={homeStats?.lastActiveCourse}
        loading={isLoading}
        pfpUrl={authUser?.pfpUrl}
        onContinueLearning={handleContinueLearning}
        onProfileClick={handleProfileClick}
      />
      <DashboardSection
        stats={homeStats?.stats}
        dailyProgress={homeStats?.dailyProgress}
        isNewUser={isNewUser}
        recommendedCourses={homeStats?.recommendedCourses}
        loading={isLoading}
      />
    </section>
  );
};

export default HomePage;


