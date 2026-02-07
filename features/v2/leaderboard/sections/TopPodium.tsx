import Image from "next/image";
import { Calendar, Target } from "lucide-react";

// Import SVG assets
import LightningIcon from "@/assets/icons/lightning-icon.png";
import PodiumBackground from "@/assets/images/leaderboard/podium-background.svg";
import DecorativeVector from "@/assets/images/leaderboard/decorative-vector.svg";
import CloudLeft from "@/assets/images/leaderboard/cloud-left.svg";
import CloudRight from "@/assets/images/leaderboard/cloud-right.svg";
import BocaMascot from "@/assets/images/leaderboard/boca-mascot.svg";

interface LeaderboardUser {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl?: string | null;
    totalXP: number;
    rank: number;
    isCurrentUser?: boolean;
}

interface TopPodiumProps {
    topThree: LeaderboardUser[];
}

// Format XP with commas
const formatXP = (xp: number): string => {
    return xp.toLocaleString();
};

// Get display name
const getDisplayName = (user: LeaderboardUser): string => {
    return user.displayName || user.username || `User ${user.id.slice(-4)}`;
};

const TopPodium = ({ topThree }: TopPodiumProps) => {
    // Reorder: [2nd, 1st, 3rd] for visual layout
    const [first, second, third] = [
        topThree[0], // 1st place
        topThree[1], // 2nd place
        topThree[2], // 3rd place
    ];

    // Podium card component matching Figma design
    const PodiumCard = ({
        user,
        rank,
        height
    }: {
        user: LeaderboardUser | undefined;
        rank: number;
        height: string;
    }) => {
        if (!user) return null;

        return (
            <div
                className="flex flex-col items-center p-1 gap-1 rounded-t-[51px]"
                style={{
                    width: rank === 1 ? '91px' : '90px',
                    height: height,
                    background: 'linear-gradient(180deg, #FFFFFF 36.54%, #DCE1FC 100%)',
                }}
            >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-sapphire-200 flex-shrink-0">
                    {user.pfpUrl ? (
                        <img
                            src={user.pfpUrl}
                            alt={getDisplayName(user)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            👤
                        </div>
                    )}
                </div>

                {/* Username */}
                <div className="w-full text-center text-xs font-semibold font-inter text-zinc-800 truncate px-1">
                    {getDisplayName(user)}
                </div>

                {/* XP Badge */}
                <div
                    className="flex items-center justify-center gap-1 px-2 py-1 rounded-lg"
                    style={{
                        background: 'linear-gradient(90deg, #6F86F3 0%, #0A1D75 100%)',
                    }}
                >
                    <span className="text-[10px] font-semibold text-white whitespace-nowrap">
                        {formatXP(user.totalXP)} XP
                    </span>
                    <Image
                        src={LightningIcon}
                        alt="XP"
                        width={8}
                        height={14}
                        className="w-2 h-3.5"
                    />
                </div>

                {/* Rank Number */}
                <div className="text-[32px] font-semibold text-sapphire-500 leading-tight">
                    {rank}
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full overflow-hidden" style={{ height: '390px' }}>
            {/* Background shape from Figma */}
            <Image
                src={PodiumBackground}
                alt="Podium Background"
                fill
                className="object-cover"
                priority
            />

            {/* Decorative vector (10% opacity) */}
            <div className="absolute -left-16 -top-10 w-[500px] h-[545px] opacity-10">
                <Image
                    src={DecorativeVector}
                    alt="Decorative Vector"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Cloud decoration left */}
            <div className="absolute top-[97px] -left-2 w-[94px] h-[55px]">
                <Image
                    src={CloudLeft}
                    alt="Cloud Left"
                    width={94}
                    height={55}
                />
            </div>

            {/* Cloud decoration right */}
            <div className="absolute top-[119px] -right-2 w-[94px] h-[55px]">
                <Image
                    src={CloudRight}
                    alt="Cloud Right"
                    width={94}
                    height={55}
                />
            </div>

            {/* Action buttons top right - using Lucide React icons */}
            <div className="absolute top-0 right-3 flex gap-2.5">
                <button className="w-12 h-12 rounded-full bg-sapphire-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 rounded-full bg-sapphire-400/50 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Header bubble */}
            <div
                className="absolute top-[14px] left-3 rounded-2xl bg-white flex flex-col items-start px-3 py-3"
                style={{
                    border: '8px solid rgba(111, 134, 243, 0.09)',
                }}
            >
                <span className="text-xs font-bold text-zinc-800 leading-[135%]">
                    Here&apos;s my favorite learners...
                </span>
            </div>

            {/* Podium Container - positioned at bottom */}
            <div className="absolute bottom-[45px] left-0 right-0 flex justify-center items-end gap-5 px-4">
                {/* 2nd Place - Left */}
                <PodiumCard user={second} rank={2} height="223px" />

                {/* 1st Place - Center (tallest) */}
                <PodiumCard user={first} rank={1} height="271px" />

                {/* 3rd Place - Right */}
                <PodiumCard user={third} rank={3} height="191px" />
            </div>

            {/* Boca Mascot - positioned at bottom center, overlapping podiums */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[183px] h-[106px] pointer-events-none">
                <Image
                    src={BocaMascot}
                    alt="Boca Mascot"
                    width={183}
                    height={106}
                    priority
                />
            </div>
        </div>
    );
};

export default TopPodium;
