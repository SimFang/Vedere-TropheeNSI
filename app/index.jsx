import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../store/authSlice'; // Import the action
import StartingAnimation from '../components/navigation/startingAnimation';
import checkLoginStatus from '../helpers/auth/checkLoginStatus';
import { resetAuthState } from '../store/authSlice';    
import { resetChatState } from '../store/chatSlice';  
import { resetPhotographerState } from '../store/photographerSlice';

// redirect and meanwhile display the loading page 
export default function Home() {
  const animationDuration = 3;
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  // Load the language info and check user authentication
  useEffect(() => {
    const loadLanguage = async () => {
      // Assuming you have a method to get the stored language (from AsyncStorage, etc.)
      const storedLanguage = await getStoredLanguage(); // Implement this function
      dispatch(setLanguage(storedLanguage)); // Update language in the Redux store
    };

    loadLanguage();

    setTimeout(async () => {
      const isAuthenticated = await checkLoginStatus(dispatch, router); // Check authentication status
    
      if (!isAuthenticated) {
        // If the user is not authenticated, reset states and redirect to /auth
        dispatch(resetAuthState());
        dispatch(resetChatState());
        dispatch(resetPhotographerState());
        console.log("User is not authenticated. Redirecting to /auth...");
        router.replace("/auth");
      }
    }, animationDuration * 1000);

  }, [authState.isAuthenticated, authState.user]); // Add dependencies to avoid warnings

  return (
    <View>
      <StartingAnimation />
    </View>
  );
}

// Mock function to simulate getting the stored language
const getStoredLanguage = async () => {
  // Replace with your logic to fetch stored language, e.g. from AsyncStorage
  return 'en'; // Default to English or fetch the stored language
};
