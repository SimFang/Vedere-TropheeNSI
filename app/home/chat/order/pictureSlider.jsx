import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const PictureSlider = ({ pictures = [], handleClick, canUpload = false }) => {
  const [uploading, setUploading] = useState(false); // State to manage upload status

  // Function to handle image picking and uploading
  const handleUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true); // Show loading state
      const selectedImage = result.assets[0].uri;

      // Call your endpoint to upload the image
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        name: 'uploaded_image.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('YOUR_UPLOAD_ENDPOINT_URL', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Upload Successful", "Your image has been uploaded!");
          // Optionally update the pictures array or state here
        } else {
          Alert.alert("Upload Failed", data.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert("Upload Error", "Something went wrong while uploading the image");
      } finally {
        setUploading(false); // Reset uploading state
      }
    }
  };

  return (
    <View style={styles.container}>
      {pictures.length === 0 ? (
        <Text style={styles.emptyText}>Shooting done!</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {pictures.map((url, index) => (
            <TouchableOpacity key={index} onPress={() => handleClick(url)}>
              <Image source={{ uri: url }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default PictureSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%', // Take all width
    padding: 10, // Optional padding for better appearance
    backgroundColor: 'white', // Optional background color
  },
  emptyText: {
    textAlign: 'center',
    color: 'black',
    opacity: 0.6,
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100, // Set width of each image
    height: 150, // Set height of each image
    marginRight: 10, // Space between images
    borderRadius: 10, // Round corners of images
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 3, // For Android shadow
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF', // Button color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 5, // Space between icon and text
  },
});
