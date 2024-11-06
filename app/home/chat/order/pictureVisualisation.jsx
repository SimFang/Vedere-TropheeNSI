import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CompanyLogo from '../../../../components/elements/companyLogo';

const PictureVisualization = ({ imageUri, onClose, onUpload }) => {
  const opacity = useRef(new Animated.Value(0)).current; // For fade-in effect

  // Effect to handle fade-in animation
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300, // Reduced duration of the fade-in effect
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoContainer}>
        <CompanyLogo dark={false} />
      </TouchableOpacity>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
        <Ionicons name="download" size={20} color="white" style={styles.uploadIcon} />
        <Text style={styles.uploadButtonText}>Download</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PictureVisualization;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
    flexDirection: 'row', // Align logo and text horizontally
    alignItems: 'center', // Center vertically
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 40,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center vertically
  },
  uploadIcon: {
    marginRight: 5, // Add some spacing between icon and text
  },
  uploadButtonText: {
    fontFamily : 'Satoshi-Light',
    color: 'white',
    fontSize: 16,
  },
});
