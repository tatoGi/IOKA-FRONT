const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://test.ioka.ae/';

console.log('API_BASE_URL:', API_BASE_URL);

module.exports = {
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
    domains: [new URL(API_BASE_URL).hostname], // Fix the hostname here
  },
};
