import json
import re
from collections import defaultdict

# Known mappings
KNOWN_MAPPINGS = {
    "A77": "67",  # Confirmed by user
}

print("Analyzing vehicle data to discover route mappings...\n")

# Load the vehicle data
with open('sofia_vehicles_20251018_164105.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Collect all unique route IDs
route_ids = set()
for vehicle in data['vehicles']:
    route_ids.add(vehicle['route_id'])

route_ids = sorted(route_ids)

print(f"Found {len(route_ids)} unique routes")
print("=" * 70)

# Guess the mapping based on patterns
guessed_mapping = {}

for route_id in route_ids:
    if route_id in KNOWN_MAPPINGS:
        route_number = KNOWN_MAPPINGS[route_id]
        guessed_mapping[route_id] = {
            'number': route_number,
            'confidence': 'CONFIRMED',
            'method': 'User confirmed'
        }
    else:
        # Try to guess
        # Pattern: A77 -> 67, so maybe A = bus with different internal ID?
        # Let's just remove prefix for now and mark as GUESS
        number_part = re.sub(r'^(TM|TB|A)', '', route_id)
        
        # Determine vehicle type
        if route_id.startswith('TM'):
            vtype = '🚋 Tram'
        elif route_id.startswith('TB'):
            vtype = '🚎 Trolleybus'
        elif route_id.startswith('A'):
            vtype = '🚌 Bus'
        else:
            vtype = '🚐 Unknown'
        
        guessed_mapping[route_id] = {
            'number': number_part,
            'confidence': 'GUESS',
            'method': 'Removed prefix',
            'type': vtype
        }

# Print the mappings
print("\nRoute ID -> Route Number (What passengers see)")
print("=" * 70)
print(f"{'Route ID':<15} {'Number':<10} {'Type':<15} {'Confidence'}")
print("-" * 70)

for route_id in sorted(guessed_mapping.keys()):
    info = guessed_mapping[route_id]
    vtype = info.get('type', '')
    print(f"{route_id:<15} {info['number']:<10} {vtype:<15} {info['confidence']}")

# Save to JSON
output = {
    'note': 'Route mapping from route_id to passenger-visible route numbers',
    'known_mappings': KNOWN_MAPPINGS,
    'all_mappings': {k: v['number'] for k, v in guessed_mapping.items()}
}

with open('route_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("\n" + "=" * 70)
print("✅ Saved route mapping to: route_mapping.json")
print("\n⚠️  WARNING: Most of these are GUESSES!")
print("   Only A77 -> 67 is confirmed.")
print("\n💡 To get the real mappings, we need Sofia's GTFS static data")
print("   Try visiting: https://sofiatraffic.bg/ or https://sofia.bg/opendata")
print("=" * 70)
