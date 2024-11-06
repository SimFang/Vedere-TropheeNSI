// FontLoader.js

import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font'; // Import the font loading library
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Satoshi-Black': require('../assets/fonts/Satoshi-Black.otf'),
        'Satoshi-BlackItalic': require('../assets/fonts/Satoshi-BlackItalic.otf'),
        'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.otf'),
        'Satoshi-BoldItalic': require('../assets/fonts/Satoshi-BoldItalic.otf'),
        'Satoshi-Italic': require('../assets/fonts/Satoshi-Italic.otf'),
        'Satoshi-Light': require('../assets/fonts/Satoshi-Light.otf'),
        'Satoshi-LightItalic': require('../assets/fonts/Satoshi-LightItalic.otf'),
        'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.otf'),
        'Satoshi-MediumItalic': require('../assets/fonts/Satoshi-MediumItalic.otf'),
        'Satoshi-Regular': require('../assets/fonts/Satoshi-Regular.otf'),
      });
      setFontsLoaded(true); // Update state to indicate fonts are loaded
    };

    loadFonts(); // Call the load function
  }, []);


  return children; // Render children when fonts are loaded
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Optional: Background color while loading
  },
});

export default FontLoader;
