# TypeScript Conversion Script
$filesToConvert = @(
    "src/pages/user/HomeNew.jsx",
    "src/pages/user/MedicinesNew.jsx",
    "src/pages/user/CartNew.jsx",
    "src/pages/user/Checkout.jsx",
    "src/pages/user/OrdersNew.jsx",
    "src/pages/common/Feedback.jsx",
    "src/pages/common/StoreLocator.jsx",
    "src/pages/admin/AdminDashboard.jsx",
    "src/pages/store/StoreDashboard.jsx"
)

foreach ($file in $filesToConvert) {
    $jsxPath = "e:\Projects\MediMitra-1\MediMitra-main\frontend\$file"
    $tsxPath = $jsxPath -replace '\.jsx$', '.tsx'
    
    if (Test-Path $jsxPath) {
        Copy-Item $jsxPath $tsxPath
        Write-Host "Converted: $file -> $($file -replace '\.jsx$', '.tsx')"
    }
}

Write-Host "Conversion complete! Files need manual type annotations."
