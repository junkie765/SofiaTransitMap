import requests
import json

print("Searching for Sofia GTFS stops data...\n")

# Try different endpoints for stops
urls_to_try = [
    "https://gtfs.sofiatraffic.bg/api/v1/stops",
    "https://gtfs.sofiatraffic.bg/stops",
    "https://gtfs.sofiatraffic.bg/static/stops.txt",
    "https://sofiatraffic.bg/static/gtfs/stops.txt",
]

for url in urls_to_try:
    try:
        print(f"Trying: {url}")
        response = requests.get(url, timeout=10)
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS!")
            print(f"  Content-Type: {response.headers.get('Content-Type', 'unknown')}")
            print(f"  Content length: {len(response.content)} bytes")
            
            # Try to parse as JSON
            try:
                data = response.json()
                print(f"  JSON data preview:")
                print(json.dumps(data[:2] if isinstance(data, list) else data, indent=2)[:500])
                
                # Save to file
                with open('stops_data.json', 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"\n  ✅ Saved to stops_data.json")
                break
                
            except:
                # Might be CSV/text
                preview = response.text[:500]
                print(f"  Text preview:\n{preview}")
                
                with open('stops_data.txt', 'w', encoding='utf-8') as f:
                    f.write(response.text)
                print(f"\n  ✅ Saved to stops_data.txt")
                break
            
        print()
            
    except Exception as e:
        print(f"  ❌ Error: {e}\n")

print("\n" + "=" * 70)
print("Note: We already have stop_id in the vehicle position data")
print("We can extract stops from the current vehicle data!")
print("=" * 70)
