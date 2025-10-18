// Sofia Public Transport Real-time Map
// GTFS Realtime vehicle tracking

let map;
let vehicleMarkers = {};
let updateInterval;
let refreshCountdown;
const REFRESH_INTERVAL = 30000; // 30 seconds
// Use CORS proxy to access the API from GitHub Pages
const API_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');

// GTFS Realtime protobuf definition
const gtfsRealtimeProto = `
syntax = "proto2";
package transit_realtime;

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
}

message FeedHeader {
  required string gtfs_realtime_version = 1;
  optional uint64 timestamp = 3;
}

message FeedEntity {
  required string id = 1;
  optional VehiclePosition vehicle = 7;
}

message VehiclePosition {
  optional TripDescriptor trip = 1;
  optional Position position = 2;
  optional uint64 timestamp = 4;
}

message TripDescriptor {
  optional string route_id = 5;
}

message Position {
  required float latitude = 1;
  required float longitude = 2;
}
`;

// Initialize the map
function initMap() {
    // Center on Sofia, Bulgaria
    map = L.map('map').setView([42.6977, 23.3219], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    console.log('Map initialized');
}

// Get vehicle type and color based on route ID
function getVehicleType(routeId) {
    if (routeId.startsWith('TM')) {
        return { type: 'tram', color: '#3498db', label: '🚋' };
    } else if (routeId.startsWith('TB')) {
        return { type: 'trolley', color: '#e74c3c', label: '🚎' };
    } else if (routeId.startsWith('A')) {
        return { type: 'bus', color: '#f39c12', label: '🚌' };
    }
    return { type: 'unknown', color: '#95a5a6', label: '🚐' };
}

// Create custom marker icon
function createMarkerIcon(routeId, vehicleType) {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="vehicle-marker marker-${vehicleType.type}" style="background: ${vehicleType.color}">
                ${routeId.replace('TM', '').replace('TB', '').replace('A', '')}
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Update vehicle markers on the map
function updateVehicles(vehicles) {
    const counts = { bus: 0, tram: 0, trolley: 0 };
    const currentVehicleIds = new Set();

    vehicles.forEach(vehicle => {
        const { routeId, lat, lon, timestamp, entityId } = vehicle;
        const vehicleType = getVehicleType(routeId);
        
        // Count by type
        counts[vehicleType.type]++;
        currentVehicleIds.add(entityId);

        // Update or create marker
        if (vehicleMarkers[entityId]) {
            // Update existing marker position
            vehicleMarkers[entityId].setLatLng([lat, lon]);
        } else {
            // Create new marker
            const icon = createMarkerIcon(routeId, vehicleType);
            const marker = L.marker([lat, lon], { icon: icon }).addTo(map);
            
            // Add popup with vehicle info
            marker.bindPopup(`
                <div class="popup-route">${vehicleType.label} Route ${routeId}</div>
                <div class="popup-info">
                    <strong>Position:</strong><br>
                    Lat: ${lat.toFixed(6)}<br>
                    Lon: ${lon.toFixed(6)}<br>
                    <strong>Last update:</strong> ${formatTime(timestamp)}
                </div>
            `);
            
            vehicleMarkers[entityId] = marker;
        }
    });

    // Remove markers for vehicles no longer in feed
    Object.keys(vehicleMarkers).forEach(entityId => {
        if (!currentVehicleIds.has(entityId)) {
            map.removeLayer(vehicleMarkers[entityId]);
            delete vehicleMarkers[entityId];
        }
    });

    // Update counts
    document.getElementById('bus-count').textContent = counts.bus;
    document.getElementById('tram-count').textContent = counts.tram;
    document.getElementById('trolley-count').textContent = counts.trolley;
    
    // Update last update time
    const now = new Date();
    document.getElementById('last-update').textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

// Fetch and parse GTFS data
async function fetchVehicleData() {
    try {
        console.log('Fetching vehicle data...');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Load protobuf schema
        const root = protobuf.parse(gtfsRealtimeProto).root;
        const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
        
        // Decode the protobuf message
        const message = FeedMessage.decode(new Uint8Array(arrayBuffer));
        const feed = FeedMessage.toObject(message, {
            longs: Number,
            enums: String,
            bytes: String
        });
        
        console.log(`Received ${feed.entity.length} entities`);
        
        // Extract vehicle positions
        const vehicles = [];
        feed.entity.forEach(entity => {
            if (entity.vehicle && entity.vehicle.position) {
                vehicles.push({
                    entityId: entity.id,
                    routeId: entity.vehicle.trip?.routeId || 'Unknown',
                    lat: entity.vehicle.position.latitude,
                    lon: entity.vehicle.position.longitude,
                    timestamp: entity.vehicle.timestamp || feed.header.timestamp
                });
            }
        });
        
        console.log(`Processed ${vehicles.length} vehicles`);
        updateVehicles(vehicles);
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        
        return true;
    } catch (error) {
        console.error('Error fetching vehicle data:', error);
        showError(`Failed to load vehicle data: ${error.message}`);
        
        // Hide loading screen even on error
        document.getElementById('loading').style.display = 'none';
        
        return false;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Countdown timer for next refresh
function startRefreshCountdown() {
    let seconds = REFRESH_INTERVAL / 1000;
    
    refreshCountdown = setInterval(() => {
        seconds--;
        document.getElementById('refresh-timer').textContent = seconds;
        
        if (seconds <= 0) {
            seconds = REFRESH_INTERVAL / 1000;
        }
    }, 1000);
}

// Initialize the application
async function init() {
    console.log('Initializing Sofia Transport Map...');
    
    // Initialize map
    initMap();
    
    // Fetch initial data
    await fetchVehicleData();
    
    // Set up auto-refresh
    updateInterval = setInterval(fetchVehicleData, REFRESH_INTERVAL);
    startRefreshCountdown();
    
    console.log('Application ready!');
}

// Start the app when page loads
window.addEventListener('load', init);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) clearInterval(updateInterval);
    if (refreshCountdown) clearInterval(refreshCountdown);
});
