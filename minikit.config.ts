const ROOT_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjEzNTYxNDYsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg2RTcxYkQzZDBhRTEwN2RDZjVmMzIxOTA4OTI1MTE3RmNEMjc1NjBiIn0",
    payload: "eyJkb21haW4iOiJzeW5hdS1sZWFybi1iYXNlLnZlcmNlbC5hcHAifQ",
    signature: "MHg3MDBhZTU4ZWJhOGY2NDhiZjliZDhmNDI2YTQ3MTIwNDY5YTc3ODViYTliYzkxNTc1ZmRhMWQ2MTA5YThmNTQwNDlkZjNkODYwMjM5MjAyYTY0ZTM2MDdhNGVkN2UyNDFjYjRjYjg3YmFhNzBjZjhlNTZkMjZlYzI3NWE3NDg0YzFj"
  },
  baseBuilder: {
    allowedAddresses: ["0x21A48a64B0D859Ad1e63CeCe21B5B9dab6539284"],
  },
  miniapp: {
    version: "1",
    name: "SynauLearn",
    subtitle: "SynauLearn",
    description: "Learn Web3, blockchain, and crypto through interactive micro-learning. Complete courses, earn XP, and mint your achievements as NFT badges on Base.",
    screenshotUrls: [
      `${ROOT_URL}/screenshot1.jpg`,
      `${ROOT_URL}/screenshot2.jpg`,
      `${ROOT_URL}/screenshot3.jpg`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["education", "learning", "nft", "web3", "blockchain"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Learn First, Earn Later",
    ogTitle: "Learn Web3 and Earn NFT Badges",
    ogDescription: "Interactive micro-learning for Web3. Complete courses and mint achievements as NFT badges.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
