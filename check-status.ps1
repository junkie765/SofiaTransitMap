# Check Website Status
Write-Host "🔍 Sofia Transit Map - Status Check" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

Write-Host "✅ Fix applied: CORS proxy added to app.js" -ForegroundColor Green
Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
Write-Host "`n⏳ GitHub Pages is rebuilding your site..." -ForegroundColor Yellow
Write-Host "   This usually takes 1-3 minutes`n" -ForegroundColor Yellow

Write-Host "🌐 Your live site:" -ForegroundColor Cyan
Write-Host "   https://junkie765.github.io/SofiaTransitMap/`n" -ForegroundColor White

Write-Host "📊 What you should see when it's ready:" -ForegroundColor Cyan
Write-Host "   - Map centered on Sofia" -ForegroundColor White
Write-Host "   - 300+ vehicle markers (orange buses, blue trams, red trolleys)" -ForegroundColor White
Write-Host "   - Live counters at the bottom" -ForegroundColor White
Write-Host "   - Auto-refresh every 30 seconds`n" -ForegroundColor White

Write-Host "🔧 Testing locally:" -ForegroundColor Cyan
Write-Host "   http://localhost:8001`n" -ForegroundColor White

Write-Host "💡 If vehicles still don't appear:" -ForegroundColor Yellow
Write-Host "   1. Wait 2-3 minutes for GitHub Pages to rebuild" -ForegroundColor White
Write-Host "   2. Hard refresh your browser (Ctrl+Shift+R or Ctrl+F5)" -ForegroundColor White
Write-Host "   3. Open browser console (F12) to check for errors" -ForegroundColor White
Write-Host "   4. Clear browser cache`n" -ForegroundColor White

Write-Host "🚀 Opening your live site..." -ForegroundColor Green
Start-Sleep -Seconds 1
Start-Process "https://junkie765.github.io/SofiaTransitMap/"

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
