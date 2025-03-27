# services/distance_service.py
import math

async def calculate_distance(coord1, coord2):
    """
    Calculate the distance between two coordinates using the Haversine formula
    Args:
        coord1 (dict): First coordinate with 'latitude' and 'longitude' keys
        coord2 (dict): Second coordinate with 'latitude' and 'longitude' keys
    Returns:
        float: Distance in kilometers
    """
    lat1 = coord1['latitude']
    lon1 = coord1['longitude']
    lat2 = coord2['latitude']
    lon2 = coord2['longitude']
    
    R = 6371  # Radius of the earth in km
    
    dLat = deg2rad(lat2 - lat1)
    dLon = deg2rad(lon2 - lon1)
    
    a = (math.sin(dLat/2) * math.sin(dLat/2) +
         math.cos(deg2rad(lat1)) * math.cos(deg2rad(lat2)) *
         math.sin(dLon/2) * math.sin(dLon/2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c  # Distance in km
    
    return distance

def deg2rad(deg):
    """
    Convert degrees to radians
    Args:
        deg (float): Angle in degrees
    Returns:
        float: Angle in radians
    """
    return deg * (math.pi / 180)

