param(
    [switch]$FullApiTests
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [scriptblock]$Command
    )

    Write-Host ""
    Write-Host "============================================================"
    Write-Host $Name
    Write-Host "============================================================"

    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE."
    }
}

$builderRoot = "apps\api\src\modules\capabilities\sdk\builders"
$manifestBuilder = "$builderRoot\capability\capability-manifest.builder.ts"

if (-not (Test-Path $builderRoot)) {
    throw "SDK builders directory was not found: $builderRoot"
}

if (-not (Test-Path $manifestBuilder)) {
    throw "SDK manifest builder was not found: $manifestBuilder"
}

Write-Host ""
Write-Host "============================================================"
Write-Host "SDK IMPORT BOUNDARY AUDIT"
Write-Host "============================================================"

$builderFiles = Get-ChildItem `
    $builderRoot `
    -Recurse `
    -File `
    -Filter "*.ts"

$forbiddenImports = $builderFiles |
    Select-String -SimpleMatch -Pattern @(
        "from '../../contracts'",
        "from '../../manifest'",
        "from '../../interfaces'",
        "from '../../plugin-host'"
    )

if ($forbiddenImports) {
    $forbiddenImports |
        ForEach-Object {
            Write-Host "$($_.Path):$($_.LineNumber): $($_.Line)"
        }

    throw "Incorrect SDK builder relative imports were found."
}

$manifestContent = Get-Content $manifestBuilder -Raw

$invalidContractImportFromManifest = [regex]::IsMatch(
    $manifestContent,
    "import\s+(?:type\s+)?\{[^}]*\b(CapabilityCompatibilityContract|CapabilityManifestContract|CapabilityPublisherContract)\b[^}]*\}\s+from\s+['""]\.\.\/\.\.\/\.\.\/manifest['""]",
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)

if ($invalidContractImportFromManifest) {
    throw "Core capability contracts must be imported from '../../../contracts', not '../../../manifest'."
}

$requiredContractTypes = @(
    "CapabilityCompatibilityContract",
    "CapabilityDependencyContract",
    "CapabilityDomain",
    "CapabilityEntrypointContract",
    "CapabilityKind",
    "CapabilityManifestContract",
    "CapabilityMetadata",
    "CapabilityPublisherContract",
    "CapabilityResourcePolicyContract"
)

foreach ($typeName in $requiredContractTypes) {
    $pattern =
        "import\s+type\s+\{[^}]*\b" +
        [regex]::Escape($typeName) +
        "\b[^}]*\}\s+from\s+['""]\.\.\/\.\.\/\.\.\/contracts['""]"

    if (
        -not [regex]::IsMatch(
            $manifestContent,
            $pattern,
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    ) {
        throw "$typeName is not imported from '../../../contracts'."
    }
}

$requiredManifestExports = @(
    "CapabilityManifestFactory",
    "createDefaultCapabilityPolicy",
    "CreateCapabilityManifestInput"
)

foreach ($exportName in $requiredManifestExports) {
    $pattern =
        "import\s+\{[^}]*\b" +
        [regex]::Escape($exportName) +
        "\b[^}]*\}\s+from\s+['""]\.\.\/\.\.\/\.\.\/manifest['""]"

    if (
        -not [regex]::IsMatch(
            $manifestContent,
            $pattern,
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    ) {
        throw "$exportName is not imported from '../../../manifest'."
    }
}

Write-Host "SDK import boundary audit passed."

Invoke-CheckedCommand "API TYPECHECK" {
    pnpm --filter @creatoros/api typecheck
}

Invoke-CheckedCommand "SDK TESTS" {
    pnpm --filter @creatoros/api test -- `
        --runInBand `
        --testPathPatterns="capability-sdk|plugin-builder-integration.spec.ts"
}

Invoke-CheckedCommand "CAPABILITY REGRESSION TESTS" {
    pnpm --filter @creatoros/api test -- `
        --runInBand `
        --testPathPatterns="plugin-host|dependency-resolver|capability-runtime-engine.service.spec.ts|capability-registry-engine.service.spec.ts|capability-foundation.spec.ts"
}

if ($FullApiTests) {
    Invoke-CheckedCommand "FULL API TEST SUITE" {
        pnpm --filter @creatoros/api test -- --runInBand
    }
}

Invoke-CheckedCommand "API BUILD" {
    pnpm --filter @creatoros/api build
}

Invoke-CheckedCommand "GIT WHITESPACE CHECK" {
    git diff --check
}

Write-Host ""
Write-Host "============================================================"
Write-Host "CAPABILITY SDK QUALITY GATE PASSED"
Write-Host "============================================================"