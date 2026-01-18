'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

interface WalletConnectProps {
    className?: string;
    showBalance?: boolean;
}

export function WalletConnect({ className, showBalance = true }: WalletConnectProps) {
    const { isInMiniApp, user, isAuthenticated } = useUnifiedAuth();

    // In mini app, user is auto-authenticated via Quick Auth
    // Show minimal wallet info or nothing
    if (isInMiniApp && isAuthenticated) {
        return (
            <div className={`flex items-center gap-2 ${className || ''}`}>
                {user?.pfpUrl && (
                    <img
                        src={user.pfpUrl}
                        alt={user.username || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium">
                    {user?.displayName || user?.username || `FID: ${user?.fid}`}
                </span>
            </div>
        );
    }

    // In browser, show OnchainKit wallet components
    return (
        <div className={className}>
            <Wallet>
                <ConnectWallet>
                    <Avatar className="h-6 w-6" />
                    <Name />
                </ConnectWallet>
                <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                        <Avatar />
                        <Name />
                        <Address />
                        {showBalance && <EthBalance />}
                    </Identity>
                    <WalletDropdownDisconnect />
                </WalletDropdown>
            </Wallet>
        </div>
    );
}

// Simple connect button for simpler use cases
export function ConnectButton({ className }: { className?: string }) {
    const { isInMiniApp, isAuthenticated, user } = useUnifiedAuth();

    if (isInMiniApp && isAuthenticated) {
        return (
            <span className={`text-sm ${className || ''}`}>
                Connected as {user?.username || `FID: ${user?.fid}`}
            </span>
        );
    }

    return (
        <Wallet>
            <ConnectWallet className={className} />
        </Wallet>
    );
}
