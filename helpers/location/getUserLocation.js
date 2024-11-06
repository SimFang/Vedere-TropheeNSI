import * as Location from 'expo-location';

export const getLocation = async () => {
  // Request permission to access location
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permission to access location was denied');
    return null; // Return null if permission is denied
  }

  // Get the user's current location
  let location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};
