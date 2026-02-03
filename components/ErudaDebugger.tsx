'use client';

import { useEffect } from 'react';

/**
 * ErudaDebugger - Mobile debugging console
 * 
 * To enable, add to your page or layout:
 *   <ErudaDebugger enabled />
 * 
 * Or conditionally:
 *   <ErudaDebugger enabled={process.env.NODE_ENV === 'development'} />
 */
export default function ErudaDebugger({ enabled = true }: { enabled?: boolean }) {
    useEffect(() => {
        if (!enabled) return;
        if (typeof window === 'undefined') return;

        // Only load in browser
        import('eruda').then((eruda) => {
            eruda.default.init();
            console.log('🔧 Eruda debugger initialized');
        }).catch((err) => {
            console.error('Failed to load Eruda:', err);
        });
    }, [enabled]);

    return null;
}
