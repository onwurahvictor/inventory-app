# simple-test.ps1
Write-Host "Simple API Test" -ForegroundColor Green

try {
    # Test basic connection
    $test = Invoke-RestMethod -Uri "http://localhost:5000/api/test" -Method Get
    Write-Host "✅ Server is running! Response: $($test.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to server. Make sure it's running on port 5000" -ForegroundColor Red
    exit 1
}

# Login
$loginBody = @{
    email = "onwurahvictor@gmail.com"
    password = "Victor123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed. Check your credentials" -ForegroundColor Red
    exit 1
}

# Test item endpoint
$headers = @{
    "Authorization" = "Bearer $token"
}

$itemId = "6994d7e0c452b69a69572721"
try {
    $itemResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/items/$itemId" -Method Get -Headers $headers
    Write-Host "✅ Item found: $($itemResponse.data.item.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get item. Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}