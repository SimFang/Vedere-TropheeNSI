const axios = require('axios');
require('dotenv').config();  
const apiKey = process.env.HERE_APIKEY;

getCoordinateFromAdress = async(location) => {
    console.log("the given location is : "+location)
    try {
        // Construct the URL for the HERE Geocode API request
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(location)}&apiKey=${apiKey}`;

        // Make the request to the HERE API using axios
        const response = await axios.get(url);

        // Check if the response contains results
        if (response.data.items && response.data.items.length > 0) {
            const { latitude, longitude } = response.data.items[0].position; // Get the coordinates (latitude and longitude)
            console.log(response.data.items[0].position)
        } else {
            throw new Error('No coordinates found for the given location.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}


