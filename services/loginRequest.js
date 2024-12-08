import { Alert } from 'react-native';
import routes from "../constants/routes.json";
import { getAuth, signInWithCustomToken } from "firebase/auth"; // Import Firebase Auth functions
import { auth } from "../services/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const loginAPIRequest = async (email, password) => {
    const url = routes.serverUrl + routes.loginEndpoint;
    console.log(url);

    try {
        // Send a POST request to the backend API for login
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log(data);

        const customToken = data.token;

        // Sign in with the custom token using Firebase
        const userCredential = await signInWithCustomToken(auth, customToken);
        const idToken = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken; // Get the refresh token

        console.log('ID Token:', idToken);
        console.log('Refresh Token:', refreshToken);

        // Store the ID token and refresh token in AsyncStorage
        await AsyncStorage.setItem('userToken', idToken);
        await AsyncStorage.setItem('refreshToken', refreshToken); // Store refresh token

        console.log('Successfully pushed tokens to AsyncStorage');

        return { token: idToken };
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Login Error', error.message);
        return null;
    }
};