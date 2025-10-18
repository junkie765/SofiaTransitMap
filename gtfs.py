from google.transit import gtfs_realtime_pb2
import requests
import json
from datetime import datetime

# Sofia's GTFS Realtime vehicle positions feed
# Official URL from: https://urbandata.sofia.bg/en/dataset/gtfs-vehicle-positions
feed_url = "https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions"

feed = gtfs_realtime_pb2.FeedMessage()

def format_timestamp(ts):
    """Convert Unix timestamp to readable datetime"""
    if ts:
        return datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    return "N/A"

def get_vehicle_type(route_id):
    """Determine vehicle type from route ID"""
    if route_id.startswith('TM'):
        return 'Tram 🚋'
    elif route_id.startswith('TB'):
        return 'Trolleybus 🚎'
    elif route_id.startswith('A'):
        return 'Bus 🚌'
    return 'Unknown 🚐'

try:
    print("Fetching GTFS Realtime data from Sofia Traffic...\n")
    response = requests.get(feed_url, timeout=10)
    response.raise_for_status()
    
    feed.ParseFromString(response.content)
    
    print("=" * 80)
    print(f"FEED HEADER INFORMATION")
    print("=" * 80)
    print(f"GTFS Realtime Version: {feed.header.gtfs_realtime_version}")
    print(f"Feed Timestamp: {format_timestamp(feed.header.timestamp)}")
    print(f"Incrementality: {feed.header.incrementality}")
    print(f"Total Entities: {len(feed.entity)}")
    print("=" * 80)
    print()
    
    # Collect all vehicles
    vehicles_data = []
    vehicle_counts = {'bus': 0, 'tram': 0, 'trolley': 0, 'unknown': 0}
    
    for idx, entity in enumerate(feed.entity, 1):
        if entity.HasField('vehicle'):
            v = entity.vehicle
            
            # Extract all available data
            vehicle_info = {
                'entity_id': entity.id,
                'route_id': v.trip.route_id if v.HasField('trip') else 'N/A',
                'trip_id': v.trip.trip_id if v.HasField('trip') and v.trip.HasField('trip_id') else 'N/A',
                'direction_id': v.trip.direction_id if v.HasField('trip') and v.trip.HasField('direction_id') else 'N/A',
                'start_time': v.trip.start_time if v.HasField('trip') and v.trip.HasField('start_time') else 'N/A',
                'start_date': v.trip.start_date if v.HasField('trip') and v.trip.HasField('start_date') else 'N/A',
                'vehicle_id': v.vehicle.id if v.HasField('vehicle') and v.vehicle.HasField('id') else 'N/A',
                'vehicle_label': v.vehicle.label if v.HasField('vehicle') and v.vehicle.HasField('label') else 'N/A',
                'license_plate': v.vehicle.license_plate if v.HasField('vehicle') and v.vehicle.HasField('license_plate') else 'N/A',
                'latitude': v.position.latitude if v.HasField('position') else 'N/A',
                'longitude': v.position.longitude if v.HasField('position') else 'N/A',
                'bearing': v.position.bearing if v.HasField('position') and v.position.HasField('bearing') else 'N/A',
                'speed': v.position.speed if v.HasField('position') and v.position.HasField('speed') else 'N/A',
                'odometer': v.position.odometer if v.HasField('position') and v.position.HasField('odometer') else 'N/A',
                'current_stop_sequence': v.current_stop_sequence if v.HasField('current_stop_sequence') else 'N/A',
                'stop_id': v.stop_id if v.HasField('stop_id') else 'N/A',
                'current_status': v.current_status if v.HasField('current_status') else 'N/A',
                'timestamp': format_timestamp(v.timestamp) if v.HasField('timestamp') else 'N/A',
                'congestion_level': v.congestion_level if v.HasField('congestion_level') else 'N/A',
                'occupancy_status': v.occupancy_status if v.HasField('occupancy_status') else 'N/A',
            }
            
            vehicles_data.append(vehicle_info)
            
            # Count by type
            route_id = vehicle_info['route_id']
            if route_id.startswith('TM'):
                vehicle_counts['tram'] += 1
            elif route_id.startswith('TB'):
                vehicle_counts['trolley'] += 1
            elif route_id.startswith('A'):
                vehicle_counts['bus'] += 1
            else:
                vehicle_counts['unknown'] += 1
    
    # Print summary
    print(f"VEHICLE TYPE SUMMARY")
    print("-" * 80)
    print(f"🚌 Buses:        {vehicle_counts['bus']}")
    print(f"🚋 Trams:        {vehicle_counts['tram']}")
    print(f"🚎 Trolleybuses: {vehicle_counts['trolley']}")
    print(f"🚐 Unknown:      {vehicle_counts['unknown']}")
    print(f"📊 TOTAL:        {len(vehicles_data)}")
    print("=" * 80)
    print()
    
    # Print detailed information for first 5 vehicles
    print(f"DETAILED VEHICLE INFORMATION (First 5 vehicles)")
    print("=" * 80)
    for i, v_data in enumerate(vehicles_data[:5], 1):
        print(f"\n[Vehicle {i}] {get_vehicle_type(v_data['route_id'])}")
        print("-" * 80)
        for key, value in v_data.items():
            print(f"  {key:25s}: {value}")
    
    # Option to save all data to JSON file
    save_option = input("\n\nDo you want to save all vehicle data to a JSON file? (y/n): ")
    if save_option.lower() == 'y':
        filename = f"sofia_vehicles_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'feed_timestamp': format_timestamp(feed.header.timestamp),
                'total_vehicles': len(vehicles_data),
                'vehicle_counts': vehicle_counts,
                'vehicles': vehicles_data
            }, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Data saved to: {filename}")
    
    print("\n" + "=" * 80)
    print("Done!")
    print("=" * 80)
            
except requests.exceptions.RequestException as e:
    print(f"❌ Error fetching GTFS feed: {e}")
except Exception as e:
    print(f"❌ Error parsing GTFS data: {e}")
    print(f"\nNote: Make sure the feed_url is correct. You may need to:")
    print("1. Visit https://urbandata.sofia.bg/dataset/gtfs-vehicle-positions")
    print("2. Get the actual resource ID or direct download link")
    print("3. Update the feed_url in this script")
