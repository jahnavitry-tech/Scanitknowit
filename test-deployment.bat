@echo off
:: Deployment Test Script for Windows
:: This script tests that the application can be built and deployed correctly

echo 🚀 Testing Scanitknowit Deployment Readiness
echo.

:: Check if Node.js is installed
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js ^>= 14.0.0
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% is installed

:: Check if npm is installed
echo 🔍 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% is installed

:: Check if project files exist
echo 🔍 Checking project files...
set REQUIRED_FILES=package.json api/analyze.js src/App.jsx src/components/CameraPanel.jsx src/components/AnalysisPanel.jsx vite.config.js

for %%f in (%REQUIRED_FILES%) do (
    if not exist "%%f" (
        echo ❌ Required file %%f not found
        pause
        exit /b 1
    )
    echo ✅ %%f found
)

:: Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

:: Test build
echo 🏗️ Testing frontend build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend built successfully

:: Test backend start
echo 🎵 Testing backend start...
start /b npm run start-api
timeout /t 5 /nobreak >nul

:: Check if backend process is running
tasklist | findstr node >nul
if %errorlevel% equ 0 (
    echo ✅ Backend started successfully
    :: Kill the backend process (this is a simplified approach)
    taskkill /f /im node.exe >nul 2>&1
) else (
    echo ❌ Backend failed to start
    pause
    exit /b 1
)

echo.
echo 🎉 All deployment readiness tests passed!
echo.
echo 📋 Next steps for deployment:
echo 1. Push code to GitHub repository
echo 2. Deploy backend to Render:
echo    - Build Command: npm install
echo    - Start Command: node api/analyze.js
echo    - Environment Variables:
echo      * HF_API_TOKEN=your_huggingface_token
echo      * USE_BLIP=true
echo      * PORT=10000
echo 3. Deploy frontend to Vercel:
echo    - Build Command: npm run build
echo    - Output Directory: dist/
echo    - Environment Variables:
echo      * VITE_API_URL=https://your-render-app.onrender.com
echo 4. Test the deployed application
echo.
pause