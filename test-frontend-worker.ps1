# Test frontend to worker communication

Write-Host "Testing frontend to worker communication..." -ForegroundColor Green

# Test the worker directly
Write-Host "`n1. Testing worker health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/health" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test the worker identify endpoint
Write-Host "`n2. Testing worker identify endpoint..." -ForegroundColor Yellow
try {
    $body = @{ text = "apple juice" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test CORS headers
Write-Host "`n3. Testing CORS headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers @{"Origin"="http://localhost:5175"; "Content-Type"="application/json"} -Body '{"text": "apple juice"}'
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "CORS Headers:" -ForegroundColor Cyan
    Write-Host "  Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green
Write-Host "You can now visit http://localhost:5175 to see the frontend" -ForegroundColor Yellow