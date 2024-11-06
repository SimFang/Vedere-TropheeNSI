import React from 'react';
import { Image, StyleSheet } from 'react-native';

const CompanyLogo = ({ size = 40, dark = true }) => {
  // Conditional image source based on 'dark' prop
  const imageSource = dark 
    ? require('../../assets/images/blacklogo.png')  // Replace with actual path to dark image
    : require('../../assets/images/whitelogo.png'); // Replace with actual path to light image

  return (
    <Image
      source={imageSource}
      style={[styles.image, { width: size, height: size }]} // Apply dynamic size
      resizeMode="contain" // Keep image aspect ratio
    />
  );
};

export default CompanyLogo;

const styles = StyleSheet.create({
  image: {
    // Add any shared styles if necessary (e.g. borderRadius, margin, etc.)
  },
});
