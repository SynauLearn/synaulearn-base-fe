import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { writeContract, switchChain } from 'wagmi/actions';
import type { Config } from 'wagmi';

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

export const BADGE_CONTRACT_ADDRESS = '0x086ac79f0354B4102d6156bdf2BC1D49a2f893aD' as const;

export const BADGE_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "BadgeMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserBadges",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "courseId", type: "uint256" },
    ],
    name: "hasBadge",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "courseId", type: "uint256" }],
    name: "mintBadge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newBaseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tokenToCourse",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userCourseBadge",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

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

  // Mint badge - NEW ABI: only takes courseId (uint256)
  async mintBadge(
    courseId: number,
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

      // NEW ABI: mintBadge only takes courseId (uint256)
      const hash = await writeContract(config, {
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [BigInt(courseId)],
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