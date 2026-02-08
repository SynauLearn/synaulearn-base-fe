import Image from "next/image";
import MintHeader from "./sections/MintHeader";
import BadgeList from "./sections/BadgeList";
import bgDecoration1 from "@/assets/images/mintbadge/img-decoration-background.png";
import bgDecoration2 from "@/assets/images/mintbadge/img-decoration-background2.png";
import { useMintBadge } from "./hooks/useMintBadge";

interface MintBadgePageProps {
    onBack?: () => void;
}

const MintBadgePage = ({ onBack }: MintBadgePageProps) => {
    const {
        displayedBadges,
        stats,
        filter,
        setFilter,
        handleMintBadge,
        ToastComponent
    } = useMintBadge();

    return (
        <div className="relative w-full flex flex-col min-h-screen py-5 bg-[#DCE1FC] overflow-hidden">
            {ToastComponent}
            {/* Background Decorations */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <Image
                    src={bgDecoration1}
                    alt=""
                    fill
                    className="object-cover mix-blend-overlay"
                    priority
                />
                <Image
                    src={bgDecoration2}
                    alt=""
                    fill
                    className="object-cover mix-blend-overlay"
                    priority
                />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
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
        </div>
    );
};

export default MintBadgePage;
