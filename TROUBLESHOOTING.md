# 🚨 Troubleshooting Guide - No Vehicles Displayed

## Problem
Your Sofia Transit Map loads but shows 0 vehicles on the map.

## ✅ What's Working
- ✓ GitHub Pages is live: https://junkie765.github.io/SofiaTransitMap/
- ✓ Map displays correctly
- ✓ Sofia API is accessible (351 vehicles available)
- ✓ Python script works perfectly

## ❌ The Issue
CORS (Cross-Origin Resource Sharing) blocking - browsers won't let GitHub Pages directly access Sofia's API.

## 🔧 Fixes Applied

### Fix #1: Added CORS Proxy (Current)
**File**: `app.js`
**Change**: Using `corsproxy.io` to bypass CORS restrictions

```javascript
const API_URL = 'https://corsproxy.io/?' + 
    encodeURIComponent('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');
```

**Status**: ✅ Pushed to GitHub
**Wait Time**: 2-3 minutes for GitHub Pages to rebuild

## 🧪 Testing

### Test Locally First:
1. Open: http://localhost:8001/test.html
2. Click all three test buttons
3. Check if protobuf parsing works

### Test Your Live Site:
1. Wait 2-3 minutes after git push
2. Visit: https://junkie765.github.io/SofiaTransitMap/
3. **Hard refresh**: Ctrl + Shift + R (or Ctrl + F5)
4. Check browser console (F12) for errors

## 🔍 Diagnostic Steps

If still not working:

1. **Open Browser DevTools** (F12)
2. Go to **Console** tab
3. Look for errors (red text)
4. Common issues:
   - `CORS error` - proxy not working
   - `Failed to fetch` - network issue
   - `Cannot read property` - protobuf parsing error

## 💡 Alternative Solutions

### Option 1: Use a Different CORS Proxy
Edit `app.js` and try these alternatives:

```javascript
// Option A: CORS Anywhere
const API_URL = 'https://cors-anywhere.herokuapp.com/' + 
    'https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions';

// Option B: AllOrigins
const API_URL = 'https://api.allorigins.win/raw?url=' + 
    encodeURIComponent('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');
```

### Option 2: Create Your Own Proxy (Advanced)
Deploy a simple proxy on Vercel/Netlify:

**File: `api/proxy.js`** (for Vercel)
```javascript
export default async function handler(req, res) {
    const response = await fetch('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');
    const data = await response.arrayBuffer();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(data));
}
```

## 📞 Quick Status Check

Run this in PowerShell:
```powershell
cd E:\aistrat\GTFS
.\check-status.ps1
```

Or check manually:
1. Repository: https://github.com/junkie765/SofiaTransitMap
2. GitHub Actions: https://github.com/junkie765/SofiaTransitMap/actions
3. Live site: https://junkie765.github.io/SofiaTransitMap/

## ⏰ Timeline

- **Now**: Latest fix pushed (corsproxy.io)
- **+1-2 min**: GitHub Pages starts rebuilding
- **+2-3 min**: New version live
- **Action**: Hard refresh browser (Ctrl+Shift+R)

## ✅ Success Indicators

When it works, you'll see:
- 🟠 Orange markers (Buses) ~180+
- 🔵 Blue markers (Trams) ~80+
- 🔴 Red markers (Trolleybuses) ~90+
- 📊 Bottom panel shows non-zero counts
- "Last update" timestamp changes every 30 seconds

## 🆘 Still Not Working?

1. Test the diagnostic page: http://localhost:8001/test.html
2. Check browser console for specific errors
3. Try a different browser (Chrome, Firefox, Edge)
4. Clear all browser cache and cookies
5. Wait full 5 minutes and hard refresh

---

**Last Updated**: Just now
**Current Fix**: Using corsproxy.io CORS proxy
**Expected Resolution**: 2-3 minutes after push
