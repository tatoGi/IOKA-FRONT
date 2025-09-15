const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Create analyze directory if it doesn't exist
const analyzeDir = path.join(process.cwd(), 'analyze');
if (!fs.existsSync(analyzeDir)) {
  fs.mkdirSync(analyzeDir);
}

// Run the build with analysis
console.log('\x1b[36m%s\x1b[0m', '🚀 Starting bundle analysis...');

try {
  // Run the production build with analysis
  execSync('cross-env ANALYZE=true next build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  console.log('\n\x1b[32m%s\x1b[0m', '✅ Bundle analysis completed!');
  console.log('\x1b[36m%s\x1b[0m', '📊 Check the following files in your browser:');
  console.log('   - Client bundle: file://' + path.join(analyzeDir, 'client.html'));
  console.log('   - Server bundle: file://' + path.join(analyzeDir, 'server.html'));
  console.log('\n\x1b[33m%s\x1b[0m', '💡 Tips for reducing bundle size:');
  console.log('  1. Use dynamic imports for large components');
  console.log('  2. Remove unused dependencies');
  console.log('  3. Optimize images with next/image');
  console.log('  4. Consider code splitting for large libraries');
  console.log('\nRun \x1b[35mnpm run analyze:fix\x1b[0m to apply automatic fixes');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Bundle analysis failed:');
  console.error(error.message);
  process.exit(1);
}
