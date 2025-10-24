# Test CORS functionality for all endpoints

Write-Host "Testing CORS functionality for all endpoints..." -ForegroundColor Green

# Test OPTIONS request (CORS preflight)
Write-Host "`n1. Testing OPTIONS request (CORS preflight)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method OPTIONS
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "CORS Headers:" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Headers: $($response.Headers['Access-Control-Allow-Headers'])" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST request with CORS headers
Write-Host "`n2. Testing POST request with CORS headers..." -ForegroundColor Yellow
try {
    $body = @{ text = "apple juice" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers @{"Origin"="http://localhost:5174"; "Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    Write-Host "CORS Headers:" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test GET request with CORS headers
Write-Host "`n3. Testing GET request with CORS headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/reddit?query=coffee" -Method GET -Headers @{"Origin"="http://localhost:5174"}
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response length: $($response.RawContentLength)" -ForegroundColor Cyan
    Write-Host "CORS Headers:" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCORS testing complete!" -ForegroundColor Green