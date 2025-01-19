import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
import SearchBar from './components/SearchBar';
import FilterButton from './order/FilterButton';

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

    // WEBSOCKET
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
 
    // ROUTE CHECK
    if (authState.token == null || !authState.isAuthenticated) {
        return <Redirect href="/auth" />;
    }

    // SEARCH BAR 
    const [query, setQuery] = useState("");
    const filteredPropositions = chatState.propositions.filter((proposition) =>
        (proposition.name + " " + proposition.surname).toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredConversations = chatState.conversations.filter((conversation) =>
        (conversation.name + " " + conversation.surname).toLowerCase().includes(query.toLowerCase())
    );

    //FILTER BUTTON
    const filterStatesNumbers = [0,1,2,3]
    const filterStates = ["all", "done", "shootings", "conversations"];
    const [filterState, setFilterState] = useState(filterStatesNumbers[0])


    return (
        <>
        {chatState.currentChat.id && <Chat/>}

        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <CompanyLogo size={30} />
            </View>

            {/* Line + Title (USER CHAT)*/}
            {!photographerState.isPhotographer && <View style={styles.lineCenter}>
               
                <Text style={styles.title}>{t('chat')}</Text>
                <View style={styles.line}></View>
            </View>}

            {/* DASHBOARD (PHOTOGRAPHER CHAT)*/}
            {photographerState.isPhotographer && <PhotographerDashboard/>}

            {/* SEARCH BAR */}
            <View style={styles.filterZone}>
                {chatState.conversations.length !== 0 && chatState.propositions.length !== 0 && <SearchBar query={query} setQuery={setQuery}/>              }
                {chatState.conversations.length === 0 && chatState.propositions.length === 0 && (
                    <View style={styles.inviteContainer}>
                        <Text style={styles.inviteText}>{t('reachOutMessage')}</Text>
                    </View>
                )}
                {chatState.conversations.length !== 0 && chatState.propositions.length !== 0 && <FilterButton state={filterState} setState={setFilterState}/>}
            </View>
            
            

            {/* Main Container */}
                {<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                    {/* Propositions Container */}
                    <PropositionsContainer>
                        {filteredPropositions && filterState !== 3 && 
                            [
                                // First map over active propositions if the state is 0 or 2
                                ...(filterState === 0 || filterState === 2 
                                    ? filteredPropositions.filter(proposition => proposition.isActive) 
                                    : []),
                                
                                // Then map over inactive propositions if the state is 0 or 1
                                ...(filterState === 0 || filterState === 1 
                                    ? filteredPropositions.filter(proposition => !proposition.isActive) 
                                    : [])
                            ].map((proposition) => (
                                <PropositionBox
                                    key={proposition.id + proposition.name}
                                    id={proposition.id}
                                    name={proposition.name + " " + proposition.surname}
                                    distance={proposition.distance}
                                    lastmessage={proposition.lastMessage}
                                    date={proposition.date}
                                    hour={proposition.hour}
                                    location={proposition.location}
                                    isActive={proposition.isActive}
                                />
                            ))
                        }
                    </PropositionsContainer>

                    {/* Conversations Container */}
                    <ConversationContainer>
                        {filterState !== 1 && filterState !== 2 && filteredConversations.map((conversation) => {
                            return (
                                <ChatBox
                                    key={conversation.id + conversation.name}
                                    id={conversation.id}
                                    name={conversation.name + " " + conversation.surname}
                                    lastmessage={conversation.lastMessage}
                                    isFile={conversation.isFile}
                                >
                                    <Text>5 stars</Text>
                                </ChatBox>
                            );
                        })}
                    </ConversationContainer>
                </ScrollView>}

            

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
    filterZone : {
        marginTop : 20,
        paddingHorizontal : 20,
        gap : 5,
        justifyContent : 'space-between',
        flexDirection : 'row',
        alignItems : 'center'
    }
    
});
