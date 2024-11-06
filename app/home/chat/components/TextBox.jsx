import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const TextBox = ({ content, isMe, timeStamp }) => {
  return (
    <View style={[styles.container, isMe ? styles.me : styles.other]}>
      <Text style={styles.message}>{content}</Text>
      <Text style={styles.timestamp}>{timeStamp}</Text>
    </View>
  );
};

export default TextBox;

const styles = StyleSheet.create({
  container: {
    maxWidth: '60%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  me: {
    backgroundColor: '#F0F0F0', // Light green for my messages
    alignSelf: 'flex-end', // Aligns to the right
  },
  other: {
    backgroundColor: '#F0F0F0', // Light gray for other messages
    alignSelf: 'flex-start', // Aligns to the left
  },
  message: {
    fontFamily : 'Satoshi-Medium',
    fontSize: 13,
    color: '#333',
  },
  timestamp: {
    fontSize: 8,
    color: '#888',
    alignSelf: 'flex-end', // Aligns timestamp to the right side of the message box
    marginTop: 5,
  },
});
