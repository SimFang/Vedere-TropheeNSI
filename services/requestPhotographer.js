// services/photographer-service/api/requestPhotographer.js
import routes from "../constants/routes.json";

const API_URL = routes.serverUrl + routes.requestPhotographerEndpoint; // Replace with your backend API URL

const requestPhotographer = async (photographerData) => {
    try {

        const response = await fetch(API_URL, {
            method: 'POST',
            body: photographerData, // Use the FormData directly without setting Content-Type
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error requesting photographer:', error);
        throw new Error('Could not send request. Please try again later.');
    }
};

export default requestPhotographer;
