import { StyleSheet, Text, View, ScrollView, TextInput, PanResponder, TouchableOpacity, Alert, Animated, KeyboardAvoidingView, Platform , Keyboard} from 'react-native';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchPhotographerById } from '../../../services/getPhotographers/getPhotographerById';
import useSwipeAnimation from '../../../helpers/animations/useSwipeAnimation';

const Chat = () => {
    const dispatch = useDispatch();
    const router = useRouter()

    // states 
    const [conversation, setConversation] = useState(null);
    const [isProposition, setIsProposition] = useState(false);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [propositionPanelOn, setPropositionPanelOn] = useState(false);
    const [proposition, setProposition] = useState({ location: "", date: "", hour: "" });
    const [showPropositionInterface, setShowPropositionInterface] = useState(false);
    // refs
    const chatRef = useRef(null);
    // stores 
    const chatState = useSelector((state) => state.chat);
    const authState = useSelector((state) => state.auth);
    const photographerState = useSelector((state)=> state.photographer)

    // LOAD THE CONTENT
    const initializeChat = async (chatState, photographerState, authState, setUserId, setConversation, setIsProposition, chatRef) => {
        try {
            // Fetch user ID
            if (photographerState.isPhotographer) {
                setUserId(photographerState.isPhotographer);
            } else {
                const data = await fetchUserInfo(authState.token);
                setUserId(data.userId);
            }
    
            // Find the current conversation
            const conversation = 
                findConv(chatState.conversations, chatState.currentChat.id) || 
                findConv(chatState.propositions, chatState.currentChat.id);
    
            if (conversation) {
                setConversation(conversation);
                setIsProposition(chatState.propositions.includes(conversation));
    
                // Scroll to the bottom to show the latest messages
                setTimeout(() => {
                    if (chatRef.current) {
                        chatRef.current.scrollToEnd({ animated: false });
                    }
                }, 100); // Adjust the delay as needed
            }
        } catch (error) {
            console.error("Error initializing chat:", error);
        }
    };

    useEffect(() => {
        initializeChat(chatState, photographerState, authState, setUserId, setConversation, setIsProposition, chatRef);
    }, [chatState]);

    // Redirect to home and force update when the payment was succesful - Use `useFocusEffect` to trigger the refreshWebSocket when the page is focused
    useFocusEffect(
        React.useCallback(() => {
            const initialize = async () => {
                console.log("refresh websocket");
                await initializeChat(chatState, photographerState, authState, setUserId, setConversation, setIsProposition, chatRef);
            };
            initialize(); // Call the async function inside the effect
        }, [chatState, photographerState, authState])
    );

    // ANIMATION SECTION
    const fadeAnim = useRef(new Animated.Value(0)).current; // Controls opacity
    const translateXAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    // PanResponder to detect swipe gestures => CLOSE on swipe
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (_, gestureState) => {
                // Allow responder only if the touch starts near the left edge (e.g., within 20 pixels)
                return gestureState.moveX < 20;
            },
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to horizontal swipes
                return gestureState.dx > 20;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0) {
                    // Dragging to the right; animate the slide
                    translateXAnim.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > 150) {
                    // Close chat if swiped far enough
                    handleCloseChat();
                } else {
                    // Reset animation if swipe is too short
                    Animated.timing(translateXAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Fade in effect 
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
    
    // Handle Close Chat
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

    

    // Send message OR proposition
    const handleSend = async () => {
        if (!message && !conversation) return
     
        const conversationId = isProposition ? conversation.conversation_id : conversation.id;
    
        // Check if all proposition data is provided, and handle sending messages accordingly
        if (proposition.location && proposition.date && proposition.hour) {
            if (isProposition) {
                Alert.alert(t("youcannotoverrideproposition"));
                setPropositionPanelOn(false);
            } else {
                // RESET
                setProposition({ location: "", date: "", hour: "" });
                setPropositionPanelOn(false);
                // Send the proposition 
                await sendPropositionToConversation(conversation.p2_id, "proposition", proposition.date, proposition.hour, proposition.location, Date.now(), conversationId);
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
        // change the proposition in chat state 
        console.log('Validation function triggered');
        if (!conversation) return;
        if(!showPropositionInterface) return
        const photographersInfo = await fetchPhotographerById(conversation.p2_id)
        const photographerProfilePicture = JSON.stringify(photographersInfo.photographer.profile_picture)
        console.log(JSON.parse(photographerProfilePicture))
        setShowPropositionInterface(false)
        router.push({
                pathname: '/payment',
                params: {
                  conversationId : showPropositionInterface.conversationId,
                  date : showPropositionInterface.date,
                  hour : showPropositionInterface.hour, 
                  location : showPropositionInterface.location,
                  // it's always the client who's supposed to validate and pay
                  userId : showPropositionInterface.conversation.p1_id,
                  photographerInfo : JSON.stringify(photographersInfo),
                  photographerProfilePicture : photographerProfilePicture,
                  chatId : chatState.currentChat.id,
                  personalIdInChat : showPropositionInterface.personalIdInChat,
                  timeStamp : showPropositionInterface.timeStamp,
                  photographerId : showPropositionInterface.conversation.p2_id
                }
              });
       
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
                <Animated.View
                    style={[styles.chatContainer, { opacity: fadeAnim, transform: [{ translateX: translateXAnim }] }]}
                    {...panResponder.panHandlers} // Attach PanResponder to this view
                >
                    <View style={styles.container}>
                    <KeyboardAvoidingView
                        style={styles.keyboard}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                    >

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
                        <ScrollView style={styles.chatBody}  ref={chatRef}>
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
                        <View style={[styles.inputContainer]}>
                            {photographerState.isPhotographer && <TouchableOpacity style={styles.propositionbutton} onPress={() => setPropositionPanelOn(prev => !prev)}>
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


                        </KeyboardAvoidingView>
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
    keyboard: {
        flex: 1,
        marginBottom : 20,
    },
    container : {
        marginTop : 40,
        flex : 1,
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
        paddingHorizontal: 30,
        paddingVertical : 30,
        marginBottom: 20,
        marginHorizontal : 20,
        backgroundColor: '#235775', // Ensure background is set for shadow visibility
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 7 }, // Shift shadow downward for iOS
        shadowOpacity: 0.3, // Shadow transparency for iOS
        shadowRadius: 3, // Blur radius for iOS
        elevation: 4, // Shadow height for Android
        borderRadius: 50, // Optional: softens edges
    },
    headerText: {
        fontSize: 14,
        fontFamily: 'Satoshi-Medium',
        color: 'white',
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
