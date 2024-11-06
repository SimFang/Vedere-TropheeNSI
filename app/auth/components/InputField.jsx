import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputField = ({
  placeholder = "",
  value = "",
  onChangeText = () => {},
  secureTextEntry = false,
  keyboardType = "default",
  width = "100%",
  rounded = true // Add rounded prop with default value
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, { width }]}>
      <TextInput
        style={[
          styles.input,
          { borderRadius: rounded ? 50 : 12 } // Adjust border radius based on rounded prop
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        keyboardType={keyboardType}
        placeholderTextColor="#aaa"
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
          <Ionicons name={isSecure ? 'eye-off' : 'eye'} size={24} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 40,
    paddingVertical: 15,
    fontFamily: 'Satoshi-Light',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
});
