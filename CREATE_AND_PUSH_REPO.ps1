# Script to create a new GitHub repository and push code
# You need to have a GitHub Personal Access Token

Write-Host "🚀 Creating new GitHub repository and pushing code..." -ForegroundColor Green
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

# Ask for GitHub username and Personal Access Token
$github_username = Read-Host "Enter your GitHub username (e.g., jahnavitry-tech)"
$github_token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$token/plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($github_token))

# Create repository using GitHub API
Write-Host "📡 Creating repository on GitHub..." -ForegroundColor Cyan
$repoData = @{
    name = "Scanitknowit"
    description = "A Google Lens-style product scanner that identifies objects/products from camera capture or image upload"
    private = $false
} | ConvertTo-Json

$headers = @{
    Authorization = "token $token/plain"
    Accept = "application/vnd.github.v3+json"
}

try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $repoData
    Write-Host "✅ Repository created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Repository may already exist or there was an error" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📁 Setting up remote repository..." -ForegroundColor Cyan
git remote add origin https://github.com/$github_username/Scanitknowit.git
git branch -M main

Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🎉 Visit https://github.com/$github_username/Scanitknowit to see your repository" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Please check your credentials and try again" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")