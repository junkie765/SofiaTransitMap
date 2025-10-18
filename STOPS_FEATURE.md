# Sofia Transit Map - Stops Feature

## New Features Added ✨

### 1. Bus/Tram/Trolley Stop Display 🚏
- Shows all transit stops on the map
- Stop markers use emoji icons (🚏) for easy identification
- Stops are extracted from real-time vehicle data

### 2. Vehicle-to-Stop Information
- Each stop shows which vehicles are currently at or approaching it
- Click on a stop marker to see:
  - Stop ID
  - List of all vehicles at/approaching that stop
  - Vehicle types and route numbers

### 3. Vehicle Popups Enhanced
- Vehicle popups now show "Next Stop" information
- Displays the stop ID the vehicle is heading to

### 4. Toggle Controls
- **"🚏 Show/Hide Stops"** button in the top-right corner
- Click to toggle stop visibility on/off
- Prevents map clutter when you only want to see vehicles

## How It Works

### Data Collection
1. Real-time vehicle data includes `stop_id` field
2. When vehicles report their next stop, we collect stop locations
3. Stops are dynamically discovered from vehicle positions

### Stop Markers
- Created at approximate locations based on vehicle positions
- Multiple vehicles can reference the same stop
- Popup shows all vehicles currently at or approaching that stop

### Technical Implementation
- `stopMarkers` object stores all stop markers
- `stopsData` object stores stop information (location, vehicles)
- `updateStops()` function updates stop information each refresh
- `toggleStops()` function controls visibility

## Usage

1. **View the Map**: See real-time vehicle positions
2. **Click "Show Stops"**: Display all transit stops
3. **Click a Stop**: See which vehicles are there
4. **Click a Vehicle**: See its next stop destination
5. **Click "Hide Stops"**: Clean up the map view

## Data Structure

### Stop Information
```javascript
stopsData[stopId] = {
    lat: latitude,
    lon: longitude,
    vehicles: [
        {
            routeNumber: "67",
            vehicleId: "A3405",
            vehicleType: { type: 'bus', color: '#f39c12', label: '🚌' }
        },
        // ... more vehicles
    ]
}
```

### Vehicle Data (Updated)
```javascript
{
    entityId: "A77-A1725-3-20-17544279430",
    routeId: "A77",
    routeNumber: "67",
    vehicleId: "A3405",
    lat: 42.676968,
    lon: 23.342415,
    stopId: "A1730",  // ← NEW: Next stop
    timestamp: 1729264826
}
```

## Benefits

✅ Better understanding of transit network
✅ See which vehicles serve which stops
✅ Identify busy stops with multiple vehicles
✅ Plan your route by finding nearby stops
✅ No additional API calls needed - uses existing data

## Future Enhancements

Potential improvements:
- Stop names (requires GTFS static data)
- Stop clustering for better performance
- Filter stops by vehicle type
- Show stop schedules
- Walking directions to nearest stop

---

**Deployed**: October 18, 2025
**Live Site**: https://junkie765.github.io/SofiaTransitMap/
