"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { LocaleProvider } from "@/lib/LocaleContext";
// import Header from "@/components/Header";
// import BottomNav from "@/components/BottomNav";
// import HomeView from "@/components/HomeView";
import ErudaDebugger from "@/components/ErudaDebugger";
import { api } from "@/convex/_generated/api";
import BottomBar from "@/components/v2/BottomBar";
import HomePage from "@/features/v2/home";

// Lazy load non-critical components
const WelcomeModal = lazy(() => import("@/components/WelcomeModal"));
const Drawer = lazy(() => import("@/components/Drawer"));
const LeaderboardPage = lazy(() => import("@/features/v2/leaderboard"));
const CoursesPage = lazy(() => import("@/features/Courses"));

// Dynamic import with SSR disabled for wallet-heavy components
// This prevents wallet code from being included in initial SSR bundle
const Profile = dynamic(() => import("@/components/Profile"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});
const MintBadge = dynamic(() => import("@/components/MintBadge"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});
const MyBalance = dynamic(() => import("@/components/MyBalance"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

interface ClientAppProps {
  preloadedCourses: Preloaded<typeof api.courses.list>;
  preloadedCategories: Preloaded<typeof api.categories.list>;
}

export default function ClientApp({
  preloadedCourses,
  preloadedCategories,
}: ClientAppProps) {
  const { setMiniAppReady, isMiniAppReady, isFrameReady, setFrameReady } =
    useMiniKit();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<
    "home" | "courses" | "profile" | "leaderboard" | "balance" | "mintbadge"
  >("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [_isLessonStart, setIsLessonStart] = useState(false);
  const { context } = useMiniKit();

  // Hydrate preloaded data - courses will be reactive after hydration
  const courses = usePreloadedQuery(preloadedCourses);
  const categories = usePreloadedQuery(preloadedCategories);

  // Initialize app and handle splash screen
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is first-time visitor
        const userId = context?.user?.fid || "browser_user";
        const storageKey = `synaulearn_welcome_${userId}`;
        const hasSeenWelcome =
          typeof window !== "undefined"
            ? localStorage.getItem(storageKey)
            : null;

        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }

        // Mark app as ready - this hides the Farcaster splash screen
        setIsLoading(false);

        // Tell Farcaster frame is ready
        if (!isFrameReady) {
          setFrameReady();
        }

        // Tell MiniKit the app is ready
        if (!isMiniAppReady) {
          setMiniAppReady();
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [context, isFrameReady, setFrameReady, isMiniAppReady, setMiniAppReady]);

  const handleWelcomeComplete = () => {
    // Save that user has seen the welcome
    const userId = context?.user?.fid || "browser_user";
    const storageKey = `synaulearn_welcome_${userId}`;
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }

    setShowWelcome(false);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(
      view as
      | "home"
      | "courses"
      | "profile"
      | "leaderboard"
      | "balance"
      | "mintbadge",
    );
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  // Show loading state while app initializes
  // Note: Farcaster will show the splash screen during this time
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 dark:text-gray-500">
            Loading SynauLearn...
          </p>
        </div>
      </div>
    );
  }

  // Render different views based on currentView
  const renderView = () => {
    switch (currentView) {
      case "leaderboard":
        return <LeaderboardPage />;

      case "profile":
        return <Profile onBack={handleBackToHome} />;

      case "courses":
        return (
          <CoursesPage
            setIsLessonStart={setIsLessonStart}
            preloadedCourses={courses}
            preloadedCategories={categories}
          />
        );

      case "mintbadge":
        return <MintBadge onBack={handleBackToHome} />;

      case "balance":
        return <MyBalance onBack={handleBackToHome} />;

      default:
        return (
          //   <HomeView
          //     userName={
          //       context?.user?.displayName || context?.user?.username || "User"
          //     }
          //   />
          <HomePage onNavigate={setCurrentView} />
        );
    }
  };

  return (
    <LocaleProvider>
      {/* Eruda Debug Console - remove in production */}
      <ErudaDebugger enabled={true} />
      {/* Welcome Modal for first-time users */}
      {showWelcome && (
        <Suspense fallback={null}>
          <WelcomeModal onComplete={handleWelcomeComplete} />
        </Suspense>
      )}

      {/* Drawer Navigation */}
      <Suspense fallback={null}>
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentView={currentView}
          onNavigate={handleNavigate}
          onMintBadgeClick={() => {
            setIsDrawerOpen(false);
            handleNavigate("mintbadge");
          }}
        />
      </Suspense>

      {/* Main App */}
      <main className="relative w-full min-h-screen">
        {/* Global Header - shown on all tabs */}
        {/* <Header onMenuClick={() => setIsDrawerOpen(true)} /> */}

        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          {renderView()}
        </Suspense>
        <BottomBar currentView={currentView} onNavigate={handleNavigate} />
      </main>
    </LocaleProvider>
  );
}
