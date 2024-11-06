// getUserLocation.js
import * as Location from 'expo-location';

export const getUserLocation = async () => {
  // Check for location permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return null; // Return null or handle the error as needed
  }

  // Get the user's current location
  const location = await Location.getCurrentPositionAsync({});
  return location.coords; // Return only the coordinates
};
