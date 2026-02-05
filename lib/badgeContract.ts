import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { writeContract, switchChain } from 'wagmi/actions';
import type { Config } from 'wagmi';
import { BADGE_ABI } from './abi/SynauLearnBadgeV2';

// Conditional import: use Node.js config in scripts, browser config in app
let config: Config;
if (typeof window === 'undefined') {
  // Node.js environment (scripts)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { wagmiConfig } = require('./wagmiConfigNode');
  config = wagmiConfig;
} else {
  // Browser environment
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { config: browserConfig } = require('@/app/rootProvider');
  config = browserConfig;
}

// New UUPS Upgradeable Contract (V2) with ECDSA Signature Verification
export const BADGE_CONTRACT_ADDRESS = '0xC824AC961bb05d627363Bcf4A1C4a15390C6B0a1' as const;
export const BADGE_CONTRACT_ABI = BADGE_ABI;

// Public client for reading
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export const BadgeContract = {
  // Get current baseURI from contract
  async getBaseURI(): Promise<string> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'baseURI',
      });
      return result;
    } catch (error) {
      console.error('Error getting baseURI:', error);
      return '';
    }
  },

  // Set baseURI (owner only)
  async setBaseURI(
    newBaseURI: string,
    onStatusUpdate?: (status: string) => void
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      console.log('📝 Setting baseURI to:', newBaseURI);
      onStatusUpdate?.(`Setting baseURI to: ${newBaseURI}`);

      // Check if running in Node.js (script) vs browser
      if (typeof window === 'undefined') {
        // Node.js environment - use private key with viem wallet client
        const privateKey = process.env.OWNER_PRIVATE_KEY;

        if (!privateKey) {
          throw new Error('OWNER_PRIVATE_KEY not found in .env file. Add your contract owner private key to use this script.');
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createWalletClient } = require('viem');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { privateKeyToAccount } = require('viem/accounts');

        const account = privateKeyToAccount(privateKey as `0x${string}`);
        const walletClient = createWalletClient({
          account,
          chain: baseSepolia,
          transport: http()
        });

        console.log('📤 Sending transaction from:', account.address);

        const hash = await walletClient.writeContract({
          address: BADGE_CONTRACT_ADDRESS,
          abi: BADGE_CONTRACT_ABI,
          functionName: 'setBaseURI',
          args: [newBaseURI],
        });

        console.log('✅ BaseURI transaction sent:', hash);
        onStatusUpdate?.('Transaction submitted! Waiting for confirmation...');

        return { success: true, txHash: hash };
      } else {
        // Browser environment - use wagmi writeContract with wallet
        const hash = await writeContract(config, {
          address: BADGE_CONTRACT_ADDRESS,
          abi: BADGE_CONTRACT_ABI,
          functionName: 'setBaseURI',
          args: [newBaseURI],
          chainId: baseSepolia.id,
        });

        console.log('✅ BaseURI transaction sent:', hash);
        onStatusUpdate?.('Transaction submitted! Waiting for confirmation...');

        return { success: true, txHash: hash };
      }
    } catch (error: unknown) {
      console.error('❌ Set baseURI failed:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  // Check if user has badge - Returns tokenId (0 if no badge)
  async hasBadge(userAddress: `0x${string}`, courseId: number): Promise<boolean> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'hasBadge',
        args: [userAddress, BigInt(courseId)]
      });
      // Returns uint256 tokenId - if 0, user doesn't have badge
      return result > BigInt(0);
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  },

  // Get user's badge token ID for a specific course
  async getUserBadgeForCourse(userAddress: `0x${string}`, courseId: number): Promise<bigint> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'hasBadge', // hasBadge returns the tokenId
        args: [userAddress, BigInt(courseId)]
      });
      return result;
    } catch (error) {
      console.error('Error getting badge token ID:', error);
      return BigInt(0);
    }
  },

  // Get all user's badges
  async getUserBadges(userAddress: `0x${string}`): Promise<readonly bigint[]> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'getUserBadges',
        args: [userAddress]
      });
      return result;
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  },

  // Mint badge - NEW: requires signature from backend
  async mintBadge(
    courseId: number,
    signature: `0x${string}`,
    onStatusUpdate?: (status: string) => void
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      console.log('🎯 Step 1: Switching to Base Sepolia...');
      onStatusUpdate?.('Switching to Base Sepolia network...');

      try {
        await switchChain(config, { chainId: baseSepolia.id });
        console.log('✅ Network switched to Base Sepolia');
      } catch (switchError) {
        console.error('❌ Network switch failed:', switchError);
        const errMessage = switchError instanceof Error ? switchError.message : String(switchError);

        // Check if user rejected network switch
        if (errMessage.includes('User rejected') || errMessage.includes('User denied')) {
          return { success: false, error: 'Network switch cancelled. Please switch to Base Sepolia and try again.' };
        }
        return { success: false, error: 'Failed to switch to Base Sepolia network. Please switch manually in your wallet.' };
      }

      console.log('🎯 Step 2: Preparing transaction...');
      onStatusUpdate?.('Preparing transaction...');

      console.log('🎯 Step 3: Sending transaction...');
      onStatusUpdate?.('Please approve in your wallet...');

      // NEW: mintBadge requires courseId AND signature
      const hash = await writeContract(config, {
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [BigInt(courseId), signature],
        chainId: baseSepolia.id,
      });

      console.log('✅ Transaction hash received:', hash);
      onStatusUpdate?.('Transaction submitted!');

      // Return immediately - don't wait for confirmation
      return { success: true, txHash: hash };

    } catch (error: unknown) {
      console.error('❌ Mint failed:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Full error:', error);

        // Handle specific error cases
        if (errorMessage.includes('User rejected') ||
          errorMessage.includes('User denied') ||
          errorMessage.includes('rejected') ||
          errorMessage.includes('denied transaction')) {
          errorMessage = 'Transaction rejected. Please approve in your wallet.';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. Get Base Sepolia ETH from faucet.';
        }
      }

      return { success: false, error: errorMessage };
    }
  }
};