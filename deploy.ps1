# Sofia Transit Map - Quick Deployment Script
# This script will set up git and push your project to GitHub

Write-Host "🚀 Sofia Transit Map - GitHub Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if git is installed
Write-Host "Checking git installation..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Git is installed`n" -ForegroundColor Green

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already initialized" -ForegroundColor Yellow
    $response = Read-Host "Do you want to continue? This will add and commit files (y/n)"
    if ($response -ne "y") {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
} else {
    # Initialize git repository
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repository initialized`n" -ForegroundColor Green
}

# Add files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add index.html app.js README.md .gitignore
Write-Host "✓ Files added`n" -ForegroundColor Green

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    # Commit changes
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m "Deploy Sofia Transit Map - Real-time vehicle tracking"
    Write-Host "✓ Changes committed`n" -ForegroundColor Green
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "✓ Remote origin already configured: $remoteExists`n" -ForegroundColor Green
} else {
    # Add remote
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/junkie765/SofiaTransitMap.git
    Write-Host "✓ Remote added`n" -ForegroundColor Green
}

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to main`n" -ForegroundColor Green

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "(You may be prompted for GitHub credentials)`n" -ForegroundColor Cyan

$pushResult = git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS! Your website has been pushed to GitHub!" -ForegroundColor Green
    Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://github.com/junkie765/SofiaTransitMap" -ForegroundColor White
    Write-Host "2. Click 'Settings' → 'Pages'" -ForegroundColor White
    Write-Host "3. Under 'Source', select 'main' branch" -ForegroundColor White
    Write-Host "4. Click 'Save'" -ForegroundColor White
    Write-Host "`n🌐 Your site will be live at:" -ForegroundColor Cyan
    Write-Host "   https://junkie765.github.io/SofiaTransitMap/`n" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Error:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host "`nPossible solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure the repository exists: https://github.com/junkie765/SofiaTransitMap" -ForegroundColor White
    Write-Host "2. Check your GitHub authentication (you may need to use a Personal Access Token)" -ForegroundColor White
    Write-Host "3. Try running: git push -u origin main" -ForegroundColor White
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
