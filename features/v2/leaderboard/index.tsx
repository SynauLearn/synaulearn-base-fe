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

// Mock data for testing when not logged in
const MOCK_LEADERBOARD_DATA: LeaderboardUser[] = [
    { id: "1", username: "crypto_master", displayName: "crypto.base.eth", pfpUrl: null, totalXP: 100025, rank: 1 },
    { id: "2", username: "blockchain_bob", displayName: "oyen.base.eth", pfpUrl: null, totalXP: 99999, rank: 2 },
    { id: "3", username: "defi_queen", displayName: "roti.base.eth", pfpUrl: null, totalXP: 99990, rank: 3 },
    { id: "4", username: "web3_wizard", displayName: "jane.base.eth", pfpUrl: null, totalXP: 80000, rank: 4 },
    { id: "5", username: "nft_ninja", displayName: "nft.base.eth", pfpUrl: null, totalXP: 75000, rank: 5 },
    { id: "6", username: "eth_enthusiast", displayName: "eth.base.eth", pfpUrl: null, totalXP: 70000, rank: 6 },
    { id: "7", username: "base_builder", displayName: "base.base.eth", pfpUrl: null, totalXP: 65000, rank: 7 },
    { id: "8", username: "smart_contract", displayName: "smart.base.eth", pfpUrl: null, totalXP: 60000, rank: 8 },
    { id: "9", username: "token_trader", displayName: "token.base.eth", pfpUrl: null, totalXP: 55000, rank: 9 },
    { id: "10", username: "wallet_warrior", displayName: "wallet.base.eth", pfpUrl: null, totalXP: 50000, rank: 10 },
];

const LeaderboardPage = ({ onBack }: LeaderboardPageProps) => {
    const { user: authUser, isAuthenticated } = useUnifiedAuth();

    // Fetch leaderboard data from Convex
    const leaderboardData = useLeaderboard(50);
    const isLoading = leaderboardData === undefined && isAuthenticated;

    // Use mock data if not authenticated, otherwise use real data
    const useMockData = !isAuthenticated;

    // Transform and enrich data with ranks
    const users: LeaderboardUser[] = useMemo(() => {
        // If not authenticated, use mock data for testing
        if (useMockData) {
            return MOCK_LEADERBOARD_DATA;
        }

        if (!leaderboardData) return [];
        return leaderboardData.map((user, index) => {
            const isCurrentUser = authUser?.walletAddress?.toLowerCase() === user.wallet_address?.toLowerCase();
            return {
                id: user._id,
                username: user.username || null,
                displayName: user.display_name || null,
                // Use authUser pfpUrl for current user, null for others (schema doesn't have pfp_url yet)
                pfpUrl: isCurrentUser ? (authUser?.pfpUrl || null) : null,
                totalXP: user.total_xp,
                rank: index + 1,
                isCurrentUser,
            };
        });
    }, [leaderboardData, authUser, useMockData]);

    // Split into top 3 and rest
    const topThree = users.slice(0, 3);
    const restOfList = users.slice(3);

    // Find current user's data
    const currentUser = users.find(u => u.isCurrentUser);
    const currentUserRank = currentUser?.rank ?? (users.length > 0 ? users.length + 100 : null);

    if (isLoading) {
        return (
            <section className="relative w-full min-h-screen flex flex-col bg-white rounded-3xl overflow-hidden pb-32">
                {/* Shimmer Loading State */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

                {/* Podium Skeleton */}
                <div className="w-full h-[343px] bg-sapphire-100 rounded-t-3xl">
                    <div className="flex justify-center items-end gap-4 px-4 pt-20 h-full">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-full bg-white/40" />
                            <div className="h-4 w-20 bg-white/30 rounded" />
                            <div className="h-6 w-16 bg-white/30 rounded-lg" />
                        </div>
                        <div className="flex flex-col items-center gap-2 -mb-4">
                            <div className="w-20 h-20 rounded-full bg-white/50" />
                            <div className="h-4 w-20 bg-white/40 rounded" />
                            <div className="h-6 w-16 bg-white/40 rounded-lg" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-full bg-white/40" />
                            <div className="h-4 w-20 bg-white/30 rounded" />
                            <div className="h-6 w-16 bg-white/30 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* List Skeleton */}
                <div className="flex-1 bg-white px-4 py-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-3 border-b border-zinc-100">
                            <div className="w-8 h-4 rounded bg-zinc-100" />
                            <div className="flex-1 h-4 bg-zinc-100 rounded" />
                            <div className="w-20 h-4 bg-zinc-100 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full min-h-screen flex flex-col bg-white rounded-3xl overflow-y-auto pb-32 gap-5 py-5 px-2">
            {/* Top section with podium - matches Figma .subtractParent */}
            <TopPodium topThree={topThree} />

            {/* Ranking List - white background */}
            <div className="flex-1 bg-white">
                <RankingList users={restOfList} />
            </div>

            {/* Current User Sticky Banner - only show when logged in */}
            {currentUser && !useMockData && (
                <CurrentUserBanner user={currentUser} rank={currentUserRank || 0} />
            )}
        </section>
    );
};

export default LeaderboardPage;
