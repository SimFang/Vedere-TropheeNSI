import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';  
import { Ionicons } from '@expo/vector-icons';

const DownloadButton = ({ imageUrl }) => {

  const handleCopyLink = async () => {
  };

  return (
    <TouchableOpacity
      style={{
        position : 'absolute',
        bottom : 20,
        borderWidth : 0.2, 
        borderColor : 'white',
        borderRadius : 20,
        padding: 10,
        paddingHorizontal : 30,
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Center vertically
      }}
      onPress={handleCopyLink}
    >
      <Ionicons name="clipboard" size={20} color="white" style={{ marginRight: 5 }} /> {/* Changed to clipboard icon */}
      <Text style={{ color: 'white', fontSize: 16 }}>Copy download link</Text>
    </TouchableOpacity>
  );
};

export default DownloadButton;