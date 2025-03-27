# services/geocode_service.py
import os
from dotenv import load_dotenv
import requests
import logging

# Load environment variables
load_dotenv()

# Get API key from environment variables
api_key = os.getenv('HERE_APIKEY')

async def get_coordinate_from_address(location):
    """
    Convert an address to coordinates using HERE Geocode API
    Args:
        location (str): The address to geocode
    Returns:
        dict: Dictionary containing latitude and longitude
    """
    logging.info(f"The given location is: {location}")
    
    try:
        # Construct the URL for the HERE Geocode API request
        url = f"https://geocode.search.hereapi.com/v1/geocode?q={requests.utils.quote(location)}&apiKey={api_key}"
        
        # Make the request to the HERE API
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        # Parse JSON response
        data = response.json()
        
        # Check if the response contains results
        if data.get('items') and len(data['items']) > 0:
            position = data['items'][0]['position']
            return {
                'latitude': position['lat'],
                'longitude': position['lng']
            }
        else:
            raise Exception('No coordinates found for the given location.')
            
    except requests.exceptions.RequestException as e:
        logging.error(f'Error: {str(e)}')
        return None
    except Exception as e:
        logging.error(f'Error: {str(e)}')
        return None

# Example usage (if running as standalone script)
if __name__ == "__main__":
    import asyncio
    
    async def test():
        result = await get_coordinate_from_address("1600 Pennsylvania Ave NW, Washington, DC")
        print(result)
    
    asyncio.run(test())