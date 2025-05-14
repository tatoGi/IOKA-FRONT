const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.ioka.ae';
const API_HOSTNAME = new URL(API_BASE_URL).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.basemaps.cartocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'b.basemaps.cartocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c.basemaps.cartocdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: API_HOSTNAME,
        pathname: '/**',
      }
    ],
    unoptimized: true,
    domains: [API_HOSTNAME, 'test.ioka.ae'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: ['@ant-design/icons'],
  experimental: {
    modern: true,
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    // Only include necessary polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Remove unnecessary polyfills
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;