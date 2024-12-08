const axios = require('axios');
require('dotenv').config();  
const apiKey = process.env.HERE_APIKEY;

exports.getCoordinateFromAdress = async(location) => {
    console.log("the given location is : "+location)
    try {
        // Construct the URL for the HERE Geocode API request
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${apiKey}`;

        // Make the request to the HERE API using axios
        const response = await axios.get(url);

        // Check if the response contains results
        if (response.data.items && response.data.items.length > 0) {
            const { lat, lng } = response.data.items[0].position; 
            return { latitude : lat, longitude : lng };
        } else {
            throw new Error('No coordinates found for the given location.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// exports.getCoordinateFromAdress = async(location) => {
//     const encodedLocation = encodeURIComponent(location);
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;

//     try {
//         const response = await axios.get(url);
//         const data = response.data;

//         if (data && data.length > 0) {
//             const { lat: latitude, lon: longitude } = data[0];
//             return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
//         } else {
//             throw new Error('Location not found');
//         }
//     } catch (error) {
//         console.error(`Error fetching coordinates: ${error.message}`);
//         throw error;
//     }
// }