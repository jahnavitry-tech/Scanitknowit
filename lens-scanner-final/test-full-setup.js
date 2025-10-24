// Test script to verify the full setup works correctly
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Verifying Full Lens Scanner Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'api/package.json',
  'src/App.jsx',
  'src/main.jsx',
  'src/styles.css',
  'src/components/CameraPanel.jsx',
  'src/components/AnalysisPanel.jsx',
  'api/analyze.js',
  'index.html',
  'vite.config.js'
];

let allFilesExist = true;
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} (MISSING)`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// Check if node_modules exist
console.log('📦 Checking dependencies:');
const frontendDeps = fs.existsSync('node_modules');
const backendDeps = fs.existsSync('api/node_modules');

console.log(`  Frontend dependencies: ${frontendDeps ? '✅ Installed' : '❌ Missing (run npm install)'}`);
console.log(`  Backend dependencies: ${backendDeps ? '✅ Installed' : '❌ Missing (run cd api && npm install)'}`);

console.log('\n' + '='.repeat(50) + '\n');

// Check package.json scripts
console.log('⚙️  Checking package.json scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = ['dev', 'api', 'start'];
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`  ✅ npm run ${script}: ${scripts[script]}`);
    } else {
      console.log(`  ❌ npm run ${script}: Missing`);
    }
  });
} catch (err) {
  console.log('  ❌ Error reading package.json');
}

console.log('\n' + '='.repeat(50) + '\n');

if (allFilesExist && frontendDeps && backendDeps) {
  console.log('🎉 Complete setup verified!');
  console.log('\n🚀 To run the application:');
  console.log('   npm start');
  console.log('\nOr run frontend and backend separately:');
  console.log('   Terminal 1: cd api && npm start');
  console.log('   Terminal 2: npm run dev');
  console.log('\nThen open http://localhost:5173 in your browser');
} else {
  console.log('❌ Setup incomplete. Please follow these steps:');
  if (!allFilesExist) {
    console.log('   - Ensure all required files are present');
  }
  if (!frontendDeps) {
    console.log('   - Install frontend dependencies: npm install');
  }
  if (!backendDeps) {
    console.log('   - Install backend dependencies: cd api && npm install');
  }
}

console.log('\n' + '='.repeat(50) + '\n');
console.log('📝 Note: For full functionality, you may want to:');
console.log('   - Add your HuggingFace API token to api/.env');
console.log('   - Ensure camera permissions are granted in your browser');