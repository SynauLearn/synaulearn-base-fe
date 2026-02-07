import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useLeaderboard } from "@/lib/convexApi";
import { useMemo } from "react";
import TopPodium from "./sections/TopPodium";
import RankingList from "./sections/RankingList";
import CurrentUserBanner from "./sections/CurrentUserBanner";

interface LeaderboardPageProps {
    onBack?: () => void;
}

interface LeaderboardUser {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl?: string | null;
    totalXP: number;
    rank: number;
    isCurrentUser?: boolean;
}

const LeaderboardPage = ({ onBack }: LeaderboardPageProps) => {
    const { user: authUser, isLoading: isAuthLoading } = useUnifiedAuth();

    // Fetch leaderboard data from Convex
    const leaderboardData = useLeaderboard(50);
    const isLoading = leaderboardData === undefined;

    // Transform and enrich data with ranks
    const users: LeaderboardUser[] = useMemo(() => {
        if (!leaderboardData) return [];
        return leaderboardData.map((user, index) => ({
            id: user._id,
            username: user.username || null,
            displayName: user.display_name || null,
            pfpUrl: null, // TODO: Add pfpUrl to user schema if needed
            totalXP: user.total_xp,
            rank: index + 1,
            isCurrentUser: authUser?.walletAddress?.toLowerCase() === user.wallet_address?.toLowerCase(),
        }));
    }, [leaderboardData, authUser]);

    // Split into top 3 and rest
    const topThree = users.slice(0, 3);
    const restOfList = users.slice(3);

    // Find current user's data
    const currentUser = users.find(u => u.isCurrentUser);
    const currentUserRank = currentUser?.rank ?? (users.length > 0 ? users.length + 100 : null);

    if (isLoading) {
        return (
            <section className="relative w-full min-h-screen flex flex-col bg-sapphire-100 pb-32">
                {/* Shimmer Loading State */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

                {/* Header Skeleton */}
                <div className="px-4 pt-6 pb-4">
                    <div className="h-12 w-56 bg-white/40 rounded-2xl" />
                </div>

                {/* Podium Skeleton */}
                <div className="flex justify-center items-end gap-4 px-4 pb-8 pt-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-white/40" />
                        <div className="h-4 w-20 bg-white/30 rounded" />
                        <div className="h-6 w-16 bg-white/30 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2 -mb-4">
                        <div className="w-24 h-24 rounded-full bg-white/50" />
                        <div className="h-4 w-24 bg-white/40 rounded" />
                        <div className="h-6 w-20 bg-white/40 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-white/40" />
                        <div className="h-4 w-20 bg-white/30 rounded" />
                        <div className="h-6 w-16 bg-white/30 rounded-full" />
                    </div>
                </div>

                {/* List Skeleton */}
                <div className="flex-1 bg-white rounded-t-3xl px-4 py-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-3 border-b border-zinc-100">
                            <div className="w-8 h-8 rounded-full bg-zinc-100" />
                            <div className="flex-1 h-4 bg-zinc-100 rounded" />
                            <div className="w-20 h-4 bg-zinc-100 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full min-h-screen flex flex-col bg-sapphire-100 pb-32">
            {/* Header */}
            <div className="px-4 pt-6 pb-4 flex items-center justify-between">
                <div className="px-4 py-3 bg-white rounded-2xl shadow-sm">
                    <span className="text-sm font-medium text-zinc-800">
                        Here's my favorite learners...
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button className="w-11 h-11 rounded-full bg-sapphire-400 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </button>
                    <button className="w-11 h-11 rounded-full bg-sapphire-400/50 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            <TopPodium topThree={topThree} />

            {/* Ranking List */}
            <div className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                <RankingList users={restOfList} />
            </div>

            {/* Current User Sticky Banner */}
            {currentUser && (
                <CurrentUserBanner user={currentUser} rank={currentUserRank || 0} />
            )}
        </section>
    );
};

export default LeaderboardPage;
