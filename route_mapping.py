# Manual Route Mapping for Sofia Public Transport
# Based on: A77 = Bus 67
# This is a starter mapping - we'll build it as we discover more routes

ROUTE_MAPPING = {
    # Buses (A prefix)
    "A77": "67",
    "A91": "91",
    "A12": "12",
    "A61": "61",
    "A72": "72",
    "A84": "84",
    "A94": "94",
    
    # Trams (TM prefix)
    "TM1": "1",
    "TM3": "3",
    "TM5": "5",
    "TM6": "6",
    "TM7": "7",
    "TM8": "8",
    "TM10": "10",
    "TM11": "11",
    "TM12": "12",
    "TM18": "18",
    "TM19": "19",
    "TM20": "20",
    "TM22": "22",
    "TM23": "23",
    
    # Trolleybuses (TB prefix)
    "TB1": "1",
    "TB2": "2",
    "TB3": "3",
    "TB4": "4",
    "TB5": "5",
    "TB6": "6",
    "TB7": "7",
    "TB8": "8",
    "TB9": "9",
    "TB11": "11",
}

def get_route_number(route_id):
    """
    Get the passenger-visible route number from the route_id
    Falls back to removing prefix if not in mapping
    """
    if route_id in ROUTE_MAPPING:
        return ROUTE_MAPPING[route_id]
    
    # Fallback: strip prefix
    import re
    return re.sub(r'^(TM|TB|A)', '', route_id)

# Export for use in other scripts
if __name__ == "__main__":
    import json
    
    print("Route Mapping Dictionary:")
    print("=" * 60)
    for route_id, route_number in sorted(ROUTE_MAPPING.items()):
        print(f"{route_id:10s} -> {route_number}")
    
    # Save to JSON
    with open('route_mapping.json', 'w') as f:
        json.dump(ROUTE_MAPPING, f, indent=2)
    
    print("\n✅ Saved to route_mapping.json")
