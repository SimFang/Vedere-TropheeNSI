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
import NewPropositionInterface from './components/NewPropositionInterface';
import { createProposition } from '../../../services/chat/createProposition';
import { updatePropositionStatusInChat } from '../../../services/chat/updatePropositionStatus';
import { setDisplayedOrder } from '../../../store/photographerSlice';
import { useRouter } from 'expo-router';
import { fetchPhotographerById } from '../../../services/getPhotographers/getPhotographerById';

const Chat = () => {
    const dispatch = useDispatch();
    const router = useRouter()
    const [conversation, setConversation] = useState(null);
    const [isProposition, setIsProposition] = useState(false);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [propositionPanelOn, setPropositionPanelOn] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [proposition, setProposition] = useState({ location: "", date: "", hour: "" });

    const [showPropositionInterface, setShowPropositionInterface] = useState(false);

    const chatState = useSelector((state) => state.chat);
    const authState = useSelector((state) => state.auth);
    const photographerState = useSelector((state)=> state.photographer)

    // LOAD THE CONTENT
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

    // ANIMATION SECTION
    const fadeAnim = useRef(new Animated.Value(0)).current; // Controls opacity
    const translateXAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

    useEffect(() => {
        if (conversation) {
            // Slide in from the right and fade in
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(translateXAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [conversation]);
    
    const handleCloseChat = () => {
        // Slide out to the left and fade out
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
                toValue: Dimensions.get('window').width,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Clear chat state after animation
            dispatch(clearCurrentChat());
        });
    };

    // KEYBOARD 

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
    
        // Extract all the necessary variables
        const propositionData = isProposition ? {
            location: proposition.location,
            date: proposition.date,
            hour: proposition.hour
        } : null;
    
        const messageData = !isProposition ? {
            message: message,
        } : null;
    
        // Check if all proposition data is provided, and handle sending messages accordingly
        if (proposition.location && proposition.date && proposition.hour) {
            if (isProposition) {
                Alert.alert(t("youcannotoverrideproposition"));
                setPropositionPanelOn(false);
            } else {
                // get informations about the photographers 
                const photographersInfo = await fetchPhotographerById(conversation.p2_id)
                // Navigate to the /payment route with the necessary data
                setProposition({ location: "", date: "", hour: "" });
                setPropositionPanelOn(false);
                router.push({
                    pathname: '/payment',
                    params: {
                      conversationId,
                      date : proposition.date,
                      hour : proposition.hour, 
                      location : proposition.location,
                      userId : userId,
                      photographerInfo : JSON.stringify(photographersInfo)
                    }
                  });
                
            }
    
            
            
            return;
        } else {
            await sendMessageToConversation(userId, "message", message, Date.now(), conversationId);
            setMessage('');
            return;
        }
    };

    // ORDER VALIDATION & VISUALISATION 
    const handleShowProposition = (prop) => {
        setShowPropositionInterface(prop);
    };

    const handleValidation = async() => {
        // create the proposition
        if(!showPropositionInterface) return
        await updatePropositionStatusInChat(showPropositionInterface.conversationId, showPropositionInterface.personalIdInChat, 1, showPropositionInterface.timeStamp )
        await createProposition(chatState.currentChat.id, showPropositionInterface.date, showPropositionInterface.hour, showPropositionInterface.location, true, false, showPropositionInterface.conversation.p1_id, showPropositionInterface.conversation.p2_id, "0", 1 )
        // change the proposition in chat state 
        console.log('Validation function triggered');
        setShowPropositionInterface(false)
    };

    const handleDecline = async() => {
        if(!showPropositionInterface) return
        // Function to handle decline logic
        await updatePropositionStatusInChat(showPropositionInterface.conversationId, showPropositionInterface.personalIdInChat, -1,  )
        console.log('Decline function triggered');
        setShowPropositionInterface(false)
    };

    const redirectToOrderVisualisation = () => {
        dispatch(setDisplayedOrder(conversation.id));
        router.push("/home/chat/order/orderVisualisation");
    }

    return (
        <>
            {showPropositionInterface && <NewPropositionInterface setPropositionPanelOn={setShowPropositionInterface} type={showPropositionInterface.status == 0 && !showPropositionInterface.isMe?"validation":"visualisation"} handleDecline={handleDecline} handleValidation={handleValidation} initialLocation={showPropositionInterface.location} initialDate={showPropositionInterface.date} initialHour={showPropositionInterface.hour}/>  }
            {conversation && (
                <Animated.View style={[styles.chatContainer, { opacity: fadeAnim, transform: [{ translateX: translateXAnim }] }]}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>{`${conversation.name} ${conversation.surname}`}</Text>
                            <TouchableOpacity onPress={handleCloseChat}>
                                <Ionicons name="close-sharp" size={30} color={"black"} />
                            </TouchableOpacity>
                        </View>

                        {/* Line + Title */}
                        <View style={styles.lineCenter} />

                        {/* Chat Header with three text elements horizontally */}
                        {isProposition && (
                            <TouchableOpacity style={styles.chatHeader} onPress={redirectToOrderVisualisation}>
                                <Text style={styles.headerText}>{conversation.date}</Text>
                                <Text style={styles.headerText}>{conversation.hour}</Text>
                                <Text style={styles.headerText}>{conversation.location}</Text>
                                <Ionicons name="chevron-forward" size={24} color="#D3D3D3" style={styles.icon} />
                            </TouchableOpacity>
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
                                                key={key+"Proposition"}
                                                date={msg.date} 
                                                hour={msg.hour} 
                                                location={msg.location} 
                                                isMe={userId === msg.sender} 
                                                timeStamp={msg.timeStamp} 
                                                status={msg.status} 
                                                conversation={conversation}
                                                personalIdInChat={key} 
                                                conversationId={conversation.id}
                                                onPress={handleShowProposition}
                                            />
                                ) : null // Add more conditions as needed
                            ))}
                        </ScrollView>

                        {/* Input field and send button */}
                        {propositionPanelOn && <MakePropositionPanel setProposition={setProposition} setPropositionPanelOn={setPropositionPanelOn} handleSend={handleSend}/>}
                        <View style={[styles.inputContainer, { marginBottom: keyboardVisible ? 280 : 5 }]}>
                            {!photographerState.isPhotographer && <TouchableOpacity style={styles.propositionbutton} onPress={() => setPropositionPanelOn(prev => !prev)}>
                                <Ionicons name="add-sharp" color={"#327EA8"} size={20} />
                            </TouchableOpacity>}
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
        paddingBottom: 30,
        marginBottom: 5,
        backgroundColor: '#fff', // Ensure background is set for shadow visibility
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 7 }, // Shift shadow downward for iOS
        shadowOpacity: 0.2, // Shadow transparency for iOS
        shadowRadius: 3, // Blur radius for iOS
        elevation: 4, // Shadow height for Android
        borderRadius: 10, // Optional: softens edges
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
