const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.ioka.ae';

module.exports = {
  transpilePackages: ['@ant-design/icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.basemaps.cartocdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'b.basemaps.cartocdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c.basemaps.cartocdn.com',
        port: '',
        pathname: '/**',
      }
    ],
    domains: [new URL(API_BASE_URL).hostname, 'test.ioka.ae'], // Ensure the hostname is correct
  },
};
