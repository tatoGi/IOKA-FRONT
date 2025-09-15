const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '🔍 Analyzing bundle for common issues...');

// Common large dependencies that can be optimized
const LARGE_DEPS = [
  'lodash',
  'moment',
  'date-fns',
  'react-icons',
  '@fancyapps/ui',
  'bootstrap',
  'react-bootstrap'
];

// Check package.json for large dependencies
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);
const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

console.log('\n\x1b[33m%s\x1b[0m', '📦 Large Dependencies Found:');

let hasLargeDeps = false;
LARGE_DEPS.forEach(dep => {
  if (deps[dep]) {
    console.log(`  - ${dep}: ${deps[dep]}`);
    hasLargeDeps = true;
  }
});

if (!hasLargeDeps) {
  console.log('  No large dependencies found! 🎉');
}

// Generate optimization recommendations
console.log('\n\x1b[36m%s\x1b[0m', '💡 Optimization Recommendations:');

if (deps['lodash']) {
  console.log('  - Use individual lodash packages (lodash.get, lodash.debounce, etc.)');
}

if (deps['moment']) {
  console.log('  - Consider replacing moment with date-fns or dayjs for smaller bundle size');
}

if (deps['react-icons']) {
  console.log('  - Import only the specific icons you need: import { FaIcon } from "react-icons/fa";');
}

if (deps['bootstrap'] || deps['react-bootstrap']) {
  console.log('  - Consider using a lighter CSS framework like Tailwind CSS or Unocss');
}

console.log('\n\x1b[32m%s\x1b[0m', '🚀 Run the following command to analyze your bundle:');
console.log('   npm run analyze');

// Check for next/image usage
const pagesDir = path.join(process.cwd(), 'pages');
const componentsDir = path.join(process.cwd(), 'components');

function checkForImgTags(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      checkForImgTags(fullPath);
    } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<img ') && !content.includes("from 'next/image'")) {
        console.log('\n\x1b[33m%s\x1b[0m', `⚠️ Found <img> tag in ${fullPath.replace(process.cwd(), '')} - Consider using next/image`);
      }
    }
  });
}

console.log('\n\x1b[36m%s\x1b[0m', '🔍 Checking for unoptimized images...');
checkForImgTags(pagesDir);
checkForImgTags(componentsDir);

console.log('\n\x1b[32m%s\x1b[0m', '✅ Analysis complete! Check the recommendations above.');
