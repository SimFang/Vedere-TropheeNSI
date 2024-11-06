import { StyleSheet, TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import React from 'react';

const Button = ({ 
  onPress = () => {}, 
  title = "", 
  dark = false, 
  icon = null, 
  width = '50%', 
  height = 50, 
  loading = false 
}) => {

  return (
    <TouchableOpacity 
      style={[styles.button, { 
        width: width,
        height: height,
        backgroundColor: dark ? '#000' : '#fff', 
        borderColor: dark ? 'transparent' : '#DEDEDE',
        borderWidth: dark ? 0 : 1,
      }]} 
      onPress={loading ? null : onPress} // Disable button when loading
      activeOpacity={loading ? 1 : 0.2} // Prevents button press feedback when loading
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator size="small" color={dark ? '#fff' : '#000'} /> // Show indicator
        ) : (
          <>
            {icon && <Image source={icon} style={styles.icon} />}
            <Text style={[styles.buttonText, { color: dark ? '#fff' : '#000' }]}>{title}</Text> 
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center',  // Center vertically
    justifyContent: 'center', // Center the content
  },
  buttonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
  },
  icon: {
    width: 30, // Set the width of the icon
    height: 30, // Set the height of the icon
    marginRight: 10, // Space between the icon and the text
  },
});
