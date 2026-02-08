import type { NextPage } from 'next';
import { useState, useMemo } from 'react';
import MintHeader, { FilterType } from './sections/MintHeader';
import BadgeList, { BadgeItem } from './sections/BadgeList';
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";

// MOCK DATA corresponding to Figma design
const MOCK_BADGES: BadgeItem[] = [
    {
        id: '1',
        title: 'Smart Contract Fundamentals',
        status: 'minted',
        // image: '/assets/badges/smart-contract-fundamentals.png' // TODO: Add asset
    },
    {
        id: '2',
        title: 'Blockchain Basics',
        status: 'unlocked',
        // image: '/assets/badges/blockchain-basics.png' // TODO: Add asset
    },
    {
        id: '3',
        title: 'DeFi and Smart Contracts',
        status: 'locked',
        // image: '/assets/badges/defi.png' // TODO: Add asset
    },
    {
        id: '4',
        title: 'Introduction to Base',
        status: 'locked',
        // image: '/assets/badges/intro-base.png' // TODO: Add asset
    },
    {
        id: '5',
        title: 'Wallet Security',
        status: 'locked',
    },
    {
        id: '6',
        title: 'NFTs 101',
        status: 'locked',
    }
];

interface MintBadgePageProps {
    onBack?: () => void;
}

const MintBadgePage = ({ onBack }: MintBadgePageProps) => {
    const { user } = useUnifiedAuth();
    const [filter, setFilter] = useState<FilterType>('all');

    // Calculate stats from mock data
    const stats = useMemo(() => {
        return {
            all: MOCK_BADGES.length,
            unlocked: MOCK_BADGES.filter(b => b.status === 'unlocked').length,
            minted: MOCK_BADGES.filter(b => b.status === 'minted').length,
            locked: MOCK_BADGES.filter(b => b.status === 'locked').length,
        };
    }, []);

    // Filter badges to display
    const displayedBadges = useMemo(() => {
        if (filter === 'all') return MOCK_BADGES;
        return MOCK_BADGES.filter(b => b.status === filter);
    }, [filter]);

    const handleMintBadge = (id: string) => {
        console.log(`Minting badge ${id}...`);
        // TODO: Implement minting logic
        // For static demo, maybe toggle status?
    };

    return (
        <div className="relative w-full flex flex-col min-h-screen py-5 bg-[#DCE1FC]">
            <MintHeader
                filter={filter}
                onFilterChange={setFilter}
                stats={stats}
            />

            <BadgeList
                badges={displayedBadges}
                onMintBadge={handleMintBadge}
            />
        </div>
    );
};

export default MintBadgePage;
