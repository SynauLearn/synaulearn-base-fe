'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import { useCallback, useState } from 'react';

// Backward-compatible hook for components that used useSIWFProfile
export function useSIWFProfile() {
    const { context } = useMiniKit();
    const { address } = useAccount();

    // Use context data from MiniKit (auto-provided in mini app context)
    const isAuthenticated = Boolean(context?.user?.fid);
    const fid = context?.user?.fid;
    const username = context?.user?.username;
    const displayName = context?.user?.displayName;
    const pfpUrl = context?.user?.pfpUrl;

    return {
        isAuthenticated,
        fid: fid ?? undefined,
        displayName: displayName ?? undefined,
        username: username ?? undefined,
        pfpUrl: pfpUrl ?? undefined,
        walletAddress: address ?? undefined,
    };
}

interface SignInWithFarcasterProps {
    onSuccess?: (fid: number, username?: string) => void;
    className?: string;
}

export function SignInWithFarcaster({
    onSuccess,
    className
}: SignInWithFarcasterProps) {
    const { context } = useMiniKit();
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            // In mini app context, authentication happens automatically
            // This button is mainly for browser fallback
            if (context?.user?.fid) {
                onSuccess?.(context.user.fid, context.user.username);
            }
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess, context]);

    // Already authenticated via context (auto-connected in mini app)
    if (context?.user?.fid) {
        return (
            <div className={`flex items-center gap-2 ${className || ''}`}>
                {context.user.pfpUrl && (
                    <img
                        src={context.user.pfpUrl}
                        alt={context.user.username || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium text-white">
                    {context.user.displayName || context.user.username || `FID: ${context.user.fid}`}
                </span>
            </div>
        );
    }

    // Not authenticated - show sign in button (browser fallback)
    return (
        <button
            onClick={handleAuth}
            disabled={isLoading}
            className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors ${className || ''}`}
        >
            {isLoading ? 'Signing in...' : 'Sign In with Farcaster'}
        </button>
    );
}
