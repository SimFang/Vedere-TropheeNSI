import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert, Animated, Keyboard } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from "../../../localization";
import { clearCurrentChat } from '../../../store/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { findConv } from '../../../helpers/chat/findConv';
import TextBox from './components/TextBox';
import { fetchUserInfo } from '../../../services/getUserInfoByTokenRequest';
import { sendMessageToConversation } from '../../../services/chat/sendMessageToConversation';
import MakePropositionPanel from './components/MakePropositionPanel';
import { sendPropositionToConversation } from '../../../services/chat/sendPropositionToConversation';
import PropositionTextBox from './components/PropositionTextBox';

const Chat = () => {
    const dispatch = useDispatch();
    const [conversation, setConversation] = useState(null);
    const [isProposition, setIsProposition] = useState(false);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [propositionPanelOn, setPropositionPanelOn] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [proposition, setProposition] = useState({ location: "", date: "", hour: "" });

    const chatState = useSelector((state) => state.chat);
    const authState = useSelector((state) => state.auth);
    const photographerState = useSelector((state)=> state.photographer)

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const requestUserId = async () => {
            if(photographerState.isPhotographer){
                setUserId(photographerState.isPhotographer);
            } else {
                const data = await fetchUserInfo(authState.token);
                setUserId(data.userId);
            }
        };

        const conversation = findConv(chatState.conversations, chatState.currentChat.id) || 
                            findConv(chatState.propositions, chatState.currentChat.id);
        console.log('below are the propositions')
        console.log(chatState.propositions)
        if (conversation) {
            setConversation(conversation);
            setIsProposition(chatState.propositions.includes(conversation));
            console.log(conversation);
        }
        
        requestUserId();
    }, [chatState]);

    useEffect(() => {
        if (conversation) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [conversation]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSend = async () => {
        if (!conversation) return;

        const conversationId = isProposition ? conversation.conversation_id : conversation.id;

        if (proposition.location && proposition.date && proposition.hour) {
            if (isProposition) {
                Alert.alert(t("youcannotoverrideproposition"));
                setPropositionPanelOn(false);
            } else {
                await sendPropositionToConversation(userId, "proposition", proposition.date, proposition.hour, proposition.location, Date.now(), conversationId);
                setProposition({ location: "", date: "", hour: "" });
                setPropositionPanelOn(false);
            }
            return;
        } else {
            await sendMessageToConversation(userId, "message", message, Date.now(), conversationId);
            setMessage('');
            return;
        }
    };

    return (
        <>
            {conversation && (
                <Animated.View style={[styles.chatContainer, { opacity: fadeAnim }]}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>{`${conversation.name} ${conversation.surname}`}</Text>
                            <TouchableOpacity onPress={() => dispatch(clearCurrentChat())}>
                                <Ionicons name="close-sharp" size={30} color={"black"} />
                            </TouchableOpacity>
                        </View>

                        {/* Line + Title */}
                        <View style={styles.lineCenter} />

                        {/* Chat Header with three text elements horizontally */}
                        {isProposition && (
                            <View style={styles.chatHeader}>
                                <Text style={styles.headerText}>{conversation.date}</Text>
                                <Text style={styles.headerText}>{conversation.hour}</Text>
                                <Text style={styles.headerText}>{conversation.location}</Text>
                            </View>
                        )}

                        {/* Scrollable Chat */}
                        <ScrollView style={styles.chatBody}>
                            {conversation.chat && Object.entries(conversation.chat).map(([key, msg]) => (
                                msg.type === "message" ? (
                                    <TextBox 
                                        key={key}
                                        content={msg.content} 
                                        isMe={userId === msg.sender} 
                                        timeStamp={msg.timeStamp} 
                                    />
                                ) : msg.type === "proposition" ? (
                                    <PropositionTextBox 
                                        key={key}
                                        date={msg.date} 
                                        hour={msg.hour} 
                                        location={msg.location} 
                                        isMe={userId === msg.sender} 
                                        timeStamp={msg.timeStamp} 
                                        status={msg.status} 
                                        conversation={conversation}
                                        personalIdInChat={key} 
                                        conversationId={conversation.id}
                                    />
                                ) : null // Add more conditions as needed
                            ))}
                        </ScrollView>

                        {/* Input field and send button */}
                        {propositionPanelOn && <MakePropositionPanel setProposition={setProposition} />}
                        <View style={[styles.inputContainer, { marginBottom: keyboardVisible ? 280 : 5 }]}>
                            <TouchableOpacity style={styles.propositionbutton} onPress={() => setPropositionPanelOn(prev => !prev)}>
                                <Ionicons name="add-sharp" color={"#327EA8"} size={20} />
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Type a message..."
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Ionicons name="send-sharp" color={"white"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            )}
        </>
    );
};

export default Chat;

const styles = StyleSheet.create({
    chatContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        width: "100%",
        height: Dimensions.get('window').height * 0.95,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    header: {
        marginTop: 60,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lineCenter: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Satoshi-Black',
        textAlign: 'left',
        width: '85%',
        marginBottom: 5,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    headerText: {
        fontSize: 14,
        fontFamily: 'Satoshi-Medium',
        color: 'black',
    },
    chatBody: {
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "#D5D5D5",
        borderRadius: 25,
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontFamily: 'Satoshi-Regular',
    },
    sendButton: {
        backgroundColor: '#327EA8',
        borderRadius: 200,
        padding: 10,
        marginLeft: 10,
    },
    propositionbutton: {
        marginRight: 10,
    },
});
