#!/bin/bash
# Deployment Test Script
# This script tests that the application can be built and deployed correctly

echo "🚀 Testing Scanitknowit Deployment Readiness"

# Check if Node.js is installed
echo "🔍 Checking Node.js installation..."
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js >= 14.0.0"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION is installed"

# Check if npm is installed
echo "🔍 Checking npm installation..."
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION is installed"

# Check if project files exist
echo "🔍 Checking project files..."
REQUIRED_FILES=(
    "package.json"
    "api/analyze.js"
    "src/App.jsx"
    "src/components/CameraPanel.jsx"
    "src/components/AnalysisPanel.jsx"
    "vite.config.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file $file not found"
        exit 1
    fi
    echo "✅ $file found"
done

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed successfully"

# Test build
echo "🏗️ Testing frontend build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
echo "✅ Frontend built successfully"

# Test backend start
echo "サービ Testing backend start..."
timeout 10 npm run start-api &
BACKEND_PID=$!
sleep 5

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend started successfully"
    # Kill the backend process
    kill $BACKEND_PID
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo "🎉 All deployment readiness tests passed!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Push code to GitHub repository"
echo "2. Deploy backend to Render:"
echo "   - Build Command: npm install"
echo "   - Start Command: node api/analyze.js"
echo "   - Environment Variables:"
echo "     * HF_API_TOKEN=your_huggingface_token"
echo "     * USE_BLIP=true"
echo "     * PORT=10000"
echo "3. Deploy frontend to Vercel:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist/"
echo "   - Environment Variables:"
echo "     * VITE_API_URL=https://your-render-app.onrender.com"
echo "4. Test the deployed application"