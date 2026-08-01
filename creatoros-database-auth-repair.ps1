param(
    [string]$Root = "C:\Users\User\Desktop\CreatorOS"
)

$ErrorActionPreference = "Stop"
Set-Location $Root

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportDirectory = Join-Path $Root "repair-reports"
$ReportFile = Join-Path $ReportDirectory "database-auth-repair-$Stamp.txt"

New-Item -ItemType Directory -Path $ReportDirectory -Force | Out-Null

function Write-Report {
    param(
        [string]$Message,
        [ConsoleColor]$Color = [ConsoleColor]::White
    )

    Write-Host $Message -ForegroundColor $Color
    $Message | Add-Content -Path $ReportFile -Encoding UTF8
}

function Read-EnvironmentFile {
    param([string]$Path)

    $Values = @{}

    if (-not (Test-Path $Path)) {
        return $Values
    }

    foreach ($Line in Get-Content $Path) {
        $Trimmed = $Line.Trim()

        if (
            [string]::IsNullOrWhiteSpace($Trimmed) -or
            $Trimmed.StartsWith("#") -or
            -not $Trimmed.Contains("=")
        ) {
            continue
        }

        $Parts = $Trimmed.Split("=", 2)
        $Key = $Parts[0].Trim()
        $Value = $Parts[1].Trim().Trim('"').Trim("'")

        $Values[$Key] = $Value
    }

    return $Values
}

Write-Report "============================================" Cyan
Write-Report "CreatorOS Database + Authentication Repair" Cyan
Write-Report "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" Cyan
Write-Report "============================================" Cyan
Write-Report ""

$EnvironmentCandidates = @(
    (Join-Path $Root ".env"),
    (Join-Path $Root "apps\api\.env")
)

$EnvironmentFile = $EnvironmentCandidates |
    Where-Object { Test-Path $_ } |
    Select-Object -First 1

if (-not $EnvironmentFile) {
    throw "لم يتم العثور على ملف .env في جذر المشروع أو apps\api."
}

Write-Report "Environment file: $EnvironmentFile" Green

$Environment = Read-EnvironmentFile -Path $EnvironmentFile

$RequiredEnvironmentVariables = @(
    "DATABASE_URL",
    "CREATOROS_ADMIN_USERNAME",
    "CREATOROS_ADMIN_PASSWORD",
    "CREATOROS_JWT_SECRET"
)

$MissingEnvironmentVariables = @(
    $RequiredEnvironmentVariables |
        Where-Object {
            -not $Environment.ContainsKey($_) -or
            [string]::IsNullOrWhiteSpace($Environment[$_])
        }
)

if ($MissingEnvironmentVariables.Count -gt 0) {
    Write-Report "Missing environment values:" Red

    foreach ($Name in $MissingEnvironmentVariables) {
        Write-Report " - $Name" Red
    }

    throw "إعدادات البيئة غير مكتملة."
}

Write-Report "Environment validation: PASSED" Green

$DatabaseUrl = $Environment["DATABASE_URL"]

try {
    $DatabaseUri = [Uri]$DatabaseUrl
}
catch {
    throw "DATABASE_URL غير صالح: $DatabaseUrl"
}

$DatabaseHost = $DatabaseUri.Host
$DatabasePort = $DatabaseUri.Port

if ($DatabasePort -le 0) {
    $DatabasePort = 5432
}

Write-Report ""
Write-Report "Database host: $DatabaseHost" Yellow
Write-Report "Database port: $DatabasePort" Yellow

function Test-DatabasePort {
    param(
        [string]$HostName,
        [int]$Port
    )

    try {
        return Test-NetConnection `
            -ComputerName $HostName `
            -Port $Port `
            -InformationLevel Quiet `
            -WarningAction SilentlyContinue
    }
    catch {
        return $false
    }
}

$DatabaseAvailable = Test-DatabasePort `
    -HostName $DatabaseHost `
    -Port $DatabasePort

