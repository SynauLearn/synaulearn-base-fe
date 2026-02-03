"use client";
import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { base, baseSepolia } from "wagmi/chains";
import "@coinbase/onchainkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme";
import { ConvexClientProvider } from "./ConvexClientProvider";

// Simplified wagmi config - OnchainKit handles farcasterMiniApp connector internally
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "SynauLearn",
      preference: "smartWalletOnly",
      version: "4",
    }),
    metaMask(),
    // farcasterMiniApp() - Removed: OnchainKit handles this internally when miniKit.enabled = true
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ConvexClientProvider>
        <QueryClientProvider client={queryClient}>
          {/* Fixed: WagmiProvider now wraps OnchainKitProvider */}
          <WagmiProvider config={wagmiConfig}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
              chain={baseSepolia}
              config={{
                appearance: {
                  name: "SynauLearn",
                  mode: "auto",
                  theme: "cyberpunk",
                },
                wallet: {
                  display: "modal",
                  preference: "all",
                },
              }}
              miniKit={{
                enabled: true,
                autoConnect: true,
                notificationProxyUrl: undefined,
              }}
            >
              {children}
            </OnchainKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </ConvexClientProvider>
    </ThemeProvider>
  );
}
