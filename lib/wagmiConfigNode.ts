/**
 * Node.js compatible Wagmi config
 *
 * This config is for use in Node.js scripts (like setBaseURI.ts)
 * It doesn't import any browser-only dependencies or CSS files
 */

import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Re-export the standard chain configuration
export { baseSepolia };

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'SynauLearn',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
