import { useState, useMemo, useEffect } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
    BadgeContract,
    BADGE_CONTRACT_ADDRESS,
    BADGE_CONTRACT_ABI,
} from "@/lib/badgeContract";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useToast } from "@/components/ui/Toast";
import {
    useUserByFid,
    useCourses,
    useAllCoursesProgress,
    useUserBadges,
    useGetOrCreateUser,
    useSaveMintedBadge,
} from "@/lib/convexApi";
import { BadgeItem } from "../sections/BadgeList";
import { FilterType } from "../sections/MintHeader";

// Internal interface for logic
interface Course {
    id: string;
    title: string;
    description: string;
    emoji: string;
    completed: boolean;
    minted: boolean;
    tokenId?: string;
    _id?: string;
    course_number?: number;
}

export function useMintBadge() {
    // Auth & Wallet
    const { user } = useUnifiedAuth();
    const { address, isConnected, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();
    const { showToast, ToastComponent } = useToast();

    // State
    const [filter, setFilter] = useState<FilterType>("all");
    const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [mintingStatus, setMintingStatus] = useState<string>("");

    // Convex Hooks
    const getOrCreateUser = useGetOrCreateUser();
    const saveMintedBadge = useSaveMintedBadge();

    // Get user data
    const fid = user?.fid;
    const convexUser = useUserByFid(fid);

    // Data Fetching
    const allCourses = useCourses();
    const coursesProgress = useAllCoursesProgress(convexUser?._id);
    const userBadges = useUserBadges(convexUser?._id);

    // Sync user creation
    useEffect(() => {
        const ensureUser = async () => {
            if (!address) return;
            try {
                await getOrCreateUser({
                    wallet_address: address,
                    fid: user?.fid,
                    username: user?.username,
                    display_name: user?.displayName || "Wallet User",
                });
            } catch (error) {
                console.error("Error creating user:", error);
            }
        };
        ensureUser();
    }, [address, user, getOrCreateUser]);

    // Process data into Course objects
    const courses: Course[] = useMemo(() => {
        if (!allCourses) return [];

        return allCourses.map((course) => {
            // @ts-ignore
            const progressItem = coursesProgress?.find(
                (p) => p.courseId === course._id,
            );
            // @ts-ignore
            const isCompleted = (progressItem?.progress || 0) === 100;
            const badge = userBadges?.find((b) => b.course_id === course._id);
            const minted = !!badge;

            return {
                id: course._id,
                title: course.title,
                description: course.description || "",
                emoji: course.emoji || "🎓",
                completed: isCompleted,
                minted,
                tokenId: badge?.token_id,
                _id: course._id,
                course_number: course.course_number,
            };
        });
    }, [allCourses, coursesProgress, userBadges]);

    // Transform into BadgeItems for UI
    const badgeItems: BadgeItem[] = useMemo(() => {
        return courses.map((course) => {
            let status: "locked" | "unlocked" | "minted" = "locked";
            if (course.minted) {
                status = "minted";
            } else if (course.completed) {
                status = "unlocked";
            }

            return {
                id: course.id,
                title: course.title,
                status: status,
            };
        });
    }, [courses]);

    // Filter logic
    const displayedBadges = useMemo(() => {
        if (filter === "all") return badgeItems;
        return badgeItems.filter((b) => b.status === filter);
    }, [filter, badgeItems]);

    // Stats calculation
    const stats = useMemo(() => {
        return {
            all: badgeItems.length,
            unlocked: badgeItems.filter((b) => b.status === "unlocked").length,
            minted: badgeItems.filter((b) => b.status === "minted").length,
            locked: badgeItems.filter((b) => b.status === "locked").length,
        };
    }, [badgeItems]);

    // Helper to find full course object by ID
    const findCourse = (id: string) => courses.find((c) => c.id === id);

    // Minting Logic
    const handleMintBadge = async (id: string) => {
        const course = findCourse(id);
        if (!course) return;

        if (!course.completed || course.minted || mintingCourseId) return;

        if (!isConnected || !address) {
            showToast("⚠️ Please connect your wallet first", "error");
            return;
        }

        try {
            setMintingCourseId(course.id);
            setTxHash(null);
            setMintingStatus("Preparing to mint...");

            // Network Check
            const isOnBaseSepolia = chain?.id === baseSepolia.id;
            if (chain && !isOnBaseSepolia) {
                setMintingStatus("Switching to Base Sepolia...");
                if (switchChain) {
                    try {
                        await switchChain({ chainId: baseSepolia.id });
                    } catch (error) {
                        console.error("Switch chain failed", error);
                        showToast("❌ Network switch failed", "error");
                        setMintingStatus("");
                        setMintingCourseId(null);
                        return;
                    }
                }
            }

            const courseIdNum = course.course_number;
            if (!courseIdNum) {
                showToast("❌ Course number missing", "error");
                setMintingStatus("");
                setMintingCourseId(null);
                return;
            }

            // Backend Signature
            setMintingStatus("Verifying completion...");
            const signResponse = await fetch("/api/sign-mint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userAddress: address,
                    courseId: course.id,
                    fid: user?.fid,
                }),
            });

            const signResult = await signResponse.json();
            if (!signResult.success) {
                showToast(`❌ ${signResult.error}`, "error");
                setMintingStatus("");
                setMintingCourseId(null);
                return;
            }

            // Write Contract
            setMintingStatus("Please approve transaction...");
            const txHashResult = await writeContractAsync({
                address: BADGE_CONTRACT_ADDRESS,
                abi: BADGE_CONTRACT_ABI,
                functionName: "mintBadge",
                args: [BigInt(courseIdNum), signResult.signature as `0x${string}`],
                chainId: baseSepolia.id,
            });

            setTxHash(txHashResult);
            setMintingStatus("Transaction sent! Confirming...");

            // Wait for indexing
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Get Token ID (Best effort)
            let tokenId = "0";
            try {
                const fetchedId = await BadgeContract.getUserBadgeForCourse(
                    address as `0x${string}`,
                    courseIdNum
                );
                tokenId = fetchedId.toString();
            } catch (e) {
                console.warn("Could not fetch new token ID immediately", e);
            }

            // Save to Convex
            setMintingStatus("Saving to database...");
            if (convexUser?._id) {
                await saveMintedBadge({
                    userId: convexUser._id,
                    courseId: course._id as any,
                    tokenId: tokenId,
                    txHash: txHashResult,
                    walletAddress: address,
                });
            }

            setMintingStatus("Minted successfully!");
            showToast("✅ Badge minted!", "success");
        } catch (error: any) {
            const msg = error?.message || "Minting failed";
            if (!msg.includes("User rejected")) {
                showToast(`❌ ${msg}`, "error");
            }
            console.error(error);
        } finally {
            if (!txHash) setMintingCourseId(null);
            setMintingCourseId(null);
            setMintingStatus("");
        }
    };

    return {
        // Data
        displayedBadges,
        stats,
        // State
        filter,
        mintingCourseId,
        mintingStatus,
        // Actions
        setFilter,
        handleMintBadge,
        // Components
        ToastComponent
    };
}
