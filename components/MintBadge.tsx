import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Lock, Check, ExternalLink } from 'lucide-react';
import { useAccount, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { ConnectButton } from './WalletConnect';
import { BadgeContract } from '@/lib/badgeContract';
import { useMiniKit, usePrimaryButton } from '@coinbase/onchainkit/minikit';
import { useSIWFProfile } from './SignInWithFarcaster';
import { useToast } from './ui/Toast';
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
    _id?: string;
    course_number?: number; // Numeric ID for smart contract
}

export default function MintBadge({ onBack }: MintBadgeProps) {
    const { address, isConnected, chain } = useAccount();
    const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
    const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [mintingStatus, setMintingStatus] = useState<string>('');
    const { context } = useMiniKit();
    const siwfProfile = useSIWFProfile();
    const { showToast, ToastComponent } = useToast();

    // Get FID from MiniKit or SIWF
    const fid = context?.user?.fid || siwfProfile.fid;
    const fidUsername = context?.user?.username || siwfProfile.username;
    const fidDisplayName = context?.user?.displayName || siwfProfile.displayName;

    // Convex hooks
    const getOrCreateUser = useGetOrCreateUser();
    const saveMintedBadge = useSaveMintedBadge();
    const convexUser = useUserByFid(fid);
    const allCourses = useCourses();
    const coursesProgress = useAllCoursesProgress(convexUser?._id);
    const userBadges = useUserBadges(convexUser?._id);

    // Create or get user when wallet is connected
    useEffect(() => {
        const ensureUser = async () => {
            // Wallet is required for user creation
            if (!address) return;

            try {
                await getOrCreateUser({
                    wallet_address: address,
                    fid: fid || undefined,
                    username: fidUsername || undefined,
                    display_name: fidDisplayName || 'Wallet User',
                });
            } catch (error) {
                console.error('Error creating user:', error);
            }
        };

        ensureUser();
    }, [address, fid, fidUsername, fidDisplayName, getOrCreateUser]);

    // Build courses list with completion and minted status
    const courses: Course[] = useMemo(() => {
        if (!allCourses) return [];

        return allCourses.map(course => {
            // Find progress for this course - Access property 'courseId' as per lint error
            // @ts-ignore - access safe property
            const progressItem = coursesProgress?.find(p => (p.courseId || p.course_id) === course._id);

            // Check completion based on progress percentage
            // @ts-ignore - safe optional access
            const isCompleted = (progressItem?.progress || 0) === 100;

            // Allow minting if course is completed
            const completed = isCompleted;

            const badge = userBadges?.find(b => b.course_id === course._id);
            const minted = !!badge;

            return {
                id: course._id, // Use string ID from Convex _id
                title: course.title,
                description: course.description || '',
                emoji: course.emoji || '🎓',
                completed,
                minted,
                tokenId: badge?.token_id,
                _id: course._id,
                course_number: course.course_number, // From Convex
            };
        });
    }, [allCourses, coursesProgress, userBadges]);

    // Find first course ready to mint for Primary Button
    const courseToMint = courses.find(c => c.completed && !c.minted);
    const loading = allCourses === undefined;

    const handleMintBadge = async (course: Course) => {
        if (!course.completed || course.minted || mintingCourseId) return;

        if (!isConnected || !address) {
            showToast('⚠️ Please connect your wallet first', 'error');
            return;
        }

        try {
            setMintingCourseId(course.id);
            setTxHash(null);
            setMintingStatus('Preparing to mint...');

            console.log('🚀 Starting mint process for:', course.title);
            console.log('🔍 Course ID:', course.id);

            // Check if we're on the correct chain (Base Sepolia)
            // Note: In MiniKit/frame context, chain might be undefined and switchChain may not work
            const isOnBaseSepolia = chain?.id === baseSepolia.id;
            const needsChainSwitch = chain && !isOnBaseSepolia;

            if (needsChainSwitch) {
                console.log('🔄 Current chain:', chain?.id, 'Switching to Base Sepolia...');
                setMintingStatus('Switching to Base Sepolia network...');

                // Check if switchChain is available (might not be in MiniKit frames)
                if (!switchChain) {
                    console.log('⚠️ Chain switch not available in this context, proceeding anyway...');
                    // Proceed anyway - the transaction will fail if on wrong chain
                } else {
                    try {
                        await switchChain({ chainId: baseSepolia.id });
                        console.log('✅ Switched to Base Sepolia');
                    } catch (switchError) {
                        const errMessage = switchError instanceof Error ? switchError.message : String(switchError);
                        console.error('❌ Chain switch failed:', errMessage);

                        // Check if user rejected
                        if (errMessage.includes('User rejected') || errMessage.includes('User denied')) {
                            showToast('❌ Network switch cancelled. Please switch to Base Sepolia manually.', 'error');
                            setMintingStatus('');
                            setMintingCourseId(null);
                            return;
                        }
                        // For other errors, try to proceed - the smart contract will fail if wrong chain
                        console.log('⚠️ Chain switch error but proceeding...');
                    }
                }
            } else if (!chain) {
                console.log('⚠️ Chain info not available (MiniKit?), proceeding with mint...');
            } else {
                console.log('✅ Already on Base Sepolia');
            }

            // Get numeric course ID from Convex
            const courseIdNum = course.course_number;

            if (!courseIdNum) {
                const errorMsg = `Course number not set for: ${course.title}`;
                console.error(errorMsg);
                showToast(`❌ ${errorMsg}. Please run migration.`, 'error');
                setMintingStatus('');
                setMintingCourseId(null);
                return;
            }

            console.log('🔢 Course numeric ID:', courseIdNum);

            // NEW: Request signature from backend first
            setMintingStatus('Verifying course completion...');
            console.log('🔐 Requesting signature from backend...');

            const signResponse = await fetch('/api/sign-mint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userAddress: address,
                    courseId: course.id,
                    fid: fid || undefined,
                }),
            });

            const signResult = await signResponse.json();

            if (!signResult.success) {
                console.error('❌ Signature failed:', signResult.error);
                showToast(`❌ ${signResult.error}`, 'error');
                setMintingStatus('');
                setMintingCourseId(null);
                return;
            }

            console.log('✅ Signature received:', signResult.signature.slice(0, 20) + '...');
            setMintingStatus('Signature verified! Preparing transaction...');

            // Call mint function with signature
            const result = await BadgeContract.mintBadge(
                Number(courseIdNum),
                signResult.signature as `0x${string}`,
                (status: string) => {
                    setMintingStatus(status);
                    console.log('📊 Status:', status);
                }
            );

            // Show transaction hash immediately if available
            if (result.txHash) {
                setTxHash(result.txHash);
                setMintingStatus('Transaction sent! Confirming...');
            }

            if (result.success && result.txHash) {
                setMintingStatus('Getting badge information...');

                // Wait a bit for the transaction to be indexed
                await new Promise(resolve => setTimeout(resolve, 2000));

                const tokenId = await BadgeContract.getUserBadgeForCourse(
                    address as `0x${string}`,
                    courseIdNum
                );

                // Save to database using Convex
                try {
                    setMintingStatus('Saving to database...');

                    if (convexUser?._id) {
                        await saveMintedBadge({
                            userId: convexUser._id,
                            courseId: course._id as any,
                            tokenId: tokenId.toString(),
                            txHash: result.txHash,
                            walletAddress: address,
                            // minted_at: Date.now(), // might not be in schema, removing to be safe or check api
                        });
                        console.log('✅ Badge saved to database');
                    }
                } catch (dbError) {
                    console.error('❌ Database error:', dbError);
                }

                setMintingStatus('Badge minted successfully!');
                showToast('✅ Badge minted successfully!', 'success');

            } else {
                // Handle failure
                const errorMsg = result.error || 'Unknown error';
                console.error('❌ Mint failed:', errorMsg);
                if (!result.txHash) showToast(`❌ Mint failed: ${errorMsg}`, 'error');
                setMintingStatus('');
            }
        } catch (error: any) {
            const errorMsg = error.message || 'Unknown error';
            console.error('❌ Mint error:', errorMsg);
            if (!errorMsg.includes('User rejected')) showToast(`❌ Failed: ${errorMsg}`, 'error');
            setMintingStatus('');
        } finally {
            if (!txHash) setMintingCourseId(null);
        }
    };

    // Native Primary Button for Base App
    usePrimaryButton(
        {
            text: courseToMint
                ? `Mint ${courseToMint.title} Badge`
                : "Complete a Course to Mint",
            loading: !!mintingCourseId,
            disabled: !courseToMint || !!mintingCourseId || !isConnected,
        },
        () => {
            if (courseToMint) {
                handleMintBadge(courseToMint);
            }
        }
    );

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
            {ToastComponent}
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors active:scale-95 duration-150"
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
                                    : 'Connect to mint badges'
                                }
                            </p>
                        </div>
                        {!isConnected && <ConnectButton />}
                        {isConnected && (
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Connected as</p>
                                <p className="font-mono text-sm text-blue-400">{fidUsername || 'User'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-4">Select Badge to Mint</h3>

                <div className="grid gap-4">
                    {courses.map(course => {
                        const isMinting = mintingCourseId === course.id;

                        return (
                            <div
                                key={course.id}
                                className={`p-5 rounded-xl border transition-all duration-200 ${course.completed && !course.minted
                                    ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                    : 'bg-slate-900/50 border-slate-800 opacity-75'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl shrink-0 ${course.completed ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-slate-800'
                                        }`}>
                                        {course.emoji}
                                    </div>
                                    <div>
                                        {course.completed && !course.minted ? (
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-400 mb-2 border border-blue-500/20">
                                                ✓ Ready to Mint
                                            </span>
                                        ) : course.minted ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md mb-2">
                                                <Check className="w-3 h-3" />
                                                Minted #{course.tokenId}
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-700 text-gray-400 mb-2">
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
                                        onClick={() => handleMintBadge(course)}
                                        disabled={!isConnected}
                                        className={`mt-4 w-full py-3 px-4 font-semibold rounded-lg transition-colors ${isConnected
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
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