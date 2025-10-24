@echo off
:: One-click solution to push code to GitHub using Personal Access Token
:: This bypasses Git's authentication system entirely

echo ====================================================
echo SCANITKNOWIT - ONE-CLICK GITHUB PUSH SOLUTION
echo ====================================================
echo.

:: Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/ and try again
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

:: Get user input
set /p github_token="Enter your GitHub Personal Access Token: "
echo.
set /p github_username="Enter your GitHub username (e.g., jahnavitry-tech): "
echo.

:: Validate inputs
if "%github_token%"=="" (
    echo ❌ ERROR: Personal Access Token is required
    echo.
    pause
    exit /b 1
)

if "%github_username%"=="" (
    echo ❌ ERROR: GitHub username is required
    echo.
    pause
    exit /b 1
)

echo 📡 Checking if repository exists...
curl -s -u %github_username%:%github_token% https://api.github.com/repos/%github_username%/Scanitknowit > nul
if %errorlevel% neq 0 (
    echo 📦 Repository doesn't exist, creating it...
    curl -s -u %github_username%:%github_token% https://api.github.com/user/repos -d "{\"name\":\"Scanitknowit\", \"description\":\"A Google Lens-style product scanner that identifies objects/products from camera capture or image upload\", \"private\":false}" > nul
    if %errorlevel% equ 0 (
        echo ✅ Repository created successfully
    ) else (
        echo ⚠️  Could not create repository (may already exist)
    )
) else (
    echo ✅ Repository already exists
)

echo.
echo 📁 Setting up repository...
git remote remove origin 2>nul
git remote add origin https://%github_token%@github.com/%github_username%/Scanitknowit.git

echo.
echo 🚀 Pushing code to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ====================================================
    echo 🎉 SUCCESS! Code pushed to GitHub!
    echo.
    echo Visit: https://github.com/%github_username%/Scanitknowit
    echo ====================================================
) else (
    echo.
    echo ====================================================
    echo ❌ FAILED to push code
    echo.
    echo Try these solutions:
    echo 1. Check your Personal Access Token
    echo 2. Make sure it has 'repo' scope
    echo 3. Make sure you have permission to the repository
    echo 4. Try the manual method in COMPLETE_MANUAL_SOLUTION.md
    echo ====================================================
)

echo.
pause