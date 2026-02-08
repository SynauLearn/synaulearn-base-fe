import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import HeaderBackground from "@/assets/images/mintbadge/header-background.svg";

export type FilterType = 'all' | 'unlocked' | 'minted' | 'locked';

interface MintHeaderProps {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    stats: {
        all: number;
        unlocked: number;
        minted: number;
        locked: number;
    };
}

const MintHeader = ({ filter, onFilterChange, stats }: MintHeaderProps) => {
    const tabs: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'unlocked', label: 'Unlocked' },
        { id: 'minted', label: 'Minted' },
        { id: 'locked', label: 'Locked' },
    ];

    return (
        <div className="relative w-full max-w-[400px] sm:max-w-[420px] md:max-w-[520px] h-[197px] sm:h-[220px] md:h-[260px] mx-auto mb-6">
            <Image src={HeaderBackground} alt="Header Background" fill className="object-cover rounded-[20px]" priority />

            <div className="absolute top-[19px] left-4 sm:left-6 flex flex-col items-start gap-3 z-10">
                <h1 className="text-[24px] sm:text-[26px] md:text-[28px] font-extrabold text-white leading-[135%] font-bricolage-grotesque">
                    Your Badges
                </h1>
                <p className="w-[220px] sm:w-[260px] text-[14px] sm:text-[15px] text-white leading-[135%] opacity-80">
                    Track what you've minted, what's ready, and what still needs work
                </p>
            </div>

            <div className="absolute top-[145px] sm:top-[156px] md:top-[188px] sm:left-6 h-13 w-[320px] sm:w-[320px] md:w-[380px] bg-white rounded-[20px] p-1 shadow-[0px_2px_20px_rgba(0,_0,_0,_0.04)] flex items-center text-center text-[14px] text-[#888]">
                {tabs.map((tab) => {
                    const isActive = filter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onFilterChange(tab.id)}
                            className={`flex-1 h-full rounded-[16px] font-semibold transition-all px-2 ${isActive
                                    ? 'bg-[#F5E187] text-darkslategray shadow-[0px_2px_20px_rgba(0,_0,_0,_0.04)]'
                                    : 'text-[#888]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <button className="absolute top-[153px] sm:top-[168px] md:top-[200px] right-4 sm:right-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4B68F0] flex items-center justify-center text-white shadow-[0px_2px_10px_rgba(0,_0,_0,_0.15)]">
                <Search className="w-8 h-8" />
            </button>
        </div>
    );
};

export default MintHeader;
