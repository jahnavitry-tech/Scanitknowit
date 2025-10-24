#!/bin/bash

# Deployment script for Scanitknowit
# This script initializes the Git repository and pushes all files to GitHub

echo "🚀 Starting Scanitknowit deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Initialize Git repository
echo "🔧 Initializing Git repository..."
git init

# Check if origin already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Origin already exists. Skipping remote setup."
else
    echo "🔗 Setting up remote repository..."
    git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
fi

# Add all files
echo "➕ Adding all files to Git..."
git add .

# Check if there are any commits
if git rev-parse HEAD > /dev/null 2>&1; then
    echo "📝 Creating commit..."
    git commit -m "Update Scanitknowit: Complete Lens-style product scanner implementation"
else
    echo "📝 Creating initial commit..."
    git commit -m "Initial commit: Complete Lens-style product scanner implementation"
fi

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "✅ Deployment complete!"
echo "🌐 Visit: https://github.com/jahnavitry-tech/Scanitknowit"