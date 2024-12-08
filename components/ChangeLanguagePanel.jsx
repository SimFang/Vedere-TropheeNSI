import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { setLanguage } from '../store/authSlice';
import { setIndexLanguage } from '../localization';
import availablelanguages from '../localization/availableLanguages.json';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ChangeLanguagePanel = () => {
  const dispatch = useDispatch();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const scale = useSharedValue(0);

  const changeLanguage = (lang) => {
    if (!availablelanguages.languages.includes(lang)) return;
    dispatch(setLanguage(lang));
    setIndexLanguage(lang);
    closePanel();
  };

  const openPanel = () => {
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
  };

  const closePanel = () => {
    scale.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
    opacity: scale.value,
  }));

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.icon} onPress={openPanel}>
        <Ionicons name="globe-outline" size={30} color="white" />
      </TouchableOpacity>

      {isPanelOpen && (
        <Animated.View style={[styles.container, animatedStyle]}>
          <Text style={styles.title}>Change Language</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => changeLanguage('en')}>
              <Text style={styles.buttonText}>🇬🇧 English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => changeLanguage('fr')}>
              <Text style={styles.buttonText}>🇫🇷 Français</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closePanel}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default ChangeLanguagePanel;

const styles = StyleSheet.create({
  icon: { 
    marginRight: 30,
  },
  root: {
    position: 'absolute',
    zIndex: 2,
    top: 50,
    right: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width,
    height,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    fontFamily: 'Satoshi',
  },
  buttonContainer: {
    flexDirection: 'column', // Arrange languages in a column
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Satoshi',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
});