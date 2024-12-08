import { StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Text} from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { updateProfilePicture } from '../../services/updateProfilePicture';
import routes from "../../constants/routes.json"
const ProfilePicture = ({ img, size, modificationId = false, onUpload=()=>{} }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to open the image picker
  const pickImage = async () => {
    console.log(img)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image
    }
  };

  // Function to confirm the upload
  const confirmUpload = async () => {
    if (!selectedImage) {
      Alert.alert("No image selected", "Please select an image first");
      return;
    }

    setLoading(true); // Show loading indicator while uploading

    const formData = new FormData();
    formData.append('id',modificationId)
    formData.append('file', {
      uri: selectedImage,
      name: 'profile_picture.jpg',
      type: 'image/jpeg',
    });

    try {
      await updateProfilePicture(formData)
      onUpload(selectedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert("Upload Error", "Something went wrong while uploading the image");
    } finally {
      setLoading(false); // Hide the loading indicator
      setSelectedImage(null); // Clear the selected image after upload
    }
  };

  return (
    <TouchableOpacity onPress={modificationId ? pickImage : null} style={styles.container}>
      <Image
        style={[styles.profilePicture, { height: size, width: size }]}
        source={{ uri: selectedImage || img }} // Use selected image or original image
      />
      {modificationId && selectedImage && (
        <TouchableOpacity onPress={confirmUpload} style={styles.confirmButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Upload</Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  profilePicture: {
    borderRadius: 200,
  },
  confirmButton: {
    position : 'absolute',
    bottom : -20,
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
  },
});
