import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { setToken, loginSuccess } from '../../store/authSlice';

const checkLoginStatus = async (dispatch, router) => {
    const token = await AsyncStorage.getItem('userToken');
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp > currentTime) {
          // Token is valid
          dispatch(setToken(token));
          dispatch(loginSuccess());
          router.replace("/home"); // Redirect to home
          return true; // Indicate the user is authenticated
        } else {
          // Token is expired
          await AsyncStorage.setItem('userToken', ""); // Clear the invalid token
          console.log("Token has expired.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found.");
    }
  
    return false; // Indicate the user is not authenticated
  };

export default checkLoginStatus;