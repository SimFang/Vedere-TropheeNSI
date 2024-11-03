// config/firebase.js
const admin = require('firebase-admin');
require('dotenv').config(); // Ensure environment variables are loaded

let isInitialized = false; // Flag to check if Firebase has been initialized

const initializeFirebase = () => {
    if (!isInitialized) {
        const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS); // Use environment variable for service account path

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL, // Your Firebase database URL
            storageBucket : process.env.FIREBASE_STORAGE_BUCKET_URL,
            databaseURL : process.env.FIREASE_REALTIMEDATABASE_URL
        });

        isInitialized = true; // Set the flag to true after initialization
    }
};

// Call the initialization function
initializeFirebase();

// Export the Firestore database and Firebase authentication
const db = admin.firestore(); // Firestore database
const auth = admin.auth(); // Firebase authentication
const dbRealtime = admin.database();   // Realtime Database instance
const bucket = admin.storage().bucket();


module.exports = { db, auth, dbRealtime, bucket };
