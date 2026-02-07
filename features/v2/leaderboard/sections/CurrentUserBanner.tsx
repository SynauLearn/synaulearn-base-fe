import { Heart } from "lucide-react";

interface CurrentUserBannerProps {
    user: {
        id: string;
        username: string | null;
        displayName: string | null;
        pfpUrl?: string | null;
        totalXP: number;
    };
    rank: number;
}

const CurrentUserBanner = ({ user, rank }: CurrentUserBannerProps) => {
    const getDisplayName = () => {
        return user.displayName || user.username || "You";
    };

    const formatXP = (xp: number) => {
        return xp.toLocaleString();
    };

    const formatRank = (rank: number) => {
        if (rank > 100) return "#100+";
        return `#${rank}`;
    };

    return (
        <div className="fixed bottom-20 left-2 right-2 z-20">
            <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                {/* Rank Icon */}
                <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    <span className="text-sm font-bold text-white">
                        {formatRank(rank)}
                    </span>
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shrink-0">
                    {user.pfpUrl ? (
                        <img
                            src={user.pfpUrl}
                            alt={getDisplayName()}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                            {getDisplayName().charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Username */}
                <span className="flex-1 text-sm font-medium text-white truncate">
                    {getDisplayName()} <span className="text-zinc-400">(You)</span>
                </span>

                {/* XP */}
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-amber-400">
                        {formatXP(user.totalXP)} XP
                    </span>
                    <span className="text-xs">⚡</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentUserBanner;
