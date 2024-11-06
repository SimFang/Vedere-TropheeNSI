import { StyleSheet, View, Image, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import DottedButton from '../button/dottedButton';
import { t } from '../../localization';

const GalleryPicker = ({ setImagesState }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple image selection
      selectionLimit: 8, // Limit to 8 images
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets ? result.assets : [{ uri: result.uri }];
      setSelectedImages([...selectedImages, ...newImages]); // Add new images to local state
      setImagesState((prevState) => [...prevState, ...newImages]); // Push to the external state
    } else {
      Alert.alert('No images selected', 'Please select at least one image.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slider}>
        {selectedImages.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
        ))}
      </ScrollView>
      <DottedButton title={t("uploadmywork")} onPress={pickImages} />
    </View>
  );
};

export default GalleryPicker;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    marginVertical: 10,
    width: '98%',

  },
  previewImage: {
    width: 150,
    height: 150,
    marginRight: 10, // Add spacing between images
    borderRadius: 10,
  },
});
