import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated } from 'react-native';
import CompanyLogo from '../elements/companyLogo';

const StartingAnimation = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current; // Control logo opacity
  const textOpacity = useRef(new Animated.Value(0)).current; // Control text opacity
  const backgroundColor = useRef(new Animated.Value(0)).current; // Control background color

  useEffect(() => {
    // Sequential animations
    Animated.sequence([
      // Fade in the logo
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000, // 1 second
        useNativeDriver: true,
      }),
      // Fade in the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000, // 1 second
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Interpolate background color from black to white
  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['black', 'white'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      {/* Animated logo */}
      <Animated.View style={{ opacity: logoOpacity }}>
        <CompanyLogo dark={false} size={100} />
      </Animated.View>

      {/* Animated text */}
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.text}>You deserve to be seen</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default StartingAnimation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width, // Full width of the screen
    height: Dimensions.get('window').height, // Full height of the screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  text: {
    color: 'white', // Black text
    fontSize: 20, // Adjust text size
    fontFamily: 'Satoshi', // Use Satoshi font
    marginTop: 30, // Add spacing between the logo and text
  },
});