// Setup script to automatically install dependencies
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Lens Scanner Setup Script\n');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json') || !fs.existsSync('api/package.json')) {
    console.log('❌ Error: Please run this script from the root of the lens-scanner-final directory');
    process.exit(1);
  }

  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n📦 Installing backend dependencies...');
  execSync('cd api && npm install', { stdio: 'inherit' });

  console.log('\n✅ Setup complete!');
  console.log('\n🚀 To run the application:');
  console.log('   npm start');
  console.log('\nOr run frontend and backend separately:');
  console.log('   Terminal 1: cd api && npm start');
  console.log('   Terminal 2: npm run dev');
  console.log('\nThen open http://localhost:5173 in your browser');

} catch (error) {
  console.log(`\n❌ Setup failed: ${error.message}`);
  process.exit(1);
}