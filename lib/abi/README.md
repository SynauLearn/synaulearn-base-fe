# Frontend ABI Usage Guide

## 📦 Installation

Copy these files to your frontend project:
- `abi/SynauLearnBadgeV2.ts` → Your frontend `lib/` or `contracts/` directory
- `abi/SynauLearnBadgeV2.json` → Raw JSON ABI (optional)

## 🔧 Setup with wagmi/viem

### 1. Import the ABI

```typescript
import { BADGE_CONTRACT_ADDRESS, BADGE_ABI } from '@/lib/contracts/SynauLearnBadgeV2';
```

### 2. Read Contract Data

```typescript
import { useReadContract } from 'wagmi';

// Get user's badges
const { data: badges } = useReadContract({
  address: BADGE_CONTRACT_ADDRESS,
  abi: BADGE_ABI,
  functionName: 'getUserBadges',
  args: [userAddress],
});

// Check if user has specific badge
const { data: hasBadge } = useReadContract({
  address: BADGE_CONTRACT_ADDRESS,
  abi: BADGE_ABI,
  functionName: 'hasBadge',
  args: [userAddress, courseId],
});

// Get token URI
const { data: tokenURI } = useReadContract({
  address: BADGE_CONTRACT_ADDRESS,
  abi: BADGE_ABI,
  functionName: 'tokenURI',
  args: [tokenId],
});
```

### 3. Mint Badge (with Signature)

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

function MintBadge({ courseId }: { courseId: number }) {
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    // 1. Get signature from your backend
    const response = await fetch('/api/badge/sign', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
    const { signature } = await response.json();

    // 2. Call contract
    writeContract({
      address: BADGE_CONTRACT_ADDRESS,
      abi: BADGE_ABI,
      functionName: 'mintBadge',
      args: [BigInt(courseId), signature as `0x${string}`],
    });
  };

  return (
    <button onClick={handleMint} disabled={isConfirming}>
      {isConfirming ? 'Minting...' : 'Mint Badge'}
    </button>
  );
}
```

### 4. Listen to Events

```typescript
import { useWatchContractEvent } from 'wagmi';

useWatchContractEvent({
  address: BADGE_CONTRACT_ADDRESS,
  abi: BADGE_ABI,
  eventName: 'BadgeMinted',
  onLogs(logs) {
    console.log('Badge minted!', logs);
    // Refresh UI or show notification
  },
});
```

## 🔐 Backend Signature Generation

Your backend needs to sign `keccak256(abi.encodePacked(userAddress, courseId))`:

```typescript
// backend/api/badge/sign.ts
import { ethers } from 'ethers';

export async function POST(req: Request) {
  const { courseId, userAddress } = await req.json();
  
  // Verify user completed course (check your database)
  const hasCompleted = await checkCourseCompletion(userAddress, courseId);
  if (!hasCompleted) {
    return Response.json({ error: 'Course not completed' }, { status: 403 });
  }

  // Sign the mint permission
  const signer = new ethers.Wallet(process.env.MINT_SIGNER_PRIVATE_KEY!);
  const messageHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [userAddress, courseId]
  );
  const signature = await signer.signMessage(ethers.getBytes(messageHash));

  return Response.json({ signature });
}
```

## 📊 Common Patterns

### Display User Badges

```typescript
function UserBadges({ address }: { address: string }) {
  const { data: courseIds } = useReadContract({
    address: BADGE_CONTRACT_ADDRESS,
    abi: BADGE_ABI,
    functionName: 'getUserBadges',
    args: [address],
  });

  return (
    <div>
      {courseIds?.map((courseId) => (
        <Badge key={courseId.toString()} courseId={courseId} />
      ))}
    </div>
  );
}
```

### Check Minting Eligibility

```typescript
async function canMintBadge(userAddress: string, courseId: number) {
  // 1. Check if already minted
  const hasBadge = await readContract({
    address: BADGE_CONTRACT_ADDRESS,
    abi: BADGE_ABI,
    functionName: 'hasBadge',
    args: [userAddress, BigInt(courseId)],
  });
  
  if (hasBadge > 0n) return false;

  // 2. Check backend eligibility
  const response = await fetch(`/api/badge/eligibility?courseId=${courseId}`);
  const { eligible } = await response.json();
  
  return eligible;
}
```

## 🎯 ChainID Configuration

```typescript
import { baseSepolia, base } from 'viem/chains';

export const CHAIN = process.env.NODE_ENV === 'production' 
  ? base 
  : baseSepolia;

export const BADGE_CONTRACT_ADDRESS = process.env.NODE_ENV === 'production'
  ? '0xPRODUCTION_ADDRESS' as const
  : '0x505972A66F8Bb9CA4300652E3726786fc1eF01A2' as const;
```

## 📝 TypeScript Types

```typescript
// Auto-inferred from ABI
import type { Address } from 'viem';

type BadgeContract = {
  getUserBadges: (address: Address) => Promise<bigint[]>;
  hasBadge: (user: Address, courseId: bigint) => Promise<bigint>;
  mintBadge: (courseId: bigint, signature: `0x${string}`) => Promise<void>;
};
```

## 🧪 Testing

```typescript
import { expect, test } from '@playwright/test';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { BADGE_CONTRACT_ADDRESS, BADGE_ABI } from './SynauLearnBadgeV2';

test('should read badge data', async () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const version = await client.readContract({
    address: BADGE_CONTRACT_ADDRESS,
    abi: BADGE_ABI,
    functionName: 'version',
  });

  expect(version).toBe('2.0.0');
});
```

## 🔗 Resources

- **Contract**: [BaseScan](https://sepolia.basescan.org/address/0x505972A66F8Bb9CA4300652E3726786fc1eF01A2)
- **wagmi Docs**: https://wagmi.sh
- **viem Docs**: https://viem.sh
