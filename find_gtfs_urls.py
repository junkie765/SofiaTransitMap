import requests

print("Searching for Sofia GTFS static data URLs...\n")

# Try various possible URLs
urls_to_try = [
    "https://gtfs.sofiatraffic.bg/routes",
    "https://gtfs.sofiatraffic.bg/static/routes",
    "https://gtfs.sofiatraffic.bg/v1/routes",
    "https://gtfs.sofiatraffic.bg/api/v1/routes",
    "https://gtfs.sofiatraffic.bg/gtfs/routes.txt",
    "https://gtfs.sofiatraffic.bg/gtfs/google_transit.zip",
    "https://sofiatraffic.bg/static/gtfs/routes.txt",
    "https://data.sofia.bg/api/action/package_show?id=gtfs",
    "https://opendata.sofia.bg/api/action/package_show?id=gtfs",
]

for url in urls_to_try:
    try:
        print(f"Trying: {url}")
        response = requests.get(url, timeout=5, allow_redirects=True)
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS! Content-Type: {response.headers.get('Content-Type', 'unknown')}")
            print(f"  Content length: {len(response.content)} bytes")
            
            # Try to peek at content
            if 'json' in response.headers.get('Content-Type', ''):
                print(f"  Preview: {response.text[:200]}")
            
            print()
        else:
            print()
            
    except Exception as e:
        print(f"  ❌ Error: {e}\n")

print("\n" + "=" * 70)
print("Alternative: Check Sofia's open data portal")
print("https://opendata.sofia.bg/")
print("https://data.sofia.bg/")
print("=" * 70)
