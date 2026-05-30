# Run after: gh auth login
# Creates repo (if needed), sets secret, pushes main, enables GitHub Pages

$ErrorActionPreference = "Stop"
$RepoName = "netflux"
$Gh = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $Gh)) {
    Write-Host "Install GitHub CLI: winget install GitHub.cli"
    exit 1
}

& $Gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Run first: gh auth login"
    exit 1
}

$token = (Get-Content ".env" -ErrorAction SilentlyContinue | Where-Object { $_ -match '^VITE_TMDB_ACCESS_TOKEN=' }) -replace '^VITE_TMDB_ACCESS_TOKEN=',''
if ($token) {
    $token | & $Gh secret set VITE_TMDB_ACCESS_TOKEN
    Write-Host "Set GitHub secret VITE_TMDB_ACCESS_TOKEN"
}

$repoExists = & $Gh repo view "hemanth04/$RepoName" 2>&1
if ($LASTEXITCODE -ne 0) {
    & $Gh repo create $RepoName --public --source=. --remote=origin --push
} else {
    git push -u origin main
}

Write-Host ""
Write-Host "Enable Pages: GitHub repo -> Settings -> Pages -> Source: GitHub Actions"
Write-Host "Site URL: https://hemanth04.github.io/$RepoName/"
