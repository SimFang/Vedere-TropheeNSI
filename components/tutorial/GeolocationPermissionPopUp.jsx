import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GeolocationPopUp = ({onClose}) => {

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Ionicons name="location" size={60} color="black" style={styles.icon} />
        <Text style={styles.heading}>Location Access Required</Text>
        <Text style={styles.description}>
          This app needs to access your location for functionality purposes only. 
          Your data will not be shared.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onClose}
        >
          <Text style={styles.buttonText}>I have acknowledged it</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GeolocationPopUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent black overlay
  },
  popup: {
    height : 600,
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // For shadow effect on Android
  },
  icon: {
    marginBottom: 10,
  },
  heading: {
    marginTop :70,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Satoshi',  // Ensure the font is linked
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
    fontFamily: 'Satoshi',  // Ensure the font is linked
  },
  button: {
    marginTop : 20,
    backgroundColor: 'black',  // Button in black
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',  // Button text in white
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Satoshi',  // Ensure the font is linked
  },
});