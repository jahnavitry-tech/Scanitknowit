# Test script for ScanItKnowIt Worker endpoints

Write-Host "Testing ScanItKnowIt Worker endpoints..." -ForegroundColor Green

# Health check
Write-Host "`n1. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/health" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Identify endpoint
Write-Host "`n2. Testing /api/identify endpoint..." -ForegroundColor Yellow
try {
    $body = @{ text = "apple juice" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Ingredients endpoint
Write-Host "`n3. Testing /api/ingredients endpoint..." -ForegroundColor Yellow
try {
    $body = @{ text = "coca cola" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/ingredients" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Calories endpoint
Write-Host "`n4. Testing /api/calories endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/calories?query=banana" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Reddit endpoint
Write-Host "`n5. Testing /api/reddit endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/reddit?query=coffee" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# QA endpoint
Write-Host "`n6. Testing /api/qa endpoint..." -ForegroundColor Yellow
try {
    $body = @{ question = "Is coffee healthy?"; context = "coffee, caffeine, antioxidants" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/qa" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green