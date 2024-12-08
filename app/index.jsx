import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../store/authSlice'; // Import the action
import StartingAnimation from '../components/navigation/startingAnimation';

// redirect and meanwhile display the loading page 
export default function Home() {
  const animationDuration = 0;
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

    setTimeout(() => {
      if (authState.isAuthenticated && authState.token) {
        console.log("User is already logged in");
        router.replace("/home");
      } else {
        router.replace("/auth"); //MODIFY IT FOR /AUTH
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
