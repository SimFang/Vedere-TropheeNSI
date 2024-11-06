import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { t } from "../../../../localization";
import { createProposition } from '../../../../services/chat/createProposition';
import { useSelector } from 'react-redux';
import { updatePropositionStatusInChat } from '../../../../services/chat/updatePropositionStatus';

const PropositionTextBox = ({ date, hour, location, isMe, timeStamp, status, conversation, personalIdInChat, conversationId }) => {
    const chatState = useSelector((state)=>state.chat)
    
    const handleValidation = async() => {
        // create the proposition
        console.log(timeStamp)
        await updatePropositionStatusInChat(conversationId, personalIdInChat, 1, timeStamp )
        await createProposition(chatState.currentChat.id, date, hour, location, true, false, conversation.p1_id, conversation.p2_id, "0", 1 )
        // change the proposition in chat state 

        console.log('Validation function triggered');
    };

    const handleDecline = async() => {
        // Function to handle decline logic
        await updatePropositionStatusInChat(conversationId, personalIdInChat, -1,  )
        console.log('Decline function triggered');
    };

    return (
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

                {status === 0 && !isMe && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleValidation}>
                            <Text style={styles.buttonText}>{t('accept')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                            <Text style={styles.buttonText}>{t('decline')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
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
