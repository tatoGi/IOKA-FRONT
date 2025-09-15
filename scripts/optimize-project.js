const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting project optimization...');

// 1. Update package.json
const updatePackageJson = () => {
  console.log('📦 Updating package.json...');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Remove unused dependencies
  const unusedDeps = ['moment', 'slick-carousel'];
  let removedDeps = 0;
  
  unusedDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      delete packageJson.dependencies[dep];
      console.log(`  - Removed unused dependency: ${dep}`);
      removedDeps++;
    }
  });
  
  // Add lodash-es if using lodash
  if (packageJson.dependencies.lodash) {
    console.log('  - Replacing lodash with lodash-es');
    packageJson.dependencies['lodash-es'] = packageJson.dependencies.lodash;
    delete packageJson.dependencies.lodash;
  }
  
  // Save changes
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Updated package.json (removed ${removedDeps} unused dependencies)`);
};

// 2. Create optimized next.config.js
const updateNextConfig = () => {
  console.log('⚙️  Updating Next.js configuration...');
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  // Check if next.config.js exists
  if (!fs.existsSync(nextConfigPath)) {
    console.log('  - next.config.js not found, creating...');
    const defaultConfig = `module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['ioka.ae'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'react-icons',
      'lodash-es',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
    ],
  },
};
`;
    fs.writeFileSync(nextConfigPath, defaultConfig);
  } else {
    console.log('  - next.config.js already exists, skipping creation');
  }
  console.log('✅ Updated Next.js configuration');
};

// 3. Create .babelrc for modern JavaScript features
const createBabelConfig = () => {
  console.log('⚙️  Configuring Babel...');
  const babelConfigPath = path.join(process.cwd(), '.babelrc');
  
  if (!fs.existsSync(babelConfigPath)) {
    const babelConfig = {
      presets: [
        [
          'next/babel',
          {
            'preset-env': {
              targets: {
                browsers: ['last 2 versions', 'not ie 11', '> 0.2%'],
              },
            },
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-transform-runtime', { useESModules: true }],
        ['lodash'],
      ],
    };
    
    fs.writeFileSync(babelConfigPath, JSON.stringify(babelConfig, null, 2));
    console.log('✅ Created .babelrc');
  } else {
    console.log('  - .babelrc already exists, skipping creation');
  }
};

// 4. Install required dependencies
const installDependencies = () => {
  console.log('📥 Installing optimized dependencies...');
  try {
    execSync('npm install --save lodash-es @babel/plugin-transform-runtime babel-plugin-lodash', {
      stdio: 'inherit',
    });
    console.log('✅ Installed optimized dependencies');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
  }
};

// Run all optimizations
const optimize = async () => {
  try {
    updatePackageJson();
    updateNextConfig();
    createBabelConfig();
    installDependencies();
    
    console.log('\n✨ Optimization complete! Next steps:');
    console.log('1. Review the changes made to your project');
    console.log('2. Run: npm run build');
    console.log('3. Compare the bundle sizes');
    console.log('\nAdditional recommendations:');
    console.log('- Use dynamic imports for large components');
    console.log('- Optimize images using Next.js Image component');
    console.log('- Consider using a CDN for static assets');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
  }
};

optimize();
