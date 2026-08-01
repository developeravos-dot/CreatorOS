param(
    [Parameter(Mandatory = $true)]
    [string]$Pack,

    [Parameter(Mandatory = $true)]
    [string]$CommitMessage
)

$ErrorActionPreference = "Stop"

function Run-Step {
    param(
        [string]$Name,
        [scriptblock]$Command
    )

    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host $Name -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

    & $Command

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "FAILED: $Name" -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host "PASSED: $Name" -ForegroundColor Green
}

Write-Host ""
Write-Host "CreatorOS Pack Completion Pipeline" -ForegroundColor Magenta
Write-Host "Pack: $Pack" -ForegroundColor Yellow

Run-Step "1. Git working tree inspection" {
    git status --short
}

Run-Step "2. Backend tests" {
    pnpm --filter @creatoros/api test -- --runInBand
}

Run-Step "3. Frontend tests" {
    pnpm --filter @creatoros/web test --if-present
}

Run-Step "4. TypeScript verification" {
    pnpm -r --if-present typecheck
}

Run-Step "5. Production build" {
    pnpm -r --if-present build
}

Run-Step "6. Git diff verification" {
    git diff --check
}

Write-Host ""
Write-Host "Adding Pack files to Git..." -ForegroundColor Cyan
git add --all

$Changes = git diff --cached --name-only

if (-not $Changes) {
    Write-Host "No staged changes found. Commit cancelled." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Files included in this Pack:" -ForegroundColor Cyan
git diff --cached --stat

Run-Step "7. Creating one atomic Pack commit" {
    git commit -m $CommitMessage
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "$Pack COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "Tests: PASSED" -ForegroundColor Green
Write-Host "TypeScript: PASSED" -ForegroundColor Green
Write-Host "Build: PASSED" -ForegroundColor Green
Write-Host "Commit: CREATED" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

git status
