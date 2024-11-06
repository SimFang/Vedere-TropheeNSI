import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { t } from "../../../../localization";
import DottedButton from '../../../../components/button/dottedButton';

const ModifyInfoPopup = ({ visible = true, initialValue, onSubmit, onClose, currentSection }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose(); // Close the modal after submitting
  };

  // Determine if the button should be dark or light
  const isDarkTheme = currentSection === "price";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.popup, isDarkTheme ? styles.darkPopup : styles.lightPopup]} onStartShouldSetResponder={() => true} onTouchEnd={() => {}}>
          <TextInput
            style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter new value"
            placeholderTextColor={isDarkTheme ? 'lightgray' : 'gray'} // Placeholder color based on theme
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <DottedButton onPress={handleSubmit} title={t('submit')} dark={true} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            {/* You may want to add some content or icon here */}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModifyInfoPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Background with opacity
  },
  popup: {
    width: '90%', // Take 90% of the screen width
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Shadow effect on Android
  },
  darkPopup: {
    backgroundColor: 'black', // Background color for dark theme
  },
  lightPopup: {
    backgroundColor: 'white', // Background color for light theme
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  darkInput: {
    color :  'white',
    borderColor: 'lightgray', // Border color for dark theme input
  },
  lightInput: {
    borderColor: '#ccc', // Border color for light theme input
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});
