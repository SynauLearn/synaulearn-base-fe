// Auto-generated from SynauLearnBadgeV2.sol
// Network: Base Sepolia (Chain ID: 84532)
// Proxy Address: 0x505972A66F8Bb9CA4300652E3726786fc1eF01A2

export const BADGE_CONTRACT_ADDRESS = '0x505972A66F8Bb9CA4300652E3726786fc1eF01A2' as const;

export const BADGE_ABI = [
  {
    "type": "function",
    "name": "approve",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "baseURI",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "getApproved",
    "stateMutability": "view",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "type": "function",
    "name": "getUserBadges",
    "stateMutability": "view",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256[]" }]
  },
  {
    "type": "function",
    "name": "hasBadge",
    "stateMutability": "view",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "courseId", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "initialize",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "baseURI_", "type": "string" },
      { "name": "trustedSigner_", "type": "address" },
      { "name": "initialMaxCourseId_", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "stateMutability": "view",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "operator", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "maxCourseId",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "mintBadge",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "courseId", "type": "uint256" },
      { "name": "signature", "type": "bytes" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "name",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "owner",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "type": "function",
    "name": "ownerOf",
    "stateMutability": "view",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" },
      { "name": "data", "type": "bytes" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "approved", "type": "bool" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setBaseURI",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "newBaseURI", "type": "string" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setMaxCourseId",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "newMaxCourseId", "type": "uint256" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "setTrustedSigner",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "newSigner", "type": "address" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "stateMutability": "view",
    "inputs": [{ "name": "interfaceId", "type": "bytes4" }],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "symbol",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "tokenToCourse",
    "stateMutability": "view",
    "inputs": [{ "name": "", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "tokenURI",
    "stateMutability": "view",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "totalSupply",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "transferFrom",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "tokenId", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "newOwner", "type": "address" }],
    "outputs": []
  },
  {
    "type": "function",
    "name": "trustedSigner",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "stateMutability": "payable",
    "inputs": [
      { "name": "newImplementation", "type": "address" },
      { "name": "data", "type": "bytes" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "userCourseBadge",
    "stateMutability": "view",
    "inputs": [
      { "name": "", "type": "address" },
      { "name": "", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "version",
    "stateMutability": "pure",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "approved", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "operator", "type": "address", "indexed": true },
      { "name": "approved", "type": "bool", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "BadgeMinted",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": false },
      { "name": "courseId", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "BaseURIUpdated",
    "inputs": [
      { "name": "oldURI", "type": "string", "indexed": false },
      { "name": "newURI", "type": "string", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      { "name": "version", "type": "uint64", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "MaxCourseIdUpdated",
    "inputs": [
      { "name": "oldMax", "type": "uint256", "indexed": false },
      { "name": "newMax", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      { "name": "previousOwner", "type": "address", "indexed": true },
      { "name": "newOwner", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true },
      { "name": "to", "type": "address", "indexed": true },
      { "name": "tokenId", "type": "uint256", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "TrustedSignerUpdated",
    "inputs": [
      { "name": "oldSigner", "type": "address", "indexed": false },
      { "name": "newSigner", "type": "address", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      { "name": "implementation", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "error",
    "name": "BadgeAlreadyMinted",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "courseId", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "CannotDecreaseMaxCourseId",
    "inputs": [
      { "name": "current", "type": "uint256" },
      { "name": "proposed", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "InvalidCourseId",
    "inputs": [
      { "name": "courseId", "type": "uint256" },
      { "name": "maxAllowed", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "InvalidSignature",
    "inputs": [
      { "name": "recovered", "type": "address" },
      { "name": "expected", "type": "address" }
    ]
  },
  {
    "type": "error",
    "name": "SignerNotSet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TokenDoesNotExist",
    "inputs": [
      { "name": "tokenId", "type": "uint256" }
    ]
  }
] as const;
