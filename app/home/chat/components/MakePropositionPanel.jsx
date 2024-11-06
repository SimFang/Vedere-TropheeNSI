import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { t } from "../../../../localization";

const MakePropositionPanel = ({ setProposition }) => {
  const handleInputChange = (field, value) => {
    setProposition(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <LinearGradient
      // Define your gradient colors here
      colors={['#327DA7', '#133141']} 
      style={styles.panelContainer}
    >
      <Text style={styles.headerText}>{t('hihereismyproposition')}</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="white" // Change placeholder text color
          onChangeText={(value) => handleInputChange('location', value)} // Update state on change
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="white" // Change placeholder text color
          onChangeText={(value) => handleInputChange('date', value)} // Update state on change
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="time-outline" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Hour (HH:MM)"
          placeholderTextColor="white" // Change placeholder text color
          onChangeText={(value) => handleInputChange('hour', value)} // Update state on change
        />
      </View>

    </LinearGradient>
  );
};

export default MakePropositionPanel;

const styles = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    bottom: 80, // Adjust top position as needed
    left: 20, // Adjust left position as needed
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 34,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  headerText: {
    fontSize: 15,
    marginBottom: 15,
    fontFamily: 'Satoshi-Medium',
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    color: 'white',
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#327EA8',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
