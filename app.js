// Sofia Public Transport Real-time Map
// GTFS Realtime vehicle tracking

let map;
let vehicleMarkers = {};
let updateInterval;
let refreshCountdown;
const REFRESH_INTERVAL = 30000; // 30 seconds
// Use CORS proxy to access the API from GitHub Pages
const API_URL = 'https://corsproxy.io/?' + encodeURIComponent('https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions');

// GTFS Realtime protobuf definition (Complete GTFS-RT spec)
const gtfsRealtimeProto = `
syntax = "proto2";
package transit_realtime;

message FeedMessage {
  required FeedHeader header = 1;
  repeated FeedEntity entity = 2;
  extensions 1000 to 1999;
}

message FeedHeader {
  required string gtfs_realtime_version = 1;
  enum Incrementality {
    FULL_DATASET = 0;
    DIFFERENTIAL = 1;
  }
  optional Incrementality incrementality = 2 [default = FULL_DATASET];
  optional uint64 timestamp = 3;
  extensions 1000 to 1999;
}

message FeedEntity {
  required string id = 1;
  optional bool is_deleted = 2 [default = false];
  optional TripUpdate trip_update = 3;
  optional VehiclePosition vehicle = 4;
  optional Alert alert = 5;
  extensions 1000 to 1999;
}

message TripUpdate {
  optional TripDescriptor trip = 1;
  optional VehicleDescriptor vehicle = 3;
  repeated StopTimeUpdate stop_time_update = 2;
  optional uint64 timestamp = 4;
  optional int32 delay = 5;
  extensions 1000 to 1999;
}

message StopTimeUpdate {
  optional uint32 stop_sequence = 1;
  optional string stop_id = 4;
  message StopTimeEvent {
    optional int32 delay = 1;
    optional int64 time = 2;
    optional int32 uncertainty = 3;
    extensions 1000 to 1999;
  }
  optional StopTimeEvent arrival = 2;
  optional StopTimeEvent departure = 3;
  enum ScheduleRelationship {
    SCHEDULED = 0;
    SKIPPED = 1;
    NO_DATA = 2;
  }
  optional ScheduleRelationship schedule_relationship = 5 [default = SCHEDULED];
  extensions 1000 to 1999;
}

message VehiclePosition {
  optional TripDescriptor trip = 1;
  optional VehicleDescriptor vehicle = 8;
  optional Position position = 2;
  optional uint32 current_stop_sequence = 3;
  optional string stop_id = 7;
  enum VehicleStopStatus {
    INCOMING_AT = 0;
    STOPPED_AT = 1;
    IN_TRANSIT_TO = 2;
  }
  optional VehicleStopStatus current_status = 4 [default = IN_TRANSIT_TO];
  optional uint64 timestamp = 5;
  enum CongestionLevel {
    UNKNOWN_CONGESTION_LEVEL = 0;
    RUNNING_SMOOTHLY = 1;
    STOP_AND_GO = 2;
    CONGESTION = 3;
    SEVERE_CONGESTION = 4;
  }
  optional CongestionLevel congestion_level = 6;
  enum OccupancyStatus {
    EMPTY = 0;
    MANY_SEATS_AVAILABLE = 1;
    FEW_SEATS_AVAILABLE = 2;
    STANDING_ROOM_ONLY = 3;
    CRUSHED_STANDING_ROOM_ONLY = 4;
    FULL = 5;
    NOT_ACCEPTING_PASSENGERS = 6;
  }
  optional OccupancyStatus occupancy_status = 9;
  extensions 1000 to 1999;
}

message Alert {
  repeated TimeRange active_period = 1;
  repeated EntitySelector informed_entity = 5;
  enum Cause {
    UNKNOWN_CAUSE = 1;
    OTHER_CAUSE = 2;
    TECHNICAL_PROBLEM = 3;
    STRIKE = 4;
    DEMONSTRATION = 5;
    ACCIDENT = 6;
    HOLIDAY = 7;
    WEATHER = 8;
    MAINTENANCE = 9;
    CONSTRUCTION = 10;
    POLICE_ACTIVITY = 11;
    MEDICAL_EMERGENCY = 12;
  }
  optional Cause cause = 6 [default = UNKNOWN_CAUSE];
  enum Effect {
    NO_SERVICE = 1;
    REDUCED_SERVICE = 2;
    SIGNIFICANT_DELAYS = 3;
    DETOUR = 4;
    ADDITIONAL_SERVICE = 5;
    MODIFIED_SERVICE = 6;
    OTHER_EFFECT = 7;
    UNKNOWN_EFFECT = 8;
    STOP_MOVED = 9;
  }
  optional Effect effect = 7 [default = UNKNOWN_EFFECT];
  optional TranslatedString url = 8;
  optional TranslatedString header_text = 10;
  optional TranslatedString description_text = 11;
  extensions 1000 to 1999;
}

message TimeRange {
  optional uint64 start = 1;
  optional uint64 end = 2;
  extensions 1000 to 1999;
}

message Position {
  required float latitude = 1;
  required float longitude = 2;
  optional float bearing = 3;
  optional double odometer = 4;
  optional float speed = 5;
  extensions 1000 to 1999;
}

message TripDescriptor {
  optional string trip_id = 1;
  optional string route_id = 5;
  optional uint32 direction_id = 6;
  optional string start_time = 2;
  optional string start_date = 3;
  enum ScheduleRelationship {
    SCHEDULED = 0;
    ADDED = 1;
    UNSCHEDULED = 2;
    CANCELED = 3;
  }
  optional ScheduleRelationship schedule_relationship = 4;
  extensions 1000 to 1999;
}

message VehicleDescriptor {
  optional string id = 1;
  optional string label = 2;
  optional string license_plate = 3;
  extensions 1000 to 1999;
}

message EntitySelector {
  optional string agency_id = 1;
  optional string route_id = 2;
  optional uint32 route_type = 3;
  optional TripDescriptor trip = 4;
  optional string stop_id = 5;
  extensions 1000 to 1999;
}

message TranslatedString {
  message Translation {
    required string text = 1;
    optional string language = 2;
    extensions 1000 to 1999;
  }
  repeated Translation translation = 1;
  extensions 1000 to 1999;
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
        
        // Debug: Log first entity structure
        if (feed.entity.length > 0) {
            console.log('Sample entity:', JSON.stringify(feed.entity[0], null, 2));
        }
        
        // Extract vehicle positions
        const vehicles = [];
        feed.entity.forEach((entity, index) => {
            // Debug logging for first few entities
            if (index < 3) {
                console.log(`Entity ${index}:`, {
                    hasVehicle: !!entity.vehicle,
                    hasPosition: !!(entity.vehicle && entity.vehicle.position),
                    entityKeys: Object.keys(entity)
                });
            }
            
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
