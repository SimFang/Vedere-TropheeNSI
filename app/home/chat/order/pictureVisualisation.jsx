import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CompanyLogo from '../../../../components/elements/companyLogo';
import DownloadButton from './DownloadButton';
import { GestureHandlerRootView, PinchGestureHandler, GestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

const PictureVisualization = ({ imageUri, onClose, onUpload }) => {
  const opacity = useRef(new Animated.Value(0)).current; // For fade-in effect
  const scale = useRef(new Animated.Value(1)).current; // For scaling image

  // Effect to handle fade-in animation
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300, // Reduced duration of the fade-in effect
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  // Pinch gesture handler
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      // Reset scale to 1 after pinch ends (optional)
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, position :'absolute', top : 0, bottom :0, left : 0, right : 0 }}>
      <Animated.View style={[styles.container, { opacity }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoContainer}>
          <CompanyLogo dark={false} />
        </TouchableOpacity>

        {/* PinchGestureHandler covering full screen */}
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <Animated.View style={[styles.gestureHandlerContainer, { transform: [{ scale }] }]}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          </Animated.View>
        </PinchGestureHandler>

        {/* Replace the previous download button with the new DownloadButton component */}
        <DownloadButton imageUrl={imageUri} />
      </Animated.View>
    </GestureHandlerRootView>
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
  gestureHandlerContainer: {
    position: 'absolute', // Fullscreen pinch gesture handler
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'Satoshi-Light',
    color: 'white',
    fontSize: 16,
  },
});