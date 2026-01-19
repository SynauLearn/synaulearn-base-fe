'use client';

/**
 * SIWF Session Persistence Hook
 * 
 * Stores SIWF profile data in localStorage to persist across page refreshes.
 * AuthKit doesn't persist session by default.
 */

import { useEffect, useState } from 'react';
import { useProfile } from '@farcaster/auth-kit';

const STORAGE_KEY = 'synaulearn_siwf_session';

interface StoredSession {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    bio?: string;
    custody?: string;
    timestamp: number;
}

// Session expires after 7 days
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function getStoredSession(): StoredSession | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const session: StoredSession = JSON.parse(stored);

        // Check if session is expired
        if (Date.now() - session.timestamp > SESSION_EXPIRY_MS) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

function saveSession(session: StoredSession) {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('Failed to save SIWF session:', error);
    }
}

export function clearSIWFSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Hook that returns SIWF profile with localStorage persistence.
 * Combines AuthKit's live profile with stored session for persistence across refreshes.
 */
export function usePersistentSIWFProfile() {
    const { isAuthenticated: authKitAuthenticated, profile: authKitProfile } = useProfile();
    const [storedSession, setStoredSession] = useState<StoredSession | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load stored session on mount
    useEffect(() => {
        const session = getStoredSession();
        setStoredSession(session);
        setIsHydrated(true);
    }, []);

    // Save session when AuthKit authenticates
    useEffect(() => {
        if (authKitAuthenticated && authKitProfile?.fid) {
            const session: StoredSession = {
                fid: authKitProfile.fid,
                username: authKitProfile.username,
                displayName: authKitProfile.displayName,
                pfpUrl: authKitProfile.pfpUrl,
                bio: authKitProfile.bio,
                custody: authKitProfile.custody,
                timestamp: Date.now(),
            };
            saveSession(session);
            setStoredSession(session);
        }
    }, [authKitAuthenticated, authKitProfile]);

    // Determine final auth state
    // Use AuthKit if authenticated, otherwise fall back to stored session
    const isAuthenticated = authKitAuthenticated || !!storedSession;
    const profile = authKitAuthenticated
        ? authKitProfile
        : storedSession;

    return {
        isAuthenticated,
        isHydrated, // Use this to avoid hydration mismatch
        fid: profile?.fid,
        username: profile?.username,
        displayName: profile?.displayName,
        pfpUrl: profile?.pfpUrl,
        bio: profile?.bio,
        custody: profile?.custody,
        // Method to clear session (logout)
        clearSession: clearSIWFSession,
    };
}
