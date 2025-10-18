# 🚍 Sofia Public Transport Real-time Map

A beautiful, real-time interactive map showing the current positions of all buses, trams, and trolleybuses in Sofia, Bulgaria.

![Sofia Transport Map](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🗺️ **Interactive Map** - Powered by Leaflet.js with OpenStreetMap tiles
- 🚌 **Real-time Tracking** - Live positions of 300+ vehicles updated every 30 seconds
- 🎨 **Color-coded Vehicles** - Easy distinction between buses (orange), trams (blue), and trolleybuses (red)
- 📊 **Live Statistics** - Real-time counts of active vehicles by type
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Lightweight** - Pure JavaScript, no frameworks needed

## 🚀 Live Demo

**GitHub Pages**: https://junkie765.github.io/SofiaTransitMap/

## 📦 What's Included

```
sofia-transport-map/
├── index.html          # Main HTML page
├── app.js              # JavaScript application logic
├── README.md           # This file
└── gtfs.py            # Python script for testing API
```

## 🛠️ Quick Start - Deploy to GitHub Pages

### Option 1: GitHub Web Interface (Easiest)

1. **Create a new repository** on GitHub
   - Go to https://github.com/new
   - Name it `SofiaTransitMap`
   - Make it Public
   - Click "Create repository"

2. **Upload files**
   - Click "uploading an existing file"
   - Drag and drop `index.html` and `app.js`
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select `main` branch
   - Click Save
   - Your site will be live at: `https://junkie765.github.io/SofiaTransitMap/`

### Option 2: Using Git (Command Line)

```powershell
# Navigate to your GTFS folder
cd E:\aistrat\GTFS

# Initialize git repository
git init

# Add files
git add index.html app.js README.md

# Commit
git commit -m "Initial commit - Sofia transport map"

# Add your GitHub repository as remote
git remote add origin https://github.com/junkie765/SofiaTransitMap.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages in repository settings
```

Then enable GitHub Pages in your repository settings.

## 🔧 Local Development

To run the map locally:

1. **Simple HTTP Server (Python)**:
   ```powershell
   cd E:\aistrat\GTFS
   python -m http.server 8000
   ```
   Open http://localhost:8000

2. **Using VS Code Live Server**:
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

## 🎯 How It Works

1. **Data Source**: Fetches real-time GTFS data from Sofia Traffic API
   - API: `https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions`
   - Format: Protocol Buffers (GTFS Realtime)

2. **Data Processing**: 
   - Parses protobuf binary data using protobuf.js
   - Extracts vehicle positions, route IDs, and timestamps
   - Updates map markers in real-time

3. **Visualization**:
   - Leaflet.js for interactive maps
   - Custom markers for different vehicle types
   - Auto-refresh every 30 seconds

## 🎨 Customization

### Change Update Interval

Edit `app.js`, line 9:
```javascript
const REFRESH_INTERVAL = 30000; // Change to 60000 for 1 minute
```

### Change Map Center/Zoom

Edit `app.js`, line 47:
```javascript
map = L.map('map').setView([42.6977, 23.3219], 13);
//                          [latitude, longitude], zoom_level
```

### Change Color Scheme

Edit vehicle colors in `app.js`, lines 56-64:
```javascript
if (routeId.startsWith('TM')) {
    return { type: 'tram', color: '#3498db', label: '🚋' }; // Change color here
}
```

### Use Different Map Tiles

Replace the tile layer in `app.js`, lines 50-53. Popular alternatives:
- **Dark Mode**: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **Satellite**: Use Mapbox or Google Maps tiles (requires API key)

## 📊 Vehicle Types

- **🚌 Buses** (A routes) - Orange markers
- **🚋 Trams** (TM routes) - Blue markers  
- **🚎 Trolleybuses** (TB routes) - Red markers

## 🔒 CORS & Privacy

The application makes direct requests to Sofia's public API. If you encounter CORS issues when hosting:

1. **GitHub Pages**: Should work fine (same origin)
2. **Local development**: May need a CORS proxy or browser extension
3. **Alternative**: Set up a simple backend proxy (see advanced section)

## 🚀 Advanced: Add Backend Proxy (Optional)

If you need a backend, deploy to **Vercel** or **Netlify** with serverless functions:

**Vercel** (`api/vehicles.js`):
```javascript
export default async function handler(req, res) {
    const response = await fetch('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');
    const data = await response.arrayBuffer();
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(Buffer.from(data));
}
```

## 📝 License

MIT License - Feel free to use this project however you'd like!

## 🙏 Credits

- **Data**: [Sofia Traffic](https://www.sofiatraffic.bg/) & [Sofia Urban Data](https://urbandata.sofia.bg/)
- **Maps**: [OpenStreetMap](https://www.openstreetmap.org/) contributors
- **Library**: [Leaflet.js](https://leafletjs.com/)

## 🐛 Troubleshooting

**Map doesn't load?**
- Check browser console for errors (F12)
- Ensure you have internet connection
- Try clearing browser cache

**Vehicles not updating?**
- Check if Sofia's API is accessible: https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions
- Look for CORS errors in console

**Markers not appearing?**
- API might be down temporarily
- Check browser console for parsing errors

## 📧 Support

Found a bug or have a suggestion? Open an issue on GitHub!

---

**Made with ❤️ for Sofia** 🇧🇬
