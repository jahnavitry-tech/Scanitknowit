# Test the API endpoint
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    text = "Hershey's Milk Chocolate Bar"
} | ConvertTo-Json

try {
    Write-Host "Testing API endpoint..."
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/identify" -Method POST -Headers $headers -Body $body
    Write-Host "Response status: $($response.StatusCode)"
    Write-Host "Response content: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}