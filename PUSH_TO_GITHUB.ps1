# Script to push the Scanitknowit repository to GitHub
# You need to have proper GitHub credentials configured

Write-Host "🚀 Pushing Scanitknowit repository to GitHub..." -ForegroundColor Green
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/ and try again" -ForegroundColor Yellow
    pause
    exit 1
}

# Configure Git user (you may need to change these)
Write-Host "🔧 Configuring Git user..." -ForegroundColor Cyan
git config user.name "jahnavitry-tech"
git config user.email "jahnavitry-tech@example.com"
Write-Host "✅ Git user configured" -ForegroundColor Green
Write-Host ""

# Add all files
Write-Host "📁 Adding all files..." -ForegroundColor Cyan
git add .
Write-Host "✅ All files added" -ForegroundColor Green
Write-Host ""

# Check if there are changes to commit
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "ℹ️ No changes to commit" -ForegroundColor Blue
} else {
    # Commit changes
    Write-Host "💬 Creating commit..." -ForegroundColor Cyan
    git commit -m "Initial commit - Scanitknowit Lens-style product scanner"
    Write-Host "✅ Commit created" -ForegroundColor Green
    Write-Host ""
}

# Add remote origin if it doesn't exist
$remote = git remote get-url origin 2>$null
if ([string]::IsNullOrWhiteSpace($remote)) {
    Write-Host "🔗 Setting remote origin..." -ForegroundColor Cyan
    git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
    Write-Host "✅ Remote origin set" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "ℹ️ Remote origin already set: $remote" -ForegroundColor Blue
    Write-Host ""
}

# Rename branch to main if needed
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🏷️ Renaming branch to main..." -ForegroundColor Cyan
    git branch -M main
    Write-Host "✅ Branch renamed" -ForegroundColor Green
    Write-Host ""
}

# Push to GitHub (this will prompt for credentials)
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "You will be prompted to enter your GitHub username and Personal Access Token" -ForegroundColor Yellow
Write-Host "(Use your GitHub username and a Personal Access Token as password)" -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host "✅ Repository successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🎉 Visit https://github.com/jahnavitry-tech/Scanitknowit to see your repository" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please make sure you have:" -ForegroundColor Yellow
    Write-Host "1. Proper permissions to the jahnavitry-tech/Scanitknowit repository" -ForegroundColor Yellow
    Write-Host "2. A Personal Access Token configured (not your regular password)" -ForegroundColor Yellow
    Write-Host "3. Git credentials properly set up" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")