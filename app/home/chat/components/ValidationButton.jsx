import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ValidationButton = ({ onPress, validation, userId}) => {
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const confirmValidation = () => {
    setShowModal(false); // Close the modal
    // Background and text color animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setValidated(true);
      onPress && onPress();
      // Start scaling down after 0.8s
      setTimeout(() => {
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 800);
    });
  };

  const animatedBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'], // From white to black
  });

  const animatedTextColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'], // From black to white
  });

  const animatedScale = {
    transform: [{ scale: scaleAnimation }],
  };

  return (
    <>
    {validation == userId && <Text style={styles.waitingForValidationText}>You have validated that shooting, waiting for the other side.</Text>}
    {(validation !== userId || !validation) && (
        <>
         <Animated.View
        style={[
          styles.container,
          { backgroundColor: animatedBackgroundColor },
          animatedScale,
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={validated}
        >
          <Animated.Text style={[styles.buttonText, { color: animatedTextColor }]}>
            {validated ? 'Validated' : 'Validate Shooting'}
          </Animated.Text>
          <Ionicons
            name={validated ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={validated ? '#FFFFFF' : '#000000'} // Icon changes directly based on state
            style={styles.icon}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to validate this shooting?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmValidation}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        </>
    )}   
    </>
  );
};

export default ValidationButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    borderRadius: 200,
    overflow: 'hidden',
    right: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    margin: 10,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
  },
  cancelButtonText: {
    fontFamily: 'Satoshi-Bold',
    color: '#000000',
  },
  confirmButtonText: {
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  waitingForValidationText : {
    position: 'absolute',
    bottom: 250,
    backgroundColor : 'black',
    fontFamily: 'Satoshi-Bold',
    color : 'white',
    padding : 20,
    right : 0,
    paddingHorizontal : 50,
    borderStartStartRadius : 30,
    borderBottomLeftRadius : 30,
  }
});