// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_7xVbtED7z42tPQ3Phh9H2XB59PMvUxg",
  authDomain: "vedere-618d1.firebaseapp.com",
  projectId: "vedere-618d1",
  storageBucket: "vedere-618d1.appspot.com",
  messagingSenderId: "989348591610",
  appId: "1:989348591610:web:74231e8171ebc8fa131643",
  measurementId: "G-7X33HSS3DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth }; // Export both the app and auth instances
