param(
  [string]$Message = "Update Liquid Genius website"
)

$ErrorActionPreference = "Stop"

git status --short

$changes = git status --porcelain
if (-not $changes) {
  Write-Host "No changes to sync."
  exit 0
}

git add .
git commit -m $Message
git push
