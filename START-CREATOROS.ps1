$ErrorActionPreference = "Stop"

$Root = "C:\Users\User\Desktop\CreatorOS"
$ApiPath = Join-Path $Root "apps\api"
$WebPath = Join-Path $Root "apps\web"
$LogPath = Join-Path $Root "runtime-logs"

New-Item -ItemType Directory -Path $LogPath -Force | Out-Null

function Stop-ServiceOnPort {
    param([int]$Port)

    $ProcessIds = @(
        Get-NetTCPConnection `
            -LocalPort $Port `
            -State Listen `
            -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
    )

    foreach ($ProcessId in $ProcessIds) {
        if ($ProcessId -and $ProcessId -ne $PID) {
            Stop-Process `
                -Id $ProcessId `
                -Force `
                -ErrorAction SilentlyContinue
        }
    }
}

function Wait-ForUrl {
    param(
        [string]$Url,
        [int]$Seconds = 120
    )

    $Deadline = (Get-Date).AddSeconds($Seconds)

    while ((Get-Date) -lt $Deadline) {
        try {
            $Response = Invoke-WebRequest `
                -Uri $Url `
                -UseBasicParsing `
                -TimeoutSec 3

            if ($Response.StatusCode -eq 200) {
                return $true
            }
        }
        catch {
        }

        Start-Sleep -Seconds 1
    }

    return $false
}

Clear-Host

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "          STARTING CREATOROS" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "[1/5] Stopping old processes..." -ForegroundColor Yellow

Stop-ServiceOnPort -Port 3000
Stop-ServiceOnPort -Port 5173

Start-Sleep -Seconds 2

$ApiCommand = @"
`$Host.UI.RawUI.WindowTitle = 'CreatorOS Backend - KEEP OPEN'
Set-Location '$ApiPath'
pnpm start:dev
"@

$WebCommand = @"
`$Host.UI.RawUI.WindowTitle = 'CreatorOS Frontend - KEEP OPEN'
Set-Location '$WebPath'
pnpm dev
"@

Write-Host "[2/5] Starting Backend..." -ForegroundColor Yellow

Start-Process `
    -FilePath "powershell.exe" `
    -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        $ApiCommand
    ) `
    -WindowStyle Normal

$BackendReady = Wait-ForUrl `
    -Url "http://localhost:3000/api/v1/enterprise/health" `
    -Seconds 180

if (-not $BackendReady) {
    Write-Host ""
    Write-Host "Backend failed to start." -ForegroundColor Red
    Write-Host "Check the window titled: CreatorOS Backend - KEEP OPEN"
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host "[3/5] Backend is operational." -ForegroundColor Green
Write-Host "[4/5] Starting Frontend..." -ForegroundColor Yellow

Start-Process `
    -FilePath "powershell.exe" `
    -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        $WebCommand
    ) `
    -WindowStyle Normal

$FrontendReady = Wait-ForUrl `
    -Url "http://localhost:5173" `
    -Seconds 120

if (-not $FrontendReady) {
    Write-Host ""
    Write-Host "Frontend failed to start." -ForegroundColor Red
    Write-Host "Check the window titled: CreatorOS Frontend - KEEP OPEN"
    Read-Host "Press Enter to close"
    exit 1
}

$ProxyReady = Wait-ForUrl `
    -Url "http://localhost:5173/api/v1/enterprise/health" `
    -Seconds 60

if (-not $ProxyReady) {
    Write-Host ""
    Write-Host "The frontend started, but the API proxy failed." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

$Dashboard = Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:5173/api/v1/enterprise/dashboard"

Write-Host "[5/5] CreatorOS is ready." -ForegroundColor Green
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Frontend : http://localhost:5173"
Write-Host "Backend  : http://localhost:3000"
Write-Host "Projects : $($Dashboard.metrics.projects)"
Write-Host "Scripts  : $($Dashboard.metrics.scripts)"
Write-Host "Calendar : $($Dashboard.metrics.scheduledContent)"
Write-Host "Prompts  : $($Dashboard.metrics.prompts)"
Write-Host "==============================================" -ForegroundColor Cyan

Start-Process "msedge.exe" `
    -ArgumentList "--new-window", "http://localhost:5173"

Write-Host ""
Write-Host "Keep the Backend and Frontend windows open." -ForegroundColor Yellow
Read-Host "Press Enter only when you want to close this launcher window"
