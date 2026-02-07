import Image from "next/image";

// Import SVG assets
import LightningIcon from "@/assets/icons/lightning-icon.svg";
import RankPolygonGreen from "@/assets/images/leaderboard/rank-polygon-green.svg";
import RankPolygonPink from "@/assets/images/leaderboard/rank-polygon-pink.svg";

interface LeaderboardUser {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl?: string | null;
    totalXP: number;
    rank: number;
    isCurrentUser?: boolean;
}

interface RankingListProps {
    users: LeaderboardUser[];
}

// Format XP with commas
const formatXP = (xp: number): string => {
    return xp.toLocaleString();
};

// Get display name
const getDisplayName = (user: LeaderboardUser): string => {
    return user.displayName || user.username || `User ${user.id.slice(-4)}`;
};

const RankingList = ({ users }: RankingListProps) => {
    if (users.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center py-12">
                <p className="text-zinc-400 text-sm">No more rankings to show</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full px-3 pt-2">
            {users.map((user, index) => {
                // Alternate between pink and green polygons
                const isEvenRank = user.rank % 2 === 0;
                const PolygonSrc = isEvenRank ? RankPolygonGreen : RankPolygonPink;

                return (
                    <div
                        key={user.id}
                        className={`
                            flex items-center h-12 px-4 py-4 gap-2.5 rounded-2xl bg-white
                            ${user.isCurrentUser ? 'ring-2 ring-sapphire-400' : ''}
                        `}
                    >
                        {/* Left section: Rank + Username */}
                        <div className="flex-1 flex items-center gap-3">
                            {/* Rank badge with polygon */}
                            <div className="flex items-center gap-1">
                                <Image
                                    src={PolygonSrc}
                                    alt=""
                                    width={18}
                                    height={8}
                                    className="flex-shrink-0"
                                />
                                <span className="w-9 text-xs font-bold text-zinc-800 leading-[135%]">
                                    #{user.rank}
                                </span>
                            </div>

                            {/* Username */}
                            <span className="flex-1 text-xs font-normal font-inter text-zinc-800 truncate leading-[135%]">
                                {getDisplayName(user)}
                                {user.isCurrentUser && (
                                    <span className="text-sapphire-500 ml-1">(You)</span>
                                )}
                            </span>
                        </div>

                        {/* Right section: XP */}
                        <div className="flex items-center justify-center gap-1 text-sapphire-500">
                            <span className="text-xs font-extrabold leading-[135%]">
                                {formatXP(user.totalXP)} XP
                            </span>
                            <Image
                                src={LightningIcon}
                                alt=""
                                width={9}
                                height={16}
                                className="w-2.5 h-4"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RankingList;
