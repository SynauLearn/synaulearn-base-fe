'use client';

import { SignInButton, useProfile, StatusAPIResponse, AuthClientError } from '@farcaster/auth-kit';
import { useCallback } from 'react';

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
    const { isAuthenticated, profile } = useProfile();

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

    if (isAuthenticated && profile?.fid) {
        return (
            <div className={`flex items-center gap-2 ${className || ''}`}>
                {profile.pfpUrl && (
                    <img
                        src={profile.pfpUrl}
                        alt={profile.username || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium text-white">
                    {profile.displayName || profile.username || `FID: ${profile.fid}`}
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

// Hook to get SIWF profile data
export function useSIWFProfile() {
    const { isAuthenticated, profile } = useProfile();

    return {
        isAuthenticated,
        fid: profile?.fid,
        username: profile?.username,
        displayName: profile?.displayName,
        pfpUrl: profile?.pfpUrl,
        bio: profile?.bio,
        custody: profile?.custody,
    };
}
