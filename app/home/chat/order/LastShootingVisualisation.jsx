import { StyleSheet, Text, View, Image, ScrollView, Animated, PanResponder, TouchableOpacity } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { fetchPhotographerById } from '../../../../services/getPhotographers/getPhotographerById';
import { setPhotographer as setPhotographerRedux } from '../../../../store/photographerSlice';
import { t } from "../../../../localization";
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

const LastShootingVisualisation = ({ proposition, onClose }) => {
  // Create animated values for fade-in effect and position
  const dispatch = useDispatch()
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0
  const translateY = useRef(new Animated.Value(100)).current; // Start slightly off-screen for slide-up effect
    const router = useRouter();

  const [photographer, setPhotographer] = useState(null); // Initialize as null

  const handlePhotographerClick = () => {
    console.log("handle photographer click on home page")
    dispatch(setPhotographerRedux([photographer]));
    router.replace("/home/photographers");
};

  useEffect(() => {
    const fetchPhotographerData = async () => {
      try {
        const data = await fetchPhotographerById(proposition.p2_id);
        setPhotographer(data.photographer); // Assuming 'photographer' is the key in the response
      } catch (error) {
        console.error("Error fetching photographer:", error);
      }
    };

    fetchPhotographerData(); // Call the async function
  }, [proposition.p2_id]); // Ensure it fetches new data if the ID changes

  useEffect(() => {
    // Start the fade-in and slide-up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Target opacity
        duration: 200, // Duration of fade-in
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(translateY, {
        toValue: 0, // Slide to original position
        duration: 200, // Duration of slide-up animation
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();
  }, [fadeAnim, translateY]); // Run this effect when fadeAnim or translateY changes

  // Create a pan responder for detecting swipe down
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Detect if the user is dragging down
        return gestureState.dy > 20; // Start responding if moved down more than 20 pixels
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update the translateY value as the user drags
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) { // Call onClose if dragged down more than 100 pixels
          // Animate the component off-screen smoothly
          Animated.timing(translateY, {
            toValue: 600, // Push down out of the screen (adjust if necessary)
            duration: 300, // Duration of the push down animation
            useNativeDriver: true, // Use native driver for better performance
          }).start(onClose);
        } else {
          // If not dragged down enough, return to original position
          Animated.timing(translateY, {
            toValue: 0, // Reset position
            duration: 200, // Duration of the reset animation
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers} // Attach pan responder handlers
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY }] }, // Apply fade and translateY
      ]}
    >
      {/* Render photographer details if available */}
      {photographer && (
        <View style={styles.photographerContainer}>
          <TouchableOpacity onPress={() => { handlePhotographerClick() }}>
            <Image
              source={{ uri: photographer.profile_picture }}
              style={styles.profileImage} // Add style for profile image
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text style={styles.photographerName}>{`${photographer.name} ${photographer.surname}`}</Text>
        </View>
      )}

      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        {proposition.results.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover" // Adjusts how the image should fit in the container
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default LastShootingVisualisation;

const styles = StyleSheet.create({
  photographerContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    justifyContent: 'space-between',
  },
  container: {
    position: 'absolute', // Make the container absolute
    zIndex: 3,
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2, // Vertical offset of the shadow
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 10, // Shadow blur radius
    elevation: 5, // For Android shadow
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    marginTop: 60,
    marginBottom: 10,
    color: '#000', // Black text color
  },
  description: {
    fontFamily: 'Satoshi-Light',
    fontSize: 14,
    marginBottom: 20,
    color: '#000', // Black text color
  },
  photographerName: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color: '#000', // Black text color for photographer's name
  },
  photographerCertification: {
    fontFamily: 'Satoshi-Light',
    fontSize: 10,
    color: '#000', // Black text color for photographer's certification
  },
  profileImage: {
    width: 50, // Set desired width for profile image
    height: 50, // Set desired height for profile image
    borderRadius: 25, // Make it circular
    marginBottom: 10, // Space between image and name
  },
  scrollContainer: {
    width: "100%", // Set desired width for each image
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: "100%", // Set desired width for each image
    height: "100%", // Set desired height for each image
    marginRight: 5, // Space between images
    borderRadius: 10, // Optional: rounded corners for images
  },
});
