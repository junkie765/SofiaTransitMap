import requests
import csv
import io
import json

# Sofia GTFS Static data URLs
# These contain the route mappings
GTFS_STATIC_URL = "https://gtfs.sofiatraffic.bg/static/google_transit.zip"

print("Fetching Sofia GTFS static data to find route mappings...")
print("This data maps route_id (A77) to route_short_name (67)\n")

try:
    # Try to get the routes.txt directly if available
    routes_url = "https://gtfs.sofiatraffic.bg/static/routes.txt"
    
    print(f"Attempting to fetch: {routes_url}")
    response = requests.get(routes_url, timeout=10)
    
    if response.status_code == 200:
        print("✅ Successfully fetched routes.txt\n")
        
        # Parse CSV
        csv_data = csv.DictReader(io.StringIO(response.text))
        
        routes = {}
        print("Route ID -> Route Number Mapping")
        print("=" * 60)
        
        for row in csv_data:
            route_id = row.get('route_id', '')
            route_short_name = row.get('route_short_name', '')
            route_long_name = row.get('route_long_name', '')
            route_type = row.get('route_type', '')
            
            # Determine vehicle type
            if route_type == '0':
                vehicle_type = '🚋 Tram'
            elif route_type == '3':
                vehicle_type = '🚌 Bus'
            elif route_type == '11':
                vehicle_type = '🚎 Trolleybus'
            else:
                vehicle_type = f'Type {route_type}'
            
            routes[route_id] = {
                'short_name': route_short_name,
                'long_name': route_long_name,
                'type': vehicle_type,
                'route_type': route_type
            }
            
            print(f"{route_id:10s} -> {route_short_name:6s} {vehicle_type:15s} {route_long_name}")
        
        # Save to JSON for later use
        with open('route_mapping.json', 'w', encoding='utf-8') as f:
            json.dump(routes, f, indent=2, ensure_ascii=False)
        
        print("\n" + "=" * 60)
        print(f"✅ Saved {len(routes)} route mappings to: route_mapping.json")
        
        # Check our example
        if 'A77' in routes:
            print(f"\n✅ Confirmed: A77 -> {routes['A77']['short_name']}")
        
    else:
        print(f"❌ Failed to fetch routes.txt (Status: {response.status_code})")
        print("\nTrying to download the full GTFS zip file...")
        
        # Download the zip file
        response = requests.get(GTFS_STATIC_URL, timeout=30)
        if response.status_code == 200:
            print("✅ Downloaded GTFS zip file")
            
            # Save it
            with open('google_transit.zip', 'wb') as f:
                f.write(response.content)
            
            print("✅ Saved to: google_transit.zip")
            print("\nPlease extract the zip file and look for routes.txt")
            print("It will contain the mapping between route_id and route_short_name")
        else:
            print(f"❌ Failed to download GTFS data (Status: {response.status_code})")

except requests.exceptions.RequestException as e:
    print(f"❌ Network error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Note: The route_short_name is what passengers see on the vehicle")
print("Example: route_id 'A77' has route_short_name '67'")
print("=" * 60)
