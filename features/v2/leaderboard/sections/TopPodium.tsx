import Image from "next/image";
import BocaMascot from "@/assets/images/img-decoration-cat-leaderboard.svg"; // Placeholder for Boca

interface TopPodiumUser {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl?: string | null;
    totalXP: number;
    rank: number;
}

interface TopPodiumProps {
    topThree: TopPodiumUser[];
}

const TopPodium = ({ topThree }: TopPodiumProps) => {
    const getDisplayName = (user: TopPodiumUser) => {
        return user.displayName || user.username || "Anonymous";
    };

    const formatXP = (xp: number) => {
        if (xp >= 1000) {
            return `${(xp / 1000).toFixed(1).replace(/\.0$/, '')}k`;
        }
        return xp.toLocaleString();
    };

    // Reorder for podium display: [2nd, 1st, 3rd]
    const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

    const getRankBadgeColor = (rank: number) => {
        switch (rank) {
            case 1: return "bg-blue-600";
            case 2: return "bg-emerald-500";
            case 3: return "bg-amber-500";
            default: return "bg-zinc-400";
        }
    };

    const getAvatarSize = (rank: number) => {
        return rank === 1 ? "w-24 h-24" : "w-20 h-20";
    };

    const getRankNumberSize = (rank: number) => {
        return rank === 1 ? "text-3xl" : "text-2xl";
    };

    return (
        <div className="relative flex justify-center items-end gap-2 px-4 pb-8 pt-4">
            {/* Background decorations */}
            <div className="absolute top-2 left-1/4 w-3 h-3 text-xl">✨</div>
            <div className="absolute top-8 right-1/4 w-3 h-3 text-xl">✨</div>
            <div className="absolute top-4 right-1/3 w-2 h-2 text-sm">✨</div>

            {podiumOrder.map((user, index) => {
                if (!user) return null;
                const isFirst = user.rank === 1;

                return (
                    <div
                        key={user.id}
                        className={`flex flex-col items-center gap-1 ${isFirst ? "-mb-4" : ""}`}
                    >
                        {/* Avatar */}
                        <div className={`relative ${getAvatarSize(user.rank)} rounded-full overflow-hidden border-4 ${user.rank === 1 ? "border-blue-400" :
                            user.rank === 2 ? "border-emerald-400" : "border-amber-400"
                            } bg-gradient-to-br from-zinc-200 to-zinc-300`}>
                            {user.pfpUrl ? (
                                <img
                                    src={user.pfpUrl}
                                    alt={getDisplayName(user)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                                    {getDisplayName(user).charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Username */}
                        <span className="text-xs font-medium text-zinc-700 max-w-[80px] truncate text-center">
                            {getDisplayName(user).length > 12
                                ? getDisplayName(user).slice(0, 10) + "..."
                                : getDisplayName(user)}
                        </span>

                        {/* XP Badge */}
                        <div className={`px-2 py-1 ${getRankBadgeColor(user.rank)} rounded-full flex items-center gap-1`}>
                            <span className="text-[10px] font-bold text-white">
                                {formatXP(user.totalXP)} XP
                            </span>
                            <span className="text-[10px]">⚡</span>
                        </div>

                        {/* Rank Number */}
                        <span className={`${getRankNumberSize(user.rank)} font-extrabold ${user.rank === 1 ? "text-blue-600" :
                            user.rank === 2 ? "text-emerald-500" : "text-amber-500"
                            }`}>
                            {user.rank}
                        </span>
                    </div>
                );
            })}

            {/* Boca Mascot */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 z-10">
                <Image
                    src={BocaMascot}
                    alt="Boca"
                    width={80}
                    height={80}
                    className="w-20 h-20"
                />
            </div>
        </div>
    );
};

export default TopPodium;
