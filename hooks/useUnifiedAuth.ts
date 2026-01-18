import { useState, useEffect, useCallback, useRef } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

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

    // OnchainKit MiniKit context
    const { context, setFrameReady, isFrameReady } = useMiniKit();

    // Wagmi hooks for wallet connection
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Check if running in mini app context
    const isInMiniApp = Boolean(context?.client?.added || context?.user?.fid);

    // Initialize auth on mount
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        async function initAuth() {
            setIsLoading(true);
            setError(null);

            try {
                if (isInMiniApp && context?.user?.fid) {
                    // Mini App context - use Quick Auth
                    await authenticateWithQuickAuth();
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

        if (isConnected && address && !isInMiniApp) {
            setUser({
                walletAddress: address,
                authMethod: 'wallet',
            });
        } else if (!isConnected && !isInMiniApp && user?.authMethod === 'wallet') {
            setUser(null);
        }
    }, [isConnected, address, isInMiniApp, user?.authMethod]);

    const authenticateWithQuickAuth = useCallback(async () => {
        try {
            // Dynamic import to prevent SSR issues
            const { sdk } = await import('@farcaster/miniapp-sdk');

            // Get Quick Auth token
            const { token } = await sdk.quickAuth.getToken();

            // Verify token with backend
            const response = await sdk.quickAuth.fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser({
                    fid: userData.fid,
                    username: userData.username,
                    displayName: userData.displayName,
                    pfpUrl: userData.pfpUrl,
                    walletAddress: userData.walletAddress,
                    authMethod: 'quick-auth',
                });
                setError(null);
            } else {
                // Fallback to context data if backend verification fails
                if (context?.user) {
                    setUser({
                        fid: context.user.fid,
                        username: context.user.username,
                        displayName: context.user.displayName,
                        pfpUrl: context.user.pfpUrl,
                        authMethod: 'quick-auth',
                    });
                }
            }
        } catch (err) {
            console.error('Quick Auth error:', err);
            // Fallback to context data
            if (context?.user) {
                setUser({
                    fid: context.user.fid,
                    username: context.user.username,
                    displayName: context.user.displayName,
                    pfpUrl: context.user.pfpUrl,
                    authMethod: 'quick-auth',
                });
            }
        }
    }, [context]);

    const signIn = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (isInMiniApp) {
                await authenticateWithQuickAuth();
            }
            // For browser wallet, connection is handled by OnchainKit <ConnectWallet>
            // The useEffect will catch the wallet connection
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign in failed');
        } finally {
            setIsLoading(false);
        }
    }, [isInMiniApp, authenticateWithQuickAuth]);

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
            if (isInMiniApp) {
                await authenticateWithQuickAuth();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Refetch failed');
        } finally {
            setIsLoading(false);
        }
    }, [isInMiniApp, authenticateWithQuickAuth]);

    return {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isInMiniApp,
        error,
        signIn,
        signOut,
        refetch,
    };
}
