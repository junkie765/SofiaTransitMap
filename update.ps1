# Quick Update Script - Push changes to GitHub
# Run this whenever you make changes to your transit map

Write-Host "🔄 Sofia Transit Map - Quick Update" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Check for changes
Write-Host "Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain

if (-not $status) {
    Write-Host "✓ No changes detected. Everything is up to date!" -ForegroundColor Green
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 0
}

# Show changes
Write-Host "Changes detected:`n" -ForegroundColor Yellow
git status -s
Write-Host ""

# Ask for commit message
Write-Host "Enter a brief description of your changes:" -ForegroundColor Cyan
$message = Read-Host "Message"

if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "Update Sofia Transit Map"
}

# Add, commit, and push
Write-Host "`nAdding changes..." -ForegroundColor Yellow
git add .

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m $message

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully updated!" -ForegroundColor Green
    Write-Host "Your changes will be live in 1-2 minutes at:" -ForegroundColor Cyan
    Write-Host "https://junkie765.github.io/SofiaTransitMap/`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Please check the error above." -ForegroundColor Red
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
