import Image from "next/image";
import { Info } from "lucide-react";

export type BadgeStatus = "minted" | "unlocked" | "locked";

interface BadgeCardProps {
    title: string;
    status: BadgeStatus;
    image?: string; // Optional URL for the badge image
    onMint?: () => void;
}

const BadgeCard = ({ title, status, image, onMint }: BadgeCardProps) => {
    return (
        <div className="w-full shadow-[0px_2px_20px_rgba(0,_0,_0,_0.04)] rounded-[16px] bg-white flex flex-col items-center justify-center p-3 gap-3">
            <div className={`self-stretch h-[124px] rounded-[16px] flex items-center justify-center p-3 overflow-hidden relative ${status === 'locked' ? 'bg-[#E5E7EB]' : 'bg-[#FDF8E1]'}`}>
                {image ? (
                    <div className="relative w-full h-full">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <div className="relative w-[90px] h-[92px]">
                        <svg viewBox="0 0 90 92" className="w-full h-full">
                            <path
                                d="M45 2 L77 18 L88 46 L77 74 L45 90 L13 74 L2 46 L13 18 Z"
                                fill={status === "locked" ? "#9CA3AF" : "#D8B24C"}
                            />
                            <path
                                d="M45 26 L50 39 L64 41 L53 50 L56 64 L45 57 L34 64 L37 50 L26 41 L40 39 Z"
                                fill={status === "locked" ? "#4B5563" : "#4B3B00"}
                            />
                            <circle cx="23" cy="22" r="3" fill={status === "locked" ? "#6B7280" : "#FFFFFF"} opacity="0.8" />
                            <circle cx="68" cy="68" r="3" fill={status === "locked" ? "#6B7280" : "#FFFFFF"} opacity="0.6" />
                        </svg>
                    </div>
                )}
            </div>

            <b className="self-stretch relative text-center text-[14px] font-bricolage-grotesque text-darkslategray leading-[135%] min-h-[34px] flex items-center justify-center">
                {title}
            </b>

            {status === "minted" && (
                <div className="self-stretch h-9 rounded-3xl bg-[#A7A7A7] flex items-center justify-center py-2 px-3 text-white text-[12px] font-semibold tracking-[0.01em]">
                    Minted
                </div>
            )}

            {status === "unlocked" && (
                <button
                    onClick={onMint}
                    className="self-stretch h-9 rounded-3xl bg-[#2D2D2D] flex items-center justify-center py-2 px-3 text-white text-[12px] font-semibold hover:bg-black transition-colors relative isolate group"
                >
                    <span className="tracking-[0.01em] z-10">Mint</span>
                </button>
            )}

            {status === "locked" && (
                <div className="h-9 flex items-center justify-center gap-1 text-left text-[12px] text-[#7A7A7A] font-inter">
                    <Info size={12} className="text-[#7A7A7A]" />
                    <span className="leading-[135%] overflow-hidden text-ellipsis whitespace-nowrap">
                        Finish lesson to mint
                    </span>
                </div>
            )}
        </div>
    );
};

export default BadgeCard;
