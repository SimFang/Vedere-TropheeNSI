import { StyleSheet, Text, View, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import TutorialPage from './TutorialPage'; // Import the TutorialPage component
import Button from '../../app/auth/components/Button'; // Import Button component
import { tutorialData } from './tutorialContent';
import GeolocationPopUp from './GeolocationPermissionPopUp';

const AppTutorial = () => {
  const [hasShownTutorial, setHasShownTutorial] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // State for current tutorial page
  const [hasShownGeolocationPermissionPage, setGeolocation] = useState(false); 

  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        // Check if tutorial has already been shown
        const tutorialStatus = await AsyncStorage.getItem('hasShownTutorial');
        if (tutorialStatus === 'true') {
          console.log("Already shown the tutorial");
          setHasShownTutorial(true);
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };

    checkTutorialStatus();
  }, []); // Run once when the component mounts

  const closeTutorial = async () => {
    try {
      // Store that the tutorial has been shown
      await AsyncStorage.setItem('hasShownTutorial', 'true');
      setHasShownTutorial(true); // Close the tutorial modal
    } catch (error) {
      console.error('Error saving tutorial status:', error);
    }
  };

  // If the tutorial has been shown, don't render this component

  if(hasShownTutorial) return null

  const handleNextPage = () => {
    if (currentPage < tutorialData.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={!hasShownTutorial}
        onRequestClose={closeTutorial}
      >
        {/* Modal Background (darkens the entire screen) */}
        <View style={styles.modalBackground}>
          {/* Modal Content (white rectangle with rounded corners) */}
          <View style={styles.modalContent}>
              {
                !hasShownGeolocationPermissionPage && <GeolocationPopUp onClose={()=>{
                  setGeolocation(true)
                }}/>
              }
              {
                  hasShownGeolocationPermissionPage && <>
                                <TutorialPage
                                    title={tutorialData[currentPage]?.title}
                                    description={tutorialData[currentPage]?.description}
                                    sections={tutorialData[currentPage]?.sections}
                                  />
                                
                                <View style={styles.navigationButtons}>
                                  {/* Skip Tutorial Text */}
                                  <Text
                                    onPress={closeTutorial}
                                    style={styles.skipText}
                                  >
                                    Skip Tutorial
                                  </Text>
                                  
                                  <Button
                                    title={currentPage < tutorialData.length - 1 ? "Next" : "Finish"}
                                    onPress={currentPage < tutorialData.length - 1 ? handleNextPage : closeTutorial}
                                    dark={true}
                                    width="48%"
                                  />
                                </View>
                  </>                
              }
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppTutorial;

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Absolute positioning for the modal
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%', // The modal content will take 80% of the screen width
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  skipText: {
    color: '#B0B0B0', // Same grey color as the container
    fontSize: 16,
    textAlign: 'left', // Align left
    width: '48%',
    padding : 12
  },
});