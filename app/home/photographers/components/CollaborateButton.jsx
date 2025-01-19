import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

const CollaborateButton = ({ onPress, darkMode = false }) => {
  const [slideAnim] = useState(new Animated.Value(0)); // Initial position of the text

  const handlePress = () => {
    // Slide the text to the right (e.g., 100 units)
    Animated.timing(slideAnim, {
      toValue: 350, // Move the text 100 units to the right
      duration: 300, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // After animation ends, trigger the onPress function
    onPress();
    setTimeout(()=>{
        slideAnim.setValue(0);
    },400)
    });
  };

  return (
    <TouchableOpacity
      style={[styles.button, darkMode && styles.darkButton]}
      onPress={handlePress}
    >
      <Animated.View
        style={[{ transform: [{ translateX: slideAnim }] }, styles.textContainer]}
      >
        <Text style={[styles.buttonText, darkMode && styles.darkButtonText]}>Collaborate</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CollaborateButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: 'absolute',
    bottom: 100,
    opacity: 0.9,
    width: '80%',
  },
  darkButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: 'white',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});