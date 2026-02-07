import Image from "next/image";

// Import SVG assets
import LightningIcon from "@/assets/icons/lightning-icon.png";
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

interface CurrentUserBannerProps {
    user: LeaderboardUser;
    rank: number;
}

// Format XP with commas
const formatXP = (xp: number): string => {
    return xp.toLocaleString();
};

// Get display name
const getDisplayName = (user: LeaderboardUser): string => {
    return user.displayName || user.username || `User ${user.id.slice(-4)}`;
};

const CurrentUserBanner = ({ user, rank }: CurrentUserBannerProps) => {
    const displayRank = rank > 100 ? '#100+' : `#${rank}`;

    return (
        <div className="fixed bottom-24 left-0 right-0 px-3 z-50">
            <div
                className="flex items-center justify-center h-14 px-4 py-4 gap-2.5 rounded-2xl"
                style={{ backgroundColor: '#2D2D2D' }}
            >
                {/* Left section: Rank + Username */}
                <div className="flex-1 flex items-center gap-3">
                    {/* Rank badge */}
                    <div className="flex items-center gap-1">
                        <Image
                            src={RankPolygonPink}
                            alt=""
                            width={18}
                            height={8}
                            className="flex-shrink-0"
                        />
                        <span className="w-12 text-xs font-bold text-white leading-[135%]">
                            {displayRank}
                        </span>
                    </div>

                    {/* Username with (You) */}
                    <span className="flex-1 text-xs font-semibold font-inter text-white truncate leading-[135%]">
                        {getDisplayName(user)} (You)
                    </span>
                </div>

                {/* Right section: XP */}
                <div className="flex items-center justify-center gap-1 text-white">
                    <span className="text-xs font-extrabold leading-[135%]">
                        {formatXP(user.totalXP)} XP
                    </span>
                    <Image
                        src={LightningIcon}
                        alt=""
                        width={9}
                        height={16}
                        className="w-2.5 h-4 brightness-0 invert"
                    />
                </div>
            </div>
        </div>
    );
};

export default CurrentUserBanner;
