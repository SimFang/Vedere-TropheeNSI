import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { getLocation } from '../../../../helpers/location/getUserLocation';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayedOrder, clearDisplayedOrder, setPhotographer as setPhotographerRedux } from '../../../../store/photographerSlice';
import Note from "../../../../components/elements/note";
import { getPropositionById } from '../../../../services/proposition/getPropositionById';
import { getCoordinates } from '../../../../services/location/getCoordinatesFromAdress';
import { fetchPhotographerById } from '../../../../services/getPhotographers/getPhotographerById';
import { useRouter } from 'expo-router';
import PictureSlider from './pictureSlider';
import PictureVisualization from './pictureVisualisation';
import { addWorkToProposition } from "../../../../services/proposition/pushResults";
import * as ImagePicker from 'expo-image-picker'; // Import image picker

export default function App() {
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [shownPicture, setShownPicture] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // State to hold selected images
  const [hasUploaded, setHasUploaded] = useState(false)

  const photographerState = useSelector((state) => state.photographer);
  const router = useRouter();
  const dispatch = useDispatch();

  const clear = () => {
    dispatch(clearDisplayedOrder());
    setData(null);
    setSelectedPhotographer(null);
    setRegion(null);
    setLoading(false);
    setShownPicture(null);
    setSelectedImages([]); // Clear selected images
  };

  const handleBack = () => {
    clear();
    router.back();
  };

  const handlePhotographerClick = (photographer) => {
    dispatch(setPhotographerRedux([photographer]));
    router.replace("/home/photographers");
    clear();
  };

  const handleShowPicture = (url) => {
    setShownPicture(url);
  };

  const handleImagePicker = async () => {
    // Ask the user for permission to access the camera roll
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker to select multiple images
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (pickerResult.canceled) {
      return; // If the user canceled the selection
    }

    // Update the selected images state
    setSelectedImages(pickerResult.assets);
    setHasUploaded(true)
  };

  const handleUploadImages = async () => {
    setLoading(true)
    if (selectedImages.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    try {
      const propositionId = photographerState.displayedOrderId; // Assuming this is how you get the proposition ID
      const uploadedData = await addWorkToProposition(propositionId, selectedImages);
      console.log("Upload successful:", uploadedData);
      // Optionally update the local state or show a success message
      setHasUploaded(false)
      setLoading(false)
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("An error occurred while uploading images.");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getLocation();
      console.log("Fetched location:", location);
      return location;
    };

    const loadOrderData = async () => {
      const response = await getPropositionById(photographerState.displayedOrderId);
      console.log("Fetched order data:", response);

      const coordinates = await getCoordinates(response.location);
      console.log("Fetched coordinates:", coordinates);

      return {
        response,
        coordinates,
        p2_id: response.p2_id || null,
      };
    };

    const fetchData = async () => {
      const [location, orderData] = await Promise.all([fetchLocation(), loadOrderData()]);

      const coordinates = orderData.coordinates || location;

      if (coordinates) {
        setRegion({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      if (orderData.p2_id) {
        try {
          const photographerInfo = await fetchPhotographerById(orderData.p2_id);
          console.log("Photographer Info:", photographerInfo);
          setSelectedPhotographer(photographerInfo.photographer);
        } catch (e) {
          handleBack();
        }
      } else {
        handleBack();
        console.warn("p2_id is null, unable to fetch photographer info.");
      }

      setData(orderData.response);
      setLoading(false);
    };

    setLoading(true);
    fetchData();
  }, []);


  return (
    <>
      {shownPicture && <PictureVisualization imageUri={shownPicture} onClose={() => setShownPicture(null)} />}
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>

        {region && <MapView
          style={styles.map}
          initialRegion={region}
        >
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title="Your Location"
            description="This is where you are"
          />
        </MapView>}

        {data && (
          <View style={styles.infoBox}>
            <View style={styles.datePriceContainer}>
              <Text style={styles.dateText}>{data.date + ", " + data.hour}</Text>
              <Text style={styles.priceText}>${data.price}</Text>
            </View>

            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" color={'#CBCBCB'} style={styles.locationIcon}></Ionicons>
              <Text style={styles.locationText}>{data.location}</Text>
            </View>

            { !data.isActive && <PictureSlider pictures={(data.results)} handleClick={handleShowPicture} canUpload={photographerState.isPhotographer ? true : false} />}
            <View style={styles.separator} />

            { data.isActive && (<View style={styles.profileContainer}>
              <TouchableOpacity onPress={() => handlePhotographerClick(selectedPhotographer)}>
                <Image
                  source={{ uri: selectedPhotographer?.profile_picture }}
                  style={styles.profilePicture}
                />
              </TouchableOpacity>
              <Text style={styles.nameText}>
                {selectedPhotographer ? `${selectedPhotographer.name} ${selectedPhotographer.surname}` : 'No Name'}
              </Text>
              <Note style={styles.noteText} note={selectedPhotographer ? selectedPhotographer.note : ""} />
            </View>)}

            {/* Upload Button */}
            {photographerState.isPhotographer && !data.isActive && (
              <View style={hasUploaded?styles.uploadButtonContainerOn:styles.uploadButtonContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
                  <Ionicons name="cloud-upload" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={()=>{
                  if(hasUploaded){
                    handleUploadImages()
                  } 
                }}>
                  {!loading && <Text style={hasUploaded?styles.submitButtonTextOn:styles.submitButtonText}>Submit Upload</Text>}
                  {loading && (
                    <ActivityIndicator 
                      size="small"  // Reduce size from 'large' to 'small'
                      color="white" 
                      style={{ marginRight: 120 }}  // Add margin right of 60
                    />
                  )}
                  </TouchableOpacity>
              </View>

            )}
            
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  datePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#5A5A5A',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    color: '#CBCBCB',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameText: {
    paddingRight : 20,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteText: {
    color: '#999999',
  },
  uploadButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width : '100%',
    justifyContent : 'space-between',
    backgroundColor : 'white',
    padding : 10,
    borderRadius : 30,
    borderWidth : 2,
    borderColor : "#D6D6D6"
    
  },
  uploadButtonContainerOn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width : '100%',
    justifyContent : 'space-between',
    backgroundColor : 'black',
    padding : 10,
    borderRadius : 30,
    borderWidth : 2,
    borderColor : "#D6D6D6"
    
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 200, // Increased border radius
    marginRight: 10, // Add some space between buttons
  },
  submitButton: {
    padding: 12,
    borderRadius: 10, // Increased border radius
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
    marginRight : 60,
  },
  submitButtonTextOn: {
    color: 'white',
    fontSize: 16,
    marginRight : 60,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },

});