if (-not $DatabaseAvailable) {
    Write-Report ""
    Write-Report "PostgreSQL is not reachable. Attempting recovery..." Yellow

    $DockerCommand = Get-Command docker -ErrorAction SilentlyContinue

    if ($DockerCommand) {
        try {
            docker info *> $null

            if ($LASTEXITCODE -ne 0) {
                throw "Docker Desktop is installed but the Docker engine is not running."
            }

            $ComposeFiles = @(
                (Join-Path $Root "docker-compose.yml"),
                (Join-Path $Root "docker-compose.yaml"),
                (Join-Path $Root "compose.yml"),
                (Join-Path $Root "compose.yaml"),
                (Join-Path $Root "infra\docker-compose.yml"),
                (Join-Path $Root "infra\docker-compose.yaml")
            )

            $ComposeFile = $ComposeFiles |
                Where-Object { Test-Path $_ } |
                Select-Object -First 1

            if ($ComposeFile) {
                Write-Report "Compose file found: $ComposeFile" Green

                $Services = @(
                    docker compose -f $ComposeFile config --services 2>$null
                )

                $DatabaseService = $Services |
                    Where-Object {
                        $_ -match "postgres|database|db"
                    } |
                    Select-Object -First 1

                if ($DatabaseService) {
                    Write-Report "Starting database service: $DatabaseService" Yellow

                    docker compose `
                        -f $ComposeFile `
                        up -d $DatabaseService

                    if ($LASTEXITCODE -ne 0) {
                        throw "تعذر تشغيل خدمة قاعدة البيانات عبر Docker Compose."
                    }
                }
                else {
                    Write-Report "No dedicated DB service detected. Starting compose stack." Yellow

                    docker compose `
                        -f $ComposeFile `
                        up -d

                    if ($LASTEXITCODE -ne 0) {
                        throw "تعذر تشغيل Docker Compose."
                    }
                }

                Start-Sleep -Seconds 5
            }
            else {
                Write-Report "No Docker Compose file found." Yellow
            }
        }
        catch {
            Write-Report "Docker recovery warning: $($_.Exception.Message)" Yellow
        }
    }
    else {
        Write-Report "Docker command is not installed or unavailable." Yellow
    }

    for ($Attempt = 1; $Attempt -le 12; $Attempt++) {
        $DatabaseAvailable = Test-DatabasePort `
            -HostName $DatabaseHost `
            -Port $DatabasePort

        if ($DatabaseAvailable) {
            break
        }

        Write-Report "Waiting for PostgreSQL... attempt $Attempt/12" Yellow
        Start-Sleep -Seconds 5
    }
}

if (-not $DatabaseAvailable) {
    Write-Report ""
    Write-Report "DATABASE CONNECTION: FAILED" Red
    Write-Report "PostgreSQL is still unavailable on ${DatabaseHost}:${DatabasePort}." Red
    Write-Report "ابدأ PostgreSQL أو Docker Desktop ثم شغّل السكربت مرة أخرى." Red
    throw "ECONNREFUSED: PostgreSQL is unavailable."
}

Write-Report ""
Write-Report "DATABASE TCP CONNECTION: PASSED" Green

Write-Report ""
Write-Report "Generating Prisma client..." Cyan

pnpm --filter @creatoros/api exec prisma generate `
    --schema prisma/schema.prisma *>&1 |
    Tee-Object -FilePath $ReportFile -Append

if ($LASTEXITCODE -ne 0) {
    throw "Prisma generate failed."
}

Write-Report "Prisma generate: PASSED" Green

Write-Report ""
Write-Report "Applying Prisma migrations..." Cyan

pnpm --filter @creatoros/api exec prisma migrate deploy `
    --schema prisma/schema.prisma *>&1 |
    Tee-Object -FilePath $ReportFile -Append

if ($LASTEXITCODE -ne 0) {
    throw "Prisma migrate deploy failed."
}

Write-Report "Prisma migrations: PASSED" Green

Write-Report ""
Write-Report "Running TypeScript validation..." Cyan

pnpm typecheck *>&1 |
    Tee-Object -FilePath $ReportFile -Append

if ($LASTEXITCODE -ne 0) {
    throw "Typecheck failed."
}

Write-Report "Typecheck: PASSED" Green

Write-Report ""
Write-Report "Running production build..." Cyan

pnpm build *>&1 |
    Tee-Object -FilePath $ReportFile -Append

