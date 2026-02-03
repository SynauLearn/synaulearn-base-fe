import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lock, Check, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './WalletConnect';
import { BadgeContract } from '@/lib/badgeContract';
import { getCourseNumber } from '@/lib/courseMapping';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useSIWFProfile } from './SignInWithFarcaster';
import {
    useUserByFid,
    useCourses,
    useAllCoursesProgress,
    useUserBadges,
    useGetOrCreateUser,
    useSaveMintedBadge,
    UserId
} from '@/lib/convexApi';

interface MintBadgeProps {
    onBack: () => void;
}

interface Course {
    id: string;
    title: string;
    description: string;
    emoji: string;
    completed: boolean;
    minted: boolean;
    tokenId?: string;
}

export default function MintBadge({ onBack }: MintBadgeProps) {
    const { address, isConnected } = useAccount();
    const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [mintingStatus, setMintingStatus] = useState<string>('');
    const { context } = useMiniKit();
    const siwfProfile = useSIWFProfile();

    // Get FID from MiniKit or SIWF
    const fid = context?.user?.fid || siwfProfile.fid;
    const fidUsername = context?.user?.username || siwfProfile.username;
    const fidDisplayName = context?.user?.displayName || siwfProfile.displayName;

    // Convex hooks
    const getOrCreateUser = useGetOrCreateUser();
    const saveMintedBadge = useSaveMintedBadge();
    const convexUser = useUserByFid(fid);
    const allCourses = useCourses();

    const [convexUserId, setConvexUserId] = useState<UserId | null>(null);
    const coursesProgress = useAllCoursesProgress(convexUserId ?? undefined);
    const userBadges = useUserBadges(convexUserId ?? undefined);

    // Create or get user when FID/address is available
    useEffect(() => {
        async function ensureUser() {
            if (!fid && !address) return;

            try {
                const user = await getOrCreateUser({
                    fid: fid || 0,
                    username: fidUsername || address || undefined,
                    display_name: fidDisplayName || 'Wallet User',
                });
                if (user) {
                    setConvexUserId(user._id);
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }

        ensureUser();
    }, [fid, address, fidUsername, fidDisplayName, getOrCreateUser]);

    // Build courses list with completion and minted status
    const courses = useMemo<Course[]>(() => {
        if (!allCourses) return [];

        // Create progress map
        const progressMap: Record<string, number> = {};
        if (coursesProgress) {
            for (const cp of coursesProgress) {
                progressMap[cp.courseId] = cp.progress;
            }
        }

        // Create minted badges map
        const mintedMap: Record<string, { tokenId?: string }> = {};
        if (userBadges) {
            for (const badge of userBadges) {
                mintedMap[badge.course_id] = { tokenId: badge.token_id };
            }
        }

        return allCourses.map(course => ({
            id: course._id,
            title: course.title,
            description: course.description || '',
            emoji: course.emoji || '📚',
            completed: (progressMap[course._id] ?? 0) === 100,
            minted: !!mintedMap[course._id],
            tokenId: mintedMap[course._id]?.tokenId,
        }));
    }, [allCourses, coursesProgress, userBadges]);

    const loading = allCourses === undefined;

    const handleMintBadge = async (course: Course) => {
        console.log('🔴 handleMintBadge CALLED', { course: course.title, courseId: course.id });
        console.log('🔴 State check:', {
            completed: course.completed,
            minted: course.minted,
            mintingCourseId,
            isConnected,
            address
        });

        if (!course.completed || course.minted || mintingCourseId) {
            console.log('🔴 EARLY RETURN: course not ready', {
                completed: course.completed,
                minted: course.minted,
                mintingCourseId
            });
            return;
        }

        if (!isConnected || !address) {
            console.log('🔴 WALLET NOT CONNECTED');
            alert('⚠️ Please connect your wallet first');
            return;
        }

        try {
            setMintingCourseId(course.id);
            setTxHash(null);
            setMintingStatus('Preparing to mint...');

            console.log('🚀 Starting mint process for:', course.title);
            console.log('🔍 Course ID (UUID):', course.id);

            // Get numeric course ID from mapping
            const courseIdNum = getCourseNumber(course.id);

            if (!courseIdNum) {
                alert(`❌ This course is not yet available for minting.\n\nCourse "${course.title}" needs to be added to the mapping first.`);
                setMintingStatus('');
                setMintingCourseId(null);
                return;
            }

            console.log('🔢 Course numeric ID:', courseIdNum);

            // Call mint function with status callback - NEW ABI takes only courseId
            const result = await BadgeContract.mintBadge(
                courseIdNum,
                (status: string) => {
                    setMintingStatus(status);
                    console.log('📊 Status:', status);
                }
            );

            // Show transaction hash immediately if available, even on failure
            if (result.txHash) {
                setTxHash(result.txHash);
                setMintingStatus('Transaction sent! Confirming...');
            }

            if (result.success && result.txHash) {
                setMintingStatus('Getting badge information...');

                // Wait a bit for the transaction to be indexed
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Get numeric course ID from mapping
                const courseIdNum = getCourseNumber(course.id);
                if (!courseIdNum) {
                    console.error('Course mapping lost after minting:', course.id);
                    alert(`⚠️ Badge minted successfully but cannot retrieve token ID.\n\nTransaction: ${result.txHash}`);
                    setMintingStatus('');
                    setMintingCourseId(null);
                    return;
                }

                const tokenId = await BadgeContract.getUserBadgeForCourse(
                    address as `0x${string}`,
                    courseIdNum
                );

                // Save to database using Convex
                try {
                    setMintingStatus('Saving to database...');

                    if (convexUserId) {
                        await saveMintedBadge({
                            userId: convexUserId,
                            courseId: course.id as any, // Convex Id type
                            walletAddress: address,
                            tokenId: tokenId.toString(),
                            txHash: result.txHash,
                        });
                        console.log('✅ Badge saved to database');
                    }
                } catch (dbError) {
                    console.error('❌ Database error:', dbError);
                    // Continue even if database save fails
                }

                // UI will auto-update from Convex hook
                setMintingStatus('Badge minted successfully!');
                alert(`✅ Badge minted!\n\nTx: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}\nToken #${tokenId.toString()}`);

                // Convex hooks will auto-update the UI
            } else {
                // Handle failure cases
                const errorMsg = result.error || 'Unknown error';
                console.error('❌ Mint failed:', errorMsg);

                if (result.txHash) {
                    // Transaction was sent but failed/timed out
                    alert(`⚠️ ${errorMsg}\n\nTransaction: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}\n\nCheck BaseScan to see the status.`);
                } else {
                    // Transaction was never sent
                    alert(`❌ Mint failed: ${errorMsg}`);
                }
                setMintingStatus('');
            }
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Mint error:', errorMsg);
            alert(`❌ Failed: ${errorMsg}`);
            setMintingStatus('');
        } finally {
            setMintingCourseId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-24">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            disabled={!!mintingCourseId}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Mint Badge</h1>
                            {isConnected && address && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {/* RainbowKit Connect Button */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-semibold mb-1">
                                {isConnected ? '✅ Wallet Connected' : '🔗 Connect Your Wallet'}
                            </p>
                            <p className="text-gray-300 text-sm">
                                {isConnected
                                    ? 'Ready to mint your badges'
                                    : 'Connect to mint badges as NFTs on Base Sepolia'}
                            </p>
                        </div>
                        <ConnectButton />
                    </div>
                </div>

                {txHash && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 text-sm mb-2">
                            ✅ Transaction successful!
                        </p>
                        <a
                            href={`https://sepolia.basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 text-xs flex items-center gap-1 hover:underline"
                        >
                            View on BaseScan <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}

                <h3 className="text-lg font-semibold text-white mb-4">
                    Select a completed course to mint
                </h3>

                <div className="space-y-4">
                    {courses.map((course) => {
                        const isMinting = mintingCourseId === course.id;

                        return (
                            <div
                                key={course.id}
                                className={`rounded-2xl border-2 p-5 transition-all ${!course.completed
                                    ? 'border-slate-800 bg-slate-900/30 opacity-60'
                                    : course.minted
                                        ? 'border-green-500/50 bg-green-500/10'
                                        : isMinting
                                            ? 'border-blue-500 bg-slate-800/70'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${course.minted
                                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                                            : course.completed
                                                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                                                : 'bg-slate-800 border-2 border-slate-700'
                                            }`}
                                    >
                                        {isMinting ? (
                                            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : course.minted ? (
                                            <Check className="w-10 h-10 text-white" />
                                        ) : course.completed ? (
                                            course.emoji
                                        ) : (
                                            <Lock className="w-8 h-8 text-gray-600" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        {course.completed && !course.minted && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md mb-2">
                                                <Check className="w-3 h-3" />
                                                Ready to Mint
                                            </span>
                                        )}
                                        {course.minted && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md mb-2">
                                                <Check className="w-3 h-3" />
                                                Minted #{course.tokenId}
                                            </span>
                                        )}
                                        {!course.completed && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-gray-500 text-xs font-medium rounded-md mb-2">
                                                <Lock className="w-3 h-3" />
                                                Complete Course First
                                            </span>
                                        )}
                                        <h4 className="text-lg font-semibold text-white mb-2">
                                            {course.title}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            {course.description}
                                        </p>
                                    </div>
                                </div>

                                {course.completed && !course.minted && !isMinting && (
                                    <button
                                        onClick={(e) => {
                                            console.log('🟢 BUTTON onClick triggered', { courseId: course.id });
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleMintBadge(course);
                                        }}
                                        onTouchStart={(e) => {
                                            console.log('🟡 BUTTON onTouchStart', { courseId: course.id });
                                        }}
                                        onTouchEnd={(e) => {
                                            console.log('🟡 BUTTON onTouchEnd', { courseId: course.id });
                                        }}
                                        disabled={!isConnected}
                                        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                                        className={`mt-4 w-full py-3 px-4 font-semibold rounded-lg transition-colors relative z-50 ${isConnected
                                            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isConnected ? 'Mint Badge (Free)' : '🔒 Connect Wallet First'}
                                    </button>
                                )}

                                {isMinting && (
                                    <div className="mt-4 w-full py-3 px-4 bg-blue-500/20 text-blue-400 font-semibold rounded-lg flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                        {mintingStatus || 'Minting on Base Sepolia...'}
                                    </div>
                                )}

                                {course.minted && (
                                    <div className="mt-4 w-full py-3 px-4 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-lg text-center">
                                        ✅ Badge Minted Successfully
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}