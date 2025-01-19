import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';


const NewPropositionInterface = ({ handleInputChange = () => {}, setPropositionPanelOn = () => {}, handleSend = () => {}, type = "", handleValidation = () => {}, handleDecline = () => {}, initialLocation = "", initialDate = "", initialHour="" }) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false); // State for confirmation modal
  const [actionToConfirm, setActionToConfirm] = useState(""); // Tracks the action (accept or decline)

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isFieldFilled = (field) => field !== '';

  const clearStates = () => {
    setLocation('');
    setDate('');
    setTime('');
  }

  const onClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      clearStates();
      setPropositionPanelOn(false);
    });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    if(initialLocation && initialHour && initialDate){
      setLocation(initialLocation);
      setTime(initialHour);
      setDate(initialDate);
    }
  }, []);

  const handleConfirmAction = () => {
    if (actionToConfirm === "accept") {
      handleValidation();
    } else if (actionToConfirm === "decline") {
      handleDecline();
    }
    setIsConfirmationModalVisible(false); // Close the confirmation modal
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <Text style={styles.title}>{type==="request"?"Define your shooting informations":"Your shooting informations"}</Text>
        <View style={styles.mapContainer}>
          <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 48.573405, // Strasbourg latitude
                    longitude: 7.752111, // Strasbourg longitude
                    latitudeDelta: 0.05, // Zoom level
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            />
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#D3D3D3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={24} color="black" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{location || 'To define'}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsLocationModalVisible(true)}>
            {isFieldFilled(location) ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="chevron-forward" size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>

        {/* Day Section */}
        <View style={styles.row}>
          <Ionicons name="calendar" size={24} color="black" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Day</Text>
            <Text style={styles.value}>{date || 'To define'}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            {isFieldFilled(date) ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="chevron-forward" size={24} color="gray" />
            )}
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              date={date ? new Date(date) : new Date()}
              onConfirm={(selectedDate) => {
                setShowDatePicker(false);
                const formattedDate = formatDate(selectedDate);
                setDate(formattedDate);
                handleInputChange("date", formattedDate);
              }}
              onCancel={() => setShowDatePicker(false)}
            />
          )}
        </View>

        {/* Time Section */}
        <View style={styles.row}>
          <Ionicons name="time" size={24} color="black" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{time || 'To define'}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            {isFieldFilled(time) ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="chevron-forward" size={24} color="gray" />
            )}
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="time"
              date={time ? new Date(`1970-01-01T${time}:00Z`) : new Date()}
              onConfirm={(selectedTime) => {
                setShowTimePicker(false);
                const hours = selectedTime.getHours().toString().padStart(2, '0');
                const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                setTime(`${hours}:${minutes}`);
                handleInputChange("hour", `${hours}:${minutes}`);
              }}
              onCancel={() => setShowTimePicker(false)}
            />
          )}
        </View>

        {type=="request"&&<TouchableOpacity style={location&&time&&date?styles.submitActiveButton:styles.submitButton} onPress={location&&time&&date?handleSend:()=>{}}>
          <Text style={location&&time&&date?styles.submitActiveText:styles.submitText}>Submit your shooting</Text>
        </TouchableOpacity>}

        {/* Validation Section for Accept/Decline */}
        {type === "validation" && (
        
          <View style={styles.validationButtonContainer}>

            <TouchableOpacity
              style={[styles.validationButton, { backgroundColor: '#ae2012', borderBottomLeftRadius : 15 }]}
              onPress={() => {
                setActionToConfirm("decline");
                setIsConfirmationModalVisible(true);
              }}
            >
              <Text style={styles.validationText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.validationButton, { backgroundColor: 'black', borderBottomRightRadius : 15}]}
              onPress={() => {
                setActionToConfirm("accept");
                setIsConfirmationModalVisible(true);
              }}
            >
                            <Text style={styles.validationText}>Accept</Text>

            </TouchableOpacity>

            
            </View>
          
        )}

        {/* Modal for Location Input */}
        <Modal isVisible={isLocationModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Location"
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsLocationModalVisible(false);
                  handleInputChange('location', location);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal for Accept/Decline */}
        <Modal isVisible={isConfirmationModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to {actionToConfirm}?</Text>
            <View style={styles.buttonsContainer}>
            <TouchableOpacity
                onPress={() => setIsConfirmationModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmAction} style={styles.validationModalButton}>
                <Text style={styles.validationModalButtonText}>Yes</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </Modal>
      </View>
    </Animated.View>
  );
};

export default NewPropositionInterface;

const styles = StyleSheet.create({
  overlay: {
    zIndex : 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened background
    justifyContent: 'center',
    alignItems : 'center'
  },
  mapContainer : {
    height : 200,
    backgroundColor : 'green',
    marginBottom : 30,
  },
  map : {
    flex : 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: -20, // Adjust to your design
    right: 20, // Adjust to your design
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 200, // Makes it round
    backgroundColor: 'white', // Adjust the color as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    width : "90%",
    borderRadius : 20,
  },
  title: {
    textAlign : 'center',
    fontFamily: 'Satoshi-Bold', // Use your Satoshi font
    fontSize: 18,
    padding : 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical : 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
  },
  value: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#555',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 15,
    alignItems: 'center',
    width : "100%",
    borderBottomLeftRadius : 15,
    borderBottomRightRadius : 15,

  },
  submitActiveButton: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    paddingVertical: 15,
    alignItems: 'center',
    width : "100%",
    borderBottomLeftRadius : 15,
    borderBottomRightRadius : 15,

  },
  validationButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 15,
    alignItems: 'center',
    width : "50%",
    
  },
  submitText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color : 'white',
  },
  submitActiveText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color : 'white',
  },
  validationText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color : 'white',
  },
  validationButtonContainer : {
      flexDirection :'row',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop : 20,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',       // Align buttons horizontally
    justifyContent: 'space-between',  // Space them apart
    marginTop: 20,               // Optional: add margin if needed
  },
  modalButton: {
    flex: 1,                     // Each button takes equal space
    backgroundColor: '#f0f0f0',  // Button background color (adjust as needed)
    paddingVertical: 10,         // Vertical padding for buttons
    marginHorizontal: "5%",         // Add space between buttons
    alignItems: 'center',        // Center text inside button
    borderRadius: 5,             // Optional: rounded corners
  },
  modalButtonText: {
    fontSize: 16,                // Font size for text
    color: '#333',               // Text color (adjust as needed)
  },
  validationModalButton : {
    flex: 1,                     // Each button takes equal space
    backgroundColor: '#f0f0f0',  // Button background color (adjust as needed)
    paddingVertical: 10,         // Vertical padding for buttons
    marginHorizontal: "5%",         // Add space between buttons
    alignItems: 'center',        // Center text inside button
    borderRadius: 5,  
  },
  validationModalButtonText : {
    fontSize: 16,                // Font size for text
    color: '#333',  
  }
});