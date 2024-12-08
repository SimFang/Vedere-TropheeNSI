import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { t } from "../../../../localization";
import { createProposition } from '../../../../services/chat/createProposition';
import { useSelector } from 'react-redux';
import { updatePropositionStatusInChat } from '../../../../services/chat/updatePropositionStatus';
import NewPropositionInterface from './NewPropositionInterface';

const PropositionTextBox = ({ date, hour, location, isMe, status, timeStamp, conversation, personalIdInChat, conversationId, onPress }) => {
    return (
        <>
        <TouchableOpacity onPress={()=>{
            onPress({
                date : date, 
                hour : hour, 
                location : location, 
                isMe : isMe,
                status : status,
                timeStamp : timeStamp, 
                conversation : conversation,
                personalIdInChat : personalIdInChat,
                conversationId : conversationId
            })
        }}>
        <View style={[
            styles.borderContainer,
            isMe ? styles.rightAlign : styles.leftAlign,
            status === -1 && styles.lowerOpacity,
            status === 1 && styles.approvedContainer
        ]}>
            <View style={[styles.innerContainer, status === 1 && styles.approvedInnerContainer]}>
                <Text style={[styles.headerText, status === 1 && styles.approvedText]}>{t('hihereismyproposition')}</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={24} color={status === 1 ? 'white' : 'black'} />
                    <Text style={[styles.text, status === 1 && styles.approvedText]}>{location}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={24} color={status === 1 ? 'white' : 'black'} />
                    <Text style={[styles.text, status === 1 && styles.approvedText]}>{date}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="time-outline" size={24} color={status === 1 ? 'white' : 'black'} />
                    <Text style={[styles.text, status === 1 && styles.approvedText]}>{hour}</Text>
                </View>
            </View>
        </View>
        </TouchableOpacity>
        </>
    );
}

export default PropositionTextBox;

const styles = StyleSheet.create({
    borderContainer: {
        marginTop: 10,
        maxWidth: '60%',
        overflow: 'hidden', // To ensure the border radius is applied
    },
    innerContainer: {
        borderWidth: 3,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 15,
        paddingHorizontal: 25,
    },
    approvedInnerContainer: {
        backgroundColor: 'black',
    },
    headerText: {
        fontSize: 13,
        marginBottom: 15,
        fontFamily: 'Satoshi-Medium',
        color: 'black', // Set text color to black
    },
    approvedText: {
        color: 'white', // Change text color to white when approved
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5, // Reduced gap between inputs
    },
    text: {
        fontFamily: 'Satoshi-Light',
        fontSize: 12,
        color: 'black', // Set text color to black
        flex: 1,
        paddingHorizontal: 10,
    },
    leftAlign: {
        alignSelf: 'flex-start', // Align left if not "me"
    },
    rightAlign: {
        alignSelf: 'flex-end', // Align right if "me"
    },
    lowerOpacity: {
        opacity: 0.2, // Lower the opacity for status -1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acceptButton: {
        backgroundColor: 'black', // Green color for accept button
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    declineButton: {
        backgroundColor: '#6f1d1b', // Red color for decline button
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Satoshi-Medium',
    },
});
