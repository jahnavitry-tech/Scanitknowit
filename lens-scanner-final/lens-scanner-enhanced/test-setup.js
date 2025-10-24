// Test script to verify the enhanced lens scanner setup
import fs from 'fs';

console.log('🔍 Verifying Enhanced Lens Scanner Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vite.config.js',
  '.env.example',
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/styles.css',
  'src/components/CameraPanel.jsx',
  'src/components/AnalysisPanel.jsx',
  'api/analyze.js'
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

if (allFilesExist) {
  console.log('🎉 All required files are present!');
  console.log('\n🚀 To run the application:');
  console.log('   1. Install dependencies: npm install');
  console.log('   2. Start the backend: npm run start-api');
  console.log('   3. Start the frontend: npm run dev');
  console.log('   4. Open http://localhost:5173 in your browser');
} else {
  console.log('❌ Some required files are missing.');
  console.log('Please make sure all files are in place before running the application.');
}

console.log('\n' + '='.repeat(50) + '\n');
console.log('📝 Note: For full functionality, you may want to:');
console.log('   - Add your HuggingFace API token to .env');
console.log('   - Ensure camera permissions are granted in your browser');