from google.transit import gtfs_realtime_pb2
import requests

# Sofia's GTFS Realtime vehicle positions feed
# Official URL from: https://urbandata.sofia.bg/en/dataset/gtfs-vehicle-positions
feed_url = "https://gtfs.sofiatraffic.bg/api/v1/vehicle-positions"

feed = gtfs_realtime_pb2.FeedMessage()

try:
    response = requests.get(feed_url, timeout=10)
    response.raise_for_status()
    
    feed.ParseFromString(response.content)
    
    print(f"Feed timestamp: {feed.header.timestamp}")
    print(f"Total entities: {len(feed.entity)}\n")
    
    for entity in feed.entity:
        if entity.HasField('vehicle'):
            v = entity.vehicle
            print(f"Route: {v.trip.route_id}, Lat: {v.position.latitude}, Lon: {v.position.longitude}, Time: {v.timestamp}")
            
except requests.exceptions.RequestException as e:
    print(f"Error fetching GTFS feed: {e}")
except Exception as e:
    print(f"Error parsing GTFS data: {e}")
    print(f"\nNote: Make sure the feed_url is correct. You may need to:")
    print("1. Visit https://urbandata.sofia.bg/dataset/gtfs-vehicle-positions")
    print("2. Get the actual resource ID or direct download link")
    print("3. Update the feed_url in this script")
