# Fix Git Conflict and Deploy
Write-Host "🔧 Fixing Git conflict and deploying..." -ForegroundColor Cyan

# Pull with merge strategy
Write-Host "`nPulling remote changes..." -ForegroundColor Yellow
git pull origin main --allow-unrelated-histories --no-edit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully merged remote changes" -ForegroundColor Green
    
    # Now push
    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ SUCCESS! Files pushed to GitHub!" -ForegroundColor Green
        Write-Host "`n📝 IMPORTANT - Enable GitHub Pages:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://github.com/junkie765/SofiaTransitMap/settings/pages" -ForegroundColor White
        Write-Host "2. Under 'Branch', select 'main' (or 'master')" -ForegroundColor White
        Write-Host "3. Make sure folder is set to '/ (root)'" -ForegroundColor White
        Write-Host "4. Click 'Save'" -ForegroundColor White
        Write-Host "`n⏳ Wait 2-3 minutes, then visit:" -ForegroundColor Yellow
        Write-Host "   https://junkie765.github.io/SofiaTransitMap/`n" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Push failed!" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  Pull failed. Trying alternative method..." -ForegroundColor Yellow
    Write-Host "`nForcing push (this will overwrite remote)..." -ForegroundColor Yellow
    
    $confirm = Read-Host "Type 'yes' to force push"
    if ($confirm -eq "yes") {
        git push -u origin main --force
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Force push successful!" -ForegroundColor Green
            Write-Host "`nNow enable GitHub Pages (see instructions above)" -ForegroundColor Cyan
        }
    }
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
