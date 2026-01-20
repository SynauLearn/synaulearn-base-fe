import type { NextConfig } from "next";

// Bundle analyzer for debugging bundle size
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },


  // Optimize bundle
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Fix WalletConnect localStorage SSR error
    // @walletconnect/keyvaluestorage accesses localStorage in constructor
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@walletconnect/keyvaluestorage': require.resolve('./lib/mocks/walletconnect-storage.js'),
      };
    }

    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@coinbase/onchainkit', 'wagmi', 'viem'],
  },

  // Required for Next.js 16 when webpack config exists
  // See: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
  turbopack: {
    // Fix WalletConnect localStorage SSR error
    // @walletconnect/keyvaluestorage accesses localStorage in constructor
    resolveAlias: {
      '@walletconnect/keyvaluestorage': './lib/mocks/walletconnect-storage.js',
    },
  },
};

export default withBundleAnalyzer(nextConfig);

