import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'react-native-gradients';

const OptionButton = ({ option, selected, onPress, width, backgroundImage }) => {
  const whiteGradient = [
    { offset: '0%', color: '#FFFFFF', opacity: '1' },
    { offset: '100%', color: '#FFFFFF', opacity: '0.2' },
  ];
  const blackGradient = [
    { offset: '0%', color: '#000000', opacity: '1' },
    { offset: '100%', color: '#000000', opacity: '0.4' },
  ];

  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        { width: width || '30%' },
      ]}
      onPress={onPress}
    >
      <ImageBackground
        source={backgroundImage}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 0 }}
      >
        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.optionText, !selected && styles.selectedText]}>{option}</Text>
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colorList={!selected ? blackGradient : whiteGradient}
          angle={90}
          style={styles.gradientOverlay}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  optionButton: {
    borderRadius: 14,
    height: 75,
    overflow: 'hidden', // Ensures background image stays within rounded borders
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Covers the bottom 50% of the button
  },
  textContainer: {
    position: 'absolute',
    bottom: 3,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: 'black', // Default text color
    fontSize: 13,
    fontFamily: 'Satoshi-Black',
  },
  selectedText: {
    color: 'white', // Text color when selected
    fontWeight: 'bold', // Emphasized selected text
  },
});