@echo off
:: Script to create a new GitHub repository and push code
:: You need to have a GitHub Personal Access Token

echo 🚀 Creating new GitHub repository and pushing code...
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

:: Ask for GitHub username and Personal Access Token
set /p github_username="Enter your GitHub username (e.g., jahnavitry-tech): "
set /p github_token="Enter your GitHub Personal Access Token: "

:: Create repository using GitHub API
echo 📡 Creating repository on GitHub...
curl -u %github_username%:%github_token% https://api.github.com/user/repos -d "{\"name\":\"Scanitknowit\", \"description\":\"A Google Lens-style product scanner that identifies objects/products from camera capture or image upload\", \"private\":false}" > nul

if %errorlevel% equ 0 (
    echo ✅ Repository created successfully
) else (
    echo ⚠️  Repository may already exist or there was an error
)

echo.
echo 📁 Setting up remote repository...
git remote add origin https://github.com/%github_username%/Scanitknowit.git
git branch -M main

echo.
echo 🚀 Pushing to GitHub...
echo When prompted, use your username and Personal Access Token
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Code successfully pushed to GitHub!
    echo 🎉 Visit https://github.com/%github_username%/Scanitknowit to see your repository
) else (
    echo ❌ Failed to push to GitHub
    echo Please check your credentials and try again
)

pause