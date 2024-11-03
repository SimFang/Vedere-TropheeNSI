const axios = require('axios');

exports.getCoordinateFromAdress = async(location) => {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data.length > 0) {
            const { lat: latitude, lon: longitude } = data[0];
            return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error(`Error fetching coordinates: ${error.message}`);
        throw error;
    }
}