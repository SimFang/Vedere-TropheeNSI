import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Logo from "../../assets/images/blacklogo.png"

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Makes the view take the full screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'red',
  },
  logo: {
    width: 100, // Adjust logo size as needed
    height: 100, // Adjust logo size as needed
    marginBottom: 20, // Space between logo and text
  }
})