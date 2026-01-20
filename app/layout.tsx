import type { Metadata, Viewport } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { minikitConfig } from "@/minikit.config";
import { ClientProviders } from "./ClientProviders";
import "./globals.css";

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://synaulearn.space";

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

/**
 * Enhanced metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  const { miniapp } = minikitConfig;

  return {
    // Basic
    title: {
      default: miniapp.name,
      template: `%s | ${miniapp.name}`,
    },
    description: miniapp.description,
    keywords: ["web3 learning", "crypto education", "blockchain courses", "NFT badges", "learn crypto", "Base blockchain", "SynauLearn", "micro-learning"],
    authors: [{ name: "SynauLearn Team" }],
    creator: "SynauLearn",
    publisher: "SynauLearn",

    // Favicon & Icons
    icons: {
      icon: "/favicon.ico",
      shortcut: "/icon.png",
      apple: "/apple-icon.png",
    },

    // Manifest
    manifest: "/manifest.json",

    // Open Graph
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: "id_ID",
      url: ROOT_URL,
      siteName: miniapp.name,
      title: miniapp.ogTitle || miniapp.name,
      description: miniapp.ogDescription || miniapp.description,
      images: [
        {
          url: miniapp.ogImageUrl || miniapp.heroImageUrl,
          width: 1200,
          height: 630,
          alt: `${miniapp.name} - ${miniapp.tagline}`,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: miniapp.ogTitle || miniapp.name,
      description: miniapp.ogDescription || miniapp.description,
      images: [miniapp.ogImageUrl || miniapp.heroImageUrl],
      creator: "@synaulearn",
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical
    alternates: {
      canonical: ROOT_URL,
    },

    // Category
    category: "education",

    // Farcaster Frame
    other: {
      "fc:frame": JSON.stringify({
        version: miniapp.version,
        imageUrl: miniapp.heroImageUrl,
        button: {
          title: `${miniapp.name}`,
          action: {
            name: `${miniapp.name}`,
            type: "launch_miniapp",
          },
        },
      }),
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/**
 * JSON-LD Structured Data for SEO
 */
function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SynauLearn",
    "description": minikitConfig.miniapp.description,
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://synaulearn.space",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100",
    },
    "author": {
      "@type": "Organization",
      "name": "SynauLearn",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${sourceCodePro.variable} font-sans antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
