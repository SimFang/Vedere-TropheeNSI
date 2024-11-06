import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const DottedButton = ({ 
  title = "lorem ipsum", 
  color = "#C16A6A", 
  width = 200, 
  onPress = () => {}, 
  dark = false // Add dark prop
}) => {
  const backgroundColor = dark ? 'black' : 'white'; // Set background color based on dark prop
  const textColor = dark ? 'white' : 'black'; // Set text color based on dark prop

  return (
    <TouchableOpacity style={[styles.button, { width, backgroundColor }]} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default DottedButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    flexDirection: 'row', // Display items in a row
    alignItems: 'center', // Vertically center the text and dot
    padding: 10, // Button padding
    borderWidth: 1, // Grey border
    borderColor: 'grey', // Border color
    borderRadius: 15, // Rounded corners (optional)
  },
  dot: {
    width: 10, // Dot width
    height: 10, // Dot height
    borderRadius: 5, // To make the dot circular
    marginRight: 10, // Space between the dot and text
  },
  text: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16, // Text size
  },
});
