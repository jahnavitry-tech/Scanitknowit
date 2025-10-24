@echo off
:: Simple script to initialize and push the repository to GitHub
:: This script will create the initial commit and push all files

echo 🚀 Initializing and pushing Scanitknowit repository to GitHub...
echo.

:: Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/ and try again
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

:: Initialize Git repository
echo 🔧 Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ❌ Error initializing Git repository
    pause
    exit /b 1
)

echo ✅ Git repository initialized
echo.

:: Add all files
echo ➕ Adding all files...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error adding files
    pause
    exit /b 1
)

echo ✅ All files added
echo.

:: Create initial commit
echo 📝 Creating initial commit...
git commit -m "Initial commit: Complete Lens-style product scanner implementation"
if %errorlevel% neq 0 (
    echo ❌ Error creating commit
    pause
    exit /b 1
)

echo ✅ Initial commit created
echo.

:: Set main branch
echo 🌿 Setting main branch...
git branch -M main
if %errorlevel% neq 0 (
    echo ❌ Error setting main branch
    pause
    exit /b 1
)

echo ✅ Main branch set
echo.

:: Add remote origin
echo 🔗 Adding remote origin...
git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Remote origin may already exist, continuing...
)

echo ✅ Remote origin added
echo.

:: Push to GitHub
echo ⬆️  Pushing to GitHub (this may take a moment)...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Error pushing to GitHub
    echo Try running: git push -u origin main
    pause
    exit /b 1
)

echo ✅ Successfully pushed to GitHub!
echo.
echo 🌐 Visit: https://github.com/jahnavitry-tech/Scanitknowit
echo 🎉 Repository initialization and push complete!
echo.

pause