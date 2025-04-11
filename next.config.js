/** @type {import('next').NextConfig} */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.ioka.ae';
const API_HOSTNAME = new URL(API_BASE_URL).hostname;

const nextConfig = {
  reactStrictMode: true,
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
    domains: [
      API_HOSTNAME,
      'test.ioka.ae',
      'localhost',
      '127.0.0.1',
      'your-api-domain.com',
      'https://ioka-front.vercel.app/',
    ],
  },
  transpilePackages: ['@ant-design/icons'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

module.exports = nextConfig;