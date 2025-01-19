import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Using icons for the search, notification
import { useRouter } from 'expo-router';
import {t} from "../../../localization"


// SEARCH ZONE COMPONENT HAS NOTHING TO DO THERE, it should be in /home/(components)

const SearchZone = ({url = "/home/photographers/filters", isText = true, myFunc = ()=>{}}) => {
  const router = useRouter()
  // Define animated values for each circle
  const borderOpacity1 = useRef(new Animated.Value(0)).current;
  const borderOpacity2 = useRef(new Animated.Value(0)).current;
  const borderOpacity3 = useRef(new Animated.Value(0)).current;
  const borderOpacity4 = useRef(new Animated.Value(0)).current;

  // Function to animate the opacity loop
  const animateBorderOpacity = (animatedValue, toValue) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: toValue,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false, // `borderColor` doesn't support native driver
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBorderOpacity(borderOpacity1, 0.3);
    animateBorderOpacity(borderOpacity2, 0.5);
    animateBorderOpacity(borderOpacity3, 0.6);
    animateBorderOpacity(borderOpacity4, 0.7);
  }, []);

  return (
    <View style={styles.searchContainer} >
      {isText && <Text style={styles.searchTitle}>{t('findsomeone')}</Text>}

      <Animated.View
        style={[
          styles.circle,
          {
            height: 290,
            width: 290,
            borderColor: borderOpacity1.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.075)'],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.circle,
            {
              height: 245,
              width: 245,
              borderColor: borderOpacity2.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.15)'],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.circle,
              {
                height: 200,
                width: 200,
                borderColor: borderOpacity3.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.3)'],
                }),
              },
            ]}
          >
            <Animated.View
              style={[
                styles.circle,
                {
                  height: 160,
                  width: 160,
                  borderColor: borderOpacity4.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)'],
                  }),
                },
              ]}
            >
              <TouchableOpacity style={styles.searchButton} onPress={url?()=>{router.push(url)}:()=>{myFunc()}}>
                <Ionicons name="search" size={50} color="black" />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default SearchZone;

const styles = StyleSheet.create({
  circle: {
    borderRadius: 200, // Keep this to ensure the element is a circle
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // Define the border thickness
  },
  searchContainer: {
    height: '40%',
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  searchTitle: {
    position : 'absolute',
    zIndex : 2,
    top : 20,
    left :20,
    fontFamily : 'Satoshi-Black',
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
