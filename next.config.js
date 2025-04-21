const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.ioka.ae';
const API_HOSTNAME = new URL(API_BASE_URL).hostname;

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
    domains: [API_HOSTNAME, 'test.ioka.ae'],
  },
  transpilePackages: ['@ant-design/icons'],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@ant-design/icons', 'antd'],
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;