import React from "react";
import BadgeCard, { BadgeStatus } from "../components/BadgeCard";

export interface BadgeItem {
    id: string;
    title: string;
    status: BadgeStatus;
    image?: string;
}

interface BadgeListProps {
    badges: BadgeItem[];
    onMintBadge: (id: string) => void;
}

const BadgeList = ({ badges, onMintBadge }: BadgeListProps) => {
    if (badges.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <p>No badges found</p>
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
                />
            ))}
        </div>
    );
};

export default BadgeList;
