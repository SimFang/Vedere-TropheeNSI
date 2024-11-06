import routes from "../../constants/routes.json"
export const getCoordinates = async (address) => {
    try {
      const response = await fetch(routes.serverUrl + routes.getcoordinatesfromadress, { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch coordinates');
      }
  
      const data = await response.json();
      return data.coordinates; // Return the coordinates
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error; // Rethrow the error for handling in the calling code
    }
  };