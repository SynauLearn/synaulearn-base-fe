'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useDisconnect } from 'wagmi';

// Base App clientFid for platform detection
const BASE_APP_CLIENT_FID = 309857;
const WARPCAST_CLIENT_FID = 9152;

interface UnifiedUser {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    walletAddress?: string;
    authMethod: 'quick-auth' | 'wallet' | 'none';
}

interface UseUnifiedAuthReturn {
    user: UnifiedUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isInMiniApp: boolean;
    isBaseApp: boolean;
    isWarpcast: boolean;
    isBrowser: boolean;
    error: string | null;
    signIn: () => Promise<void>;
    signOut: () => void;
    refetch: () => Promise<void>;
}

export function useUnifiedAuth(): UseUnifiedAuthReturn {
    const [user, setUser] = useState<UnifiedUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const initRef = useRef(false);

    // OnchainKit MiniKit context - provides user info in mini app
    const { context, setFrameReady, isFrameReady } = useMiniKit();

    // Wagmi hooks for wallet connection
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Platform detection
    const isInMiniApp = Boolean(context?.client?.added || context?.user?.fid);
    const isBaseApp = context?.client?.clientFid === BASE_APP_CLIENT_FID;
    const isWarpcast = context?.client?.clientFid === WARPCAST_CLIENT_FID;
    const isBrowser = !context;

    // Initialize auth on mount
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        async function initAuth() {
            setIsLoading(true);
            setError(null);

            try {
                if (isInMiniApp && context?.user?.fid) {
                    // Mini App context - use context data directly
                    // Wallet is auto-connected by OnchainKit's miniKit.autoConnect
                    setUser({
                        fid: context.user.fid,
                        username: context.user.username,
                        displayName: context.user.displayName,
                        pfpUrl: context.user.pfpUrl,
                        walletAddress: address,
                        authMethod: 'quick-auth',
                    });
                } else if (isConnected && address) {
                    // Browser with connected wallet
                    setUser({
                        walletAddress: address,
                        authMethod: 'wallet',
                    });
                } else {
                    // Not authenticated
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            } finally {
                setIsLoading(false);

                // Mark frame as ready if not already
                if (!isFrameReady) {
                    setFrameReady();
                }
            }
        }

        initAuth();
    }, [isInMiniApp, context, isConnected, address, isFrameReady, setFrameReady]);

    // Re-sync when wallet connection changes
    useEffect(() => {
        if (!initRef.current) return;

        if (isInMiniApp && context?.user?.fid) {
            // Update wallet address in mini app context
            setUser(prev => prev ? {
                ...prev,
                walletAddress: address,
            } : null);
        } else if (isConnected && address && !isInMiniApp) {
            setUser({
                walletAddress: address,
                authMethod: 'wallet',
            });
        } else if (!isConnected && !isInMiniApp && user?.authMethod === 'wallet') {
            setUser(null);
        }
    }, [isConnected, address, isInMiniApp, context, user?.authMethod]);

    const signIn = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (isInMiniApp && context?.user) {
                // In mini app context, use the context data
                setUser({
                    fid: context.user.fid,
                    username: context.user.username,
                    displayName: context.user.displayName,
                    pfpUrl: context.user.pfpUrl,
                    walletAddress: address,
                    authMethod: 'quick-auth',
                });
            }
            // For browser wallet connection, let OnchainKit's ConnectWallet handle it
            // The useEffect will catch the wallet connection change
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign in failed');
        } finally {
            setIsLoading(false);
        }
    }, [isInMiniApp, context, address]);

    const signOut = useCallback(() => {
        setUser(null);
        setError(null);

        if (!isInMiniApp) {
            disconnect();
        }

        // Clear any local storage if needed
        if (typeof window !== 'undefined') {
            // Clear auth-related storage
            const keysToRemove = Object.keys(localStorage).filter(
                key => key.startsWith('synaulearn_')
            );
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
    }, [isInMiniApp, disconnect]);

    const refetch = useCallback(async () => {
        setIsLoading(true);

        try {
            if (isInMiniApp && context?.user) {
                setUser({
                    fid: context.user.fid,
                    username: context.user.username,
                    displayName: context.user.displayName,
                    pfpUrl: context.user.pfpUrl,
                    walletAddress: address,
                    authMethod: 'quick-auth',
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Refetch failed');
        } finally {
            setIsLoading(false);
        }
    }, [isInMiniApp, context, address]);

    return {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isInMiniApp,
        isBaseApp,
        isWarpcast,
        isBrowser,
        error,
        signIn,
        signOut,
        refetch,
    };
}
