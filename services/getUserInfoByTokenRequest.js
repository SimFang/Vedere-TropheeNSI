import { Alert } from 'react-native';
import routes from "../constants/routes.json";

export const fetchUserInfo = async (idToken) => {
    const url = routes.serverUrl + routes.getUserInfo; // Replace with your endpoint to get user info

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`, // Include the ID token in the Authorization header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const userInfo = await response.json(); // Parse the response JSON
        return userInfo; // Return the user info
    } catch (error) {
        console.error('Error fetching user info:', error);
        Alert.alert('Error', error.message); // Show an alert in case of error
        return null; // Return null in case of an error
    }
};
