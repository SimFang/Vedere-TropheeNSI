import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Animated, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CompanyLogo from '../../../components/elements/companyLogo';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../../../services/getUserInfoByTokenRequest';
import { createConversation } from '../../../services/chat/createConversation';
import { useRouter } from 'expo-router';
import { setCurrentChatId } from '../../../store/chatSlice';

const Photographer = ({ photographer }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // State to track image loading
  const fadeAnim = useRef(new Animated.Value(1)).current;


  
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth)

  const router = useRouter();

  useEffect(() => {
    if (photographer.work.length > 1) {
      const interval = setInterval(() => {
        fadeOutImage(); // Fade out the current image
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentImageIndex]);

  const fadeOutImage = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.7, // Fade out
      duration: 200, 
      useNativeDriver: true,
    }).start(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % photographer.work.length
      );
      setIsLoading(true); // Set loading state to true for the next image
      fadeInImage(); // Fade in the new image
    });
  };

  const fadeInImage = () => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 200, 
      useNativeDriver: true,
    }).start();
  };

  const handleCollaborate = async() => {
      const userInfo = await fetchUserInfo(authState.token)
      const data = await createConversation(userInfo.userId, photographer.id);
      dispatch(setCurrentChatId(data.id))
      router.replace("/home/chat")
      // call the backend 
  }

  return (
    <View style={styles.container}>
      {/* Background Image with Fade Effect */}
      <Animated.View style={[styles.backgroundImageWrapper, { opacity: fadeAnim }]}>
  
        <ImageBackground
          source={{ uri: photographer.work[currentImageIndex] }}
          style={styles.backgroundImage}
          blurRadius={0} // Add blur for the background image
          onLoad={() => setIsLoading(false)} // Hide spinner once the image is loaded
        />
      </Animated.View>

      {/* Overlay content that stays visible during image transitions */}
      <View style={styles.overlay}>
        {/* Top Header */}
        <View style={styles.header}>
          <CompanyLogo dark={false} />
          <Text style={styles.swipeText}>swipe for new propositions</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <Text style={styles.shootings}>22 shootings</Text>
          <Text style={styles.name}>{photographer.name} <Text style={styles.surname}>{photographer.surname}</Text></Text>
          <Text style={styles.tagline}>{photographer.description}</Text>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.preSection}>Informations</Text>
          <View style={styles.infoBox}>
            <Text style={styles.preText}>Location</Text>
            <Text style={styles.infoText}>{photographer.operationLocation}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.preText}>Age</Text>
            <Text style={styles.infoText}>{photographer.age}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.preText}>Etat</Text>
            <Text style={styles.infoText}>{photographer.state}</Text>
          </View>
        </View>

        {/* Collaborate Button */}
        <TouchableOpacity style={styles.button} onPress={handleCollaborate}>
          <Text style={styles.buttonText}>collaborate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Photographer;

const styles = StyleSheet.create({
  preSection: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Satoshi-Regular',
    top: -30,
    fontSize: 15,
    left: 30,
  },
  container: {
    backgroundColor : "black",
    flex: 1,
  },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0, // Background layer
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Foreground layer (above the background)
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Satoshi-Light',
  },
  profileContainer: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 150,
    marginBottom: 30,
  },
  shootings: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
    marginBottom: 50,
  },
  name: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Satoshi-Light',
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  surname: {
    fontFamily: 'Satoshi-Bold',
    color: '#fff',
    fontSize: 40,
  },
  tagline: {
    width: '100%',
    textAlign: 'left',
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
    marginHorizontal: 20,
    marginTop: 10,
    borderLeftWidth: 2,
    borderLeftColor: 'white',
    paddingLeft: 10,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoBox: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 15,
    width: '32%',
    height: 80,
  },
  infoText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
  },
  preText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Satoshi-Light',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: 'absolute',
    bottom: 100,
    opacity: 0.9,
    width: '80%',
  },
  buttonText: {
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
});
