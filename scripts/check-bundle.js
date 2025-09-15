const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '🔍 Analyzing project dependencies...');

// Get the size of node_modules
const getDirSize = (dirPath) => {
  try {
    const output = execSync(`du -sh "${dirPath}"`).toString();
    return output.split('\t')[0];
  } catch (error) {
    return 'Error calculating size';
  }
};

// Get the largest directories in node_modules
const getLargestDirs = (dirPath, count = 10) => {
  try {
    const output = execSync(`du -sh "${dirPath}"/* | sort -rh | head -n ${count}`).toString();
    return output;
  } catch (error) {
    return 'Error listing directories';
  }
};

// Main function
const analyzeBundle = () => {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('\x1b[31m%s\x1b[0m', '❌ node_modules not found. Run npm install first.');
    return;
  }

  console.log('\n\x1b[33m%s\x1b[0m', '📦 Node Modules Size:');
  console.log(`Total size: ${getDirSize(nodeModulesPath)}`);
  
  console.log('\n\x1b[33m%s\x1b[0m', '📊 Largest Dependencies:');
  console.log(getLargestDirs(nodeModulesPath));
  
  console.log('\n\x1b[36m%s\x1b[0m', '🔍 Checking for common large dependencies:');
  
  const largeDeps = [
    'lodash', 'moment', 'react-icons', '@fancyapps/ui', 
    'bootstrap', 'react-bootstrap', 'antd', '@ant-design/icons'
  ];
  
  const foundDeps = [];
  
  largeDeps.forEach(dep => {
    const depPath = path.join(nodeModulesPath, dep);
    if (fs.existsSync(depPath)) {
      const size = getDirSize(depPath);
      foundDeps.push({ name: dep, size });
    }
  });
  
  if (foundDeps.length > 0) {
    console.log('\n\x1b[33m%s\x1b[0m', '⚠️  Large Dependencies Found:');
    foundDeps.forEach(dep => {
      console.log(`- ${dep.name}: ${dep.size}`);
    });
    
    console.log('\n\x1b[36m%s\x1b[0m', '💡 Optimization Recommendations:');
    
    if (foundDeps.some(dep => dep.name === 'lodash')) {
      console.log('  - Use individual lodash packages (lodash.get, lodash.debounce, etc.)');
    }
    
    if (foundDeps.some(dep => dep.name === 'moment')) {
      console.log('  - Consider replacing moment with date-fns or dayjs for smaller bundle size');
    }
    
    if (foundDeps.some(dep => dep.name === 'react-icons')) {
      console.log('  - Import only the specific icons you need: import { FaIcon } from "react-icons/fa";');
    }
    
    if (foundDeps.some(dep => ['bootstrap', 'react-bootstrap'].includes(dep.name))) {
      console.log('  - Consider using a lighter CSS framework like Tailwind CSS or Unocss');
    }
  } else {
    console.log('  No large common dependencies found! 🎉');
  }
};

// Run the analysis
analyzeBundle();
