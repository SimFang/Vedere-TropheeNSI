// OptionButton.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OptionButton = ({ option, selected, onPress, width }) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selected && styles.selectedOption,
        { width: width || '30%' }, // Default width is 30%, can be overridden via prop
      ]}
      onPress={onPress}
    >
      <Text style={styles.optionText}>{option}</Text>
    </TouchableOpacity>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 14,
    height: 75,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectedOption: {
    borderColor: '#8FCBA2', // Green border color
    borderWidth: 5,          // Thickness of the border
  },
  optionText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Satoshi-Black',
  },
});
