import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';

const ConversationsContainer = ({ children }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {children}
      </ScrollView>
    </View>
  );
};

export default ConversationsContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up all available space
  },
  scrollView: {
    // Optional: you can add a background color or other styles here
  },
});
