@echo off
:: Deployment script for Scanitknowit
:: This script initializes the Git repository and pushes all files to GitHub

echo 🚀 Starting Scanitknowit deployment...

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

:: Initialize Git repository
echo 🔧 Initializing Git repository...
git init

:: Check if origin already exists
git remote get-url origin >nul 2>&1
if %errorlevel% == 0 (
    echo ⚠️  Origin already exists. Skipping remote setup.
) else (
    echo 🔗 Setting up remote repository...
    git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
)

:: Add all files
echo ➕ Adding all files to Git...
git add .

:: Check if there are any commits
git rev-parse HEAD >nul 2>&1
if %errorlevel% == 0 (
    echo 📝 Creating commit...
    git commit -m "Update Scanitknowit: Complete Lens-style product scanner implementation"
) else (
    echo 📝 Creating initial commit...
    git commit -m "Initial commit: Complete Lens-style product scanner implementation"
)

:: Set main branch
echo 🌿 Setting main branch...
git branch -M main

:: Push to GitHub
echo ⬆️  Pushing to GitHub...
git push -u origin main

echo ✅ Deployment complete!
echo 🌐 Visit: https://github.com/jahnavitry-tech/Scanitknowit

pause