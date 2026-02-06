# 🚀 SynauLearn Badge Contract Deployment Guide

This guide walks you through deploying the UUPS Upgradeable SynauLearnBadge contract with ECDSA signature verification.

---

## 📋 Prerequisites

### Required Tools
```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
cast --version
```

### Required Accounts
You need **2 wallets**:

| Wallet | Purpose | Holds Funds? |
| :--- | :--- | :---: |
| **Deployer** | Deploys contract, becomes Owner | ✅ Yes (ETH for gas) |
| **Signer** | Signs mint permissions (backend) | ❌ No |

> ⚠️ **IMPORTANT**: Never use the same wallet for both! Keep the Signer's private key in your backend only.

---

## 🔧 Step 1: Environment Setup

### 1.1 Generate a Signing Wallet
```bash
# Generate a new wallet for signing
cast wallet new

# Output:
# Address: 0x1234...abcd
# Private Key: 0xabc123...
```

Save both values - you'll need them.

### 1.2 Configure Environment Variables

Create or update your `.env` file:
```bash
# Deployer wallet (must have Base Sepolia ETH)
PRIVATE_KEY=0xYourDeployerPrivateKey

# Signer wallet (generated above)
TRUSTED_SIGNER_ADDRESS=0xSignerAddressFromAbove
MINT_SIGNER_PRIVATE_KEY=0xSignerPrivateKeyFromAbove

# Contract configuration
BASE_URI=ipfs://placeholder/
RPC_URL=https://sepolia.base.org

# Optional: For verification
BASESCAN_API_KEY=your_basescan_api_key
```

### 1.3 Get Base Sepolia ETH
Get testnet ETH from one of these faucets:
- [Coinbase Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

---

## 📦 Step 2: Install Dependencies

```bash
# Install OpenZeppelin Upgradeable Contracts
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Update remappings (if needed)
forge remappings > remappings.txt
```

Verify `remappings.txt` contains:
```
@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/
```

---

## 🏗️ Step 3: Deploy Contract

### 3.1 Compile
```bash
forge build
```

### 3.2 Dry Run (Simulation)
```bash
forge script script/DeployUpgradeable.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  -vvv
```

### 3.3 Deploy for Real
```bash
forge script script/DeployUpgradeable.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvv
```

**Expected Output:**
```
Implementation deployed at: 0xImpl...
Proxy deployed at: 0xProxy...
Contract name: SynauLearn Badge
Contract symbol: SLB
Contract version: 1.0.0
Owner: 0xYourDeployer...

=== UPDATE YOUR FRONTEND ===
BADGE_CONTRACT_ADDRESS = 0xProxy...
============================
```

> 💡 **Save the PROXY address** - this is what users interact with!

---

## ✅ Step 4: Verify on Basescan

### 4.1 Verify Implementation
```bash
forge verify-contract <IMPLEMENTATION_ADDRESS> \
  contracts/SynauLearnBadgeV1.sol:SynauLearnBadgeV1 \
  --chain base-sepolia \
  --etherscan-api-key $BASESCAN_API_KEY
```

### 4.2 Verify Proxy
```bash
forge verify-contract <PROXY_ADDRESS> \
  lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy \
  --chain base-sepolia \
  --etherscan-api-key $BASESCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address,bytes)" <IMPLEMENTATION_ADDRESS> <INIT_DATA>)
```

---

## 🔄 Step 5: Update Frontend

### 5.1 Update Contract Address
Edit `lib/badgeContract.ts`:
```typescript
export const BADGE_CONTRACT_ADDRESS = '0xYourProxyAddress' as const;
```

### 5.2 Update Environment
Add to your production environment:
```bash
# Vercel / Deployment Environment
MINT_SIGNER_PRIVATE_KEY=0xSignerPrivateKey
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

---

## 🧪 Step 6: Test the Deployment

### 6.1 Check Contract State
```bash
# Check owner
cast call <PROXY_ADDRESS> "owner()" --rpc-url $RPC_URL

# Check trusted signer
cast call <PROXY_ADDRESS> "trustedSigner()" --rpc-url $RPC_URL

# Check version
cast call <PROXY_ADDRESS> "version()" --rpc-url $RPC_URL
```

### 6.2 Test Mint Flow
1. Complete a course in the app
2. Click "Mint Badge"
3. Backend should sign the request
4. Transaction should succeed

---

## 🔐 Post-Deployment Security

### Transfer Ownership (Optional)
Transfer to a multisig for production:
```bash
cast send <PROXY_ADDRESS> "transferOwnership(address)" <MULTISIG_ADDRESS> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### Update Trusted Signer (If needed)
```bash
cast send <PROXY_ADDRESS> "setTrustedSigner(address)" <NEW_SIGNER> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### Update Base URI (After IPFS upload)
```bash
cast send <PROXY_ADDRESS> "setBaseURI(string)" "ipfs://QmYourNewHash/" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

---

## 📍 Quick Reference

| Item | Value |
| :--- | :--- |
| **Network** | Base Sepolia (Chain ID: 84532) |
| **Proxy Address** | `0x...` (Update after deploy) |
| **Implementation** | `0x...` (Update after deploy) |
| **Owner** | Your deployer address |
| **Trusted Signer** | Your backend signer address |

---

## 🆘 Troubleshooting

| Error | Solution |
| :--- | :--- |
| `insufficient funds` | Get Base Sepolia ETH from faucet |
| `SignerNotSet` | Contract not initialized with signer |
| `InvalidSignature` | Backend private key doesn't match trustedSigner |
| `execution reverted` | Run with `-vvvv` for detailed trace |
