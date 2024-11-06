// GeolocationPermission.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

const GeolocationPermission = ({ onPermissionGranted }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleRequestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
      onPermissionGranted(); // Call the prop function if permission is granted
    } else {
      Alert.alert('Permission Denied', 'You need to allow geolocation for the app to work properly.');
    }
  };

  if (hasPermission === null) {
    return <Text></Text>; // Still loading
  }

  if (hasPermission === false) {
    return (
      <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
        <Text style={{ marginBottom: 10 }}>We need your location to enhance your experience with the app.</Text>
        <Button title="Grant Permission" onPress={handleRequestPermission} />
      </View>
    );
  }

  return <Text></Text>; // Still loading
};

export default GeolocationPermission;
