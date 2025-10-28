# deploy-app.ps1
# PowerShell script to deploy the Scanitknowit application

Write-Host "Scanitknowit Deployment Script" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "Checking for Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy frontend to Vercel
Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
Set-Location -Path "app"
try {
    vercel --prod --yes
    Write-Host "Frontend deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Frontend deployment failed: $_" -ForegroundColor Red
}
Set-Location -Path ".."

# Instructions for backend deployment
Write-Host "`nBackend Deployment Instructions:" -ForegroundColor Yellow
Write-Host "1. Go to https://render.com and create a new Web Service" -ForegroundColor Cyan
Write-Host "2. Connect to your GitHub repository" -ForegroundColor Cyan
Write-Host "3. Configure the service with these settings:" -ForegroundColor Cyan
Write-Host "   - Name: scanitknowit-backend" -ForegroundColor Cyan
Write-Host "   - Root Directory: scanitknowit-backend" -ForegroundColor Cyan
Write-Host "   - Build Command: npm install" -ForegroundColor Cyan
Write-Host "   - Start Command: npm start" -ForegroundColor Cyan
Write-Host "   - Environment: Node.js" -ForegroundColor Cyan
Write-Host "4. Set these environment variables in Render:" -ForegroundColor Cyan
Write-Host "   - CORS_ORIGIN=https://your-frontend.vercel.app" -ForegroundColor Cyan
Write-Host "   - NODE_ENV=production" -ForegroundColor Cyan

Write-Host "`nDeployment process completed!" -ForegroundColor Green