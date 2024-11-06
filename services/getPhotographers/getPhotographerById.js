import routes from "../../constants/routes.json"
// Function to fetch photographer status
export const fetchPhotographerById = async (photographerId) => {
    try {
        const response = await fetch(routes.serverUrl+routes.getPhotographerById, { // Replace with your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photographerId }), // Sending photographerId in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Photographer data:', data);
        return data; // Return the response data
    } catch (error) {
        console.error('Error fetching photographer status:', error);
        throw error; // Rethrow error for further handling if needed
    }
};