if ($LASTEXITCODE -ne 0) {
    throw "Build failed."
}

Write-Report "Build: PASSED" Green

Write-Report ""
Write-Report "Starting API temporarily for authenticated tests..." Cyan

$ServerOutput = Join-Path $ReportDirectory "temporary-server-$Stamp.log"

$ServerProcess = Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList @(
        "/c",
        "pnpm --filter @creatoros/api start"
    ) `
    -WorkingDirectory $Root `
    -RedirectStandardOutput $ServerOutput `
    -RedirectStandardError $ServerOutput `
    -PassThru `
    -WindowStyle Hidden

try {
    $ApiAvailable = $false

    for ($Attempt = 1; $Attempt -le 20; $Attempt++) {
        try {
            Invoke-WebRequest `
                -Method Get `
                -Uri "http://localhost:3000/docs" `
                -UseBasicParsing `
                -TimeoutSec 2 *> $null

            $ApiAvailable = $true
            break
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }

    if (-not $ApiAvailable) {
        throw "API did not become available on port 3000."
    }

    Write-Report "API startup: PASSED" Green

    $LoginBody = @{
        username = $Environment["CREATOROS_ADMIN_USERNAME"]
        password = $Environment["CREATOROS_ADMIN_PASSWORD"]
    } | ConvertTo-Json

    Write-Report ""
    Write-Report "Testing admin authentication..." Cyan

    $LoginResponse = Invoke-RestMethod `
        -Method Post `
        -Uri "http://localhost:3000/api/v1/auth/login" `
        -ContentType "application/json" `
        -Body $LoginBody

    if (-not $LoginResponse.accessToken) {
        throw "Login succeeded without returning accessToken."
    }

    Write-Report "Admin login: PASSED" Green

    $Headers = @{
        Authorization = "Bearer $($LoginResponse.accessToken)"
    }

    $EndpointTests = @(
        @{
            Name = "Authenticated user"
            Uri  = "http://localhost:3000/api/v1/auth/me"
        },
        @{
            Name = "Platform status"
            Uri  = "http://localhost:3000/api/v1/platform/status"
        },
        @{
            Name = "Runtime health"
            Uri  = "http://localhost:3000/api/v1/runtime/health"
        },
        @{
            Name = "Capabilities count"
            Uri  = "http://localhost:3000/api/v1/capabilities/count"
        }
    )

    $Results = foreach ($Test in $EndpointTests) {
        try {
            $Response = Invoke-RestMethod `
                -Method Get `
                -Uri $Test.Uri `
                -Headers $Headers

            [PSCustomObject]@{
                Test   = $Test.Name
                Status = "PASSED"
                Uri    = $Test.Uri
                Result = $Response | ConvertTo-Json -Depth 10 -Compress
            }
        }
        catch {
            [PSCustomObject]@{
                Test   = $Test.Name
                Status = "FAILED"
                Uri    = $Test.Uri
                Result = $_.Exception.Message
            }
        }
    }

    Write-Report ""
    Write-Report "Authenticated endpoint results:" Cyan

    $Results |
        Format-Table Test, Status, Uri -AutoSize |
        Out-String |
        Tee-Object -FilePath $ReportFile -Append |
        Write-Host

    $JsonReport = Join-Path $ReportDirectory "database-auth-results-$Stamp.json"

    $Results |
        ConvertTo-Json -Depth 10 |
        Set-Content -Path $JsonReport -Encoding UTF8

    $FailedTests = @(
        $Results |
            Where-Object { $_.Status -eq "FAILED" }
    )

    if ($FailedTests.Count -gt 0) {
        Write-Report "Authenticated API tests failed: $($FailedTests.Count)" Red
        throw "Some protected endpoints failed."
    }

    Write-Report ""
    Write-Report "============================================" Green
    Write-Report "DATABASE + AUTHENTICATION REPAIR: PASSED" Green
    Write-Report "============================================" Green
    Write-Report "Report: $ReportFile" Cyan
    Write-Report "JSON: $JsonReport" Cyan
}
finally {
    if ($ServerProcess -and -not $ServerProcess.HasExited) {
        Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
