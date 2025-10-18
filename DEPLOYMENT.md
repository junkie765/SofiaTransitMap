# 🚀 Quick Deployment Guide for junkie765

## Your Project Details
- **GitHub Username**: junkie765
- **Repository Name**: SofiaTransitMap
- **Live URL**: https://junkie765.github.io/SofiaTransitMap/

---

## 📦 Deployment Steps

### Method 1: Automated Script (Easiest!)

Just run this command in PowerShell:

```powershell
cd E:\aistrat\GTFS
.\deploy.ps1
```

The script will:
✓ Initialize git
✓ Add your files
✓ Commit changes
✓ Push to GitHub

---

### Method 2: Manual Git Commands

If you prefer to do it manually:

```powershell
cd E:\aistrat\GTFS

# Initialize git (if not already done)
git init

# Add files
git add index.html app.js README.md .gitignore

# Commit
git commit -m "Initial commit - Sofia Transit Map"

# Add remote repository
git remote add origin https://github.com/junkie765/SofiaTransitMap.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Method 3: GitHub Web Interface (No Git Required!)

1. Go to: https://github.com/junkie765/SofiaTransitMap
2. Click "Add file" → "Upload files"
3. Drag these files:
   - index.html
   - app.js
   - README.md
4. Click "Commit changes"

---

## 🌐 Enable GitHub Pages

After pushing your code:

1. Go to: https://github.com/junkie765/SofiaTransitMap/settings/pages
2. Under "Branch", select **main**
3. Click **Save**
4. Wait 1-2 minutes

Your site will be live at: **https://junkie765.github.io/SofiaTransitMap/**

---

## 🔑 GitHub Authentication

If prompted for credentials, you'll need a **Personal Access Token** (not password):

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use it as your password when pushing

---

## ✅ Verify Deployment

After deployment, check:
- Repository: https://github.com/junkie765/SofiaTransitMap
- Live Site: https://junkie765.github.io/SofiaTransitMap/

---

## 🔄 Future Updates

To update your site:

```powershell
cd E:\aistrat\GTFS

# Make your changes to index.html or app.js

# Add and commit
git add .
git commit -m "Update: describe your changes"

# Push
git push
```

Your live site will update automatically in 1-2 minutes!

---

## 📞 Need Help?

- Check if repo exists: https://github.com/junkie765/SofiaTransitMap
- Test locally first: `python -m http.server 8000`
- GitHub Pages docs: https://pages.github.com/

---

**Ready to deploy? Run `.\deploy.ps1` now!** 🚀
