// FooterComponent.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure Ionicons is imported
import { t } from '../../../../localization';

const { height } = Dimensions.get('window');

const FooterMessage = () => {
    return (
        <View style={styles.footerContainer}>
            <Ionicons name="sad-outline" size={48} color="white" />
            <Text style={styles.boldText}>{t('noPhotographersTitle')}</Text> 
            <Text style={styles.descriptionText}>{t('noPhotographersDescription')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        padding: 30,
        height: height, // Set footer height to screen height
        backgroundColor: 'black', // Footer background color
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        gap : 20,
    },
    boldText: {
        color: 'white', // Bold text color
        fontSize: 20,
        fontFamily: 'Satoshi-Bold', // Use the imported Satoshi-Bold font
        marginTop: 10, // Add margin for spacing
    },
    descriptionText: {
        color: 'white', // Regular text color
        fontSize: 16,
        fontFamily: 'Satoshi-Regular', // Use the regular Satoshi font
        textAlign: 'center', // Center align the text
        marginTop: 5, // Add margin for spacing
    },
});

export default FooterMessage;
