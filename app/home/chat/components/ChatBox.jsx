import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCurrentChatId } from '../../../../store/chatSlice';

const ChatBox = ({ name = "", lastmessage = "", isFile = false, id, children }) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(setCurrentChatId(id));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastmessage}>{lastmessage}</Text>
      </View>
      <View style={styles.right}>
        {children}
        {isFile ? (
          <Ionicons style={styles.icon} name="eye-sharp" size={25} color="#000" />
        ) : (
          <Ionicons style={styles.icon} name="time-sharp" size={25} color="#000" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  left: {
    width: "50%",
    gap: 5,
  },
  right: {
    gap: 5,
  },
  name: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
  },
  lastmessage: {
    fontSize: 12,
    fontFamily: 'Satoshi-Bold',
    color: "#ACACAC",
  },
  icon: {
    marginLeft: 10,
    opacity: 0.2,
  },
});
