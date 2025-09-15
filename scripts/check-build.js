const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '🚀 Analyzing production build...');

// Run production build
try {
  console.log('\n🔧 Building production version...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check .next directory size
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    const stats = fs.statSync(nextDir);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log('\n📊 Production build size:', sizeInMB, 'MB');
    
    // Analyze chunks
    const chunksDir = path.join(nextDir, 'static/chunks');
    if (fs.existsSync(chunksDir)) {
      console.log('\n📦 Largest JavaScript chunks:');
      const files = fs.readdirSync(chunksDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(chunksDir, file);
          return {
            name: file,
            size: fs.statSync(filePath).size
          };
        })
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);
      
      files.forEach(file => {
        const sizeInKB = (file.size / 1024).toFixed(2);
        console.log(`- ${file.name}: ${sizeInKB} KB`);
      });
    }
  } else {
    console.error('\x1b[31m%s\x1b[0m', '❌ .next directory not found. Build might have failed.');
  }
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Build failed:', error.message);
}

// Check for known large dependencies
console.log('\n🔍 Checking for known large dependencies...');
const packageJson = require('../package.json');
const largeDeps = [
  'lodash', 'moment', 'date-fns', 'react-icons', 
  '@fancyapps/ui', 'bootstrap', 'react-bootstrap'
];

const foundDeps = largeDeps.filter(dep => packageJson.dependencies[dep] || packageJson.devDependencies[dep]);

if (foundDeps.length > 0) {
  console.log('\n⚠️  Found potentially large dependencies:');
  foundDeps.forEach(dep => console.log(`- ${dep}`));
  
  console.log('\n💡 Optimization suggestions:');
  if (foundDeps.includes('lodash')) {
    console.log('  - Use individual lodash packages (lodash.get, lodash.debounce, etc.)');
  }
  if (foundDeps.includes('moment')) {
    console.log('  - Replace moment with date-fns or dayjs for smaller bundle size');
  }
  if (foundDeps.includes('react-icons')) {
    console.log('  - Import only the specific icons you need: import { FaIcon } from "react-icons/fa";');
  }
  if (foundDeps.some(dep => ['bootstrap', 'react-bootstrap'].includes(dep))) {
    console.log('  - Consider using a lighter CSS framework like Tailwind CSS');
  }
} else {
  console.log('\n✅ No known large dependencies found!');
}

console.log('\n✨ Analysis complete!');
