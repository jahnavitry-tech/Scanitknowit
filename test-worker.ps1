# Test worker endpoints

Write-Host "Testing worker endpoints..." -ForegroundColor Green

# Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/health" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test identify endpoint
Write-Host "`n2. Testing identify endpoint..." -ForegroundColor Yellow
try {
    $body = @{ text = "Coca Cola" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test ingredients endpoint
Write-Host "`n3. Testing ingredients endpoint..." -ForegroundColor Yellow
try {
    $body = @{ text = "sugar, water, caffeine" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/ingredients" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test calories endpoint
Write-Host "`n4. Testing calories endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/calories?query=banana" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response length: $($response.RawContentLength)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Reddit endpoint
Write-Host "`n5. Testing Reddit endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/reddit?query=coffee" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response length: $($response.RawContentLength)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test QA endpoint
Write-Host "`n6. Testing QA endpoint..." -ForegroundColor Yellow
try {
    $body = @{ question = "Is this healthy?"; context = "coffee" } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/qa" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting complete!" -ForegroundColor Green