$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$Root = "C:\Users\User\Desktop\CreatorOS"
$ApiRoot = Join-Path $Root "apps\api"
$SourceRoot = Join-Path $ApiRoot "src"
$MainFile = Join-Path $SourceRoot "main.ts"

if (-not (Test-Path $Root)) {
    throw "CreatorOS project was not found: $Root"
}

if (-not (Test-Path $SourceRoot)) {
    throw "API source folder was not found: $SourceRoot"
}

Set-Location $Root

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $Root "backups\persistence-di-root-fix-$Timestamp"

New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$ModifiedFiles = New-Object System.Collections.Generic.List[string]
$DiFixedFiles = New-Object System.Collections.Generic.List[string]
$RouteFixedFiles = New-Object System.Collections.Generic.List[string]

function Save-Backup {
    param(
        [Parameter(Mandatory)]
        [string]$FilePath
    )

    $RelativePath = $FilePath.Substring($Root.Length).TrimStart("\")
    $BackupPath = Join-Path $BackupRoot $RelativePath
    $BackupDirectory = Split-Path $BackupPath -Parent

    New-Item `
        -ItemType Directory `
        -Path $BackupDirectory `
        -Force | Out-Null

    Copy-Item `
        -Path $FilePath `
        -Destination $BackupPath `
        -Force
}

function Write-Utf8File {
    param(
        [Parameter(Mandatory)]
        [string]$FilePath,

        [Parameter(Mandatory)]
        [string]$Content
    )

    [System.IO.File]::WriteAllText(
        $FilePath,
        $Content,
        $Utf8NoBom
    )
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " CREATOROS NEST DI ROOT FIX" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/7] Scanning Nest dependency injection files..." -ForegroundColor Yellow

$TypeScriptFiles = Get-ChildItem `
    -Path $SourceRoot `
    -Recurse `
    -File `
    -Filter "*.ts" |
    Where-Object {
        $_.FullName -notmatch "\\generated\\" -and
        $_.FullName -notmatch "\\dist\\" -and
        $_.Name -notmatch "\.spec\.ts$"
    }

foreach ($File in $TypeScriptFiles) {
    $OriginalContent = [System.IO.File]::ReadAllText($File.FullName)
    $UpdatedContent = $OriginalContent
    $FileChanged = $false

    $IsNestRuntimeClass =
        $OriginalContent -match "@Injectable\s*\(" -or
        $OriginalContent -match "@Controller\s*\(" -or
        $OriginalContent -match "@Guard\s*\(" -or
        $OriginalContent -match "@Resolver\s*\(" -or
        $OriginalContent -match "@WebSocketGateway\s*\("

    $HasConstructor =
        $OriginalContent -match "constructor\s*\("

    if ($IsNestRuntimeClass -and $HasConstructor) {
        $ImportTypePattern =
            "(?m)^(\s*)import\s+type\s+(\{[^`r`n]+\})\s+from\s+(['""])(\.[^'""]+)\3\s*;"

        $UpdatedContent = [regex]::Replace(
            $UpdatedContent,
            $ImportTypePattern,
            {
                param($Match)

                $Indent = $Match.Groups[1].Value
                $Imports = $Match.Groups[2].Value
                $Quote = $Match.Groups[3].Value
                $ModulePath = $Match.Groups[4].Value

                return "$Indent" +
                    "import $Imports from $Quote$ModulePath$Quote;"
            }
        )

        if ($UpdatedContent -ne $OriginalContent) {
            $FileChanged = $true
            $DiFixedFiles.Add($File.FullName)
        }
    }

    $RoutePatterns = @(
        @{
            Old = "'/api/*'"
            New = "'/api/{*path}'"
        },
        @{
            Old = '"/api/*"'
            New = '"/api/{*path}"'
        }
    )

    foreach ($RoutePattern in $RoutePatterns) {
        if ($UpdatedContent.Contains($RoutePattern.Old)) {
            $UpdatedContent =
                $UpdatedContent.Replace(
                    $RoutePattern.Old,
                    $RoutePattern.New
                )

            $FileChanged = $true
            $RouteFixedFiles.Add($File.FullName)
        }
    }

    if ($FileChanged) {
        Save-Backup -FilePath $File.FullName
        Write-Utf8File `
            -FilePath $File.FullName `
            -Content $UpdatedContent

        $ModifiedFiles.Add($File.FullName)
    }
}

Write-Host "[1/7] Nest DI scan completed." -ForegroundColor Green
Write-Host "      DI files fixed: $($DiFixedFiles.Count)" -ForegroundColor Green
Write-Host "      Route files fixed: $($RouteFixedFiles.Count)" -ForegroundColor Green

Write-Host ""
Write-Host "[2/7] Applying explicit PersistenceService protection..." -ForegroundColor Yellow

$PersistenceServiceFile = Join-Path `
    $SourceRoot `
    "modules\persistence\persistence.service.ts"

if (-not (Test-Path $PersistenceServiceFile)) {
    throw "PersistenceService file was not found: $PersistenceServiceFile"
}

$PersistenceContent =
    [System.IO.File]::ReadAllText($PersistenceServiceFile)

$PersistenceOriginal = $PersistenceContent

$PersistenceContent = $PersistenceContent.Replace(
    "import type { PrismaService } from './prisma.service';",
    "import { PrismaService } from './prisma.service';"
)

if ($PersistenceContent -ne $PersistenceOriginal) {
    if (-not $ModifiedFiles.Contains($PersistenceServiceFile)) {
        Save-Backup -FilePath $PersistenceServiceFile
        $ModifiedFiles.Add($PersistenceServiceFile)
    }

    Write-Utf8File `
        -FilePath $PersistenceServiceFile `
        -Content $PersistenceContent
}

if (
    $PersistenceContent -notmatch
    "import\s+\{\s*PrismaService\s*\}\s+from\s+['""]\./prisma\.service['""]"
) {
    throw "PrismaService runtime import was not configured correctly."
}

if (
    $PersistenceContent -match
    "import\s+type\s+\{\s*PrismaService\s*\}"
) {
    throw "PersistenceService still uses import type for PrismaService."
}

Write-Host "[2/7] PersistenceService runtime injection verified." -ForegroundColor Green

Write-Host ""
Write-Host "[3/7] Normalizing dotenv loader..." -ForegroundColor Yellow

if (Test-Path $MainFile) {
    $MainContent = [System.IO.File]::ReadAllText($MainFile)
    $OriginalMainContent = $MainContent

    $MainContent = [regex]::Replace(
        $MainContent,
        "loadEnvironment\(\{\s*path:\s*environmentFile,\s*override:\s*false,\s*\}\);",
        @"
loadEnvironment({
      path: environmentFile,
      override: false,
      quiet: true,
    });
"@
    )

    if ($MainContent -ne $OriginalMainContent) {
        if (-not $ModifiedFiles.Contains($MainFile)) {
            Save-Backup -FilePath $MainFile
            $ModifiedFiles.Add($MainFile)
        }

        Write-Utf8File `
            -FilePath $MainFile `
            -Content $MainContent
    }
}

Write-Host "[3/7] dotenv loader normalized." -ForegroundColor Green

Write-Host ""
Write-Host "[4/7] Running structural verification..." -ForegroundColor Yellow

$RemainingDangerousImports = New-Object System.Collections.Generic.List[string]

foreach ($File in $TypeScriptFiles) {
    $Content = [System.IO.File]::ReadAllText($File.FullName)

    $IsNestRuntimeClass =
        $Content -match "@Injectable\s*\(" -or
        $Content -match "@Controller\s*\(" -or
        $Content -match "@Guard\s*\(" -or
        $Content -match "@Resolver\s*\(" -or
        $Content -match "@WebSocketGateway\s*\("

    if (
        $IsNestRuntimeClass -and
        $Content -match "constructor\s*\(" -and
        $Content -match "(?m)^\s*import\s+type\s+\{[^`r`n]+\}\s+from\s+['""]\."
    ) {
        $RemainingDangerousImports.Add($File.FullName)
    }
}

if ($RemainingDangerousImports.Count -gt 0) {
    Write-Host ""
    Write-Host "Potential runtime-only DI imports remain:" -ForegroundColor Red

    foreach ($DangerousFile in $RemainingDangerousImports) {
        Write-Host " - $DangerousFile" -ForegroundColor Red
    }

    throw "Nest dependency-injection safety verification failed."
}

$RemainingLegacyRoutes = Get-ChildItem `
    -Path $SourceRoot `
    -Recurse `
    -File `
    -Filter "*.ts" |
    Select-String `
        -SimpleMatch `
        -Pattern "/api/*"

if ($RemainingLegacyRoutes) {
    Write-Host ""
    Write-Host "Legacy /api/* routes remain:" -ForegroundColor Red
    $RemainingLegacyRoutes |
        Format-Table Path, LineNumber, Line -AutoSize

    throw "Legacy route verification failed."
}

Write-Host "[4/7] Structural verification passed." -ForegroundColor Green

Write-Host ""
Write-Host "[5/7] Generating Prisma Client..." -ForegroundColor Yellow

$EnvFile = Join-Path $ApiRoot ".env"

if (Test-Path $EnvFile) {
    Get-Content $EnvFile |
        ForEach-Object {
            if (
                $_ -match "^\s*([^#][^=]+?)\s*=\s*(.*)\s*$"
            ) {
                $EnvironmentName = $Matches[1].Trim()
                $EnvironmentValue = $Matches[2].Trim()

                [Environment]::SetEnvironmentVariable(
                    $EnvironmentName,
                    $EnvironmentValue,
                    "Process"
                )
            }
        }
}

if (-not $env:DATABASE_URL) {
    throw "DATABASE_URL is not available after loading apps/api/.env."
}

pnpm --filter @creatoros/api exec prisma generate

if ($LASTEXITCODE -ne 0) {
    throw "Prisma generate failed."
}

Write-Host "[5/7] Prisma Client generated." -ForegroundColor Green

Write-Host ""
Write-Host "[6/7] Running TypeScript verification..." -ForegroundColor Yellow

pnpm --filter @creatoros/api typecheck

if ($LASTEXITCODE -ne 0) {
    throw "TypeScript typecheck failed."
}

Write-Host "[6/7] TypeScript verification passed." -ForegroundColor Green

Write-Host ""
Write-Host "[7/7] Running production build..." -ForegroundColor Yellow

pnpm --filter @creatoros/api build

if ($LASTEXITCODE -ne 0) {
    throw "Production build failed."
}

Write-Host "[7/7] Production build passed." -ForegroundColor Green

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " CREATOROS NEST DI ROOT FIX: VERIFIED" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Persistence DI       : VERIFIED" -ForegroundColor Green
Write-Host " Runtime imports      : VERIFIED" -ForegroundColor Green
Write-Host " Legacy API wildcard  : FIXED" -ForegroundColor Green
Write-Host " dotenv logging       : QUIET" -ForegroundColor Green
Write-Host " Prisma Generate      : PASSED" -ForegroundColor Green
Write-Host " Typecheck            : PASSED" -ForegroundColor Green
Write-Host " Build                : PASSED" -ForegroundColor Green
Write-Host " Modified files       : $($ModifiedFiles.Count)" -ForegroundColor Green
Write-Host " Backup               : $BackupRoot" -ForegroundColor DarkGray
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT — restart the server window:" -ForegroundColor Yellow
Write-Host "Set-Location C:\Users\User\Desktop\CreatorOS" -ForegroundColor White
Write-Host "pnpm --filter @creatoros/api start:dev" -ForegroundColor White
Write-Host ""
