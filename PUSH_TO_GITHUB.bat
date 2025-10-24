@echo off
:: Script to push the Scanitknowit repository to GitHub
:: You need to have proper GitHub credentials configured

echo 🚀 Pushing Scanitknowit repository to GitHub...
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

:: Configure Git user (you may need to change these)
echo 🔧 Configuring Git user...
git config user.name "jahnavitry-tech"
git config user.email "jahnavitry-tech@example.com"
echo ✅ Git user configured
echo.

:: Add all files
echo 📁 Adding all files...
git add .
echo ✅ All files added
echo.

:: Commit changes
echo 💬 Creating commit...
git commit -m "Initial commit - Scanitknowit Lens-style product scanner"
echo ✅ Commit created
echo.

:: Add remote origin
echo 🔗 Setting remote origin...
git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
echo ✅ Remote origin set
echo.

:: Rename branch to main
echo 🏷️ Renaming branch to main...
git branch -M main
echo ✅ Branch renamed
echo.

:: Push to GitHub (this will prompt for credentials)
echo 🚀 Pushing to GitHub...
echo You will be prompted to enter your GitHub username and Personal Access Token
echo (Use your GitHub username and a Personal Access Token as password)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Repository successfully pushed to GitHub!
    echo 🎉 Visit https://github.com/jahnavitry-tech/Scanitknowit to see your repository
) else (
    echo ❌ Failed to push to GitHub
    echo Please make sure you have:
    echo 1. Proper permissions to the jahnavitry-tech/Scanitknowit repository
    echo 2. A Personal Access Token configured (not your password)
    echo 3. Git credentials properly set up
)

pause