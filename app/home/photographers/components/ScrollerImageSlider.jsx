import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'react-native-gradients'; // Import LinearGradient

// Get screen height to use for calculation of pixel-based values
const { height } = Dimensions.get('window');
const setHeight = 0.29;

const ScrollerImageSlider = ({ imageList, initialImageUri, onClose, surname, name }) => {
  // Animated value for the wrapper's position, initially set to 29% of screen height
  const [topAnim] = useState(new Animated.Value(height * setHeight)); // Initial top value as a pixel-based value
  const [overlayAnim] = useState(new Animated.Value(0)); // To animate the opacity of the overlay

  const closePage = () => {
    console.log("Closing");
    // Animate the wrapper moving up when closing
    Animated.timing(topAnim, {
      toValue: height * setHeight, // Adjust this to control the final top value (10% of screen height)
      duration: 150, // Adjust duration for smoothness
      useNativeDriver: false, // We can't animate 'top' with useNativeDriver = true
    }).start(() => {
      if (onClose) {
        onClose();
      } else {
        console.log("onClose function is not defined.");
      }
    });
  };

  // Use effect to animate the wrapper moving down and the overlay fading in when the component appears
  useEffect(() => {
    Animated.timing(topAnim, {
      toValue: height * 0.6, // 50% of screen height as a pixel value
      duration: 150, // Adjust duration for smoothness
      useNativeDriver: false,
    }).start();

    // Animate the overlay to fade in
    Animated.timing(overlayAnim, {
      toValue: 1, // Full opacity for the gradient overlay
      duration: 150, // Adjust duration for smoothness
      useNativeDriver: true,
    }).start();
  }, []);

  // Define the gradient colors and offsets
  const colorList = [
    { offset: '0%', color: 'black', opacity: '0.7' },
    { offset: '40%', color: 'black', opacity: '0.4' },
    { offset: '100%', color: 'black', opacity: '0' }
  ];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.wrapper, { top: topAnim }]} // Bind the animated top value to the wrapper
      >
        <Text style={styles.name}>
          {name} <Text style={styles.surname}>{surname}</Text>
        </Text>
      </Animated.View>

      <TouchableOpacity onPress={closePage} style={styles.touchable}>
        <Image source={{ uri: initialImageUri }} style={styles.image} />
      </TouchableOpacity>

      {/* Gradient overlay */}
      <Animated.View
        style={[
          styles.overlayContainer,
          {
            opacity: overlayAnim, // Bind the opacity of the overlay to the animation value
          },
        ]}
      >
        <LinearGradient
          colorList={colorList} // Define the gradient colors and offsets
          angle={90} // Set the gradient direction to vertical
          style={styles.overlay}
        />
      </Animated.View>
    </View>
  );
};

export default ScrollerImageSlider;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
    marginBottom: 30,
    position: 'absolute',
    zIndex: 5,
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: 5,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  name: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Satoshi-Light',
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  surname: {
    fontFamily: 'Satoshi-Bold',
    color: '#fff',
    fontSize: 40,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%', // Adjust height of the dark overlay as needed
  },
  overlay: {
    flex: 1, // Make sure the gradient takes up all available space
  },
});