# Load Environment Variables and Start Backend
# Run this script from the backend directory: .\start-backend.ps1

Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

# Read .env file
$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            # Remove quotes if present
            $value = $value -replace '^["'']|["'']$', ''
            
            # Set environment variable
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "  ✓ $key set" -ForegroundColor Green
        }
    }
    Write-Host ""
    Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "ERROR: .env file not found at $envFile" -ForegroundColor Red
    exit 1
}

# Verify critical variables
Write-Host "Verifying critical environment variables..." -ForegroundColor Cyan
$critical = @('DB_PASSWORD', 'MAIL_USERNAME', 'MAIL_PASSWORD', 'GOOGLE_CLIENT_ID')
$missing = @()

foreach ($var in $critical) {
    $value = [Environment]::GetEnvironmentVariable($var, 'Process')
    if ($value) {
        Write-Host "  ✓ $var is set (length: $($value.Length))" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $var is NOT set" -ForegroundColor Red
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "ERROR: Missing required environment variables: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
Write-Host ""

# Start the backend
mvn spring-boot:run
