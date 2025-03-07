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
    domains: [
      'a.basemaps.cartocdn.com',
      'b.basemaps.cartocdn.com',
      'c.basemaps.cartocdn.com',
      new URL(API_BASE_URL).hostname, // Add the API base URL hostname
      '127.0.0.1' // Add localhost for development
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: API_BASE_URL, // Ensure the environment variable is set
  },
};
