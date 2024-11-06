import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingBox = ({ children, title, text, url }) => {
  const router = useRouter();

  const handleBoxClick = (url) => {
    if (url) {
        if (typeof url === 'function') {
            url(); // Call the function if url is a function
        } else {
            router.push(url); // Push the URL if it's not a function
        }
    }
};

  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      handleBoxClick(url)
    }}>
      <View style={styles.leftSection}>
        {children}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#BFBFBF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical : 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: '#BFBFBF',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
});

export default SettingBox;
