"use client";
import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { base, baseSepolia } from "wagmi/chains";
import "@coinbase/onchainkit/styles.css";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme";

// Single wagmi config - no duplicate RainbowKit config
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "SynauLearn",
      preference: "smartWalletOnly",
      version: "4",
    }),
    metaMask(),
    farcasterMiniApp(), // Auto-connect in mini app context
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
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
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
          <WagmiProvider config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

