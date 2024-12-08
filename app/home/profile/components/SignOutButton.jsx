import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LogoutComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Sign out from Firebase
      await AsyncStorage.removeItem('userToken'); // Clear the user token from AsyncStorage
      await AsyncStorage.removeItem('refreshToken'); // Clear the user token from AsyncStorage

      router.replace("/auth"); // Navigate to auth screen
    } catch (error) {
      console.error("Logout error:", error.message); // Log any errors
    }
  };

  return (
    <Text style={styles.logoutText} onPress={handleLogout}>
      Logout
    </Text>
  );
};

const styles = StyleSheet.create({
  logoutText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Satoshi-Normal', // Update with your font as needed
  },
});

export default LogoutComponent;