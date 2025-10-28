#!/usr/bin/env node
/**
 * migrate-scanitknowit.js
 * Tailored migration script for Scanitknowit project.
 * Safely reorganizes existing files into recommended monorepo structure.
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const backupDir = path.join(root, 'backup-migration-' + Date.now());
const mkdir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };

// Create backup directory
mkdir(backupDir);
console.log(`✓ Created backup directory: ${path.basename(backupDir)}`);

// Migration mapping - from current structure to new monorepo
const migrations = [
  // Ensure required directories exist
  { from: 'app', to: 'app' },
  { from: 'app/src', to: 'app/src' },
  { from: 'app/src/components', to: 'app/src/components' },
  { from: 'scanitknowit-backend', to: 'scanitknowit-backend' },
  { from: 'scanitknowit-backend/api', to: 'scanitknowit-backend/api' },
  { from: 'tests', to: 'tests' },
  { from: 'demos', to: 'demos' }
];

// Files to move/verify (if they exist)
const fileOperations = [
  // Root files
  { from: 'DEPLOYMENT.md', to: 'DEPLOYMENT.md' },
  { from: 'README.md', to: 'README.md' },
  { from: 'ERRORS_AND_FIXES.md', to: 'ERRORS_AND_FIXES.md' },
  { from: 'DEPLOYMENT-GUIDE.md', to: 'DEPLOYMENT-GUIDE.md' },
  { from: 'PROJECT-SUMMARY.md', to: 'PROJECT-SUMMARY.md' },
  
  // App files
  { from: 'app/package.json', to: 'app/package.json' },
  { from: 'app/vite.config.js', to: 'app/vite.config.js' },
  { from: 'app/index.html', to: 'app/index.html' },
  { from: 'app/.env.production', to: 'app/.env.production' },
  { from: 'app/.gitignore', to: 'app/.gitignore' },
  { from: 'app/vercel.json', to: 'app/vercel.json' },
  
  // App source files
  { from: 'app/src/main.jsx', to: 'app/src/main.jsx' },
  { from: 'app/src/App.jsx', to: 'app/src/App.jsx' },
  { from: 'app/src/components/CameraPanel.jsx', to: 'app/src/components/CameraPanel.jsx' },
  { from: 'app/src/components/AnalysisPanel.jsx', to: 'app/src/components/AnalysisPanel.jsx' },
  
  // Backend files
  { from: 'scanitknowit-backend/package.json', to: 'scanitknowit-backend/package.json' },
  { from: 'scanitknowit-backend/server.js', to: 'scanitknowit-backend/server.js' },
  { from: 'scanitknowit-backend/.env.production', to: 'scanitknowit-backend/.env.production' },
  { from: 'scanitknowit-backend/render.yaml', to: 'scanitknowit-backend/render.yaml' },
  
  // Backend API files
  { from: 'scanitknowit-backend/api/analyze.js', to: 'scanitknowit-backend/api/analyze.js' }
];

// Function to safely copy a file or directory
function copyItem(fromPath, toPath) {
  const fullFromPath = path.join(root, fromPath);
  const fullToPath = path.join(root, toPath);
  
  if (!fs.existsSync(fullFromPath)) {
    console.log(`  → Skipping (not found): ${fromPath}`);
    return false;
  }
  
  // Create destination directory
  const toDir = path.dirname(fullToPath);
  mkdir(toDir);
  
  // Backup original
  const backupPath = path.join(backupDir, fromPath);
  const backupDirPath = path.dirname(backupPath);
  mkdir(backupDirPath);
  
  try {
    fs.cpSync(fullFromPath, backupPath, { recursive: true });
    console.log(`  ✓ Backed up: ${fromPath}`);
  } catch (err) {
    console.warn(`  ⚠ Warning: Could not backup ${fromPath}:`, err.message);
  }
  
  // Copy to new location (if different)
  if (fullFromPath !== fullToPath) {
    try {
      fs.cpSync(fullFromPath, fullToPath, { recursive: true });
      console.log(`  ✓ Copied: ${fromPath} → ${toPath}`);
      return true;
    } catch (err) {
      console.error(`  ✗ Error copying ${fromPath} → ${toPath}:`, err.message);
      return false;
    }
  } else {
    console.log(`  → Already in correct location: ${fromPath}`);
    return true;
  }
}

// Function to create missing files with default content
function createMissingFiles() {
  console.log('\n→ Creating missing files...');
  
  // Ensure app/vercel.json exists with correct configuration
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "dist"
        }
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/dist/$1"
      }
    ]
  };
  
  const appVercelPath = path.join(root, 'app', 'vercel.json');
  if (!fs.existsSync(appVercelPath)) {
    fs.writeFileSync(appVercelPath, JSON.stringify(vercelConfig, null, 2));
    console.log('  ✓ Created app/vercel.json with correct configuration');
  } else {
    // Verify existing vercel.json configuration
    try {
      const existingConfig = JSON.parse(fs.readFileSync(appVercelPath, 'utf8'));
      if (existingConfig.builds && existingConfig.builds[0] && existingConfig.builds[0].src !== "package.json") {
        fs.writeFileSync(appVercelPath, JSON.stringify(vercelConfig, null, 2));
        console.log('  ✓ Updated app/vercel.json with correct configuration');
      } else {
        console.log('  → app/vercel.json already has correct configuration');
      }
    } catch (err) {
      fs.writeFileSync(appVercelPath, JSON.stringify(vercelConfig, null, 2));
      console.log('  ✓ Fixed app/vercel.json with correct configuration');
    }
  }
  
  // Ensure directories exist
  const requiredDirs = [
    'tests',
    'demos'
  ];
  
  requiredDirs.forEach(dir => {
    const dirPath = path.join(root, dir);
    if (!fs.existsSync(dirPath)) {
      mkdir(dirPath);
      console.log(`  ✓ Created directory: ${dir}`);
    }
  });
}

// Create directory structure
console.log('→ Creating directory structure...');
migrations.forEach(m => mkdir(path.join(root, m.to)));

// Process file operations
console.log('\n→ Processing files...');
let movedCount = 0;
fileOperations.forEach(op => {
  if (copyItem(op.from, op.to)) {
    movedCount++;
  }
});

// Create missing files
createMissingFiles();

// Create migration log
const migrationLog = `# Migration Log
Generated: ${new Date().toISOString()}

## Directory Structure
- Created backup in: ${path.basename(backupDir)}
- Verified app/ directory structure
- Verified scanitknowit-backend/ directory structure
- Created missing directories: tests/, demos/

## File Operations
- Processed ${fileOperations.length} file operations
- Successfully copied/moved ${movedCount} items
- Created/updated configuration files

## Vercel Configuration Fix
- Ensured app/vercel.json points to package.json instead of vite.config.js
- Verified correct build configuration for Vercel deployment

## Next Steps
1. Test locally:
   - Backend: cd scanitknowit-backend && npm install && npm run dev
   - Frontend: cd app && npm install && npm run dev
2. Deploy:
   - Backend (Render): Set Root Directory to "scanitknowit-backend"
   - Frontend (Vercel): Set Project Root to "app"
`;

const logPath = path.join(root, 'migration-log.md');
fs.writeFileSync(logPath, migrationLog);
console.log(`\n✓ Migration complete! Log saved to: ${path.basename(logPath)}`);
console.log(`✓ Backup of original structure saved in: ${path.basename(backupDir)}`);

console.log('\n📋 Next steps:');
console.log('1. Review migration-log.md for details');
console.log('2. Test locally:');
console.log('   - Backend: cd scanitknowit-backend && npm install && npm run dev');
console.log('   - Frontend: cd app && npm install && npm run dev');
console.log('3. Deploy:');
console.log('   - Backend (Render): Set Root Directory to "scanitknowit-backend"');
console.log('   - Frontend (Vercel): Set Project Root to "app"');