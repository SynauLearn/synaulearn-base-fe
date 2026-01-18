"use client";

import { ReactNode, useState, useEffect } from "react";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { RootProvider } from "./rootProvider";

interface ClientProvidersProps {
    children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render providers until client-side mount to prevent SSR localStorage errors
    // This is necessary because @coinbase/onchainkit, @farcaster/miniapp-sdk, and wagmi
    // access localStorage during initialization which fails on server-side
    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <RootProvider>
            <SafeArea>{children}</SafeArea>
        </RootProvider>
    );
}
