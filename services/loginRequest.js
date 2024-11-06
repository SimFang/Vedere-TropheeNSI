import { Alert } from 'react-native';
import routes from "../constants/routes.json";
import { getAuth, signInWithCustomToken } from "firebase/auth"; // Import Firebase Auth functions
import {auth} from "../services/firebaseConfig"
export const loginAPIRequest = async (email, password) => {
    const url = routes.serverUrl + routes.loginEndpoint;
    console.log(url);

    try {
        // Send a POST request to the backend API for login
        const response = await fetch(url, {
            method: 'POST', // Specify the request method
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify({ email, password }), // Convert the request body to JSON
        });

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Login failed'); // Throw an error if the response is not OK
        }

        const data = await response.json(); // Parse the response JSON
        console.log(data); // Log the data received from the backend

        // Extract the custom token from the response
        const customToken = data.token;

        console.log("now let's exchange with id token")
        // Sign in with the custom token using Firebase
        const userCredential = await signInWithCustomToken(auth, customToken);
        const idToken = await userCredential.user.getIdToken(); // Retrieve the ID token

        console.log('ID Token:', idToken); // Log the ID token
        return {token : idToken}; // Return the ID token for further use
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Login Error', error.message); // Show an alert in case of error
        return null; // Return null in case of an error
    }
};
