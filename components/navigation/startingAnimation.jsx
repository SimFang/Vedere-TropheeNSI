import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

import CompanyLogo from '../elements/companyLogo';

const StartingAnimation = () => {
  return (
    <View style={styles.container}>
      <CompanyLogo dark={false} size={100}/>
    </View>
  );
}

export default StartingAnimation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width, // Full width of the screen
    height: Dimensions.get('window').height, // Full height of the screen
    backgroundColor: 'black', // Black background
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  letterV: {
    color: 'white', // White "V"
    fontSize: 100, // Adjust size of the "V"
    fontWeight: 'bold',
  },
});
