import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CompanyLogo from '../../../components/elements/companyLogo';
import { Ionicons } from '@expo/vector-icons';
import { t } from "../../../localization";
import { setProposition, setConversation } from '../../../store/chatSlice';
import { Redirect, useRouter } from 'expo-router';
import ConversationContainer from './components/ConversationContainer';
import PropositionsContainer from './components/PropositionsContainer';
import ChatBox from './components/ChatBox';
import PropositionBox from './components/PropositionBox';
import { getUserInteractions } from '../../../services/chat/getUserInteraction';
import { fetchUserInfo } from '../../../services/getUserInfoByTokenRequest';
import WebSocketClient from '../../../services/websocket/chat/chatWebsocket';
import routes from "../../../constants/routes.json";
import Chat from './chat';
import PhotographerDashboard from '../photographers/dashboard/PhotographerDashboard';

const ChatPage = () => {
    const dispatch = useDispatch();
    const chatState = useSelector((state) => state.chat);
    const authState = useSelector((state) => state.auth);
    const photographerState = useSelector((state)=>state.photographer)
    const router = useRouter();
    const wsClientRef = useRef();

    const load = async () => {
        try {
            const userInfo = await fetchUserInfo(authState.token);
            if (userInfo == null) return;
            const userId = photographerState.isPhotographer ? photographerState.isPhotographer : userInfo.userId;
            const data = await getUserInteractions(userId);
            console.log(data);
            dispatch(setProposition(data.propositions));
            dispatch(setConversation(data.conversations));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {

        const connectWebSocket = async () => {
            // Initialize WebSocketClient
            wsClientRef.current = new WebSocketClient(routes.serverUrl); // Replace with your WebSocket URL
            wsClientRef.current.connect(); 
            await wsClientRef.current.connectionPromise;
            console.log('WebSocket client is initialized');
            wsClientRef.current.setOnMessage(async(event) => {
              await load(); 
            });

            load(); 
        };

        connectWebSocket().catch(err => {
            console.error('Error during WebSocket connection:', err);
        });

        // Cleanup on component unmount
        return () => {
            if (wsClientRef.current) {
                wsClientRef.current.close();
            }
        };
    }, []);
 

    if (authState.token == null || !authState.isAuthenticated) {
        return <Redirect href="/auth" />;
    }

    return (
        <>
        {chatState.currentChat.id && <Chat/>}

        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <CompanyLogo size={30} />
                <View style={styles.headerIcons}>
                    <Ionicons name="home-sharp" size={24} color={"black"} onPress={() => { router.replace('/home'); }} />
                </View>
            </View>

            {/* Line + Title (USER CHAT)*/}
            {!photographerState.isPhotographer && <View style={styles.lineCenter}>
               
                <Text style={styles.title}>{t('chat')}</Text>
                <View style={styles.line}></View>
            </View>}

            {/* DASHBOARD (PHOTOGRAPHER CHAT)*/}
            {photographerState.isPhotographer && <PhotographerDashboard/>}

            {chatState.conversations.length === 0 && chatState.propositions.length === 0 && (
                <View style={styles.inviteContainer}>
                    <Text style={styles.inviteText}>{t('reachOutMessage')}</Text>
                </View>
            )}

            {/* Propositions Container */}
            <PropositionsContainer>
                {chatState && chatState.propositions && chatState.propositions.map((proposition) => {
                    return (
                        <PropositionBox
                            key={proposition.id + proposition.name}
                            id={proposition.id}
                            name={proposition.name + " "+ proposition.surname}
                            distance={proposition.distance}
                            lastmessage={proposition.lastMessage}
                            date={proposition.date}
                            hour={proposition.hour}
                            location={proposition.location}
                        />
                    );
                })}
            </PropositionsContainer>

            {/* Conversations Container */}
            <ConversationContainer>
                {chatState && chatState.conversations && chatState.conversations.map((conversation) => {
                    return (
                        <ChatBox key={conversation.id + conversation.name} id={conversation.id} name={conversation.name + " "+ conversation.surname} lastmessage={conversation.lastMessage} isFile={conversation.isFile}>
                            <Text>5 stars</Text>
                        </ChatBox>
                    );
                })}
            </ConversationContainer>

            

        </View>
        </>
    );
}

export default ChatPage;

const styles = StyleSheet.create({
    container: {
      backgroundColor : '#fff',
        fontFamily: 'Satoshi-Black',
        flex: 1,
    },
    header: {
        marginTop: 60,
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    lineCenter: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    line: {
        width: '85%',
        height: 4,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Satoshi-Black',
        textAlign: 'left',
        width: '85%',
        marginBottom: 5,
    },
    sendText: {
        fontSize: 16,
        color: 'blue',
    },
    input: {
        width: '85%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        paddingHorizontal: 10,
    },
    sendButton: {
        backgroundColor: 'blue',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    inviteContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    
    inviteText: {
        fontSize: 18,
        fontFamily: 'Satoshi-Light', // Use Satoshi Light for this text
        color: 'gray', // You can adjust this color as needed
        textAlign: 'center',
        paddingHorizontal: 20, // Optional: Add padding for better readability
    },
    
});
