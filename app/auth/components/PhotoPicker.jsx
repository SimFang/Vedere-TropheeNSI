import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';

const PhotoPicker = ({ onPhotoSelected, photo }) => {
  const handlePhotoPick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync();
    
    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPick}>
      <Text style={styles.photoButtonText}>
        {photo ? 'Photo Selected' : 'Select a Photo'}
      </Text>
    </TouchableOpacity>
  );
};

export default PhotoPicker;

const styles = StyleSheet.create({
  photoButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
