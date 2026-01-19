'use client';

import { SignInButton, useProfile, StatusAPIResponse, AuthClientError } from '@farcaster/auth-kit';
import { useCallback } from 'react';
import { usePersistentSIWFProfile, clearSIWFSession } from '@/hooks/usePersistentSIWFSession';

interface SignInWithFarcasterProps {
    onSuccess?: (fid: number, username?: string) => void;
    onError?: (error?: AuthClientError) => void;
    className?: string;
}

export function SignInWithFarcaster({
    onSuccess,
    onError,
    className
}: SignInWithFarcasterProps) {
    const { isAuthenticated, fid, displayName, username, pfpUrl } = usePersistentSIWFProfile();

    const handleSuccess = useCallback((res: StatusAPIResponse) => {
        console.log('SIWF Success:', res);
        if (res.fid) {
            onSuccess?.(res.fid, res.username);
        }
    }, [onSuccess]);

    const handleError = useCallback((error?: AuthClientError) => {
        console.error('SIWF Error:', error);
        onError?.(error);
    }, [onError]);

    if (isAuthenticated && fid) {
        return (
            <div className={`flex items-center gap-2 ${className || ''}`}>
                {pfpUrl && (
                    <img
                        src={pfpUrl}
                        alt={username || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium text-white">
                    {displayName || username || `FID: ${fid}`}
                </span>
            </div>
        );
    }

    return (
        <div className={className}>
            <SignInButton
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
}

// Re-export the persistent hook for use elsewhere
export { usePersistentSIWFProfile as useSIWFProfile, clearSIWFSession };
