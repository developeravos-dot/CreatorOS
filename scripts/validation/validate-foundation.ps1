$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

$RequiredFiles = @(
    "constitution\AVOS-CONSTITUTION.md",
    "architecture\MASTER-BLUEPRINT.md",
    "governance\engineering\ENGINEERING-GOVERNANCE.md",
    "standards\naming\NAMING-STANDARD.md",
    "catalogs\domains\DOMAIN-CATALOG.md",
    "catalogs\capabilities\CAPABILITY-CATALOG.md",
    "catalogs\dependencies\DEPENDENCY-CATALOG.md",
    "registry\components\COMPONENT-REGISTRY.md",
    "registry\versions\VERSION-REGISTRY.md",
    "roadmap\phases\IMPLEMENTATION-ROADMAP.md",
    "docs\00-foundation\VISION.md"
)

$Passed = 0
$Failed = 0

Write-Host ""
Write-Host "CreatorOS / AVOS Foundation Validation" -ForegroundColor Cyan
Write-Host "Project Root: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

foreach ($RequiredFile in $RequiredFiles) {
    $FullPath = Join-Path $ProjectRoot $RequiredFile

    if (Test-Path -LiteralPath $FullPath -PathType Leaf) {
        Write-Host "[PASS] $RequiredFile" -ForegroundColor Green
        $Passed++
    }
    else {
        Write-Host "[FAIL] $RequiredFile" -ForegroundColor Red
        $Failed++
    }
}

Write-Host ""
Write-Host "Passed: $Passed" -ForegroundColor Green
Write-Host "Failed: $Failed" -ForegroundColor $(if ($Failed -eq 0) { "Green" } else { "Red" })

if ($Failed -gt 0) {
    Write-Host ""
    Write-Host "FOUNDATION VALIDATION FAILED" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "FOUNDATION VALIDATION PASSED" -ForegroundColor Green
exit 0
