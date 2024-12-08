import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView, Dimensions, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { addImageToWork, removeImageFromWork } from '../../../../services/photographer/updatePhotographerWork';

const EditWorkPage = ({ initialImages, photographerId, onClose }) => {
  const [images, setImages] = useState(initialImages ? initialImages : []);
  const fadeAnim = useState(new Animated.Value(0))[0];  // Initial opacity is 0

  // Handle adding an image to the photographer's work list
  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      
      
      // Call the addImageToWork API function
      try {
        const response = await addImageToWork(photographerId, selectedImage);
        setImages((prevImages) => [...prevImages, response.imageUrl]);  // Add the image URL returned by the API
      } catch (error) {
        console.error('Error adding image:', error);
        Alert.alert('Error', 'There was an error adding the image.');
      }
    }
  };

  // Handle removing an image from the photographer's work list
  const handleRemoveImage = async (index, imageUrl) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Call the removeImageFromWork API function
              await removeImageFromWork(photographerId, imageUrl);
              setImages((prevImages) => prevImages.filter((_, i) => i !== index));
            } catch (error) {
              console.error('Error removing image:', error);
              Alert.alert('Error', 'There was an error removing the image.');
            }
          },
        },
      ]
    );
  };
    // Fade in when the component mounts
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 150, // Duration of the fade
        useNativeDriver: true,
      }).start();

      // Cleanup on unmount to fade out
      return () => {
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 150,
          useNativeDriver: true,
        }).start();
      };
    }, [fadeAnim]);

      // Fade out when onClose is triggered
    const handleClose = () => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 150, // Duration of the fade
        useNativeDriver: true,
      }).start();

      // Wait for the fade-out animation to complete before calling the onClose prop
      setTimeout(() => {
        onClose(); // Call the onClose callback after the fade-out is complete
      }, 150);
    };
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}> 
      <Text style={styles.title}>Edit Your Work</Text>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      {/* Horizontal ScrollView */}
      <ScrollView horizontal contentContainerStyle={styles.imagesContainer}>
        {Array.isArray(images) && images?.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveImage(index, image)} // Pass the image URL to remove
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          <Ionicons name="add-circle" size={50} color="#000" />
          <Text style={styles.addText}>Add Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

export default EditWorkPage;

const { height } = Dimensions.get('window'); // Get screen height

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: height, 
    zIndex: 10, // Ensure it overlays other content
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 50,
    padding: 8,
    zIndex: 1000,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the middle
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 16, // Add spacing between images
  },
  image: {
    width: 200, // Adjust width as needed
    height: 350, // Adjust height as needed
    borderRadius: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 8, // Shadow blur
    elevation: 5, // Android shadow (elevation gives a shadow on Android)
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'black',
    borderRadius: 12,
    padding: 4,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150, // Same width as the image
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  addText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    marginTop: 8,
  },
});