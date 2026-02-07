import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useHomeStats, useUserByFid, useUserByWallet } from "@/lib/convexApi";
import GreetingsSection from "./sections/GreetingsSection";
import DashboardSection from "./sections/DashboardSection";

const HomePage = () => {
  const { user: authUser, isLoading: isAuthLoading } = useUnifiedAuth();

  // Resolve Convex User
  // Prioritize wallet lookup, fall back to FID if available
  const walletUser = useUserByWallet(authUser?.walletAddress);
  const fidUser = useUserByFid(authUser?.fid);
  const convexUser = walletUser || fidUser;

  // Fetch Home Stats
  const homeStats = useHomeStats(convexUser?._id);

  // Loading State: Auth loading OR (User exists but stats not loaded yet)
  const isLoading = isAuthLoading || (!!authUser && homeStats === undefined);

  // Default / Empty values if not loaded or no user
  const isNewUser = homeStats?.isNewUser ?? true;

  return (
    <section className="relative w-full min-h-screen flex flex-col gap-5 py-5 px-2">
      <GreetingsSection
        isNewUser={isNewUser}
        username={homeStats?.username}
        lastActiveCourse={homeStats?.lastActiveCourse}
        loading={isLoading}
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
