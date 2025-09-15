const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting dependency optimization...');

// 1. Replace lodash with lodash-es in package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);

// Remove lodash and add lodash-es
if (packageJson.dependencies.lodash) {
  delete packageJson.dependencies.lodash;
  packageJson.dependencies['lodash-es'] = '^4.17.21';
  console.log('✅ Replaced lodash with lodash-es');
}

// Save updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 2. Update imports in files
console.log('🔍 Updating lodash imports...');
const srcDir = path.join(process.cwd(), 'src') || process.cwd();

const updateImports = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updateImports(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace lodash imports
      content = content.replace(
        /import\s+{[^}]*}\s+from\s+['"]lodash['"]/g, 
        match => match.replace('lodash', 'lodash-es')
      );
      
      // Replace default imports
      content = content.replace(
        /import\s+_\s+from\s+['"]lodash['"]/g,
        'import * as _ from \'lodash-es\''
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
};

// Run the import updates
updateImports(srcDir);

console.log('✅ Successfully optimized dependencies!');
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run build');
console.log('3. Check the bundle size improvements');
