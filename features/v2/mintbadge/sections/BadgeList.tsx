import BadgeCard, { BadgeStatus } from "../components/BadgeCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BadgeItem {
    id: string;
    title: string;
    status: BadgeStatus;
    image?: string;
}

interface BadgeListProps {
    badges: BadgeItem[];
    onMintBadge: (id: string) => void;
    // Base App path
    isBaseApp?: boolean;
    getMintCallsForCourse?: (courseId: string) => () => Promise<any[]>;
    onMintSuccess?: (courseId: string) => void;
    onMintError?: (error: Error) => void;
    debugInfo?: string;
}

const BadgeList = ({
    badges,
    onMintBadge,
    isBaseApp,
    getMintCallsForCourse,
    onMintSuccess,
    onMintError,
    debugInfo,
}: BadgeListProps) => {
    if (badges.length === 0) {
        return (
            <div className="w-full max-w-[425px] sm:max-w-[520px] md:max-w-[720px] lg:max-w-[960px] mx-auto px-4 text-center">
                <div className="bg-white rounded-[24px] p-6 sm:p-12 shadow-sm flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Your badge shelf is... empty.
                    </h3>
                    <p className="text-gray-500 text-[13px]">
                        Complete a course and mint your first on-chain proof.
                    </p>
                    <p className="text-gray-500 text-[13px] mb-4 ">
                        Boca believes in your potential.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center bg-[#282828] text-white px-6 py-3 rounded-full text-sm font-normal hover:bg-black transition-colors"
                    >
                        Take a Lessons <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[13px] sm:gap-4 pb-24 max-w-[400px] sm:max-w-[520px] md:max-w-[720px] lg:max-w-[960px] mx-auto">
            {badges.map((badge) => (
                <BadgeCard
                    key={badge.id}
                    title={badge.title}
                    status={badge.status}
                    image={badge.image}
                    onMint={() => onMintBadge(badge.id)}
                    isBaseApp={isBaseApp}
                    callsCallback={
                        isBaseApp && getMintCallsForCourse
                            ? getMintCallsForCourse(badge.id)
                            : undefined
                    }
                    onMintSuccess={
                        onMintSuccess
                            ? () => onMintSuccess(badge.id)
                            : undefined
                    }
                    onMintError={onMintError}
                    debugInfo={debugInfo}
                />
            ))}
        </div>
    );
};

export default BadgeList;
