import {auth} from "../services/firebaseConfig"
/**
 * Retrieve the ID token of the currently authenticated user.
 * @returns {Promise<string|null>} The ID token if the user is authenticated, or null if not.
 */
const getIdToken = async () => {
  try {
    const user = auth.currentUser; // Get the currently authenticated user
    if (user) {
      const idToken = await user.getIdToken(); // Retrieve the ID token
      return idToken; // Return the ID token
    } else {
      console.warn('No user is currently authenticated.');
      return null; // Return null if no user is authenticated
    }
  } catch (error) {
    console.error('Error retrieving ID token:', error);
    throw new Error('Unable to retrieve ID token.'); // Throw an error if there's an issue
  }
};

export default getIdToken; // Export the function for use in other parts of your app
