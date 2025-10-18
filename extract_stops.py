import json
from collections import defaultdict

print("Extracting static stops data from vehicle positions...\n")

# Load the vehicle data
with open('sofia_vehicles_20251018_164105.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Collect all stop positions
# We'll average the positions for each stop from all vehicles that report it
stop_positions = defaultdict(lambda: {'lats': [], 'lons': [], 'routes': set()})

for vehicle in data['vehicles']:
    stop_id = vehicle.get('stop_id')
    if stop_id and stop_id != 'N/A':
        stop_positions[stop_id]['lats'].append(vehicle['latitude'])
        stop_positions[stop_id]['lons'].append(vehicle['longitude'])
        
        # Track which routes use this stop
        route_id = vehicle.get('route_id', '')
        if route_id:
            stop_positions[stop_id]['routes'].add(route_id)

# Calculate average positions for each stop
stops_data = {}
for stop_id, data in stop_positions.items():
    avg_lat = sum(data['lats']) / len(data['lats'])
    avg_lon = sum(data['lons']) / len(data['lons'])
    
    stops_data[stop_id] = {
        'stop_id': stop_id,
        'lat': round(avg_lat, 6),
        'lon': round(avg_lon, 6),
        'routes': sorted(list(data['routes'])),
        'num_observations': len(data['lats'])
    }

print(f"Found {len(stops_data)} unique stops\n")
print("Sample stops:")
print("=" * 70)

# Show first 5 stops
for i, (stop_id, stop_data) in enumerate(list(stops_data.items())[:5], 1):
    print(f"{i}. Stop {stop_id}")
    print(f"   Location: {stop_data['lat']}, {stop_data['lon']}")
    print(f"   Routes: {', '.join(stop_data['routes'][:5])}")
    print(f"   Observations: {stop_data['num_observations']}")
    print()

# Save to JSON
output = {
    'generated': '2025-10-18',
    'total_stops': len(stops_data),
    'stops': list(stops_data.values())
}

with open('stops_static.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("=" * 70)
print(f"✅ Saved {len(stops_data)} stops to: stops_static.json")
print("\nThis file contains:")
print("- Stop ID")
print("- Average GPS coordinates")
print("- Routes that use this stop")
print("- Number of observations (data quality indicator)")
