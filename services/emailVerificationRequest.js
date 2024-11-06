import { Alert } from 'react-native';
import routes from "../constants/routes.json"; // Assuming you have the routes setup in a JSON file

export const sendEmailVerificationAPIRequest = async (email) => {
    const url = routes.serverUrl + routes.emailVerificationEndpoint; // Construct the full URL for the API endpoint
    console.log('Request URL:', url);

    try {
        // Send a POST request to the backend API to trigger email verification
        const response = await fetch(url, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify({ email }), // Send the email as the body of the request
        });

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Failed to send verification email');
        }

        // Parse the response JSON
        const data = await response.json();
        console.log('Response Data:', data);

        // Success message or any other data from the response
        Alert.alert('Success', 'Verification email has been sent successfully.');
        return data;
    } catch (error) {
        console.error('Email verification error:', error);
        Alert.alert('Error', error.message); // Show an alert in case of error
        return error; // Return the error object or message for further handling
    }
};
