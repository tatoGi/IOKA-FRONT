const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
  analyzerMode: 'static',
  reportFilename: './analyze/report.html'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['ioka.ae'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    // Add the bundle analyzer plugin in development mode
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer 
            ? '../analyze/server.html' 
            : '../analyze/client.html',
          openAnalyzer: true,
          generateStatsFile: true,
          statsFilename: isServer 
            ? '../analyze/server-stats.json' 
            : '../analyze/client-stats.json',
        })
      );
    }
    
    // Target modern browsers for client-side bundles
    if (!isServer) {
      config.target = ['browserslist:last 2 versions, not dead, > 0.2%'];
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
