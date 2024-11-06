import { Alert } from 'react-native';
import routes from "../constants/routes.json";

export const signupAPIRequest = async (email, password, name, surname) => {
    const url = routes.serverUrl + routes.signupEndpoint; // Ensure correct URL
    console.log('API URL:', url);

    try {
        const payload = { name, surname, email, password }; // Create the payload
        console.log('Request Body:', payload); // Log the payload

        const response = await fetch(url, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify(payload), // Convert the request body to JSON
        });

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json(); // Parse the error response
            console.error('Error response:', errorData); // Log the full error response
            throw new Error(errorData.error || 'Sign up failed'); // Use error from response
        }

        const data = await response.json(); // Parse the response JSON
        console.log('Response Data:', data); // Log the response data

        return data;
    } catch (error) {
        console.error('Sign up error:', error);
        Alert.alert('Sign up Error', error.message); // Show an alert in case of error
        return null; // Return null or an appropriate error object
    }
};
