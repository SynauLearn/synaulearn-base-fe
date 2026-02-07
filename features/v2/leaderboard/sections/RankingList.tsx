import { Heart, Turtle } from "lucide-react";

interface RankingUser {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl?: string | null;
    totalXP: number;
    rank: number;
    isCurrentUser?: boolean;
}

interface RankingListProps {
    users: RankingUser[];
}

const RankingList = ({ users }: RankingListProps) => {
    const getDisplayName = (user: RankingUser) => {
        return user.displayName || user.username || "Anonymous";
    };

    const formatXP = (xp: number) => {
        return xp.toLocaleString();
    };

    // Alternate between heart and turtle icons
    const getRankIcon = (rank: number) => {
        return rank % 2 === 0 ? (
            <Turtle className="w-4 h-4 text-emerald-500" />
        ) : (
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
        );
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                <span className="text-4xl mb-2">🏆</span>
                <span className="text-sm">Be the first to climb the ranks!</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-zinc-100 px-4 py-2 overflow-y-auto max-h-[50vh]">
            {users.map((user) => (
                <div
                    key={user.id}
                    className={`flex items-center gap-3 py-3 ${user.isCurrentUser ? "bg-sapphire-50 -mx-4 px-4 rounded-xl" : ""
                        }`}
                >
                    {/* Rank Icon */}
                    <div className="flex items-center gap-1.5 w-12">
                        {getRankIcon(user.rank)}
                        <span className="text-sm font-medium text-zinc-600">
                            #{user.rank}
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 shrink-0">
                        {user.pfpUrl ? (
                            <img
                                src={user.pfpUrl}
                                alt={getDisplayName(user)}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-500">
                                {getDisplayName(user).charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <span className={`flex-1 text-sm truncate ${user.isCurrentUser ? "font-bold text-zinc-800" : "text-zinc-700"
                        }`}>
                        {getDisplayName(user)}
                        {user.isCurrentUser && <span className="text-zinc-500 ml-1">(You)</span>}
                    </span>

                    {/* XP */}
                    <div className="flex items-center gap-1">
                        <span className={`text-sm font-bold ${user.isCurrentUser ? "text-blue-600" : "text-blue-500"
                            }`}>
                            {formatXP(user.totalXP)} XP
                        </span>
                        <span className="text-xs">⚡</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RankingList;
