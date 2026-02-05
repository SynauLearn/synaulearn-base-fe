# 🔄 SynauLearn Contract Upgrade Guide

This guide explains how to safely upgrade the SynauLearnBadge smart contract using the **UUPS Proxy Pattern**.

---

## 📐 Architecture Overview

```
┌─────────────────┐       ┌─────────────────┐
│   Proxy (UUPS)  │──────▶│ Implementation  │
│   0xProxy...    │       │ (SynauLearnV1)  │
│                 │       │   0xImpl...     │
│ - Stores Data   │       │ - Contains Logic│
│ - Fixed Address │       │ - Upgradeable   │
└─────────────────┘       └─────────────────┘
        │
        ▼ (After Upgrade)
┌─────────────────┐
│ Implementation  │
│ (SynauLearnV2)  │
│   0xNewImpl...  │
│ - New Features  │
└─────────────────┘
```

**Key Point**: Users always interact with the **Proxy address**. The proxy delegates calls to the current implementation.

---

## 📦 File Structure

```
synaulearn-base-fe/
├── contracts/
│   ├── SynauLearnBadgeV1.sol      # Initial implementation
│   ├── SynauLearnBadgeV2.sol      # Future upgrade (example)
│   └── SynauLearnBadgeProxy.sol   # ERC1967 Proxy (optional, OZ handles this)
├── scripts/
│   ├── deploy-upgradeable.ts      # Deploy proxy + V1
│   └── upgrade-to-v2.ts           # Upgrade to V2
└── docs/
    └── upgrade-guide.md           # This file
```

---

## 🛡️ Storage Layout Rules (CRITICAL)

> ⚠️ **Breaking these rules will corrupt your contract data.**

### Rule 1: Never Remove or Reorder Variables
```solidity
// V1 (Original)
contract SynauLearnBadgeV1 {
    uint256 private _tokenIdCounter;    // Slot 0
    string private _baseTokenURI;       // Slot 1
    mapping(uint256 => uint256) public tokenToCourse;  // Slot 2
}

// V2 (WRONG ❌) - Removed _baseTokenURI
contract SynauLearnBadgeV2 {
    uint256 private _tokenIdCounter;    // Slot 0
    mapping(uint256 => uint256) public tokenToCourse;  // Slot 1 ← COLLISION!
}

// V2 (CORRECT ✅) - Only append new variables
contract SynauLearnBadgeV2 {
    uint256 private _tokenIdCounter;    // Slot 0
    string private _baseTokenURI;       // Slot 1
    mapping(uint256 => uint256) public tokenToCourse;  // Slot 2
    // NEW VARIABLES GO HERE ↓
    uint256 public mintFee;             // Slot 3 (new)
    bool public isPaused;               // Slot 4 (new)
}
```

### Rule 2: Use Storage Gaps for Future Expansion
```solidity
// Reserve space for future variables
uint256[50] private __gap;  // 50 empty slots for future use
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Upgradeable Contract (First Time)
```bash
# Using Foundry
forge script script/DeployUpgradeable.s.sol --rpc-url $RPC_URL --broadcast

# Using Hardhat
npx hardhat run scripts/deploy-upgradeable.ts --network baseSepolia
```

### Step 2: Verify on Basescan
```bash
forge verify-contract <IMPL_ADDRESS> SynauLearnBadgeV1 --chain base-sepolia
forge verify-contract <PROXY_ADDRESS> ERC1967Proxy --chain base-sepolia
```

### Step 3: Update Frontend
```typescript
// lib/badgeContract.ts
export const BADGE_CONTRACT_ADDRESS = '0xYOUR_PROXY_ADDRESS';
```

---

## ⬆️ Upgrade Process

### Step 1: Write V2 Contract
```solidity
// contracts/SynauLearnBadgeV2.sol
contract SynauLearnBadgeV2 is SynauLearnBadgeV1 {
    uint256 public mintFee;

    function setMintFee(uint256 _fee) external onlyOwner {
        mintFee = _fee;
    }

    function mintBadge(uint256 courseId) public payable override {
        require(msg.value >= mintFee, "Insufficient fee");
        super.mintBadge(courseId);
    }
}
```

### Step 2: Run Storage Check
```bash
# Foundry
forge inspect SynauLearnBadgeV1 storage-layout > v1-layout.json
forge inspect SynauLearnBadgeV2 storage-layout > v2-layout.json
diff v1-layout.json v2-layout.json
```

### Step 3: Deploy V2 & Upgrade
```bash
forge script script/UpgradeToV2.s.sol --rpc-url $RPC_URL --broadcast
```

### Step 4: Verify Upgrade
```typescript
// Test that old data is intact
const tokenOwner = await contract.ownerOf(1);
console.log('Token 1 still owned by:', tokenOwner);

// Test new function works
await contract.setMintFee(parseEther('0.001'));
```

---

## ⚠️ Common Pitfalls

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| "Initializer already called" | Called `initialize()` twice | Use `reinitializer(2)` for V2 |
| "Not owner" | Wrong wallet signed upgrade | Check deployer address |
| Data corrupted | Changed storage layout | **CANNOT BE FIXED**. Redeploy. |
| Upgrade reverts | Missing `_authorizeUpgrade` | Keep UUPS functions in all versions |

---

## 🔐 Security Checklist

- [ ] **Multisig Owner**: Use a Safe wallet, not an EOA.
- [ ] **Timelock**: Add delay for upgrades (optional, for transparency).
- [ ] **Test on Testnet First**: Always upgrade on Sepolia before Mainnet.
- [ ] **Storage Diff**: Run storage layout comparison before every upgrade.
- [ ] **Keep V1 Source**: Never delete old contract versions.

---

## 📚 References

- [OpenZeppelin Upgrades Guide](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
- [UUPS vs Transparent Proxy](https://docs.openzeppelin.com/contracts/5.x/api/proxy#UUPSUpgradeable)
- [Storage Gaps Best Practice](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#storage-gaps)
