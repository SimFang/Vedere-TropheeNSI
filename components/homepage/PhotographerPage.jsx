import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { fetchUserInfo } from '../../services/getUserInfoByTokenRequest';
import { createConversation } from '../../services/chat/createConversation';
import { setCurrentChatId } from '../../store/chatSlice';

const PhotographerPage = ({ photographer, close = () => {} }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  // Handle touch outside the card to trigger close
  const handleClose = () => {
    close();
  };

  const handleCollaborate = async() => {
    const userInfo = await fetchUserInfo(authState.token);
    const data = await createConversation(userInfo.userId, photographer.id);
    dispatch(setCurrentChatId(data.id));
    router.replace("/home/chat");
    // call the backend
  };

  return (
    <View style={styles.container}>
      {/* First Absolute Component: Full-screen overlay that captures click to close */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* Second Absolute Component: The card */}
      <View style={styles.card}>
        {/* ScrollView for the images */}
        <ScrollView 
          horizontal
          pagingEnabled
          style={styles.decorationImage}
          showsHorizontalScrollIndicator={false} // Optionally hide scroll indicator
        >
          {photographer.work.map((imageUri, index) => (
            <Image 
              key={index}
              source={{ uri: imageUri }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        <View style={styles.textZone}>
          <Text style={styles.name}>
            {photographer.name + ' '}
            <Text style={styles.surname}>{photographer.surname}</Text>
          </Text>
          <Text style={styles.description}>{photographer.description}</Text>
        </View>

        <Text style={styles.informationTitle}>Informations</Text>

        {/* Horizontal ScrollView for the sections */}
        <ScrollView 
          horizontal 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {/* Grey box for each section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age</Text>
            <Text style={styles.sectionValue}>{photographer.age}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionValue}>{photographer.operationLocation}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>
            <Text style={styles.sectionValue}>€{photographer.price}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <Text style={styles.sectionValue}>
              {photographer.isProfessional ? 'Professional' : 'Amateur'}
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={handleCollaborate}>
          <View style={styles.collaboratebutton}>
            <Text style={styles.collaboratetext}>Collaborate</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhotographerPage;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  // First Absolute Component: Full screen overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened space around the white rectangle
  },
  // Second Absolute Component: The card that goes on top of the overlay
  card: {
    position: 'absolute',
    top: '10%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 0,
    height: 'auto',
    minHeight: height * 0.8,
    width: width * 0.85,
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  // Scrollable images container
  decorationImage: {
    borderTopLeftRadius : 25,
    borderTopRightRadius : 25,
    width: '100%',
    maxHeight: height * 0.4, // Adjust to fit the image area
    alignSelf: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: width * 0.85, // Same width as the card
    height: '100%',
  },
  textZone: {
    width: '100%',
    paddingHorizontal: 20,
  },
  name: {
    marginTop: 20,
    fontSize: 40,
    textAlign: 'left',
    marginBottom: 5,
    fontFamily: 'Satoshi',
  },
  surname: {
    fontWeight: 'bold',
    fontFamily: 'Satoshi-Bold',
  },
  description: {
    fontSize: 13,
    textAlign: 'left',
    color: 'gray',
    marginBottom: 10,
    borderLeftColor: 'black',
    borderLeftWidth: 2,
    paddingLeft: 20,
  },
  informationTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    marginTop: 30,
    paddingLeft: 20,
  },
  scrollContainer: {
    maxHeight: 100,
    marginTop: 20,
  },
  scrollContent: {},
  section: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginRight: 5,
    width: 120,
    height: 80,
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Satoshi',
    fontSize: 12,
    marginBottom: 5,
  },
  sectionValue: {
    fontFamily: 'Satoshi',
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  collaboratebutton: {
    position: 'absolute',
    bottom: -50,
    left: 10,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  collaboratetext: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: 'white',
    textAlign: 'center',
  },
});